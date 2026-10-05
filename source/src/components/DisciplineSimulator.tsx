import { useEffect, useMemo, useRef, useState } from 'react'
import { CROP_LEVERS, predictYieldMaunds } from '@/data/leverScorecard'

type Level = 'bad' | 'ok' | 'best'
const SCORE: Record<Level, number> = { bad: 0, ok: 50, best: 100 }
const LEVEL_LABEL: Record<Level, string> = { bad: 'Bad', ok: 'OK', best: 'Best' }

/**
 * The real, functional Farm Discipline Simulator — Wheat only, for now (the only crop with a real
 * lever model behind it). Rebuilt 8 Sep 2026 per Tahir's correction: this is a STANDALONE product,
 * reached from the Wheat crop page and the nutrition creator rather than embedded as a section in
 * either, and it shows the farmer ONLY his choices and the resulting yield outcome — never the lever
 * weights, the Bad/OK/Best rationale, or the citations behind them. Those stay in leverScorecard.ts
 * and the internal master framework doc. See that data file for the yield formula's derivation.
 */
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
          <span className="eyebrow">{crop[0].toUpperCase() + crop.slice(1)} · {model.base.label}</span>
          <h2>What yield are you aiming for?</h2>
          <p className="muted mt-2 small max-w-[140ch]">Default is {ceiling.toFixed(1)} maunds/acre. {model.base.label}. Know your own variety does better or worse? Type your own number. Then score how the season is actually being run below. The simulator shows what that gets you, and what would close the gap.</p>
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
              <span className="cap">mds/acre</span>
            </div>
          </div>
          {aboveAverage && <p className="cap mt-2" style={{ color: 'var(--navy)' }}>Above the figure this model is built on. Fine if you know your field or variety supports it.</p>}
        </div>
        <div className="panel-soft px-5 py-4 text-center shrink-0">
          <div className="cap font-bold uppercase tracking-[.06em] balance">This season, as scored below</div>
          <div className="num" style={{ fontSize: 40, color: gap > 0.5 ? 'var(--rust)' : 'var(--green)', lineHeight: 1 }}>{predictedYield.toFixed(1)}</div>
          <div className="cap">maunds/acre</div>
          {gap > 0.5
            ? <div className="cap mt-2" style={{ color: 'var(--rust-text)' }}>{gap.toFixed(1)} mds/acre short of your target</div>
            : <div className="cap mt-2" style={{ color: 'var(--green)' }}>On target</div>}
        </div>
      </div>

      {opportunities.length > 0 && (
        <div className="panel-soft p-5">
          <div className="cap font-bold uppercase tracking-[.06em] mb-2">Your biggest opportunities right now</div>
          <div className="grid gap-1.5">
            {opportunities.map(o => (
              <p key={o.name} className="small">
                <b style={{ color: 'var(--navy)' }}>{o.name}</b>. Currently {LEVEL_LABEL[o.level]}. Getting this to Best could add up to <b>{o.gainToBest.toFixed(1)} maunds/acre</b> <span className="cap" style={{ color: 'var(--muted)' }}>(model estimate, not a trial result)</span>.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* D-151 (QA 21): on a phone the levers run 1,500px and more below the score, so a slim bar keeps
          target, score and gap in view while the levers are tapped. Hidden from lg up, where the score
          panel sits beside the target. Revert: delete this block. */}
      <div className="lg:hidden sticky z-20 panel px-3 py-2 flex items-center justify-between gap-2 small" style={{ top: 'calc(var(--hdr-h) + 4px)', borderColor: 'var(--navy)', boxShadow: 'var(--shadow)' }} aria-live="polite">
        <span>Target <b className="num">{target.toFixed(1)}</b></span>
        <span>Scored <b className="num" style={{ color: gap > 0.5 ? 'var(--rust-text)' : 'var(--green-text)' }}>{predictedYield.toFixed(1)}</b></span>
        <span style={{ color: gap > 0.5 ? 'var(--rust-text)' : 'var(--green-text)' }}>{gap > 0.5 ? <><b className="num">{gap.toFixed(1)}</b> short</> : 'On target'}</span>
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
      <p className="cap">This is a pilot model built from VAN's own agronomy work, not yet calibrated against a full season's results in your district. Treat the yield number as a direction, not a guarantee.</p>
    </div>
  )
}
