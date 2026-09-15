# Vercel sample beta

This deployment is a shareable copy of the existing no-login sample app. It does not connect to live company data, generate media, or persist sample edits after reload.

Share URL: https://happydog-studio-beta.vercel.app

Verified preview: https://happydog-studio-beta-j5frwvq80-tlaakso11-3399s-projects.vercel.app

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
- Vercel Authentication is disabled on this dedicated sample project so the shared link can open without a Vercel account.

## Deploying an update

Use an explicit Vercel **preview** target. `isPreviewMode()` deliberately rejects production deployments. Do not weaken that guard or promote this sample deployment to production.

The initial deployment was uploaded from a clean tracked-source export under `/tmp/studio-vercel-beta`, without ignored environment files or local dependencies. Future uploads should use the same clean-source approach and verify the selected project before deployment. GitHub is not connected for automatic deployments.

```sh
vercel deploy --yes --target preview --scope tlaakso11-3399s-projects --env STUDIO_MODE=preview --build-env STUDIO_MODE=preview
```

Run that command only from a clean export linked to this project. Once the preview is READY, check the anonymous home, login redirect, brand room, script, scenes, and approvals routes before sharing it. If updating the stable alias, point it at the verified preview URL with `vercel alias set`; do not use `vercel promote`.

Public sample access does not grant repository collaboration or access to real company records. Keep the authentication defect recorded in `BETA-HANDOFF.md` as a release blocker for live customer use.
