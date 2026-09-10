"use server";

import { redirect } from "next/navigation";
import {
  emailSchema,
  getAuthConfig,
  isPreviewMode,
  safeNext,
  type FormResult,
} from "@/lib/auth/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestSignIn(
  _previous: FormResult,
  form: FormData,
): Promise<FormResult> {
  const config = getAuthConfig();
  if (!config || isPreviewMode())
    return {
      status: "error",
      message: "Sign-in is not available in this preview.",
    };
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success)
    return { status: "error", message: "Enter a valid email address." };
  const supabase = await createSupabaseServerClient(true);
  const callback = new URL("/auth/callback", config.appUrl);
  callback.searchParams.set("next", safeNext(form.get("next")));
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    // A verified account gets no company access until it accepts an invitation.
    options: { emailRedirectTo: callback.toString(), shouldCreateUser: true },
  });
  if (error)
    return {
      status: "error",
      message:
        "We could not send a sign-in link. Please wait a moment and try again.",
    };
  return {
    status: "success",
    message:
      "Check your email for a sign-in link. Open it in this browser to continue.",
  };
}

export async function signOut() {
  if (getAuthConfig() && !isPreviewMode()) {
    const supabase = await createSupabaseServerClient(true);
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error)
      throw new Error("Sign-out could not be completed. Please try again.");
  }
  redirect("/login");
}
