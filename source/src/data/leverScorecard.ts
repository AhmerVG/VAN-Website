// Sourced 1:1 from F:\VAN Web APP\Wheat Lever Scorecard & Yield Prediction.xlsx, sheet "Lever
// Reference & Weights" (extracted 8 Sep 2026). Ten levers, weights sum to 100. Tahir's own note on
// that sheet: "Weights and thresholds are a starting, research-informed hypothesis (VAN has no
// historical yield-dose data yet) - revisit after this season's pilot." Wheat only, for now — the
// workbook has no other crop tabs yet.
//
// INTERNAL ONLY: weight, why and source below exist for the underlying score calculation and for
// VAN's own record — the public Discipline Simulator UI (DisciplineSimulator.tsx) must never render
// the numeric weight, the "why" rationale or the "source" citation. Per Tahir 8 Sep: fine that this
// ships inside the JS bundle for phase 1 (no backend yet); the point is that the farmer-facing UI
// itself only ever shows Bad/OK/Best choices and a yield outcome, never the scoring method.
//
// Weights below are the reweighted set approved by Tahir 8 Sep, after a literature audit (see the
// master framework doc): Genetics & Seed Quality, Sowing Time and Micronutrient/Soil Fertility were
// raised (10→13, 8→11, 6→9) on real Pakistan-specific and global evidence found that session;
// Macronutrient, Irrigation, Seed Rate and Weed were trimmed to compensate (18→15, 18→15, 12→10,
// 10→9). Disease, Insect-Pest and Lodging are unchanged — not confirmed correct, just not
// independently verified either way in that pass (source access was partly blocked).
export type Lever = { name: string; weight: number; bad: string; ok: string; best: string; why: string; source: string }

