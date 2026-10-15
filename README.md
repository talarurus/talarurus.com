# talarurus.com

The public website for Talarurus, an independent software studio building
security, developer, and local-first software.

## Local preview

Serve this directory with a static server so root-relative assets and clean URLs
resolve correctly:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Cloudflare applies the security response headers in
`_headers` in production; Python's basic server does not emulate those headers.

## Website structure

- `/`: studio homepage, featured Hammerhead developer preview, and work in development.
- `/work/`: released and in-development projects.
- `/hammerhead/`: 0.2.0-dev overview, verified current output, seven checks, and labeled historical v0.1.0 output.
- `/hammerhead/docs/`: pinned preview self-build, commands, reports, security model, and limitations.
- `/hammerhead/release/`: preview availability and inactive future macOS/Linux downloads.
- `/products/plainbalance/`: plainbalance v0.3.1 Developer Preview, features, platform
  status, security limitations, planned releases, and public GitHub source.
- `/about/`: studio background and founder identity.
- `/contact/`: company email, security reporting, and GitHub links.
- `/security/`, `/privacy/`, `/terms/`: disclosure guidance and legal information.
- `404.html`: unknown-path response.

Every page is standalone HTML. The header and footer appear in all twelve HTML
files; update them consistently and mark the active navigation link with
`aria-current="page"`. Keep `sitemap.xml` in sync with public routes.

## Styling and progressive enhancement

`css/styles.css` defines the Precision layout, responsive rules, warm neutral
palette, and shared controls. Inter is self-hosted under the SIL Open Font License
in `assets/fonts/OFL.txt`. The official logo and favicon exports in `assets/` are
canonical, monochrome brand assets; do not redraw or recolor them.

`js/site.js` enhances mobile navigation, accessible Terminal/JSON report tabs,
and clipboard controls. Links and essential content remain usable without
JavaScript. Hammerhead captures use synthetic fixtures with no usable credentials. The product
page shows verified 0.2.0-dev output; historical v0.1.0 captures stay explicitly
labeled on the homepage, Work, and product history. JSON panels are labeled excerpts.

`js/landscape.js` draws the existing deterministic ASCII valley in the hero,
caching geometry on resize and animating cached layers at up to 20 fps with a
capped backing-store scale. Text ranges receive quieter scenery. Animation stops
offscreen, in hidden tabs, when paused, and for reduced motion. Pre-rendered HTML
frames provide a non-JavaScript and script-failure fallback.

`js/atmosphere.js` mounts ascii.rest's actual Saptarishi scene in the studio section
at 12 fps. The upstream player pauses offscreen, in hidden tabs, and for reduced
motion. A pause control and static frame are supplied. Dependencies are pinned to
ascii.rest 0.3.0, commit `7f86daf5dfed61a1e4f72fb40b734bc604fa35ff`, and self-hosted
in `assets/vendor/ascii-rest/0.3.0/` with the full MIT license and provenance.

No framework, build step, analytics, cookies, remote fonts, or third-party runtime
scripts are required. Preserve the existing Content Security Policy in `_headers`.

## Production deployment

The existing Cloudflare Pages project is `talarurus-com`, connected to the
`talarurus/talarurus.com` GitHub repository. Production uses the `main` branch and
serves the static repository root at https://talarurus.com. The GitHub integration
publishes production updates after a push to `main`; a separate Wrangler deploy
command is not required. Do not create another Pages project or change DNS.

Keep the production branch limited to reviewed website files, required assets,
licenses, and this public README. Do not merge development branches wholesale if
they contain internal brand sources, design-review notes, agent instructions,
credentials, backups, or temporary files. `.assetsignore` is a Workers feature and
must not be relied on to exclude files from a Pages root deployment.

Before pushing, inspect the entire staged diff and tracked-file list, verify
local routes and references, and check that the approved logos and security
headers are unchanged. After Cloudflare's deployment succeeds, verify the actual
custom domain, all routes and assets, CSP, interactions, reduced motion, and
unknown-path handling. Confirm that internal paths such as `/brand/` and `/docs/`
return 404. The `Cache-Control: public, no-transform` response directive prevents
Cloudflare from injecting Web Analytics scripts or rewriting email addresses,
consistent with the Privacy Policy, non-JavaScript contact links, and CSP. HTML
responses are revalidated; the existing immutable font cache is retained. This
also opts out of edge payload transformations, which can affect compression.
See Cloudflare's [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/)
and [email obfuscation documentation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/).

