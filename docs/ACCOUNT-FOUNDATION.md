# Account foundation: implementation and activation

Current beta: `pnpm dev` opens the sample workspace without sign-in. Trevor deferred the unresolved real email login on September 10. Use `pnpm dev:live` only when intentionally resuming Auth work. See [BETA-HANDOFF.md](BETA-HANDOFF.md).

## Implemented

- `/login`: validated magic-link form and explicit unconfigured/preview states.
- `/auth/callback`: PKCE exchange with internal-only return paths.
- `/auth/confirm`: stages a token-hash email/invite link in an HttpOnly cookie and redirects to a clean `/auth/continue` page. Explicit POST verifies the token, so GET previews cannot consume it. Both hosted email templates are activated and independently verified.
- `/workspaces`: verified account, visible memberships, invitation review and acceptance, company switching, sign-out.
- `/hq`: agency-only company list, transactional company creation, role-specific invitations, pending invitation list and revocation. Saving an invitation does not send an email; this is stated in the form.
- `/w/[slug]`: authenticated live company shell and honest setup states. Sample screens remain accessible in explicit local preview mode. No customer company receives Northline sample people, offers, approvals, or usage counts.
- `proxy.ts`: Supabase cookie refresh and private cache headers. Pages/actions independently verify the current user and membership; the proxy is not the authorization boundary.
- Migration `0008_access_foundation.sql`: verified invitation acceptance, expiration/revocation/history, no signup-trigger auto-membership, safe company creation, same-workspace foreign keys, asset-path ownership, and fixed company organization ownership.

All protected data access uses the user's Supabase session and row policies. There is no service-role key in the application access path. The parent/child brand lock hardening is the next batch; the existing parent guard is not sufficient for production brand approval.

## Configuration

Next.js reads web configuration from `apps/web/.env.local` for local development. Copy the public configuration example in that directory and fill the values locally. Never paste keys or session tokens into chat or commit environment files.

- `STUDIO_MODE=live` is the default. Missing configuration fails closed at sign-in; it does not silently enable samples.
- `STUDIO_MODE=preview` preserves the existing Northline walkthrough locally. Production Vercel deployments ignore this preview flag. Do not set it for customer-facing deployments.
- Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or the existing `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `NEXT_PUBLIC_APP_URL` must be the full trusted origin. HTTPS is required outside localhost. Auth redirects use this configured origin, not an arbitrary request header or submitted URL.

The existing sibling checkout supplied only public Supabase configuration to the ignored local environment file. The Supabase CLI is now authenticated and this checkout is linked to `happydog-studio`, project `chlzykttnwhnqbtpyohb`. Credentials are managed by the CLI and are not stored in the repository. The local app is in live mode; first-operator sign-in and invitation acceptance remain pending.

## Hosted database activation: September 9, 2026

Trevor authorized connecting the CLI and administering the app's existing project. Verified its identity, healthy status, migration history, and empty application/Auth/storage data before deployment. The original two migrations had timestamp versions in Supabase but short local filenames. Their stored SQL matched the local files after excluding comments and whitespace. Aligned local filenames to the existing remote versions without rewriting remote history, then assigned ordered timestamps to the three pending migrations.

| Migration | Canonical version | Hosted state |
| --- | --- | --- |
| 0001 tenancy | 20260905054542 | Previously applied, verified |
| 0002 brand system | 20260905054627 | Previously applied, verified |
| 0003 offers and library | 20260910063730 | Applied |
| 0006 private storage | 20260910063731 | Applied |
| 0008 account foundation | 20260910063732 | Applied |

The migration filenames retain the original numbers as labels after their timestamp. Earlier references to `0008_access_foundation.sql` mean `supabase/migrations/20260910063732_0008_access_foundation.sql`.

The CLI dry run selected only the three pending migrations. All nine local SQL scenarios passed before deployment. `supabase/tests/hosted-access-smoke.sql` then passed on hosted Supabase: owner isolation and denied company creation, agency access, invitation creation and verified acceptance with safe retries, public-table RLS, anonymous invitation denial, and private media buckets. It runs inside a transaction and rolls back every test account and company. No emails were sent. This SQL check does not establish email deliverability or a real browser login session.

### First operator and email setup

The first operator has now chosen their email in the task. An operator-only bootstrap saved a seven-day agency invitation in the new `agency-setup` workspace under Happy Dog Media. That workspace is for administration and has zero ad allowance. `supabase/operations/prepare-first-agency.sql` documents the executed operation and refuses to run against an application database that already contains organizations, workspaces, memberships, or invitations. Email verification and explicit acceptance remain required before agency access is granted.

The hosted Auth site URL is now `http://127.0.0.1:3100`, with exact callback URLs for the root, HQ, and workspace chooser return paths. Resend domain verification and custom SMTP configuration are complete with an approved sending-only credential scoped to mail.laaksolabs.com. Local live mode is enabled. Cross-browser email templates are active and isolated HTTP sign-in regression passes. One fresh email request was accepted by Supabase; actual receipt, real sign-in, and agency invitation acceptance remain pending. See `docs/EMAIL-SETUP.md` for verified settings and the temporary local server location.

