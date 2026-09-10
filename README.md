# Studio

Enterprise AI ad-content platform for home-services companies, codenamed Happy Dog.

An agency locks a company's brand into a per-company brand system. The owner states a monthly deal, approves the words, approves the scenes, the system renders once, machine QA checks it, and the owner approves the finished ad in a queue.

## Start here

**New to the repo, human or agent: read [ONBOARDING.md](ONBOARDING.md).** It covers setup, the rules that get work rejected, and what is deliberately not built yet.

**Ryan's Mac + Claude desktop guide:** download [the interactive HTML guide](docs/ryan-guide.html) and open it in a browser. It includes the current sample workflow, a five-day plan, local setup and push guard instructions, and an exportable feedback questionnaire. GitHub's file viewer shows source; download the file to use its interactive controls.

```bash
git clone --branch codex/continue-studio https://github.com/tlaakso07/happydog-studio.git
cd happydog-studio
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. The current development beta opens directly into the Northline sample workspace without sign-in or API keys. `pnpm dev:beta` is an explicit alias; `pnpm dev:live` restores the authenticated development flow. The latest shared work is on `codex/continue-studio`, currently in draft PR #1.

Beta edits persist during navigation and reset on reload. Live company data and provider generation are not available in this sample mode. The real email login loop is unresolved and deferred at Trevor's request. See [the beta handoff](docs/BETA-HANDOFF.md).

| File | What it is |
|---|---|
| [ONBOARDING.md](ONBOARDING.md) | How to work on this |
| [AGENTS.md](AGENTS.md) | Project conventions and architecture |
| [HANDOFF.md](HANDOFF.md) | Live state ledger, newest at the top |

## Layout

```
apps/web/        Next.js App Router, the product surface
apps/worker/     long-running Node, pg-boss           not built
packages/db      generated types and zod schemas      not built
packages/gateway every AI call goes through here      not built
packages/engine  script and sync-map stages           not built
packages/media   ffmpeg, compositing                  not built
packages/qa      gear, logo, colour, sync checks      not built
packages/remotion the BrandedAd composition           not built
supabase/        migrations 0001, 0002, 0003, 0006
```

## Status

Studio Home and five owner-screen previews are built: Create from Deal, Script, Storyboard, Approval Queue, and Brand Room. The walkthrough uses sample content, with edits and decisions retained until reload. Authenticated account/company foundations and hosted Supabase setup exist, but real email sign-in still loops and is deferred. The beta uses sample content; real generation and playback are not connected. See `HANDOFF.md` for the current entry and [the app review](docs/APP-REVIEW.md) for decisions to discuss.
