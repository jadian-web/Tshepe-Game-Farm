# Tshepe Game Farm website

*Where the Bushveld brings us together.*

The website for Tshepe Game Farm, a private 800-hectare game farm about 15 km outside Bela-Bela, Waterberg, Limpopo.

It is a static site made of plain HTML, CSS and JavaScript. It needs no build step, framework or server code.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| The Lodge | `lodge.html` |
| Families & Leisure | `families.html` |
| Experiences | `experiences.html` |
| Groups & Meetings | `groups.html` |
| Hunting | `hunting.html` |
| Gallery | `gallery.html` |
| Plan your stay (planner + FAQ) | `plan.html` |
| Privacy policy | `privacy.html` |
| Terms & conditions | `terms.html` |
| Page not found | `404.html` |

```
assets/site.css    shared styles (Tshepe CI colours and typography)
assets/site.js     menu, slideshow, tabs, gallery, cookie consent, stay planner
assets/fonts/      self-hosted web fonts (SIL Open Font License)
img/               photos (JPEG + WebP, several sizes), logos, icons
img/og/            1200x630 social preview images
netlify.toml       HTTPS, security headers and caching (Netlify)
sitemap.xml, robots.txt, site.webmanifest, favicon.ico, apple-touch-icon.png
SECURITY.md        secrets, HTTPS, forms, spam, rate limiting and password guidance
```

## Publish (Netlify, recommended)

1. Push this folder's contents to the GitHub repository root (not the folder itself).
2. In Netlify: **Add new site → Import an existing project → GitHub**, choose the repository. Leave the build command empty; the publish directory is the root (`netlify.toml` sets this).
3. Every push to `main` redeploys the site. `netlify.toml` applies HTTPS, security headers and caching automatically.
4. Live domain: **https://www.tshepegamefarm.co.za** (primary). DNS stays in cPanel (Zone Editor): `tshepegamefarm.co.za` A record → `75.2.60.5`, `www` CNAME → `tshepegamefarm.netlify.app`. Email records (MX `mx1.tld-mx.com`, `mail`, `webmail`, SPF) are unchanged. `netlify.toml` redirects the bare domain and the netlify.app address to www.

GitHub Pages also works for previewing (`.nojekyll` is included), but it ignores `netlify.toml`, so the security headers will not apply there.

## Preview locally

Open `index.html` in a browser. For behaviour closest to the live site, serve the folder instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

- **Text:** edit the relevant `.html` file directly.
- **Photos:** replace a file in `img/` with one of the same name, ideally 1,400–2,000 px wide and saved as JPG under 400 KB.
- **Gallery:** the photo list is the `G` array near the gallery code in `assets/site.js`. Each entry is `['file-name-without-.jpg', 'Category', 'Caption']`.
- **WhatsApp number:** search all files for `27826107583` (international format) and `082 610 7583` (display format).
- **Brand colours:** these are the CSS variables at the top of `assets/site.css` (`--green`, `--copper`, `--tan`, `--cream` and others).

## Changes in v5 (developer brief, 29 October 2026)

- Fixed room layout: seven named bedrooms (Buffalo king; Springbok, Sable, Zebra, Wildebeest, Kudu, Giraffe queen) and an open loft with two double beds next to Rooms 2 and 3. Single-bed options removed everywhere.
- Planner: arrival dates before today (South African time) are rejected; a prepared message is cleared as soon as any detail changes; "My dates are flexible" option; inline field errors; enquiry and privacy notices.
- Experiences: each activity can be added to the enquiry and is carried into the planner (stored only in the visitor's browser). Home activity cards link to their own activity.
- Copy, captions, connectivity note, underground range and clubhouse wording, hunting offers, Groups and Gallery text updated as specified.
- Header uses a horizontal lockup built from the supplied logo artwork (`img/logo-horizontal.png`). Replace it with the designer's approved horizontal logo when available.
- Canonical, Open Graph and JSON-LD metadata, `robots.txt` and `sitemap.xml` use `https://www.tshepegamefarm.co.za/`. Find and replace this with the production domain at launch.

## Changes in v7 (launch checklist, 16 November 2026)

| Item | Where |
|---|---|
| Privacy policy (POPIA) | `privacy.html` |
| Terms and conditions | `terms.html` |
| Custom 404 page | `404.html` (Netlify serves it automatically) |
| Cookie consent banner and "Cookie settings" link | every page; logic in `assets/site.js` |
| HTTPS, HSTS, CSP and security headers; caching | `netlify.toml` |
| No secrets in the frontend; password and rate-limit guidance | `SECURITY.md` |
| Meta titles, descriptions, canonical URLs | every page `<head>` |
| Social previews (1200×630 Open Graph and Twitter images) | `img/og/` |
| Favicon set and web app manifest | `favicon.ico`, `apple-touch-icon.png`, `img/icon-*.png`, `site.webmanifest` |
| Sitemap and robots | `sitemap.xml`, `robots.txt` |
| WebP images with JPEG fallback; responsive sizes; lazy loading | `img/*.webp`, `<picture>` in every page |
| Self-hosted fonts (no third-party requests) | `assets/fonts/` |
| Form validation and spam protection | `plan.html`, `assets/site.js` |
| One primary call to action | solid copper buttons are reserved for "Plan your stay" |

Checks run before release:

- **Lighthouse (mobile):** Home 93, Lodge 98, Plan 97 for performance, with Accessibility, Best Practices and SEO all at 100. Home was 53 before.
- **Accessibility:** axe-core found 0 violations (WCAG 2.1 AA plus best practices) at 1366 and 390 px.
- **Links:** no broken internal links or anchors; every image has alt text.
- **Layout:** no horizontal scrolling at 360, 390, 768, 1024 or 1366 px.
- **Planner and consent:** the regression tests pass.

## Hosting note

Deploy on **Netlify**. The security headers, HTTPS rules and caching in `netlify.toml` only take effect there. GitHub Pages ignores `netlify.toml` and cannot set these headers.

## Typography

The CI specifies Trajan Pro and Garet Light. Until licensed web versions are chosen, the site uses free Google Fonts substitutes: Cormorant Garamond (headings, matching the brochure headlines) and Jost (body, close to Garet), self-hosted from `assets/fonts/` under the SIL Open Font License. These substitutes need designer approval.

## Before launch

These items still need confirming with the farm before going live:

- Rates, deposit, cancellation terms and check-in/out times
- Official email address, domain and Google Maps pin
- Higher-resolution bedroom photos, each matched to its named room
- Stock image for the clay pigeon shooting card ("Untitled design.png" was referenced in the brief but not supplied)
- Marius to confirm: maximum overnight guests, booking route (planner/WhatsApp, NightsBridge or both), booking recipient number, loft bathroom access, meeting-room details, current hunting offers
- Management or an attorney to approve `privacy.html` and `terms.html`; confirm and register the Information Officer with the Information Regulator; publish full Booking Conditions
- Hunting species, rates and permit requirements (the site directs these to enquiry, as the content master requires)

## Credits

Content from the Tshepe Content Master (October 2026) and brochures 1–3. Visual identity from the Tshepe CI guidelines.
