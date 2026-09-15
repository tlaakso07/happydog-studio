import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({
  params,
}: PageProps<"/w/[slug]/calendar">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Calendar"
      sentence="The month view of what is shooting and when it lands. It arrives with scheduling."
    />
  );
}
