# App review for discussion

Reviewed September 9, 2026 against the existing application, four SQL migrations, product plan, and six approved designs. This is a source and interface review, not a live Supabase or provider audit.

## What is ready to review

Home is joined by five responsive owner screens: Create from Deal, Script, Storyboard, Approval Queue, and Brand Room. The shared navigation, palette, fonts, and button component continue the existing implementation.

The walkthrough supports editable words, five sample openings, scene-image selection, approval and redo decisions, keyboard shortcuts, brand-book inspection, and a sample change request. Preview decisions update the Home and sidebar counts without changing the allowance. All changes reset when the page is reloaded.

The photographs are viewports into the supplied reference images, served unchanged. They are temporary visual assets, not actual customer uploads. The four reference files total about 13 MB and need replacing with appropriately sized kit photographs before launch. Videos, synthetic voices, generation, authentication, durable storage, and actual team requests are not connected.

## Product decisions to review

| Proposal | Why it matters | Recommendation |
| --- | --- | --- |
| Use one clear creation sequence | Reference 03 shows Generate before the words and scenes are approved, while the product plan requires both gates. | Brief → Words → Scenes → Generate. Make the first primary action Write my script. The current preview uses explicit preview labels. |
| Resolve duration before generation | The supplied script contains 63 whitespace-separated words. At the plan's 140 words/minute that is 27 seconds before pauses, while the design promises 24 seconds and the plan reserves 1.5 seconds for an end card. The 16-word opening alone needs about 6.9 seconds, not four. | Shorten the 24-second version to at most about 52 words before adding pauses, or allow a longer duration. Then derive the scene timing from the approved speech. Do not display a successful timing check without running it. |
| Give skipped ads a visible return path | Skip for now should mean the owner can find the ad again. A queue that simply empties can hide unfinished decisions. | Add a Set aside filter and a completion summary with a return action. The preview counts skipped items and can restart the sample queue. |
| Keep the initial owner navigation focused | Ten destinations are visible, but Calendar, Insights, Chat, Feed, Library, Renders, and Offer still lead to placeholders. | Consider Home, New ad, Approvals, Brand room, and finished ads as the initial owner navigation. Keep the existing navigation until this change is approved. |
| Make the brand room a trustworthy source | The reference shows provenance, but its images and text contain inconsistencies: the shown window does not visibly demonstrate the stated six-lite grille, and wardrobe descriptions do not consistently match the photographs. | Review real kit assets against every named rule before locking a version. Let owners inspect the exact supporting source. |

## Engineering work before live customers

1. **Enforce locked brand contents, not only the parent row.** In `supabase/migrations/0002_brand_system.sql`, `brand_systems_guard` runs only on updates to `brand_systems`. The `entities_agency`, `voices_agency`, and `traits_agency` policies still permit edits to the contents of a locked version. The guard also uses ordinary inequality for nullable lock metadata. Add database guards covering child mutations and deletion, use null-safe comparisons, and make a change produce a new version. This preserves what an owner actually approved.

2. **Require linked records to share a workspace.** The same migration separately stores `workspace_id` and foreign keys such as `brand_entities.brand_system_id`, `voices.cast_entity_id`, and `brand_traits.source_kit_asset_id`. Those foreign keys check the referenced ID, not the pair of ID and workspace. Add composite constraints or validated database functions so a row cannot reference a record from another company. Test this with two tenants, including a user who belongs to both. Existing row visibility policies alone do not establish this relationship constraint.

3. **Handle invitations for existing accounts.** In `0001_tenancy.sql`, membership attachment occurs only in the trigger after insertion into `auth.users`. An account that already exists will not fire that trigger when invited into a second workspace. Provide an explicit, authenticated invitation acceptance path, with duplicate-invite handling and tests for both new and existing users.

4. **Make approval and allowance changes atomic.** Migration 0004 is still missing. Create the job, approval-event, and redo relationships there with server-side membership checks and idempotent decision handling. A double click or retry must not generate twice, and a redo must never consume another allowance unit. The current client preview is not that authority.

These database changes are recommendations for the backend milestone. No database migrations, provider calls, or deployments were performed in this screen pass.

## Suggested next review

Walk through Create → Script → Storyboard → Approvals, then inspect Brand Room. Agree on the creation labels, duration policy, and skipped-ad behavior. After visual sign-off, finish the core owner's persisted workflow before adding the worker and generation providers.
