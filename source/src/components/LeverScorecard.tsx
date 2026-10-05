import { useMemo, useState } from 'react'
import { WHEAT_LEVERS } from '@/data/leverScorecard'

type Level = 'bad' | 'ok' | 'best'
const SCORE: Record<Level, number> = { bad: 0, ok: 50, best: 100 }
const LEVEL_LABEL: Record<Level, string> = { bad: 'Bad', ok: 'OK', best: 'Best' }

/**
 * The Farm Discipline Scorecard — wheat only for now, sourced 1:1 from Tahir's own
 * "Wheat Lever Scorecard & Yield Prediction.xlsx" (10 levers, weights and Bad/OK/Best bands, each
 * with a cited agronomic source). This is the second piece to plug into the shared plan engine
 * (see planCalc.ts): it scores discipline the way the nutrition creator scores dosage, and both are
 * meant to sit side by side rather than as separate tools. The workbook's own note stands: these
 * weights are "a starting, research-informed hypothesis... revisit after this season's pilot" — this
 * component shows that note rather than hiding it. The workbook's further step — converting the score
 * into a maunds/acre yield prediction against a named variety's documented potential — is not wired
 * in yet: the sample data in that sheet mixes selections in a way that doesn't cleanly resolve to one
 * formula from inspection alone, so it needs confirming with Tahir before it ships, rather than guessed.
 */
export function LeverScorecard() {
  const [levels, setLevels] = useState<Record<string, Level>>(() =>
    Object.fromEntries(WHEAT_LEVERS.map(l => [l.name, 'ok' as Level]))
  )
  const [openWhy, setOpenWhy] = useState<string | null>(null)

  const rows = useMemo(() => WHEAT_LEVERS.map(l => {
    const level = levels[l.name] ?? 'ok'
    const bandScore = SCORE[level]
    const weighted = (l.weight * bandScore) / 100
    const lost = l.weight - weighted
    return { ...l, level, weighted, lost }
  }), [levels])

  const total = rows.reduce((s, r) => s + r.weighted, 0)
  const primary = rows.reduce((worst, r) => (r.lost > worst.lost ? r : worst), rows[0])

  const set = (name: string, level: Level) => setLevels(s => ({ ...s, [name]: level }))

  return (
    <div className="panel p-5 lg:p-8" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <span className="eyebrow">Farm discipline scorecard · beta · wheat only</span>
          <h3>Score how the season was actually run.</h3>
          <p className="muted mt-2 small max-w-[140ch]">Nutrition decides about 1/4 of the yield. Sowing, seed, water, weeds and pests decide the rest. Pick Bad / OK / Best for each lever. The weights and bands come from published agronomic research, cited under each lever. VAN has no historical yield-dose data yet, so treat these weights as a starting hypothesis, not a calibrated model.</p>
        </div>
        <div className="panel-soft px-5 py-4 text-center shrink-0">
          <div className="cap font-bold uppercase tracking-[.06em]">Overall score</div>
          <div className="num" style={{ fontSize: 40, color: 'var(--navy)', lineHeight: 1 }}>{Math.round(total)}<span style={{ fontSize: 18, color: 'var(--muted)' }}>/100</span></div>
          <div className="cap mt-2" style={{ color: 'var(--rust)' }}>Biggest limiter: {primary.name}</div>
        </div>
      </div>

      <div className="grid gap-2 mt-5">
        {rows.map(r => (
          <div key={r.name} className="panel px-4 py-3" style={{ borderColor: r.level === 'bad' ? 'var(--rust)' : r.level === 'best' ? 'var(--green)' : 'var(--line)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <div className="font-bold">{r.name}</div>
                <div className="cap">Weight {r.weight}/100 · scored {Math.round(r.weighted)}</div>
              </div>
              <div className="flex gap-1.5">
                {(['bad', 'ok', 'best'] as Level[]).map(lv => (
                  <button
                    key={lv}
                    onClick={() => set(r.name, lv)}
                    className="btn btn-sm"
                    style={r.level === lv
                      ? { background: lv === 'bad' ? 'var(--rust)' : lv === 'best' ? 'var(--green)' : 'var(--navy)', color: '#fff' }
                      : { background: '#fff', color: 'var(--navy)', border: '1px solid var(--line)' }}
                  >{LEVEL_LABEL[lv]}</button>
                ))}
              </div>
              <button className="cap underline" style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setOpenWhy(w => w === r.name ? null : r.name)}>
                {openWhy === r.name ? 'Hide source' : 'Why this weight?'}
              </button>
            </div>
            {openWhy === r.name && (
              <div className="mt-3 pt-3 small" style={{ borderTop: '1px dashed var(--line)', color: 'var(--muted)' }}>
                <p className="mb-2"><b style={{ color: 'var(--navy)' }}>{LEVEL_LABEL[r.level]}:</b> {r.level === 'bad' ? r.bad : r.level === 'best' ? r.best : r.ok}</p>
                <p className="mb-2">{r.why}</p>
                <p className="cap">Source: {r.source}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="cap mt-4">Weights and thresholds: a starting, research-informed hypothesis. VAN has no historical yield-dose dataset yet to calibrate against. To be revisited after this season's pilot.</p>
    </div>
  )
}
