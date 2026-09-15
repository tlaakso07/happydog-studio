import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({
  params,
}: PageProps<"/w/[slug]/insights">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Insights"
      sentence="How each ad performed once it is running. It arrives after publishing is connected."
    />
  );
}
