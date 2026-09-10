import { notFound } from "next/navigation";
import { StoryboardScreen } from "@/components/studio/storyboard-screen";
import { PREVIEW_JOB_ID } from "@/lib/studio-preview";

export default async function Page({ params }: PageProps<"/w/[slug]/jobs/[jobId]/scenes">) {
  const { slug, jobId } = await params;
  if (jobId !== PREVIEW_JOB_ID) notFound();
  return <StoryboardScreen base={`/w/${slug}`} />;
}
