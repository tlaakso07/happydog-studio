import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthConfig, isPreviewMode } from "./lib/auth/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  // Do not cache private pages or any auth cookie exchange, including redirects.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "same-origin");
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
  matcher: [
    "/",
    "/login",
    "/auth/:path*",
    "/workspaces",
    "/no-access",
    "/hq/:path*",
    "/w/:path*",
  ],
};
