# Studio launch checklist

September 9, 2026. Based on the running app, repository, application review, and current branding/website plans. This is a delivery checklist, not a claim that the production accounts or services have been audited.

Implementation is now underway in [BUILD-ORDER.md](BUILD-ORDER.md). The account foundation is locally implemented and tested; the launch checkboxes below remain open until their hosted behavior and release conditions are verified. See [ACCOUNT-FOUNDATION.md](ACCOUNT-FOUNDATION.md).

## Scope and checkpoints

Trevor wants to preserve the full app scope. UI redesign is deferred. Do not apply the five-destination navigation recommendation from earlier concept documents or remove any of the six brand books. Keeping a feature in scope does not mean its placeholder is finished.

- **Pilot:** a small invited group, supported by the agency, can safely complete the full core workflow and receive real ads. Website-based setup is included so the pilot can test a company with few assets.
- **Full release:** the broader feature set works as promised, onboarding and operations are repeatable, and billing/support can handle the intended user volume.
- Calendar, Insights, Chat, Feed, and direct social publishing can follow the pilot under the proposed sequence below. They remain planned features. Before inviting pilot users, state exactly which are available; the pilot scope is a recommendation, not authorization to delete or hide navigation.

An item is complete only when its behavior is implemented and verified. A screen, SQL file, mock result, provider subscription, or documented plan alone does not complete it.

## Foundation already present

- [x] Next.js web app, shared shell, styling, and repository.
- [x] Home plus Create, Script, Scenes, Approvals, and Brand Room screen previews.
- [x] Local preview editing, approval/redo/skip interactions, downstream approval invalidation, and synchronized counts.
- [x] Six brand-book previews and placeholder routes for the remaining app sections.
- [x] Initial tenancy, brand, offer/library, and private-storage SQL files, subject to hardening and deployed-state verification.
- [x] Existing prototype tests and prior build/browser checks, covering the preview rather than a live production workflow.
- [x] Branding, website intake, preferred provider, and workflow plans.

Not yet present: the production worker and `packages/db`, `gateway`, `engine`, `media`, `qa`, and `remotion` implementations. No live provider or database state was inspected for this checklist. Reconcile actual deployment state before changing it.

## 1. Accounts and company access | pilot blocker

- [ ] Login, logout, session refresh/expiry, and magic-link callback/error states.
- [ ] Real email delivery for invitations and login; verify production callback URLs.
- [ ] Create companies and invite owners from Agency HQ.
- [ ] Accept invitations for new and existing users, including a second company; handle expired, revoked, duplicate, and already-used invitations.
- [ ] Enforce owner/agency roles on the server and in database policies; safe routing for no-access accounts.
- [ ] Company switching for authorized agency/multi-company users, with unmistakable active-company context.
- [ ] Remove access when membership is revoked; enforce the change in data, media, and active sessions as appropriate.

Exit evidence: two separate companies and a multi-company agency account can sign in, and unauthorized users cannot read or change the other company's records or files.

## 2. Database, storage, and saved progress | pilot blocker

- [ ] Verify which migrations actually exist in each environment; complete jobs, scenes, approvals, imports, provider calls, costs, and event schemas.
- [ ] Add same-workspace constraints to related records, not just row visibility policies.
- [ ] Make locked brand contents and source versions immutable, including child rows, reference links, deletes, and nullable lock metadata.
- [ ] Replace hardcoded Northline/sample reads with authorized workspace queries. Support arbitrary company/job IDs and accurate empty states.
- [ ] Save offers, briefs, scripts, scenes, review decisions, intake progress, and change requests across reloads and devices.
- [ ] Secure private asset storage, signed playback/download links, upload limits, media validation, resumable large uploads, and missing-file handling.
- [ ] Preserve original bytes, hashes, source/version history, and approved references; define retention, deletion, and backup behavior.
- [ ] Prevent stale writes and duplicate actions; store decisions and associated state transitions transactionally.

Exit evidence: resume the same job on another session; cross-company record links are rejected; new brand edits cannot change an existing approved job.

## 3. Agency operations | pilot blocker

- [ ] Build Agency HQ: company list, onboarding state, work awaiting agency action, and company detail.
- [ ] Review/edit extracted brand drafts, resolve conflicts, request missing information, and manage owner sign-off.
- [ ] Review brand change requests and create successor versions.
- [ ] See job progress, failed jobs, stalled imports, quality review, and redo history.
- [ ] Inspect source evidence, provider lineage, actual costs, and permission-scoped activity history.
- [ ] Retry or cancel work safely, escalate to manual review, and stop generation when a company or provider has a problem.
- [ ] Provide a real owner-to-agency support channel during the pilot, even before in-app Chat is implemented.

