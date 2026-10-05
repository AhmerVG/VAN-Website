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
import { SowingDate } from '@/components/SowingDate'
import { NutrientBalance } from '@/components/NutrientBalance'
import { WaterRequirement } from '@/components/WaterRequirement'
import { LossLadder } from '@/components/LossLadder'
import { CropNow } from '@/components/CropNow'
// import { StandingCrop } from '@/components/StandingCrop'  // block 06, removed 11 Sep 2026
import { Detail } from '@/components/Detail'
import { VanForm } from '@/components/VanForm'
import { FARMER_FORM } from '@/data/formSpecs'
import { SectionHead, WaButton } from '@/components/bits'

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
export default function Wheat() {
  usePhonePlainDefault()   // D-199
  const [askOpen, setAskOpen] = useState(false)
  const pdf = `https://www.van.com.pk/${WHEAT.pdf}`
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--gold-soft), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <p className="cap"><a href="#/crops">Crop Plans</a> / Cereals & field crops / Wheat</p>
          <span className="eyebrow gold mt-2">Crop programme</span>
          <h1>{WHEAT.h1}</h1>
          <p className="lead mt-4">{WHEAT.lead}</p>
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {WHEAT.meta.map(m => <span key={m} className="tag tag-navy">{m}</span>)}
            <span className="tag tag-sky">Oct–Nov sowing</span><span className="tag tag-green">Zn-K programme</span>
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
        <SectionHead eyebrow="The whole programme at a glance" title="7 bands, 5 stages." lead="The programme matrix. Every band across every stage, per acre, with commodity inputs greyed and every product shown as its real pack." />
        {/* O-3: his ruling. Simple view folds the full stage-by-stage table. Full view is unchanged. */}
        <Detail bare label="The full 5-stage table. 7 bands, every stage">
          <PlanMatrix stages={WHEAT_STAGES} plan={WHEAT_PLAN} tableNote={WHEAT.tableNote} />
        </Detail>
        <p className="cap mt-3">The 5 stages, their growing-degree-days and their days after sowing are in <a href="#gdd">the stage table below</a>. The same published table the block at the top of this page reads to work out where your crop is.</p>
      </section>

      {/* 04. The action. */}
      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap" id="list">
        <SectionHead eyebrow="Your shopping list" title="What to buy for your acres." tone="navy" />
        <ListBuilder />
      </div></section>

      {/* 05. The same numbers, moved by the farmer's own ground. On wheat the soil layer lives
          inside the nutrition creator rather than on the list, so the creator is block 05. */}
      <section className="wrap sec-tight" id="creator">
        <SectionHead eyebrow="Adjust it for your soil" title="The dynamic nutrition creator." lead="Set your acres and every quantity scales with it, then enter your soil report, or pick your district and it fills from the Punjab survey's own median, and the quantities move with what your ground actually shows. Sourced straight from VAN's own wheat calculator, not estimated." tone="navy" />
        <p className="small mb-3 max-w-[140ch]"><b>Which list to use:</b> the acres figure is shared with the shopping list above. The shopping list is the published plan; this list is VAN’s calculator, and it is the one to use if you have a soil report. Where the 2 differ, the totals below show a range.</p>{/* D-151 (A12): was "This is the same programme from VAN’s calculator; use it if you have a soil report." */}
        <NutritionCreator crop="wheat" />
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
        <Detail bare label="How much water this season needs">
          <WaterRequirement cropKey="wheat" cropName="wheat" />
        </Detail>
      </section>

      {/* O-21/O-25: what reaches the crop, why, and what to do about it. */}
      <section className="wrap sec-tight">
        <LossLadder slug="wheat" compact />
      </section>

      {/* 06. REMOVED by Tahir's ruling, 11 Sep 2026. See the note in CropPage.tsx. */}

      {/* 07. Reflective rather than urgent, so it sits below the things a farmer acts on today. */}
      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Nutrition decides about 1/4 of the yield</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">The farm discipline simulator.</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Everything above is the nutrition lever. Set a yield target and score how the season is actually being run, sowing time, irrigation timing, seed quality and more, to see what is really holding yield back.</p>
          </div>
          <a className="btn btn-gold btn-lg" href="#/simulator/wheat">Open the simulator →</a>
        </div>
      </section>

      {/* ── 08 · EVERYTHING ELSE ──────────────────────────────────────────────────────────────
          Argument, evidence and background. Folded in Plain mode, never removed. Nothing a farmer
          needs in order to act safely is inside a <Detail>. The cautions and the source notes stay
          below, outside them. */}

      <Detail label="The 5 stages in detail. Growing-degree-days, days after sowing, and the calendar">
        <section className="wrap sec" id="walk">
          <SectionHead eyebrow="The 5 stages" title="Walk the season, one stage at a time." lead="Each stage shows its growing-degree-days, days after sowing and calendar dates for 3 sowing dates, and the products the published plan puts on at that stage, per acre." />
          <StageWalk />
          <p className="cap mt-4">{WHEAT.tableNote} {WHEAT.gddNote}</p>
        </section>

        <section className="wrap sec-tight" id="gdd">
          <SectionHead eyebrow="The 5 stages, in one table" title="GDD, days after sowing, and the calendar for 3 sowing dates." lead="The same 5 stages the walk above steps through. Laid out so a season can be read in one glance. This is the table the block at the top of the page reads." tone="navy" />
          <div className="panel overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Stage</th><th className="r">GDD (base 10 °C)</th><th className="r">DAS</th><th>Sown Oct 20 · normal</th><th>Sown Nov 1 · late-normal</th><th>Sown Nov 20 · late</th><th>Key events</th></tr></thead>
              <tbody>{WHEAT.gdd.map((g, i) => <tr key={g.stage} className={`st-${i}`}><td className="font-bold whitespace-nowrap" style={{ color: 'var(--st-text, var(--st))' }}>{i + 1} · {g.stage}</td><td className="r num whitespace-nowrap">{g.gdd}</td><td className="r num whitespace-nowrap">{g.das}</td><td className="num whitespace-nowrap">{g.oct20}</td><td className="num whitespace-nowrap">{g.nov1}</td><td className="num whitespace-nowrap">{g.nov20}</td><td className="small" style={{ minWidth: 300 }}>{g.events}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="cap mt-3">{WHEAT.gddNote}</p>
        </section>
      </Detail>

      <Detail label="Nutrient deficiency symptoms. How to read the crop">
        <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap">
          <SectionHead eyebrow="Punjab baseline" title="Nutrient deficiency symptoms." lead="These descriptions are based on standard phenotypes observed in Punjab's alkaline soils. Symptoms progress rapidly under stress (drought, high pH, cold). Identification allows corrective foliar or fertigation intervention." tone="navy" />
          <FlipCards />
        </div></section>
      </Detail>

      <Detail label="What each application method actually means">
        <section className="wrap sec"><MethodsStrip /></section>
      </Detail>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SectionHead eyebrow="Read this before you buy" title="What this plan does not tell you." tone="soil" />
        <div className="grid md:grid-cols-2 gap-4">
          {WHEAT.notTell.map(t => <p key={t} className="panel p-5">{t}</p>)}
          <p className="panel p-5">This programme is indicative. It is built on best practice and on the nutrient requirement of the crop, not on your field. VAN prepares farm-specific plans against a grower's own soil analysis, yield target and the other variables that decide a rate.</p>
          <p className="panel p-5">The products and rates on this page come from VAN’s published wheat plan and from VAN’s own wheat calculator. Where the 2 differ, the page shows a range. Methods and pack sizes are read directly out of the published plan PDF.</p>
        </div>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A plan for your own field</span>
            <h2 className="text-[clamp(28px,2.8vw,38px)]">Ask for one on WhatsApp, or write to {CONTACT.cropEmail}.</h2>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>Send your soil analysis, your yield target and your district. VAN’s agronomy team builds the plan against your field, not a typical one.</p>
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
              success="Somebody from the agronomy team calls you back. If you have a soil report, send a photograph of it on the WhatsApp number above and the plan is built against your own soil rather than a district average."
              compact />
          </div>
        )}
      </section>
    </div>
  )
}
