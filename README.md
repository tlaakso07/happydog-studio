# Studio

Enterprise AI ad-content platform for home-services companies, codenamed Happy Dog.

An agency locks a company's brand into a per-company brand system. The owner states a monthly deal, approves the words, approves the scenes, the system renders once, machine QA checks it, and the owner approves the finished ad in a queue.

## Start here

**New to the repo, human or agent: read [ONBOARDING.md](ONBOARDING.md).** It covers setup, the rules that get work rejected, and what is deliberately not built yet.

```bash
pnpm install
pnpm dev
```

No environment variables are needed for anything built today.

| File | What it is |
|---|---|
| [ONBOARDING.md](ONBOARDING.md) | How to work on this |
| [AGENTS.md](AGENTS.md) | The rules. Wins over anything else |
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

Studio Home is built. Everything else is scaffold. See `HANDOFF.md` for the current entry.
