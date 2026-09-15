import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

type Environment = Record<string, string | undefined>;
export const PREVIEW_COOKIE = "studio-preview-access";
export const PREVIEW_SESSION_SECONDS = 60 * 60 * 24;

export function previewGateRequired(env: Environment = process.env): boolean {
  return ["preview", "production"].includes(env.VERCEL_ENV ?? "") || Boolean(env.STUDIO_PREVIEW_PASSWORD);
}

export function validPreviewPassword(supplied: string, password: string | undefined): boolean {
  if (!password || password.length < 16 || supplied.length > 256) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(supplied), digest(password));
}

function signature(payload: string, password: string): string {
  return createHmac("sha256", password).update(`studio-preview-v1:${payload}`).digest("hex");
}

export function createPreviewSession(password: string, now = Date.now()): string {
  if (password.length < 16) throw new Error("Preview password must have at least 16 characters.");
  const payload = `${Math.floor(now / 1000) + PREVIEW_SESSION_SECONDS}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload, password)}`;
}

export function validPreviewSession(value: string | undefined, password: string | undefined, now = Date.now()): boolean {
  if (!password || password.length < 16 || !value || value.length > 160) return false;
  const match = /^(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(value);
  if (!match) return false;
  const expires = Number(match[1]);
  const seconds = Math.floor(now / 1000);
  if (expires <= seconds || expires > seconds + PREVIEW_SESSION_SECONDS) return false;
  return timingSafeEqual(Buffer.from(match[3], "hex"), Buffer.from(signature(`${match[1]}.${match[2]}`, password), "hex"));
}
