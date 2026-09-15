import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { PRODUCT } from "../product";
import { safeNext } from "./config";
import { createPreviewSession, PREVIEW_COOKIE, PREVIEW_SESSION_SECONDS, validPreviewPassword, validPreviewSession } from "./preview-gate";

const gatePath = "/preview-access";
const fields = z.object({ password: z.string().min(1).max(256), next: z.string().max(512).optional() });
const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function privateHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

function screen(next: string, error = false, configured = true): NextResponse {
  const name = escape(PRODUCT.wordmark);
  const response = new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · Private beta</title><style>*{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#16181d;font:16px/1.6 system-ui,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}main{width:100%;max-width:440px;padding:36px;background:#fff;border:1px solid #e5e7ee;border-radius:12px}.brand{font-size:24px;font-weight:750}h1{font-size:30px;line-height:1.2;letter-spacing:-1px;margin:36px 0 12px}p{color:#4c5262}label{display:block;font-weight:600;margin:28px 0 8px}input,button{width:100%;font:inherit;border-radius:9px;padding:12px;min-height:48px}input{border:1px solid #b8bfce}button{margin-top:20px;border:0;background:#2447f5;color:#fff;font-weight:600;cursor:pointer}input:focus-visible,button:focus-visible{outline:3px solid #8296ff;outline-offset:3px}.error{color:#a12727}.note{font-size:13px;margin-top:22px}</style></head><body><main><div class="brand">${name}</div><h1>Private beta</h1><p>Enter the shared password to open the studio.</p>${configured ? `<form method="post" action="${gatePath}"><input type="hidden" name="next" value="${escape(safeNext(next))}"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus ${error ? 'aria-describedby="error" aria-invalid="true"' : ""}>${error ? '<p class="error" id="error" role="alert">That password didn’t work. Please try again.</p>' : ""}<button type="submit">Open studio</button></form><p class="note">Access stays unlocked in this browser for 24 hours.</p>` : '<p role="status">Access is being configured. Please check back shortly.</p>'}</main></body></html>`, { status: configured ? (error ? 401 : 200) : 503, headers: { "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'", "X-Content-Type-Options": "nosniff" } });
  return privateHeaders(response);
}

// Bound the body before parsing; the shared password never reaches an app action.
async function readFields(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const values = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
    return fields.safeParse({ password: values.get("password"), next: values.get("next") ?? undefined });
  } finally { reader.releaseLock(); }
}

export async function previewGateResponse(request: NextRequest): Promise<NextResponse | null> {
  const password = process.env.STUDIO_PREVIEW_PASSWORD;
  const configured = Boolean(password && password.length >= 16);
  if (request.nextUrl.pathname === gatePath) {
    if (request.method === "POST") {
      let sameOrigin = false;
      try {
        const origin = new URL(request.headers.get("origin") ?? "");
        sameOrigin = origin.host === request.headers.get("host") &&
          (origin.protocol === "https:" || (!process.env.VERCEL && origin.protocol === "http:"));
      } catch { /* Invalid or absent origins are denied. */ }
      if (!sameOrigin) return privateHeaders(new NextResponse("Request not allowed.", { status: 403 }));
      const parsed = await readFields(request);
      if (!parsed?.success) return screen("/", true, configured);
      if (!validPreviewPassword(parsed.data.password, password)) return screen(parsed.data.next ?? "/", true, configured);
      const response = NextResponse.redirect(new URL(safeNext(parsed.data.next), request.url), 303);
      response.cookies.set(PREVIEW_COOKIE, createPreviewSession(password!), { httpOnly: true, secure: Boolean(process.env.VERCEL) || request.nextUrl.protocol === "https:", sameSite: "strict", path: "/", maxAge: PREVIEW_SESSION_SECONDS });
      return privateHeaders(response);
    }
    if (!["GET", "HEAD"].includes(request.method)) return privateHeaders(new NextResponse("Method not allowed.", { status: 405 }));
    if (validPreviewSession(request.cookies.get(PREVIEW_COOKIE)?.value, password)) return privateHeaders(NextResponse.redirect(new URL("/", request.url), 303));
    return screen(request.nextUrl.searchParams.get("next") ?? "/", false, configured);
  }
  if (validPreviewSession(request.cookies.get(PREVIEW_COOKIE)?.value, password)) return null;
  if (["GET", "HEAD"].includes(request.method) && request.headers.get("accept")?.includes("text/html")) {
    const url = new URL(gatePath, request.url);
    url.searchParams.set("next", safeNext(request.nextUrl.pathname));
    return privateHeaders(NextResponse.redirect(url, 303));
  }
  return privateHeaders(new NextResponse("Password required.", { status: configured ? 401 : 503 }));
}
