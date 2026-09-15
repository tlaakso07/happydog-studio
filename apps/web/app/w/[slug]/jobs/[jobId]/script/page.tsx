import { notFound } from "next/navigation";
import { ScriptScreen } from "@/components/studio/script-screen";
import { PREVIEW_JOB_ID } from "@/lib/studio-preview";
import { isPreviewMode } from "@/lib/auth/config";
import { requireWorkspace } from "@/lib/auth/access";

export default async function Page({
  params,
}: PageProps<"/w/[slug]/jobs/[jobId]/script">) {
  const { slug, jobId } = await params;
  if (!isPreviewMode()) {
    await requireWorkspace(slug);
    notFound();
  }
  if (jobId !== PREVIEW_JOB_ID) notFound();
  return <ScriptScreen base={`/w/${slug}`} />;
}
