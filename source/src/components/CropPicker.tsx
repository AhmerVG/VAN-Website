import { useMemo, useState } from 'react'
import { CROPS } from '@/data/catalogue'
import { cropSlug, groupedCrops, GROUP_COLOUR, sowingLabel } from '@/lib/season'
import { LIVE_CALC_CROPS, hasCalculator } from '@/data/costPlans'
import { LiveCalcTag } from './bits'
import { CROP_WORDS, exactMatch, slipCost } from '@/lib/findWords'

/** "What do you grow?" — search box + 28 chips grouped. Pick one → its plan page. */
export function CropPicker({ big = true, showSowing = false }: { big?: boolean; showSowing?: boolean }) {
  const [q, setQ] = useState('')
  // D-255: the local names too (gandum, kapaas…). When nothing matches exactly, the crops 1 slip
  // away (wheet, cotten), only the closest ones; and then Go does not jump, because a guess must be
  // the farmer's to confirm by tapping it ("Did you mean").
  const { list, guessed } = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return { list: CROPS, guessed: false }
    const hay = (c: typeof CROPS[number]) => `${c.name} ${c.programme} ${c.groupLabel} ${CROP_WORDS[cropSlug(c)] ?? ''}`
    const exact = CROPS.filter(c => exactMatch(hay(c), t))
    if (exact.length) return { list: exact, guessed: false }
    // Slips are forgiven against the crop's own names only, never its programme title ("boran" is
    // not the Tomato "K-Boron-Calcium programme").
    const near = CROPS.map(c => ({ c, d: slipCost(`${c.name} ${CROP_WORDS[cropSlug(c)] ?? ''}`, t) })).filter(x => x.d >= 0)
    const best = Math.min(...near.map(x => x.d))
    return { list: near.filter(x => x.d === best).map(x => x.c), guessed: near.length > 0 }
  }, [q])
  // D-144, owner's ruling 1: crops with a live calculator first, tagged; the rest keep their groups.
  // Revert: `const groups = groupedCrops(list)` and `const first = list[0]`, and drop `live`.
  const live = LIVE_CALC_CROPS.map(sl => list.find(c => cropSlug(c) === sl)).filter(Boolean) as typeof list
  const groups = groupedCrops(list.filter(c => !hasCalculator(cropSlug(c))))
  const first = guessed && list.length > 1 ? undefined : (live[0] ?? list[0])
  return (
    <div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (first) window.location.hash = `#/crops/${cropSlug(first)}` }} role="search">
        <label className="sr" htmlFor="crop-q">Search your crop</label>
        <input id="crop-q" className={`input ${big ? 'input-lg' : ''}`} placeholder="Type your crop. Wheat, cotton, mango…" value={q} onChange={e => setQ(e.target.value)} autoComplete="off" />
        <button type="submit" className="btn btn-gold shrink-0" disabled={!first} aria-label="Open the first matching crop">Go</button>
      </form>
      {guessed && <p className="mt-4 muted">No crop by exactly that name. Did you mean {list.length > 1 ? 'one of these' : 'this one'}? Tap it to open its plan.</p>}
      {q && !list.length && <p className="mt-4 muted">No crop by that name among the {CROPS.length} programmes. Try the group names below, or ask on WhatsApp.</p>}
      <div className="mt-5 grid gap-5">
        {live.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 cap font-bold uppercase tracking-[.1em]"><i style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--green)' }} />Live calculator · {live.length}</div>
            <div className="flex flex-wrap gap-2">
              {live.map(c => (
                <a key={c.name} href={`#/crops/${cropSlug(c)}`} className={`chip ${big ? '' : 'chip-sm'}`} style={{ borderColor: 'var(--line-2)' }}>
                  <span>{c.name}</span>
                  <LiveCalcTag compact />
                  {showSowing && <span className="cap">{sowingLabel(c)}</span>}
                </a>
              ))}
            </div>
          </div>
        )}
        {groups.map(g => (
          <div key={g.group}>
            <div className="flex items-center gap-2 mb-2 cap font-bold uppercase tracking-[.1em]"><i style={{ width: 10, height: 10, borderRadius: 3, background: GROUP_COLOUR[g.group] }} />{g.label} · {g.crops.length}</div>
            <div className="flex flex-wrap gap-2">
              {g.crops.map(c => (
                <a key={c.name} href={`#/crops/${cropSlug(c)}`} className={`chip ${big ? '' : 'chip-sm'}`} style={{ borderColor: 'var(--line-2)' }}>
                  <span>{c.name}</span>
                  {showSowing && <span className="cap">{sowingLabel(c)}</span>}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
