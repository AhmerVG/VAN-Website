// Auto-generated from the live site (VAN Live Site, 31 Aug 2026). Every figure here is transcribed from van.com.pk pages — do not edit numbers by hand.
// D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction
// Tahir 7 Nov 2026 (CO-21): V-Germinator Pro, VL-Potash Liquid, VL-NPK and Humi Grow Plus analyses (and Humi Grow Plus plan rows) on the oxide basis (P₂O₅, K₂O), as the bags print.
// Tahir 7 Nov 2026 (PR-1, PR-7, PR-14, PR-15, PR-21, PR-22, PR-45): PRODUCTS badges, methods, stages and 3 analysis strings changed;
// PR-7 also changes the V. Ammonium Phosphate analysis in the crop plan rows below (10:44:0 to 11:44:0), nothing else in them.
// Tahir 10 Nov 2026 (FU-1): the product is renamed V-Phosphate (was "V. Ammonium Phosphate" in PRODUCTS and "V. Ammonium Phosphate (V-Phosphate)"
// in the crop plan rows). Only the product name string changed in those rows; slug 'v-phosphate' and the URL stay.
// L1 editor round 7 Nov 2026 (m8, m10, m13, m14): in PRODUCTS only, SCU, TSP and SOP written out, "% w/v" explained, "Engineered against calcium fixation" reworded,
// V-Zinc read as zinc 10% (MASTER_PRODUCTS Zn 10; plan rows "Zinc 10% w/v"), catLabel and "Humic acid" in 1 case. No CROP_PLANS row changed.
// L1 editor 7 Nov 2026 (m15): SOP analysis 'Soil & fertigation' -> 'Soil and fertigation' (no ampersand in running text; shown on the nutrients page and the product pages).
// Tahir 27 Sep 2026, settled PR-2 (L2 fact check 9 Nov 2026, W6): SOP methods 'Soil application · Fertigation' (was 'Fertigation' only),
// and the method taken out of the SOP analysis line (was '... S 17.5%. Soil and fertigation').
import { applySulfurRule } from '../lib/sulfurPack'
export type Product = { slug:string; name:string; cat:'N'|'P'|'K'|'NPK'|'MICRO'|'SEC'|'BIO'; catLabel:string; analysis:string; methods:string[]; stages:string[]; exclusive:boolean; badge:string; family:boolean; png?:string|null }
export const PRODUCTS: Product[] = [
 {
  "slug": "vital-urea",
  "name": "Vital Urea",
  "cat": "N",
  "catLabel": "Nitrogen",
  "analysis": "Sulfur coated urea. N 32% · S 13%",
  "methods": [
   "Drill at sowing; broadcast if no drill"
  ],
  "stages": [
   "Sowing",
   "Early growth"
  ],
  "exclusive": false,
  "badge": "Open to distributors · Own-brand manufacturing",
  "family": false,
  "png": "urea"
 },
 {
  "slug": "v-phosphate",
  "name": "V-Phosphate",   // Tahir 10 Nov 2026 (FU-1): renamed from "V. Ammonium Phosphate"; slug and URL unchanged
  "cat": "P",
  "catLabel": "Phosphorus",
  "analysis": "11:44:0 + Fe",
  "methods": [
   "Fertigation"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "np-range",
  "name": "VAN NP Range",
  "cat": "P",
  "catLabel": "Phosphorus",
  "analysis": "6:32 (Green Phosphate) · 5:40 · 8:38. Designed to reduce the fixation of phosphate by calcium",
  "methods": [
   "Drill at sowing; broadcast if no drill"
  ],
  "stages": [
   "Sowing"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": true,
  "png": null
 },
 {
  "slug": "green-phosphate",
  "name": "Green Phosphate",
  "cat": "P",
  "catLabel": "Phosphorus",
  "analysis": "6:32:0 · humic-coated acidic. The 6:32 grade of the VAN NP Range, which has 3 grades",
  "methods": [
   "Drill at sowing; broadcast if no drill"
  ],
  "stages": [
   "Sowing"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "gphos"
 },
 {
  "slug": "fusion-phosphate",
  "name": "Fusion Phosphate",
  "cat": "P",
  "catLabel": "Phosphorus",
  "analysis": "Triple superphosphate (TSP). P₂O₅ 46%",
  "methods": [
   "Drill at sowing; broadcast if no drill"
  ],
  "stages": [
   "Sowing"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "v-germinator-pro",
  "name": "V-Germinator Pro",
  "cat": "P",
  "catLabel": "Phosphorus",
  "analysis": "Liquid. P₂O₅ 27% · N 4.5% · K₂O 2%, with Mg, S and Fe",
  "methods": [
   "Fertigation"
  ],
  // Tahir 10 Nov 2026 (R3-8): VAN's guidance of 23 July 2026 (stages by crop group); the tags follow the deck's season bar
  // (Tahir 9 Nov 2026, LM-N27): germination to grand growth. The product page prints the guidance itself. Was ["Grand growth"].
  "stages": [
   "Germination",
   "Early growth",
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "vital-potash",
  "name": "Vital Potash",
  "cat": "K",
  "catLabel": "Potash",
  "analysis": "N 11% · K₂O 44%, boron-coated in 2 forms",
  "methods": [
   "Fertigation"
  ],
  // Tahir 9 Nov 2026: the card names the 2 stages the crop plans most often give (grand growth and maturity); was "Grand growth" only.
  "stages": [
   "Grand growth",
   "Maturity"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "vpot"
 },
 {
  "slug": "fusion-potash",
  "name": "Fusion Potash",
  "cat": "K",
  "catLabel": "Potash",
  "analysis": "2:0:50 + S 1.5% · B 1% · Mg 1%. Made in 2 forms: granules for broadcasting and soluble powder for fertigation.",   // Tahir 10 Nov 2026 (PR-N9): forms named; was "1 for broadcasting and 1 for fertigation". L1 10 Nov 2026 (crops 8): full stop added.
  "methods": [
    "Broadcast",
    "Fertigation"
   ],
  "stages": [
   "Land preparation"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "fpot"
 },
 {
  "slug": "sop",
  "name": "SOP",
  "cat": "K",
  "catLabel": "Potash",
  "analysis": "Sulfate of potash. K₂O 50% · S 17.5%",
  "methods": [
   "Soil application",
   "Fertigation"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Open to distributors",
  "family": false,
  "png": "sop"
 },
 {
  "slug": "vl-potash-liquid",
  "name": "VL-Potash Liquid",
  "cat": "K",
  "catLabel": "Potash",
  "analysis": "K₂O 30%. For foliar spray or fertigation",
  "methods": [
   "Foliar",
   "Fertigation"
  ],
  "stages": [
   "Maturity"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "v-potash-plus",
  "name": "V-Potash Plus",
  "cat": "K",
  "catLabel": "Potash",
  "analysis": "10:0:40 + Mg · B · chelated Fe",
  "methods": [
   "Fertigation"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "crop-force",
  "name": "Crop Force",
  "cat": "NPK",
  "catLabel": "NPK",
  "analysis": "NPK 15:15:15 · NPK 12:12:18",   // Tahir 10 Nov 2026 (LM-N1): 15:15:15 is still sold; was "NPK 12:12:18"
  // Lead 10 Nov 2026 (L3-9), from the crop plans (all 4 Crop Force rows are "Side dressing/Placement" at grand growth or maturity; none drills it): "Drilling" dropped.
  "methods": [
    "Side-dressing",
    "Band placement"
   ],
  "stages": [
   "Grand growth",
   "Maturity"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "cforce"
 },
 {
  "slug": "vl-npk",
  "name": "VL-NPK",
  "cat": "NPK",
  "catLabel": "NPK",
  "analysis": "Liquid NPK 8:8:6 (% w/v, weight per volume). N 8 · P₂O₅ 8 · K₂O 6",
  "methods": [
   "Foliar"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "vl-micro-mix",
  "name": "VL-Micromix",
  "cat": "MICRO",
  "catLabel": "Micronutrients",
  "analysis": "Zn 5 · Fe 2 · Mn 2 · Cu 1 (% w/v, weight per volume)",
  "methods": [
   "Foliar"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "v-boron",
  "name": "VL-Boron",
  "cat": "MICRO",
  "catLabel": "Micronutrients",
  "analysis": "Boron 5% w/v (weight per volume), liquid",
  "methods": [
   "Foliar",
   "Fertigation"
  ],
  "stages": [
   "Germination",
   "Early growth",
   "Grand growth",
   "Maturity"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "boron"
 },
 {
  "slug": "v-zinc",
  "name": "V-Zinc 10%",
  "cat": "MICRO",
  "catLabel": "Micronutrients",
  "analysis": "Zinc 10% w/v (weight per volume), as zinc sulfate",
  "methods": [
    "Fertigation",
    "Foliar"
   ],
  "stages": [
   "Germination",
   "Early growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "v-transform",
  "name": "V-Transform",
  "cat": "MICRO",
  "catLabel": "Micronutrients",
  "analysis": "Zinc 21% granular",
  "methods": [
    "Broadcast",
    "Side-dressing",
    "Fertigation"
   ],
  "stages": [
   "Germination",
   "Early growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "vtrans"
 },
 {
  "slug": "cala-mag-v",
  "name": "Cala-Mag V",
  "cat": "SEC",
  "catLabel": "Secondary nutrients",
  "analysis": "N 10% · Ca 6% · Mg 4% · B 1%",
  "methods": [
   "Fertigation",
   "Foliar"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "calmag"
 },
 {
  "slug": "v-mag-essential",
  "name": "V-Mag Essential",
  "cat": "SEC",
  "catLabel": "Secondary nutrients",
  "analysis": "Mg 8.5% · B 1% powder",
  "methods": [
   "Fertigation"
  ],
  "stages": [
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "green-sulfur",
  "name": "Green Sulfur",
  "cat": "SEC",
  "catLabel": "Secondary nutrients",
  "analysis": "Sulfur 70%, water-dispersible granules (WDG)",
  "methods": [
    "Broadcast",
    "Fertigation"
   ],
  "stages": [
   "Sowing"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "gsulf"
 },
 {
  "slug": "v-compost",
  "name": "V-Compost",
  "cat": "BIO",
  "catLabel": "Soil health and biologicals",
  "analysis": "Organic matter 25% + N 5%",
  "methods": [
    "Broadcast",
    "Drilling"
   ],
  "stages": [
   "Land preparation"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "humi-grow",
  "name": "Humi Grow",
  "cat": "BIO",
  "catLabel": "Soil health and biologicals",
  "analysis": "Potassium humate pellets · Humic acid 40% · K₂O 7%",
  "methods": [
   "Broadcast"
  ],
  "stages": [
   "Sowing"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": "humi"
 },
 {
  "slug": "humi-grow-plus",
  "name": "Humi Grow Plus",
  "cat": "BIO",
  "catLabel": "Soil health and biologicals",
  "analysis": "Liquid. Humic acid 10% · K₂O 3.5%",
  "methods": [
   "Fertigation"
  ],
  // Tahir 10 Nov 2026 (R3-9): the stage each crop plan gives (germination or early growth). Was ["Early growth"].
  "stages": [
   "Germination",
   "Early growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 },
 {
  "slug": "tornado",
  "name": "Tornado",
  "cat": "BIO",
  "catLabel": "Soil health and biologicals",
  "analysis": "Amino acids 10% w/v (weight per volume) · humic 3.4% w/v · fulvic 4.5% w/v · seaweed 0.5% w/v",   // Tahir 10 Nov 2026 (PR-N11): the declared analysis; was "Amino · Fulvic · Humic · Seaweed"
  "methods": [
   "Foliar"
  ],
  "stages": [
   "Early growth",
   "Grand growth"
  ],
  "exclusive": false,
  "badge": "Own-brand manufacturing",
  "family": false,
  "png": null
 }
]
// Tahir 7 Nov 2026 (CR-21): the "programme" tags (e.g. "Zn-K programme", "HIGH P-K programme", "P-K per picking",
// "Multi-nutrient (Zn-P-K-Mg-B)") are now written in words, 1 pattern: "Main nutrients: zinc and potassium". The field name stays.
export type Crop = { group:string; nutrient:string; groupLabel:string; name:string; sowing:string; programme:string; page:string; pdf:string }
export const CROPS: Crop[] = [
 {
  "group": "cereal",
  "nutrient": "K",
  "groupLabel": "Cereals & field crops",
  "name": "Wheat",
  "sowing": "Oct–Nov sowing",
  "programme": "Main nutrients: zinc and potassium",
  "page": "wheat.html",
  "pdf": "plans/Wheat-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "N",
  "groupLabel": "Cereals & field crops",
  "name": "Maize (Corn)",
  "sowing": "Feb / Jun–Jul sowing",
  "programme": "Main nutrients: sulfur, nitrogen and potassium",
  "page": "maize.html",
  "pdf": "plans/Corn-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "S",
  "groupLabel": "Cereals & field crops",
  "name": "Basmati Rice",
  "sowing": "May–Jun sowing",
  "programme": "Main nutrients: sulfur and potassium",
  "page": "rice-basmati.html",
  "pdf": "plans/Basmati-Rice-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "N",
  "groupLabel": "Cereals & field crops",
  "name": "Hybrid Rice",
  "sowing": "May–Jun sowing",
  "programme": "Main nutrients: nitrogen and potassium",
  "page": "rice-hybrid.html",
  "pdf": "plans/Hybrid-Rice-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "K",
  "groupLabel": "Cereals & field crops",
  "name": "Cotton",
  "sowing": "Apr–May / Sep sowing",
  "programme": "Main nutrients: potassium and boron",
  "page": "cotton.html",
  "pdf": "plans/Cotton-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "Multi",
  "groupLabel": "Cereals & field crops",
  "name": "Sugarcane, February planting",
  "sowing": "Feb–Mar sowing",
  "programme": "Main nutrients: zinc, phosphorus, potassium, magnesium and boron",
  "page": "sugarcane.html",
  "pdf": "plans/Sugarcane-Feb-Nutrition-Plan.pdf"
 },
 {
  "group": "cereal",
  "nutrient": "Multi",
  "groupLabel": "Cereals & field crops",
  "name": "Ratoon Sugarcane",
  "sowing": "Feb–Mar sowing",
  "programme": "Main nutrients: zinc, phosphorus, potassium, magnesium and boron",
  "page": "sugarcane-ratoon.html",
  "pdf": "plans/Ratoon-Sugarcane-Nutrition-Plan.pdf"
 },
 {
  "group": "oil",
  "nutrient": "S",
  "groupLabel": "Oilseeds",
  "name": "Canola",
  "sowing": "Oct–Nov sowing",
  "programme": "Main nutrients: sulfur, magnesium and potassium",
  "page": "canola.html",
  "pdf": "plans/Canola-Nutrition-Plan.pdf"
 },
 {
  "group": "oil",
  "nutrient": "S",
  "groupLabel": "Oilseeds",
  "name": "Sesame",
  "sowing": "Apr–May sowing",
  "programme": "Main nutrients: sulfur, magnesium and potassium",
  "page": "sesame.html",
  "pdf": "plans/Sesame-Nutrition-Plan.pdf"
 },
 {
  "group": "oil",
  "nutrient": "S",
  "groupLabel": "Oilseeds",
  "name": "Soybean",
  "sowing": "Apr–Jun sowing",
  "programme": "Main nutrients: sulfur, magnesium and potassium",
  "page": "soybean.html",
  "pdf": "plans/Soybean-Nutrition-Plan.pdf"
 },
 {
  "group": "oil",
  "nutrient": "S",
  "groupLabel": "Oilseeds",
  "name": "Sunflower",
  "sowing": "Mar–Apr / Aug–Sep sowing",
  "programme": "Main nutrients: sulfur, magnesium and potassium",
  "page": "sunflower.html",
  "pdf": "plans/Sunflower-Nutrition-Plan.pdf"
 },
 {
  "group": "pulse",
  "nutrient": "P",
  "groupLabel": "Pulses",
  "name": "Chickpea",
  "sowing": "Oct–Nov sowing",
  "programme": "Main nutrients: phosphorus, calcium and potassium",
  "page": "chickpea.html",
  "pdf": "plans/Chickpea-Nutrition-Plan.pdf"
 },
 {
  "group": "pulse",
  "nutrient": "Multi",
  "groupLabel": "Pulses",
  "name": "Lentil",
  "sowing": "Oct–Nov sowing",
  "programme": "Main nutrients: phosphorus, potassium, magnesium and boron",
  "page": "lentil.html",
  "pdf": "plans/Lentil-Nutrition-Plan.pdf"
 },
 {
  "group": "pulse",
  "nutrient": "S",
  "groupLabel": "Pulses",
  "name": "Mungbean & Mash",
  "sowing": "May–Jun sowing",
  "programme": "Main nutrients: iron, phosphorus and potassium",
  "page": "mungbean-mash.html",
  "pdf": "plans/Mungbean-Mash-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "P",
  "groupLabel": "Vegetables & spices",
  "name": "Potato",
  "sowing": "Sep–Oct sowing",
  "programme": "Main nutrients: phosphorus and potassium",
  "page": "potato.html",
  "pdf": "plans/Potato-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "K",
  "groupLabel": "Vegetables & spices",
  "name": "Tomato",
  "sowing": "Mar–May / Sep–Oct sowing",
  "programme": "Main nutrients: potassium, boron and calcium",
  "page": "tomato.html",
  "pdf": "plans/Tomato-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "Multi",
  "groupLabel": "Vegetables & spices",
  "name": "Chili",
  "sowing": "Feb–Apr sowing",
  "programme": "Main nutrients: phosphorus and potassium, at each picking",
  "page": "chili.html",
  "pdf": "plans/Chili-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "P",
  "groupLabel": "Vegetables & spices",
  "name": "Garlic",
  "sowing": "Nov–Dec sowing",
  "programme": "Main nutrients: phosphorus and potassium, at high rates",
  "page": "garlic.html",
  "pdf": "plans/Garlic-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "K",
  "groupLabel": "Vegetables & spices",
  "name": "Watermelon",
  "sowing": "Apr–May sowing",
  "programme": "Main nutrients: potassium and phosphorus",
  "page": "watermelon.html",
  "pdf": "plans/Watermelon-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "S",
  "groupLabel": "Vegetables & spices",
  "name": "Turmeric",
  "sowing": "May–Jun sowing",
  "programme": "Main nutrients: sulfur, magnesium and potassium",
  "page": "turmeric.html",
  "pdf": "plans/Turmeric-Nutrition-Plan.pdf"
 },
 {
  "group": "veg",
  "nutrient": "P",
  "groupLabel": "Vegetables & spices",
  "name": "Onion",
  "sowing": "Dec–Feb sowing",
  "programme": "Main nutrients: phosphorus, iron and potassium",
  "page": "onion.html",
  "pdf": "plans/Onion-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "K",
  "groupLabel": "Orchards and fruit",
  "name": "Banana, 1st year",
  "sowing": "May–Jul sowing",
  "programme": "Main nutrients: potassium and magnesium",
  "page": "banana-year1.html",
  "pdf": "plans/Banana-1st-Year-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "K",
  "groupLabel": "Orchards and fruit",
  "name": "Banana, 2nd year",
  "sowing": "May–Jul sowing",
  "programme": "Main nutrients: potassium and magnesium",
  "page": "banana-year2.html",
  "pdf": "plans/Banana-2nd-Year-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "Multi",
  "groupLabel": "Orchards and fruit",
  "name": "Citrus, 5 years and over",
  "sowing": "Feb–Mar sowing",
  "programme": "Main nutrients: potassium, calcium, magnesium and boron",
  "page": "citrus.html",
  "pdf": "plans/Citrus-5plus-Years-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "Multi",
  "groupLabel": "Orchards and fruit",
  "name": "Date Palm",
  "sowing": "Feb–Mar sowing",
  "programme": "Main nutrients: phosphorus, potassium and sulfur",
  "page": "date-palm.html",
  "pdf": "plans/Date-Palm-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "P",
  "groupLabel": "Orchards and fruit",
  "name": "Mango",
  "sowing": "Feb–Mar sowing",
  "programme": "Main nutrients: phosphorus and potassium",
  "page": "mango.html",
  "pdf": "plans/Mango-Nutrition-Plan.pdf"
 },
 {
  "group": "fruit",
  "nutrient": "K",
  "groupLabel": "Orchards and fruit",
  "name": "Strawberry",
  "sowing": "Sep–Nov sowing",
  "programme": "Main nutrients: potassium, boron and zinc",
  "page": "strawberry.html",
  "pdf": "plans/Strawberry-Nutrition-Plan.pdf"
 },
// Tahir 10 Nov 2026 (R3-5): guava's season starts in September, as the crop plan and the water window (1 September to end of February). Was "Feb–Mar sowing".
 {
  "group": "fruit",
  "nutrient": "Multi",
  "groupLabel": "Orchards and fruit",
  "name": "Guava",
  "sowing": "Sep sowing",
  "programme": "Main nutrients: potassium, calcium, magnesium and boron",
  "page": "guava.html",
  "pdf": "plans/Guava-Nutrition-Plan.pdf"
 }
]
// Lead 10 Nov 2026 (L3-6), from the shopping lists and the L2 fact check (crops CHECK 5): in the plan rows below, the rate word is "bag" where the
// shopping list calls the item a bag (citrus and watermelon V-Transform "2 pack", onion V-Transform "1 pack", mango Humi Grow "1 pack", sugarcane Humi Grow
// "½ pack in June", garlic ammonium sulfate "1 pack"), and every rate string writes a count above 1 in the plural and in lower case ("2 bag" -> "2 bags",
// "1 Pack" -> "1 pack"). Display only: the display already wrote them so (tidyUnits); no quantity, pack or row changed.
export const WHEAT_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Grain Formation & Maturity"]
/**
 * `basis` — what the published rate is measured against. Absent means PER ACRE, which is how the
 * site works and how 485 of the 493 rows read. `'plant'` marks a rate published PER TREE: mango's
 * five "kg dose" rows are per-tree amounts (VAN's 2 + 0.84 kg of Vital Urea at N 32% is 0.91 kg of
 * nitrogen per tree, against a published mature-mango schedule of 1.0 kg per tree). Multiplying a
 * per-tree dose by acres is meaningless without a tree count, so those rows are shown as per-plant
 * and are kept out of the acreage list and the cost. Tahir's ruling, 8 Sep 2026: the site works per
 * acre, and per-plant dosage is calculated by VGreen against the farmer's own orchard.
 *
 * `'per200L'` marks a FOLIAR rate published against a 200-litre tank of spray water rather than
 * against an acre — Tahir's ruling, 8 Sep 2026: "foliar rates for this case are per 200 litres of
 * water". Citrus's three spray rows are the only ones in the 28 programmes written that way. The
 * shopping list counts them at one 200 L tank per acre and says so, because a bigger canopy takes
 * more water and therefore more product.
 */
export type PlanRow = { band:string; stage:string; product:string; analysis:string; rate:string; method:string; pack:string; slug:string|null; commodity:boolean; basis?:'plant'|'per200L' }
export const WHEAT_PLAN: PlanRow[] = [
 {
  "band": "Phosphorus",
  "stage": "Land Preparation",
  "product": "Green Phosphate",
  "analysis": "P₂O₅ 32% · N 6%",
  "rate": "1 bag",
  "method": "Drill at sowing; broadcast if no drill",
  "pack": "Bag - 50 kg",
  "slug": "green-phosphate",
  "commodity": false
 },
 {
  "band": "Phosphorus",
  "stage": "Early Growth",
  "product": "V-Phosphate",
  "analysis": "NPK 11:44:0 + Fe",
  "rate": "1 bag",
  "method": "Fertigation",
  "pack": "Bag - 10 kg",
  "slug": "v-phosphate",
  "commodity": false
 },
// Tahir 10 Nov 2026 (EN-11): wheat Vital Urea is 1 bag (25 kg) per acre, at sowing or first irrigation. Was rate "½ bag", method "Drill at sowing; broadcast if no drill".
// L1 10 Nov 2026 (crops 1, Q3): the method cell names a method again, carrying both times (EN-11) and the Vital Urea page's placement
// (EN-7: drill at sowing, or side-dress at the first irrigation, before the water). Was "At sowing or first irrigation".
// Tahir 10 Nov 2026 (R3-4): broadcast added as the last choice. Was "Drill at sowing, or side-dress at the first irrigation".
 {
  "band": "Nitrogen",
  "stage": "Land Preparation",
  "product": "Vital Urea",
  "analysis": "N 32% · S 13%",
  "rate": "1 bag",
  "method": "Drill at sowing, or side-dress at the first irrigation; broadcast if neither is possible",
  "pack": "Bag - 25 kg",
  "slug": "vital-urea",
  "commodity": false
 },
// Tahir 10 Nov 2026 (EN-11b): Vital Urea is the first nitrogen bag, so the Germination urea row is removed.
// Was: { band Nitrogen, stage Germination, product Urea, N 46%, rate "1 bag", method "Side dressing/Fertigation", pack "Bag - 50 kg", commodity }.
 {
  "band": "Nitrogen",
  "stage": "Early Growth",
  "product": "Urea",
  "analysis": "N 46%",
  "rate": "½ bag",
  "method": "Fertigation",
  "pack": "Bag - 50 kg",
  "slug": null,
  "commodity": true
 },
 {
  "band": "Nitrogen",
  "stage": "Grand Growth",
  "product": "Urea",
  "analysis": "N 46%",
  "rate": "½ bag",
  "method": "Fertigation",
  "pack": "Bag - 50 kg",
  "slug": null,
  "commodity": true
 },
 {
  "band": "Potash",
  "stage": "Land Preparation",
  "product": "Fusion Potash",
  "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%",
  "rate": "½ bag",
  "method": "Drill at sowing; broadcast if no drill",
  "pack": "Bag - 25 kg",
  "slug": "fusion-potash",
  "commodity": false
 },
 {
  "band": "Potash",
  "stage": "Grand Growth",
  "product": "Vital Potash",
  "analysis": "NPK 11:0:44, coated with B",
  "rate": "½ bag",
  "method": "Fertigation",
  "pack": "Bag - 20 kg",
  "slug": "vital-potash",
  "commodity": false
 },
 {
  "band": "Secondary Nutrient",
  "stage": "Germination",
  "product": "Green Sulfur",
  "analysis": "Sulfur 70%",
  "rate": "1 bag",
  "method": "Fertigation",
  "pack": "Bag - 1 kg",
  "slug": "green-sulfur",
  "commodity": false
 },
 {
  "band": "Secondary Nutrient",
  "stage": "Early Growth",
  "product": "Green Sulfur",
  "analysis": "Sulfur 70%",
  "rate": "1 bag",
  "method": "Fertigation",
  "pack": "Bag - 1 kg",
  "slug": "green-sulfur",
  "commodity": false
 },
 {
  "band": "Secondary Nutrient",
  "stage": "Early Growth",
  "product": "V-Mag Essential",
  "analysis": "Mg 8.5% · B 1%",
  "rate": "½ bag",
  "method": "Fertigation",
  "pack": "Bag - 5 kg",
  "slug": "v-mag-essential",
  "commodity": false
 },
 {
  "band": "Secondary Nutrient",
  "stage": "Grand Growth",
  "product": "V-Mag Essential",
  "analysis": "Mg 8.5% · B 1%",
  "rate": "½ bag",
  "method": "Fertigation",
  "pack": "Bag - 5 kg",
  "slug": "v-mag-essential",
  "commodity": false
 },
 {
  "band": "Soil Amendment",
  "stage": "Land Preparation",
  "product": "Humi Grow",
  "analysis": "Humic acid 40% · K₂O 7%",
  "rate": "1 bag",
  "method": "Drill at sowing; broadcast if no drill",
  "pack": "Bag - 8 kg",
  "slug": "humi-grow",
  "commodity": false
 },
 {
  "band": "Soil Amendment",
  "stage": "Germination",
  "product": "Humi Grow Plus",
  "analysis": "Humic acid 10% · K₂O 3.5%",
  "rate": "1 pack",
  "method": "Fertigation",
  "pack": "Pack - 4 L",
  "slug": "humi-grow-plus",
  "commodity": false
 },
// Tahir 10 Nov 2026 (CR-N17, row 4): V-Transform is a granule applied to the soil only, never dissolved. Was method "Side dressing/Fertigation".
 {
  "band": "Micronutrients",
  "stage": "Germination",
  "product": "V-Transform",
  "analysis": "Zinc 21%",
  "rate": "1 bag",
  "method": "Side dressing",
  "pack": "Bag - 3 kg",
  "slug": "v-transform",
  "commodity": false
 },
 {
  "band": "Micronutrients",
  "stage": "Early Growth",
  "product": "VL-Boron",
  "analysis": "Boron 5%",
  "rate": "1 pack",
  "method": "Fertigation",
  "pack": "Pack - 1 L",
  "slug": "v-boron",
  "commodity": false
 },
 {
  "band": "Foliar",
  "stage": "Early Growth",
  "product": "VL-Potash Liquid",
  "analysis": "Potash 30%",
  "rate": "1 pack",
  "method": "Spray",
  "pack": "Pack - 1 L",
  "slug": "vl-potash-liquid",
  "commodity": false
 },
 {
  "band": "Foliar",
  "stage": "Early Growth",
  "product": "VL-Micromix",
  "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)",
  "rate": "1 pack",
  "method": "Spray",
  "pack": "Pack - 1 L",
  "slug": "vl-micro-mix",
  "commodity": false
 },
 {
  "band": "Foliar",
  "stage": "Grand Growth",
  "product": "VL-Potash Liquid",
  "analysis": "Potash 30%",
  "rate": "1 pack",
  "method": "Spray",
  "pack": "Pack - 1 L",
  "slug": "vl-potash-liquid",
  "commodity": false
 },
 {
 // 10 Sep 2026, Tahir: "yes, we price only 0.5 L, they can buy 2 bottles." Same litre either way;
 // the row was simply written against a 1 L bottle VAN does not sell, so it could not be costed.
  "band": "Foliar",
  "stage": "Grand Growth",
  "product": "Tornado",
  "analysis": "Bio-stimulant",
  "rate": "2 packs",
  "method": "Spray",
  "pack": "Pack - 0.5 L",
  "slug": "tornado",
  "commodity": false
 }
]
// Transcribed from VAN Live Site plan PDFs, 8 Sep 2026. Every figure here is transcribed verbatim from the source PDF —
// do not edit numbers by hand. Anomalies/open questions found during transcription are called out in
// "Crop Plan Transcription — Notes for Review Sep 2026.md" and must be resolved by VAN before these numbers go live.

export const BANANA_YEAR1_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const BANANA_YEAR1_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "¾ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Germination", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Maturity", "product": "Crop Force", "analysis": "NPK 12:12:18", "rate": "2 bags", "method": "Side dressing/Placement", "pack": "Bag - 10 kg", "slug": "crop-force", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const BANANA_YEAR2_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const BANANA_YEAR2_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Germination", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Maturity", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Soil Amendment", "stage": "Early Growth", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

export const CANOLA_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const CANOLA_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation or side dressing", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "1.5 bags", "method": "Side dressing/Broadcasting", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "1.5 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

export const CHICKPEA_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const CHICKPEA_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 // 10 Sep 2026, Tahir: Green Sulfur here is "Bag 1 kg - 2 pack". Still 2 kg, but against the 1 kg
 // bag VAN actually registers. A 2 kg Green Sulfur bag does not exist; open since 9 Sep as B2.
 { "band": "Soil Amendment", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 packs", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "V-Zinc", "analysis": "Zinc 10% w/v", "rate": "⅕ pack", "method": "Spray", "pack": "Pack - 3 L", "slug": "v-zinc", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "¼ pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

export const CHILI_STAGES = ["Land Preparation/Transplantation", "Germination", "Early Growth", "Grand Growth", "After Picking"]
export const CHILI_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation/Transplantation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation/Transplantation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Calcium Ammonium Nitrate", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "After Picking", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation/Transplantation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "After Picking", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "After Picking", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation/Transplantation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Land Preparation/Transplantation", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "After Picking", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const CITRUS_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const CITRUS_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "200 ml dose", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false, "basis": "per200L" },
 { "band": "Foliar", "stage": "Germination", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "500 g", "method": "Spray", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false, "basis": "per200L" },
 { "band": "Foliar", "stage": "Grand Growth", "product": "Crop Force", "analysis": "NPK 12:12:18", "rate": "1 bag", "method": "Side dressing/Placement", "pack": "Bag - 10 kg", "slug": "crop-force", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "Tornado", "analysis": "Bio-stimulant", "rate": "1 pack", "method": "Spray", "pack": "Pack - 0.5 L", "slug": "tornado", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "500 g", "method": "Spray", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false, "basis": "per200L" }
]

export const COTTON_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Boll Formation & Maturity"]
export const COTTON_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1.5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Placement/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Placement/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Placement/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Placement/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Boll Formation & Maturity", "product": "Urea", "analysis": "N 46%", "rate": "1.5 bags", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Boll Formation & Maturity", "product": "Calcium Ammonium Nitrate", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Boll Formation & Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "0.25 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "0.25 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray/Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

/**
 * Date palm is banded by ORCHARD AGE, not by season stage — the five rows per nutrient escalate
 * monotonically (Vital Urea 2.4 → 11.3 bags), every one is broadcast with no method progression, and
 * a palm does not germinate. Read as one season they sum to 803 kg N/ha; read as age bands each one
 * lands inside the published Pakistan per-palm schedule. See
 * `Investigation — date palm and mango rates, 8 Sep 2026.md`.
 *
 * The five LABELS below are a proposal awaiting Tahir's confirmation — VAN's own data gives the
 * rates and their order, not the ages they belong to. Correcting them means editing this one array.
 */
export const DATE_PALM_STAGES = ["Year 1–2 · newly planted", "Year 3–4 · establishing", "Year 5–6 · first bearing", "Year 7–8 · building yield", "Year 9+ · mature bearing"]
export const DATE_PALM_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Year 1–2 · newly planted", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1.26 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Year 3–4 · establishing", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2.2 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Year 5–6 · first bearing", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "3.1 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Year 7–8 · building yield", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "3.4 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Year 9+ · mature bearing", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "4.4 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Year 1–2 · newly planted", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "2.4 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Year 3–4 · establishing", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "3.8 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Year 5–6 · first bearing", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "7.5 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Year 7–8 · building yield", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "8.8 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Year 9+ · mature bearing", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "11.3 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Potash", "stage": "Year 1–2 · newly planted", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "⅔ bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 1–2 · newly planted", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "2/3 bag", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 3–4 · establishing", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "⅔ bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 3–4 · establishing", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "2/3 bag", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 5–6 · first bearing", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 5–6 · first bearing", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 7–8 · building yield", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1½ bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 7–8 · building yield", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 9+ · mature bearing", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "2.4 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Year 9+ · mature bearing", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "3 bags", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Soil Amendment", "stage": "Year 1–2 · newly planted", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false }
]

export const GARLIC_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const GARLIC_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Germination", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Ammonium Sulfate", "analysis": "N 21% · S 24%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 // 10 Sep 2026, Tahir: "Garlic 5 kg, is 1/4 bag of same 20 kg bag." A transcription error, not an
 // agronomy change: a quarter of 20 kg is 5 kg, so the QUANTITY is identical and only the pack it
 // is measured against was wrong. Crop Force has no registered 5 kg pack, so the old row could not
 // be costed and garlic was the one plan in twenty-eight whose Crop Force line showed "ask on
 // WhatsApp" instead of a price. Now it costs against the 20 kg bag like every other Crop Force row.
 // This is the SAME fault as sugarcane's Green Sulfur on 9 Sep: a fraction read against the wrong
 // bag size. Worth checking any other "1 pack" row whose pack is not a registered size.
 { "band": "Soil Amendment", "stage": "Maturity", "product": "Crop Force", "analysis": "NPK 12:12:18", "rate": "1 bag", "method": "Side dressing/Placement", "pack": "Bag - 10 kg", "slug": "crop-force", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Maturity", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

// D-314 (Tahir 25 Oct 2026): guava is picked, not harvested; the last stage was "February. Harvest"
export const GUAVA_STAGES = ["September", "October, flowering starts", "November, fruiting", "December", "January", "February, picking"]
export const GUAVA_PLAN: PlanRow[] = [
 { "band": "Potash", "stage": "September", "product": "V-Potash Plus", "analysis": "N 10% · K₂O 40% · Mg · B · chelated Fe", "rate": "10 kg", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-potash-plus", "commodity": false },
 { "band": "Potash", "stage": "October, flowering starts", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Potash", "stage": "December", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "September", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Fertigation, or spray at 500 ml per 100 L water", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "September", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "October, flowering starts", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Fertigation. Repeat 15 days after flowering", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "November, fruiting", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Fertigation. Repeat 15 days after fruiting", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Soil Amendment", "stage": "September", "product": "Well-rotten farmyard manure", "analysis": "", "rate": "3-5 trolleys", "method": "Soil application. Minimum 6 months old", "pack": "", "slug": null, "commodity": true },
 { "band": "Micronutrients", "stage": "September", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Foliar, 500 ml per 100 L water", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "October, flowering starts", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Micronutrients", "stage": "November, fruiting", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Micronutrients", "stage": "December", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Micronutrients", "stage": "January", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Micronutrients", "stage": "February, picking", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Foliar, 1 L per 100 L water", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "September", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "October, flowering starts", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray. Repeat 15 days after flowering", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "November, fruiting", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray. Repeat 15 days after fruiting", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "December", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "January", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false },
 { "band": "Foliar", "stage": "February, picking", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

export const LENTIL_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const LENTIL_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "V-Zinc", "analysis": "Zinc 10% w/v", "rate": "1/5 pack", "method": "Spray", "pack": "Pack - 3 L", "slug": "v-zinc", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

export const MAIZE_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const MAIZE_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1.5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Placement", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Placement", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "Side dressing/Placement", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Foliar or Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

export const MANGO_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const MANGO_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2.25 kg dose", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false, "basis": "plant" },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "2kg dose", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false, "basis": "plant" },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "0.84 kg dose", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false, "basis": "plant" },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "0.7 kg dose", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false, "basis": "plant" },
 { "band": "Potash", "stage": "Grand Growth", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "0.7 kg dose", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false, "basis": "plant" },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "V-Zinc", "analysis": "Zinc 10% w/v", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 3 L", "slug": "v-zinc", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray. 1 application", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

export const MUNGBEAN_MASH_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const MUNGBEAN_MASH_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "V-Zinc", "analysis": "Zinc 10% w/v", "rate": "1/5 pack", "method": "Spray", "pack": "Pack - 3 L", "slug": "v-zinc", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

// Tahir 10 Nov 2026 (CR-N12): onion "DOT" reads "DAT"; "(20 DAT, days after transplanting)" at first use, then "DAT". Urdu keys in urdu.ts still read DOT.
// L1 10 Nov 2026 (crops 12): the stage is "Early Growth (20 DAT)" in the data, the tick boxes and the lists; "DAT" is written out
// once, in the plan table heading (PlanMatrix stageHeading). Was "Early Growth (20 DAT, days after transplanting)" everywhere.
// Tahir 10 Nov 2026 (R3-6): the 50 DAT stage is "Bulb filling (50 DAT)" (stage list and its 3 rows). Was "Maturity (50 DAT)". Urdu key not added.
export const ONION_STAGES = ["Land Preparation/Transplanting", "Germination", "Early Growth (20 DAT)", "Grand Growth (40 DAT)", "Bulb filling (50 DAT)"]
export const ONION_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation/Transplanting", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth (20 DAT)", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth (40 DAT)", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth (20 DAT)", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "2 bags", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth (40 DAT)", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation/Transplanting", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth (40 DAT)", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "10 kg", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Bulb filling (50 DAT)", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "10 kg", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth (20 DAT)", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 kg", "method": "Fertigation", "pack": "Pack - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth (40 DAT)", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 kg", "method": "Fertigation", "pack": "Pack - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth (40 DAT)", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "2.5 kg", "method": "Fertigation with Vital Potash", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Bulb filling (50 DAT)", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 kg", "method": "Fertigation", "pack": "Pack - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Bulb filling (50 DAT)", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "2.5 kg", "method": "Fertigation with Vital Potash", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation/Transplanting", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "8 kg", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth (20 DAT)", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "With the first nitrogen application", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth (40 DAT)", "product": "VL-NPK", "analysis": "NPK 8:8:6 (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-npk", "commodity": false }
]

export const POTATO_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const POTATO_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 to 2 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "10 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Germination", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "4 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Soil Amendment", "stage": "Early Growth", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Soil Amendment", "stage": "Grand Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "4 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Land Preparation", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Maturity", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const RICE_BASMATI_STAGES = ["Land Preparation/Transplantation", "Establishment", "Early Growth", "Grand Growth", "Grain Formation & Maturity"]
export const RICE_BASMATI_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation/Transplantation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Establishment", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation/Transplantation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grain Formation & Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Establishment", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grain Formation & Maturity", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation/Transplantation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Establishment", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "3 bags", "method": "Broadcasting", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 // 10 Sep 2026, Tahir: "yes, we price only 0.5 L, they can buy 2 bottles." Same litre either way;
 // the row was simply written against a 1 L bottle VAN does not sell, so it could not be costed.
 { "band": "Foliar", "stage": "Early Growth", "product": "Tornado", "analysis": "Bio-stimulant", "rate": "1 pack", "method": "Spray", "pack": "Pack - 0.5 L", "slug": "tornado", "commodity": false }
]

export const RICE_HYBRID_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const RICE_HYBRID_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Maturity", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "3 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Maturity", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const SESAME_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const SESAME_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "3 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "0.3 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const SOYBEAN_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const SOYBEAN_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "¼ bag", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1/5 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Land Preparation", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Maturity", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

// Tahir 10 Nov 2026 (CR-N17c2): "Flowering" added as a 6th stage between Grand Growth and Maturity. It holds only the second Humi Grow Plus row (moved from Maturity). No Urdu label yet.
export const STRAWBERRY_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Flowering", "Maturity"]
export const STRAWBERRY_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1.5 bags", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Maturity", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "CAN", "analysis": "N 26%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Ammonium Sulfate", "analysis": "N 21% · S 24%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Maturity", "product": "CAN", "analysis": "N 26%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Maturity", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Maturity", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "¾ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Maturity", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Early Growth", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "4 packs", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
// Tahir 10 Nov 2026 (CR-N17c2): stage was "Maturity".
 { "band": "Soil Amendment", "stage": "Flowering", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "Tornado", "analysis": "Bio-stimulant", "rate": "1 pack", "method": "Spray", "pack": "Pack - 0.5 L", "slug": "tornado", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Land Preparation", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Maturity", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const SUGARCANE_RATOON_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const SUGARCANE_RATOON_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Placement", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag in March", "method": "Placement", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Placement", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "CAN", "analysis": "N 26%", "rate": "1 bag in April", "method": "Placement", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag + 1 bag (2 applications)", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "3 packs", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag in April", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
// Tahir 10 Nov 2026 (CR-N17a2): ratoon Humi Grow method is "Broadcasting" (was "Drill at sowing; broadcast if no drill"); stage stays Land Preparation.
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Soil Amendment", "stage": "Grand Growth", "product": "Humi Grow Plus", "analysis": "Humic acid 10% · K₂O 3.5%", "rate": "2 packs", "method": "Fertigation", "pack": "Pack - 4 L", "slug": "humi-grow-plus", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "3 bags", "method": "Placement", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

export const SUGARCANE_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const SUGARCANE_PLAN: PlanRow[] = [
  // D-137, 24 Sep 2026 night, owner's ruling 5: "the TEAM CALCULATOR IS RIGHT" (reverses D-123). The team
  // workbook's Sugarcane (Feb) sheet has Green Phosphate 2 bags (50 kg) and Humi Grow 1/2 bag (8 kg). The
  // 1/2 bag of Humi Grow is the "½ pack in June" row below, so this land-preparation row becomes Green
  // Phosphate 2 bags, back in the Phosphorus band where the printed PDF filed it, method as printed.
  // The published PDF (plans/Sugarcane-Feb-Nutrition-Plan.pdf) still prints Humi Grow here and needs
  // reissuing. Revert: restore the row below.
  // { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Soil Conditioner", "rate": "1–2 bag + 1 bag (two applications)", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "2 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag + ½ bag in March; 1 bag + ½ bag in April (2 applications each month)", "method": "Placement/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag in May; 1 bag in June", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag + 1 bag (2 applications)", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "3 packs", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "¼ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "1/4 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "V-Compost", "analysis": "OM 25% + N 5%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 20 kg", "slug": "v-compost", "commodity": false },
 { "band": "Soil Amendment", "stage": "Early Growth", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "½ bag in June", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "3 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false }
]

export const SUNFLOWER_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const SUNFLOWER_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Fusion Phosphate", "analysis": "P₂O₅ 46%", "rate": "1.5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "fusion-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "CAN", "analysis": "N 26%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2.5 bags", "method": "Side dressing/Broadcasting", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "2.5 bags", "method": "Fertigation", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing/Broadcasting", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const TOMATO_STAGES = ["Land Preparation/Transplantation", "Germination", "Early Growth", "Grand Growth", "Fruiting and Picking Phase"]
export const TOMATO_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation/Transplantation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Broadcasting/Fertigation", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Germination", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Broadcasting/Fertigation", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation/Transplantation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting or Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Germination", "product": "CAN", "analysis": "N 26%", "rate": "½ bag", "method": "Broadcasting or Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting or Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting or Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "CAN", "analysis": "N 26%", "rate": "1/2 bag", "method": "Broadcasting or Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation/Transplantation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Fruiting and Picking Phase", "product": "VL-Potash Liquid", "analysis": "Potash 30%", "rate": "3 packs (1 after each picking, 3 pickings at most)", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-potash-liquid", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "Cala-Mag V", "analysis": "N 10% · Ca 6% · Mg 4% · B 1%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "cala-mag-v", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation/Transplantation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Broadcasting", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
]

export const TURMERIC_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const TURMERIC_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Grand Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Early Growth", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Grand Growth", "product": "Urea", "analysis": "N 46%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Germination", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "½ bag", "method": "Broadcasting", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Land Preparation", "product": "Green Sulfur", "analysis": "Sulfur 70%", "rate": "5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 1 kg", "slug": "green-sulfur", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Germination", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Land Preparation", "product": "FeSO4", "analysis": "Fe 30% · S 18%", "rate": "2 kg", "method": "Broadcasting", "pack": "Pack - 1 kg", "slug": null, "commodity": true },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Foliar", "stage": "Land Preparation", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Germination", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Early Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Grand Growth", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false },
 { "band": "Foliar", "stage": "Maturity", "product": "VL-Micromix", "analysis": "Zn 5% · Fe 2% · Mn 2% · Cu 1% (w/v)", "rate": "1 pack", "method": "Spray", "pack": "Pack - 1 L", "slug": "vl-micro-mix", "commodity": false }
]

export const WATERMELON_STAGES = ["Land Preparation", "Germination", "Early Growth", "Grand Growth", "Maturity"]
export const WATERMELON_PLAN: PlanRow[] = [
 { "band": "Phosphorus", "stage": "Land Preparation", "product": "Green Phosphate", "analysis": "P₂O₅ 32% · N 6%", "rate": "1.5 bags", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 50 kg", "slug": "green-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Early Growth", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Phosphorus", "stage": "Maturity", "product": "V-Phosphate", "analysis": "NPK 11:44:0 + Fe", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 10 kg", "slug": "v-phosphate", "commodity": false },
 { "band": "Nitrogen", "stage": "Land Preparation", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Vital Urea", "analysis": "N 32% · S 13%", "rate": "1 bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 25 kg", "slug": "vital-urea", "commodity": false },
 { "band": "Nitrogen", "stage": "Germination", "product": "Urea", "analysis": "N 46%", "rate": "½ bag", "method": "Side dressing/Broadcasting", "pack": "Bag - 50 kg", "slug": null, "commodity": true },
 { "band": "Nitrogen", "stage": "Maturity", "product": "Crop Force", "analysis": "NPK 12:12:18", "rate": "1 bag", "method": "Side dressing/Placement", "pack": "Bag - 10 kg", "slug": "crop-force", "commodity": false },
 { "band": "Potash", "stage": "Land Preparation", "product": "Fusion Potash", "analysis": "K₂O 50% · N 2% · S 1.5% · B 1% · Mg 1%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 25 kg", "slug": "fusion-potash", "commodity": false },
 { "band": "Potash", "stage": "Early Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Grand Growth", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Potash", "stage": "Maturity", "product": "Vital Potash", "analysis": "NPK 11:0:44, coated with B", "rate": "½ bag", "method": "Fertigation", "pack": "Bag - 20 kg", "slug": "vital-potash", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Early Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Secondary Nutrient", "stage": "Grand Growth", "product": "V-Mag Essential", "analysis": "Mg 8.5% · B 1%", "rate": "1 bag", "method": "Fertigation", "pack": "Bag - 5 kg", "slug": "v-mag-essential", "commodity": false },
 { "band": "Soil Amendment", "stage": "Land Preparation", "product": "Humi Grow", "analysis": "Humic acid 40% · K₂O 7%", "rate": "1 bag", "method": "Drill at sowing; broadcast if no drill", "pack": "Bag - 8 kg", "slug": "humi-grow", "commodity": false },
 { "band": "Micronutrients", "stage": "Germination", "product": "V-Transform", "analysis": "Zinc 21%", "rate": "2 bags", "method": "Side dressing", "pack": "Bag - 3 kg", "slug": "v-transform", "commodity": false },
 { "band": "Micronutrients", "stage": "Early Growth", "product": "VL-Boron", "analysis": "Boron 5%", "rate": "1 pack", "method": "Fertigation", "pack": "Pack - 1 L", "slug": "v-boron", "commodity": false },
 { "band": "Micronutrients", "stage": "Grand Growth", "product": "Tornado", "analysis": "Bio-stimulant", "rate": "1 pack", "method": "Spray", "pack": "Pack - 0.5 L", "slug": "tornado", "commodity": false }
]

// Lookup: crop-page slug -> that crop's stages/plan (added 8 Sep 2026, covers all 28 crops)
export const CROP_PLANS: Record<string, { stages: string[]; plan: PlanRow[]; mode?: 'stage' | 'age' }> = {
  "wheat": { stages: WHEAT_STAGES, plan: WHEAT_PLAN },
  "maize": { stages: MAIZE_STAGES, plan: MAIZE_PLAN },
  "rice-basmati": { stages: RICE_BASMATI_STAGES, plan: RICE_BASMATI_PLAN },
  "rice-hybrid": { stages: RICE_HYBRID_STAGES, plan: RICE_HYBRID_PLAN },
  "cotton": { stages: COTTON_STAGES, plan: COTTON_PLAN },
  "sugarcane": { stages: SUGARCANE_STAGES, plan: SUGARCANE_PLAN },
  "sugarcane-ratoon": { stages: SUGARCANE_RATOON_STAGES, plan: SUGARCANE_RATOON_PLAN },
  "canola": { stages: CANOLA_STAGES, plan: CANOLA_PLAN },
  "sesame": { stages: SESAME_STAGES, plan: SESAME_PLAN },
  "soybean": { stages: SOYBEAN_STAGES, plan: SOYBEAN_PLAN },
  "sunflower": { stages: SUNFLOWER_STAGES, plan: SUNFLOWER_PLAN },
  "chickpea": { stages: CHICKPEA_STAGES, plan: CHICKPEA_PLAN },
  "lentil": { stages: LENTIL_STAGES, plan: LENTIL_PLAN },
  "mungbean-mash": { stages: MUNGBEAN_MASH_STAGES, plan: MUNGBEAN_MASH_PLAN },
  "potato": { stages: POTATO_STAGES, plan: POTATO_PLAN },
  "tomato": { stages: TOMATO_STAGES, plan: TOMATO_PLAN },
  "chili": { stages: CHILI_STAGES, plan: CHILI_PLAN },
  "garlic": { stages: GARLIC_STAGES, plan: GARLIC_PLAN },
  "watermelon": { stages: WATERMELON_STAGES, plan: WATERMELON_PLAN },
  "turmeric": { stages: TURMERIC_STAGES, plan: TURMERIC_PLAN },
  "onion": { stages: ONION_STAGES, plan: ONION_PLAN },
  "banana-year1": { stages: BANANA_YEAR1_STAGES, plan: BANANA_YEAR1_PLAN },
  "banana-year2": { stages: BANANA_YEAR2_STAGES, plan: BANANA_YEAR2_PLAN },
  "citrus": { stages: CITRUS_STAGES, plan: CITRUS_PLAN },
  "date-palm": { stages: DATE_PALM_STAGES, plan: DATE_PALM_PLAN, mode: "age" },
  "mango": { stages: MANGO_STAGES, plan: MANGO_PLAN },
  "strawberry": { stages: STRAWBERRY_STAGES, plan: STRAWBERRY_PLAN },
  "guava": { stages: GUAVA_STAGES, plan: GUAVA_PLAN },
}

/** D-292: Green Sulfur is one quantity in kg and one pack per crop. See lib/sulfurPack.ts. */
export const SULFUR_PACK_BY_CROP: Record<string, 1 | 20 | null> = {}
for (const [slug, cp] of Object.entries(CROP_PLANS)) SULFUR_PACK_BY_CROP[slug] = applySulfurRule(cp.plan)

/**
 * The short name of a crop, for a heading or a sentence: "Banana, 1st year" reads as "Banana".
 *
 * This replaces `c.name.split(' — ')[0]`, which was used in fifteen places and stopped working the
 * moment the em dashes came out of the crop names. It failed SILENTLY — the split simply found no
 * separator and returned the whole name — which is exactly the kind of breakage that reaches a page
 * without anyone noticing, so the idiom now lives in one function instead of fifteen call sites.
 */
export const shortCropName = (name: string) => name.split(/,| \(/)[0].trim()