export const WHEAT_LEVERS: Lever[] = [
  { name: "Macronutrient Nutrition (N-P-K)", weight: 15, bad: "Lowest of N%, P%, or K% delivered vs. recommended dose is below 60%", ok: "Lowest of N%, P%, or K% delivered is 60-90% of recommended dose", best: "Lowest of N%, P%, or K% delivered is 90%+ of recommended dose, and balanced", why: "Global synthesis found 60-80% of crop yield changes tied to fertilizer, irrigation and climate combined. Nitrogen deficiency alone can cut wheat yield 20-50%. A North China Plain long-term trial found the yield gap widened fastest in P-omission plots, more than N-omission, with K impact smaller than either. Score off the lowest of N/P/K delivered (not an average), since an imbalance in any one nutrient limits the others.", source: "Mueller et al. 2012, Nature (yield gap synthesis); PMC12616930 (N deficiency 20-50% yield loss); PMC3861355 (NPK omission trial, North China Plain)" },
  { name: "Irrigation Management", weight: 15, bad: "Crown Root Initiation (CRI) irrigation missed/badly delayed, OR post-anthesis/grain-filling irrigation missed", ok: "CRI and post-anthesis both covered, but tillering or jointing irrigation missed/delayed", best: "All critical-stage irrigations delivered on schedule: CRI, tillering, jointing, flowering, grain-filling", why: "Water stress before flowering (pre-anthesis) causes 1-30% yield loss; the same stress after flowering (grain-filling) causes 58-92% yield loss - the timing of the miss matters far more than the total water applied. CRI (~20-25 days after sowing) is consistently identified as the single most critical stage. A Central India trial found irrigating at CRI+tillering+late jointing+late flowering gave the best yield outcome of the schedules tested. Locally, tubewell irrigation was found to account for ~19% of total wheat production cost in a Jhang, Punjab study.", source: "PMC4854884 (Farooq et al., pre/post-anthesis stress %); pub.isa-india.in critical-stage irrigation trial; Sarhad J. Agric. 25(1) Jhang groundwater/wheat cost study" },
  { name: "Seed Rate / Plant Population", weight: 10, bad: "Achieved plant stand below 70% or above 130% of the 30-35 plants/m2 target", ok: "Achieved stand 70-90% or 110-130% of target", best: "Achieved stand within 90-110% of the 30-35 plants/m2 target", why: "A Sargodha, Punjab farmer-survey regression found seed rate had the largest yield coefficient (0.418) of every factor tested, larger than nitrogen fertilizer (0.092) or sowing time. A Dera Ismail Khan trial found harvest index declined progressively as seeding rate rose past its optimum, showing overseeding carries its own penalty. Local guidance targets ~50 kg/acre (timely sown) to 60 kg/acre (late sown), aiming for 30-35 plants/m2.", source: "ResearchGate 270881118 (Sargodha Cobb-Douglas study); scialert.net pjbs.2000.1158.1160 (Dera Ismail Khan seeding-rate trial); GrowTech / local Punjab wheat agronomy guidance" },
  { name: "Weed Management", weight: 9, bad: "No effective weed control applied; weeds left uncontrolled through the season", ok: "Weed control applied but delayed or incomplete relative to the ~60-75 day critical weed-free period", best: "Field kept effectively weed-free through the critical ~60-75 day post-sowing period (pre- and/or post-emergence control)", why: "Uncontrolled weeds cause an estimated 17-25% average annual wheat yield loss in Pakistan, rising to 48-80% for severe infestations of problem weeds such as Phalaris minor. A recent Pakistani seed-rate/weed trial found a weed-free period up to 75 days after sowing was needed to meaningfully reduce weed cover and density.", source: "ScienceDirect S026121941630165X (Pakistan crop weed-loss review, Abbas 2006 figures); ResearchGate 236840706 (six-weed wheat yield-loss trial, Punjab); tandfonline 03650340.2025.2570466 (seed-rate/weed-free-period trial)" },
  { name: "Disease Management (rust and other foliar disease)", weight: 10, bad: "Susceptible variety grown; no monitoring or fungicide control despite visible disease pressure", ok: "Moderately susceptible variety, or fungicide applied late/reactively after visible spread", best: "Resistant/tolerant variety used, with active monitoring and timely fungicide application at first sign of infection", why: "Rust diseases can cause 10-70% yield loss on susceptible wheat cultivars, with losses approaching 100% in intense epidemics. Pakistan's 1995 national yellow rust epidemic caused an estimated 20% yield loss; cultivar-specific stripe rust losses of 5.8-14.9% have been documented in more typical (non-epidemic) years.", source: "Frontiers fpls.2024.1494566 (rust yield-loss range); PMC7570266 (1995 Pakistan yellow rust epidemic, 20% loss); ResearchGate 263101425 (Afzal et al. 2007, cultivar-specific loss %)" },
  { name: "Genetics & Seed Quality", weight: 13, bad: "Uncertified/farmer-saved seed, unknown or non-recommended variety, not cleaned or treated", ok: "Good-quality farmer-saved seed of a recommended variety, cleaned/graded, but not certified or treated", best: "Certified seed of a recommended, locally-adapted variety, treated with fungicide/insecticide before sowing", why: "A Bahawalpur, Punjab study found certified seed increases wheat yield by 25% compared to farmer-saved (home-retained) seed - a large, single-lever effect independent of seed rate.", source: "ojs.ukscip.com/index.php/ia (Bahawalpur agronomic-factors study, certified seed +25% finding)" },
  { name: "Sowing Time", weight: 11, bad: "Sown more than ~2 weeks outside the optimal window (very early October, or December onward)", ok: "Sown within ~2 weeks before/after the optimal window", best: "Sown within the optimal window (Punjab: 1-20 November)", why: "A two-year Chinese field study found wheat yield declined by about 0.97% for each day of deviation, early or late, from the normal sowing date. The Sargodha, Punjab regression found sowing time a significant, negative contributor when delayed. Punjab agronomy guidance consistently places the optimal window at 1-20 November, with late sowing requiring a higher seed rate to compensate.", source: "PMC8759384 (sowing-date dry-matter/yield study, 0.97%/day figure); ResearchGate 270881118 (Sargodha sowing-time coefficient); timesofagriculture.pk / growtechsol.com (Punjab sowing-window guidance)" },
  { name: "Micronutrient Nutrition & Soil Fertility Baseline", weight: 9, bad: "No micronutrient (Zn/B) application on soil known or likely to be deficient (typical Punjab calcareous soil)", ok: "Partial or inconsistent micronutrient application, or none applied where soil status is unconfirmed", best: "Zn (and B where indicated) applied at the recommended rate on soil known or likely to be deficient", why: "A Punjab/Sindh study covering over 2,500 farmers found Zn fertilizer use gave an 8% wheat grain yield response in Punjab (14% in Sindh). Pakistan's calcareous soils are widely documented as Zn- and B-deficient, restricting nutrient availability regardless of macronutrient dose.", source: "Plant and Soil, Springer (link.springer.com/11104-016-2961-7, Zn fertilizer-use valuation, Punjab/Sindh survey); PMC10629380 (alkaline/calcareous soil Zn deficiency, Pakistan)" },
  { name: "Insect-Pest Management (mainly aphids)", weight: 5, bad: "No field scouting or control despite aphid presence", ok: "Reactive control after visible infestation, incomplete coverage", best: "Regular field scouting with timely insecticide/botanical control at threshold aphid levels", why: "Wheat aphids cause 35-40% direct yield loss from sap-feeding, and up to 20-80% indirect loss through viral/fungal disease transmission, in Pakistani wheat.", source: "CABI.org (wheat aphid loss figures, Pakistan); agrinfobank.com.pk (Pakistan wheat insect-pest overview, 35-40% direct / 20-80% indirect)" },
  { name: "Lodging & Harvest Risk", weight: 3, bad: "Significant lodging observed (especially before/during grain filling), or harvest significantly delayed past maturity", ok: "Minor/partial lodging in small patches, or slight harvest delay, with limited impact", best: "No lodging observed; balanced N and a lodging-resistant variety used; harvested at physiological maturity", why: "Lodging is estimated to cause 10-57% yield loss on the North China Plain, rising to 60-75% when a crop lodges flat during the grain-filling period. Irrigated spring wheat trials in Australia recorded 20-60% yield loss from severe lodging.", source: "ScienceDirect S0378429024002211 (Peng et al. 2014, 10-57% lodging loss, North China Plain); ScienceDirect (Predicting yield losses caused by lodging in wheat, 60-75% grain-filling lodging loss); PMC7198859 (Australian irrigated spring wheat lodging trial)" },
]

