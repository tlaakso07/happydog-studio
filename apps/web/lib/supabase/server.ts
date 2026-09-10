import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";

export async function createSupabaseServerClient(writableCookies = false) {
  const config = getAuthConfig();
  if (!config || isPreviewMode())
    throw new Error("Live accounts are not configured.");
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        // Server Components cannot write cookies. Proxy refreshes their session.
        if (!writableCookies) return;
        // Auth actions/handlers must surface cookie-write failures, not swallow them.
        values.forEach(({ name, value, options }) => jar.set(name, value, options));
      },
    },
  });
}