## Hammerhead developer preview

Current version is **0.2.0-dev**, an experimental developer preview for controlled
development/testing. Official source: https://github.com/talarurus/hammerhead.
The guide pins the reviewed development commit `4fa1018b13ed4b8b6af194a326105e098dc8118f`.
No v0.2 release binary, remote installation script, or checksum download is offered.
The four platform controls at `/hammerhead/release/` are disabled until verified
versioned artifacts exist. Full untrusted-repository security qualification and
release CI are still pending. Do not treat this smoke test as release approval.

Sanitized actual captures, a fixture specification, and provenance live in
`assets/products/hammerhead/0.2.0-dev/`. Only the absolute fixture-root path is
normalized in terminal/JSON captures; wording, counts and timestamps are unchanged.
The demo was built outside Hammerhead using installed Go 1.26.9 on macOS ARM64.
Version/help exit 0; terminal/quiet/JSON scans complete with exit 1 and four
findings. Coverage has 5 examined entries, 4 files, 2 directories, complete
inventory and root listing, 6 completed checks and one not-applicable Git check,
no truncation and no diagnostics. `--fail-on none` returns completed/0; a separate
controlled depth-limit fixture returns partial/2 even with that flag; a missing
target returns 2. The protected Hammerhead checkout remains unchanged.

Review locally using the existing static-server process:

```sh
python3 -m http.server 4183 --bind 127.0.0.1
```

Open http://127.0.0.1:4183/hammerhead/, `/hammerhead/docs/`, and
`/hammerhead/release/`, plus `/` and `/work/`. Review at desktop, tablet and
mobile widths; test menu keyboard handling, Terminal/JSON arrow keys, copy
commands, the build-block copy button, and inactive downloads. Ctrl-C stops it.
The basic server does not emulate Cloudflare headers or redirects.

This preparation session could not bind a local server (sandbox `Operation not
permitted`) or launch Chromium (macOS Mach-port `Permission denied`). Responsive
browser screenshots and rendered accessibility checks therefore remain pending.
Outbound DNS/GitHub checks were also unavailable; source links match the local
Git remote and owner-provided repository, but anonymous access needs rechecking.
Static route/fragment checks and script interaction checks are recorded in the
local handoff report outside the served website. Do not push or deploy until
preview review is complete. Preserve the website's pre-existing unrelated edits.

Before public downloads, complete security qualification and release CI, resolve
release blockers, validate each offered native architecture, publish exact
versioned archives plus checksums and authenticity instructions, then verify each
actual URL and enable only the corresponding controls. Do not invent download
URLs or relabel historical v0.1.0 output.

## Maintenance and content

`.well-known/security.txt` expires on 2027-10-01 and must be renewed before then.
Update legal policy dates when their substance changes. Keep product descriptions
factual and distinguish releases from work in development. Do not add unverified
customers, metrics, partnerships, funding, or capabilities. Company copy uses a
third-person voice without em dashes.

## plainbalance review

From the website root, start the dedicated local preview:

```sh
python3 -m http.server 4182 --bind 127.0.0.1
```

Open http://127.0.0.1:4182/products/plainbalance/. Ctrl-C stops the server.
The product is also linked from the homepage, Work, and every Software footer.
Its styles in `css/plainbalance.css` are scoped to the product page and reuse the
shared website tokens and controls.
`js/plainbalance-navigation.js` prevents the shared mobile menu initialization
from shifting this page. Navigation remains visible without JavaScript, and
the temporary state clears if the shared script fails to load.

The public source is https://github.com/talarurus/plainbalance. v0.3.1 is experimental
development software for fictional records; local databases and backups are
unencrypted. There is no verified consumer installer. Keep platform support
and future milestones aligned with the repository's evidence and roadmap.

