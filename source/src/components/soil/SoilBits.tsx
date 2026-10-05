import { SOIL } from '@/data/soil'
import { SOIL_SOURCE, SOIL_ANALYTES, SOIL_MISSING, SOIL_MECHANISMS, SOIL_COPY, PRODUCT_SOIL, SOIL_HEADLINE, SOIL_BELIEF } from '@/data/soilLens'
import type { Product } from '@/data/catalogue'
import { useInView, useCountUp } from '@/hooks/useInView'
import { PackShot, productBySlug, DrawnBag } from '@/components/bits'
import { thousands, textureTotal } from '@/lib/soil'

/** The source line every soil figure carries. */
export function SoilSource({ extra }: { extra?: string }) {
  return <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. {extra} <a href="#/soil#caveats">Read this before quoting ›</a></p>
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

/** The five headline tiles — counted up on scroll-in; values read from SOIL.province, printed to the same precision as SOIL_HEADLINE. */
export function HeadlineTiles({ compact = false }: { compact?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.3 })
  const P = SOIL.province
  const ph = useCountUp(P.ph ?? 0, inView, 1400, 2)
  const gt75 = useCountUp(P.ph_gt75 ?? 0, inView, 1400, 1)
  const om = useCountUp(P.om ?? 0, inView, 1400, 2)
  const p15 = useCountUp(P.p_lt15 ?? 0, inView, 1400, 1)
  const tiles: [string, string, string, string][] = [
    [ph.toFixed(2), 'mean pH', 'province-weighted, all 770,160 samples', 'rust'],
    [`${gt75.toFixed(1)}%`, 'above pH 7.5', `${SOIL_HEADLINE.aboveEight} above 8.0 · ${SOIL_HEADLINE.aboveEightFive} above 8.5`, 'rust'],
    [`${om.toFixed(2)}%`, 'mean organic matter', `${SOIL_HEADLINE.omLow} below the 0.86% threshold`, 'soil'],
    [`${p15.toFixed(1)}%`, 'below adequate phosphorus', `below 15 ppm · ${SOIL_HEADLINE.pLow} below 7 ppm`, 'navy'],
    [SOIL_HEADLINE.sulfurTested, 'samples tested for sulfur', 'not in any district file, in any column', 'rust'],
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
    'Texture class': loam ? `loam · ${((loam.n / texN) * 100).toFixed(1)}% of texture-tested samples` : 'class',
    Copper: `${(P.cu ?? 0).toFixed(2)} ppm`, Iron: `${(P.fe ?? 0).toFixed(2)} ppm`, Manganese: `${(P.mn ?? 0).toFixed(2)} ppm`,
  }
  return (
    <div ref={ref} className={`panel p-5 ${inView ? 'on' : ''}`}>
      <div className="flex items-baseline justify-between gap-3"><h4>The 13 determinations, and the one that is missing.</h4><span className="cap">province means</span></div>
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
          <span className="val" style={{ color: 'var(--rust)' }}>not determined</span>
        </div>
      </div>
      <div className="panel-rust p-4 mt-4">
        <div className="font-bold" style={{ color: 'var(--rust-text)' }}>{SOIL_MISSING.title}</div>
        <p className="small mt-1">{SOIL_MISSING.text}</p>
        <p className="small mt-2 font-semibold">{SOIL_MISSING.vanLine}</p>
      </div>
      <SoilSource extra={`Copper, iron, manganese and saturation percentage are province means from the same module. Texture is the share of the commonest recorded class, out of the ${thousands(texN)} samples that carry a texture class at all; ${thousands(P.n - texN)} of the ${thousands(P.n)} do not, and are not counted either way.`} />
    </div>
  )
}

function Shot({ slug }: { slug: string }) {
  const p = productBySlug(slug)
  if (!p) return null
  return (
    <a href={`#/products/${slug}`} className="no-underline flex flex-col items-center gap-1" style={{ width: 84 }} title={p.name}>
      <div style={{ height: 96, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>{p.family ? <div className="flex items-end gap-1"><DrawnBag label="6-32" width={26} /><DrawnBag label="5-40" width={30} /><DrawnBag label="8-38" width={26} /></div> : <PackShot slug={slug} style={{ maxHeight: 92, width: 'auto' }} />}</div>
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
            <div className="cap mt-1">the condition · from the survey</div>
          </div>
          <div>
            <blockquote className="m-0 pl-4" style={{ borderLeft: '3px solid var(--gold)' }}>
              <p className="small" style={{ fontStyle: 'italic' }}>“{m.copy}”</p>
              <p className="cap mt-1">From {m.from}</p>
            </blockquote>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">{m.products.map(s => <Shot key={s} slug={s} />)}</div>
        </article>
      ))}
      <p className="cap">{SOIL_COPY.builtLead} Condition figures: {SOIL_SOURCE.short}.</p>
    </div>
  )
}

/** Method & caveats — reachable from every soil view as "Read this before quoting". */
export function SoilCaveats() {
  return (
    <div id="caveats" className="panel p-5 lg:p-7" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <span className="eyebrow navy">Read this before quoting</span>
      <h3>Method &amp; caveats</h3>
      <p className="small mt-3">{SOIL_SOURCE.long}</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {SOIL_SOURCE.caveats.map(([h, t]) => <div key={h} className="panel-soft p-4"><div className="font-bold">{h}</div><p className="small muted mt-1">{t}</p></div>)}
      </div>
      <p className="cap mt-4"><b>Bounds and repairs, as recorded in the module.</b> {SOIL.meta.source}</p>
      <p className="cap mt-2"><b>Thresholds.</b> {SOIL.meta.thresholds}</p>
      <p className="cap mt-2">{thousands(SOIL.province.n)} valid samples across {SOIL.districts.length} districts. Analytes determined: {SOIL.analytes.join(' · ')}. Not determined: {SOIL.not_determined.join(', ')}.</p>
    </div>
  )
}

/** "What the soil does to this" — the strip on every product page. */
export function ProductSoilStrip({ product }: { product: Product }) {
  const s = PRODUCT_SOIL[product.cat]
  if (!s) return null
  const href = s.relation ? `#/soil?rel=${s.relation}` : '#/soil'
  return (
    <div className="soil-strip">
      <div className="min-w-0">
        <div className="cap uppercase tracking-[.1em] font-bold" style={{ color: 'var(--soil)' }}>What the soil does to this</div>
        <div className="num mt-1" style={{ fontSize: 'clamp(17px, 1.6vw, 21px)', color: 'var(--navy)', lineHeight: 1.2 }}>{s.figure}</div>
      </div>
      <a className="btn btn-sm btn-navy" href={href}>See it on the map →</a>
      <div className="min-w-0" style={{ gridColumn: '1 / -1' }}>
        <p className="small">{s.line.charAt(0).toUpperCase() + s.line.slice(1)}.</p>
        <p className="cap mt-1">{SOIL_SOURCE.short}. The figure describes the soil. It is not a claim for the product.</p>
      </div>
    </div>
  )
}

