import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({ params }: PageProps<"/w/[slug]/renders">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Renders"
      sentence="Every finished ad, with what it says and what was checked. It arrives with the first render."
    />
  );
}
