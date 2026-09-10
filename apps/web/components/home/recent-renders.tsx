import Image from "next/image";
import Link from "next/link";
import {
  renderMeta,
  renderStatusWord,
  type RecentRender,
} from "@/lib/studio-home";

type RecentRendersProps = {
  renders: RecentRender[];
  base: string;
};

export function RecentRenders({ renders, base }: RecentRendersProps) {
  return (
    <section aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        className="font-display text-[22px] sm:text-[24px] leading-[1.2] font-semibold tracking-[-0.028em] text-ink"
      >
        Fresh out of the studio
      </h2>

      {renders.length === 0 ? (
        <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.55] text-secondary-ink">
          Nothing has come out of the studio yet. The first ads land here once
          your brand room is locked.
        </p>
      ) : (
        <ul className="mt-5 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {renders.map((render, index) => (
            <li key={render.id}>
              <Link
                href={`${base}/renders?render=${render.id}`}
                className="group block rounded-[12px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] border border-line bg-muted">
                  <Image
                    src={render.posterPath}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 50vw, 300px"
                    priority={index === 0}
                    className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-[6px] bg-checked px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-checked-ink uppercase">
                    {renderStatusWord(render)}
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-medium text-ink group-hover:text-cobalt">
                  {render.title}
                </p>
                <p className="tnum mt-1 text-[13px] text-meta">
                  {renderMeta(render)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
