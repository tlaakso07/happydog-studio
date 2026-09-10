import { z } from "zod";

type Environment = Record<string, string | undefined>;

export function isPreviewMode(env: Environment = process.env): boolean {
  // Preview is explicit and never enabled on a production Vercel deployment.
  return env.STUDIO_MODE === "preview" && env.VERCEL_ENV !== "production";
}

const origin = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      (url.protocol === "https:" ||
        (url.protocol === "http:" &&
          ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
    );
  }, "Use an HTTPS origin, or localhost for development.");

export function getAuthConfig(env: Environment = process.env) {
  const parsed = z
    .object({
      url: origin,
      key: z.string().min(10),
      appUrl: origin,
    })
    .safeParse({
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      key:
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    });
  return parsed.success
    ? { ...parsed.data, appUrl: new URL(parsed.data.appUrl).origin }
    : null;
}

export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (["/", "/hq", "/workspaces", "/no-access"].includes(value)) return value;
  return /^\/w\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-zA-Z0-9-]+)*$/.test(value)
    ? value
    : "/";
}

export const emailSchema = z.string().trim().email().max(254);
export const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
export const roleSchema = z.enum(["owner", "agency", "enterprise"]);
export type MemberRole = z.infer<typeof roleSchema>;

export type FormResult = {
  status: "idle" | "success" | "error";
  message: string;
};
export const emptyForm: FormResult = { status: "idle", message: "" };
