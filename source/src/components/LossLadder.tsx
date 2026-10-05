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

export function LossLadder({ slug, compact = false }: { slug?: string; compact?: boolean }) {
  const field = slug ? isFieldCrop(slug) : true
  return (
    <div className="panel p-5 lg:p-6" id="what-reaches">
      <span className="eyebrow rust">What actually reaches your crop</span>
      <h3 className="mt-1 max-w-[30ch]">You pay for the whole bag. About a quarter of the nitrogen in it feeds the crop.</h3>

      <p className="lead mt-3 max-w-[140ch]">
        Across Pakistan's cropland, roughly <b>1 kg of applied nitrogen in 4</b> is taken up by the
        crop. In the United States it is about {NATIONAL.nitrogen.us} in 100. The rest of ours leaves as
        ammonia gas, drains past the roots as nitrate, or goes to gas in waterlogged ground. The farmer pays
        for that nitrogen at the depot and the crop never gets it.
      </p>
      <p className="src"><b>Source ·</b> {NATIONAL.nitrogen.source}</p>

      <h4 className="mt-6">Why it goes</h4>
      <div className="grid md:grid-cols-2 gap-3 mt-2">
        <div className="panel-soft p-4">
          <b style={{ color: 'var(--navy)' }}>Some of it is your soil, and that part is not your fault.</b>
          <p className="small mt-1">
            Above pH 8, and about {SEVENTY} of Punjab's samples are above pH 8, urea left on the surface turns to
            ammonia and leaves before a root can reach it. Calcareous ground binds phosphate with free calcium
            and takes most of it back. The same alkalinity locks up zinc.
          </p>
          <a className="cap" href="#/soil">The soil, measured 770,160 times →</a>
        </div>
        <div className="panel-soft p-4">
          <b style={{ color: 'var(--navy)' }}>Some of it is how the bag was used, and that part you can change.</b>
          <p className="small mt-1">
            Where it was placed, when it was split, whether the water followed it, and what it was mixed with.
            None of that is printed on a bag, and it is where a large share of the loss happens.
          </p>
        </div>
      </div>
      <p className="small muted mt-2 max-w-[140ch]">
        <b>We are not going to tell you how the quarter splits between those two.</b> Nobody has measured that
        for Pakistan, VAN included, and a number invented for the sake of a tidy page is worse than no number.
      </p>

      <h4 className="mt-6">What you can do, in the order it costs you</h4>
      <ol className="grid gap-3 mt-2 pl-0 list-none">
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>1</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>Change the form.</b>
            <span className="small block">A coated urea releases over days instead of all at once on a hot surface. This is the rung that costs money, and it is deliberately first only because it is the largest.</span>
          </span>
        </li>
        {field && (
          <li className="flex gap-3">
            <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>2</span>
            <span>
              <b style={{ color: 'var(--navy)' }}>If you cannot change the product, change the method.</b>
              <span className="small block">Placed in the band, drilled at sowing, or side-dressed and watered in, the same bag puts <b>more of its nitrogen into the crop</b> than it does broadcast on a dry alkaline surface. The bag and the price are the same. Only the placement changes. VAN publishes no figure for how much more, because it has not measured one in a trial it can name.</span>
              <span className="small block mt-1">The same holds for phosphate, DAP included: <b>the closer it goes to the root, the less of it the soil locks up</b> before the root arrives.</span>
              <a className="cap" href="#/crops/wheat#methods">The 5 methods, and what each one does →</a>
            </span>
          </li>
        )}
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{field ? 3 : 2}</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>If you irrigate through the line, level the field first.</b>
            <span className="small block">On unlevelled ground the water, and everything dissolved in it, reaches the low end of the field first and the high end last or not at all. Fertigation spreads the nutrient more evenly once the ground is level, and the levelling is doing part of that work, not the fertigation alone. No figure is put on it here, because VAN has not measured one in a trial it can name.</span>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="num shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{field ? 4 : 3}</span>
          <span>
            <b style={{ color: 'var(--navy)' }}>Change the moment. Split it, and follow the water.</b>
            <span className="small block">Nitrogen given in one early dose sits on the field waiting to be lost. Split against the crop's own demand and follow the irrigation with it.</span>
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
            <b style={{ color: 'var(--navy)' }}>Build the tank mix properly.</b>
            <span className="small block">A correct mix for foliar and fertigation drives uptake in its own right. 4 rules carry most of it.</span>
            <span className="small block mt-2">
              <b>Fill the tank half full first, and keep the agitator running.</b> Products go in one at a time, each
              one dispersed before the next arrives. Adding to an empty tank, or all at once, is how a mix curdles.
            </span>
            <span className="small block mt-1">
              <b>Add in order of how hard each one is to disperse:</b> wettable powders, then water-dispersible
              granules, then suspensions and flowables, then anything already in solution, then emulsifiable
              concentrates, and adjuvants and surfactants last of all.
            </span>
            <span className="small block mt-1">
              <b>Jar-test anything you have not mixed before.</b> The same products in the same order, at the same
              ratio, in a clear jar. Leave it 15 minutes. Curdling, flakes, a layer on top or sludge at the
              bottom means it will do the same in a 200-litre tank, and you will find out with a blocked boom.
            </span>
            <span className="small block mt-1">
              <b>Spray it the day you mix it, and not into the middle of the day.</b> A mix left standing separates,
              and a leaf takes far less in heat with the stomata shut. Early morning or late afternoon.
            </span>
            <span className="cap block mt-2" style={{ color: 'var(--rust)', fontWeight: 700 }}>
              This is general spray practice, not a VAN compatibility chart. Which VAN products must not share a
              tank, at what concentration, and what your own water does to them are answered product by product by
              the agronomy team, and in full for partners.
            </span>
          </span>
        </li>
      </ol>

      {!compact && (
        <p className="small mt-5 max-w-[140ch]">
          <b>3 of those rungs cost nothing.</b> A farmer who buys not one extra bag and only moves where and
          when he puts the one he has is already ahead. That is the point of publishing this.
        </p>
      )}
    </div>
  )
}

const SEVENTY = '69 in every 100'
