import Link from "next/link";
import { z } from "zod";
import { requireAgency } from "@/lib/auth/access";
import { getAuthConfig } from "@/lib/auth/config";
import { signOut } from "@/app/login/actions";
import {
  CreateCompanyForm,
  InviteCompanyForm,
  RevokeInvitationForm,
} from "@/components/agency/company-forms";
import { Wordmark } from "@/components/shell/wordmark";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AgencyHQ() {
  const { supabase, workspaces } = await requireAgency();
  const orgIds = [...new Set(workspaces.map((w) => w.org_id))];
  const [orgResult, inviteResult] = await Promise.all([
    supabase.from("orgs").select("id,name").in("id", orgIds).order("name"),
    supabase
      .from("workspace_invites")
      .select("id,workspace_id,email,role,expires_at")
      .in(
        "workspace_id",
        workspaces.map((w) => w.id),
      )
      .is("accepted_at", null)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false }),
  ]);
  if (orgResult.error || inviteResult.error)
    throw new Error(
      "Agency information could not be loaded. Please try again.",
    );
  const orgs = z
    .array(z.object({ id: z.string().uuid(), name: z.string() }))
    .parse(orgResult.data);
  const invites = z
    .array(
      z.object({
        id: z.string().uuid(),
        workspace_id: z.string().uuid(),
        email: z.string(),
        role: z.string(),
        expires_at: z.string(),
      }),
    )
    .parse(inviteResult.data);
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Wordmark />
        <div className="flex items-center gap-4">
          <Link className="text-sm text-cobalt" href="/workspaces">
            Your companies
          </Link>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <div>
        <h1 className="font-display text-3xl font-semibold">Agency HQ</h1>
        <p className="mt-2 text-secondary-ink">
          Create companies and manage access. Each company keeps its own private
          workspace.
        </p>
      </div>
      <section
        aria-label="Companies"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {workspaces.map((w) => (
          <Link
            key={w.id}
            href={`/w/${w.slug}`}
            className="rounded-xl border border-line bg-surface p-5 hover:bg-wash"
          >
            <h2 className="text-lg font-semibold">{w.name}</h2>
            <p className="mt-2 text-sm text-secondary-ink">Open company →</p>
          </Link>
        ))}
      </section>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <CreateCompanyForm orgs={orgs} />
        <InviteCompanyForm
          companies={workspaces}
          loginUrl={`${getAuthConfig()!.appUrl}/login`}
        />
      </div>
      <section aria-labelledby="pending-invites">
        <h2 id="pending-invites" className="mb-4 text-xl font-semibold">
          Pending invitations
        </h2>
        {!invites.length ? (
          <p className="text-secondary-ink">No pending invitations.</p>
        ) : (
          <ul className="space-y-3">
            {invites.map((i) => (
              <li
                key={i.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
              >
                <div>
                  <p className="break-all font-medium">{i.email}</p>
                  <p className="text-sm text-secondary-ink">
                    {workspaces.find((w) => w.id === i.workspace_id)?.name} ·{" "}
                    {i.role} · Expires{" "}
                    {new Date(i.expires_at).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
                <RevokeInvitationForm id={i.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
