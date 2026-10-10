# ascii.rest 0.3.0

Source: https://github.com/bas3line/ascii/tree/7f86daf5dfed61a1e4f72fb40b734bc604fa35ff

Vendored files: src/mount.ts and src/pieces/saptarishi.ts. TypeScript annotations
were removed with Node 24 stripTypeScriptTypes (mode: strip). Trailing whitespace left by type stripping was removed. The upstream runtime
and comments are unchanged. Full MIT terms are preserved in LICENSE.txt.

Upstream TypeScript SHA-256:

- mount.ts: 259a6635dd174c142f6244de318e585c21127354a0b40ef77469c0d4c29008ed
- saptarishi.ts: ae99632521036bfb2e7293fa6f45ab24382dd5347d31148386a8ecba1e5d1011

The website self-hosts these files. No CDN, React, remote fonts, or third-party
runtime requests are required. js/atmosphere.js configures the piece at 12 fps
with a pause control and static fallback. The upstream player stops for reduced
motion, offscreen elements, and hidden tabs.
