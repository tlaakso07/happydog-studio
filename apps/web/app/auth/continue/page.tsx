import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/shell/wordmark";
import { Button } from "@/components/ui/button";
import { getAuthConfig, isPreviewMode } from "@/lib/auth/config";
import { parsePendingEmail, pendingEmailCookie } from "@/lib/auth/email-link";
import { completeEmailSignIn } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ContinueSignIn() {
  const jar = await cookies();
  const pending = parsePendingEmail(jar.get(pendingEmailCookie)?.value);
  if (!getAuthConfig() || isPreviewMode() || !pending.success)
    redirect("/login?error=link");
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12">
      <section className="w-full max-w-[440px] rounded-xl border border-line bg-surface p-8">
        <Wordmark />
        <h1 className="mt-9 font-display text-3xl font-semibold tracking-tight">
          Finish signing in
        </h1>
        <p className="mt-3 text-secondary-ink">
          Continue to sign in with the email link you opened.
        </p>
        <form action={completeEmailSignIn} className="mt-7">
          <Button type="submit" className="h-11 w-full">Continue to my studio</Button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm text-cobalt underline">
          Use a different email
        </Link>
      </section>
    </main>
  );
}
