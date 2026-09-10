# Account foundation: implementation and activation

## Implemented

- `/login`: validated magic-link form and explicit unconfigured/preview states.
- `/auth/callback`: PKCE exchange with internal-only return paths.
- `/auth/confirm`: token-hash email/invite confirmation; tokens are removed from the destination URL.
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

The existing sibling checkout supplied only public Supabase configuration to the ignored local environment file. The production database was not modified. Supabase CLI inspection reported that no access token is configured.

## Hosted activation, in order

1. Sign in with `supabase login` on this Mac, or configure a management token locally through the normal CLI workflow. Do not include tokens in commits, shell history shared with others, or chat.
2. Verify the existing Happy Dog project and remote migration history before linking or pushing. Compare it with local migrations 0001, 0002, 0003, 0006, and 0008. The historical numbering has gaps; do not reset the project or assume every file is applied.
3. Review migration 0008 against existing data. Audit cross-company references and kit paths before applying; invalid rows should cause a reviewable failure rather than be silently rewritten. Old invitation expiry is based on its original creation time, not the migration date.
4. Apply migrations through the Supabase CLI to the selected staging/production environment after that comparison. Verify constraints, RLS, function grants, and a two-company access test in the hosted system.
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
