import { rateLabel } from '@/lib/season'
import { alternativeFor } from '@/data/alternatives'
import { Ur } from './Ur'
import type { PlanRow } from '@/data/catalogue'
import { PackShot, MethodIcon } from '@/components/bits'

/**
 * The full band × stage nutrition-plan matrix, with a real product pack-shot next to every row —
 * shared by Wheat.tsx and the generic CropPage so every crop reads the same way. Added 8 Sep 2026
 * to replace the old text-and-tiny-method-icon-only table (the "small icons" fix).
 */
export function PlanMatrix({ stages, plan, tableNote }: { stages: string[]; plan: PlanRow[]; tableNote?: string }) {
  const bands = [...new Set(plan.map(r => r.band))]
  const products = [...new Map(plan.filter(r => r.slug).map(r => [r.slug as string, r.product])).entries()]
  const hasCommodity = plan.some(r => r.commodity)
  return (
    <div>
      <div className="panel overflow-x-auto tbl-scroll">
        <table className="tbl tbl-plan">
          <thead><tr><th>Band</th>{stages.map(s => <th key={s}><Ur kind="stage" en={s} /></th>)}</tr></thead>
          <tbody>
            {bands.map(band => (
              <tr key={band}>
                <td className="font-bold whitespace-nowrap"><Ur kind="band" en={band} /></td>
                {stages.map(s => (
                  <td key={s}>
                    {plan.filter(r => r.band === band && r.stage === s).map((r, i) => (
                      <div key={i} className={`plan-cell ${r.commodity ? 'text-[#55645A]' : ''}`}>
                        <div className="plan-cell-shot">
                          <PackShot slug={r.slug} alt={r.product} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                        </div>
                        <div className="min-w-0">
                          {r.slug ? <a href={`#/products/${r.slug}`} className="font-semibold">{r.product}</a> : <span className="font-semibold">{r.product}</span>}<br />
                          <span className="cap">{r.analysis} · <b>{rateLabel(r)}</b> · {r.pack.replace('Bag - ', '').replace('Pack - ', '')}</span><br />
                          <span className="cap inline-flex items-center gap-1"><MethodIcon method={r.method} size={14} />{r.method}</span>
                          {/* Tahir 9 Sep: Fusion Phosphate is optional and always offered beside Green
                              Phosphate. The plan row itself is untouched. This names the other bag. */}
                          {alternativeFor(r.slug) && (
                            <><br /><span className="cap" style={{ color: 'var(--navy)' }}>
                              or <a href={`#/products/${alternativeFor(r.slug)!.altSlug}`}>{alternativeFor(r.slug)!.altName}</a>. Your choice
                            </span></>
                          )}
                        </div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableNote && <p className="cap mt-3">{tableNote}</p>}
      <div className="flex flex-wrap gap-2 mt-4">
        {products.map(([slug, name]) => <a key={slug} className="chip chip-sm" href={`#/products/${slug}`}>{name}</a>)}
        {hasCommodity && <span className="chip chip-sm" style={{ color: '#55645A', cursor: 'default' }}>Grey items. Commodity inputs, not VAN products</span>}
      </div>
    </div>
  )
}
