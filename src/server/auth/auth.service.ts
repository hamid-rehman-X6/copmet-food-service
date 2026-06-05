import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { errors } from "@/server/api/errors";
import {
  createRefreshSession,
  createUser,
  findRefreshSession,
  findUserByEmail,
  findUserById,
  markUserLogin,
  revokeRefreshFamily,
  revokeRefreshSession,
  toAuthUser,
} from "@/server/auth/auth.repository";
import { authTokenTtl } from "@/server/auth/auth.constants";
import type { AuthTokens } from "@/server/auth/cookies";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "@/server/auth/tokens";
import { transaction } from "@/server/db/pool";
import type { LoginInput, SignupInput } from "@/schemas/auth.schemas";
import type { AuthUser } from "@/types/auth.types";

type RequestContext = {
  userAgent: string | null;
  ipAddress: string | null;
};

type AuthResult = {
  user: AuthUser;
  tokens: AuthTokens;
};

async function createTokenSession(
  user: AuthUser,
  input: {
    familyId?: string;
    rememberMe: boolean;
    context: RequestContext;
    executor?: PoolClient;
  },
) {
  const sessionId = randomUUID();
  const familyId = input.familyId ?? randomUUID();
  const refreshExpiresIn = input.rememberMe
    ? authTokenTtl.rememberedRefreshSeconds
    : authTokenTtl.refreshSeconds;
  const refreshToken = await signRefreshToken({
    userId: user.id,
    sessionId,
    familyId,
    expiresIn: refreshExpiresIn,
  });

  await createRefreshSession(
    {
      id: sessionId,
      familyId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      rememberMe: input.rememberMe,
      expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      userAgent: input.context.userAgent,
      ipAddress: input.context.ipAddress,
    },
    input.executor,
  );

  return {
    sessionId,
    tokens: {
      accessToken: await signAccessToken(user),
      refreshToken,
      refreshExpiresIn,
      rememberMe: input.rememberMe,
    } satisfies AuthTokens,
  };
}

export async function signup(input: SignupInput, context: RequestContext): Promise<AuthResult> {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw errors.conflict("An account with this email address already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  return transaction(async (client) => {
    const userRow = await createUser(
      {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
      },
      client,
    );
    const user = toAuthUser(userRow);
    const { tokens } = await createTokenSession(user, { rememberMe: false, context, executor: client });

    return { user, tokens };
  });
}

export async function login(input: LoginInput, context: RequestContext): Promise<AuthResult> {
  const userRow = await findUserByEmail(input.email);

  if (!userRow || !(await verifyPassword(input.password, userRow.password_hash))) {
    throw errors.unauthorized("The email address or password is incorrect.");
  }

  if (!userRow.is_active) {
    throw errors.forbidden("This account has been disabled.");
  }

  const user = toAuthUser(userRow);
  const { tokens } = await createTokenSession(user, { rememberMe: input.rememberMe, context });
  await markUserLogin(user.id);

  return { user, tokens };
}

export async function refresh(refreshToken: string, context: RequestContext): Promise<AuthResult> {
  const payload = await verifyRefreshToken(refreshToken);
  const presentedHash = hashToken(refreshToken);

  const result = await transaction<AuthResult | null>(async (client) => {
    const session = await findRefreshSession(payload.sessionId, client, true);

    // A signed refresh token that no longer matches its server-side session can
    // indicate replay. Revoke the entire rotation family before rejecting it.
    if (
      !session ||
      session.family_id !== payload.familyId ||
      session.user_id !== payload.userId ||
      session.token_hash !== presentedHash ||
      session.revoked_at ||
      session.expires_at.getTime() <= Date.now()
    ) {
      await revokeRefreshFamily(payload.familyId, client);
      return null;
    }

    const userRow = await findUserById(payload.userId, client);

    if (!userRow || !userRow.is_active) {
      await revokeRefreshFamily(payload.familyId, client);
      return null;
    }

    const user = toAuthUser(userRow);
    const { sessionId: replacementId, tokens } = await createTokenSession(user, {
      familyId: payload.familyId,
      rememberMe: session.remember_me,
      context,
      executor: client,
    });

    await revokeRefreshSession(session.id, replacementId, client);

    return { user, tokens };
  });

  if (!result) {
    throw errors.unauthorized("Your session is no longer valid. Please sign in again.");
  }

  return result;
}

export async function logout(refreshToken?: string) {
  if (!refreshToken) {
    return;
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);
    await revokeRefreshSession(payload.sessionId);
  } catch {
    // Logout remains idempotent even if the cookie has already expired.
  }
}

export async function getUserById(userId: string) {
  const user = await findUserById(userId);

  if (!user || !user.is_active) {
    throw errors.unauthorized("Your account is no longer available.");
  }

  return toAuthUser(user);
}
