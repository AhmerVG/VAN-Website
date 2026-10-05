import type { Block, RebuiltPage, TableSpec } from '@/data/rebuilt'
import { Lens } from '@/components/Lens'
import { FormulationLibrary } from '@/components/FormulationLibrary'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Source } from '@/components/Charts'

/**
 * Generic renderer for the pages carried across from the live site (see rebuilt.ts). One component
 * rather than a bespoke page each, so the copy stays in one auditable data file and the layout stays
 * consistent with the rest of the site.
 */
function Table({ t }: { t: TableSpec }) {
  const headed = t.head.some(h => h !== '')
  return (
    <>
      <div className="panel overflow-x-auto tbl-scroll"><table className="tbl" style={t.minWidth ? { minWidth: t.minWidth } : undefined}>
        {headed && <thead><tr>{t.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
        {/* A cell that reads exactly "Accredited" renders as a small green tag rather than a word,
            so the lab price list can carry the accreditation as a quiet mark on one list instead of
            two tables. 11 Sep 2026. Any other cell is plain text as before. */}
        <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <td key={j} className="font-bold" style={{ minWidth: 150 }}>{c}</td> : <td key={j} style={{ minWidth: c === 'Accredited' || c === '' ? 0 : 190 }}>{c === 'Accredited' ? <span className="tag tag-green" style={{ fontSize: 10 }}>Accredited</span> : c}</td>)}</tr>)}</tbody>
      </table></div>
      {t.note && <p className="cap mt-3 max-w-[140ch]">{t.note}</p>}
      {t.source && <Source>{t.source}</Source>}
    </>
  )
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="grid gap-4">
      {blocks.map((b, i) => {
        switch (b.k) {
          case 'lead': return <p key={i} className="lead max-w-[140ch]">{b.text}</p>
          case 'p': return <p key={i} className="small max-w-[140ch]">{b.text}</p>
          case 'h3': return <h3 key={i} className="mt-2">{b.text}</h3>
          case 'table': return <Table key={i} t={b.t} />
          case 'note': return <p key={i} className="cap max-w-[140ch]">{b.text}</p>
          case 'source': return <Source key={i}>{b.text}</Source>
          case 'stats': return (
            <div key={i} className="grid sm:grid-cols-2 gap-3">
              {b.items.map(([v, l]) => <div key={v} className="panel p-4"><div className="pull text-[clamp(24px,2.2vw,30px)]">{v}</div><div className="cap mt-1">{l}</div></div>)}
            </div>
          )
          case 'tags': return <div key={i} className="flex flex-wrap gap-2">{b.items.map(t => <span key={t} className="tag tag-green">{t}</span>)}</div>
          case 'cta': return <div key={i}><a className="btn btn-navy" href={b.href}>{b.label}</a></div>
          // Real <details>, not a JS accordion: every answer is in the page source for a crawler and
          // for a reader with JavaScript off, and only one is open at a time on a phone.
          case 'faq': return (
            <div key={i} className="grid gap-2">
              {b.items.map(([q, a]) => (
                <details key={q} className="panel px-4 py-3">
                  <summary className="font-bold cursor-pointer" style={{ color: 'var(--navy)' }}>{q}</summary>
                  <p className="small mt-2 max-w-[140ch]">{a}</p>
                </details>
              ))}
            </div>
          )
          case 'enquiry': return <EnquiryForm key={i} />
          case 'library': return <div key={i} id="library"><FormulationLibrary /></div>
          case 'lens': return <Lens key={i} specs={b.specs} countries={b.countries} label={b.label} />
          default: return null
        }
      })}
    </div>
  )
}

/** The section list on its own, so a bespoke page (the Lab) can render carried-across sections too. */
export function ArticleSections({ sections }: { sections: RebuiltPage['sections'] }) {
  return (
    <>
      {sections.map(s => (
        <section key={s.id} className="sec" id={s.id} style={s.bg ? { background: 'var(--sand-2)' } : undefined}>
          <div className="wrap">
            <div className="mb-7 lg:mb-9">
              <span className={`eyebrow ${s.tone ?? 'navy'}`}><span className="k-num">{s.n}</span>{s.kicker}</span>
              <h2 className="max-w-[24ch]">{s.title}</h2>
              {s.lead && <p className="lead mt-3 max-w-[140ch]">{s.lead}</p>}
            </div>
            <Blocks blocks={s.blocks} />
          </div>
        </section>
      ))}
    </>
  )
}

export default function Article({ page }: { page: RebuiltPage }) {
  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--sand-2), var(--sand))' }}>
        <div className="wrap py-8 lg:py-12">
          <span className={`eyebrow ${page.tone}`}>{page.eyebrow}</span>
          <h1 className="max-w-[26ch]">{page.h1}{page.h1accent && <> <span style={{ color: 'var(--rust)' }}>{page.h1accent}</span></>}</h1>
          <p className="lead mt-4 max-w-[140ch]">{page.lead}</p>
          {/* O-11: chips are places ON this page. Other pages are listed separately below, because a
              numbered chip that navigates away is what broke the circular economy hub. */}
          <div className="flex flex-wrap gap-2 mt-6">
            {page.sections.map(s => <a key={s.id} className="chip chip-xs" href={`#${s.id}`}>{s.n} {s.kicker}</a>)}
          </div>
          {page.siblings && page.siblings.length > 0 && (
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="cap">Also in this section, on their own pages</span>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                {page.siblings.map(sb => (
                  <a key={sb.href} href={sb.href} className="panel p-4" style={{ textDecoration: 'none' }}>
                    <span className="font-bold" style={{ color: 'var(--navy)' }}>{sb.label} →</span>
                    <span className="small muted block mt-1">{sb.note}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {page.sections.map(s => (
        <section key={s.id} className="sec" id={s.id} style={s.bg ? { background: 'var(--sand-2)' } : undefined}>
          <div className="wrap">
            <div className="mb-7 lg:mb-9">
              <span className={`eyebrow ${s.tone ?? 'navy'}`}><span className="k-num">{s.n}</span>{s.kicker}</span>
              <h2 className="max-w-[24ch]">{s.title}</h2>
              {s.lead && <p className="lead mt-3 max-w-[140ch]">{s.lead}</p>}
            </div>
            <Blocks blocks={s.blocks} />
          </div>
        </section>
      ))}

      {/* D-192, 26 Sep 2026: the "A question this page doesn’t answer?" WhatsApp panel came off. It put the
          farmer message at the foot of 12 partner, knowledge and circular pages (UX review). The footer
          carries the 3 addresses. Revert: the v60 zip, this file. */}
    </div>
  )
}
