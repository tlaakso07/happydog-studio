import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig, isPreviewMode } from "./lib/auth/config";
import { previewGateRequired } from "./lib/auth/preview-gate";
import { previewGateResponse, privateHeaders } from "./lib/auth/preview-gate-response";

export async function proxy(request: NextRequest) {
  const gated = previewGateRequired();
  if (gated) {
    const gate = await previewGateResponse(request);
    if (gate) return gate;
  }
  let response = NextResponse.next({ request });
  if (gated) privateHeaders(response);
  // Do not cache private pages or any auth cookie exchange, including redirects.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  // Keep live session refresh on the original application routes only.
  if (!/^\/(?:$|login$|auth(?:\/|$)|workspaces$|no-access$|hq(?:\/|$)|w(?:\/|$))/.test(request.nextUrl.pathname))
    return response;
  const config = getAuthConfig();
  if (!config || isPreviewMode()) return response;
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        const previous = response;
        response = NextResponse.next({ request });
        previous.cookies
          .getAll()
          .forEach((cookie) => response.cookies.set(cookie));
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        previous.headers.forEach((value, name) => {
          if (name !== "set-cookie") response.headers.set(name, value);
        });
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        );
      },
    },
  });
  // Refresh only. Every protected page/action also verifies the user and RLS.
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: "/:path*",
};
