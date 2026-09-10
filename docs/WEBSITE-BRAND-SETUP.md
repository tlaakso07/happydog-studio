# Website to company design system

September 9, 2026. Requested by Trevor as an additional company onboarding path, especially for smaller companies with few assets. This is the implementation specification; website ingestion and design generation are not connected yet.

## Product placement and owner flow

Add **Start from your website** to company onboarding and Brand Room. Keep **Upload brand assets** and a short manual setup available. Website import and uploaded originals can be combined into one draft brand version.

Website URL → Review what we found → Choose a direction → Preview your brand → Approve brand → Create an ad.

1. **Start from your website:** paste the company's public URL. Show the recognized company and domain. Offer **Keep our current look** as the default, or **Help improve our brand**. A blocked or sparse site can continue through uploads and a short business questionnaire.
2. **Review what we found:** show logo candidates, palette, type, photography, business name, services, service area, and writing examples. Each item opens its source page or evidence crop. Mark missing, conflicting, or uncertain details and allow corrections.
3. **Choose a direction:** keep the recognizable identity and fill missing roles by default. For an improvement request, propose two directions using the same company, offer, copy, and preview layouts. Changing the company logo is a separate explicit choice. Do not silently replace a usable existing logo.
4. **Preview your brand:** show the palette, type hierarchy, logo use, image style, tone of voice, and sample social post, ad still, and video end card. Ask only questions that affect unresolved choices, such as positioning, preferred tone, and whether website photos show their actual team/work.
5. **Approve brand:** review a concise change summary, keep or revise individual choices, and approve the package. Lock a new version through the existing agency review and owner sign-off. Ads inherit the approved version.

The website route is an entry point into the existing company brand system. It does not create a second disconnected brand store or automatically reskin the Studio application.

## What we find versus what we design

Keep origin and approval as independent fields. **Found on your website**, **Suggested by Studio**, and **Provided by you** describe origin; none means approved. Approval records who accepted the item and when.

| Website provides | Studio can propose | Still requires company evidence or confirmation |
| --- | --- | --- |
| Existing logo candidates and imagery | Consistent logo placement, clear space, layouts, approved variants | Correct master logo; asset ownership and permitted reuse |
| Colors and detected typefaces | Complete palette roles, readable color pairs, type hierarchy, available font alternatives | Whether current website styling is intentional; availability of font rights/files |
| Photos and page descriptions | Image direction, backgrounds, layouts, an explicitly synthetic spokesperson | Actual employees, fleet, uniforms, installed products, completed work |
| Headings and service descriptions | Voice guide, messaging structure, draft hooks and CTA wording | Current services, locations, prices, warranties, certifications, testimonials |
| Very little consistent design | Two proposed visual directions and a starter template set | Which direction represents the company |

Extraction establishes what appeared on a page at a given time. It does not establish that a photo is an employee, that a warranty remains current, or that a stock image depicts the company's own work. Website claims remain unverified candidates until confirmed. Generated scenes must never be labeled as real completed projects.

## Starter package and readiness

The minimum package contains an approved name and logo treatment, color roles, heading/body type, logo-use rules, image direction, voice guide, confirmed business facts, and three reusable templates: social post, ad still, and video end card. Export a human-readable brand guide plus machine-readable design tokens and asset references. The application consumes the same versioned source used for the export.

Keep templates separate from image generation: typography, marks, pricing, and layout use exact artwork and structured text. OpenAI images supply approved image concepts and missing illustrative material. New logo concepts, when explicitly selected, remain drafts until finalized into usable artwork and approved. A generated raster is not automatically a master vector logo.

Show what the kit enables and what remains missing. A company can start with typography-led cards and approved generic imagery without a cast, fleet, or product reference. Employee-led and specific-product recipes become available when their references are approved. Never invent those references to make a completion indicator turn green.

## Preferred ingestion and generation architecture

- **Firecrawl is the first extraction candidate.** Its documented branding format returns visual style information. Use Map to find relevant pages, then scrape a bounded selection with branding, text, images, and screenshot evidence as needed. Mapping discovers candidate URLs; it is not proof every page was fetched.
- Proposed initial scope: the homepage and up to seven relevant same-company pages, prioritizing About, Services, Contact, and genuine project/gallery pages. Deduplicate pages and assets. Enforce configurable page, byte, runtime, retry, and agency-cost limits. Record skipped and failed pages; partial imports remain usable drafts.
- Put the Firecrawl adapter and all AI analysis/generation calls behind `packages/gateway`. Run imports in the durable worker with workspace-scoped state, resumable progress, cancellation, idempotency keys, and private persisted assets. Do not put API secrets in browser code.
- Validate public HTTP(S) targets and every redirect or asset fetch. Reject local/private/metadata addresses and credential-bearing URLs; prevent DNS rebinding in app-controlled fetches. Sanitize imported SVG/HTML and validate media type and size before previews. Website text is untrusted source data and cannot issue tool instructions or alter brand rules.
- Normalize extractor output into our schema. Record provider/version, source URL, retrieval time, snapshot/hash, observed evidence, inferred values, conflicts, and missing fields. Do not invent numerical confidence scores where the extractor provides no calibrated measure.
- Store proposed design decisions separately from observations. AI suggestions cite their inputs and rationale; their origin remains generated after owner approval. Use the existing immutable brand version, source asset, and approval patterns rather than overwriting observed facts.
- Respect public-site access controls. If extraction fails, provide retry and upload/manual options. Do not silently switch providers or claim a complete scan. Store crawl results so revisiting the draft does not launch another paid scan.
- Refresh is an explicit action that creates a comparison draft. Website changes never mutate a locked kit or existing ad. Routine scheduled monitoring is outside this feature's first release.

Firecrawl extracts candidate source material. Structured analysis turns it into a proposed design system. OpenAI images produce image concepts. Seedance stays downstream of the approved brand and scene frames.

## Build sequence and acceptance

1. **Screen preview:** add the Brand Room entry point, URL setup, findings review, two-direction comparison, and approval summary. Mark fixtures clearly; entering a URL must not pretend a scan occurred.
2. **Real intake:** after authentication, tenant isolation, private storage, and brand versioning, connect bounded Firecrawl imports and source review. A reload resumes progress; a retry does not duplicate assets or import work. Existing uploads merge without losing originals.
3. **Design proposal:** implement structured brand drafting, deterministic template previews, and the minimal OpenAI adapter needed for requested concepts. This moves reference generation into the company-setup milestone; it need not wait for the later video pilot.
4. **Approval and export:** approve a version, export its guide/tokens, and use it to create the first ad. Re-importing the website creates a draft difference view and leaves that ad unchanged.

Pilot against a coherent website, a sparse one-page site, a site with conflicting logos/fonts, and a blocked site. Verify third-party badges are not selected as company logos, unconfirmed claims cannot reach ad copy, absent cast does not prevent card-based output, text remains readable in preview formats, and all approved choices trace to originals or explicitly generated proposals. Also verify cross-company denial, unsafe URL rejection, hostile source text isolation, partial import recovery, and unchanged locked versions after refresh.

## Primary sources

Checked September 9, 2026. Documentation establishes available features; account access, actual output quality, and per-import cost remain implementation checks.

- [Firecrawl brand style guide cookbook](https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook): branding extraction and guide generation example. Studio adds evidence review, design proposals, and approval/versioning.
- [Firecrawl Map](https://docs.firecrawl.dev/features/map): candidate page discovery and coverage limitations.
- [Firecrawl Crawl](https://docs.firecrawl.dev/features/crawl): bounded site traversal and result handling when deeper discovery is required.
