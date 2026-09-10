# HANDOFF

Live state ledger. Newest at the top. Read AGENTS.md first.

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
