import { BrandScreen } from "@/components/studio/brand-screen";
import { isPreviewMode } from "@/lib/auth/config";
import { LiveFeature } from "@/components/auth/live-workspace";

export default async function Page({ params }: PageProps<"/w/[slug]/brand">) {
  const { slug } = await params;
  if (!isPreviewMode())
    return (
      <LiveFeature
        slug={slug}
        title="Brand room"
        description="Your company’s Cast, Wardrobe, Products, Fleet and site, World, and Voice and proof will live here. Asset uploads and website setup are being connected."
      />
    );
  return <BrandScreen />;
}
