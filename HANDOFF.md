# HANDOFF

Live state ledger. Newest at the top. Read AGENTS.md first.

## 2026-09-10 · Resend sender prepared; Squarespace login pending

- Trevor completed Resend signup and reported he was signed in. Verified the account in Chrome. Added `mail.laaksolabs.com` as an unverified sending domain in North Virginia; receiving stays disabled. No API key was created and Supabase SMTP is not yet connected.
- Public nameservers and the Resend setup page identify Squarespace as the DNS host. Prepared the exact three records in `docs/EMAIL-SETUP.md`. Public DNS has no matching records yet; no DNS records were changed.
- Opened Squarespace login in Chrome tab 1759128980 and asked Trevor to sign in to the account managing the domain. Resend domain setup remains in tab 1759128977. Next: review the existing zone, obtain the browser-required action-time confirmation for authorizing subdomain sending, add/verify the three records, connect Supabase SMTP, and finish Studio sign-in.

## 2026-09-10 · First agency invitation prepared; email sender needed

- Trevor selected his business email for the first Studio agency account. Prepared an agency invitation for that exact address using an operator-only empty-database bootstrap. Created the Happy Dog Media organization and an `agency-setup` administration workspace with zero ad allowance. No membership is granted until Supabase verifies the email and the user accepts the invitation. No Auth user was manually confirmed and no email was sent.
- Added `supabase/operations/prepare-first-agency.sql`, which accepts an operator email through a session setting, requires an empty application database, and creates the organization/workspace/invitation atomically. It is an operations script, not a migration. It has already run on the hosted project; do not rerun it there.
- Updated hosted Auth site URL to `http://127.0.0.1:3100` and allowed exact callback URLs for root, HQ, and workspace chooser. The site URL was previously localhost:3000. Production origin and broader return-path coverage still need their own validation before release.
- Hosted Auth has no custom SMTP sender. The selected business email is not an organization-member address, so Supabase's default sender cannot deliver to it. Trevor confirmed he has no app email service. Recommended Resend and opened its signup page in Chrome (tab 1759128977) for user completion. Resend signup includes accepting its terms and setting account credentials; the user must complete that step.
- Next: finish Resend account signup, verify an authorized sending domain (prefer a dedicated subdomain), connect its Supabase SMTP integration, then enable local live mode and send the authorized sign-in email. Never paste API keys into chat. Current localhost:3100 preview remains available. Agency invitation expiry is seven days from preparation.

## 2026-09-09 · Supabase connected and database foundation applied

- Trevor opened Supabase in Chrome and explicitly authorized CLI connection and project administration. Completed the official CLI browser-verification flow; the CLI now manages its own credential outside the repository. Linked this checkout to the verified, healthy `happydog-studio` project `chlzykttnwhnqbtpyohb`.
- Remote migration history contained timestamped versions of 0001 and 0002. Compared their stored SQL with local files, equivalent except comments/whitespace. Renamed local migrations to canonical timestamps, retaining the original numeric labels, and updated SQL test fixtures. Did not rewrite remote migration history.
- Preflight found no Auth users, companies, organizations, kit assets, brand systems/entities/traits/voices, invitations, or storage buckets. CLI dry run selected exactly the pending 0003, 0006, and 0008 migrations. Applied all three successfully.
- All nine local SQL scenarios pass. Added and ran `supabase/tests/hosted-access-smoke.sql`: hosted owner/agency isolation, invitation creation/acceptance/retry, RLS, anonymous function denial, and private buckets pass inside a transaction that rolls all fixtures back. No email was sent.
- Account email settings, first verified agency operator, actual hosted browser sign-in, and email delivery validation remain pending. Local port 3100 still shows the Northline preview. No customer-facing web deployment occurred. Next product batch remains immutable brand contents and source uploads.

## 2026-09-09 · Build started: account and company foundation

