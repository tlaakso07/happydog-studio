"use client";

import { useActionState } from "react";
import { requestSignIn } from "@/app/login/actions";
import { emptyForm } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  enabled,
  next,
}: {
  enabled: boolean;
  next: string;
}) {
  const [state, action, pending] = useActionState(requestSignIn, emptyForm);
  return (
    <form action={action} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@company.com"
          disabled={!enabled || pending}
          className="h-11"
        />
      </div>
      <Button
        type="submit"
        disabled={!enabled || pending}
        className="h-11 w-full"
      >
        {pending ? "Sending your link…" : "Email me a sign-in link"}
      </Button>
      <p
        role={state.status === "error" ? "alert" : "status"}
        className="text-sm text-secondary-ink"
      >
        {state.message}
      </p>
    </form>
  );
}
