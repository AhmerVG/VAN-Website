import { usePhonePlainDefault } from '@/lib/phonePlain'
import { useState } from 'react'
import { WHEAT, WA, CONTACT } from '@/data/site'
import { WHEAT_PLAN, WHEAT_STAGES } from '@/data/catalogue'
import { StageWalk } from '@/components/StageWalk'
import { ListBuilder } from '@/components/ListBuilder'
import { FlipCards } from '@/components/FlipCards'
import { MethodsStrip } from '@/components/MethodsStrip'
import { PlanMatrix } from '@/components/PlanMatrix'
import { NutritionCreator } from '@/components/NutritionCreator'
import { parseCardParam } from '@/lib/gpsCard'
import { SowingDate } from '@/components/SowingDate'
import { NutrientBalance } from '@/components/NutrientBalance'
import { WaterRequirement } from '@/components/WaterRequirement'
import { LossLadder } from '@/components/LossLadder'
import { CropNow } from '@/components/CropNow'
// import { StandingCrop } from '@/components/StandingCrop'  // block 06, removed 11 Sep 2026
import { Detail } from '@/components/Detail'
import { VanForm } from '@/components/VanForm'
import { FARMER_FORM } from '@/data/formSpecs'
import { SectionHead, WaButton, noStop } from '@/components/bits'

/**
 * THE WHEAT CROP PAGE — reordered 9 Sep 2026 into the eight blocks Tahir reviewed as a wireframe.
 *
 *   01 When did you sow?            one input, and it orders everything below it
 *   02 Where your crop is now       what to do THIS WEEK — the spine, not a fifth tool
 *   03 The programme                the reference the other blocks point back to
 *   04 What to buy for your acres   the action
 *   05 Adjust it for your soil      attached to 04, because it changes the same numbers
 *   06 What is actually standing    not built; says what it is waiting on
 *   07 Nutrition is one lever of 10 reflective, so it never competes for the top
 *   08 Everything else              method, evidence, background — one tap away in Plain mode
 *
 * The order is the season, not the org chart. What moved and why is D-65 in DECISIONS.md; the old
 * order is one file revert away.
 */
