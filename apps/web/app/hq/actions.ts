"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAgency } from "@/lib/auth/access";
import {
  emailSchema,
  roleSchema,
  slugSchema,
  type FormResult,
} from "@/lib/auth/config";

export async function createCompany(
  _previous: FormResult,
  form: FormData,
): Promise<FormResult> {
  const parsed = z
    .object({
      orgId: z.string().uuid(),
      name: z.string().trim().min(2).max(120),
      slug: slugSchema,
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      status: "error",
      message:
        "Enter a company name and a lowercase address using letters, numbers, and hyphens.",
    };
  const { supabase, workspaces } = await requireAgency();
  if (!workspaces.some((w) => w.org_id === parsed.data.orgId))
    return {
      status: "error",
      message: "You don’t have access to this agency.",
    };
  const { error } = await supabase.rpc("create_company", {
    company_org_id: parsed.data.orgId,
    company_name: parsed.data.name,
    company_slug: parsed.data.slug,
  });
  if (error)
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "That company address is already in use. Choose another."
          : "The company could not be created. Please try again.",
    };
  revalidatePath("/hq");
  revalidatePath("/workspaces");
  return {
    status: "success",
    message: "Company created. You can now invite its owner.",
  };
}

export async function saveInvitation(
  _previous: FormResult,
  form: FormData,
): Promise<FormResult> {
  const parsed = z
    .object({
      companyId: z.string().uuid(),
      email: emailSchema,
      role: roleSchema,
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      status: "error",
      message: "Choose a company, a valid email address, and a role.",
    };
  const { supabase, workspaces } = await requireAgency();
  if (!workspaces.some((w) => w.id === parsed.data.companyId))
    return {
      status: "error",
      message: "You don’t have access to this company.",
    };
  const { error } = await supabase.rpc("create_workspace_invitation", {
    company_id: parsed.data.companyId,
    invite_email: parsed.data.email,
    invite_role: parsed.data.role,
  });
  if (error)
    return {
      status: "error",
      message: "The invitation could not be saved. Please try again.",
    };
  revalidatePath("/hq");
  return {
    status: "success",
    message:
      "Invitation saved for seven days. Share the sign-in address below with the invitee. No invitation email has been sent.",
  };
}

export async function revokeInvitation(
  _previous: FormResult,
  form: FormData,
): Promise<FormResult> {
  const id = z.string().uuid().safeParse(form.get("invitationId"));
  if (!id.success)
    return { status: "error", message: "The invitation could not be found." };
  const { supabase } = await requireAgency();
  const { error } = await supabase.rpc("revoke_workspace_invitation", {
    invitation_id: id.data,
  });
  if (error)
    return { status: "error", message: "The invitation could not be revoked." };
  revalidatePath("/hq");
  return { status: "success", message: "Invitation revoked." };
}
