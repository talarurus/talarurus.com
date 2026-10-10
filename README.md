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

- `/`: studio homepage, featured Hammerhead release, and work in development.
- `/work/`: released and in-development projects.
- `/hammerhead/`: product overview and actual v0.1.0 CLI demonstrations.
- `/hammerhead/docs/`: commands, reports, security model, and limitations.
- `/hammerhead/release/`: verified release information and availability.
- `/about/`: studio background and founder identity.
- `/contact/`: company email, security reporting, and GitHub links.
- `/security/`, `/privacy/`, `/terms/`: disclosure guidance and legal information.
- `404.html`: unknown-path response.

Every page is standalone HTML. The header and footer appear in all eleven HTML
files; update them consistently and mark the active navigation link with
`aria-current="page"`. Keep `sitemap.xml` in sync with public routes.

## Styling and progressive enhancement

`css/styles.css` defines the Precision layout, responsive rules, warm neutral
palette, and shared controls. Inter is self-hosted under the SIL Open Font License
in `assets/fonts/OFL.txt`. The official logo and favicon exports in `assets/` are
canonical, monochrome brand assets; do not redraw or recolor them.

`js/site.js` enhances mobile navigation, accessible Terminal/JSON report tabs,
and clipboard controls. Links and essential content remain usable without
JavaScript. Product demonstrations preserve actual Hammerhead v0.1.0 output on a
synthetic fixture with no usable credentials. The JSON panel is a summary excerpt.

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
return 404. Preserve Cloudflare Web Analytics and script injection as disabled,
consistent with the Privacy Policy and CSP.

## Hammerhead distribution follow-up

No verified public repository or download URL is currently available. Product
pages use a non-clickable availability status and working local documentation.
The owner must provide a verified, anonymously accessible destination before a
download link is added. Do not publish Hammerhead source or release binaries as
part of a website deployment.

## Maintenance and content

`.well-known/security.txt` expires on 2027-10-01 and must be renewed before then.
Update legal policy dates when their substance changes. Keep product descriptions
factual and distinguish releases from work in development. Do not add unverified
customers, metrics, partnerships, funding, or capabilities. Company copy uses a
third-person voice without em dashes.