The local screenshot gallery contains four unedited v0.3.1 browser captures:
Overview (light), Spending (dark), Cash flow (light) and Accounts (light). They
show the working shared frontend connected to a Rust storage test harness with
the canonical synthetic ledger. Each caption identifies browser UI, synthetic
data and theme. They do not establish native desktop or mobile app support.
The 38 available captures were reviewed; empty states, modal/layout checks and
less suitable views are omitted from the showcase. Transactions can be
recaptured after improving its crowded merchant/classification text.

Assets live in `assets/products/plainbalance/`, with original PNGs under
`v0.3.1/`, the unchanged outlined product lockup, MPL license and provenance.
The four images total 515,938 bytes and use intrinsic dimensions. Overview is
eager-loaded beside the hero; supporting captures are lazy-loaded in matching
frames with contain sizing (no cropping). Images have aligned captions
and link to their uncropped full-size originals. Founder approval of these
specific images and page layout is required before deployment. Future native
captures should follow the repository's `docs/screenshots/README.md` guidance,
use fictional records, retain the full application window and remove personal
desktop details. Never label browser captures as certified native screenshots.

Founder visual approval is required before publishing this website integration.


## plainbalance local rename

The product route is now `/products/plainbalance/`; `_redirects` prepares both former Odaraia URL spellings for a permanent redirect on the existing host. The redirects are not live until an approved deployment. Python's basic server does not apply `_redirects`; test them on a redirect-aware local preview or the approved Pages deployment. The site keeps its official Talarurus logo/favicon and publisher identity unchanged. The product header uses the approved font-independent outlined `plainbalance by Talarurus` lockup with accessible alternative text.

GitHub links use `talarurus/plainbalance` and its published `PLAINBALANCE_*.md` document paths. The founder renamed the existing repository in place, and the reviewed source is published with its original history preserved. Do not create a new repo at the old name, which would invalidate GitHub redirects. Review the complete website diff, local route checks and visual layout before any website push: this site's production branch auto-deploys. No website push, deployment, Cloudflare change or media publication is authorized by the source-publication approval.

The screenshot section is prepared locally for founder visual review, with explicit browser/synthetic-data labels, a verified commit-pinned source ZIP and no consumer installer claims. The reviewed GitHub link handoff from the finance workspace has been applied locally after verifying the renamed public repository and published source. Website deployment remains a separate approval. Preserve unrelated editorial work when staging: shared homepage and About files contain separate changes that must not be included without their own review.


## plainbalance downloads

As checked on 2026-10-12, the public repository has no GitHub Releases, tags or
installer assets. The current product version is v0.3.1 Developer Preview, not
an existing `v0.3.1` release tag. The website links to the verified source ZIP
for reviewed commit `b6fcd4c94ba4ca75d56dd2a3ecfcf93257d4873a`:

https://github.com/talarurus/plainbalance/archive/b6fcd4c94ba4ca75d56dd2a3ecfcf93257d4873a.zip

The archive was downloaded and validated as a ZIP containing the source,
license, changelog and security notices (873,279 bytes). Source archives require
a development environment and are not installers. The changelog and preview
notes contain historical preparation language; there are no GitHub Release
notes yet. The page distinguishes component/build checks from installed desktop
support and uses availability text rather than inactive download buttons.

For future approved releases, use versioned GitHub tags and GitHub Releases as
the canonical distribution location. Each release must identify its source
commit, contain release notes, a `SHA256SUMS` manifest and only verified platform
assets (for example a signed/notarized macOS DMG, a signed Windows installer and
verified Linux packages). Publish checksums alongside the exact release files;
verify downloaded bytes, architecture, signing and platform acceptance before
linking those specific assets from the website. Keep older version links and
release notes available. Do not duplicate hosted binaries in this website or
use a moving `latest` URL as a verified version. Add links to the existing
platform rows only when the corresponding assets and checksums exist and
founder publication approval is given. Consumer installers remain withheld
while financial databases and backups are unencrypted; encryption, protected
backup/recovery and release security gates must pass first. Other platforms
require their own verified runtime and distribution evidence.