Exit evidence: the agency can onboard and support a pilot company using the application, without routine database edits.

## 4. Brand intake and all six books | pilot blocker

- [ ] Upload existing logos, photos, videos, documents, and voice material with clear shot/file guidance and resumable intake.
- [ ] Build Cast, Wardrobe, Products, Fleet and site, World, and Voice and proof as editable/reviewable structured records with exact source evidence.
- [ ] Add the shared identity layer: company name, logo variants, colors, type, placement, and exact wording rules.
- [ ] Support real employees and recurring synthetic characters, selected and approved per company; store permitted uses, voice assignment, and outfit associations.
- [ ] Establish references for faces, uniforms, marks, product geometry, vehicle lettering, and locations; confirm originals rather than treating generated images as facts.
- [ ] Capture confirmed claims, pronunciation, tone, services, offers, and restrictions.
- [ ] Agency review and owner approval of the complete brand version, with source inspection and a concise change summary.
- [ ] Show which ad types the available assets support; optional missing fleet/cast/product assets must not block unrelated formats.

Exit evidence: one real company's approved kit supports repeatable ads, and a new kit version leaves earlier jobs unchanged.

## 5. Website to design system | pilot blocker for the agreed small-company path

- [ ] Build Start from your website in onboarding and Brand Room, plus upload/manual alternatives.
- [ ] Integrate Firecrawl or the selected extractor behind the gateway: relevant-page discovery, bounded scraping, source snapshots, asset candidates, progress, and partial-failure recovery.
- [ ] Validate website/redirect/asset URLs and imported content; prevent private-network fetches, unsafe markup, and source text acting as instructions.
- [ ] Review extracted logos, colors, typography, imagery, business facts, and contradictions with their source pages.
- [ ] Keep Found on your website, Provided by you, and Suggested by Studio distinct from approval status.
- [ ] Keep current identity by default; offer two improvement directions and a separate explicit logo-change choice.
- [ ] Generate missing design proposals and preview them as a social post, ad still, and video end card with exact text/artwork.
- [ ] Approve and export a starter guide, design tokens, and asset references; explicit refresh creates a comparison draft.
- [ ] Confirm real employee/project photos and factual claims; sparse or blocked websites can still produce a useful approved starter kit.

Exit evidence: test a coherent site, a sparse site, a conflicting site, and a blocked site. No scrape result becomes an automatically approved claim or identity.

## 6. Home, offers, and ad creation | pilot blocker

- [ ] Home reflects real pending actions, current offer, allowance, and recent work for the signed-in company.
- [ ] Complete the Offer editor: price, terms, service, dates, evidence, approval, and offer revision history. Handle expired/no offer without inventing one.
- [ ] Save guided briefs, free text, voice notes, selected cast, duration, and supported aspect ratios.
- [ ] Transcribe voice notes and treat user/source text as data subject to approved brand rules.
- [ ] Generate real concepts and alternate drafts from the approved kit and offer.
- [ ] Show one clear progression path, required inputs, meaningful errors, and an accurate cost estimate where the product promises one.
- [ ] Create each job once and record allowance usage once. Specify cancellation and material-brief-change behavior before charging users.

Exit evidence: an owner creates an ad from their current approved brand and deal; refreshing or retrying does not create another job or allowance charge.

## 7. Scripts, voices, and timing | pilot blocker

- [ ] Implement real script generation with Opening, Why it matters, Proof, and The deal.
- [ ] Edit, compare, save, and approve script revisions; gate downstream work on the current approved revision.
- [ ] Confirm claim and offer wording against approved sources; unsupported statements require correction/review.
- [ ] Connect the chosen approved synthetic voice route and/or actual employee recordings; implement pronunciation and voice preview.
- [ ] Complete permission and provider eligibility handling for any identity/voice feature offered; appearance approval does not imply voice-cloning approval.
- [ ] Estimate duration during drafting, then measure actual audio with pauses and reserved end-card time.
- [ ] Map speech segments to scenes, allow intentional silent segments, and return overlong scripts for approved changes.

Exit evidence: actual speech fits the approved output duration, and editing the words invalidates audio/timing/scene approval as required.

## 8. Images, scenes, and storyboard | pilot blocker