/**
 * Yield prediction — corrected twice now per Tahir's direction (8 Sep, then 9 Sep):
 *
 * 1. The base is no longer tied to one variety (Dilkash 2020, 71 maunds/acre — a figure that, per the
 *    real published variety-release paper found 8 Sep, doesn't actually appear anywhere in that paper;
 *    see the master framework doc section 11). Tahir's call: use Pakistan's average wheat yield
 *    potential instead — a stated figure of 60 maunds/acre — as the base, not a single variety's
 *    documented figure. WHEAT_YIELD_BASE below reflects this; VARIETY-specific potentials are a later
 *    phase (see the farmer-override note below), not built now.
 * 2. Confirmed by Tahir 9 Sep: 60 is already the OPERATIVE figure, not a raw documented potential — so
 *    the standing 10% measurement margin (MEASUREMENT_MARGIN) is NOT applied on top of it for this
 *    base. WHEAT_YIELD_BASE.operativeMaunds = 60 is used directly as the ceiling. (An earlier version
 *    of this file applied the margin here too, giving 54 — that was flagged to Tahir as an assumption
 *    needing confirmation, and he's confirmed 60 stands as-is. MEASUREMENT_MARGIN and
 *    operativeYieldPotential() remain in place below as the standing rule for any FUTURE crop/variety
 *    figure read from a source workbook that has NOT been confirmed as already-operative — see
 *    checkMeasurementMargin().)
 *
 * predictedYield = ceiling × (totalScore / 100)   // totalScore is 0–100, see WHEAT_LEVERS
 *
 * Farmer override (Tahir 9 Sep, "middle ground for now"): the ceiling is shown as the DEFAULT target,
 * but the farmer can type their own yield-target number instead — e.g. if they know their own variety
 * does better or worse than the Pakistan average. This is not validated against a per-variety table
 * (none exists yet); it is a soft default, not a hard cap. A real variety picker, each with its own
 * linked potential, is future work once VAN supplies per-variety data.
 *
 * FUTURE PHASE (Tahir 9 Sep, not built now): move the ten levers below from farmer self-assessment
 * (choosing "Bad/OK/Best" by reading a description) to system-computed scoring from real numeric
 * inputs — e.g. the farmer enters "applied X kg/acre of N + P + K", and the system determines
 * Good/Bad/Average against a defined threshold, rather than asking the farmer to self-judge which
 * band they're in. Logged here so it isn't lost; needs real per-lever numeric thresholds to build —
 * Tahir asked to move ahead on this too (9 Sep follow-up), but building it for real needs those
 * thresholds from him first; see the master framework doc for the open question back to him.
 */
