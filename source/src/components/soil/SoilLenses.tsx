import { SOIL_HEADLINE } from '@/data/soilLens'

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
    blurb: '1 province, 770,160 samples, and a single condition underneath all of it.',
    tone: 'rust',
    beats: [
      { to: '#soil-map', title: 'The whole province, one colour at a time', why: 'Switch the analyte and watch the same ground re-colour. On pH almost none of it is green.' },
      { to: '#soil-districts', title: 'Where it is worst, and where it is not', why: '36 districts, sorted by whatever you care about. The spread is wider than the average suggests.' },
      { to: '#soil-relations', title: 'What sits underneath it', why: 'Carbonate drives the alkalinity. That relationship holds cleanly. One that everybody assumes does not.' },
      { to: '#soil-analytes', title: 'What was never measured at all', why: '13 determinations in every district file. Sulfur is in none of them, in any column, at any point.' },
      { to: '#soil-built', title: 'What this does to a bag of fertilizer', why: 'Above pH 8 surface urea leaves as ammonia. Calcareous ground binds phosphate. The same alkalinity locks zinc.' },
    ],
    close: 'This is the ground Pakistan farms on. The country applies more nutrient per acre every year and gets less of it into the crop. The argument, with every source named, is on the national page.',
  },
  {
    key: 'ground',
    label: 'Find my own ground',
    blurb: 'Your district, and then the neighbourhood inside it, because a district average may not describe your field at all.',
    tone: 'soil',
    beats: [
      { to: '#soil-districts', title: 'Start with your district', why: 'Pick it once and everything below reads for that district instead of the province.' },
      { to: '#soil-myground', title: 'Then go one level down', why: 'Your district is not one soil. Its own cells can differ by a full point of pH, and by more than that on zinc.' },
      { to: '#soil-map', title: 'See it on the ground', why: 'Every square is the median of the samples inside it. No boundary file, no interpolation, no smoothing.' },
      { to: '#soil-built', title: 'What that soil does to what you buy', why: 'What your ground specifically does to urea, to phosphate and to zinc, before the root gets near them.' },
    ],
    close: 'A district average is a starting point, not your field. If you have a soil report, the crop pages will build your plan from it. If you do not, VAN Lab will test one for you.',
  },
  {
    key: 'gap',
    label: 'Where is a product needed?',
    blurb: 'A region, its condition, what is already made for it, and where nothing is.',
    tone: 'navy',
    beats: [
      { to: '#soil-districts', title: 'Pick a region and read its condition', why: 'Sort by the analyte you formulate against, and the districts order themselves by need.' },
      { to: '#soil-relations', title: 'Understand what drives it there', why: 'A shortage caused by carbonate fixation needs a different product from one caused by low carbon.' },
      { to: '#soil-analytes', title: 'See what nobody has measured', why: 'Sulfur was never on the schedule. A nutrient that is never measured cannot appear deficient and cannot enter a plan.' },
      { to: '#soil-built', title: 'What VAN already makes against each condition', why: 'Both tiers: the branded range, and the unbranded formulations open for licensing.' },
    ],
    close: 'Where a condition is real and nothing on either tier is shaped for it, that is a gap worth building into. VAN would rather show you that than pretend the range is complete.',
  },
]

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
                {on ? 'Reading this way' : 'Read it this way'}
              </span>
              <span className="display text-[18px]" style={{ color: 'var(--navy)' }}>{l.label}</span>
              <span className="small muted">{l.blurb}</span>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="panel p-5 mt-3" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="eyebrow navy">Your route through the page</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onChange(null)}>Show me everything instead</button>
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
            <a className="btn btn-navy mt-3" href="#/knowledge/why-pakistan-must-shift">The nutrition Pakistan pays for →</a>
          )}
          {active.key === 'ground' && (
            <a className="btn btn-navy mt-3" href="#/lab">Have your own field tested →</a>
          )}
          {active.key === 'gap' && (
            <a className="btn btn-navy mt-3" href="#/partner">What VAN will build with you →</a>
          )}
        </div>
      )}

      <p className="cap mt-3 max-w-[140ch]">
        <b>Punjab, and only Punjab.</b> All {SOIL_HEADLINE.samples} samples come from the province's own 36 district
        workbooks. Sindh, Khyber Pakhtunkhwa and Balochistan were never surveyed at this depth, which is itself
        a finding about how Pakistan knows its own soil. Punjab carries most of the country's cropped area, so
        Punjab's figures carry the national argument, though they are not national figures.
      </p>
    </div>
  )
}
