import type { Allowance } from "@/lib/studio-home";

type AllowanceCardProps = {
  allowance: Allowance;
  orgName: string;
};

/**
 * Ads made this month, never credits or tokens. Redos do not appear here
 * because redos do not move the number.
 */
export function AllowanceCard({ allowance, orgName }: AllowanceCardProps) {
  const { monthLabel, used, total, resetsOn } = allowance;
  const pct = total === 0 ? 0 : Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="rounded-[12px] border border-line p-4">
      <p className="text-[14px] font-medium text-ink">{monthLabel} ads</p>
      <p className="tnum mt-1 text-[14px] text-secondary-ink">
        {used} / {total}
      </p>
      <div
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${monthLabel} ads used`}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-cobalt transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-[12px] leading-[1.45] text-meta">
        Resets {resetsOn} · managed by {orgName}
      </p>
    </div>
  );
}
