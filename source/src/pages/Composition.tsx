import { useState } from 'react'
import { PRODUCTS, type Product } from '@/data/catalogue'
import { MASTER_PRODUCTS } from '@/data/pricing'
import { LIBRARY, FAMILIES } from '@/data/site'
import { LIB_META } from '@/data/libraryMeta'
import { PackShot, lmsUrl } from '@/components/bits'

/**
 * THE COMPOSITION CHART — 27 September 2026, D-202.
 *
 * Tahir, with the Nutrient TECH composition chart as the reference: "the 23 brands and 27 library
 * codes with toggle view of both, as a separate page, linked to both the brands and the library
 * pages." 1 table per view: every product or code, its declared analysis in nutrient columns, the
 * packs, and the documents. Every figure comes from the product record (MASTER_PRODUCTS, the same
 * table the calculators and the barrel read) or from the library's own meta (LIB_META, which only
 * carries figures the library has already published). Nothing new is asserted; a blank cell means
 * the record carries no figure for that nutrient, not zero. No prices.
 */

const COLS: [string, string][] = [['N', 'N'], ['P', 'P₂O₅'], ['K', 'K₂O'], ['S', 'S'], ['Ca', 'Ca'], ['Mg', 'Mg'], ['Zn', 'Zn'], ['B', 'B'], ['Fe', 'Fe'], ['Mn', 'Mn'], ['Cu', 'Cu'], ['OM', 'Organic matter'], ['HA', 'Humic acid']]