- [ ] Implement the minimal OpenAI image adapter for reference preparation, scene images, and edits using approved source assets.
- [ ] Save scene versions with cast, outfit, product, location, spoken segment, camera rule, duration, and selected sources.
- [ ] Show actual generated/reference images, alternate selections, image edits, and source comparisons.
- [ ] Check stills before video submission; failures and uncertain critical details remain in agency review.
- [ ] Enforce the product/lettering camera rule and choose real footage or designed cards where exact detail cannot be preserved.
- [ ] Show the real scene plan and cost estimate at approval; reject stale script/brand/scene approvals on the server.

Exit evidence: only the exact approved and checked scene version can enter video generation.

## 9. Generation gateway and durable worker | pilot blocker

- [ ] Implement the shared provider gateway, engine, durable job queue, and worker deployment.
- [ ] Verify actual API account access, reference permissions, formats, pricing, and limits for OpenAI images, Seedance 2.5, and selected speech/text/inspection services.
- [ ] Pin the model/provider configuration and brand inputs for each job. Keep agency controls separate from owner decisions.
- [ ] Support submit/poll or verified callbacks, backoff, timeouts, bounded retries, cancellation, restart recovery, and terminal failure states.
- [ ] Handle ambiguous submission outcomes without blindly paying for a duplicate request; retain provider task IDs and reconcile state.
- [ ] Enforce company/job spending and concurrency limits with a circuit breaker. Keep mock/live modes explicit and never silently substitute a different identity or route.
- [ ] Persist outputs in private company storage before provider links expire; validate media integrity and record lineage and actual cost.
- [ ] Make progress and next required actions visible without exposing internal provider errors or jargon to owners.

Exit evidence: a worker restart or provider timeout does not lose a job, duplicate generation, or leave the owner with false completion.

## 10. Assembly and brand-quality review | pilot blocker

- [ ] Implement video/media assembly: approved clips, speech, music, captions, exact logo art, offer text, and end card.
- [ ] Deliver the promised vertical, square, and landscape formats with correct cropping and safe text placement.
- [ ] Verify duration, dimensions, codec/playback, captions, pronunciation, audio mix, and required delivery settings.
- [ ] Check identity, outfits, marks, products, text, claims, and camera stability with evidence. Unknown or unreadable is not pass.
- [ ] Inspect exported video, not only source stills. Agency watches full pilot exports; automated samples alone cannot establish every-frame correctness.
- [ ] Repair the failing scene, reassemble, and recheck without another owner allowance charge for the same approved brief.
- [ ] Keep incomplete/failed media out of the owner-ready queue; display Checked only when the actual required checks passed.

Exit evidence: a real exported ad passes the agreed company acceptance set, and a deliberately incorrect asset is caught rather than waved through by a general quality score.

## 11. Approvals, Renders, and Library | pilot blocker

- [ ] Replace the approval queue's sample stills with actual playable finished ads and matching approved copy.
- [ ] Persist Approve, Request redo, and Set aside with reasons/notes, history, actor, and version.
- [ ] Set aside has a visible return/restore path; redo does not consume allowance. Handle concurrent decisions and already-superseded renders.
- [ ] Preserve keyboard shortcuts with typing/focus protection; show accurate progress and a useful queue completion state.
- [ ] Build Renders browsing, filtering, detail, real playback, supported aspect ratios, and authorized download.
- [ ] Build Library upload, browse, preview, search, tags, and selection of reusable original footage/assets; distinguish saved ads and generated material.
- [ ] Define archive/delete behavior for assets referenced by approved work; prevent accidental broken lineage.
- [ ] Deliver approval-ready notifications and genuine change-request delivery with retry/deduplication. Owner preferences control notification behavior.

Exit evidence: an owner reviews, sets aside, restores, approves, and downloads an ad after reloading, and the same asset can be found later.

## 12. Commercial setup and support | pilot blocker; automate before self-service

- [ ] Choose the product name, production domain, first pilot companies, and exactly what the pilot includes.
- [ ] Define plans, monthly allowance/reset rules, owner-visible pricing, included redos, and agency provider budgets.
- [ ] Establish pilot billing/invoicing if paid; manual agency billing can support an invited pilot. Implement checkout/subscriptions, reliable billing events, failed-payment handling, and cancellation before offering self-service billing.
- [ ] Prepare and review customer terms, privacy information, uploaded-asset/likeness permissions, retention/deletion handling, and appropriate music/font/media usage records for the chosen product.
- [ ] Write a short onboarding guide, supported-input guidance, realistic turnaround expectations, and a help/contact path.
- [ ] Assign responsibility for onboarding, content review, billing issues, and incident response; define what happens when generation cannot satisfy the company rules.
- [ ] Confirm account/data export and removal workflows and clearly communicate what happens to active work.

