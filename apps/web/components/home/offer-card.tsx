import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/studio-home";

type OfferCardProps = {
  offer: Offer;
  base: string;
};

/**
 * The deal an owner is running, stated once. The dark ground marks it as the
 * fact everything else is written against.
 */
export function OfferCard({ offer, base }: OfferCardProps) {
  return (
    <section
      aria-labelledby="offer-label"
      className="flex flex-col gap-5 rounded-[14px] bg-ink px-6 py-6 text-white sm:px-8 sm:py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
    >
      <div className="min-w-0">
        <h2
          id="offer-label"
          className="font-sans text-[12px] font-medium tracking-[0.09em] text-white/55 uppercase"
        >
          This month&apos;s offer
        </h2>
        <p className="mt-2 font-display text-[20px] sm:text-[23px] leading-[1.3] font-medium tracking-[-0.022em] text-white text-balance">
          {offer.title}
          <span className="text-white/60"> · Runs through {offer.runsThrough}</span>
        </p>
      </div>
      <Button asChild size="md" variant="ground" className="self-start sm:self-auto">
        <Link href={`${base}/offer`}>Change offer</Link>
      </Button>
    </section>
  );
}
