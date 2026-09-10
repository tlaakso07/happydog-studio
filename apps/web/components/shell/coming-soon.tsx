type ComingSoonProps = {
  title: string;
  /** A plain sentence about when this arrives. No roadmap language. */
  sentence: string;
};

/** Honest empty state for a route the owner can reach but that is not built. */
export function ComingSoon({ title, sentence }: ComingSoonProps) {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="font-display text-[28px] leading-[1.2] font-semibold tracking-[-0.03em] text-ink">
        {title}
      </h1>
      <p className="mt-3 max-w-[56ch] text-[16px] leading-[1.55] text-secondary-ink">
        {sentence}
      </p>
    </div>
  );
}
