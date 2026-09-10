import { StateCard } from "@/components/home/state-card";
import { OfferCard } from "@/components/home/offer-card";
import { RecentRenders } from "@/components/home/recent-renders";
import { getHomePayload, homeState } from "@/lib/studio-home";
import { isPreviewMode } from "@/lib/auth/config";
import { LiveHome } from "@/components/auth/live-workspace";

export default async function StudioHome({ params }: PageProps<"/w/[slug]">) {
  const { slug } = await params;
  if (!isPreviewMode()) return <LiveHome slug={slug} />;
  const payload = await getHomePayload(slug);
  const base = `/w/${slug}`;

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-8 pb-20 sm:px-8 sm:py-10">
      <StateCard state={homeState(payload)} base={base} />
      {payload.offer ? <OfferCard offer={payload.offer} base={base} /> : null}
      <div className="pt-4">
        <RecentRenders renders={payload.recent} base={base} />
      </div>
    </div>
  );
}
