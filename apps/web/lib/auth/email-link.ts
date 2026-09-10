import { z } from "zod";

export const pendingEmailCookie = "studio-pending-email";
export const emailLinkSchema = z.object({
  token_hash: z.string().min(1).max(2048),
  type: z.enum(["email", "magiclink", "invite"]),
});

export function parsePendingEmail(value: string | undefined) {
  try {
    return emailLinkSchema.safeParse(JSON.parse(value ?? "null"));
  } catch {
    return emailLinkSchema.safeParse(null);
  }
}
