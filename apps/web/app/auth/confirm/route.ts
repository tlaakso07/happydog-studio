import { type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";
import { authFailure, authRedirect } from "@/lib/auth/complete";

export async function GET(request: NextRequest) {
  const input = z
    .object({
      token_hash: z.string().min(1).max(2048),
      type: z.enum(["email", "magiclink", "invite"]),
    })
    .safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!getAuthConfig() || isPreviewMode() || !input.success)
    return authFailure(request.nextUrl.origin);
  const supabase = await createSupabaseServerClient(true);
  const { error } = await supabase.auth.verifyOtp(input.data);
  if (error) return authFailure(request.nextUrl.origin);
  return authRedirect("/", request.nextUrl.origin);
}