- Trevor authorized prioritizing and implementing the remaining work. `docs/BUILD-ORDER.md` records the dependency order. Preserve current navigation and six books; UI redesign remains deferred.
- Added login/PKCE/token-hash callbacks, cookie refresh proxy, sign-out, verified request-level membership checks, company chooser, explicit invitation acceptance, Agency HQ company creation, invitation saving/revocation, and real company shells without fixture leakage.
- Local sample mode now requires `STUDIO_MODE=preview`; live is the default and fails closed without configuration. An ignored `apps/web/.env.local` keeps the current Northline preview available and copies only public Supabase values from the prior checkout. Vercel production cannot use the preview flag.
- Added migration 0008 for invitation lifecycle and verified acceptance, atomic company creation, same-company relation constraints, asset-path ownership, and immutable company organization. Brand child/source immutability remains the next batch. Migration is tested locally, not applied to the hosted project.
- Added embedded PostgreSQL tests using PGlite with actual migrations and SQL roles. Added a localhost-only simulated-Auth browser fixture backed by the isolated SQL database; it is never deployed and sends no emails.
- Added a GitHub Actions check for lint, web/SQL tests, and a Webpack production build using Node 22. No cloud secrets are required for those checks.
- Validation: 15 web tests and 9 SQL scenarios pass; TypeScript and ESLint pass; Webpack production build passes. Turbopack hit a local process/port permission failure. Browser checks passed for login/callback/session persistence, sign-out, company/role denial, company creation, invitation save/accept/reload, and desktop/mobile layouts with simulated Auth and real isolated SQL.
- Supabase CLI has no management access token, so remote schema/account state has not been modified. Invitation email delivery, hosted Auth configuration, first agency provisioning, membership revocation UI, and hosted smoke tests remain open. `docs/ACCOUNT-FOUNDATION.md` contains activation instructions. No real invitation was sent.

## 2026-09-09 · Launch readiness checklist

- Trevor deferred UI/UX redesign, asked to inspect the actual app, then requested everything required before giving it to users. Preserve all navigation/features and six books; do not implement the reduced navigation from generated concepts.
- Added `docs/LAUNCH-CHECKLIST.md` with existing foundations, 14 delivery areas, recommended supported-pilot versus full-release sequencing, acceptance evidence, and a production go/no-go walkthrough.
- Covers accounts/tenant isolation, saved data, Agency HQ, original and website brand intake, offers/jobs, script/voice timing, OpenAI stills, Seedance/worker, assembly/quality, approvals/Library/Renders, billing/support, production operations, and retained Calendar/Insights/Chat/Feed/publishing scope.
- Source inventory confirms worker/shared packages are still absent and SQL files alone do not establish deployed backend readiness. No live service configuration was audited or changed. Updated BUILD-PLAN to point to the checklist and preserve scope.

## 2026-09-09 · Premium UI concepts for discussion

- Trevor asked for a review of the current UI/UX and three premium image mockups, then discussion before building the chosen upgrades.
- Reviewed and captured all six running owner screens. Main improvements: reduced navigation, stronger content/task hierarchy, readable scripts/scenes, larger approval media, persistent actions, contextual correction reasons, and Brand Room identity overview plus website intake.
- Generated three images with the built-in image tool using current app screenshots: Editorial Home, Brand Atelier, Screening Room. Saved concepts, before screenshots, exact prompts, a current/proposed comparison gallery, and review/build recommendations under `design/concepts/2026-09-ui-review/`.
- These are complementary proposed screens, not production UI or verified company media. The review documents required corrections to generated sample wording, branding, counts, checks, and inconsistent controls. Do not copy generated real-employee or legal-assurance claims into runtime UI.
- Application code remains unchanged pending the user's design discussion. Recommended build order: shared shell and controls, Home/Approvals, Brand Room/website intake preview, then Create/Script/Scenes using the same system.
- Validation: all three concept/current pairs load at full resolution in the comparison gallery; controls work at 1440 and 390 pixels without page overflow. `git diff --check` passes. Local comparison server runs at `http://127.0.0.1:3102` for this session; the standalone HTML also opens from disk.

## 2026-09-09 · Website-based brand setup added to plan

