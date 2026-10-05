# van.com.pk website source

This folder is the source of the website in this repo. The repo root is the BUILT site
(the pages, the bundle `demo.<hash>.js`, PDFs, images). This folder is how that built site is made.

**This folder is never uploaded to the web server.** It holds no password, key or token.
The `.htaccess` in this folder refuses all web requests to it, in case the whole repo is ever
copied into `public_html`.

Source version: v61.14 (2 Oct 2026), plus the form inboxes of commit `31e7ed5` (3 Oct 2026)
in `site-root/api/enquiry.php`. Decision log: `F:\VAN Web and App\Website\Working Source\DECISIONS.md`.

## What you need

- Node 22 and npm 10 (built and checked with Node 22.22.0, npm 10.9.4).
- Linux or macOS shell (bash). On Windows, use WSL.
- Chromium for the static build. `build-static.mjs` renders every page in a real browser.
  It uses `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` unless you set `CHROME`
  to another Chromium path, for example, after `npx playwright install chromium`:
  `export CHROME=$(node -e "console.log(require('playwright').chromium.executablePath())")`

## Build, step by step

1. Pull first. Never force-push; other people commit to this repo.

       git pull

2. Copy this folder to a working folder **named `demo`**, outside the repo.
   Parcel names the bundle after the folder, and the pages expect `demo.<hash>.js` and
   `demo.<hash>.css`. Built in a folder with any other name, the bundle gets another name.

       mkdir -p ~/van-build && rm -rf ~/van-build/demo
       cp -r source ~/van-build/demo
       cd ~/van-build/demo

3. Install exactly the locked versions (`package-lock.json`):

       npm ci

4. Build the bundle, then the static pages:

       bash build.sh
       node build-static.mjs

   `build.sh` writes `dist/` (and `bundle.html`, a single-file copy, not uploaded).
   `build-static.mjs` writes `out/`: every page as its own HTML file, the bundle, fonts,
   images, `sitemap.xml`, and everything in `site-root/` (`api/`, `data/`, `downloads/`, `3d/`,
   `favicon.ico`). It stops if `site-root/data/lenses.json` is missing or a chart fails to load.

5. Copy **the contents of `out/`** onto the root of this repo (on top, never wipe first),
   except `READ ME FIRST — how to upload this.txt`, which is a packing note:

       cp -r ~/van-build/demo/out/. /path/to/VAN-Website/
       rm "/path/to/VAN-Website/READ ME FIRST — how to upload this.txt"

   If the bundle hash changed, remove the old `demo.<oldhash>.js` / `.css` from the repo root
   once no page names them.

6. Check with `git status` and `git diff --stat`, then commit the source change and the
   rebuilt site together.

## Files that live only in the repo root, not in this source

Keep them. A build does not make them and must never delete them:
`.htaccess` (redirects, 404, caching), `.gitattributes`, `apple-touch-icon.png`,
`favicon-16x16.png`, `favicon-32x32.png`, `og-image.png`, and the folders `lms/`, `plans/`,
`sds/`, `spec-sheets/` (linked PDFs). `img/cd6b279cbad1.webp` is old and unreferenced.

## What changes from build to build without a source change

Only the build date: `<lastmod>` in `sitemap.xml` and the `max` date of the sowing-date box on
the 28 crop pages. Everything else is byte for byte the same (checked 5 Oct 2026).

## Where things are

- `src/` the React app. Pages in `src/pages/`, data in `src/data/`, the O2S link in `src/lib/o2s.ts`,
  the form link in `src/lib/forms.ts`.
- `site-root/` copied as it is into the built site: `api/enquiry.php` (the form endpoint; its
  inboxes must match the repo root's `api/enquiry.php`), `data/lenses.json`, `downloads/`, `3d/`.
- `build-static.mjs` the route table, page titles and descriptions.
- `deploy-readme.txt` the packing note written for each build.
- `*.mjs` at the top level: checks run against a built site (`sweep.mjs`, `modecheck.mjs`,
  `formtest.mjs` and others). They use a fixed Chromium path; edit it if yours differs.
- `CHECKS.md` what was checked and how.

## Left out on purpose

`node_modules/`, `dist/`, `out/`, `.parcel-cache/`, `bundle.html`, `review-copy.html`,
`enginetest-out/`: all are made by the build or the tests.
