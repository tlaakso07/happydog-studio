import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({ params }: PageProps<"/w/[slug]/feed">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Feed"
      sentence="What other companies in your group are running. It arrives with the group rollout."
    />
  );
}
