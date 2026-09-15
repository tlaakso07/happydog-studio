import Link from "next/link";
import { z } from "zod";
import { getWorkspaces, requireAccount } from "@/lib/auth/access";
import { roleSchema } from "@/lib/auth/config";
import { signOut } from "@/app/login/actions";
import { InvitationForm } from "@/components/auth/invitation-form";
import { Wordmark } from "@/components/shell/wordmark";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Workspaces() {
  const { supabase, user } = await requireAccount("/workspaces");
  const workspaces = await getWorkspaces();
  const result = await supabase.rpc("pending_workspace_invitations");
  if (result.error)
    throw new Error("Invitations could not be loaded. Please try again.");
  const invites = z
    .array(
      z.object({
        id: z.string().uuid(),
        workspace_name: z.string(),
        role: roleSchema,
        expires_at: z.string(),
      }),
    )
    .parse(result.data);
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Wordmark />
        <form action={signOut}>
          <Button variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </header>
      <div>
        <h1 className="font-display text-3xl font-semibold">Your companies</h1>
        <p className="mt-2 text-secondary-ink">Signed in as {user.email}</p>
      </div>
      {invites.length > 0 && (
        <section aria-labelledby="invitations">
          <h2 id="invitations" className="mb-4 text-xl font-semibold">
            Invitations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {invites.map((invite) => (
              <article
                key={invite.id}
                className="rounded-xl border border-line bg-surface p-5"
              >
                <h3 className="text-lg font-semibold">
                  {invite.workspace_name}
                </h3>
                <p className="text-sm capitalize text-secondary-ink">
                  {invite.role} access
                </p>
                <InvitationForm id={invite.id} />
              </article>
            ))}
          </div>
        </section>
      )}
      <section
        aria-label="Companies you can access"
        className="grid gap-4 sm:grid-cols-2"
      >
        {workspaces.map((w) => (
          <Link
            key={w.id}
            href={`/w/${w.slug}`}
            className="rounded-xl border border-line bg-surface p-6 transition-colors hover:bg-wash"
          >
            <h2 className="text-xl font-semibold">{w.name}</h2>
            <p className="mt-2 capitalize text-secondary-ink">
              {w.role} · Open company →
            </p>
          </Link>
        ))}
      </section>
      {!workspaces.length && !invites.length && (
        <p className="rounded-xl border border-line bg-surface p-6">
          You don’t have company access yet. Ask your studio team to invite this
          email address, then return here.
        </p>
      )}
      {workspaces.some((w) => w.role === "agency") && (
        <Button asChild>
          <Link href="/hq">Open Agency HQ</Link>
        </Button>
      )}
    </main>
  );
}
