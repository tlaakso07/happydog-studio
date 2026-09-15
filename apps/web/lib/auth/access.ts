import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getAuthConfig,
  isPreviewMode,
  roleSchema,
  safeNext,
  slugSchema,
} from "./config";

const workspaceSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  slug: slugSchema,
  name: z.string(),
  monthly_allowance: z.number().int(),
});
const memberSchema = z.object({
  workspace_id: z.string().uuid(),
  role: roleSchema,
});
export type AccessibleWorkspace = z.infer<typeof workspaceSchema> & {
  role: z.infer<typeof roleSchema>;
};

export const getAccount = cache(async () => {
  if (!getAuthConfig() || isPreviewMode()) return null;
  const supabase = await createSupabaseServerClient();
  // Verify identity with Auth rather than trusting the user object in a cookie.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
});

export async function requireAccount(next = "/") {
  const account = await getAccount();
  if (!account) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
  return account;
}

export const getWorkspaces = cache(async (): Promise<AccessibleWorkspace[]> => {
  const { supabase, user } = await requireAccount("/workspaces");
  const [workspaces, members] = await Promise.all([
    supabase
      .from("workspaces")
      .select("id,org_id,slug,name,monthly_allowance")
      .order("name"),
    supabase
      .from("workspace_members")
      .select("workspace_id,role")
      .eq("user_id", user.id),
  ]);
  if (workspaces.error || members.error)
    throw new Error("Company access could not be loaded. Please try again.");
  const roles = new Map(
    z
      .array(memberSchema)
      .parse(members.data)
      .map((m) => [m.workspace_id, m.role]),
  );
  return z
    .array(workspaceSchema)
    .parse(workspaces.data)
    .flatMap((w) => {
      const role = roles.get(w.id);
      return role ? [{ ...w, role }] : [];
    });
});

export async function requireWorkspace(slug: string) {
  if (!slugSchema.safeParse(slug).success) notFound();
  const account = await requireAccount(`/w/${slug}`);
  const workspaces = await getWorkspaces();
  const workspace = workspaces.find((w) => w.slug === slug);
  // Same response for absent and unauthorized companies.
  if (!workspace) notFound();
  return { ...account, workspace, workspaces };
}

export async function requireAgency() {
  const account = await requireAccount("/hq");
  const workspaces = (await getWorkspaces()).filter((w) => w.role === "agency");
  if (!workspaces.length) redirect("/workspaces");
  return { ...account, workspaces };
}