export const MEASUREMENT_MARGIN = 0.1 // standing rule for NOT-YET-confirmed-operative figures. See checkMeasurementMargin() below

export const WHEAT_YIELD_BASE = { label: 'What a good progressive farmer achieves', operativeMaunds: 60 }

/**
 * Generic utility for a FUTURE crop/variety whose source figure is confirmed raw (not yet
 * measurement-adjusted) — not used for WHEAT_YIELD_BASE, since Tahir confirmed 60 is already
 * operative. Kept here so the standing 10%-margin rule has one place to live for the next crop.
 */
export function operativeYieldPotential(rawPotential: number) {
  return rawPotential * (1 - MEASUREMENT_MARGIN)
}

export function predictYieldMaunds(totalScore: number, ceiling = WHEAT_YIELD_BASE.operativeMaunds) {
  return ceiling * (totalScore / 100)
}

/** Inverse: what overall score (0-100) is needed to reach a target yield, for capping/validating farmer input. */
export function scoreNeededForYield(targetMaunds: number, ceiling = WHEAT_YIELD_BASE.operativeMaunds) {
  return Math.max(0, Math.min(100, (targetMaunds / ceiling) * 100))
}

/**
 * STANDING RULE (Tahir, 8 Sep 2026): whenever a yield-potential figure is read from a source workbook
 * for ANY crop or variety, check whether that source already applies a ~10% reduction against the
 * raw/documented figure before using it further (VAN's own Wheat Lever Scorecard does, via its
 * "90% of the actually documented" column). If it does, treat that reduced figure as the operative
 * ceiling — do not re-apply the margin on top of it. If it does not, apply MEASUREMENT_MARGIN (10%)
 * ourselves before using the figure anywhere downstream (as a model ceiling, a farmer-facing cap, or
 * a nutrition-plan base-yield assumption). Rationale, as stated: no field measurement captures every
 * relevant variable with full accuracy, so the raw documented/varietal potential should never itself
 * be the number the model or the farmer treats as reachable.
 */
export function checkMeasurementMargin(rawFigure: number, figureAsUsedInSource: number, tolerance = 0.01) {
  const expectedIfAlreadyApplied = rawFigure * (1 - MEASUREMENT_MARGIN)
  const alreadyApplied = Math.abs(figureAsUsedInSource - expectedIfAlreadyApplied) < tolerance
  return { alreadyApplied, operativeFigure: alreadyApplied ? figureAsUsedInSource : rawFigure * (1 - MEASUREMENT_MARGIN) }
}

