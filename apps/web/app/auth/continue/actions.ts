"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";
import { parsePendingEmail, pendingEmailCookie } from "@/lib/auth/email-link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function completeEmailSignIn() {
  const config = getAuthConfig();
  if (!config || isPreviewMode()) redirect("/login?error=link");
  const jar = await cookies();
  const pending = parsePendingEmail(jar.get(pendingEmailCookie)?.value);
  jar.set(pendingEmailCookie, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: config.appUrl.startsWith("https:"),
    path: "/auth",
    maxAge: 0,
  });
  if (!pending.success) redirect("/login?error=link");
  const supabase = await createSupabaseServerClient(true);
  const { error } = await supabase.auth.verifyOtp(pending.data);
  if (error) redirect("/login?error=link");
  redirect("/");
}
