import { SOIL_HEADLINE } from '@/data/soilLens'
import { KHATA_UR } from '@/data/soilUrdu'

/**
 * THE SOIL LENSES — O-20, 9 September 2026.
 *
 * Tahir: "it should very cleanly and politely let people view from various lens, like it doesn't say
 * POLICY VIEW but it says something which attracts one to look for overall soil health... and at the
 * same time if its farmer, he should be appealed to see his district or one level down... for a
 * partner who wanna develop a regional specific product, he should see whats in it for him in terms
 * of soil. Make it interesting and exciting for everyone and an eye opener. NOT SAYING REWORK, OR
 * REPLACE BUT BUILDING ON IT AS VIEW. LENS. And it clearly walks one through the whole journey and
 * process of exploring and enjoying the facts of data."
 *
 * THE RULE THAT FOLLOWS FROM THAT, and it is the whole design: a lens is named by WHAT THE READER
 * WANTS TO SEE, never by who he is. Nobody clicks "Policy view". A Secretary and a farmer both click
 * "How bad is it, really?" — and the page takes them somewhere different from there.
 *
 * NOTHING IS REMOVED. The map, the 36 districts, the relations chart, the analyte list and the
 * "VAN and the condition" block all stay exactly as they were, in the same order. A lens changes
 * the ROUTE through them and what is said between them. A reader who ignores the lenses gets the
 * page unchanged, top to bottom — which is the "building on it as view" he asked for.
 *
 * The names are his: "How bad is it? · Find my own ground · Where is a product needed?"
 *
 * PUNJAB, NOT PAKISTAN. All 770,160 samples are from 36 Punjab districts. Sindh, KP and Balochistan
 * are not in this survey at all. His ruling: name it Punjab, and say why Punjab carries the national
 * case rather than pretending to be the country.
 */

export type LensKey = 'condition' | 'ground' | 'gap'

type Beat = { to: string; title: string; why: string }

/** `tone` is no longer used on the card (all three are navy now); it is kept because the route
 *  panel and the home-page teasers still read it. */
