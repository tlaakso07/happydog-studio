# Studio email sender setup

Status: Resend account created by Trevor. Sending domain added, DNS verification and Supabase SMTP connection pending. No email has been sent.

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
| TXT | `resend._domainkey.mail` | Public DKIM key below | Default |
| CNAME | `rsend.mail` | `rsend.forge.rmta.net` | Default |
| CNAME | `send.mail` | `send.forge.rmta.net` | Default |

Public DKIM value, not a secret:

```text
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsK1no6ArT4Y4BPUSBHyaftl8jKLQkpQ/vG6FeaUNSWzBdiHIfeNDrIWFhKDI0XTes6rV7Z+qBavdG8TDwmeQhk0temWEhIkqcC+iJT13h6bDhD3JbBKZLmoXkHQsKZwLhfPhlVb+WQn8o370IG77PLhAHhUiMDKcwQxHyvE7qBQIDAQAB
```

The proposed changes authorize Resend to send from the dedicated subdomain. Existing website records, root mail delivery, and root DMARC policy are outside these three changes. Resend receiving is disabled. The optional root `_dmarc` suggestion was not selected or applied.

## Remaining steps

1. Trevor signs into the Squarespace account managing the domain. Chrome tab 1759128980 is open at login.
2. Review existing DNS records and save the three prepared additions after the required browser-action confirmation for authorizing domain sending.
3. Verify the domain in Resend. DNS propagation may take time.
4. Connect the Resend Supabase integration to `happydog-studio` with a sending credential. Keep secrets out of chat and repository files.
5. Check hosted Auth configuration, activate local live mode, send the requested sign-in email, and have Trevor complete verified sign-in and agency invitation acceptance.

Resend domain setup is open in Chrome tab 1759128977. Current Studio preview remains available at port 3100.
