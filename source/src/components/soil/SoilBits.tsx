import { SOIL } from '@/data/soil'
import { SOIL_SOURCE, SOIL_ANALYTES, SOIL_MISSING, SOIL_MECHANISMS, PRODUCT_SOIL, SOIL_HEADLINE, SOIL_BELIEF } from '@/data/soilLens'
import type { Product } from '@/data/catalogue'
import { useInView, useCountUp } from '@/hooks/useInView'
import { PackShot, productBySlug, FamilyShot } from '@/components/bits'
import { thousands, textureTotal } from '@/lib/soil'

/** The source line every soil figure carries. */
export function SoilSource({ extra }: { extra?: string }) {
  return <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. {extra}</p>
}

/**
 * THE BELIEF, AND THE EVIDENCE UNDER IT — 10 September 2026.
 *
 * Tahir wanted the page to open with something true about soil rather than a statistic, and then
 * wanted that statement to behave like an action rather than a slogan. So the line is one sentence
 * and the eight things beneath it are all places to go: five products, one knowledge page, the crop
 * plans, and the district matrix further down this same page.
 *
 * A statement nobody can click is a poster. A statement where every word underneath opens something
 * VAN already sells is a claim that has to survive being checked, which is the only kind this site
 * makes.
 */
export function SoilBelief() {
  return (
    <div className="belief">
      <p className="belief-line">{SOIL_BELIEF.line}</p>
      <p className="cap belief-sub">{SOIL_BELIEF.sub}</p>
      <div className="belief-grid">
        {SOIL_BELIEF.items.map(([label, note, href]) => (
          <a key={label} href={href} className="belief-item">
            <b>{label}</b>
            <span className="cap">{note}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
/** The five headline tiles — counted up on scroll-in; values read from SOIL.province, printed to the same precision as SOIL_HEADLINE. */
export function HeadlineTiles({ compact = false }: { compact?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.3 })
  const P = SOIL.province
  const ph = useCountUp(P.ph ?? 0, inView, 1400, 2)
  const gt75 = useCountUp(P.ph_gt75 ?? 0, inView, 1400, 1)
  const om = useCountUp(P.om ?? 0, inView, 1400, 2)
  const p15 = useCountUp(P.p_lt15 ?? 0, inView, 1400, 1)
  const tiles: [string, string, string, string][] = [
    [ph.toFixed(2), 'mean pH', 'all 770,160 samples, weighted by the number of samples in each district', 'rust'],
    [`${gt75.toFixed(1)}%`, 'above pH 7.5', `${SOIL_HEADLINE.aboveEight} above 8.0 · ${SOIL_HEADLINE.aboveEightFive} above 8.5`, 'rust'],
    [`${om.toFixed(2)}%`, 'mean organic matter', `${SOIL_HEADLINE.omLow} of samples below 0.86%, Punjab’s threshold for low organic matter` /* Tahir 7 Nov 2026 (KN-9): was '..., Punjab’s working threshold' */, 'soil'],
    [`${p15.toFixed(1)}%`, 'below adequate available phosphorus', `of samples below 15 parts per million (ppm), the adequate level · ${SOIL_HEADLINE.pLow} below 7 ppm, the deficiency threshold` /* L1 editor 7 Nov 2026 (whyshift m6): ppm written out at first use; tile used only on the national page */, 'navy'],
    [SOIL_HEADLINE.sulfurTested, 'samples tested for sulfur', 'not tested in the Punjab survey', 'rust'],
  ]
  const col = (t: string) => (t === 'rust' ? 'var(--rust)' : t === 'soil' ? 'var(--soil)' : 'var(--navy)')
  return (
    <div ref={ref} className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 ${compact ? '' : ''}`}>
      {tiles.map(([v, l, s, t], i) => (
        <div key={l} className="panel p-4" style={i === 4 ? { borderColor: 'var(--rust)', borderWidth: 2, borderStyle: 'dashed' } : undefined}>
          <div className="num nowrap" style={{ fontSize: compact ? 'clamp(26px, 2.4vw, 34px)' : 'clamp(28px, 2.8vw, 40px)', color: col(t), lineHeight: 1 }}>{v}</div>
          <div className="font-bold mt-2" style={{ fontSize: 14 }}>{l}</div>
          {!compact && <div className="cap mt-1">{s}</div>}
        </div>
      ))}
    </div>
  )
}

/** The 13 determinations as a checklist column — and the 14th row, sulfur, appearing last with a pause. */
export function AnalyteList() {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const P = SOIL.province
  const loam = SOIL.province_texture['loam']
  // 11 Sep 2026 · this used to divide by P.n (every pH-valid sample) while the texture panel lower
  // down divided by texture-classified samples, so the same figure printed as 77.5% here and 78.8%
  // there. Tahir ruled on the texture-classified denominator. See textureTotal in lib/soil.ts.
  const texN = textureTotal(SOIL.province_texture)
  // Values for the rows whose lens string carries only a unit come from SOIL.province (the same module).
  const fill: Record<string, string> = {
    'Saturation percentage': `${(P.sat ?? 0).toFixed(1)}%`,
    'Texture class': loam ? `loam · ${((loam.n / texN) * 100).toFixed(1)}% of the samples that have a recorded texture class` : 'class',
    Copper: `${(P.cu ?? 0).toFixed(2)} ppm`, Iron: `${(P.fe ?? 0).toFixed(2)} ppm`, Manganese: `${(P.mn ?? 0).toFixed(2)} ppm`,
  }
  return (
    <div ref={ref} className={`panel p-5 ${inView ? 'on' : ''}`}>
      <div className="flex items-baseline justify-between gap-3"><h4>The 13 soil tests in the survey, and sulfur, which was not tested</h4><span className="cap">province means</span></div>
      <div className="mt-2">
        {SOIL_ANALYTES.map(([name, v], i) => (
          <div key={name} className="an-row" style={{ transitionDelay: `${i * 110}ms` }}>
            <span className="box" aria-hidden="true">✓</span>
            <span className="name font-semibold">{name}</span>
            <span className="val">{fill[name] ?? v}</span>
          </div>
        ))}
        <div className="an-row missing" style={{ transitionDelay: `${SOIL_ANALYTES.length * 110 + 900}ms` }}>
          <span className="box" aria-hidden="true">·</span>
          <span className="name font-bold">Sulfur</span>
          <span className="val" style={{ color: 'var(--rust)' }}>not tested</span>
        </div>
      </div>
      <div className="panel-rust p-4 mt-4">
        <div className="font-bold" style={{ color: 'var(--rust-text)' }}>{SOIL_MISSING.title}</div>
        <p className="small mt-1">{SOIL_MISSING.text}</p>
        <p className="small mt-2 font-semibold">{SOIL_MISSING.vanLine}</p>
      </div>
      <SoilSource extra={`Copper, iron, manganese and saturation percentage are province means from the same survey. Texture is the share of the most common recorded class among the ${thousands(texN)} samples that have a texture class; the other ${thousands(P.n - texN)} of the ${thousands(P.n)} samples have none and are not counted.`} />
    </div>
  )
}

function Shot({ slug }: { slug: string }) {
  const p = productBySlug(slug)
  if (!p) return null
  return (
    <a href={`#/products/${slug}`} className="no-underline flex flex-col items-center gap-1" style={{ width: 84 }} title={p.name}>
      <div style={{ height: 96, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>{p.family ? <FamilyShot max={84} /> : <PackShot slug={slug} style={{ maxHeight: 92, width: 'auto' }} />}</div>
      <span className="cap text-center leading-tight" style={{ fontSize: 11.5, color: 'var(--navy)', fontWeight: 600 }}>{p.name}</span>
    </a>
  )
}

/** What VAN builds against it — condition figure · VAN's own published mechanism sentence, with its source · the packs. */
export function BuiltAgainst() {
  return (
    <div className="grid gap-3">
      {SOIL_MECHANISMS.map((m, i) => (
        <article key={m.nutrient} className="panel p-4 lg:p-5 grid lg:grid-cols-[180px_1fr_auto] gap-4 lg:gap-6 items-center" style={{ borderLeft: `6px solid ${m.nutrient === 'Sulfur' ? 'var(--rust)' : 'var(--soil)'}` }}>
          <div>
            <span className="eyebrow soil" style={{ marginBottom: 4 }}>{String(i + 1).padStart(2, '0')} · {m.nutrient}</span>
            <div className="font-bold leading-snug" style={{ fontSize: 15 }}>{m.condition}</div>
            <div className="cap mt-1">condition, from the survey</div>
          </div>
          <div>
            <blockquote className="m-0 pl-4" style={{ borderLeft: '3px solid var(--gold)' }}>
              <p className="small" style={{ fontStyle: 'italic' }}>{m.copy}</p>
              <p className="cap mt-1">{m.from}</p>
            </blockquote>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">{m.products.map(s => <Shot key={s} slug={s} />)}</div>
        </article>
      ))}
      <p className="cap">Condition figures: {SOIL_SOURCE.short}.</p>{/* D-305: the lead above already says the rest */}
    </div>
  )
}

/** Method & caveats — reachable from every soil view as "Read this before quoting". */
export function SoilCaveats() {
  return (
    <div id="caveats" className="panel p-5 lg:p-7" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <span className="eyebrow navy">Read this before quoting</span>
      <h3>Method and limitations</h3>
      <p className="small mt-3">{SOIL_SOURCE.long}</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {SOIL_SOURCE.caveats.map(([h, t]) => <div key={h} className="panel-soft p-4"><div className="font-bold">{h}</div><p className="small muted mt-1">{t}</p></div>)}
      </div>
      <p className="cap mt-4"><b>Limits applied before medians and means were worked out:</b> {((SOIL.meta.source.match(/bounded before averaging \(([^)]*)\)/) ?? [])[1] ?? 'see the source line').replace('CaCO3', 'CaCO₃')}.</p>{/* L1 editor 7 Nov 2026 (m15): subscript 3 */}
      <p className="cap mt-2">{thousands(SOIL.province.n)} valid samples across {SOIL.districts.length} districts. Soil tests: {SOIL.analytes.join(' · ')}. Not tested: {SOIL.not_determined.join(', ')}.</p>
    </div>
  )
}

/**
 * Tahir 7 Nov 2026 (PR-25): a bridge per category, from what the product supplies to the soil figure,
 * with the "not results of this product" limit in the same paragraph. The figures are the same ones
 * PRODUCT_SOIL prints (soilLens.ts). The date wording stays "about 2016 to 2018" (CO-24); PR-25 asked
 * for "2016 to 2018 (approximate dates)", which is open with Tahir.
 */
const SOIL_BRIDGE: Record<string, { supplies: string; finding: string }> = {
  N: { supplies: 'supplies nitrogen', finding: '69.1% of samples were above pH 8' },
  P: { supplies: 'supplies phosphorus', finding: '97.9% of samples had less than 15 ppm of available phosphorus. A soil needs at least 15 ppm to be counted as adequate in phosphorus. The mean calcium carbonate (lime) content of the samples was 6.53%' },   // L1 editor 10 Nov 2026 (M4): 1 finding per sentence, 15 ppm stated as the adequate level. Was '... less than 15 ppm of available phosphorus, the level counted as adequate, and the mean calcium carbonate (lime) content was 6.53%'
  K: { supplies: 'supplies potassium', finding: '87.8% of samples had less than 180 ppm of available potassium, the level that Punjab soil laboratories treat as adequate' },
  // L1 7 Nov 2026 (m5): the 2 adequate levels named, as on the P and K pages.
  NPK: { supplies: 'supplies nitrogen, phosphorus and potassium', finding: '87.8% of samples had less than 180 ppm of available potassium, and 97.9% had less than 15 ppm of available phosphorus, the levels that Punjab soil laboratories treat as adequate' },
  MICRO: { supplies: 'supplies micronutrients', finding: '59.0% of samples had less than 1.0 ppm of available zinc, and 51.7% had less than 0.5 ppm of available boron' },
  SEC: { supplies: 'supplies secondary nutrients', finding: 'none of the 770,160 samples was tested for sulfur' },
  BIO: { supplies: 'is 1 of VAN’s soil health and biological products', finding: '90.2% of samples had less than 0.86% organic matter, and the mean of all samples was 0.61%' },
}

/**
 * L1 editor round, 7 Nov 2026 (M1, m3, m4, m5): where a product does not supply the nutrient its category
 * figure is about, the strip names what the product supplies (from its declared analysis) and gives only
 * the figure for that nutrient. Figures are the same survey figures as SOIL_BRIDGE (boron 51.7% below
 * 0.5 ppm, zinc 59.0% below 1.0 ppm). `noLine` drops the category line under the bridge where it is about
 * another nutrient (sulfur on Cala-Mag V and V-Mag Essential, zinc on VL-Boron) or repeats the bridge
 * (sulfur on Green Sulfur). `noLimit` drops "These are historical measurements ..." where nothing was measured.
 * Was: Cala-Mag V and V-Mag Essential 'supplies secondary nutrients ... none of the 770,160 samples was
 * tested for sulfur'; the 4 micronutrient pages gave both the zinc and the boron figure.
 */
const SOIL_BRIDGE_BY_SLUG: Record<string, { supplies: string; finding: string; noLine?: boolean; noLimit?: boolean; plainLink?: boolean }> = {
  'cala-mag-v': { supplies: 'supplies calcium, magnesium, nitrogen and boron', finding: '51.7% of samples had less than 0.5 ppm of available boron', noLine: true },
  'v-mag-essential': { supplies: 'supplies magnesium and boron', finding: '51.7% of samples had less than 0.5 ppm of available boron', noLine: true },
  'green-sulfur': { supplies: 'supplies sulfur', finding: 'none of the 770,160 samples was tested for sulfur, so these tests cannot show whether the soil needs it', noLine: true, noLimit: true },
  'v-boron': { supplies: 'supplies boron', finding: '51.7% of samples had less than 0.5 ppm of available boron', noLine: true, plainLink: true },
  'v-zinc': { supplies: 'supplies zinc', finding: '59.0% of samples had less than 1.0 ppm of available zinc' },
  'v-transform': { supplies: 'supplies zinc', finding: '59.0% of samples had less than 1.0 ppm of available zinc' },
  'vl-micro-mix': { supplies: 'supplies zinc, iron, manganese and copper', finding: '59.0% of samples had less than 1.0 ppm of available zinc' },
}

/** "What the soil does to this" — the strip on every product page. */
export function ProductSoilStrip({ product }: { product: Product }) {
  const s = PRODUCT_SOIL[product.cat]
  const b = SOIL_BRIDGE_BY_SLUG[product.slug] ?? SOIL_BRIDGE[product.cat]
  if (!s || !b) return null
  const o = SOIL_BRIDGE_BY_SLUG[product.slug]
  const href = s.relation && !o?.plainLink ? `#/soil?rel=${s.relation}` : '#/soil'
  const name = `${product.family ? 'The ' : ''}${product.name}`
  return (
    <div className="soil-strip">
      <div className="min-w-0">
        <div className="cap uppercase tracking-[.1em] font-bold" style={{ color: 'var(--soil)' }}>Punjab soil tests, about 2016 to 2018</div>
        <p className="small mt-1">{name} {b.supplies}. In Punjab soil tests from about 2016 to 2018, {b.finding}.{o?.noLimit ? null : <> These are historical measurements of Punjab’s soil, not results of {product.family ? 'the ' : ''}{product.name}.</>}</p>
      </div>
      <a className="btn btn-sm btn-navy" href={href}>See the Punjab soil data in the Soil Atlas →</a>
      <div className="min-w-0" style={{ gridColumn: '1 / -1' }}>
        {!o?.noLine && <p className="small">{s.line.charAt(0).toUpperCase() + s.line.slice(1)}.</p>}
        <p className={o?.noLine ? 'cap' : 'cap mt-1'}>Source: Punjab soil testing programme, 770,160 valid samples from 36 districts.</p>
      </div>
    </div>
  )
}

