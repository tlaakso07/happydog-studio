import { redirect } from "next/navigation";
import { isPreviewMode } from "@/lib/auth/config";
import { getWorkspaces, requireAccount } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

// Pending invitations take precedence so existing users can join another company.
export default async function RootPage() {
  if (isPreviewMode()) redirect("/w/northline-windows");
  const { supabase } = await requireAccount();
  const pending = await supabase.rpc("pending_workspace_invitations");
  if (pending.error)
    throw new Error("Invitations could not be loaded. Please try again.");
  if (pending.data?.length) redirect("/workspaces");
  const workspaces = await getWorkspaces();
  if (workspaces.some((w) => w.role === "agency")) redirect("/hq");
  if (workspaces.length === 1) redirect(`/w/${workspaces[0].slug}`);
  redirect("/workspaces");
}
