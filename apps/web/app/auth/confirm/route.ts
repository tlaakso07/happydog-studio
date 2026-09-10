import { type NextRequest } from "next/server";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";
import { authFailure, authRedirect } from "@/lib/auth/complete";
import { emailLinkSchema, pendingEmailCookie } from "@/lib/auth/email-link";

export async function GET(request: NextRequest) {
  const config = getAuthConfig();
  const input = emailLinkSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!config || isPreviewMode() || !input.success)
    return authFailure(request.nextUrl.origin);
  // GET may be an email scanner. Only an explicit POST consumes the link.
  const response = authRedirect("/", request.nextUrl.origin);
  response.headers.set("Location", new URL("/auth/continue", config.appUrl).toString());
  response.cookies.set(pendingEmailCookie, JSON.stringify(input.data), {
    httpOnly: true,
    sameSite: "lax",
    secure: config.appUrl.startsWith("https:"),
    path: "/auth",
    maxAge: 600,
  });
  return response;
}
