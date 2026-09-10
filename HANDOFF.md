# HANDOFF

Live state ledger. Newest at the top. Read AGENTS.md first.

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