Sources: [Supabase default sender limitations](https://supabase.com/docs/guides/auth/auth-smtp), [Resend integration](https://supabase.com/partners/resend).

```sh
supabase db query --linked --file supabase/tests/hosted-access-smoke.sql --output json
```

## Hosted activation checklist

1. Complete: CLI sign-in through Supabase's official browser verification flow.
2. Complete: verified and linked the existing project; matched migration SQL and aligned filenames with remote history. No database reset or history repair was used.
3. Complete: preflight found no users, companies, brand data, kit assets, invitations, or buckets to migrate. Old invitation expiry still uses its original creation time.
4. Complete: pending migrations applied through the CLI; hosted transaction checked company access, RLS, function grants, and private buckets.
5. Configure the trusted app origin and exact allowed callback URL in Supabase Auth. For token-hash email templates, use the server confirmation route with the appropriate email/invite type. Follow the official server-side Auth template guide.
6. Configure and test the selected email sender and provider rate limits. Account creation alone must not grant company access. Public magic-link abuse protection/rate limiting and SMTP deliverability need hosted validation before inviting users.
7. Provision the first verified agency operator through an operator-controlled CLI process in the correct organization/workspace. Agency HQ intentionally cannot let an arbitrary new account grant itself the first agency role. Never infer the operator identity from a submitted form or an email domain.
8. Switch the intended web environment to live mode. Run real email sign-in, new and existing-user invitations, company switching, owner/agency denial, expiry/revocation, sign-out, and cookie persistence checks. Do not send real invitations until the intended recipients are supplied and sending is authorized.

## Local verification

```sh
pnpm --filter @studio/web test
pnpm test:db
pnpm --filter @studio/web lint
pnpm --filter @studio/web exec next typegen
pnpm --filter @studio/web exec tsc --noEmit
pnpm --filter @studio/web exec next build --webpack
```

The local Turbopack build hit a process/port permission failure; Webpack completed the production build. No build-script change hides that limitation. If Turbopack still fails in an environment where the process issue is absent, investigate it separately.

SQL tests run the actual migration files in embedded PostgreSQL with citext and pgcrypto. The harness supplies minimal Supabase Auth/storage tables and authenticated/anonymous roles. It checks RLS and relationship constraints with multiple tenants, including an agency user who belongs to both. This does not replace hosted Supabase or concurrent-session testing.

`supabase/tests/browser-fixture.mjs` is a localhost-only test service backed by the same isolated SQL fixtures. Its Auth transport is simulated; it never sends emails or connects to production. Start it only for browser tests:

```sh
node supabase/tests/browser-fixture.mjs
STUDIO_MODE=live NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:3104 NEXT_PUBLIC_SUPABASE_ANON_KEY=local-test-public-key NEXT_PUBLIC_APP_URL=http://127.0.0.1:3103 pnpm --filter @studio/web start --hostname 127.0.0.1 --port 3103
```

The fixture's known test accounts and token/hash endpoints are test-only. Never deploy this service or use its tokens as authentication for real data.

Browser verification completed: anonymous redirects across protected routes, magic-link request and PKCE exchange, token-hash exchange, session persistence, owner denial for another company/HQ, sign-out, agency company creation, invitation saving and persistence, invitee acceptance and reload, live/demo separation, safe failed callbacks, and desktop/mobile layout checks.

## Sources

- [Supabase SSR client and proxy](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase Auth email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- Installed Next.js guides under `apps/web/node_modules/next/dist/docs/`, particularly authentication, proxy, and route handlers.
