"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { navItems } from "@/lib/nav";
import { Wordmark } from "@/components/shell/wordmark";
import { AllowanceCard } from "@/components/shell/allowance-card";
import type { Allowance, Viewer, Workspace } from "@/lib/studio-home";

type SidebarProps = {
  workspace: Workspace;
  viewer: Viewer;
  allowance: Allowance;
  approvalsCount: number;
  /** True when the viewer can move between workspaces. Owners cannot. */
  canSwitch: boolean;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const ROLE_WORD: Record<Viewer["role"], string> = {
  owner: "Owner",
  agency: "Agency",
  enterprise: "Enterprise",
};

/**
 * A 232px rail at the laptop width the product is designed for. Below 1024 it
 * becomes a header with the nav on one scrolling line, because a fixed rail
 * would take most of a phone screen.
 */
export function Sidebar({
  workspace,
  viewer,
  allowance,
  approvalsCount,
  canSwitch,
}: SidebarProps) {
  const pathname = usePathname();
  const base = `/w/${workspace.slug}`;
  const items = navItems(base);

  const workspaceName = (
    <span className="truncate font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">
      {workspace.name}
    </span>
  );

  return (
    <nav
      aria-label="Workspace"
      className="flex shrink-0 flex-col border-b border-line bg-surface lg:w-[232px] lg:border-r lg:border-b-0"
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4 lg:block lg:pt-6 lg:pb-7">
        <Link href={base} className="inline-flex rounded-md">
          <Wordmark />
        </Link>
        <p className="tnum text-[13px] text-meta lg:hidden">
          {allowance.monthLabel} ads {allowance.used} / {allowance.total}
        </p>
      </div>

      <div className="px-3">
        {canSwitch ? (
          <button
            type="button"
            className="flex h-11 w-full items-center justify-between gap-2 rounded-[10px] px-2.5 text-left transition-colors duration-150 hover:bg-muted"
          >
            {workspaceName}
            <ChevronDown className="size-4 shrink-0 text-meta" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex h-11 items-center px-2.5">{workspaceName}</div>
        )}
      </div>

      <ul className="flex gap-0.5 overflow-x-auto px-3 pb-2 lg:mt-4 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const active =
            item.href === base ? pathname === base : pathname.startsWith(item.href);
          const count = item.badge === "approvals" ? approvalsCount : 0;

          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-11 items-center justify-between gap-2 rounded-[10px] px-2.5 text-[15px] transition-colors duration-150",
                  active
                    ? "bg-wash font-semibold text-cobalt"
                    : "text-secondary-ink hover:bg-muted hover:text-ink",
                ].join(" ")}
              >
                <span className="truncate">{item.label}</span>
                {count > 0 ? (
                  <span className="tnum inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-wash px-1.5 text-[12px] font-medium text-cobalt">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto hidden px-3 pt-8 pb-3 lg:block">
        <AllowanceCard allowance={allowance} orgName={workspace.orgName} />
      </div>

      <div className="hidden items-center gap-2.5 border-t border-line px-5 py-4 lg:flex">
        <span
          aria-hidden="true"
          className="tnum flex size-8 shrink-0 items-center justify-center rounded-full bg-wash text-[12px] font-semibold text-cobalt"
        >
          {initials(viewer.name)}
        </span>
        <p className="truncate text-[13px] text-secondary-ink">
          <span className="font-medium text-ink">{viewer.name}</span>
          <span className="text-meta"> · {ROLE_WORD[viewer.role]}</span>
        </p>
      </div>
    </nav>
  );
}
