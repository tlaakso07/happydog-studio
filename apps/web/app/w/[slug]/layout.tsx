import { Sidebar } from "@/components/shell/sidebar";
import { getHomePayload } from "@/lib/studio-home";

/*
 * ponytail: no topbar. The reference render has none and an owner has nothing
 * to put in one, since owners cannot switch workspaces. Add it with the
 * workspace switcher and command menu when the agency shell lands.
 */
export default async function WorkspaceLayout({
  children,
  params,
}: LayoutProps<"/w/[slug]">) {
  const { slug } = await params;
  const payload = await getHomePayload(slug);

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <Sidebar
        workspace={payload.workspace}
        viewer={payload.viewer}
        allowance={payload.allowance}
        approvalsCount={payload.readyCount}
        canSwitch={payload.viewer.role !== "owner"}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
