import { CreateScreen } from "@/components/studio/create-screen";
import { isPreviewMode } from "@/lib/auth/config";
import { LiveFeature } from "@/components/auth/live-workspace";

export default async function Page({ params }: PageProps<"/w/[slug]/create">) {
  const { slug } = await params;
  if (!isPreviewMode())
    return (
      <LiveFeature
        slug={slug}
        title="New ad"
        description="Ad creation will open once your company’s brand and offer are approved. Your team is connecting this workflow."
      />
    );
  return <CreateScreen base={`/w/${slug}`} />;
}
