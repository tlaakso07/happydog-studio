"use client";
import { useActionState } from "react";
import {
  createCompany,
  saveInvitation,
  revokeInvitation,
} from "@/app/hq/actions";
import { emptyForm } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Option = { id: string; name: string };
const field =
  "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm";

export function CreateCompanyForm({ orgs }: { orgs: Option[] }) {
  const [state, action, pending] = useActionState(createCompany, emptyForm);
  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-line bg-surface p-6"
    >
      <h2 className="text-xl font-semibold">Onboard a company</h2>
      <div className="space-y-2">
        <Label htmlFor="orgId">Agency</Label>
        <select id="orgId" name="orgId" className={field} required>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-name">Company name</Label>
        <Input
          id="company-name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-slug">Company address</Label>
        <Input
          id="company-slug"
          name="slug"
          required
          minLength={2}
          maxLength={64}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="northline-windows"
          className="h-11"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-11">
        {pending ? "Creating…" : "Create company"}
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

export function InviteCompanyForm({
  companies,
  loginUrl,
}: {
  companies: Option[];
  loginUrl: string;
}) {
  const [state, action, pending] = useActionState(saveInvitation, emptyForm);
  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-line bg-surface p-6"
    >
      <h2 className="text-xl font-semibold">Invite someone</h2>
      <div className="space-y-2">
        <Label htmlFor="companyId">Company</Label>
        <select id="companyId" name="companyId" className={field} required>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="invite-email">Email address</Label>
        <Input
          id="invite-email"
          name="email"
          type="email"
          required
          maxLength={254}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invite-role">Access</Label>
        <select
          id="invite-role"
          name="role"
          className={field}
          defaultValue="owner"
        >
          <option value="owner">Owner</option>
          <option value="agency">Agency</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>
      <Button type="submit" disabled={pending} className="h-11">
        {pending ? "Saving…" : "Save invitation"}
      </Button>
      <p
        role={state.status === "error" ? "alert" : "status"}
        className="text-sm text-secondary-ink"
      >
        {state.message}
      </p>
      <p className="break-all text-sm text-secondary-ink">
        Sign-in address to share:{" "}
        <a className="text-cobalt underline" href={loginUrl}>
          {loginUrl}
        </a>
      </p>
    </form>
  );
}

export function RevokeInvitationForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(revokeInvitation, emptyForm);
  return (
    <form action={action}>
      <input name="invitationId" value={id} type="hidden" />
      <Button
        variant="outline"
        type="submit"
        disabled={pending || state.status === "success"}
      >
        {pending ? "Revoking…" : "Revoke"}
      </Button>
      <p
        className="mt-1 text-sm"
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </p>
    </form>
  );
}