Exit evidence: a pilot customer knows what they receive, what they pay, who helps them, and how their material is handled.

## 13. Deployment, security, and release checks | pilot blocker

- [ ] Deploy production web, worker, database, and private storage with separate development/staging configuration and server-only secrets.
- [ ] Set production URLs, HTTPS, auth/email configuration, signed asset access, resource limits, and operational alerts.
- [ ] Add CI checks for types, lint, relevant tests, and builds; test migrations and deploy ordering against representative data.
- [ ] Verify tenant isolation, role checks, invitation/revocation, private assets, input validation, rate limits, upload/URL handling, and prompt-injection boundaries.
- [ ] Add error reporting and operational visibility for queue age, failed jobs, notification failures, storage, and provider spend without leaking secrets or customer media into logs.
- [ ] Verify backup restore and rehearse deployment rollback and provider-outage recovery.
- [ ] Replace design-reference photo crops with authorized, optimized assets. Keep all demo content clearly separated from customer workspaces.
- [ ] Verify desktop, tablet, and mobile task flows, keyboard/focus, readable contrast, screen-reader labels, loading/empty/error states, and supported browser playback.
- [ ] Test concurrent jobs, duplicate actions, stale approvals, worker restarts, expired sessions, and missing/expired provider responses.

Exit evidence: a fresh production invitation completes the core workflow; recovery and access-control tests pass; an operator can diagnose and stop failed work.

## 14. Full app sections still to finish | retained scope

These can follow the supported pilot if they are explicitly outside its promise. None is removed from the product plan. Build them before advertising them as working features.

| Section | Work required | Dependencies |
| --- | --- | --- |
| Calendar | Month/week/list views; create/reschedule/cancel planned work; deadlines, timezone, queue linkage, reminders; distinguish production dates from publication dates. | Saved jobs, offers, notifications. Publishing dates require publishing integration. |
| Insights | Real account/content metrics, date filters, freshness, reporting, and useful empty states. Define which metrics are available without claiming unsupported attribution. | Social/account integrations and ingested results. |
| Chat | Company/agency conversations, replies, attachments, unread state, notifications, membership enforcement, and support ownership. | Accounts, private assets, messaging backend. |
| Feed | Define agency/group sharing boundaries; authorized posts, media, comments if offered, reporting/moderation, and explicit sharing separate from private company work. | Group membership and access model; controlled cross-company sharing. |
| Library expansion | Saved ads, Winners, Playbooks, richer footage search/transcription/clips, and reuse permissions. | Core Library; real performance data before declaring an ad a winner. |
| Publishing | Connect/disconnect social accounts, correct destination selection, platform permissions, scheduling, publishing status, duplicate prevention, failures, and token renewal. | Approved deliverables, provider access, secure credentials. |
| Customer self-service | Account/team administration, plan changes, billing portal, repeatable onboarding, and volume-ready support. | Stable pilot, billing, roles. |

UI polish and the premium concepts return later. Preserve every capability when changing layout, and map where it moves before building a redesign.

## Recommended implementation sequence

1. Accounts, company separation, storage, and Agency HQ foundation.
2. Brand intake, website setup, source review, design proposals, and immutable approved kits.
3. Offers, durable jobs, scripts, actual speech/timing, and image/scene approval.
4. Seedance generation, assembly, quality review, repair, approvals, downloads, and core Library/Renders.
5. Production operations, pilot billing/support, release checks, and supervised customer pilot.
6. Calendar, Chat, Feed, publishing, Insights, and self-service according to the agreed full-release promise.

## Pilot go/no-go demonstration

- [ ] Invite a new customer and an existing user into the correct companies.
- [ ] Onboard one company from original assets and another from a sparse website; approve their distinct brand versions.
- [ ] Create a real offer and ad; approve words, measured speech/timing, and checked scene images.
- [ ] Generate and inspect real output; deliberately reject a bad detail and repair it without duplicate allowance usage.
- [ ] Resume after reload, worker interruption, and a recoverable provider failure.
- [ ] Set aside and restore an ad; approve and download the final promised formats.
- [ ] Verify the two companies cannot access each other's files or data, and no new brand version changes old approved work.
- [ ] Confirm actual cost, turnaround, quality, support workload, and a practical stop/rollback path before widening access.

The first-users milestone is a dependable end-to-end service. A premium redesign is not a prerequisite for this milestone.
