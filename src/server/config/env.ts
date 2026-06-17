const MIN_SECRET_LENGTH = 32;

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function secret(name: string) {
  const value = required(name);

  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(`${name} must contain at least ${MIN_SECRET_LENGTH} characters.`);
  }

  return value;
}

export const env = {
  get database() {
    return {
      host: required("DB_HOST"),
      port: Number(required("DB_PORT")),
      name: required("DB_NAME"),
      user: required("DB_USER"),
      password: required("DB_PASSWORD"),
      ssl: process.env.DB_SSL === "true",
    };
  },
  get accessSecret() {
    return secret("JWT_ACCESS_SECRET");
  },
  get refreshSecret() {
    return secret("JWT_REFRESH_SECRET");
  },
  get appUrl() {
    return process.env.APP_URL ?? "http://localhost:3000";
  },
  get adminEmail() {
    return required("ADMIN_EMAIL").trim().toLowerCase();
  },
  get adminPassword() {
    return required("ADMIN_PASSWORD");
  },
  // Optional: the admin WhatsApp number that placed orders are sent to. Stored
  // as digits in international format (e.g. 923001234567). Returns null when not
  // configured, in which case the WhatsApp hand-off is simply skipped.
  get adminWhatsapp() {
    const value = process.env.ADMIN_WHATSAPP?.replace(/[^0-9]/g, "");
    return value && value.length > 0 ? value : null;
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
};
