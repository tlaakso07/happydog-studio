"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAccount } from "@/lib/auth/access";
import type { FormResult } from "@/lib/auth/config";

export async function acceptInvitation(
  _previous: FormResult,
  form: FormData,
): Promise<FormResult> {
  const id = z.string().uuid().safeParse(form.get("invitationId"));
  if (!id.success)
    return { status: "error", message: "This invitation could not be used." };
  const { supabase } = await requireAccount("/workspaces");
  const { error } = await supabase.rpc("accept_workspace_invitation", {
    invitation_id: id.data,
  });
  if (error)
    return {
      status: "error",
      message:
        "This invitation is no longer available. Ask your team for a new one.",
    };
  revalidatePath("/workspaces");
  return {
    status: "success",
    message: "You’ve joined the company. Open it below to continue.",
  };
}
