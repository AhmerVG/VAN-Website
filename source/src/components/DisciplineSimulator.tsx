import { useEffect, useMemo, useRef, useState } from 'react'
import { CROP_LEVERS, predictYieldMaunds } from '@/data/leverScorecard'

type Level = 'bad' | 'ok' | 'best'
const SCORE: Record<Level, number> = { bad: 0, ok: 50, best: 100 }
const LEVEL_LABEL: Record<Level, string> = { bad: 'Bad', ok: 'OK', best: 'Best' }
/** L1 7 Nov 2026 (crops-b m9): a figure prints to 1 decimal only where the decimal carries a value ("150", "22.5"),
 *  was always toFixed(1) ("150.0"). Display only; the calculation is unchanged. */
const f1 = (v: number) => { const t = v.toFixed(1); return t.endsWith('.0') ? t.slice(0, -2) : t }
/** L1 7 Nov 2026 (crops-b m13): a practice name inside a running sentence is in sentence case with "and" for "&"
 *  ("Seed tuber quality and source is scored OK"). The names themselves (Tahir's scorecard) are unchanged. */
const inSentence = (name: string) => name.replace(/ & /g, ' and ').replace(/([\s/(-])([A-Z])(?=[a-z])/g, (_m, a: string, b: string) => a + b.toLowerCase())

/**
 * The real, functional Farm Discipline Simulator — Wheat only, for now (the only crop with a real
 * lever model behind it). Rebuilt 8 Sep 2026 per Tahir's correction: this is a STANDALONE product,
 * reached from the Wheat crop page and the nutrition creator rather than embedded as a section in
 * either, and it shows the farmer ONLY his choices and the resulting yield outcome — never the lever
 * weights, the Bad/OK/Best rationale, or the citations behind them. Those stay in leverScorecard.ts
 * and the internal master framework doc. See that data file for the yield formula's derivation.
 */
/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function DisciplineSimulator({ crop = 'wheat' }: { crop?: string } = {}) {
  // Wheat and potato have real, sourced lever models. A crop without one does not get a simulator at
  // all — it is never quietly given wheat's levers, which would be a different crop's agronomy under
  // this crop's name.
  const model = CROP_LEVERS[crop] ?? CROP_LEVERS.wheat
  const LEVERS = model.levers
  const [levels, setLevels] = useState<Record<string, Level>>(() =>
    Object.fromEntries(LEVERS.map(l => [l.name, 'ok' as Level]))
  )
  // Changing crop changes the whole lever set, so the previous crop's answers are cleared rather
  // than carried across under names that may not even exist in the new set.
  const cropRef = useRef(crop)
  useEffect(() => {
    if (cropRef.current !== crop) {
      cropRef.current = crop
      setLevels(Object.fromEntries(LEVERS.map(l => [l.name, 'ok' as Level])))
    }
  }, [crop, LEVERS])
  // Default target is the Pakistan wheat average yield potential — 60 mds/acre, confirmed by Tahir
  // 9 Sep as already the operative figure (the standing 10% measurement margin is NOT applied on top
  // of it). Per Tahir 9 Sep ("middle ground for now"): this is a DEFAULT, not a hard cap — the farmer
  // can type their own number if they know their own variety or field does better or worse than the
  // national average. A real per-variety picker is future work once VAN supplies that data.
  const ceiling = model.base.operativeMaunds
  const [target, setTarget] = useState(Math.round(ceiling))
  const [targetInput, setTargetInput] = useState(String(Math.round(ceiling)))
  const aboveAverage = target > ceiling + 0.5

  // The typed field and the slider are two controls for one number, so they have to agree. Before
  // this, typing 9999 left the field showing 9999 while the slider clamped to its own maximum, and
  // typing letters emptied the field with no fallback. Same clamping rule as the acres input.
  const targetMax = Math.round(ceiling * 1.3)
  const applyTarget = (raw: string) => {
    setTargetInput(raw)
    const n = Number(raw)
    if (raw.trim() !== '' && !Number.isNaN(n)) setTarget(Math.min(targetMax, Math.max(0, n)))
  }
  const commitTarget = () => {
    const n = Number(targetInput)
    const safe = targetInput.trim() === '' || Number.isNaN(n) ? Math.round(ceiling) : Math.min(targetMax, Math.max(0, Math.round(n)))
    setTarget(safe)
    setTargetInput(String(safe))
  }

  const rows = useMemo(() => LEVERS.map(l => {
    const level = levels[l.name] ?? 'ok'
    const bandScore = SCORE[level]
    const weighted = (l.weight * bandScore) / 100
    // Maunds this lever could still add if moved to Best — shown to the farmer as "opportunity",
    // never as the underlying weight or %.
    const gainToBest = ceiling * (l.weight - weighted) / 100
    return { name: l.name, bad: l.bad, ok: l.ok, best: l.best, level, weighted, gainToBest }
  }), [levels, ceiling, LEVERS])

  const totalScore = rows.reduce((s, r) => s + r.weighted, 0)
  const predictedYield = predictYieldMaunds(totalScore, ceiling)
  const gap = target - predictedYield
  const opportunities = [...rows].filter(r => r.gainToBest > 0.2).sort((a, b) => b.gainToBest - a.gainToBest).slice(0, 3)

  const set = (name: string, level: Level) => setLevels(s => ({ ...s, [name]: level }))

  return (
    <div className="grid gap-6">
      <div className="panel p-5 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center" style={{ borderColor: 'var(--navy)', borderWidth: 2 }}>
        <div>
          <span className="eyebrow">{crop[0].toUpperCase() + crop.slice(1)} · default yield target</span>
          <h2>What yield are you aiming for?</h2>
          {/* Tahir 7 Nov 2026 (CR-19): was "..., VAN’s working figure for this crop ({label})." */}
          {/* L1 7 Nov 2026 (crops-b m16): on wheat the default is tied to a type of farmer, not a variety, so the next sentence is "If you expect a higher or lower yield, ..."; potato keeps the variety sentence. */}
          <p className="muted mt-2 small max-w-[140ch]">The default target is {Math.round(ceiling)} maunds per acre: VAN’s assumed yield {crop === 'potato' ? `for the variety ${model.base.label}` : `for a good progressive ${crop} farmer`}. {crop === 'potato' ? 'If your variety yields more or less, type your own number.' : 'If you expect a higher or lower yield, type your own number.'} Then score your season below. The simulator estimates the yield that your scores would give, and shows which practices would add the most yield towards your target.</p>
          <div className="flex items-center gap-3 mt-4">
            <input
              type="range" min={0} max={targetMax} step={1} value={target}
              onChange={e => applyTarget(e.target.value)}
              style={{ flex: 1, accentColor: 'var(--gold)' }}
              aria-label="Target yield, maunds per acre"
            />
            <div className="panel-soft px-2 py-1.5 flex items-center gap-1 shrink-0">
              <input
                type="number" min={0} max={targetMax} value={targetInput}
                onChange={e => applyTarget(e.target.value)}
                onBlur={commitTarget}
                className="num font-bold text-center" style={{ fontSize: 20, color: 'var(--navy)', width: 56, border: 'none', background: 'transparent' }}
                aria-label="Type your own target yield, maunds per acre"
              />
              <span className="cap">maunds/acre</span>
            </div>
          </div>
          {aboveAverage && <p className="cap mt-2" style={{ color: 'var(--navy)' }}>This target is above the figure the model is built on. That is fine if you know your field or variety can reach it.</p>}
        </div>
        <div className="panel-soft px-5 py-4 text-center shrink-0">
          <div className="cap font-bold uppercase tracking-[.06em] balance">Estimated yield from your scores below, which all start at OK (model estimate)</div>
          <div className="num" style={{ fontSize: 40, color: gap > 0.5 ? 'var(--rust)' : 'var(--green)', lineHeight: 1 }}>{f1(predictedYield)}</div>
          <div className="cap">maunds/acre</div>
          {gap > 0.5
            ? <div className="cap mt-2" style={{ color: 'var(--rust-text)' }}>{f1(gap)} maunds per acre below your target</div>
            : <div className="cap mt-2" style={{ color: 'var(--green)' }}>On target</div>}
        </div>
      </div>

      {opportunities.length > 0 && (
        <div className="panel-soft p-5">
          <div className="cap font-bold uppercase tracking-[.06em] mb-2">Where the most yield could be gained (model estimates, not trial results)</div>
          <div className="grid gap-1.5">
            {opportunities.map(o => (
              <p key={o.name} className="small">
                <b style={{ color: 'var(--navy)' }}>{inSentence(o.name)}</b> is scored {LEVEL_LABEL[o.level]}. Raising it to Best could add up to <b>{f1(o.gainToBest)} maunds per acre</b>.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* D-151 (QA 21): on a phone the levers run 1,500px and more below the score, so a slim bar keeps
          target, score and gap in view while the levers are tapped. Hidden from lg up, where the score
          panel sits beside the target. Revert: delete this block. */}
      <div className="lg:hidden sticky z-20 panel px-3 py-2 flex items-center justify-between gap-2 small" style={{ top: 'calc(var(--hdr-h) + 4px)', borderColor: 'var(--navy)', boxShadow: 'var(--shadow)' }} aria-live="polite">
        <span>Target <b className="num">{f1(target)}</b></span>
        <span>Estimated <b className="num" style={{ color: gap > 0.5 ? 'var(--rust-text)' : 'var(--green-text)' }}>{f1(predictedYield)}</b></span>
        <span style={{ color: gap > 0.5 ? 'var(--rust-text)' : 'var(--green-text)' }}>{gap > 0.5 ? <><b className="num">{f1(gap)}</b> below target</> : 'On target'}</span>
      </div>

      <div className="grid gap-2">
        {rows.map(r => (
          <div key={r.name} className="panel px-4 py-3" style={{ borderColor: r.level === 'bad' ? 'var(--rust)' : r.level === 'best' ? 'var(--green)' : 'var(--line)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <div className="font-bold">{r.name}</div>
                <div className="small muted mt-1">{r.level === 'bad' ? r.bad : r.level === 'best' ? r.best : r.ok}</div>
              </div>
              <div className="flex gap-1.5">
                {(['bad', 'ok', 'best'] as Level[]).map(lv => (
                  <button
                    key={lv}
                    onClick={() => set(r.name, lv)}
                    className="btn btn-sm"
                    aria-pressed={r.level === lv}
                    aria-label={`${r.name}: ${LEVEL_LABEL[lv]}`}
                    style={r.level === lv
                      ? { background: lv === 'bad' ? 'var(--rust)' : lv === 'best' ? 'var(--green)' : 'var(--navy)', color: '#fff' }
                      : { background: '#fff', color: 'var(--navy)', border: '1px solid var(--line)' }}
                  >{LEVEL_LABEL[lv]}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="cap">This is a pilot model built from VAN’s own agronomy work. It has not yet been checked against a full season’s field results, so use the yield figure as a rough guide to which practices matter most, not as a forecast for your field.</p>
    </div>
  )
}
