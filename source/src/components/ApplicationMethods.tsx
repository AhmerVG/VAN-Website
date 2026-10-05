import { SectionHead, MethodIcon } from '@/components/bits'
import { BASAL_SLUGS, METHOD_ROWS, PRODUCT_NOTE } from '@/data/application'

/**
 * THE APPLICATION METHOD TABLE — 27 September 2026, D-207. On the product page of every basal
 * granular product (BASAL_SLUGS): drill first, side-dress second, broadcast last, with the reason for
 * each, and the observation sentence as ruled. The dealer decks carry the same table. Drawn as 3
 * stacked rows rather than a 4-column table, because the product page's column is narrow.
 */
export function isBasal(slug: string) { return (BASAL_SLUGS as readonly string[]).includes(slug) }

export function ApplicationMethods({ slug, compact }: { slug: string; compact?: boolean }) {
  if (!isBasal(slug)) return null
  const note = PRODUCT_NOTE[slug]
  const tone = (rank: string) => rank.startsWith('1') ? 'var(--green)' : rank.startsWith('3') ? 'var(--rust)' : 'var(--navy)'
  return (
    <section className={compact ? '' : 'mt-10'} id="how-it-goes-on" aria-label="How it goes on">
      <SectionHead eyebrow="How it goes on" tone="green" title="Drill it at sowing. Side-dress if you cannot. Broadcast last." lead="The same bag gives a different result depending on where it lands. The order below is VAN’s, for every basal granule it makes." />
      <ol className="grid gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {METHOD_ROWS.map(r => (
          <li key={r.method} className="panel p-4 sm:p-5" style={{ borderLeft: `4px solid ${tone(r.rank)}` }}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num" style={{ fontWeight: 700, color: tone(r.rank) }}>{r.rank}</span>
              <span className="display text-[20px] inline-flex items-center gap-2"><MethodIcon method={r.method} size={20} />{r.method}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
              <p className="small"><b>What it means.</b> {r.what}</p>
              <p className="small"><b>Why.</b> {r.why}</p>
            </div>
          </li>
        ))}
      </ol>
      {/* The "7 to 9% better response" OBSERVATION sentence was pulled from the site per Tahir's
          28 Sep 2026 ruling (this page only. It stays in VAN's internal sales decks). The constant
          is left in src/data/application.ts, unrendered, because the LMS deck generator may still
          read it from that file. */}
      {note && <p className="cap mt-2" style={{ maxWidth: '78ch' }}>{note}</p>}
    </section>
  )
}