/**
 * POTATO — sourced 1:1 from F:\VAN Web APP\Potato Lever Scorecard & Yield Prediction.xlsx, sheet
 * "Lever Reference & Weights" (Tahir supplied it 9 Sep 2026; extracted the same day). Ten levers,
 * weights sum to 100. The same INTERNAL-ONLY rule as wheat applies: weight, why and source exist for
 * the calculation and for VAN's own record, and the public simulator must never render any of them.
 *
 * His own note on that sheet, carried across because it is the honest status of these numbers:
 * "Weights and thresholds are a research-informed starting hypothesis. Two levers (seed rate/spacing,
 * planting time) lack a Pakistan-specific quantified study — flagged in their evidence column."
 * And: "Revisit all weights once a season of piloted field scores can be compared to actual harvest
 * outcomes." Same posture as wheat, and the same reason to re-open them after the pilot.
 *
 * WHERE POTATO DIFFERS FROM WHEAT, AND WHY IT IS NOT A COPY:
 *  · Seed is the heaviest lever at 20 (wheat 13). In potato the seed IS the previous crop and carries
 *    virus forward — degeneration is documented at 1–17% in year one rising to 37–65% by the second
 *    year of farmer-saved seed.
 *  · Disease is 18 (wheat 10). Late blight is documented at 30–75% annual loss in Pakistan and 100%
 *    in an epidemic, and Pakistani indigenous germplasm lacks resistance.
 *  · Insect-pest is 10 (wheat 5), because aphids here are a VIRUS VECTOR, not only a feeder.
 *  · Hilling / earthing-up (6) has no wheat equivalent at all — it is specific to a tuber crop.
 *  · There is NO WEED LEVER, where wheat has one at 9. That is Tahir's set as supplied, not an
 *    omission introduced here.
 *  · Macronutrient is 12 (wheat 15) and is written around POTASH and nitrogen timing rather than NPK
 *    generally — the calcareous-soil K optimum from Hannan et al. (2011) is the anchor.
 */
