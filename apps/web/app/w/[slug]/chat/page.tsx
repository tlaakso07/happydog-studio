import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";
import { ComingSoon } from "@/components/shell/coming-soon";

export default async function Page({ params }: PageProps<"/w/[slug]/chat">) {
  if (!isPreviewMode()) await requireWorkspace((await params).slug);
  return (
    <ComingSoon
      title="Chat"
      sentence="A direct line to the team that makes your ads. It arrives with messaging."
    />
  );
}
