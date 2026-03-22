import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "francis_portfolio_admin";
export const ADMIN_ACCESS_PATH = "/espace-francis-gestion";

function getSecret() {
  return process.env.ADMIN_SECRET || "change-this-before-production";
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "francis2026",
  };
}

export function createAdminToken(username: string) {
  const signature = createHmac("sha256", getSecret()).update(username).digest("hex");
  return `${username}.${signature}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [username, signature] = token.split(".");

  if (!username || !signature) {
    return false;
  }

  const expected = createHmac("sha256", getSecret()).update(username).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function getAdminTokenFromCookieHeader(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}
