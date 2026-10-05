import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '@/data/catalogue'
import { COUNTS, WA } from '@/data/site'
import { PackShot, MethodIcon, DrawnBag, WaButton } from '@/components/bits'

const CATS: [Product['cat'] | 'ALL', string][] = [['ALL', 'All'], ['N', 'Nitrogen'], ['P', 'Phosphorus'], ['K', 'Potash'], ['NPK', 'NPK'], ['MICRO', 'Micronutrients'], ['SEC', 'Secondary'], ['BIO', 'Biologicals']]
const CAT_ORDER: Product['cat'][] = ['N', 'P', 'K', 'NPK', 'MICRO', 'SEC', 'BIO']
const METHODS = ['Broadcast', 'Fertigation', 'Foliar', 'Basal']
const STAGES = ['Soil prep', 'Sowing', 'Germination', 'Early growth', 'Mid-life', 'Maturity']
type SortKey = 'catalogue' | 'name' | 'category' | 'method' | 'stage' | 'availability'

export function FamilyShot() {
  return <div className="flex items-end gap-2"><DrawnBag label="6-32" width={54} /><DrawnBag label="5-40" width={62} /><DrawnBag label="8-38" width={54} /></div>
}

/** B's pack-shot grid and filters, plus A's table as a toggle (Cards ⇄ Table, sortable by clicking a header). */
export default function Products() {
  const [cat, setCat] = useState<string>('ALL')
  const [method, setMethod] = useState<string | null>(null)
  const [stage, setStage] = useState<string | null>(null)
  const [q, setQ] = useState('')
  // 26 Sep 2026: the Tools page's "Product comparison" tile links to #/products#table. It used to land on
  // the cards view, so the comparison table it promised never showed (Tahir: the link "is not working").
  const wantsTable = () => typeof window !== 'undefined' && /#table$/.test(window.location.hash)
  const [view, setView] = useState<'cards' | 'table'>(() => (wantsTable() ? 'table' : 'cards'))
  useEffect(() => {
    const on = () => { if (wantsTable()) setView('table') }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const [sort, setSort] = useState<SortKey>('catalogue')
  const [dir, setDir] = useState<1 | -1>(1)
  const brands = PRODUCTS.filter(p => !p.family).length
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    let r = PRODUCTS.filter(p => (cat === 'ALL' || p.cat === cat) && (!method || p.methods.includes(method)) && (!stage || p.stages.includes(stage)) && (!t || p.name.toLowerCase().includes(t) || p.analysis.toLowerCase().includes(t) || p.catLabel.toLowerCase().includes(t)))
    if (sort !== 'catalogue') {
      r = [...r].sort((a, b) => {
        const k = sort === 'name' ? a.name.localeCompare(b.name) : sort === 'category' ? CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat) : sort === 'method' ? a.methods[0].localeCompare(b.methods[0]) : sort === 'stage' ? STAGES.indexOf(a.stages[0]) - STAGES.indexOf(b.stages[0]) : a.badge.localeCompare(b.badge)
        return k * dir
      })
    }
    return r
  }, [cat, method, stage, q, sort, dir])
  const clear = () => { setCat('ALL'); setMethod(null); setStage(null); setQ('') }
  const toggleSort = (k: SortKey) => { if (sort === k) setDir(d => (d === 1 ? -1 : 1)); else { setSort(k); setDir(1) } }
  const Th = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => <th className={`sort ${sort === k ? 'on' : ''} ${className}`} onClick={() => toggleSort(k)} aria-sort={sort === k ? (dir === 1 ? 'ascending' : 'descending') : 'none'}>{children}{sort === k ? (dir === 1 ? ' ↑' : ' ↓') : ''}</th>
  return (
    <div className="wrap py-8 lg:py-12">
      <span className="eyebrow">Our brands</span>
      <h1>{brands} products. Every analysis published, every batch tested.</h1>
      <p className="lead mt-4">Sell it as a VAN brand, or make it yours. All {COUNTS.ownBrandOpen} are open for own-brand manufacturing, Vital Urea included.</p>
      <div className="flex flex-wrap gap-2 mt-6 cap">
        <span className="tag tag-navy">{COUNTS.licences} PSQCA licences</span><span className="tag tag-navy">{COUNTS.standards} Pakistan Standards</span><span className="tag tag-green">{COUNTS.lab} · every batch tested</span>
      </div>

      <div id="table" className="panel p-4 lg:p-5 mt-8 grid gap-4" style={{ scrollMarginTop: 96 }}>
        <div className="flex flex-wrap gap-2 items-center">
          <input className="input" style={{ maxWidth: 340 }} placeholder="Search a product or analysis…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" />
          <div className="cap ml-auto">{list.length} of {PRODUCTS.length} cards. {brands} brands plus the NP Range family card</div>
          {(cat !== 'ALL' || method || stage || q) && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear filters ✕</button>}
          <a className="btn btn-ghost btn-sm" href="#/composition" style={{ marginRight: 8 }}>Composition chart →</a><div className="flex gap-1 p-1 rounded" style={{ background: 'var(--sand-2)' }} role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === 'cards'} className={`chip chip-xs ${view === 'cards' ? 'on' : ''}`} style={{ borderColor: 'transparent' }} onClick={() => setView('cards')}>Cards</button>
            <button role="tab" aria-selected={view === 'table'} className={`chip chip-xs ${view === 'table' ? 'on' : ''}`} style={{ borderColor: 'transparent' }} onClick={() => setView('table')}>Table</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {CATS.map(([k, l]) => <button key={k} className={`chip chip-sm ${cat === k ? 'on' : ''}`} onClick={() => setCat(k)} aria-pressed={cat === k}>{l}</button>)}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Application method"><span className="cap font-bold uppercase tracking-[.08em] mr-1">Method</span>
            {METHODS.map(m => <button key={m} className={`chip chip-sm green ${method === m ? 'on' : ''}`} onClick={() => setMethod(method === m ? null : m)} aria-pressed={method === m}><MethodIcon method={m} size={18} />{m}</button>)}
          </div>
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Stage"><span className="cap font-bold uppercase tracking-[.08em] mr-1">Stage</span>
            {STAGES.map(s => <button key={s} className={`chip chip-sm gold ${stage === s ? 'on' : ''}`} onClick={() => setStage(stage === s ? null : s)} aria-pressed={stage === s}>{s}</button>)}
          </div>
        </div>
      </div>

      {!list.length && <div className="panel-soft p-8 mt-6 text-center"><p className="lead mx-auto">No products match this combination. Clear a filter.</p><button className="btn btn-gold mt-4" onClick={clear}>Clear filters</button></div>}

      {view === 'cards' && list.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {list.map(p => (
            <a key={p.slug} href={`#/products/${p.slug}`} className="panel tile">
              <div className="shot">{p.family ? <FamilyShot /> : <PackShot slug={p.slug} />}</div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1"><span className="tag tag-navy">{p.catLabel}</span>{p.exclusive ? <span className="tag tag-gold">VAN exclusive</span> : <span className="tag tag-green">Own-brand</span>}</div>
                <div className="display text-[19px] leading-tight mt-2">{p.name}{p.family && <span className="cap block font-normal">the NP Range · a family of 3 grades</span>}</div>
                <div className="small muted mt-1 flex-1">{p.analysis}</div>
                <div className="flex flex-wrap gap-1 mt-3">{p.methods.map(m => <span key={m} className="tag tag-sky inline-flex items-center gap-1"><MethodIcon method={m} size={14} />{m}</span>)}{p.stages.map(s => <span key={s} className="tag tag-grey">{s}</span>)}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {view === 'table' && list.length > 0 && (
        <div className="panel overflow-x-auto mt-6">
          <table className="tbl" style={{ minWidth: 960 }}>
            <thead><tr><th style={{ width: 56 }}></th><Th k="name">Product</Th><Th k="category">Category</Th><th>Analysis</th><Th k="method">Application</Th><Th k="stage">Stage</Th><Th k="availability">Availability</Th><th></th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.slug} className="rowlink" onClick={() => { window.location.hash = `#/products/${p.slug}` }}>
                  <td><div style={{ width: 40, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.family ? <DrawnBag label="NP" width={28} /> : <PackShot slug={p.slug} style={{ maxHeight: 50, width: 'auto' }} />}</div></td>
                  <td className="font-bold whitespace-nowrap" style={{ color: 'var(--navy)' }}>{p.name}{p.family && <span className="tag tag-grey ml-2">family</span>}</td>
                  <td style={{ minWidth: 110 }}>{p.catLabel}</td>
                  <td style={{ minWidth: 220 }}>{p.analysis}</td>
                  <td style={{ minWidth: 120 }}>{p.methods.join(' · ')}</td>
                  <td style={{ minWidth: 120 }}>{p.stages.join(' · ')}</td>
                  <td style={{ minWidth: 150 }}><span className={`tag ${p.exclusive ? 'tag-gold' : 'tag-green'}`} style={{ whiteSpace: 'normal' }}>{p.badge}</span></td>
                  <td className="r whitespace-nowrap"><a className="font-bold" style={{ color: 'var(--navy)' }} href={`#/products/${p.slug}`} onClick={e => e.stopPropagation()}>Open →</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cap p-3">▸ Click a header to sort · click a row to open it. {sort === 'catalogue' ? 'Catalogue order.' : ''}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mt-12">
        <div className="panel-green p-6">
          <span className="eyebrow">Distribution</span>
          <h3>Carry VAN brands in your territory.</h3>
          <p className="mt-2 muted">Range, pricing and territory. Ask on WhatsApp.</p>
          <div className="mt-4"><WaButton href={WA.distributor}>Become a distributor</WaButton></div>
        </div>
        <div className="panel-soil p-6">
          <span className="eyebrow soil">Own-brand manufacturing</span>
          <h3>Same specification, your brand name.</h3>
          <p className="mt-2 muted">All 23 are open for own-brand manufacturing, Vital Urea included. Same line, same QC, your label.</p>
          <a className="btn btn-navy mt-4" href="#/partner">Make it your brand →</a>
        </div>
      </div>
    </div>
  )
}
