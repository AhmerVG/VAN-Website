import { useSowing, todayIso, prettyDate, windowCheck, type Sowing } from '@/lib/sowing'
import { UrLabel } from './Ur'

/**
 * BLOCK 01 — "When did you sow?"  Added 9 Sep 2026.
 *
 * One question at the top of the crop page. It orders the blocks below it and it never gates them:
 * a reader who skips it, refuses it, or arrives from a search engine sees exactly the page that
 * existed before this component did.
 *
 * Three answers, because those are the three true ones. A grower who has not sown yet is planning
 * and wants the programme and the shopping list; a grower who does not remember is mid-season and
 * still wants the plan; only the third — a date — can order the page around him. Forcing the first
 * two to invent a date to get past the question is how a form loses the reader it already had.
 *
 * The answer is kept in this browser only. It is a convenience, not a record: VAN is not told, and
 * if storage is blocked the question simply asks again next visit.
 */
/** D-151 (QA 19): perennial crops are not sown each season. A first-year banana is planted; an orchard
 *  asks when its season started (flush, pruning or first irrigation). Revert: delete WORDS and use the
 *  sowing strings directly. */
const PLANTED = ['banana-year1']
const ORCHARD = ['citrus', 'mango', 'guava', 'date-palm', 'banana-year2']
function words(cropKey: string) {
  if (PLANTED.includes(cropKey)) return { q: 'When did you plant?', date: 'Planting date', not: 'I haven’t planted yet', did: 'You planted on', window: 'planting window', aria: 'The date you planted your', notText: 'Then the 2 blocks you want are the programme and the shopping list. Come back to this question once the crop is planted and the page will follow the season with you.', urdu: false }
  if (ORCHARD.includes(cropKey)) return { q: 'When did your season start?', date: 'Season start (flush, pruning or first irrigation)', not: 'It hasn’t started yet', did: 'Your season started on', window: 'season window', aria: 'The date your season started, for your', notText: 'Then the 2 blocks you want are the programme and the shopping list. Come back to this question once the season starts and the page will follow it with you.', urdu: false }
  return { q: 'When did you sow?', date: 'Sowing date', not: 'I haven’t sown yet', did: 'You sowed on', window: 'sowing window', aria: 'The date you sowed your', notText: 'Then the two blocks you want are the programme and the shopping list. Come back to this question once the crop is in and the page will follow the season with you.', urdu: true }
}

export function SowingDate({ cropKey, cropName }: { cropKey: string; cropName: string }) {
  const [sown, setSown] = useSowing(cropKey)
  const w = words(cropKey)
  // D-151 (QA 20): a date after today is a plan, not a fact.
  const ahead = sown?.kind === 'date' && sown.iso > todayIso()
  const check = sown?.kind === 'date' ? windowCheck(cropKey, sown.iso) : null

  const chip = (label: string, value: Sowing | null, active: boolean) => (
    <button
      className={`chip chip-sm${active ? ' on' : ''}`}
      aria-pressed={active}
      onClick={() => setSown(active ? null : value)}
    >{label}</button>
  )

  return (
    <div className="panel p-4 lg:p-5" id="sown">
      {/* 26 Sep 2026 · Tahir: "this is not working" (screenshot at a laptop width). The 2-column grid gave the
          question column its full text width ("auto"), which squeezed the date field to its calendar icon and
          the answers to 1 word a line. One column now: the question, then the controls under it. */}
      <div className="grid gap-4 items-start">
        <div>
          <span className="eyebrow">Step one · optional</span>
          <h2 className="mt-1 text-[clamp(20px,2vw,26px)]">
            {w.urdu ? <UrLabel k="whenSown" en="When did you sow?" /> : w.q}
          </h2>
          <p className="cap mt-1 max-w-[140ch]">
            Answer this and the page orders itself around your field. Skip it and nothing is lost, 
            every rate, quantity and method below is exactly where it was.
          </p>
        </div>
        {/* 11 Sep 2026 · min-w-0. A native date input has a wide intrinsic width, and without this
            the grid track refused to shrink: the field's right edge measured 1205px against a
            1148px column and sat under the side dock, where part of it could not be clicked. */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <label className="flex items-center gap-2 min-w-0">
              <span className="cap">{w.urdu ? <UrLabel k="sowingDate" en="Sowing date" /> : w.date}</span>
              <input
                type="date"
                className="input min-w-0"
                style={{ maxWidth: '100%', minWidth: 170 }}
                max={todayIso()}
                aria-label={`${w.aria} ${cropName}`}
                value={sown?.kind === 'date' ? sown.iso : ''}
                onChange={e => setSown(e.target.value ? { kind: 'date', iso: e.target.value } : null)}
              />
            </label>
            <span className="cap">or</span>
            {chip(w.not, { kind: 'not-sown' }, sown?.kind === 'not-sown')}
            {chip('I don’t remember', { kind: 'unknown' }, sown?.kind === 'unknown')}
          </div>

          {ahead && sown?.kind === 'date' && (
            <p className="small mt-3 max-w-[140ch]">
              <b>{prettyDate(sown.iso)}</b> is still ahead. The page treats it as your planned date{check ? <>; VAN’s published {cropName} {w.window} is <b>{check.label}</b></> : null}.
            </p>
          )}
          {!ahead && sown?.kind === 'date' && check && (
            <p className="small mt-3 max-w-[140ch]">
              {w.did} <b>{prettyDate(sown.iso)}</b>.{' '}
              {check.inWindow
                ? <>That is inside VAN’s published {cropName} {w.window} ({check.label}).</>
                : <>VAN’s published {cropName} window is <b>{check.label}</b>, so this is about{' '}
                    <b>{check.monthsOut} month{check.monthsOut === 1 ? '' : 's'} {check.direction}</b>.
                    The programme below is unchanged. It is written per acre, not per sowing date, 
                    but sowing time is one of the ten levers in the discipline simulator, and it is
                    scored there.</>}
            </p>
          )}
          {sown?.kind === 'not-sown' && (
            <p className="small mt-3 max-w-[140ch]">
              {w.notText}
            </p>
          )}
          {sown?.kind === 'unknown' && (
            <p className="small mt-3 max-w-[140ch]">
              That is fine. The whole programme is below either way. If you can find the date later,
              this page can work out which rows are due this week rather than showing you the season.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