// The same document stems the product page uses (ProductPage.tsx), kept in step by hand.
const DOC_STEM_BY_SLUG: Record<string, string> = { 'v-phosphate': 'V-Phosphate' }
const docStem = (p: Product) => DOC_STEM_BY_SLUG[p.slug] ?? p.name.replace(/%/g, '').replace(/\s+/g, '-')
const tds = (p: Product): [string, string][] => p.slug === 'crop-force'
  ? [['TDS 15-15-15', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-15-15-15.pdf'], ['TDS 12-12-18', 'https://www.van.com.pk/spec-sheets/VAN-TDS-Crop-Force-12-12-18.pdf']]
  : [['TDS', `https://www.van.com.pk/spec-sheets/VAN-TDS-${docStem(p)}.pdf`]]
const sds = (p: Product) => `https://www.van.com.pk/sds/VAN-SDS-${docStem(p)}.pdf`

const fmtPct = (v: number | undefined) => v === undefined ? '' : v >= 10 ? String(Math.round(v * 10) / 10) : String(v)

function BrandsTable() {
  const brands = PRODUCTS.filter(p => !p.family)
  return (
    <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 1320 }}>
      <thead><tr><th style={{ minWidth: 210 }}>Brand</th><th style={{ minWidth: 170 }}>Declared analysis</th>{COLS.map(([k, l]) => <th key={k} className="r">{l}</th>)}<th>Packs</th><th>Documents</th></tr></thead>
      <tbody>
        {brands.map(p => {
          const rows = MASTER_PRODUCTS.filter(m => m.slug === p.slug)
          return rows.length ? rows.map((m, i) => (
            <tr key={m.product}>
              {i === 0 && <td rowSpan={rows.length} style={{ verticalAlign: 'top' }}><a href={`#/products/${p.slug}`} className="flex items-center gap-2 no-underline" style={{ color: 'var(--navy)', fontWeight: 700, whiteSpace: 'nowrap' }}><PackShot slug={p.slug} style={{ height: 34, width: 'auto' }} />{p.name}</a></td>}
              <td className="cap">{rows.length > 1 ? m.product.replace(p.name, '').replace(/^[\s(·]+|[)\s]+$/g, '') || m.product : p.analysis.split('.')[0]}</td>
              {COLS.map(([k]) => <td key={k} className="r num" style={{ fontWeight: 400 }}>{fmtPct(m.analysisPct[k])}</td>)}
              <td className="num" style={{ fontWeight: 400, whiteSpace: 'nowrap' }}>{m.packKg} {m.packUnit ?? 'kg'}</td>
              {i === 0 && <td rowSpan={rows.length} style={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                <a href={lmsUrl(p)} target="_blank" rel="noopener">Deck</a>{' · '}
                {tds(p).map(([l, h]) => <span key={h}><a href={h} target="_blank" rel="noopener">{l}</a>{' · '}</span>)}
                <a href={sds(p)} target="_blank" rel="noopener">SDS</a>
              </td>}
            </tr>
          )) : (
            <tr key={p.slug}><td><a href={`#/products/${p.slug}`} style={{ color: 'var(--navy)', fontWeight: 700 }}>{p.name}</a></td><td className="cap">{p.analysis}</td>{COLS.map(([k]) => <td key={k} />)}<td /><td style={{ whiteSpace: 'nowrap' }}><a href={lmsUrl(p)} target="_blank" rel="noopener">Deck</a> · <a href={sds(p)} target="_blank" rel="noopener">SDS</a></td></tr>
          )
        })}
      </tbody>
    </table></div>
  )
}

const LIB_COLS: [string, string][] = [['N', 'N'], ['P', 'P₂O₅'], ['K', 'K₂O'], ['S', 'S'], ['Ca', 'Ca'], ['Mg', 'Mg'], ['Zn', 'Zn'], ['B', 'B'], ['Fe', 'Fe'], ['Org', 'Organic']]

function LibraryTable() {
  return (
    <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={{ minWidth: 1100 }}>
      <thead><tr><th>Code</th><th>Family</th><th>Stage</th><th>What it is</th>{LIB_COLS.map(([k, l]) => <th key={k} className="r">{l}</th>)}</tr></thead>
      <tbody>
        {LIBRARY.map(l => {
          const meta = LIB_META[l.code]
          const has = (k: string) => meta?.n.find(([n]) => n === k)
          return (
            <tr key={l.code}>
              <td style={{ fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}><a href="#/partner/pipeline#library" style={{ color: 'inherit' }}>{l.code}</a></td>
              <td className="cap">{FAMILIES[l.family]}</td>
              <td className="cap" style={{ whiteSpace: 'nowrap' }}>{l.status}</td>
              <td className="cap" style={{ minWidth: 220 }}>{l.title}</td>
              {LIB_COLS.map(([k]) => { const h = has(k); return <td key={k} className="r num" style={{ fontWeight: 400 }}>{h ? (h[1] ?? '•') : ''}</td> })}
            </tr>
          )
        })}
      </tbody>
    </table></div>
  )
}

export default function Composition() {
  const [view, setView] = useState<'brands' | 'library'>(() => (location.hash.includes('library') ? 'library' : 'brands'))
  const brands = PRODUCTS.filter(p => !p.family).length
  return (
    <div className="wrap py-8 lg:py-10">
      <p className="cap"><a href="#/products">Our brands</a> / Composition chart</p>
      <span className="eyebrow mt-3">Composition chart</span>
      <h1 className="max-w-[24ch]">Every brand and every code, with what is in it.</h1>
      <p className="lead mt-3">{brands} registered brands and {LIBRARY.length} unbranded formulations, each with its declared analysis by nutrient, its packs and its documents. A blank cell means the record carries no figure for that nutrient. Percentages are as declared on the bag or in the library; P and K are the oxides, as the bags print them.</p>
      <div className="flex gap-1 p-1 rounded mt-5 self-start" style={{ background: 'var(--sand-2)', display: 'inline-flex' }} role="tablist" aria-label="View">
        <button role="tab" aria-selected={view === 'brands'} className={`btn btn-sm ${view === 'brands' ? 'btn-navy' : 'btn-ghost'}`} onClick={() => setView('brands')}>The {brands} brands</button>
        <button role="tab" aria-selected={view === 'library'} className={`btn btn-sm ${view === 'library' ? 'btn-navy' : 'btn-ghost'}`} onClick={() => setView('library')}>The {LIBRARY.length} library codes</button>
      </div>
      <div className="mt-4" id={view}>
        {view === 'brands' ? <BrandsTable /> : <LibraryTable />}
      </div>
      <p className="cap mt-3 max-w-[120ch]">{view === 'brands'
        ? 'Source: VAN’s product record, the same table the crop calculators read. Documents open on van.com.pk: the product deck, the technical datasheet (TDS) and the safety data sheet (SDS). No price appears here; prices sit inside the plan tools only.'
        : 'Source: the formulation library and its published meta. A dot means the nutrient is carried and the figure is not published; the dossier carries the number, after an agreement. Stage names are the 6-stage path on the Pipeline page.'}</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <a className="btn btn-ghost" href="#/products">The products page</a>
        <a className="btn btn-ghost" href="#/partner/pipeline#library">The formulation library</a>
      </div>
    </div>
  )
}
