"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl space-y-4 px-5 py-16">
      <h1 className="font-display text-3xl font-semibold">
        We couldn’t load this page
      </h1>
      <p className="text-secondary-ink">
        Please try again. If it keeps happening, contact your studio team.
      </p>
      <Button className="h-11" onClick={reset}>
        Try again
      </Button>
      <a className="ml-4 text-cobalt underline" href="/workspaces">
        Your companies
      </a>
    </main>
  );
}