const LENSES: { key: LensKey; label: string; blurb: string; tone: string; beats: Beat[]; close: string }[] = [
  {
    key: 'condition',
    label: 'How bad is it, really?',
    blurb: 'How widespread each soil problem is across Punjab’s 770,160 samples.',
    tone: 'rust',
    beats: [
      { to: '#soil-map', title: 'See the whole province, 1 soil test at a time', why: 'Switch the soil test and the same squares change colour. On pH, almost no square is green.' },
      { to: '#soil-districts', title: 'See which districts are worst and which are better', why: 'Sort the 36 districts by any soil test. The differences between districts are wider than the provincial median suggests.' },
      { to: '#soil-relations', title: 'See how the soil test results relate to each other', why: 'In the survey, calcium carbonate rises steadily with pH. One widely assumed relationship, between phosphorus and pH, does not appear in the data.' },
      { to: '#soil-analytes', title: 'See what was never measured', why: 'The survey ran 13 soil tests in every district, and sulfur was not one of them.' },
      { to: '#soil-built', title: 'See what this soil does to fertiliser', why: 'Above pH 8, part of the nitrogen from urea on the soil surface is lost to the air as ammonia. Calcareous soil binds phosphate, and the same alkalinity makes zinc unavailable.' },
    ],
    close: 'Punjab has most of Pakistan’s cropped area. Pakistan applies more nutrient per acre every year, and less of it reaches the crop. The national page sets out this argument, with every source named.',
  },
  {
    key: 'ground',
    label: 'Find my own ground',
    blurb: 'See your district and the smaller areas inside it, because a district median may not describe your own field.',
    tone: 'soil',
    beats: [
      { to: '#soil-districts', title: 'Start with your district', why: 'Pick it once, and every section below shows that district instead of the whole province.' },
      { to: '#soil-myground', title: 'Then look inside the district', why: 'The soil varies within a district. Its own grid cells can differ by a full point of pH, and by more than that on zinc.' },
      { to: '#soil-map', title: 'See it on the map', why: 'Find your area on the map and read its colour for each soil test.' },
      { to: '#soil-built', title: 'What your soil does to the fertiliser you buy', why: 'How your soil affects urea, phosphate and zinc before the roots can take them up.' },
    ],
    close: 'A district median is only a starting point for your field. If you have a soil report, the crop pages will build your plan from it. If you do not, VAN Lab will test your soil.',
  },
  {
    key: 'gap',
    label: 'Where is a product needed?',
    blurb: 'For a region, see its soil conditions, the VAN products made for those conditions, and the conditions that no product addresses yet.',
    tone: 'navy',
    beats: [
      { to: '#soil-districts', title: 'Pick a region and read its condition', why: 'Sort by the soil test you are formulating for, and the districts are ranked by need.' },
      { to: '#soil-relations', title: 'Understand the cause in that region', why: 'A shortage caused by carbonate fixation needs a different product from one caused by low organic matter.' },
      { to: '#soil-analytes', title: 'See what was never measured', why: 'Sulfur was never on the testing schedule, so no survey result shows it as short and it cannot enter a plan based on the survey.' },
      { to: '#soil-built', title: 'What VAN already makes for each condition', why: 'Both tiers: VAN’s branded range, and the unbranded formulations available for white labelling or joint development.' } /* D-296, Tahir 22 Oct 2026: licensing is not offered (D-185) */,
    ],
    close: 'Where a soil condition is confirmed and no product on either tier is made for it, there is a case for developing one.',
  },
]

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function SoilLenses({ value, onChange }: { value: LensKey | null; onChange: (k: LensKey | null) => void }) {
  const active = LENSES.find(l => l.key === value) ?? null
  return (
    <div>
      {/* 10 Sep 2026, Tahir: "all 3 should be equal colours and same size". They were rust, soil and
          navy, which made the first one look like the important one and the third like an
          afterthought. Three doors of equal rank now: same colour, same width, same height, numbered
          so it is clear they are three ways in rather than three steps. */}
      <div className="grid md:grid-cols-3 gap-3 items-stretch">
        {LENSES.map((l, i) => {
          const on = value === l.key
          return (
            <button key={l.key} onClick={() => onChange(on ? null : l.key)} aria-pressed={on}
              className="panel p-4 text-left grid gap-1 content-start h-full"
              style={{ borderColor: 'var(--navy)', borderWidth: on ? 2 : 1, background: on ? 'var(--sand-2)' : undefined, borderTop: '4px solid var(--navy)' }}>
              {/* .eyebrow is display:inline-block, so the flex utility class lost to it and the
                  number ran straight into the label: "01READ IT THIS WAY". Set here rather than by
                  adding another class, because the eyebrow rule is used on forty other pages. */}
              <span className="eyebrow navy" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="num" style={{ fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</span>
                {on ? 'Reading the page this way' : 'Read the page this way'}
              </span>
              <span className="display text-[18px]" style={{ color: 'var(--navy)' }}>{l.label}</span>
              {/* Teesra Khata, 18 Oct 2026: lens 02 keeps its English question exactly (11 Sep ruling) and gains Tahir's Urdu line beside it. */}
              {l.key === 'ground' && <span className="urdu" style={{ color: 'var(--navy)', fontSize: 16 }}>{KHATA_UR.lens02}</span>}
              <span className="small muted">{l.blurb}</span>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="panel p-5 mt-3" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="eyebrow navy">Suggested order of sections</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onChange(null)}>Close this guide</button>
          </div>
          <ol className="grid gap-2 mt-3 pl-0 list-none">
            {active.beats.map((b, i) => (
              <li key={b.to + i}>
                <a href={b.to} className="flex gap-3 no-underline items-start panel-soft p-3">
                  <span className="num shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--navy)' }}>{i + 1}</span>
                  <span>
                    <b style={{ color: 'var(--navy)' }}>{b.title}</b>
                    <span className="small muted block">{b.why}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <p className="small mt-3 max-w-[140ch]">{active.close}</p>
          {active.key === 'condition' && (
            <a className="btn btn-navy mt-3" href="#/knowledge/why-pakistan-must-shift">The national figures and their sources →</a>
          )}
          {active.key === 'ground' && (
            <a className="btn btn-navy mt-3" href="#/lab">Have your own field tested →</a>
          )}
          {active.key === 'gap' && (
            <a className="btn btn-navy mt-3" href="#/partner">Develop a product with VAN →</a>
          )}
        </div>
      )}

      <p className="cap mt-3 max-w-[140ch]">
        <b>These figures cover Punjab only.</b> All {SOIL_HEADLINE.samples} samples come from the province’s own 36 district
        workbooks. Sindh, Khyber Pakhtunkhwa and Balochistan have not been surveyed in this detail. Punjab has most of
        Pakistan’s cropped area, so its figures are relevant to the national picture, but they are not national figures.
      </p>
    </div>
  )
}
