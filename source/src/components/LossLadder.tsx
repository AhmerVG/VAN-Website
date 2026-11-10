import { NATIONAL } from '@/data/site'
import { familyFor } from '@/components/CropShapes'

/**
 * WHAT YOU LOSE, WHY, AND WHAT TO DO ABOUT IT — O-21, O-25 and O-26, 9 September 2026.
 *
 * Tahir, stating VAN's position as a company: "We as an organisation have a clear position. USE
 * EFFICIENCY AND NUTRITION UPTAKE IS THE NUMBER WHICH SHOULD BE TALKED, and informing farmer on how
 * much a product never reaches to the plant is what he owe us. And we should also build a language
 * which help him know what he lose and why — what lost in soil because of chemistry, what lose
 * because of his practices — and we should link some best practices of application. Say urea is lose
 * 50% (example), what farmer can do: change the product; if he can't, at least change the method of
 * application, band placement or drill or side dress."
 *
 * ─── WHAT IS SOURCED, AND WHAT IS NOT ─────────────────────────────────────────────────────────────
 *
 * The national uptake figure is PUBLISHED AND CITED: about 25% of applied nitrogen is taken up in
 * Pakistan against about 72% in the United States (Lassaletta et al. 2014, Environmental Research
 * Letters 9:105011, corroborated by Shahzad et al. 2019, Nature Sustainability). It is already on the
 * national page. So the real loss is nearer three quarters than the half Tahir used as an example.
 *
 * The three application figures are GONE as of 11 September 2026, on Tahir's ruling. They were
 * VAN's own field experience, volunteered by him as such ("field experience and evidence not a
 * trial"), and they were marked as field experience in the open. An audit put them against the
 * site's own standing rule — no performance figure is claimed without a named trial, which is why
 * the circular-economy register holds back every yield percentage — and he chose the rule over the
 * exception. The mechanisms are still stated. The numbers are not. If a named trial ever measures
 * them, they come back with their source printed like everything else.
 *
 * WHAT IS DELIBERATELY ABSENT, and this is the important one:
 *
 *  1. NO SPLIT BETWEEN CHEMISTRY AND PRACTICE. Tahir asked for the loss to be separated into what
 *     the soil takes and what the farmer's own practice costs. That distinction is right and it is
 *     the honest one — but no published source apportions the 75%, and nothing in VAN's files does
 *     either. The figure is an aggregate of chemistry, method, timing, form and weather. Splitting it
 *     would be inventing coefficients, which the standing rule forbids. So the page NAMES the causes
 *     on both sides without putting a number on either share, and says so plainly.
 *  2. NO LOSS FIGURE ON ANY VAN PRODUCT. His ruling, asked and answered: commodity fertilizer only
 *     for now. Coated urea does better than surface urea and nothing is 100%, but VAN does not yet
 *     have a figure for its own range that it is ready to stand behind, so none is printed.
 *  3. TANK-MIX RULES — WRITTEN 10 Sep 2026, as general practice. He ruled: write the standard
 *     published practice and say plainly that it is standard published practice, rather than leave
 *     the rung reading "being written" indefinitely. VAN's own compatibility data stays behind the
 *     NDA the partner page already names. What the rung must never do is imply that the four rules
 *     below are VAN's answer for VAN's products; the red line under them exists for that.
 *     (Original note kept below.) The fourth rung is real — "a right tank mix for foliar and fertigation is a
 *     driver to plant uptake and absorption" — and the site currently gives the farmer nothing on it
 *     while selling tank-mix competence to partners behind an NDA. Resolved by splitting it in two:
 *     the general practice (order of addition, the jar test, mix-and-spray-the-same-day, and not in
 *     the heat) is published, because it is taught by every extension service and a farmer following
 *     it is better off tonight; the parts that ARE VAN's chemistry — which products must not share a
 *     tank, at what concentration, and what a given water does to them — stay off the page, because
 *     a wrong pairing ruins a spray and can burn a crop and none of it may be written from memory.
 *
 * ACRES, NOT HECTARES, per his standing ruling: every figure a reader sees is per acre or in maunds,
 * and where a source published in kg/ha the source line carries the original as published so the
 * citation still checks out.
 */

/**
 * The +10% placement figure goes on FIELD CROPS ONLY — his ruling. Broadcasting means something
 * different in a mango orchard or a date palm garden from what it means in a wheat field, and
 * pasting one figure onto twenty-eight pages is exactly the kind of thing that gets found out.
 * Orchards get their own line when VAN has one for them.
 */
export function isFieldCrop(slug: string): boolean {
  const f = familyFor(slug)
  return f !== 'tree' && f !== 'palm' && !slug.startsWith('banana')
}