export const POTATO_LEVERS: Lever[] = [
  { name: "Seed Tuber Quality & Source", weight: 20, bad: "Uncertified/farmer-saved seed, multiple generations since the last certified or clean source, no inspection or rogueing", ok: "Farmer-saved seed but 1st–2nd generation from a known clean/certified source, visually inspected and rogued", best: "Certified or quality-declared seed tubers from a recognised, disease-tested/virus-indexed source", why: "Pakistani literature identifies non-availability of certified seed as the single most important factor limiting potato production in the country - over 95% of seed requirement is met from an informal system carrying 20+ soil- and tuber-borne diseases. Seed degeneration (yield/quality decline from virus buildup across generations) is documented at 1-17% in the first year but rising to 37-65% by the second year of farmer-saved seed. Where PVY and PVX occur together, documented yield losses reach 50-80%.", source: "ResearchGate 326352704 (true potato seed review, citing Farook 2005 and Jagirdar et al. 1982 on Pakistan seed system and degeneration rates); ScienceDirect S0304423826001755 (PVY+PVX combined yield-loss study)" },
  { name: "Disease Management (late blight and other field disease)", weight: 18, bad: "Susceptible variety, no fungicide programme, no field monitoring despite cool, humid blight weather", ok: "Fungicide applied reactively after visible late blight symptoms; monitoring only moderate", best: "Preventive programme run through the cool-humid spells, active field scouting, and a less-susceptible variety where one is available", why: "Late blight (Phytophthora infestans) is documented as causing 30-75% annual yield loss in Pakistan, reaching 100% under epidemic conditions - Pakistani indigenous germplasm lacks resistance, so chemical/cultural management is the primary control available. This is the same pathogen responsible for the Irish Potato Famine and remains the single most destructive potato disease worldwide.", source: "PARC/journal.sja Occurrence of Late Blight survey, Punjab (Raza, Ghazanfar & Hamid, 2019); ResearchGate 404861986 (P. infestans characterization, Pakistan, 20-100% yield reduction / 100% under epidemic)" },
  { name: "Irrigation Management", weight: 15, bad: "Tuber initiation or bulking irrigation missed or badly delayed, or the ridge waterlogged", ok: "Minor delay or unevenness during initiation or bulking, but nothing missed outright", best: "Soil moisture held steady through tuber initiation and bulking - never allowed below about 60% of available moisture, and never waterlogged", why: "Potato yield is highest at all growth stages when available soil moisture doesn't fall below 60% between irrigations, and tuber bulking is consistently identified as the single most water-sensitive stage. Beyond tuber malformation, total tuber yield loss under water stress is well documented at scale: moderate deficit irrigation trials show 14.9-39.8% total yield loss, severe/season-long deficit trials show 41-65% loss, and yield loss in the complete absence of water can reach approximately 69%.", source: "ResearchGate 356875099 (60% soil moisture threshold); PMC10279688 and ScienceDirect S0378377422003407 (deficit irrigation trials, 14.9-65% total yield loss by severity); PMC8476517 / Nature s41598-021-97899-9 (potato tuber yield loss up to 69% in absence of water)" },
  { name: "Macronutrient Nutrition (potash and nitrogen timing)", weight: 12, bad: "Potash well below the local optimum, or nitrogen timing ignored - heavy late nitrogen delaying maturity", ok: "Potash applied at part of the optimum; nitrogen reasonably timed but not split to match peak demand", best: "Potash applied at the optimum for calcareous ground, with nitrogen split to match peak demand at tuber bulking (roughly 42-70 days after planting)", why: "Potato is the most nitrogen- and potassium-demanding common field crop; roughly 4 kg of nitrogen is removed per ton of tubers produced. A study conducted specifically on calcareous Pakistani potato-growing soil (Hannan et al., 2011) established an optimum potassium dose of approximately 155-182 kg K2O/ha for tuber quality and dry matter on this soil type. Nitrogen need peaks at the tuber bulking stage; excess season-long nitrogen availability is separately documented to delay tuber maturity.", source: "ResearchGate 356875099 (N removal rate, N timing effects); Hannan, Arif, Ranjha, Abid, Fan & Li (2011), Commun. Soil Sci. Plant Anal. 42(6):645-655 (calcareous Pakistani soil, K optimum)" },
  { name: "Insect-Pest Management (aphids and tuber moth)", weight: 10, bad: "No scouting and no control, with aphids or tuber moth present in the crop", ok: "Insecticide applied only after visible infestation or damage", best: "Regular scouting with timely control - early-season aphid control to limit virus spread, and enough soil cover on the ridge to keep tuber moth off the tubers", why: "This lever carries extra weight in potato versus wheat because aphids are a virus vector, not just a direct feeder: a Pakistan-focused review documents PVY yield losses up to 70% when infection occurs at early growth stages, and aphid incidence is positively and significantly correlated with PVY spread. Separately, potato tuber moth (Phthorimaea operculella) is documented causing up to 50% yield loss through grade-outs, and tuber damage of 24-27.5% of tuber weight at harvest in one study, with storage losses reported up to 42% in affected regions.", source: "ResearchGate 325531985 (Potato production in Pakistan review - PVY yield loss and aphid correlation); ResearchGate 368643516 (potato tuber moth biology/management review - grade-out and storage loss figures)" },
  { name: "Hilling / Earthing-Up and Land Preparation", weight: 6, bad: "Not hilled, or hilled so late that tubers were exposed and greened", ok: "Hilled, but late or with incomplete cover", best: "Ridges built up at the right stage and kept up, with no tuber exposed to light", why: "Not present at all in the wheat lever set - specific to tuber crops. Light-exposed tubers develop chlorophyll (greening) and solanine, an established quality/marketability defect, and inadequate hilling is separately noted in the tuber-moth literature as a factor that increases moth access to tubers, connecting this lever to the pest-management lever above.", source: "ResearchGate 368643516 (potato tuber moth review, hilling/soil-cover as a stated cultural control) - a dedicated Pakistan-specific greening yield-loss % was not located in this review" },
  { name: "Micronutrient and Soil Fertility (calcium, zinc, boron)", weight: 6, bad: "No micronutrient applied on soil known or likely to be short - typical Punjab calcareous ground", ok: "Micronutrient applied partially or inconsistently", best: "Calcium, zinc and boron applied against a soil test or the known regional deficiency pattern", why: "A Pakistan-specific field trial (Agricultural Research Institute, Swat, Khyber Pakhtunkhwa) tested potassium and zinc together on potato and found combined K-Zn application improved growth, yield, and tuber quality. This sits within a broader documented pattern: roughly 70% of Pakistan's soils are zinc-deficient, affecting potato alongside wheat, rice, cotton, and other major crops - the same calcareous-soil constraint already flagged for the wheat model.", source: "researcherslinks.com (Effect of Potassium and Zinc on Growth, Yield and Tuber Quality of Potato, ARI Mingora Swat, KP, Pakistan field trial); pakbs.org PJB 42(4) (Pakistan soil micronutrient deficiency review, 70% Zn-deficient soils)" },
  { name: "Seed Rate / Plant Spacing", weight: 5, bad: "Spacing or seed rate far outside the recommended range - overcrowded or too sparse - leaving a poor stand", ok: "Moderate deviation from the recommended spacing or seed rate", best: "Within the recommended spacing and seed rate for the variety and the seed tuber size used", why: "General potato agronomy guidance (not a single Pakistan-specific quantified study located in this review) - standard row/plant spacing and seed-rate recommendations exist for local varieties; deviation reduces stand uniformity and tuber size distribution. Flagged as an area to firm up with local extension figures before finalizing this threshold.", source: "General potato agronomy guidance - Pakistan-specific quantified seed-rate study not yet located; revisit before finalizing" },
  { name: "Planting Time", weight: 5, bad: "Planted well outside the recommended window for the area - risking frost at emergence or heat at tuberisation", ok: "Planted slightly outside the optimal window", best: "Planted inside the recommended window for that season and growing area, autumn or spring", why: "General potato agronomy knowledge - potato tuberization and emergence are both temperature-sensitive (frost-sensitive foliage, heat-suppressed tuberization above ~30C soil temperature). A Pakistan-specific quantified planting-date yield-loss study was not located in this review; treat this threshold as provisional pending local trial data or extension guidance.", source: "General potato temperature-sensitivity agronomy - Pakistan-specific quantified study not yet located; revisit before finalizing" },
  { name: "Harvest Timing and Post-Harvest Handling", weight: 3, bad: "Harvest well past maturity, or tubers stored without curing or ventilation - weight loss, sprouting or moth damage follows", ok: "Timing reasonable but curing or storage practice incomplete", best: "Lifted at physiological maturity, properly cured, and stored somewhere ventilated at the right temperature", why: "Weighted lower than in a full value-chain model because it mainly protects value already produced rather than field yield itself - but it is real: high temperature and low humidity in storage cause weight loss (driage), and tuber moth specifically continues to cause storage losses (documented up to 42% in affected regions, see pest lever) when curing and ventilation are inadequate.", source: "FAO (fao.org/4/i0200e/I0200E11.htm) - Post-Harvest Issues of Potatoes in Asia and the Pacific Region" },
]

