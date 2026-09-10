import { redirect } from "next/navigation";

/*
 * ponytail: fixed redirect to the seed workspace. The real rule (one owner
 * membership goes to /w/[slug], agency to /hq, none to /no-access) needs auth
 * and the memberships table, which land in M0.
 */
export default function RootPage() {
  redirect("/w/northline-windows");
}
