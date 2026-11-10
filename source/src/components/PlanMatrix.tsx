import { ratePackLabel } from '@/lib/season'
import { alternativeFor, offersAlternative } from '@/data/alternatives'
import { Ur } from './Ur'
import type { PlanRow } from '@/data/catalogue'
import { PackShot, MethodIcon } from '@/components/bits'

/**
 * The full band × stage nutrition-plan matrix, with a real product pack-shot next to every row —
 * shared by Wheat.tsx and the generic CropPage so every crop reads the same way. Added 8 Sep 2026
 * to replace the old text-and-tiny-method-icon-only table (the "small icons" fix).
 */
/** L1 10 Nov 2026 (crops 12): "DAT" is written out once, in the first stage heading that uses it: "Early Growth (20 days after
 *  transplanting, DAT)". The other headings, the tick boxes and the lists keep "(40 DAT)". Display only; the stage names are
 *  unchanged. Onion is the only plan with DAT today. */
function stageHeading(stages: string[], s: string): string {
  const first = stages.find(x => /\(\d+ DAT\)/.test(x))
  return s === first ? s.replace(/\((\d+) DAT\)/, '($1 days after transplanting, DAT)') : s
}

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function PlanMatrix({ stages, plan, tableNote }: { stages: string[]; plan: PlanRow[]; tableNote?: string }) {
  const bands = [...new Set(plan.map(r => r.band))]
  const products = [...new Map(plan.filter(r => r.slug).map(r => [r.slug as string, r.product])).entries()]
  const hasCommodity = plan.some(r => r.commodity)
  return (
    <div>
      <div className="panel overflow-x-auto tbl-scroll">
        <table className="tbl tbl-plan">
          <thead><tr><th>Nutrient group</th>{stages.map(s => <th key={s}><Ur kind="stage" en={stageHeading(stages, s)} /></th>)}</tr></thead>
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
                          <span className="cap">{r.analysis} · <b>{ratePackLabel(r)}</b></span><br />{/* L1 10 Nov 2026 (crops 2): rate and pack size in 1 phrase ("½ of a 10 kg bag"). Was "{rate} · 10 kg", with Green Sulfur's pack as "1 kg pack". */}
                          <span className="cap inline-flex items-center gap-1"><MethodIcon method={r.method} size={14} />{r.method}</span>
                          {/* Tahir 9 Sep: Fusion Phosphate is optional and always offered beside Green
                              Phosphate. The plan row itself is untouched. This names the other bag. */}
                          {/* Tahir 10 Nov 2026 (R3-7): not on a row applied by fertigation. */}
                          {alternativeFor(r.slug) && offersAlternative(r.method) && (
                            <><br /><span className="cap" style={{ color: 'var(--navy)' }}>
                              or <a href={`#/products/${alternativeFor(r.slug)!.altSlug}`}>{alternativeFor(r.slug)!.altName}</a>, your choice.
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
        {hasCommodity && <span className="chip chip-sm" style={{ color: '#55645A', cursor: 'default' }}>In grey: not made by VAN</span>}
      </div>
    </div>
  )
}
