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

```
assets/site.css   shared styles (Tshepe CI colours and typography)
assets/site.js    menu, slideshow, tabs, gallery lightbox, stay planner
img/              farm photography and logo files
```

## Publish with GitHub Pages

1. Create a new repository on GitHub, for example `tshepe-website`.
2. Upload the contents of this folder (not the folder itself) to the repository root, then commit.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
5. After a minute or two the site is live at `https://<your-username>.github.io/tshepe-website/`.

To use your own domain (for example `www.tshepegamefarm.co.za`), add it under **Settings → Pages → Custom domain** and point your DNS to GitHub as GitHub explains on that screen.

`.nojekyll` tells GitHub Pages to serve the files as they are.

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

## Before launch

These items still need confirming with the farm before going live:

- Rates, deposit, cancellation terms and check-in/out times
- Official email address, domain and Google Maps pin
- Higher-resolution bedroom photos (current ones are taken from the brochures)
- Hunting species, rates and permit requirements (the site directs these to enquiry, as the content master requires)

## Credits

Content from the Tshepe Content Master (October 2026) and brochures 1–3. Visual identity from the Tshepe CI guidelines.