export default function Wheat({ district = null, card = null }: { district?: string | null; card?: string | null } = {}) {
  // G6: the card wording shows while rows from the Soil Atlas card are in use. Second review, 20 Oct 2026: it was read
  // once from the link, so after "Clear all" and a district the head still said "this soil card"; the calculator now
  // reports whether card rows are on screen, and the wording follows. It starts from the link, so the first paint
  // matches.
  const [fromCard, setFromCard] = useState(() => !!district && !!parseCardParam(card))
  usePhonePlainDefault()   // D-199
  const [askOpen, setAskOpen] = useState(false)
  const pdf = `https://www.van.com.pk/${WHEAT.pdf}`
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--gold-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <p className="cap"><a href="#/crops">Crop Plans</a> / Cereals & field crops / Wheat</p>
          <span className="eyebrow gold mt-2">Crop plan</span>
          <h1>{noStop(WHEAT.h1)}</h1>
          <p className="lead mt-4">{WHEAT.lead}</p>
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {WHEAT.meta.map(m => <span key={m} className="tag tag-navy">{m}</span>)}
            {/* Tahir 7 Nov 2026 (CR-21): tag was "Zn-K programme". */}
            <span className="tag tag-sky">Oct to Nov sowing</span><span className="tag tag-green">Main nutrients: zinc and potassium</span>
            <a className="btn btn-gold ml-auto" href={pdf} target="_blank" rel="noopener">Download the PDF ↓</a>
          </div>
        </div>
      </section>

      {/* 01 + 02. The one input, and what it makes true today. Both are additive: with no date
          answered, 02 renders nothing at all and the page is the page it was before. */}
      <section className="wrap sec-tight">
        <SowingDate cropKey="wheat" cropName="wheat" />
        <div className="mt-4"><CropNow cropKey="wheat" cropName="wheat" /></div>
      </section>

      {/* 03. The reference. Stays open: it is what a technical reader came for and what every other
          block points back to. */}
      <section className="wrap sec" id="programme">
        {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
        <SectionHead eyebrow="The whole plan at a glance" title="The wheat plan: 7 nutrient groups across 5 stages." lead="Rates are per acre. Ordinary urea is shown in grey because VAN does not make it." />
        {/* O-3: his ruling. Simple view folds the full stage-by-stage table. Full view is unchanged. */}
        <Detail bare label="The full table: 7 nutrient groups at each of the 5 stages">
          <PlanMatrix stages={WHEAT_STAGES} plan={WHEAT_PLAN} tableNote={WHEAT.tableNote} />
        </Detail>
        <p className="cap mt-3">Growing degree days (a measure of the heat the crop has received) and days after sowing for each stage are in the table <a href="#gdd">“The 5 stages, in 1 table”</a>, further down this page.</p>
      </section>

      {/* 04. The action. */}
      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap" id="list">
        <SectionHead eyebrow="Your shopping list" title="What to buy for your acres." tone="navy" />
        {/* D-263: this page also carries the creator, so the list says it is the published plan. */}
        <ListBuilder published />
      </div></section>

      {/* 05. The same numbers, moved by the farmer's own ground. On wheat the soil layer lives
          inside the nutrition creator rather than on the list, so the creator is block 05. */}
      <section className="wrap sec-tight" id="creator">
        {/* G6, Tahir 20 Oct 2026: arriving from the Soil Atlas card, the head names the card instead of "your soil" and "your
            soil report"; wording only. Without a card it reads as before. */}
        {fromCard
          ? <SectionHead eyebrow="Nutrition creator" title="Adjust the plan for this soil card." lead="The soil rows below are filled from the Soil Atlas card for the area near your land, and the quantities change to match that card. If you have your own soil test figures, type them over any row." tone="navy" />
          : <SectionHead eyebrow="Nutrition creator" title="Adjust the plan for your soil." lead="Enter the readings from your soil report. If you have no report, choose your district, and the soil rows are filled with that district’s median readings from the Punjab soil survey, taken about 2016 to 2018. The quantities then change to match those readings." tone="navy" />}
        <p className="small mb-3 max-w-[140ch]"><b>This page has 2 lists.</b> The shopping list above follows VAN’s published plan. {fromCard ? 'The list below comes from the Nutrition creator, which adjusts the quantities to this soil card.' : 'The list below comes from the Nutrition creator, which adjusts the quantities to your soil report or, if you have none, to your district’s median readings.'} Both lists use the same number of acres; changing it in either list changes both. The 2 lists differ in 1 product: VAN’s published plan includes V-Phosphate at Early Growth, and the Nutrition creator does not. Where a nitrogen or phosphate total below is a range, the higher figure comes from the published plan and the lower figure from the Nutrition creator. If you have no soil report, follow the published crop plan. The Nutrition creator list is meant for a field with a soil report; {fromCard ? 'without one, it uses this soil card.' : 'without one, it uses your district’s median readings.'}</p>{/* Tahir 10 Nov 2026 (CR-N11): last sentence added. */}{/* L1 10 Nov 2026 (crops 11): 1 name for the soil report. Was "Without a soil test, follow the published crop plan; the creator list is for a field with a soil report." No fact changed. */}{/* Tahir 10 Nov 2026 (FU-1): product name V-Phosphate, was "V. Ammonium Phosphate (V-Phosphate)". */}{/* Tahir 7 Nov 2026 (CR-20): was "VAN’s published plan includes V. Ammonium Phosphate (V-Phosphate) at Early Growth and the Nutrition creator does not, so the nitrogen and phosphate totals below are shown as a range." */}{/* D-151 (A12): was "This is the same programme from VAN’s calculator; use it if you have a soil report." */}
        {/* Teesra Khata, 18 Oct 2026: a link from the Soil Atlas carries the district, and the soil rows open filled from it. */}
        {/* GPS grid card, D-279, 20 Oct 2026: a link from the card carries its readings too (line 13, Tahir's words). */}
        <NutritionCreator crop="wheat" initialDistrict={district} initialCard={card} onCardRows={setFromCard} />
      </section>

      {/* 05b. What the plan puts back against what the harvest takes. Sits with block 05 because
          it is about the programme the reader has just built, not about the standing crop. */}
      <section className="wrap sec-tight">
        <NutrientBalance cropKey="wheat" cropName="wheat" defaultYieldMaunds={60} />
      </section>

      {/* 05c. Water. A nutrition plan assumes the water arrived; in Pakistan that is the
          assumption that fails most often, so it sits with the plan rather than after it. */}
      <section className="wrap sec-tight">
        {/* O-3: simple view folds the water block. Same rule as every other crop page. */}
        <Detail bare label="Water use and irrigation for this crop">
          <WaterRequirement cropKey="wheat" cropName="wheat" />
        </Detail>
      </section>

      {/* O-21/O-25: what reaches the crop, why, and what to do about it. */}
      <section className="wrap sec-tight">
        <LossLadder slug="wheat" compact />
      </section>

      {/* 06. REMOVED by Tahir's ruling, 11 Sep 2026. See the note in CropPage.tsx. */}

      {/* 07. Reflective rather than urgent, so it sits below the things a farmer acts on today. */}
      {/* Tahir 7 Nov 2026 (CR-1): was "In VAN’s model estimate for wheat, nutrition accounts for about 1/4 of the yield." */}
      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Farm discipline simulator</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Check which farm practices are lowering your yield</h2>
            {/* L1 7 Nov 2026 (crops-b M1): 1 name for the tool. Was "The VAN simulator shows ... In the farm discipline simulator, you set ...". */}
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>The sections above cover nutrition and water. Yield depends on doing every task on time: sowing date, seed and plant population, fertiliser at the right stage, irrigation on schedule, and control of weeds, pests and disease. Crop nutrition is 1 of these tasks. A task missed at its time can cost yield that extra work later may not recover. VAN’s farm discipline simulator shows how each task, and its timing, changes the yield. In it, you set a yield target and score how the whole season was managed, including sowing time, irrigation timing and seed quality, to see which practices are lowering your yield.</p>
          </div>
          <a className="btn btn-gold btn-lg" href="#/simulator/wheat">Open the simulator →</a>
        </div>
      </section>

      {/* ── 08 · EVERYTHING ELSE ──────────────────────────────────────────────────────────────
          Argument, evidence and background. Folded in Plain mode, never removed. Nothing a farmer
          needs in order to act safely is inside a <Detail>. The cautions and the source notes stay
          below, outside them. */}

      <Detail label="The 5 stages in detail: growing degree days, days after sowing and calendar dates">
        <section className="wrap sec" id="walk">
          <SectionHead eyebrow="The 5 stages" title="Timing and products for each stage." lead="For each stage, the panel below shows the growing degree days, the days after sowing, the calendar dates for 3 sowing dates, and the products the published plan applies at that stage, per acre." />
          <StageWalk />
          <p className="cap mt-4">{WHEAT.tableNote}</p>
        </section>

        <section className="wrap sec-tight" id="gdd">
          <SectionHead eyebrow="The 5 stages, in 1 table" title="Growing degree days, days after sowing and calendar dates for 3 sowing dates, for a normal season at Lahore." lead="This table shows the same 5 stages as the stage-by-stage panel above, in a single view." tone="navy" />
          <div className="panel overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Stage</th><th className="r">Growing degree days (GDD, base 10 °C)</th><th className="r">Days after sowing (DAS), for a 1 November sowing</th><th>Sown 20 Oct · normal</th><th>Sown 1 Nov · late in the normal window</th><th>Sown 20 Nov · late</th><th>Key events</th></tr></thead>
              <tbody>{WHEAT.gdd.map((g, i) => <tr key={g.stage} className={`st-${i}`}><td className="font-bold whitespace-nowrap" style={{ color: 'var(--st-text, var(--st))' }}>{i + 1} · {g.stage}</td><td className="r num whitespace-nowrap">{g.gdd}</td><td className="r num whitespace-nowrap">{g.das}</td><td className="num whitespace-nowrap">{g.oct20}</td><td className="num whitespace-nowrap">{g.nov1}</td><td className="num whitespace-nowrap">{g.nov20}</td><td className="small" style={{ minWidth: 300 }}>{g.events}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="cap mt-3">{WHEAT.gddNote}</p>
        </section>
      </Detail>

      <Detail label="Nutrient deficiency symptoms and how to recognise them">
        <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap">
          {/* L1 7 Nov 2026 (crops-b m22): "These descriptions give the usual symptoms", was "follow the usual symptoms". */}
          <SectionHead eyebrow="Deficiency symptoms in Punjab" title="Nutrient deficiency symptoms in wheat." lead="These descriptions give the usual symptoms of nutrient deficiency in wheat on alkaline soils such as Punjab’s. Symptoms get worse quickly when the crop is also under stress from drought, high pH or cold. Once a deficiency is identified, it can be treated with a foliar spray or through fertigation; the earlier it is treated, the more of it can be corrected." tone="navy" />
          <FlipCards />
        </div></section>
      </Detail>

      <Detail label="What each application method means">
        <section className="wrap sec"><MethodsStrip /></section>
      </Detail>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Read this before you buy" title="The limits of this plan." tone="soil" />
        <div className="grid md:grid-cols-2 gap-4">
          {WHEAT.notTell.map(t => <p key={t} className="panel p-5">{t}</p>)}
          <p className="panel p-5">VAN can prepare a plan for your own farm from your soil analysis, your yield target and the other conditions of your field that affect how much fertiliser to apply.</p>
          <p className="panel p-5">Sources: VAN’s published wheat plan (<a href={pdf} target="_blank" rel="noopener">PDF</a>) and the Nutrition creator for wheat.</p>
        </div>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A plan for your own field</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Ask for a plan for your own field on WhatsApp, or write to {CONTACT.cropEmail}</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Send your soil analysis, your yield target and your district. VAN’s agronomy team then builds a plan for your field rather than for a typical one.</p>
          </div>
          <div className="grid gap-3">
            <WaButton href={WA.farmer} lg>Ask on WhatsApp</WaButton>
            <a className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`mailto:${CONTACT.cropEmail}?subject=${encodeURIComponent('Wheat plan for my field')}`}>{CONTACT.cropEmail}</a>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} onClick={() => setAskOpen(o => !o)} aria-expanded={askOpen}>
              {askOpen ? 'Close the form' : 'Or leave your details here'}
            </button>
          </div>
        </div>
        {askOpen && (
          <div className="mt-3">
            <VanForm form="farmer-plan" fields={FARMER_FORM} initial={{ crop: 'Wheat' }}
              intro="Hello VAN. I would like a nutrition plan for my field."
              submitLabel="Send my details" to={CONTACT.cropEmail} subject="Wheat plan for my field"
              success="A member of VAN’s agronomy team will call you back. If you have a soil report, send a photograph of it to the WhatsApp number above, and the plan will be built on your own soil rather than on a district average."
              compact />
          </div>
        )}
      </section>
    </div>
  )
}
