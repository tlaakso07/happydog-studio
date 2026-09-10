import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/shell/wordmark";
import { getAuthConfig, isPreviewMode, safeNext } from "@/lib/auth/config";
import { getAccount } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const preview = isPreviewMode();
  const enabled = Boolean(getAuthConfig()) && !preview;
  if (enabled && (await getAccount())) redirect(safeNext(params.next));
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12">
      <section className="w-full max-w-[440px] rounded-xl border border-line bg-surface p-8">
        <Wordmark />
        <h1 className="mt-9 font-display text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-3 text-secondary-ink">
          Sign in to your company’s studio. No password to remember.
        </p>
        {params.error === "link" && (
          <p role="alert" className="mt-4 text-sm text-secondary-ink">
            This sign-in link expired or could not be completed. Request a new
            link below, then open the newest email.
          </p>
        )}
        {!enabled && (
          <p role="status" className="mt-5 rounded-lg bg-wash p-4 text-sm">
            {preview
              ? "You’re viewing the local design preview. Account sign-in is not enabled here."
              : "Account setup is still in progress. Please contact your studio team."}
          </p>
        )}
        <LoginForm enabled={enabled} next={safeNext(params.next)} />
        {preview && (
          <Link
            className="mt-5 inline-block text-sm text-cobalt underline"
            href="/w/northline-windows"
          >
            Return to the app preview
          </Link>
        )}
      </section>
    </main>
  );
}
