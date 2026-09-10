import Link from "next/link";
import { z } from "zod";
import { requireWorkspace } from "@/lib/auth/access";
import { signOut } from "@/app/login/actions";
import { Sidebar } from "@/components/shell/sidebar";
import { Button } from "@/components/ui/button";

export async function LiveWorkspace({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const { workspace, workspaces, user, supabase } =
    await requireWorkspace(slug);
  const result = await supabase
    .from("orgs")
    .select("name")
    .eq("id", workspace.org_id)
    .single();
  if (result.error)
    throw new Error("Your studio team could not be loaded. Please try again.");
  const org = z.object({ name: z.string() }).parse(result.data);
  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      <Sidebar
        workspace={{ slug, name: workspace.name, orgName: org.name }}
        viewer={{
          name: user.email ?? "Account",
          role: workspace.role,
          avatarPath: null,
        }}
        allowance={null}
        allowanceLimit={workspace.monthly_allowance}
        approvalsCount={0}
        canSwitch={workspaces.length > 1 || workspace.role === "agency"}
        accountActions={
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        }
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export async function LiveHome({ slug }: { slug: string }) {
  const { workspace } = await requireWorkspace(slug);
  return (
    <div className="mx-auto max-w-[1120px] space-y-7 px-5 py-10 sm:px-8">
      <header>
        <p className="mb-3 text-sm text-secondary-ink">{workspace.name}</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Your company workspace
        </h1>
        <p className="mt-4 max-w-xl text-secondary-ink">
          Your account and company access are connected. Brand setup and ad
          production are the next steps as your studio comes online.
        </p>
      </header>
      <section className="rounded-xl border border-line bg-surface p-6">
        <h2 className="text-xl font-semibold">Start with your brand</h2>
        <p className="mt-3 max-w-xl text-secondary-ink">
          Your team will organize your logos, people, products, and voice here.
          There are no sample ads or approved brand assets in this company yet.
        </p>
        <Button asChild className="mt-5">
          <Link href={`/w/${slug}/brand`}>Open Brand Room</Link>
        </Button>
      </section>
      <div className="flex flex-wrap gap-4">
        <Link className="text-cobalt underline" href="/workspaces">
          Your companies and invitations
        </Link>
        {workspace.role === "agency" && (
          <Link className="text-cobalt underline" href="/hq">
            Agency HQ
          </Link>
        )}
      </div>
    </div>
  );
}

export async function LiveFeature({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}) {
  const { workspace } = await requireWorkspace(slug);
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8">
      <p className="mb-3 text-sm text-secondary-ink">{workspace.name}</p>
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-4 max-w-xl text-secondary-ink">{description}</p>
    </div>
  );
}
