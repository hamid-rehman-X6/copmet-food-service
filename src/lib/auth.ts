// NextAuth configuration for admin credentials authentication.
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminLoginSchema } from "@/schemas/auth.schema";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
          return null;
        }

        return {
          id: "admin-1",
          email: env.ADMIN_EMAIL,
          name: "Admin User",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
};
