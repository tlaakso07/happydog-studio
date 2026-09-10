import { type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";
import { authFailure, authRedirect } from "@/lib/auth/complete";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!getAuthConfig() || isPreviewMode() || !code || code.length > 2048)
    return authFailure(request.nextUrl.origin);
  const supabase = await createSupabaseServerClient(true);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return authFailure(request.nextUrl.origin);
  return authRedirect(
    request.nextUrl.searchParams.get("next") ?? "/",
    request.nextUrl.origin,
  );
}