/**
 * POTATO YIELD BASE — CORRECTED 9 September 2026, and it needs Tahir's signature before go-live.
 *
 * THE FAULT. His own scorecard sheet gives Sahiwal White a documented potential of 30.5 tonnes and
 * the model read that as tonnes PER ACRE. 30.5 t/acre is 75.4 t/ha, which is roughly three times the
 * best potato yields achieved anywhere in the world. After his own 90% margin the model was printing
 * 686.25 maunds per acre, or 67.8 t/ha. No field on earth does that.
 *
 * The earlier note in this file flagged the unit as "worth confirming once with him" and then used
 * the figure anyway. That was the wrong call: a number that cannot be true should not have been left
 * running while the question sat open.
 *
 * THE CORRECTION, and it lands in the same place by two independent routes.
 *
 *   Route 1 — his own sheet, read as tonnes per HECTARE, which is how potato potential is normally
 *   published: 30.5 t/ha x 0.9 = 27.45 t/ha = 11,109 kg/acre = 277.7 maunds/acre.
 *
 *   Route 2 — his instruction tonight: "pick the slightly higher average yield of Pakistan and make
 *   it base, slightly higher is like 10%, and Okara cluster is a good base for Pakistan."
 *   Pakistan's national average is 24,428.5 kg/ha (FAO, 2023: 8,319,770 t from 340,576 ha).
 *   24.43 t/ha x 1.10 = 26.87 t/ha = 10,874 kg/acre = 271.9 maunds/acre.
 *
 * The two agree to within 2%, which is the strongest evidence available that the unit was the fault
 * and the figure itself was sound. The sheet's own number is used, because it is VAN's.
 *
 * ACRES, NOT HECTARES, per his standing ruling: the operative figure is in maunds per acre and the
 * source figure is kept here in the unit FAO published it in, so the citation still checks out.
 *
 * AWAITING HIS VALIDATION: "find it and tell me, i will validate before it go live." The base below
 * is the corrected arithmetic; it is not yet his signed number.
 *
 * The variety is named because the number belongs to it. If VAN supplies other varieties with their
 * own documented potentials, this becomes a picker rather than a constant.
 */
