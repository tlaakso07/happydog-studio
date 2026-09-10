# Build order

September 9, 2026. Trevor authorized implementation in priority order. Preserve the current navigation, all six brand books, and the full feature scope. UI redesign is deferred.

| Order | Milestone | Deliverable | Current state |
| --- | --- | --- | --- |
| 1 | Account and company foundation | Verified login, company access, Agency HQ company creation, invitations, saved company records, and tenant relationship constraints | Code locally verified; hosted migrations and transactional access smoke test complete; email configuration, first operator, and browser sign-in pending |
| 2 | Approved brand foundation | Immutable brand contents and source assets, upload intake, agency editing, six books, owner sign-off, version changes | Next |
| 3 | Website to design system | Firecrawl intake, evidence review, missing-design proposals, OpenAI concepts, reusable starter templates and approved export | Planned |
| 4 | Offers and durable ad workflow | Offer editor, saved briefs/jobs, allowance ledger, current-version approval gates, progress and notifications | Planned |
| 5 | Words, voice, and scenes | Script alternatives/editing, claim checks, approved voice, measured timing, actual scene images and source comparison | Planned |
| 6 | Generation and delivery | Seedance worker, spending/retry controls, assembly, brand review, scene repair, owner decisions, playback and downloads | Planned |
| 7 | Core Library/Renders and pilot readiness | Reusable assets, finished-ad browsing, support, billing approach, monitoring, backups, security/accessibility checks and pilot | Planned |
| 8 | Complete the wider product | Calendar, Chat, Feed, publishing, Insights, richer Library tools and self-service | Retained scope, sequence by dependency and pilot feedback |

## Batch 1: account foundation

- [x] Server-side account verification, refreshed cookies, safe auth redirects, login, callback, confirmation, sign-out, and failure states.
- [x] Request-level company access checks; company chooser and Agency HQ role boundary.
- [x] Persist company creation and invitations through transactional database functions.
- [x] Explicit verified-email invitation acceptance for new and existing accounts, expiry, revocation, duplicate requests, and replay protection after membership removal.
- [x] Same-company relationship constraints for brand, intake, voice, source, footage, library, and enterprise links, plus asset-path ownership.
- [x] Explicit local sample mode; real company workspaces cannot inherit Northline's fixture content or decisions.
- [x] Local SQL tests and browser workflows through the actual application with simulated Auth transport and isolated PostgreSQL.
- [x] Authenticate the Supabase CLI, compare remote migration history, and apply the migration against the intended environment.
- [x] Verify hosted company isolation, invitation acceptance, RLS, and private buckets using rolled-back test fixtures.
- [ ] Configure production origin, email delivery/templates, and the first agency membership; run hosted sign-in and multi-company smoke tests.
- [ ] Automated invitation email delivery, membership revocation UI, broader Agency HQ operations, and immutable brand-content guards remain in the launch checklist. The current invitation form explicitly saves an invitation and asks the agency to share the sign-in address.

See [ACCOUNT-FOUNDATION.md](ACCOUNT-FOUNDATION.md) for activation and verification. Local implementation is not a claim that hosted accounts are already live.
