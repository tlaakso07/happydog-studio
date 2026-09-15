import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({ params }: PageProps<"/w/[slug]/library">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Library"
      sentence="Your footage, saved ads and winners collect here as they come in."
    />
  );
}
