import { ApprovalScreen } from "@/components/studio/approval-screen";
import { isPreviewMode } from "@/lib/auth/config";
import { LiveFeature } from "@/components/auth/live-workspace";

export default async function Page({
  params,
}: PageProps<"/w/[slug]/approvals">) {
  const { slug } = await params;
  if (!isPreviewMode())
    return (
      <LiveFeature
        slug={slug}
        title="Approvals"
        description="Your finished ads will arrive here for review once production is connected. There are no sample decisions to make in this company."
      />
    );
  return <ApprovalScreen base={`/w/${slug}`} />;
}
