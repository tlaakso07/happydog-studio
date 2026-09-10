# Shared development beta

Trevor requested that sign-in be removed from the beta on September 10, 2026 so product work can continue with his partner. The current shared branch is `codex/continue-studio`, in draft PR #1. Main may be behind it.

## Start

Use Node 22+ and pnpm 11.9.0, as pinned in package.json.

```sh
git clone --branch codex/continue-studio https://github.com/tlaakso07/happydog-studio.git
cd happydog-studio
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. Root and /login lead directly to /w/northline-windows. No account, email, Supabase keys, or environment file is required. The beta runner explicitly selects sample mode, even if a local environment file previously selected live mode. `pnpm dev:beta` does the same thing. For Trevor's existing port, use `pnpm dev --port 3100`.

## What the beta does

The full existing navigation, six brand books, and owner screen walkthrough remain available. Script edits, scene decisions, and approval counts work with sample data during navigation. Reloading resets those edits. Placeholder destinations remain clearly unfinished. This is the current product development beta, not access to real company accounts or live generation.

## Deferred defect: real email login loops

Trevor still returned to /login?error=link after the cross-browser email change and fresh email. Do not report real sign-in as fixed. Resend domain verification, SMTP, and the new Supabase email templates are configured. The isolated Auth regression passes, but that does not reproduce or verify Trevor's real browser session.

When Auth work resumes, trace one fresh real attempt through /auth/confirm, the pending cookie, /auth/continue POST, verifyOtp, session cookie writing and the protected destination. Check server error codes without logging tokens, cookies or email-link URLs. Confirm the exact email and local server version used. Do not send repeated emails blindly; new requests can invalidate old links. The first agency invitation may need expiry review before acceptance.

## Live mode and collaboration

`pnpm dev:live` intentionally restores authenticated local development using apps/web/.env.local. The underlying default and production deployment behavior still require Auth; the beta runner only selects the existing sample path. No service-role login, public database policies, fake membership, or hosted Auth bypass was added.

Create a branch from the latest shared beta, keep work in pull requests, and update HANDOFF.md with changes and checks. Use AGENTS.md for architecture and design conventions. Start from the existing application and preserve its navigation and brand books. Do not commit environment files or share API keys.

Next product work remains in docs/BUILD-ORDER.md. Authentication is a recorded release blocker to revisit before giving users live company access.