/* 11 Sep 2026 · the "VAN field experience" marker and the three figures it labelled were removed on
   Tahir's ruling. It marked figures he had himself volunteered as field experience rather than
   trial data; the standing rule that no performance figure is claimed without a named trial now
   governs these too, as it already governed the circular-economy register. The mechanisms stay and
   the numbers are gone. Restoring them means restoring the three spans in this file AND the marker
   below it, which is why the marker is kept here rather than deleted. */

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function LossLadder({ slug, compact = false }: { slug?: string; compact?: boolean }) {
  const field = slug ? isFieldCrop(slug) : true
  return (
    <div className="panel p-5 lg:p-6" id="what-reaches">
      <span className="eyebrow rust">Nitrogen use efficiency in Pakistan</span>
      <h3 className="mt-1 max-w-[30ch]">Pakistan’s nitrogen use efficiency was about 29% in 2023 (FAO estimate)</h3>

      <p className="lead mt-3 max-w-[140ch]">
        {/* D-325, 4 Nov 2026: FAO 2023. Was "roughly 1 kg of applied nitrogen in 4 is taken up by the crop" (Lassaletta et al. 2014). */}
        {/* L1 editor 7 Nov 2026 (whyshift M2, B3; crops-b M4): the 26 kg and 11 kg are tied to Pakistan's 2023 100 kg (as in
            NATIONAL.nitrogen.text), the United States sentence moved to the end, and the depot sentence says "part of", as in the
            work-whyshift draft. Was: "In the United States the efficiency was about 71%. FAO estimates that, of every 100 kg of
            nitrogen added, about 26 kg ... Farmers pay for this lost nitrogen at the depot, but the crop never receives it. A further part ..." */}
        Nitrogen use efficiency is the share of the nitrogen added to cropland that is taken out in the
        harvested crop. The figure covers all crops in Pakistan, not one crop alone. Of every <b>100 kg of nitrogen added to Pakistan’s cropland in 2023, 29 kg were taken out
        in the harvested crop</b> (FAO). FAO estimates that, of the same 100 kg, about 26 kg were lost to the air and
        11 kg were lost to water. Part of this lost nitrogen came from fertiliser that farmers had paid for, and the crop
        never received it. A further part is taken off the field in straw and stalks, and the remainder is not accounted
        for. In the United States the efficiency was about {NATIONAL.nitrogen.us}%.
      </p>
      <p className="src"><b>Source ·</b> {NATIONAL.nitrogen.source}</p>

      <h4 className="mt-6">Why the nitrogen is lost</h4>
      <div className="grid md:grid-cols-2 gap-3 mt-2">
        <div className="panel-soft p-4">
          <b style={{ color: 'var(--navy)' }}>Part of the loss is caused by soil conditions that the farmer cannot change.</b>
          <p className="small mt-1">
            {/* L1 editor 7 Nov 2026 (whyshift B2, m6): "part of" the nitrogen, as the national page and the work-whyshift draft say;
                calcareous explained. Was: "Above pH 8, urea left on the soil surface turns to ammonia and is lost to the air before a
                root can reach it. ... in calcareous soil, free calcium ..." */}
            About {SEVENTY} of the samples in the Punjab soil survey, taken about 2016 to 2018, had a pH above 8.
            On such soil, part of the nitrogen in urea left on the surface turns to ammonia and is lost to the air
            before the crop can take it up. The same high pH causes other losses: in calcareous soil (soil rich in
            calcium carbonate), free calcium binds most of the phosphate applied, and zinc becomes unavailable to the crop.
          </p>
          <a className="cap" href="#/soil">Punjab soil survey: 770,160 samples →</a>
        </div>
        <div className="panel-soft p-4">
          <b style={{ color: 'var(--navy)' }}>Part of the loss comes from how the fertiliser is applied, which the farmer can change.</b>
          {/* Tahir 7 Nov 2026 (RP-WS-1): the unsourced share claim is deleted. Was: 'The loss depends on where the fertiliser was placed, how the doses were split,
              whether irrigation followed the application, and what the fertiliser was mixed with. None of this is printed on the bag, and a large share of the loss happens through these practices.' */}
          <p className="small mt-1">
            How much nitrogen is lost also depends on where the fertiliser is placed, how the doses are split, whether
            irrigation follows the application, and what the fertiliser is mixed with.
          </p>
        </div>
      </div>
      <p className="small muted mt-2 max-w-[140ch]">
        No study has yet measured how much of the nitrogen loss in Pakistan is caused by soil conditions and how
        much by the way fertiliser is applied.
      </p>

      <h4 className="mt-6">Steps a farmer can take to reduce the loss</h4>
      <ol className="grid gap-3 mt-2 pl-0 list-none">
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>1</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>Change to a coated urea.</b>
            <span className="small block">{/* L1 editor 7 Nov 2026 (crops-b m20): subject of "all at once" stated. */}Ordinary urea releases all its nitrogen at once when it lands on hot soil; a coated urea releases its nitrogen over several days. It costs more than ordinary urea. This step is listed first because it has the largest effect.</span>
          </span>
        </li>
        {field && (
          <li className="flex gap-3">
            <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>2</span>
            <span>
              <b style={{ color: 'var(--navy)' }}>If you keep the same fertiliser, change how you apply it.</b>
              <span className="small block">When the same fertiliser is placed in a band beside the seed row, drilled at sowing, or side-dressed and then irrigated, <b>more of its nitrogen reaches the crop</b> than when it is broadcast on dry alkaline soil. The bag and the price stay the same.</span>
              <span className="small block mt-1">Placement also matters for phosphate fertiliser, including DAP (diammonium phosphate): <b>the closer it is placed to the root, the less of it the soil binds</b> before the root reaches it.</span>
              <a className="cap" href="#/crops/wheat#methods">The 5 methods, and what each one does →</a>
            </span>
          </li>
        )}
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{field ? 3 : 2}</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>If you apply fertiliser through the irrigation water, level the field first.</b>
            <span className="small block">On unlevelled ground, the water and everything dissolved in it reach the low end of the field first and the high end late or not at all. {/* L1 editor 7 Nov 2026 (crops-b M5): comparison stated. Was: "Once the ground is level, fertigation spreads the nutrient more evenly, and part of this more even spread comes from the levelling, not from the fertigation alone." */}On a level field, fertigation spreads the nutrient more evenly than on unlevelled ground. Part of that improvement comes from levelling the field, not from fertigation itself.</span>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{field ? 4 : 3}</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>Change the timing: split the nitrogen into doses.</b>
            <span className="small block">If all the nitrogen is applied in 1 early dose, much of it sits in the soil before the crop needs it, and it can be lost. Split the nitrogen into doses that follow the crop’s own demand, and time each dose with an irrigation.</span>
          </span>
        </li>
        {/* 10 Sep 2026. This rung read "being written" for two days and was the last placeholder on
            the site. Tahir's ruling: write the general practice and label it as general practice, so
            the rung stops being a hole, while VAN's own compatibility chart stays where the partner
            page already says it lives, behind an NDA.
            EVERY LINE BELOW IS STANDARD, PUBLISHED SPRAY PRACTICE. The order of addition taught by
            every extension service that publishes one, the jar test, and the two rules about heat
            and about water. NONE of it is a VAN compatibility claim, and the label under it says so
            in the reader's own words rather than in a footnote he will not read. */}
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{field ? 5 : 4}</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>Prepare the tank mix correctly.</b>
            <span className="small block">A correctly prepared tank mix helps the crop take up more of what is sprayed on the leaves or applied through the irrigation water. Most of the method is covered by these 4 rules.</span>
            <span className="small block mt-2">
              <b>Fill the tank half full of water first, and keep the agitator running.</b> Add products 1 at a
              time, and let each disperse before adding the next. Adding products to an empty tank, or all at once,
              makes a mix curdle.
            </span>
            <span className="small block mt-1">
              <b>Add products in order of how hard each is to disperse:</b> wettable powders, then water-dispersible
              granules, then suspensions and flowables, then anything already in solution, then emulsifiable
              concentrates, and adjuvants and surfactants last of all.
            </span>
            <span className="small block mt-1">
              <b>Jar-test any mix you have not made before.</b> Mix the same products in the same order and at the
              same ratio in a clear jar, and leave it for 15 minutes. If the mix curdles, or forms flakes, a layer on
              top or sludge at the bottom, it will do the same in a 200-litre tank and block the boom.
            </span>
            <span className="small block mt-1">
              <b>Spray the mix on the day you make it, and not in the middle of the day.</b> A mix left standing
              separates, and in the heat a leaf takes up far less, because the small pores on its surface (stomata)
              close. Spray in the early morning or late afternoon.
            </span>
            <span className="cap block mt-2" style={{ color: 'var(--rust)', fontWeight: 700 }}>
              These are general spray rules. They do not show which VAN brands can be mixed together. VAN’s
              agronomy team answers, brand by brand, which VAN brands must not share a tank, at what
              concentration, and how your own water affects them. Companies that partner with VAN receive the
              full answers.
            </span>
          </span>
        </li>
      </ol>

      {!compact && (
        <p className="small mt-5 max-w-[140ch]">
          <b>3 of these steps cost nothing.</b> A farmer who buys no extra bag, and changes only where and when
          the existing fertiliser is applied, is already better off.
        </p>
      )}
    </div>
  )
}

const SEVENTY = '69%'
