import { CROP_PLANS } from '@/data/catalogue'
import { useSowing, daysAfterSowing, addDays, prettyDate, stageNow, hasStageModel, rowsDue, windowCheck } from '@/lib/sowing'
import { rateLabel } from '@/lib/season'
import { PackShot } from './bits'
import { Ur, UrLabel } from './Ur'

/**
 * BLOCK 02 — "Where your crop is now."  Added 9 Sep 2026.
 *
 * Every other block on a crop page is a season-long table. A man standing in his field in the second
 * week of December wants one thing: WHAT DO I DO THIS WEEK. This block answers only that, and hands
 * off to the block that carries the detail.
 *
 * It appears only once the sowing date is answered with an actual date, because without one there is
 * nothing here that is true. It is not a fifth tool: it is the spine that makes the other four
 * navigable, which is why it sits second and stays short.
 *
 * WHAT IT WILL AND WILL NOT CLAIM — read this before extending it to another crop.
 *
 *   Days after sowing is arithmetic on the farmer's own date, so every crop gets it.
 *
 *   A GROWTH STAGE IS ONLY SHOWN WHERE VAN HAS PUBLISHED THE STAGE DURATIONS. Today that is wheat
 *   alone: van.com.pk prints wheat's five stages with their days-after-sowing ranges, and this block
 *   reads that same published table (see lib/sowing.ts — it is derived, not retyped). The other 27
 *   programmes have stage NAMES and no published durations. Wheat's durations belong to wheat; using
 *   them for cotton would be inventing agronomy in order to fill a panel. So those crops are told
 *   what is true — the day count — and told plainly why the stage line is not there.
 *
 *   The rows it lists are the published plan's own rows for that stage. Nothing is generated,
 *   reordered or recommended: it is a filter over the table two blocks below.
 */
export function CropNow({ cropKey, cropName }: { cropKey: string; cropName: string }) {
  const [sown] = useSowing(cropKey)
  if (!sown || sown.kind !== 'date') return null

  const das = daysAfterSowing(sown.iso)
  if (das === null) return null
  const cp = CROP_PLANS[cropKey]
  const check = windowCheck(cropKey, sown.iso)

  // Sown in the future, or typed wrong. Say so rather than printing "day −12".
  if (das < 0) {
    return (
      <Panel>
        <p className="lead">That date is still ahead. {prettyDate(sown.iso)}.</p>
        <p className="small mt-2 max-w-[140ch]">
          The programme and the shopping list below are what you want before sowing. Come back once
          the crop is in.
        </p>
      </Panel>
    )
  }

  const st = hasStageModel(cropKey) ? stageNow(cropKey, das, sown.iso) : null

  /* ── The crop VAN has published a stage table for ────────────────────────────────────────── */
  if (st) {
    const due = rowsDue(cropKey, st.stage)
    const nextIso = st.nextAt !== null ? addDays(sown.iso, st.nextAt) : null
    return (
      <Panel>
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-6">
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="tag tag-green">Stage {st.index} of {st.total}</span>
              <span className="cap">day {das} after sowing</span>
            </div>
            <h3 className="mt-2 text-[clamp(22px,2.2vw,30px)]">
              {st.past
                ? <>Your {cropName} is at or past maturity.</>
                : <Ur kind="stage" en={st.stage} />}
            </h3>
            {!st.past && (
              <p className="muted mt-2 max-w-[140ch]">{st.events}</p>
            )}
            {st.past && (
              <p className="muted mt-2 max-w-[140ch]">
                On a normal Lahore season your crop has passed the 1,400 degree days the wheat table
                puts at maturity, and you are on day {das}. Nothing below is due. The programme stays
                here for next season.
              </p>
            )}
            {!st.past && nextIso && st.next && (
              <p className="small mt-3">
                <b><UrLabel k="nextStage" en="Next stage" /></b>. {st.next}, from about{' '}
                <b>{prettyDate(nextIso)}</b> (day {st.nextAt}).
              </p>
            )}
            {check && !check.inWindow && (
              <p className="cap mt-3 max-w-[140ch]">
                Sown about {check.monthsOut} month{check.monthsOut === 1 ? '' : 's'} {check.direction === 'early' ? 'before' : 'after'}
                VAN's published {check.label} window. The stage dates above are worked in degree days from
                your own sowing date, so they move with the temperatures your crop actually meets.
              </p>
            )}
          </div>

          <div>
            <div className="cap font-bold uppercase tracking-[.08em] mb-2">
              <UrLabel k="dueNow" en={`Due at this stage · per acre`} />
            </div>
            {st.past ? (
              <p className="small">Nothing is due. The season’s applications are all behind you.</p>
            ) : due.length === 0 ? (
              <p className="small">
                The published {cropName} programme puts nothing on at this stage.
                {st.next ? <> The next application is at {st.next}.</> : null}
              </p>
            ) : (
              <>
                <ul className="grid gap-2">
                  {due.map((r, i) => (
                    <li key={i} className="flex items-center gap-3 panel-soft p-2">
                      {r.slug && <PackShot slug={r.slug} style={{ height: 42, width: 'auto' }} />}
                      <span className="flex-1">
                        <b style={{ color: r.commodity ? 'var(--muted)' : 'inherit' }}>{r.product}</b>
                        <span className="block cap">{rateLabel(r)} · {r.method}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="cap mt-2">
                  Read straight off VAN's published {cropName} plan. The same rows as the programme
                  table below, filtered to this stage. Nothing here is calculated.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <a className="btn btn-sm" href="#list">Turn this into bags for my acres →</a>
              <a className="btn btn-sm btn-ghost" href="#programme">See the whole season →</a>
            </div>
          </div>
        </div>
      </Panel>
    )
  }

  /* ── Every other crop: the day count is real, the stage is not published ─────────────────── */
  return (
    <Panel>
      <div className="grid md:grid-cols-[1fr_1fr] gap-6">
        <div>
          <span className="cap">Sown {prettyDate(sown.iso)}</span>
          <h3 className="mt-1 text-[clamp(22px,2.2vw,30px)]">
            Day {das} of your {cropName}.
          </h3>
          <p className="muted mt-2 max-w-[140ch]">
            VAN publishes the {cropName} programme stage by stage, but not how many days each stage
            lasts, so this page will not tell you which stage you are in. Wheat's day ranges are
            wheat's; borrowing them for {cropName} would be a guess wearing the look of a measurement.
          </p>
          <p className="cap mt-3 max-w-[140ch]">
            What is missing is a stage model for {cropName}. The days after sowing at which each of
            its published stages opens. When VAN has one, this block answers the same question here
            that it answers on wheat.
          </p>
        </div>
        <div>
          <div className="cap font-bold uppercase tracking-[.08em] mb-2">The stages, in order</div>
          <ol className="grid gap-1">
            {(cp?.stages ?? []).map((s, i) => (
              <li key={s} className="flex gap-2 items-baseline">
                <span className="cap">{i + 1}</span>
                <span><Ur kind="stage" en={s} /></span>
              </li>
            ))}
          </ol>
          {check && !check.inWindow && (
            <p className="cap mt-3">
              Your date is about {check.monthsOut} month{check.monthsOut === 1 ? '' : 's'} {check.direction === 'early' ? 'before' : 'after'}
              VAN's published {check.label} window.
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <a className="btn btn-sm" href="#list">What to buy for my acres →</a>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel p-5 lg:p-6" id="now" style={{ borderColor: 'var(--green)' }}>
      <span className="eyebrow green"><UrLabel k="cropNow" en="Where your crop is now" /></span>
      <div className="mt-2">{children}</div>
    </div>
  )
}
