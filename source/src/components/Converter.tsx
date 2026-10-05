import { useMemo, useState } from 'react'
import { MASTER_PRODUCTS } from '@/data/pricing'
import { NUTRIENT_LABELS, nutrientKey } from '@/lib/planCalc'
import { PackShot } from './bits'

/**
 * UNIT & NUTRIENT CONVERTER — built 8 Sep 2026.
 *
 * Three things a Pakistani farmer or dealer works out on paper every week, and nothing on the site
 * did for them: land in the unit their patwari uses, yield in maunds against tonnes per hectare, and
 * what is actually inside a bag.
 *
 * The area and weight factors are exact definitions, not estimates:
 *   1 acre = 4,046.856 m² = 0.404686 ha · 1 acre = 8 kanal = 160 marla
 *   1 maund (Pakistan) = 40 kg
 * The nutrient tab is not a conversion at all — it reads VAN's own registered analyses, so the
 * kilograms it returns are the guaranteed figures off the label multiplied by the pack size.
 */
const AREA: [string, number][] = [['Acre', 1], ['Hectare', 2.471054], ['Kanal', 0.125], ['Marla', 0.00625], ['Murabba (25 acres)', 25]]
const WEIGHT: [string, number][] = [['Kilogram', 1], ['Maund (40 kg)', 40], ['Tonne', 1000], ['50 kg bag', 50], ['25 kg bag', 25]]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1"><span className="cap font-bold uppercase tracking-[.06em]">{label}</span>{children}</label>
}

export function Converter() {
  const [tab, setTab] = useState<'area' | 'weight' | 'bag'>('area')

  const [areaVal, setAreaVal] = useState('1')
  const [areaUnit, setAreaUnit] = useState('Acre')
  const acres = (Number(areaVal) || 0) * (AREA.find(a => a[0] === areaUnit)?.[1] ?? 1)

  const [wVal, setWVal] = useState('1')
  const [wUnit, setWUnit] = useState('Maund (40 kg)')
  const kg = (Number(wVal) || 0) * (WEIGHT.find(a => a[0] === wUnit)?.[1] ?? 1)

  const [slug, setSlug] = useState('vital-urea')
  const [bags, setBags] = useState('1')
  const product = useMemo(() => MASTER_PRODUCTS.find(p => p.slug === slug), [slug])
  const nutrients = useMemo(() => {
    if (!product) return []
    const n = Number(bags) || 0
    return Object.entries(product.analysisPct)
      .map(([k, pct]) => [k, (product.packKg * n * (pct as number)) / 100] as [string, number])
      .filter(([, v]) => v > 0.001)
  }, [product, bags])

  const TABS: [typeof tab, string][] = [['area', 'Land'], ['weight', 'Weight & yield'], ['bag', "What's in the bag"]]

  return (
    <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map(([t, l]) => (
          <button key={t} className={`chip chip-sm ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)} aria-pressed={tab === t}>{l}</button>
        ))}
      </div>

      {tab === 'area' && (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="You have"><input className="input num" style={{ width: 110 }} value={areaVal} onChange={e => setAreaVal(e.target.value)} inputMode="decimal" aria-label="Land amount" /></Field>
            <Field label="Unit"><select className="input" value={areaUnit} onChange={e => setAreaUnit(e.target.value)} aria-label="Land unit">{AREA.map(([n]) => <option key={n}>{n}</option>)}</select></Field>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[['Acres', acres], ['Hectares', acres / 2.471054], ['Kanal', acres * 8], ['Marla', acres * 160]].map(([l, v]) => (
              <div key={l as string} className="panel-soft p-4"><div className="num text-[26px]" style={{ color: 'var(--navy)' }}>{(v as number).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div><div className="cap mt-1">{l as string}</div></div>
            ))}
          </div>
          <p className="cap">1 acre = 8 kanal = 160 marla = 0.404686 hectare. Exact definitions, not rounded.</p>
        </div>
      )}

      {tab === 'weight' && (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="You have"><input className="input num" style={{ width: 110 }} value={wVal} onChange={e => setWVal(e.target.value)} inputMode="decimal" aria-label="Weight amount" /></Field>
            <Field label="Unit"><select className="input" value={wUnit} onChange={e => setWUnit(e.target.value)} aria-label="Weight unit">{WEIGHT.map(([n]) => <option key={n}>{n}</option>)}</select></Field>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[['Kilograms', kg], ['Maunds', kg / 40], ['Tonnes', kg / 1000], ['50 kg bags', kg / 50]].map(([l, v]) => (
              <div key={l as string} className="panel-soft p-4"><div className="num text-[26px]" style={{ color: 'var(--navy)' }}>{(v as number).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div><div className="cap mt-1">{l as string}</div></div>
            ))}
          </div>
          <div className="panel-soft p-4">
            <div className="cap font-bold uppercase tracking-[.06em] mb-1">As a yield</div>
            <p className="small">{(kg / 40).toLocaleString(undefined, { maximumFractionDigits: 1 })} maunds per acre is <b>{(kg / 1000 * 2.471054).toLocaleString(undefined, { maximumFractionDigits: 2 })} tonnes per hectare</b>. The unit most published research uses.</p>
          </div>
        </div>
      )}

      {tab === 'bag' && (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Product"><select className="input" value={slug} onChange={e => setSlug(e.target.value)} aria-label="Product" style={{ minWidth: 200 }}>{MASTER_PRODUCTS.filter(p => p.slug).map(p => <option key={p.slug!} value={p.slug!}>{p.product}</option>)}</select></Field>
            <Field label="How many packs"><input className="input num" style={{ width: 90 }} value={bags} onChange={e => setBags(e.target.value)} inputMode="decimal" aria-label="Number of packs" /></Field>
          </div>
          {product && (
            <div className="grid lg:grid-cols-[auto_1fr] gap-5 items-start">
              <div style={{ width: 90 }}><PackShot slug={product.slug} style={{ maxHeight: 120, width: 'auto' }} /></div>
              <div className="grid gap-3">
                <div className="cap">{product.packKg} {product.packUnit ?? 'kg'} pack · {(Number(bags) || 0) * product.packKg} {product.packUnit ?? 'kg'} in total{product.packUnit === 'L' && <> · liquid, declared % w/v, so one litre carries the stated percentage in grams per 100 ml</>}</div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nutrients.map(([k, v]) => (
                    <div key={k} className="panel-soft p-4">
                      <div className="num text-[24px]" style={{ color: 'var(--navy)' }}>{v.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</div>
                      <div className="cap mt-1">{NUTRIENT_LABELS[k] ?? k} <span style={{ opacity: .7 }}>({nutrientKey(k)})</span></div>
                    </div>
                  ))}
                </div>
                <p className="cap">Read off the registered guaranteed analysis for this product, multiplied by the pack size. Phosphorus and potash are given as oxide (P₂O₅, K₂O), the way a fertilizer label states them.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
