import { useSowing, todayIso, prettyDate, windowCheck, type Sowing } from '@/lib/sowing'
import { UrLabel } from './Ur'
import { PLANTED_CROPS as PLANTED, ORCHARD_CROPS as ORCHARD, seasonWords } from '@/lib/season'

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
function words(cropKey: string) {
  if (PLANTED.includes(cropKey)) return { q: 'When did you plant?', date: 'Planting date', not: 'I haven’t planted yet', did: 'You planted on', window: 'planting window', aria: 'The date you planted your', notText: 'Before planting, use the plan and the shopping list below. Once the crop is planted, come back to this question and the page will follow your season.', urdu: false }
  // Tahir 7 Nov 2026 (CR-11): potato and sugarcane now take the planting words, ratoon sugarcane the season-start words
  // (lists in lib/season.ts). The orchard hint (leaf flush, pruning) does not fit a ratoon crop.
  // Tahir 10 Nov 2026 (CR-N10): ratoon names its own event, "Season start (stubble shaving)", was "Season start" alone.
  if (ORCHARD.includes(cropKey)) return { q: 'When did your season start?', date: cropKey === 'sugarcane-ratoon' ? 'Season start (stubble shaving)' : 'Season start (new leaf flush, pruning or first irrigation)', not: 'It hasn’t started yet', did: 'Your season started on', window: 'season window', aria: 'The date your season started, for your', notText: 'Before the season starts, use the plan and the shopping list below. Once it has started, come back to this question and the page will follow your season.', urdu: false }
  return { q: 'When did you sow?', date: 'Sowing date', not: 'I haven’t sown yet', did: 'You sowed on', window: 'sowing window', aria: 'The date you sowed your', notText: 'Before sowing, use the plan and the shopping list below. Once the crop is sown, come back to this question and the page will follow your season.', urdu: true }
}

/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
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
          <span className="eyebrow">Optional question</span>
          <h2 className="mt-1 text-[clamp(20px,2vw,26px)]">
            {w.urdu ? <UrLabel k="whenSown" en="When did you sow?" /> : w.q}
          </h2>
          <p className="cap mt-1 max-w-[140ch]">
            You can skip this question. If you enter your {seasonWords(cropKey).date}, the page counts
            the days since that date and calculates the crop’s water use from the same date. The date
            does not change the rates, quantities or methods in the plan.
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
              <b>{prettyDate(sown.iso)}</b> is in the future, so the page treats it as your planned date{check ? <>; VAN’s published {cropName} {w.window} is <b>{check.label}</b></> : null}.
            </p>
          )}
          {!ahead && sown?.kind === 'date' && check && (
            <p className="small mt-3 max-w-[140ch]">
              {w.did} <b>{prettyDate(sown.iso)}</b>.{' '}
              {check.inWindow
                ? <>That is inside VAN’s published {cropName} {w.window} ({check.label}).</>
                : <>VAN’s published {cropName} {w.window} is <b>{check.label}</b>, so this date is about{' '}
                    <b>{check.monthsOut} month{check.monthsOut === 1 ? '' : 's'} {check.direction}</b>.
                    The plan below does not change, because it is not written for a particular
                    {' '}{seasonWords(cropKey).date}. For wheat and potato, sowing time is scored separately, as 1 of the
                    10 practices in the farm discipline simulator.</>}
            </p>
          )}
          {sown?.kind === 'not-sown' && (
            <p className="small mt-3 max-w-[140ch]">
              {w.notText}
            </p>
          )}
          {sown?.kind === 'unknown' && (
            <p className="small mt-3 max-w-[140ch]">
              The whole plan is below. If you find the date later, enter it, and the page will
              count the days since that date.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
