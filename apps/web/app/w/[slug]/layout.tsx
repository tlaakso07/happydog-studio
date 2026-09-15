import { Sidebar } from "@/components/shell/sidebar";
import { getHomePayload } from "@/lib/studio-home";
import { getStudioPreview } from "@/lib/studio-preview";
import { PreviewProvider } from "@/components/studio/preview-provider";
import { isPreviewMode } from "@/lib/auth/config";
import { LiveWorkspace } from "@/components/auth/live-workspace";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Keep the original preview shell; real company access uses verified membership.
export default async function WorkspaceLayout({
  children,
  params,
}: LayoutProps<"/w/[slug]">) {
  const { slug } = await params;
  if (!isPreviewMode())
    return <LiveWorkspace slug={slug}>{children}</LiveWorkspace>;
  if (slug !== "northline-windows") notFound();
  const payload = await getHomePayload(slug);
  const preview = await getStudioPreview();

  return (
    <PreviewProvider key={slug} payload={preview}>
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
    </PreviewProvider>
  );
}
