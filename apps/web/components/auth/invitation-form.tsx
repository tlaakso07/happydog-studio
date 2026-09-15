"use client";
import { useActionState } from "react";
import { acceptInvitation } from "@/app/workspaces/actions";
import { emptyForm } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";

export function InvitationForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(acceptInvitation, emptyForm);
  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="invitationId" value={id} />
      <Button
        type="submit"
        disabled={pending || state.status === "success"}
        className="h-11"
      >
        {pending ? "Joining…" : "Accept invitation"}
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
