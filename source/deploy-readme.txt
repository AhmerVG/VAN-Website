VAN - NEW SITE STATIC BUILD
Built 2 Oct 2026 (v61.14).  85 HTML files (84 pages plus 404.html).  Replaces v61.13.

DO NOT UPLOAD THIS FILE. It is a packing note, not part of the site. Everything else
in this folder goes up; this one stays on your machine.

WHAT IS NEW IN THIS BUILD
  - New folder data/ with lenses.json (about 620 KB). Every interactive chart on the
    knowledge pages and the Soil Atlas reads it. Without it those charts show
    "This chart could not load". After upload, check https://www.van.com.pk/data/lenses.json opens.
  - New page: knowledge/data.html (the list of interactive charts). In sitemap.xml.
  - downloads/Soil-Poverty-Punjab-Potash-Tahir-Abbas.pdf reissued (1 sentence added).
  - To roll back to v61.13: upload v61.13 on top, then delete knowledge/data.html, the
    data/ folder and the v61.14 script file (v.<hash>.js not named in v61.13's pages).

NEVER wipe the web root: /plans, /lms, /sds and /spec-sheets hold linked files that are
not in this build. Upload on top.

--- Earlier note (27 Sep 2026), kept below for the record ---

VAN - NEW SITE STATIC BUILD
Built 27 Sep 2026 (v61).  81 pages (80 pages plus 404.html).  Replaces the 26 Sep build (v60).

DO NOT UPLOAD THIS FILE. It is a packing note, not part of the site. Everything else
in this folder goes up; this one stays on your machine.

WHAT IS NEW IN THIS BUILD
  - New skin on every page: self-hosted fonts (the 9 .woff2 files at the root are part of
    the site; the CSS loads them). No Google Fonts, no fonts inside the script any more.
  - New page: knowledge/nutrients.html (the 17 nutrients and the barrel). In sitemap.xml.
  - New page: composition.html (every brand and library code with its analysis).
  - api/enquiry.php and api/ping.php: the form endpoint, DORMANT until the flag is
    switched on in the source (src/lib/forms.ts). See HANDOFF 27 Sep 2026.md, "For Ahmer".
  - Upload separately to /lms/ on the server: VAN-LMS-Vital-Urea.pdf, VAN-LMS-Vital-Potash.pdf
    and VAN-LMS-Green-Phosphate.pdf (all rebuilt 27 Sep 2026). The product pages link to them there.
  - The folder downloads/ (the company profile PDF, web edition) still goes up; the PDF itself
    was reissued tonight (D-203).

NEVER wipe the web root: /plans, /lms, /sds and /spec-sheets hold linked files that are
not in this build. Upload on top.

--- Earlier note (25 Sep 2026), kept below for the record ---

VAN - NEW SITE STATIC BUILD
Built 25 Sep 2026.  80 pages (79 pages plus 404.html).  Replaces the 9 Sep build.

DO NOT UPLOAD THIS FILE. It is a packing note, not part of the site. Everything else
in this folder goes up; this one stays on your machine.

UPLOAD WITH THIS BUILD
  - The folder downloads/ (the company profile PDF, web edition). Without it the
    company profile download link answers 404.
  - Upload separately to /lms/ on the server: VAN-LMS-Vital-Urea.pdf and
    VAN-LMS-Crop-Sugarcane.pdf (both rebuilt 25 Sep 2026). The crop and product pages
    link to them there.

--- Earlier note (9 Sep 2026), kept below for the record ---

VAN — NEW SITE STATIC BUILD
Built 9 Sep 2026.  78 pages.  Replaces the 8 Sep build.

DO NOT UPLOAD THIS FILE. It is packing-note, not part of the site. Everything else
in this folder goes up; this one stays on your machine.

WHAT CHANGED SINCE 8 SEP
  · /one-tank.html is no longer a gap. Its whole content is now section 05 of
    /knowledge/application-systems.html, and the old URL 301s to that section.
    That was the last content difference between the old live site and this one.
  · The build has its own 404 page (/404.html). Until now, uploading on top of the
    live site meant the OLD site's 404 page kept answering for the new one.
  · THE SOIL LAYER RUNS ON ALL 28 CROP PROGRAMMES, not two. Each crop answers only
    the readings its own published plan can act on, which is why coverage differs
    (wheat 10, potato 7, date palm 4). Nothing was added to any programme.
  · TWO VIEW SWITCHES, in a slim bar under the header. "Simple view" folds the
    argument and leaves every rate, quantity, method, pack size and caution exactly
    where it was. "اردو" shows Urdu labels beside the English — never instead of it,
    and never on a product name, analysis, rate or pack size.
  · TAHIR'S 9 SEP AGRONOMY RULINGS ARE APPLIED: V-Transform lists all three methods
    (the stage decides), V-Compost is broadcast/drilled only, Crop Force is drilled,
    side-dressed or band-placed only, and sugarcane's Green Sulfur now reads against
    the 20 kg bag — 10 kg/acre, matching the ratoon plan instead of 0.5 kg.
  · The Punjab sulfur map is off the Tools page. VAN does not have one.
  · .htaccess gained the one-tank redirect and the ErrorDocument line. Use the copy
    dated 9 Sep — "htaccess for van.com.pk.txt".

HOW TO UPLOAD — read this part twice
  1. Upload the CONTENTS of this folder INTO the existing web root.
     UPLOAD ON TOP. DO NOT WIPE THE WEB ROOT FIRST.
     /plans, /lms, /sds and /spec-sheets hold 96 linked files that are NOT in this
     build. Deleting the root deletes them, and every product page links to them.
  2. This zip already contains favicon.ico, favicon-16x16.png, favicon-32x32.png,
     apple-touch-icon.png and og-image.png. If your upload tool skips them, copy
     them across by hand — every page references them.
  3. Install "htaccess for van.com.pk.txt" in the web root as ".htaccess"
     (note the leading dot). Use the 9 Sep copy, not an older one.
  4. Re-submit sitemap.xml in Search Console. /foliark-precise.html is deliberately
     absent from it (it 404s on the live site and is not on disk anywhere).

CHECK BY HAND AFTER UPLOAD — a redirect that silently fails is worse than none
  curl -I https://www.van.com.pk/one-tank.html
      -> 301 to /knowledge/application-systems.html#one-tank
  curl -I https://www.van.com.pk/lab/tests.html      -> 301 to /lab/index.html#prices
  curl -I https://www.van.com.pk/brands/vital-urea.html   -> 200, NOT a redirect
  curl -I https://www.van.com.pk/no-such-page       -> 404, and the page you see
      should be the NEW 404 ("This page isn't here. The field still is."), not the
      old site's.

WHAT THIS BUILD IS
  Every page is real, pre-rendered HTML at the URL the live site already uses, with
  its own title, description, canonical and OG tags, sharing one cached bundle. It
  renders correctly with JavaScript switched off. No price figure appears in any
  page source — prices are a conditional render inside the plan tools only.

VERIFIED BEFORE PACKING
  78 pages x 2 viewports: zero horizontal overflows, zero console errors, zero
  failed requests, zero h1 problems, zero broken images, zero unstyled pages, and
  no rupee figure in any page source.
  The 404 page was checked served from three different URL depths — it renders
  styled and its links work from all of them.
  The two view switches are not in the pre-rendered HTML, so they were checked
  separately: all four combinations of Simple view and Urdu, five pages, two
  viewports, clean.
  The engine test drives all 28 crops: the 2x dose cap holds at exactly 2.000x with
  every soil reading Critical, healthy soil changes nothing, EC never produces a
  product, the pH substitution stays nitrogen-neutral, and every soil responder is
  a product that crop's own plan actually contains.

────────────────────────────────────────────────────────────────────────
ADDED 10 SEP 2026 — ONE NEW REDIRECT, AND ONE NEW PAGE

The Make With Us page was rewritten for manufacturing and own-brand partners. It is no
longer a page for dealers and distributors, so the distributor page moved out from under
it and now lives at its own address.

  NEW FILE      /become-a-dealer.html
  OLD ADDRESS   /partner/distributor.html   (indexed, must not 404)

ADD THIS LINE to the .htaccess redirect block, alongside the nine already there:

  Redirect 301 /partner/distributor.html /become-a-dealer.html

Nothing else changed in the redirect map. The other five /partner/ pages keep their
addresses exactly as they are.
