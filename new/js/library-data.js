/* The formulation library of the Your brand page: 26 library formulations and the 24 formulations VAN already sells.
   Copied on 27 Nov 2026 from Cinematic Concept 21 Nov 2026/js/library.js (source: van.com.pk/partner/pipeline.html and data/brands.js).
   Stages: Tahir's ruling of 27 Nov 2026. 10 codes hold a PSQCA licence (first commercial batch within 60 days):
   N-17L, P-44L, PK-82, NPK-128M, NPK-10, MX-Z05, MX-ZB3, MX-F05, BIO-H50F, BIO-H40. The other 16 are Validated (first commercial batch in about 3 months, registration included). */
(function () {
  'use strict';
  var FAMILY = {
    N: { name: 'Nitrogen', color: '#2F7D3F' },
    P: { name: 'Phosphorus', color: '#00598E' },
    K: { name: 'Potash', color: '#0F7A72' },
    NPK: { name: 'NPK', color: '#B5621A' },
    MX: { name: 'Micronutrients', color: '#6E4A8E' },
    SEC: { name: 'Secondary nutrients', color: '#8A6D1A' },
    BIO: { name: 'Biologicals', color: '#7A5230' }
  };

  var L = 'PSQCA licensed', V = 'Validated';
  var LIB = [
    { code: 'N-26L', fam: 'N', stage: V, name: 'Liquid nitrogen fertiliser, N 26%, with zinc and boron', analysis: 'N 26% · Zn · B · 2 grades', form: 'Liquid · fertigation and foliar',
      use: 'It is a liquid nitrogen fertiliser for centre-pivot injection and foliar spray. It carries its nitrogen in 3 forms.', tech: '' },
    { code: 'N-17L', fam: 'N', stage: L, name: 'Liquid calcium ammonium nitrate', analysis: 'N 17% · Ca 7.2%', form: 'Liquid · fertigation',
      use: 'It is for fertigated horticulture. It supplies nitrogen and calcium in the same solution.', tech: '' },
    { code: 'N-15C', fam: 'N', stage: V, name: 'Calcium nitrate', analysis: 'N 15.5% · Ca 18.4%', form: '',
      use: 'It supplies chloride-free nitrate nitrogen with a high calcium content. Growers of high-value horticultural crops buy imported products of this class.', tech: '' },
    { code: 'P-44L', fam: 'P', stage: L, name: 'Liquid foliar phosphorus', analysis: 'P₂O₅ 44% with micronutrients', form: 'Liquid · foliar',
      use: 'It is a high-analysis foliar phosphorus fertiliser with added micronutrients. The crop takes it up through the leaf.', tech: '' },
    { code: 'NP-540', fam: 'P', stage: V, name: 'Dual-release phosphate, NP 5:40', analysis: 'N 5% · P₂O₅ 40%', form: 'Soil applied',
      use: 'It is a phosphate fertiliser for a single application.', tech: 'The phosphate is released in 2 stages, a fast stage and a slow stage.' },
    { code: 'NP-838S', fam: 'P', stage: V, name: 'NP 8:38 with sulfur', analysis: 'N 8% · P₂O₅ 38% · S', form: 'Granular · soil applied',
      use: 'The grade is formulated to resist the fixation of its phosphate as calcium phosphate in the soil.', tech: 'We add sulfur to acidify the soil immediately around the granule.' },
    { code: 'UP-44', fam: 'P', stage: V, name: 'Urea phosphate', analysis: '17:44:0 and 12:44:0', form: 'Soluble · fertigation',
      use: 'Each grade supplies nitrogen and phosphorus in a fully soluble form. The solution is acidic.', tech: '' },
    { code: 'P-DRC', fam: 'P', stage: V, name: 'Dual-release phosphate with a calcium-binding shell', analysis: '', form: '',
      use: 'The granule supplies a fast-release phosphate fraction for the seedling. It then supplies a slow-release fraction for the rest of the season.',
      tech: 'The shell breaks down before the granule releases its phosphate. We formulate the shell to bind the free calcium around the granule before that calcium can fix the phosphate.' },
    { code: 'KN-44', fam: 'K', stage: V, name: 'Potassium nitrate', analysis: 'K₂O · N · 3 grades', form: '',
      use: 'It supplies chloride-free potassium with nitrate nitrogen. It is for high-value horticulture and salt-sensitive crops.', tech: '' },
    { code: 'K-45L', fam: 'K', stage: V, name: 'Liquid foliar potash', analysis: 'K₂O 45%', form: 'Liquid · foliar',
      use: 'It is a chloride-free potassium liquid with a low salt index and a neutral pH. It is formulated for foliar application, including application by drone.', tech: '' },
    { code: 'K-50DC', fam: 'K', stage: V, name: 'Potash with boron and silicon coatings', analysis: 'K₂O 50%', form: '',
      use: 'It supplies boron and silicon in the same place as the potash.', tech: 'The potash granule carries 2 coatings, a boron coating and a silicon coating. It is a different product from the dual-coated potash in the coatings section.' },
    { code: 'PK-82', fam: 'NPK', stage: L, name: 'High phosphorus and potash complex', analysis: 'P₂O₅ 42% · K₂O 40%', form: '',
      use: 'It is for the reproductive stage of the crop, when yield and quality are set.', tech: '' },
    { code: 'NPK-128M', fam: 'NPK', stage: L, name: 'NPK 12:12:18 with micronutrients', analysis: 'N 12% · P₂O₅ 12% · K₂O 18% · Zn · B', form: '',
      use: 'It is an NPK fertiliser for the middle and late crop stages. It carries more K₂O than N or P₂O₅.', tech: '' },
    { code: 'NPK-19', fam: 'NPK', stage: V, name: 'NPK 19:19:19', analysis: 'N 19% · P₂O₅ 19% · K₂O 19% · 3 grades', form: 'Soluble · foliar, fertigation and drone',
      use: 'It is a fully soluble, balanced NPK fertiliser. It comes in 3 grades: foliar, fertigation and drone.', tech: '' },
    { code: 'NPK-10', fam: 'NPK', stage: L, name: 'NPK 10:10:10, iron-coated', analysis: 'N 10% · P₂O₅ 10% · K₂O 10% · Fe', form: '',
      use: 'It is for a crop that, by its current stage, has received less nutrient than its crop plan required.', tech: 'Iron is coated onto the granule.' },
    { code: 'V-Crop series', fam: 'NPK', stage: V, name: 'Crop-specific NPK grades', analysis: '4 grades', form: '',
      use: 'The series has 4 NPK grades: potato 10:5:35, citrus 16:6:28, rice 12:10:25 and wheat 21:7:19 with zinc 1.5%.', tech: '' },
    { code: 'V-Stage series', fam: 'NPK', stage: V, name: 'Stage-specific NPK grades', analysis: '3 grades', form: '',
      use: 'The series has 3 NPK grades: vegetative 14:21:16, flowering 8:34:14 and fruiting 12:8:32.', tech: '' },
    { code: 'MX-Z05', fam: 'MX', stage: L, name: 'Chelated zinc 5%', analysis: 'Zn 5%', form: '',
      use: 'We chelate the zinc so that it stays available at pH 8. Zinc sulfate largely precipitates at that pH.', tech: '' },
    { code: 'MX-ZB3', fam: 'MX', stage: L, name: 'Zinc 12% with boron 3%', analysis: 'Zn 12% · B 3%', form: 'Foliar',
      use: 'It is formulated to correct zinc deficiency and boron deficiency in a single foliar spray.', tech: '' },
    { code: 'MX-F05', fam: 'MX', stage: L, name: 'Chelated iron', analysis: 'Fe', form: '',
      use: 'It is for lime-induced iron chlorosis in orchards on calcareous soil.', tech: '' },
    { code: 'BIO-H50F', fam: 'BIO', stage: L, name: 'Potassium humate 50 with fulvic material', analysis: 'Potassium humate 50% · fulvic acid 10% · K₂O 10%', form: '',
      use: 'It is a concentrated humate for soils with less than 1% organic matter.', tech: '' },
    { code: 'BIO-H40', fam: 'BIO', stage: L, name: 'Potassium humate 40 with fulvic material', analysis: 'Potassium humate 40% · fulvic acid 10% · K₂O 10%', form: '',
      use: 'It is a humate at a lower concentration than BIO-H50F.', tech: '' },
    { code: 'BIO-P01', fam: 'BIO', stage: V, name: 'Phosphorus-solubilising bacteria', analysis: '', form: 'Biological · soil applied',
      use: 'It contains strains of phosphorus-solubilising bacteria that were isolated locally and selected for Pakistani soil pH and climate.', tech: '' },
    { code: 'BIO-P01L', fam: 'BIO', stage: V, name: 'Liquid inoculant of phosphorus-solubilising bacteria', analysis: '', form: 'Biological · fertigation and spray',
      use: 'It carries the phosphorus-solubilising bacteria of BIO-P01 in a liquid carrier, for fertigation lines and spray tanks.', tech: '' },
    { code: 'BIO-M01', fam: 'BIO', stage: V, name: 'Mycorrhizal inoculant', analysis: '', form: 'Biological · soil applied',
      use: 'It is formulated to help the crop take up the phosphorus that the bacteria in BIO-P01 release.', tech: '' },
    { code: 'BIO-S01', fam: 'BIO', stage: V, name: 'Biological seed treatment', analysis: '', form: 'Biological · seed treatment',
      use: 'It is a biological treatment applied to the seed.', tech: '' }
  ];

  /* The second shelf: the 24 formulations that VAN already makes and sells under its own brands.
     Tahir ruled on 24 Nov 2026 that all 24 are offered for white label and that this page shows them
     by analysis only, with no VAN brand name. Source: data/brands.js of the Products page. */
  var OWN = [
    { fam: 'N', name: 'Sulfur-coated urea', analysis: 'N 32% min · S 13% min', form: 'Urea granules coated with elemental sulfur · 25 kg', use: 'It is urea coated with sulfur.', tech: 'Pakistan Patent 144684 covers the coating.' },
    { fam: 'N', name: 'Nitrogen with sulfur', analysis: 'N 22% min · S 18% min', form: 'Broadcast and fertigation · 25 kg', use: 'It supplies nitrogen and sulfur.', tech: '' },
    { fam: 'P', name: 'NP 11:44:0 with iron', analysis: 'N 11% · P₂O₅ 44% + Fe', form: 'Fertigation · 10 kg', use: '', tech: '' },
    { fam: 'P', name: 'Humic-coated NP 6:32:0', analysis: 'N 6% · P₂O₅ 32%', form: 'Acidic, humic-coated granules · 50 kg and 35 kg', use: '', tech: 'The granules are acidic and coated with humic material.' },
    { fam: 'P', name: 'Triple superphosphate (TSP)', analysis: 'P₂O₅ 46%', form: 'Soil applied · 50 kg', use: '', tech: '' },
    { fam: 'P', name: 'Liquid phosphate, P₂O₅ 27%', analysis: 'P₂O₅ 27% · N 4.5% · K₂O 2%, with Mg, S and Fe', form: 'Liquid · fertigation · 8 L', use: '', tech: '' },
    { fam: 'K', name: 'Boron-coated potash 11:0:44', analysis: 'N 11% · K₂O 44%', form: 'Fully water-soluble granules · fertigation · 20 kg', use: '', tech: 'The granules are coated with boron in 2 forms.' },
    { fam: 'K', name: 'Potash 2:0:50 with sulfur, boron and magnesium', analysis: 'N 2% · K₂O 50% + S 1.5% · B 1% · Mg 1%', form: 'Granules for broadcasting, soluble powder for fertigation · 25 kg', use: '', tech: '' },
    { fam: 'K', name: 'Sulfate of potash (SOP)', analysis: 'K₂O 50% · S 17.5%', form: 'Soil application and fertigation · 25 kg', use: '', tech: '', traded: true },
    { fam: 'K', name: 'Liquid potash, K₂O 30%', analysis: 'K₂O 30%', form: 'Liquid · fertigation and foliar · 1 L', use: '', tech: '' },
    { fam: 'K', name: 'Potash 10:0:40 with magnesium, boron and chelated iron', analysis: 'N 10% · K₂O 40% + Mg · B · chelated Fe', form: 'Fertigation · 10 kg', use: '', tech: '' },
    { fam: 'NPK', name: 'NPK in 2 grades', analysis: 'NPK 15:15:15 and NPK 12:12:18', form: 'Side-dressing and band placement · NPK 15:15:15 in 1 kg and 20 kg · NPK 12:12:18 in 10 kg', use: '', tech: '' },
    { fam: 'NPK', name: 'Liquid NPK 8:8:6', analysis: 'N 8 · P₂O₅ 8 · K₂O 6 (% w/w)', form: 'Liquid · foliar · 1 L', use: '', tech: '' },
    { fam: 'MX', name: 'Liquid micronutrient mix', analysis: 'Zn 5 · Fe 2 · Mn 2 · Cu 1 (% w/v)', form: 'Liquid · foliar · 1 L', use: '', tech: '' },
    { fam: 'MX', name: 'Liquid boron 5%', analysis: 'B 5% w/v', form: 'Liquid · fertigation and foliar · 1 L', use: '', tech: '' },
    { fam: 'MX', name: 'Liquid zinc 10%', analysis: 'Zn 10% w/v, as zinc sulfate', form: 'Liquid · fertigation and foliar · 3 L', use: '', tech: '' },
    { fam: 'MX', name: 'Granular zinc 21%', analysis: 'Zn 21%', form: 'Granules · 3 kg', use: '', tech: '' },
    { fam: 'SEC', name: 'Liquid calcium and magnesium with nitrogen and boron', analysis: 'N 10% · Ca 6% · Mg 4% · B 1%', form: 'Liquid · fertigation and foliar · 1 L', use: '', tech: '' },
    { fam: 'SEC', name: 'Magnesium powder with boron', analysis: 'Mg 8.5% · B 1%', form: 'Powder · fertigation · 5 kg', use: '', tech: '' },
    { fam: 'SEC', name: 'Sulfur 70%', analysis: 'S 70%', form: 'Water-dispersible granules and powder · 1 kg, 5 kg and 20 kg', use: '', tech: '' },
    { fam: 'BIO', name: 'Compost with nitrogen', analysis: 'Organic matter 25% + N 5%', form: 'Soil applied · 20 kg', use: '', tech: '' },
    { fam: 'BIO', name: 'Potassium humate pellets', analysis: 'Humic acid 40% · K₂O 7%', form: 'Pellets · 8 kg', use: '', tech: '' },
    { fam: 'BIO', name: 'Liquid humic acid with potash', analysis: 'Humic acid 10% · K₂O 3.5%', form: 'Liquid · fertigation · 4 L', use: '', tech: '' },
    { fam: 'BIO', name: 'Liquid amino acids with humic acid, fulvic acid and seaweed', analysis: 'Amino acids 10% · humic 3.4% · fulvic 4.5% · seaweed 0.5% (% w/v)', form: 'Liquid · foliar · 0.5 L', use: '', tech: '' }
  ];
  var M = 'In production', T = 'On sale';
  window.VAN_LIBRARY = { FAMILY: FAMILY, LIB: LIB, OWN: OWN, L: L, V: V, M: M, T: T };
})();
