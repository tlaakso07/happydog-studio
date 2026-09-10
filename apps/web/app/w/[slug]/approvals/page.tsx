import { ApprovalScreen } from "@/components/studio/approval-screen";

export default async function Page({ params }: PageProps<"/w/[slug]/approvals">) {
  const { slug } = await params;
  return <ApprovalScreen base={`/w/${slug}`} />;
}