- Trevor requested website URL intake using Firecrawl or an equivalent to develop a company design system, especially for smaller companies with few assets.
- Added `docs/WEBSITE-BRAND-SETUP.md`: Start from your website in onboarding/Brand Room, source review, keep/improve direction choices, generated gap filling, template previews, approval/export, provenance, bounded ingestion, and implementation acceptance criteria.
- Firecrawl's primary docs confirm branding extraction and page discovery capabilities. This is the preferred extraction candidate; no live import, API credentials, or paid generation was used.
- Added Start from a website to the interactive workflow map and connected the new path to the main build/branding plans. Minimal OpenAI concepts move into company setup before the later video pilot.
- Website observations, generated proposals, and owner approval remain separate. Sparse kits can enable designed-card ads without fabricated employee/product references. Re-imports create drafts and cannot mutate locked versions.
- Validation: all four workflow views and 31 step details pass browser checks at 1440 and 390 pixels with no horizontal overflow or script errors. `git diff --check` passes. Application runtime remains unchanged.

## 2026-09-09 · Branding and workflow planning review

- Trevor asked to strengthen the application recommendations, inspect the current workflow, and prioritize company branding. Confirmed front-runners: OpenAI / ChatGPT images and Seedance 2.5. Confirmed support for both real employees and recurring synthetic characters, approved per company.
- Added `docs/BRAND-WORKFLOW-PLAN.md` with current-versus-proposed workflow, stronger product recommendations, enforceable brand fields, immutable references, still checks before video, measured voice timing, and phased acceptance criteria.
- Added `docs/workflow-review.html`, an interactive planning map with current workflow, proposed production workflow, and brand-book details. This is a planning artifact outside the owner app.
- Validation: all 25 workflow steps show the correct details at desktop and mobile widths; no horizontal overflow at 1440 or 390 pixels. `git diff --check` passes. No application code changed in this planning pass.
- Updated `docs/BUILD-PLAN.md` to record the confirmed provider direction and link the newer plan. OpenAI's current documentation recommends GPT Image 2.5; Sunburst is the candidate for final brand-sensitive work. Seedance 2.5's selected account/API route and real-person reference eligibility still require verification before implementation.
- Proposed workflow and database changes remain for discussion. No provider calls, billing changes, schema migrations, or runtime behavior changes were made in this planning pass. Existing synthetic-voice policy is not treated as permission to clone real employee voices.

## 2026-09-09 · Codex continuation and five-screen preview

- Connected the GitHub repository to `/Users/trevor/Documents/ChatGPT/Studio 2.0` on `codex/continue-studio`. The earlier checkout at `~/happydog-studio` was not modified.
- Trevor chose the remaining screens first, and asked for an application review with suggestions for discussion.
- Added Create from Deal, Script, Storyboard, Approval Queue, and Brand Room against references 01 and 03 through 06. The script and scene walkthrough uses job ID `heating-outdoors`; other job IDs return 404.
- Shared the existing shell, fonts, button component, and palette. Kept the existing text-only navigation instead of adopting the inconsistent rails and decorative browser chrome in the other renders.
- `lib/studio-preview.ts` is the single typed sample payload and pure interaction reducer. A workspace-scoped client provider keeps edits and decisions during navigation and resets on reload. The sidebar and Home state card reflect preview decisions. Allowance remains unchanged.
- Interactions: editable script lines, five sample openings, scene image swap, approval/redo/skip, A/R/S and arrow keyboard controls outside editable controls, required redo reasons, queue completion/restart, brand-book details, and an unsent sample change request. Editing approved words invalidates the scene approval gate. Empty script lines cannot be approved.
- Every new screen identifies itself as a design preview. No voice sample or video is fabricated. Generation buttons lead through explicit sample screens and a completion dialog. Script edits invalidate displayed sample checks.
- Reference photos are clipped photographic regions of unchanged design files under `public/fixtures/reference`. They preserve the supplied visual language but require real, optimized assets before launch. They are not final product or cast media.
- Validation: 11 node tests, TypeScript, ESLint, and production build pass. All five routes return 200 at 1440, 1024, and 390 with no horizontal page overflow. Browser walkthrough verifies edit → approve words → approve scenes → queue, count synchronization, unchanged allowance, redo validation, keyboard typing isolation, completion/restart, brand details, and change-request dialog.
- Corrected the test's literal forbidden punctuation to a Unicode escape without weakening its assertion.
- `docs/APP-REVIEW.md` records product suggestions and code findings for discussion, including timing, skipped ads, brand immutability, tenant relationships, and existing-account invitations.
- Not connected: auth, Supabase reads/writes, migration 0004, generation, playback, voice, source-file upload, or real request delivery. Calendar, Library, Renders, Insights, Chat, Feed, and Offer remain the original placeholders. No production deployment or database changes.