/**
 * THE POTATO CEILING IS TAHIR'S OWN FIGURE, 10 September 2026 — 300 maunds/acre.
 *
 * It replaces 277.7, which was derived: documented Sahiwal White at 30.5 t/ha, less the 10%
 * measurement margin. Two things were wrong with that. It sat only 12% above Pakistan's national
 * average, which is far too low for a number a well-run farm is meant to be able to reach; and it
 * was arithmetic on a variety figure rather than a yield anybody had ruled on.
 *
 * HE FIRST WROTE 3,000 AND IT WAS PUT BACK TO HIM RATHER THAN ENTERED. 3,000 maunds/acre is 296
 * t/ha — roughly three times the highest potato yield ever recorded anywhere and twelve times
 * Pakistan's average. He confirmed a digit had slipped and ruled 300. The same handling as the wheat
 * base: HIS number is the operative one, so no measurement margin is applied on top of it.
 *
 *   300 maunds/acre x 40 kg = 12,000 kg/acre x 2.4710538 = 29,652 kg/ha = 29.7 t/ha
 *   Pakistan average 2023 (FAO): 24.43 t/ha = 247.2 maunds/acre. His ceiling sits 21% above it.
 *   Documented Sahiwal White 30.5 t/ha = 308.7 maunds/acre, so 300 is just under the variety figure.
 */
export const POTATO_YIELD_BASE = {
  label: 'Sahiwal White',
  /** Tonnes per hectare, from his scorecard sheet. Kept as the comparison, not as the source. */
  documentedTonsPerHa: 30.5,
  /** His ruling, 10 Sep 2026. Operative as stated — no margin applied. Was 277.7, derived. */
  operativeMaunds: 300,
  /** For the note on the page: what the national average would give under his own +10% rule. */
  nationalAverageCheckMaunds: (24.4285 * 1.1 * 1000) / 2.4710538 / 40,
}

/** Every crop with a real, sourced lever model behind it. Anything absent has no simulator. */
export const CROP_LEVERS: Record<string, { levers: Lever[]; base: { label: string; operativeMaunds: number } }> = {
  wheat: { levers: WHEAT_LEVERS, base: WHEAT_YIELD_BASE },
  potato: { levers: POTATO_LEVERS, base: POTATO_YIELD_BASE },
}
