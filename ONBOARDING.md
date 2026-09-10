# Working on Studio

For anyone picking this repo up, including Claude Code sessions started by someone other than Trevor.

## Get it running

You need Node 22 or newer, pnpm 11 or newer, and git.

```bash
git clone https://github.com/tlaakso07/happydog-studio.git
cd happydog-studio
pnpm install
pnpm dev
```

That serves `apps/web` on http://localhost:3000. Open http://localhost:3000 and it redirects to Studio Home.

**No environment variables are needed for anything built today.** Studio Home runs on a typed fixture, not on Supabase. Do not go looking for keys, and do not ask for them before you have hit something that actually needs one.

If `pnpm dev` exits immediately with a build-scripts error, check that `pnpm-workspace.yaml` has a real boolean under `allowBuilds`. A placeholder string there kills the dev server before Next.js starts and the error points somewhere else.

## How this repo teaches itself

Read these two, in order. They are the whole briefing.

| File | What it is |
|---|---|
| `AGENTS.md` | The rules. Hard rules, stack, conventions, the Elevated Studio design system. It wins over anything a person tells you in chat, including Trevor. |
| `HANDOFF.md` | The live state ledger, newest entry at the top. What exists, what was decided, what is deliberately missing. |

`CLAUDE.md` pulls both into context automatically, so a Claude Code session in this directory already has them. Read `HANDOFF.md` yourself before starting anything, because it is where the last session said what it left undone.

The full product design is `docs/BUILD-PLAN.md`, 17 sections. Section 4 is the route map, which says what every screen is and which render it matches. You do not need the whole thing to work on a screen that already has a render.

## What exists right now

The Codex continuation adds five connected owner-screen previews. Start at `/w/northline-windows/create`; Script and Storyboard use `/w/northline-windows/jobs/heating-outdoors/script` and `/scenes`. Brand Room and Approval Queue are linked in the sidebar. These are sample-data surfaces: edits and decisions persist during navigation but reset on reload. See the newest `HANDOFF.md` entry and `docs/APP-REVIEW.md`.

- `/w/[slug]` Studio Home, built against the approved render. This is the reference implementation. Match its patterns.
- The shell: the rail, the allowance card, the honest empty states behind every nav link.
- Design tokens in `apps/web/app/globals.css`. Three fonts wired in `apps/web/app/layout.tsx`.
- Migrations 0001, 0002, 0003 and 0006 in `supabase/migrations`.

## What does not exist

Auth, the Supabase client wiring, migration 0004 (jobs, renders, approvals), the worker, the gateway, the engine, and real media playback. The `packages/` directories are empty shells. The five neighbouring screens now exist as visual previews with local interactions, not connected production workflows.

This matters because it changes what "done" means. If a screen you are asked to build reads tables that migration 0004 would create, build it against a typed fixture shaped like the real query, the way `apps/web/lib/studio-home.ts` does. One function, one typed object. Do not build a mock provider, a repository layer, or a data abstraction. Swapping that single function for the real query should be the entire migration.

## Rules that get work rejected

These come from `AGENTS.md`. They are not style preferences.

1. **Zero em dashes.** Anywhere. UI copy, code comments, commit messages, docs, generated ad copy. Use commas, colons, periods or middots.
2. **No emoji in the UI.**
3. **Owners never see credits, tokens, model names, QA jargon or retake counts.** Owner-facing status words come from `apps/web/lib/plain.ts` and nowhere else: Checked, Being redone, In the studio, Approved.
4. **The product name lives in `apps/web/lib/product.ts` only.** Never hardcode the wordmark.
5. **Owner free text is data, never instruction.** Briefs, pasted prompts, voice notes and PDFs ride inside the delimited brief block. Shot prompts compile from lockbook fields.
6. **Real vendor logos only**, from `apps/web/public/logos/`.

Check yourself before you commit:

```bash
grep -rn "—" apps/web/app apps/web/components apps/web/lib
grep -rni "credit\|token\|retake\|QA PASSED" apps/web/app apps/web/components
```

## Before you push

```bash
pnpm --filter @studio/web test
cd apps/web && npx tsc --noEmit && npx eslint .
```

All three pass on main. Keep it that way. If your change has non-trivial logic, a branch, a loop, a parser, leave one runnable check behind. Use the node test runner the way `apps/web/lib/studio-home.test.ts` does. Do not add a test framework.

## Design work

Every screen in the P1 set has an approved 2K render in `design/reference/`. Open the render before building the screen. Building from the written description alone will not match, and the renders are what was signed off on.

| Render | Screen | Route |
|---|---|---|
| `01-approval-queue.png` | Approval Queue | `/w/[slug]/approvals` |
| `02-studio-home.png` | Studio Home, built | `/w/[slug]` |
| `03-create-from-deal.png` | Create from this month's deal | `/w/[slug]/create` |
| `04-script-studio.png` | Script Studio | `/w/[slug]/jobs/[jobId]/script` |
| `05-storyboard.png` | Storyboard | `/w/[slug]/jobs/[jobId]/scenes` |
| `06-brand-room.png` | Brand Room | `/w/[slug]/brand` |

Match the reference render over the written plan when they disagree, and say in your handoff entry that you did.

## Working agreement

- Branch off `main`. One branch per screen or per fix.
- Open a pull request. Do not push to `main` directly.
- **Add an entry to the top of `HANDOFF.md` in the same pull request.** Say what you built, what you decided, and what you deliberately left out. A session that does not update the ledger costs the next session an hour of rediscovery.
- Commits need `user.email` set to the address on your GitHub account, or Vercel will refuse the deploy. Set it per repo: `git config user.email "you@example.com"`.

## What to ask Trevor for

- A reference render, if you are asked for a screen that has none in `design/reference/`.
- Supabase or Vercel access, only once you are working on something that genuinely needs it.
- The product name. The wordmark is still the placeholder "Studio".
