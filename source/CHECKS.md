# The checks in this repo

Run from the repo root, after `bash build.sh && node build-static.mjs`.

| Command | What it proves |
|---|---|
| `node sweep.mjs` | All 78 built pages × 2 viewports: no horizontal overflow, no console error, no 404, exactly one sensible `h1`, no broken image, no unstyled page, no rupee figure in the page source. |
| `node modecheck.mjs` | The four reading states (full / Plain × English / Urdu) render clean on the pages that carry an argument. |
| `node formtest.mjs` | The distributor enquiry form, which the sweep cannot see: phone normalisation across five spellings, email validation, the normalised number shown back to the sender, that Submit exists and falls back to WhatsApp or email rather than losing an enquiry while the backend endpoint is still unbuilt, and that the honeypot field is present. |
| `node simulatortest.mjs` | Both discipline simulators against Tahir's own worked examples, plus a mechanism-leak check against real internal strings. |
| `node sowingtest.mjs` | Blocks 01 and 02 of the crop page, which render nothing until a date is entered: the wheat stage against the published day ranges, the rows due at that stage, the refusal to claim a stage on crops with no published stage model, persistence per crop, and that nothing on the page is gated behind the question. |
| `npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs` | The soil engine across all 28 crops and both lever sets, headless. |
| `node watertest.mjs` | The water panel, which computes nothing until a district is chosen: extraterrestrial radiation re-derived outside the app and sanity-checked against the equator and the solstices, a full FAO model on cotton, the arithmetic of need minus rain, that all three caveats travel with the number, wheat's refusal and its reason, and that the sowing date from block 01 changes the answer. |
| `node balancetest.mjs` | The nutrient balance, which does not exist until a yield is entered: the supply arithmetic on four crops, the removal arithmetic against figures computed outside the app, the bhusa case, the cotton refusal, and that a date palm's five age bands are never summed. |
| `npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __balancecheck` | Every analysis string in all 28 plans and what it parses to, what each programme delivers per acre, and any product carrying two different analysis strings across plans. |
| `npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __climatecheck` | The temperature layer: every station's series complete and internally consistent, all 36 districts assigned, the year interpolating without a step — and it reprints the wheat GDD comparison of 9 Sep 2026 in full, so that finding cannot go stale. |
| `node run-enginetest.cjs __derivecheck` | The two derivation rules that built the 26-crop soil maps, re-checked against the reviewed wheat map. |
| `npx tsc -p tsconfig.enginetest.json && node run-enginetest.cjs __costcheck` | VAN's crop CALCULATOR sheet against VAN's PUBLISHED plan, on wheat and potato: product for product, pack for pack, rate for rate, and the delivered nutrient each one adds up to. The site reads the calculator in one panel and the published plan in another, and until VAN rules on which document governs this check reports every place they differ. |
| `node tools/duplication.mjs` | Every built page stripped to its sentences; anything of 60+ characters appearing on more than one page, grouped by the exact set of pages it appears on, so a shared component collapses into one cluster and authored repetition stands out. `MAX_PAGES=6` sets where the report stops calling a cluster a component. |
| `node tools/profile-shots.mjs [dir]` | The company profile page (D-147) at 390px and 1366px: no horizontal overflow, 1 `h1`, no console error, the PDF download link answers 200 from `out/downloads/`, and screen-height screenshots written to `dir` (default `/tmp/profile-shots`) to look at. |
| `node tools/working-sitemap.mjs` | Writes `site map.html` next to `out/` (not inside it, so it is not uploaded) and checks every internal link on every built page. Runs automatically at the end of `build-static.mjs`. |

A check that needs a browser uses the pinned Chromium at `/opt/pw-browsers/chromium-1194/`.
None of them touch the network.
