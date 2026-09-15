# Vercel sample beta

This deployment is a shareable copy of the existing no-login sample app. It does not connect to live company data, generate media, or persist sample edits after reload.

Share URL: https://happydog-studio-beta.vercel.app

Verified preview: https://happydog-studio-beta-oe04ek8kr-tlaakso11-3399s-projects.vercel.app

The short URL is an alias to that preview deployment. It is not a promotion to the production environment.

## Project

- Vercel team: `tlaakso11-3399s-projects`
- Project: `happydog-studio-beta`
- Project ID: `prj_3TQVaQvCEsxDIicjFbi175aeYFKL`
- Root directory: `apps/web`
- Framework: Next.js
- Install command: `cd ../.. && npx --yes pnpm@11.9.0 install --frozen-lockfile`
- Build command: `npx --yes pnpm@11.9.0 exec next build --webpack`
- Preview environment: `STUDIO_MODE=preview`
- No Supabase, email, or generation credentials are configured for this project.
- Application password access is enabled. `STUDIO_PREVIEW_PASSWORD` is a sensitive, server-only Vercel environment variable for Preview. Never commit or print its value.
- The password page is served at `/preview-access` before application routes or static assets. A successful same-origin form submission issues an HttpOnly, Secure, SameSite=Strict cookie lasting 24 hours. Missing configuration, bad passwords, malformed bodies, expired or forged cookies fail closed. The page needs no external scripts, fonts, or CSS.
- Native Vercel password protection and Vercel account protection are both disabled. No paid password-protection add-on was enabled. Share the password only with the intended reviewers; possession of the shared password grants beta access.
- All three superseded deployments were removed before disabling temporary Vercel account protection. Their direct URLs must not be reused.

## Changing the password

Update `STUDIO_PREVIEW_PASSWORD` as a sensitive Preview variable and redeploy explicitly to Preview. Repoint the stable alias to the verified new deployment, then retire deployments holding the old password. Password rotation invalidates signed sessions on the new deployment; old deployments retain their own environment snapshots until retired.

To lock a browser early, clear its cookies for the beta site. Ordinary local `pnpm dev` stays open unless `STUDIO_PREVIEW_PASSWORD` is set locally. Hosted Preview and Production environments require the password configuration; the underlying production customer-auth rule still applies independently.

## Verification

Test the native browser form with an incorrect password followed by the correct password, then reload Home to verify the session. The form response must use `Referrer-Policy: same-origin`; `no-referrer` makes native form submissions send a null Origin and fail the security check. Requests from other websites or with null/missing origins must remain rejected. A raw HTTP test that explicitly supplies Origin cannot replace the browser test.

`pnpm --filter @studio/web test` covers password comparison, fail-closed configuration, expiration, tampering, and rotation. `scripts/check-preview-gate.mjs` checks the password page, invalid/oversized/cross-origin requests, valid entry, protected pages/assets/actions, and forged cookies. Supply `STUDIO_GATE_TEST_URL` and `STUDIO_GATE_TEST_PASSWORD` privately through the process environment. Do not log them or place credentials in command arguments.

## Deploying an update

Use an explicit Vercel **preview** target. `isPreviewMode()` deliberately rejects production deployments. Do not weaken that guard or promote this sample deployment to production.

The initial deployment was uploaded from a clean tracked-source export under `/tmp/studio-vercel-beta`, without ignored environment files or local dependencies. Future uploads should use the same clean-source approach and verify the selected project before deployment. GitHub is not connected for automatic deployments.

```sh
vercel deploy --yes --target preview --scope tlaakso11-3399s-projects --env STUDIO_MODE=preview --build-env STUDIO_MODE=preview
```

Run that command only from a clean export linked to this project. Once the preview is READY, check the anonymous home, login redirect, brand room, script, scenes, and approvals routes before sharing it. If updating the stable alias, point it at the verified preview URL with `vercel alias set`; do not use `vercel promote`.

Public sample access does not grant repository collaboration or access to real company records. Keep the authentication defect recorded in `BETA-HANDOFF.md` as a release blocker for live customer use.
