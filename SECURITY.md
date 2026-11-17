# Security and privacy notes

The Tshepe website is a static site: plain HTML, CSS and JavaScript served by Netlify. It has no database, no server code, no user accounts and no form submissions. Most of the attack surface a typical website needs to defend does not exist here. This file records what is in place and what must be added if that changes.

## Secrets

- **No secrets in the frontend.** The repository contains no API keys, tokens or passwords. The WhatsApp number is public business contact information by design.
- Keep it that way. If a feature ever needs a key (email sending, a booking system API), put it in **Netlify > Site configuration > Environment variables**. Use it only inside a Netlify Function, never in `assets/site.js` or any HTML file.
- `.gitignore` excludes `.env` files and the local `.netlify/` folder.

## HTTPS

- Netlify issues a free TLS certificate and redirects `http://` to `https://` automatically for the `netlify.app` address and any custom domain.
- `netlify.toml` sends `Strict-Transport-Security` (HSTS, two years; subdomains are not included so cPanel webmail on mail.tshepegamefarm.co.za is unaffected). The Content Security Policy includes `upgrade-insecure-requests`.
- When the production domain is live, enable the commented redirect in `netlify.toml` so the `netlify.app` address forwards to it.

## Security headers (`netlify.toml`)

| Header | Purpose |
|---|---|
| Content-Security-Policy | Only this site's own scripts, styles, fonts and images can load. Framing by other sites is blocked. |
| X-Content-Type-Options: nosniff | Stops browsers guessing file types |
| X-Frame-Options: DENY | Blocks clickjacking (older browsers) |
| Referrer-Policy | Sends only the site origin to other sites |
| Permissions-Policy | Turns off camera, microphone, location, payment and USB |
| Cross-Origin-Opener-Policy | Isolates the site from pop-up windows |

Fonts are self-hosted (`assets/fonts/`), so the site makes no third-party requests while browsing.

## Forms, validation and spam

The "Plan your stay" planner never sends data to a server. It builds a WhatsApp message on the visitor's device, and the visitor chooses whether to send it.

- **Validation:**
  - Required name (letters only, 2–80 characters).
  - Contact number (9–15 digits, `+ ( ) -` and spaces allowed).
  - Optional email format.
  - Arrival date today or later (South African time); departure after arrival.
  - Length limits on every free-text field; control characters are stripped.
  - Errors appear on each field.
- **Spam protection:**
  - A hidden honeypot field.
  - A minimum time on the page before a message can be prepared.
  - A limit of five prepared messages per ten minutes.
  - Because the visitor must press send in WhatsApp, a bot cannot deliver messages through the site.
- **Output safety:** the message preview is inserted as text, never as HTML, so entered text cannot run as code.

## Rate limiting

There are no server endpoints, so there is nothing to rate-limit today. Netlify's platform protects static files.

If a Netlify Function is added (for example an enquiry endpoint, a booking API proxy or a login), give it a code-based rate limit in its own config. All Netlify plans support this:

```js
export const config = {
  path: "/api/enquiry",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] }
};
```

Validate every field again on the server. Never trust browser validation alone.

## Passwords

**The site has no passwords, logins or user accounts, and none are planned.** Do not add them for a brochure website. Every login is something that must be defended, and the site gains nothing from one.

If staff or guest accounts are ever required (for example a booking portal):

1. **Prefer a managed identity provider** (such as Netlify Identity, Auth0 or Clerk) instead of storing passwords yourself. It handles hashing, resets and multi-factor authentication.
2. **If you must store passwords:**
   - Hash them with **Argon2id**. OWASP's minimum is 19 MiB memory, 2 iterations and parallelism 1. If Argon2id is not available, use **bcrypt** with a cost factor of 12 or higher.
   - Never use MD5, SHA-1 or plain SHA-256, and never store or log plain-text passwords.
3. **Rate-limit login, sign-up and password-reset endpoints**, for example 5 attempts per minute per IP using the `rateLimit` config above. Add a temporary lockout or a delay after repeated failures.
4. Require at least 12 characters, check new passwords against known breached passwords, and offer multi-factor authentication.
5. Use secure, `HttpOnly`, `SameSite=Lax` session cookies, and add these cookies to the privacy policy.

## Privacy (POPIA)

- **Policy:** `privacy.html` covers the responsible party, purposes, sharing, cross-border transfers (section 72), retention, rights and Information Regulator contact details.
- **Consent:** the cookie banner stores the visitor's choice. The only optional storage (remembered activity choices) is used only after "Accept".
- **Before launch:**
  - Confirm the Information Officer and register them with the Information Regulator.
  - Confirm whether a PAIA manual is required.
  - Have management or an attorney approve the privacy policy and terms.
