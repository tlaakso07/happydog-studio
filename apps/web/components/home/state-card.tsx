import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HomeState } from "@/lib/studio-home";

type StateCardProps = {
  state: HomeState;
  base: string;
};

type Copy = {
  headline: string;
  support: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string } | null;
};

function copyFor(state: HomeState, base: string): Copy {
  switch (state.kind) {
    case "ready":
      return {
        headline: `${state.count} ${state.count === 1 ? "ad is" : "ads are"} ready for you`,
        support: `Every one already checked. About ${state.minutes} minutes.`,
        primary: { label: "Review them", href: `${base}/approvals` },
        secondary: { label: "Message your team", href: `${base}/chat` },
      };
    case "needs_offer":
      return {
        headline: "Tell us this month's deal",
        support: "One line is enough. Everything we write starts from it.",
        primary: { label: "Set this month's deal", href: `${base}/offer` },
        secondary: { label: "Message your team", href: `${base}/chat` },
      };
    case "quiet":
      return {
        headline: "Nothing to do",
        support: "Your deal is live and nothing is waiting on you.",
        primary: { label: "Start a new ad", href: `${base}/create` },
        secondary: null,
      };
  }
}

export function StateCard({ state, base }: StateCardProps) {
  const copy = copyFor(state, base);

  return (
    <section
      aria-labelledby="home-state"
      className="rounded-[14px] border border-line bg-surface px-6 py-12 text-center sm:px-8 sm:py-16"
    >
      <h1
        id="home-state"
        className="mx-auto max-w-[18ch] font-display text-[30px] leading-[1.12] font-semibold tracking-[-0.032em] text-ink sm:text-[40px]"
      >
        {copy.headline}
      </h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-[1.5] text-secondary-ink">
        {copy.support}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="xl" className="w-full sm:w-auto sm:min-w-[200px]">
          <Link href={copy.primary.href}>{copy.primary.label}</Link>
        </Button>
        {copy.secondary ? (
          <Button asChild size="xl" variant="outline" className="w-full sm:w-auto sm:min-w-[200px]">
            <Link href={copy.secondary.href}>{copy.secondary.label}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
