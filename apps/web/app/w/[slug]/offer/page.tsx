import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({ params }: PageProps<"/w/[slug]/offer">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="This month's deal"
      sentence="Stating and changing your deal arrives with the offer editor."
    />
  );
}
