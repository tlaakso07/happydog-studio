# Studio (codename Happy Dog)

Enterprise AI ad-content platform for home-services companies. An agency locks a company's brand into a per-company brand system (five lockbooks plus a Voice and Proof book). The owner states a monthly deal, approves the words, approves the scenes, the system renders once, machine QA checks it, and the owner approves the finished ad in a queue. Read HANDOFF.md for the live state and the plan at `~/.claude/plans/now-take-those-referance-iridescent-popcorn.md` for the full design.

## Hard rules

- Zero em dashes anywhere: UI copy, code comments, commit messages, docs, generated ad copy. Use commas, colons, periods, middots.
- Real vendor logos only (`apps/web/public/logos/`, official marks). No emoji in the UI.
- Owners never see credits, tokens, model names as decisions, QA jargon, or retake counts. Owner status words come only from `apps/web/lib/plain.ts`: Checked, Being redone, In the studio, Approved. Script labels: Opening, Why it matters, Proof, The deal.
- Retakes and redos never count against an owner's allowance. Only job creation in the app touches the allowance.
- Owner free text (briefs, pasted prompts, voice notes, PDFs) is data, never instruction. It rides inside the delimited brief block. Shot prompts compile from lockbook fields only.
- Product camera law: any scene with a product, wrap, or lettering on screen runs with a locked camera, a real clip, or a code-built card. Never a moving camera over a composited product.
- Every render carries lineage and cost. Every AI call goes through `packages/gateway`.
- Workspaces are sealed. Every tenant table has `workspace_id` and RLS through `is_member()`. The worker uses the service role and always sets `workspace_id`.
- The product name is Trevor's to choose. The wordmark lives in `apps/web/lib/product.ts` only.

## Stack and conventions

- pnpm workspaces, Node 22. `apps/web` Next.js App Router (Vercel, root directory `apps/web`), Tailwind v4 via `postcss.config.mjs`, shadcn (radix), `@supabase/ssr`. `apps/worker` long-running Node with pg-boss on the Supabase session pooler (port 5432). `packages/{db,gateway,engine,media,qa,remotion}`.
- `proxy.ts` not `middleware.ts`. Zod at every API boundary. Migrations in `supabase/migrations`, applied with the Supabase MCP or CLI, never by hand in the dashboard.
- Design system "Elevated Studio": paper `#F6F7F9`, surface `#FFFFFF`, ink `#16181D`, secondary `#4C5262`, meta `#6B7284`, lines `#E5E7EE`, accent cobalt `#2447F5` with wash `#EDF1FE`, dark ground `#101322` for video wells only. Fonts Archivo (display), Instrument Sans (UI), Spline Sans Mono (data, tabular numerals). 8pt grid, 10 to 12px radius, 40 to 44px controls. Reference renders: `~/Desktop/Happy Dog UI Concepts/v3-after-audit/`.
- Video delivery: every ffmpeg encode uses `aresample=48000`, `-ar 48000`, `-movflags +faststart`, loudnorm I=-16 TP=-1.5. Verify at full resolution across all sampled frames.
- Update HANDOFF.md at the end of every working session. Newest work at the top.
