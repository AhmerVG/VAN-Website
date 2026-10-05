import { useState } from 'react'
import { SOIL_COPY, SOIL_SOURCE } from '@/data/soilLens'
import type { SoilColKey } from '@/lib/soilSeverity'
import type { AnalyteKey } from '@/lib/soil'
import { SoilVitals } from '@/components/soil/SoilVitals'
import { SoilMatrix } from '@/components/soil/SoilMatrix'
import { WA } from '@/data/site'
import { SectionHead, WaButton } from '@/components/bits'
import { SoilMap } from '@/components/soil/SoilMap'
import { Distribution } from '@/components/soil/SoilDistricts'
import { RelationExplorer } from '@/components/soil/SoilRelations'
import { SoilBelief, AnalyteList, BuiltAgainst, SoilCaveats } from '@/components/soil/SoilBits'
import { districtByKey } from '@/lib/soil'
import { SoilLenses, type LensKey } from '@/components/soil/SoilLenses'
import { MyGround } from '@/components/soil/MyGround'
import { SoilReadingPanel } from '@/components/soil/SoilReadingPanel'
import { Lens } from '@/components/Lens'

/** #/soil — the Soil lens: what 770,160 Punjab samples say, and where VAN's own published mechanism sentences meet it. */
export default function Soil({ rel, district }: { rel: string | null; district: string | null }) {
  const [sel, setSel] = useState<string | null>(districtByKey(district) ? district : null)
  // O-20: the lens is a route through the page, not a filter. Null means the page as it always was.
  const [lens, setLens] = useState<LensKey | null>(null)
  /**
   * ONE PARAMETER, READ BY THREE THINGS — 10 Sep 2026. Tahir: "make the panel interactive and linked
   * to data... no static." The vitals tiles, the map and the matrix all read this, and all three can
   * set it, so pressing Potash in the readings redraws the map and lights the potash column.
   * Phosphorus is the opening parameter because he asked the map to open on a nutrient, and because
   * it is the analyte 97.9% of Punjab's samples fail.
   */
  const [param, setParam] = useState<SoilColKey>('p')
  // Iron, copper and manganese are in every district workbook but not in the 0.05-degree grid file,
  // so they have district rows and no map layer. The map holds its last drawable analyte rather than
  // going blank, and the page says why underneath.
  const MAPPABLE: SoilColKey[] = ['ph', 'om', 'p', 'k', 'zn', 'caco3', 'b', 'ec']
  const mapAnalyte = MAPPABLE.includes(param) ? (param as unknown as AnalyteKey) : undefined
  return (
    <div>
      {/* D-180, 26 Sep 2026 · Tahir: "visually interactive first ... may be a map ... then facts. I'm not saying
          to remove anything, but text after." The living map now opens the page, beside how to read it; the
          lead, the 8 answers, the readings and the lenses follow it. Nothing was removed. Revert: the v58 zip. */}
      <section style={{ background: 'linear-gradient(180deg, var(--soil-soft) 0%, var(--sand) 70%)' }}>
        <div className="wrap pt-8 pb-4 lg:pt-10" id="soil-map">
          <span className="eyebrow soil">{SOIL_COPY.kicker} · Punjab</span>
          <h1 className="max-w-[18ch]">{SOIL_COPY.h1}</h1>
          <p className="ab-hero-h2 mt-3" style={{ fontSize: 20, maxWidth: "60ch" }}>{SOIL_COPY.mapH2}</p>
          <p className="cap mt-1">▸ The map plays through 8 readings, then rests on phosphorus. Pick a reading, hover a square for its district and value, tap one to hold that district.</p>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
          <div className="panel p-4 lg:p-5">
            <SoilMap initial="p" analyte={mapAnalyte} onAnalyte={k => setParam(k as SoilColKey)} focus={sel} onPick={k => setSel(k)} maxHeight={640} />
            {!mapAnalyte && <p className="cap mt-2" style={{ color: 'var(--rust)' }}>Iron, copper and manganese are determined in every district workbook but are not in the 0.05° grid file, so they have a row in the matrix below and no layer on this map.</p>}
          </div>
          <div className="grid gap-4 lg:sticky lg:top-24">
            {/* 10 Sep 2026: the heading here was "Alkalinity is the baseline. Carbon is the absence."
                Two mirrored clauses, which is the phrasing Tahir has ruled out for anything a
                Pakistani reader has to decode at speed, and it also described a map that now opens on
                phosphorus rather than pH. Plain statement, nutrients first, in the order the picker
                above puts them. */}
            {/* D-243, 1 Oct 2026: the panel reads whichever reading is on the map. The general text that
                stood here (one panel for all 8 readings) is replaced; revert from the v61.10 zip. */}
            <SoilReadingPanel analyte={mapAnalyte ?? 'p'} district={sel} />
            {sel && <div className="panel p-4 flex items-center gap-3"><span className="font-bold">In focus: {districtByKey(sel)?.name}</span><a className="btn btn-sm btn-ghost ml-auto" href="#/soil#soil-districts">Its distribution ↓</a><button className="btn btn-sm btn-white" onClick={() => setSel(null)}>Show all</button></div>}
          </div>
        </div>
        </div>
      </section>

      <section className="wrap sec-tight">
        <p className="lead max-w-[140ch]">{SOIL_COPY.lead}</p>
        <div className="mt-6"><SoilBelief /></div>
        <div className="mt-7"><SoilVitals district={sel} param={param} onParam={setParam} /></div>
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. Deficiency shares are of samples below Punjab’s working thresholds, not a diagnosis of any field. <a href="#/soil#caveats">Read this before quoting ›</a></p>
        {/* O-20: the lenses. Named by what the reader wants to see, never by who he is. */}
        <div className="mt-8"><SoilLenses value={lens} onChange={setLens} /></div>
        <p className="small muted mt-6">The map: 8 readings, one ground, in 2 groups: the 4 a partner formulates against, and the 4 that describe what those 4 land in. The readings above and the matrix below both drive it.</p>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap" id="soil-districts">
        <div id="soil-matrix" />
        <SectionHead eyebrow="36 districts" title={SOIL_COPY.distH2} lead="Every district a row, every parameter a column, every cell on VAN's own 5-band scale. Sort by a column to see who is worst on it, search for your own, and tap a cell to take that district and that parameter to the map above." tone="navy" />
        <SoilMatrix selected={sel} onSelect={setSel} param={param} onParam={setParam} />
        <div className="mt-5"><Distribution key={sel ?? 'PROVINCE'} selected={sel} /></div>
        {/* O-20: the drill-down below district. The data was already loaded and unreachable. */}
        <div className="mt-4"><MyGround selected={sel} /></div>
      </div></section>

      <section className="wrap sec" id="soil-relations">
        <SectionHead eyebrow="Relations" title={SOIL_COPY.relH2} lead="Pick what to group the samples by and what to read across the groups. Where the evidence page recorded a verdict, it is shown as written. Including the one that does not hold." tone="rust" right={<span className="cap">▸ change X and Y · the chart redraws</span>} />
        <RelationExplorer initialRel={rel} />
      </section>

      {/* D-246: where the 2016-18 soil is heading. From Soil Poverty Series No. 1; model projections, not measurements. */}
      <section className="wrap sec" id="soil-outlook">
        <SectionHead eyebrow="Outlook" title="Where Punjab’s soil potash is heading." lead="A projection from the 2016-18 soil tests, on VAN’s own soil scale. Move the year to see the best, average and worst case." tone="rust" right={<a className="cap" href="#/knowledge/soil-poverty-punjab-potash">Read the report ▸</a>} />
        <Lens label="Punjab soil potash outlook" specs={[{ id: 'outlook' }]} />
      </section>

      <section className="sec" style={{ background: 'var(--sky)' }}><div className="wrap" id="soil-analytes">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
          <div>
            <span className="eyebrow navy">The analyte list</span>
            <h2>13 determinations, and no test for sulfur.</h2>
            <p className="lead mt-4">Every district workbook carries the same 13 columns, and sulfur is not one of them. The nutrient VAN’s programmes place twice in wheat alone was never on the testing schedule.</p>
            <div className="flex flex-wrap gap-2 mt-5"><a className="btn btn-navy btn-sm" href="#/products/green-sulfur">Green Sulfur →</a><a className="btn btn-ghost btn-sm" href="#/products/vital-urea">Vital Urea · S 13% →</a><a className="btn btn-ghost btn-sm" href="#/crops/wheat">The wheat programme →</a></div>
          </div>
          <AnalyteList />
        </div>
      </div></section>

      <section className="wrap sec" id="soil-built">
        <SectionHead eyebrow="VAN and the condition" title={SOIL_COPY.builtH2} lead={SOIL_COPY.builtLead} tone="soil" />
        <BuiltAgainst />
        {/* O-18 / O-22: the soil page used to end here, on a product list. 770,160 samples were spent
            establishing a national condition and then cashed as a catalogue, so a reader from the
            Ministry, from PCPA or from a bank finished the page with nothing to carry away.
            This is soil → national, and it says why it is there rather than "learn more". */}
        <div className="panel p-5 lg:p-6 mt-6 max-w-[140ch]" style={{ borderColor: 'var(--rust)', borderWidth: 2 }}>
          <span className="eyebrow rust">What this ground costs the country</span>
          <h3 className="mt-1 max-w-[30ch]">On this soil, adding more product does not solve the problem.</h3>
          <p className="mt-3">
            Punjab's ground is alkaline and calcareous. <b>96.1% of samples above pH 7.5</b>, mean carbonate 6.53%.
            On that soil, nutrient applied per acre has risen by 68% since 2000 while wheat yield
            rose by 31%. <b>Roughly 1 kg of applied nitrogen in 4 reaches the crop.</b>
          </p>
          <p className="mt-2">
            What changes the outcome is <b>the form the nutrient arrives in and where it is put</b>, not the tonnage.
          </p>
          <a className="btn btn-navy mt-4" href="#/knowledge/why-pakistan-must-shift">The nutrition Pakistan pays for →</a>
        </div>
        {/* D-245, 1 Oct 2026: Tahir's Soil Poverty report reads this Atlas; his ruling links it from here and from Knowledge. */}
        <div className="panel p-5 lg:p-6 mt-4 max-w-[140ch]">
          <span className="eyebrow soil">Soil Poverty Series · No. 1</span>
          <h3 className="mt-1 max-w-[34ch]">Punjab’s soil potash: most model runs cross 100 ppm between 2027 and 2044.</h3>
          <p className="mt-3">A report by Tahir Abbas built on this Atlas: what 5 crops take out of Punjab’s soil each year, what fertilizer, manure and water put back, and when the Punjab average falls below 100 ppm if nothing changes.</p>
          <a className="btn btn-navy mt-4" href="#/knowledge/soil-poverty-punjab-potash">Read the report →</a>
        </div>
      </section>

      <section className="sec" style={{ background: 'var(--sand-2)' }}><div className="wrap">
        <SoilCaveats />
        <div className="panel-navy p-6 lg:p-8 mt-6 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><span className="eyebrow" style={{ color: 'var(--gold)' }}>Your own field</span><h3>A survey mean is not your soil test.</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>These are district means over samples taken c. 2016–2018. For a plan against your own field, VAN works from your soil analysis. Ask on WhatsApp, or send 500 g of soil to Sample Reception.</p></div>
          <div className="grid gap-3"><WaButton href={WA.farmer} lg>Ask for my plan</WaButton><a className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href="#/lab">VAN Lab. Send a sample</a></div>
        </div>
      </div></section>
    </div>
  )
}
