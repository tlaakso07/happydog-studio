# Studio email sender setup

Status: DNS and Resend SMTP are verified. The cross-browser sign-in fix and both hosted email templates are activated and independently verified. Isolated sign-in regression passes. A fresh email request for the first operator returned HTTP 200; real inbox receipt, sign-in, and invitation acceptance await user completion.

## Prepared domain

- Domain: `mail.laaksolabs.com`
- Region: North Virginia
- Resend domain ID: `db7e2ad1-85b3-4e3e-bc41-fa22af49108d`
- Intended sender: `Studio <studio@mail.laaksolabs.com>`
- DNS host: Squarespace, confirmed through public nameserver lookup and the Resend setup screen.
- Resend account is signed in under Trevor's Gmail address. The requested Studio agency account remains his business email; these accounts are separate.

## DNS records prepared for review

These are the exact records Resend displayed on September 10, 2026. Names are relative to the `laaksolabs.com` zone. Public DNS lookup found no corresponding records when prepared. Recheck the provider's existing records before saving.

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| TXT | `resend._domainkey.mail` | Public DKIM key below | 4 hours |
| CNAME | `rsend.mail` | `rsend.forge.rmta.net` | 4 hours |
| CNAME | `send.mail` | `send.forge.rmta.net` | 4 hours |

Public DKIM value, not a secret:

```text
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsK1no6ArT4Y4BPUSBHyaftl8jKLQkpQ/vG6FeaUNSWzBdiHIfeNDrIWFhKDI0XTes6rV7Z+qBavdG8TDwmeQhk0temWEhIkqcC+iJT13h6bDhD3JbBKZLmoXkHQsKZwLhfPhlVb+WQn8o370IG77PLhAHhUiMDKcwQxHyvE7qBQIDAQAB
```

The proposed changes authorize Resend to send from the dedicated subdomain. Existing website records, root mail delivery, and root DMARC policy are outside these three changes. Resend receiving is disabled. The optional root `_dmarc` suggestion was not selected or applied.

## Setup progress

1. Complete: Trevor signed into Squarespace; fresh Google account verification completed where required.
2. Complete: Trevor approved the three additions. Saved them without changing Google Workspace or website records.
3. Complete: public DNS resolves all three exact values, and Resend reports Verified.
4. Complete: Trevor approved creation of `Studio Supabase Auth` with Sending access limited to `mail.laaksolabs.com`. Saved it as the SMTP password for `happydog-studio`. Host `smtp.resend.com`, port 465, username `resend`, sender `Studio <studio@mail.laaksolabs.com>`. The secret is absent from chat and repository files.
5. Complete: independently checked hosted Auth configuration. Custom SMTP is enabled, the email rate limit is 30 per hour, and email confirmation remains required. Activated local live mode.
6. Complete: applied and independently verified the new email templates after isolated sign-in regression passed. Sent one fresh authorized email request, accepted by Supabase with HTTP 200. Pending: Trevor opens that newest email, selects Continue to my studio, and accepts the saved agency invitation.

The live local server reported Ready at port 3100 from `/tmp/studio-live-session`, a temporary checkout of the same pushed branch. iCloud offloaded files in the main Documents checkout and reported insufficient quota. Main workspace remains the source of truth; the temporary server is for this session only.

Supabase displays an organization quota warning: projects will be restricted from September 11, 2026 if the organization remains over quota. No billing changes have been made. Investigate organization usage before relying on hosted availability.

## Email-link repair activated

The original hosted templates used the PKCE confirmation URL. Requesting in one browser and opening the email in another can lose the required verifier cookie. Server logs showed a failed code exchange followed by a used/expired-link response; they did not establish the precise first exchange error.

Replacement HTML: `supabase/templates/sign-in.html`. Applied Management API PATCH body: `supabase/operations/email-template-config.json`. On September 10, an independent GET verified both template bodies and subjects exactly. SMTP credentials, Auth confirmation requirements, rate limit, and redirect settings remain unchanged.

Both signup confirmation and magic-link emails now use SiteURL + /auth/confirm with TokenHash and type=email. The app stages the token in an HttpOnly cookie on GET, redirects to a clean URL, and consumes it only after Continue to my studio is submitted. This supports opening the new email in a different browser and prevents ordinary GET previews from using the token. Already-issued emails keep their original links.

Validation: isolated HTTP checks pass for scanner GET, fresh-browser completion, session persistence, authenticated login redirect, reused links, and expired/malformed links. One new real email request was accepted after activation. Actual receipt, user sign-in, and invitation acceptance remain to be confirmed by the operator.
