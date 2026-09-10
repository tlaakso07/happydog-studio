# Premium UI review and three visual concepts

Reviewed the six running owner screens on September 9, 2026. Captured the current app at 1440 pixels wide. Generated three separate concept images with the built-in image generation tool using current screenshots as references. These are complementary views of a proposed design direction, not three implemented themes. No application code changed.

## Findings from the current app

| Area | Observed issue | Proposed upgrade |
| --- | --- | --- |
| Shell | Ten navigation destinations compete with the main creation and review tasks; several lead to placeholders. | Five primary destinations with one consistent order: Home, New ad, Approvals, Brand room, Finished ads. Keep company/account anchors clear. |
| Home | The large centered callout and heavy offer strip dominate the first screen; the actual ads appear farther down. | Compact task-led heading, a featured ad, relevant next actions, a smaller offer strip, and larger useful thumbnails. |
| Creation | Write my script and shot list and Preview the words compete as forward actions. The big blank brief gives little help to an uncertain owner. | One primary forward action; optional brief starters and a live format preview. Keep deal and brand version visible without turning them into banners. |
| Script | Large two-line introduction and a broad assurance panel reduce space for the words. Spoken text is italic throughout. | Compact heading, comfortable normal-weight editable copy, voice/timing beside the text, checks available on demand. All claims must reflect actual verification. |
| Scenes | Five narrow columns force tiny labels and long descriptions. The primary action is below a long policy explanation. | Filmstrip plus a larger selected-scene preview and focused inspector; sticky progression controls. Keep camera/source detail available without making it the primary owner task. |
| Approvals | Oversized heading, small video within a wide well, and always-visible redo chips compete for attention. | Bigger actual media, compact header, persistent actions, Ready / Set aside / Approved views, and correction reasons only after requesting changes. |
| Brand Room | Six equal cards reveal asset categories but not the company's overall visual identity; source details are detached from the selected asset. | Identity overview, richer asset previews, source details attached to each selection, and a website intake entry point. Preserve all six underlying books. |

## Concept 01: Editorial Home

`01-editorial-home.png` brings the creative work above the fold and gives pending tasks a clear place. Preserve the useful visual hierarchy, but make the Up next list show actual job titles and current steps. Do not present script approval and final approval as simultaneous requirements of the same job. Bind duration, counts, and offer details to data.

## Concept 02: Brand Atelier

`02-brand-atelier.png` gives the owner an immediate overview of company identity and shows website intake in context. Preserve the source-versus-suggestion distinction. Website imports into an approved brand start a successor draft; they never modify the locked kit. Keep Cast, Wardrobe, Products, Fleet and site, World, and Voice and proof accessible even where the overview combines previews.

The generated names, portraits, shirt marks, typography, colors, slogans, and product specifications are illustrative, not company evidence. Replace wording such as real team members with accurate sample/reference labels until originals are supplied and confirmed. Expose real/synthetic cast type and approval separately.

## Concept 03: Screening Room

`03-screening-room.png` gives media the most space and makes the three decisions easy to find. Preserve the sticky controls and collapsible detail. Replace the generated broad legal/product assurance with actual per-output evidence. Real playback and filmstrip seeking require real media; previews must remain labeled and cannot simulate playback with invented progress.

## Shared implementation decisions

- Use one shell, one navigation order, one radius scale, and one button vocabulary across all routes. Generated mocks vary these slightly; implementation must normalize them.
- Retain the existing Archivo, Instrument Sans, and Spline Sans Mono application fonts. A client brand's font sample must not change the Studio shell.
- Keep cobalt for primary actions and selected states. Use readable contrast and text labels, with green only for actual positive states. Status words come from `plain.ts`.
- Add an unobtrusive fixed preview indicator while sample data is in use. Generated artwork, wording, icons, and labels are not source code or approved company assets. Normalize punctuation, including removal of generated forbidden punctuation, during implementation.
- Use at least 44px primary interaction targets, keyboard-visible focus, accessible names for icon controls, and reduced-motion support. On small screens, stack the inspector below media and prevent the sticky action bar from covering content.
- Motion should clarify selection and progression: brief fades, selected-thumbnail transitions, and status feedback. Avoid decorative motion during reading or review.

## Proposed build order after design discussion

1. Shared shell, navigation, spacing, typography, buttons, responsive behavior.
2. Home hierarchy and approval workspace using existing honest preview state; set-aside and correction interactions.
3. Brand Room identity overview, asset detail/source viewer, and website setup preview.
4. Carry the same components into Create, Script, and Scenes, including a selected-scene inspector and persistent progression controls.
5. Connect the previously planned auth, storage, brand intake, and production workflow in its documented order. Raster concepts do not replace functional specifications.

Validate the coded version at desktop, tablet, and mobile widths; keyboard workflows, focus restoration, disabled/loading/error states, approval invalidation, and account isolation when connected. A beautiful static image does not establish working usability or accessibility.

Recommendation: adopt this coherent paper-and-cobalt direction across the app, with Home from concept 01, identity overview from concept 02, and the media-first approval layout from concept 03. Discuss layout preferences before replacing the application screens.