## 2026-09-09 · Repo opened up for a second developer

- Private repo live at github.com/tlaakso07/happydog-studio, default branch `main`. Only `.env.example` is tracked, no secrets.
- `ONBOARDING.md` is the entry point for anyone new, human or agent: setup, the rules that get work rejected, what is deliberately not built, and the working agreement.
- `README.md` points at it. `CLAUDE.md` still auto-loads `AGENTS.md` and `HANDOFF.md`, so a Claude Code session in this directory is briefed on open.
- The six approved renders moved into `design/reference/` and the plan into `docs/BUILD-PLAN.md`. `AGENTS.md` now points at both in-repo instead of at paths under Trevor's home directory, so the repo is self-contained.
- Working agreement: branch off main, open a pull request, add a HANDOFF entry in the same pull request. Not enforced by branch protection yet.
- Still open: Ryan's GitHub username, so he can be added as a collaborator.

## 2026-09-09 · Studio Home built

- `/w/[slug]` Studio Home is built against reference render 02: state card, offer bar, Fresh out of the studio grid, 232px rail with the allowance card. Verified at 1440, 1024 and 390.
- Elevated Studio tokens are live in `app/globals.css` (paper, surface, ink, secondary, meta, lines, cobalt, wash, ground, checked). Fonts wired in `app/layout.tsx`: Archivo display, Instrument Sans UI, Spline Sans Mono for data via the `.tnum` class.
- One button vocabulary: `components/ui/button.tsx` was edited rather than adding a second button. Pill radius, `xl` is the 44px control, `md` is 40px, new `ground` variant for the dark offer bar.
- `lib/product.ts` holds the wordmark. `lib/plain.ts` holds the four owner status words and the script labels. `lib/nav.ts` holds sidebar order.
- Home data comes from `getHomePayload()` in `lib/studio-home.ts`, a fixture shaped exactly like the query it replaces. Migration 0004 does not exist yet, so there is nothing to select. Swapping that one function for the Supabase query is the only change Home needs.
- Every sidebar destination has an honest empty state so no nav link 404s: calendar, create, brand, library, renders, approvals, insights, chat, feed, offer.
- Root `/` redirects to `/w/northline-windows`. The real rule (owner to their workspace, agency to `/hq`, none to `/no-access`) needs auth.
- Checks: `pnpm --filter @studio/web test` runs six assertions over the home state machine and the meta line, on the node test runner with no new dependency. tsc and eslint clean.
- Fixed on the way in: root `pnpm-workspace.yaml` had the literal string `set this to true or false` under `allowBuilds`, which made every `pnpm dev` exit 1 before Next started.
- Not built: topbar (the render has none and an owner cannot switch workspaces), auth, real data.

## 2026-09-04 · M0 in progress

- Repo created at `~/happydog-studio` (the Desktop folder name contains colons that break pnpm). Notes and session memory stay in `~/Desktop/Meta:UCG:Video App Happy Dog`.
- Supabase project `happydog-studio` created on org Laakso Labs, ref `chlzykttnwhnqbtpyohb`, us-east-1, $0/month. Migrations 0001 (tenancy) and 0002 (brand system) applied. 0003 (offers, library) written, pending apply. 0004 (jobs) next.
- `apps/web` scaffolded: Next 16, Tailwind v4, shadcn radix-nova, `@supabase/ssr`, zod. 22 official vendor marks in `apps/web/public/logos/`.
- `apps/web/.env.local` has the URL and anon key. `SUPABASE_SERVICE_ROLE_KEY` still needs pasting from the dashboard (invite action only).
- Open items Trevor owns: Higgsfield Cloud API key pair, ElevenLabs and FASHN keys (voices and try-on), Gemini or kie.ai key, product name, Ryan's email, SMTP (Resend or Postmark) in Supabase Auth before the invite goes out.
