import "server-only";
import { NextResponse } from "next/server";
import { getAuthConfig, safeNext } from "./config";

export function authRedirect(next: string, fallbackOrigin: string) {
  const origin = getAuthConfig()?.appUrl ?? fallbackOrigin;
  const response = NextResponse.redirect(new URL(safeNext(next), origin));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export function authFailure(fallbackOrigin: string) {
  const response = authRedirect("/", fallbackOrigin);
  response.headers.set(
    "Location",
    new URL(
      "/login?error=link",
      getAuthConfig()?.appUrl ?? fallbackOrigin,
    ).toString(),
  );
  return response;
}
