export const authCookies = {
  access: "copmet_access_token",
  refresh: "copmet_refresh_token",
} as const;

export const authTokenTtl = {
  accessSeconds: 15 * 60,
  refreshSeconds: 7 * 24 * 60 * 60,
  rememberedRefreshSeconds: 30 * 24 * 60 * 60,
} as const;

export const authTokenMetadata = {
  issuer: "copmet-food-service",
  audience: "copmet-web-app",
} as const;
