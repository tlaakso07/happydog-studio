export type NavItem = {
  label: string;
  href: string;
  /** Reads a count off the home payload, rendered as a badge. */
  badge?: "approvals";
};

/**
 * Sidebar order is fixed by reference render 02. Text only, no icons: the
 * owner sees ten plain words, not a toolbar.
 */
export function navItems(base: string): NavItem[] {
  return [
    { label: "Home", href: base },
    { label: "Calendar", href: `${base}/calendar` },
    { label: "New ad", href: `${base}/create` },
    { label: "Brand room", href: `${base}/brand` },
    { label: "Library", href: `${base}/library` },
    { label: "Renders", href: `${base}/renders` },
    { label: "Approvals", href: `${base}/approvals`, badge: "approvals" },
    { label: "Insights", href: `${base}/insights` },
    { label: "Chat", href: `${base}/chat` },
    { label: "Feed", href: `${base}/feed` },
  ];
}
