import { CreateScreen } from "@/components/studio/create-screen";

export default async function Page({ params }: PageProps<"/w/[slug]/create">) {
  const { slug } = await params;
  return <CreateScreen base={`/w/${slug}`} />;
}
