import { PRODUCT } from "@/lib/product";

/** The mark is a frame with a filled well: a studio shot inside a border. */
export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="26" height="26" rx="7" fill="var(--ink)" />
        <rect x="6" y="7" width="9" height="9" rx="2" fill="var(--surface)" />
        <rect x="16.5" y="14" width="3.5" height="5" rx="1.2" fill="var(--surface)" opacity="0.55" />
      </svg>
      <span className="font-display text-[19px] font-bold tracking-[-0.03em] text-ink">
        {PRODUCT.wordmark}
      </span>
    </div>
  );
}
