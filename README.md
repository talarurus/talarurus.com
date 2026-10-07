# talarurus.com

The official website for Talarurus, served at <https://talarurus.com>.

Talarurus is an independent software organization building security, developer,
and local-first software. This repository holds the public website: plain static
HTML and CSS with one small optional script. There is no framework, no build
step, no analytics, no cookies, and no third-party requests.

## Local preview

Serve the repository root with any static file server, so that root-relative
paths (`/css/...`, `/assets/...`) and clean URLs (`/hammerhead/`) resolve:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the HTML files directly from disk will not load styles or fonts.

## Project structure

```
index.html                 Home
work/index.html            Work: released projects and areas of work
hammerhead/index.html      Hammerhead product page
about/index.html           About Talarurus
contact/index.html         Contact (email and GitHub; no form)
security/index.html        Security and responsible disclosure
privacy/index.html         Privacy Policy
terms/index.html           Terms of Use
404.html                   Not-found page

css/styles.css             All styles; design tokens are defined in :root
js/site.js                 Mobile menu and "copy address" button (optional;
                           every page works without JavaScript)

assets/logo.svg            Temporary logo: header, footer, and SVG favicon
assets/apple-touch-icon.png
assets/og.png              Open Graph / social preview image (1200x630)
assets/fonts/              Self-hosted Inter (SIL Open Font License, see OFL.txt)
favicon.ico                32x32 fallback favicon

.well-known/security.txt   RFC 9116 security contact
robots.txt
sitemap.xml
_headers                   Cloudflare response headers (CSP and security headers)
```

### Editing pages

Each page is standalone HTML. The header and footer are repeated in every page,
so a change to navigation or footer links must be made in all nine HTML files.
Mark the current page's navigation link with `aria-current="page"`.

When adding a page, also add it to `sitemap.xml`.

### Replacing the logo

The dinosaur mark is temporary. To replace it:

1. Replace `assets/logo.svg` (square). The header, footer, and SVG favicon update.
2. Regenerate `favicon.ico`, `assets/apple-touch-icon.png` (180x180), and
   `assets/og.png` (1200x630), which are rendered from the current logo.
3. If the new mark is not pixel art, remove `image-rendering: pixelated` from
   `.brand img` in `css/styles.css`.

## Deployment

The site is intended to be deployed on Cloudflare (Pages, or Workers static
assets) as a static site:

- Build command: none
- Output directory: repository root (`/`)
- Custom domain: `talarurus.com`

Cloudflare applies `_headers` automatically and serves `404.html` for unknown
paths on Pages. On Workers static assets, set `not_found_handling = "404-page"`.

After deploying, confirm that `https://talarurus.com/.well-known/security.txt`
is served, and keep Cloudflare Web Analytics and other script injection
disabled: the Content-Security-Policy only allows same-origin resources, and
the Privacy Policy states that the site runs no analytics.

### Maintenance

- `.well-known/security.txt` has an `Expires` date (currently 2027-10-01).
  Renew it before then.
- Update the "Last updated" date on the Privacy Policy or Terms of Use whenever
  either changes.

## Content policy

Everything on the site must be factual. Do not add products, features,
metrics, customers, partners, or claims that do not exist.
