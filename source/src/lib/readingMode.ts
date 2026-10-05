import { useEffect, useState } from 'react'

/**
 * PLAIN MODE — added 9 Sep 2026.
 *
 * Four audits said the same thing in different words: the site has one register and it is the
 * technical one. Every page argues its case before it answers the question, which is right for an
 * agronomist and wrong for a grower who wants to know what to put on the field this week.
 *
 * The answer here is deliberately NOT a second, simplified site. Two versions of the same agronomy
 * is two versions to keep correct, and the simplified one always ends up the stale one. Instead this
 * is one switch over one site: in Plain mode the pages that carry an argument show the answer and
 * fold the argument behind a control that says exactly what is behind it.
 *
 * THE RULE THAT MATTERS, and it is enforced by where <Detail> is used, not by this file:
 * NOTHING A FARMER NEEDS IN ORDER TO ACT SAFELY MAY BE FOLDED AWAY. Rates, quantities, methods,
 * pack sizes, the per-tree and per-200-litre bases, the salinity advisory, the "this is not a
 * substitute for a soil test" line and every source note stay visible in both modes. What folds is
 * argument, evidence and background — the parts that persuade rather than instruct.
 *
 * The choice is remembered per browser. It is a convenience, not data: if storage is unavailable or
 * throws, the site simply opens in full mode.
 */
const KEY = 'van.plain'
const listeners = new Set<(v: boolean) => void>()
let current = read()

function read(): boolean {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

export function setPlainMode(v: boolean) {
  current = v
  try { localStorage.setItem(KEY, v ? '1' : '0') } catch { /* private mode, blocked storage. The mode still works for this visit */ }
  for (const fn of listeners) fn(v)
}

export function usePlainMode(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(current)
  useEffect(() => {
    listeners.add(setV)
    // A second tab, or the pre-rendered page hydrating after the bundle loads.
    setV(read())
    return () => { listeners.delete(setV) }
  }, [])
  return [v, setPlainMode]
}

/* ── URDU ─────────────────────────────────────────────────────────────────────────────────────
 * The same shape as Plain mode, and deliberately a SEPARATE switch: a grower who wants Urdu labels
 * does not necessarily want the evidence folded away, and an agronomist reading the full page may
 * still want the Urdu. Tying them together would have been fewer lines and the wrong behaviour.
 */
const UR_KEY = 'van.urdu'
const urListeners = new Set<(v: boolean) => void>()
let urCurrent = readUr()

function readUr(): boolean {
  try { return localStorage.getItem(UR_KEY) === '1' } catch { return false }
}

export function setUrduMode(v: boolean) {
  urCurrent = v
  try { localStorage.setItem(UR_KEY, v ? '1' : '0') } catch { /* storage blocked. The mode still works for this visit */ }
  for (const fn of urListeners) fn(v)
}

/**
 * O-2, 9 Sep 2026 (Tahir): "urdu.. switch it off from web and keep it."
 *
 * The switch is off; the layer is intact. This flag is the ONLY thing that has to change to bring it
 * back, and it is gated here rather than only in the header so that a reader who turned Urdu on
 * yesterday does not still see Urdu today with no way to turn it off. One flag, whole site.
 */
export const URDU_ON = false

export function useUrduMode(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(URDU_ON && urCurrent)
  useEffect(() => {
    if (!URDU_ON) { setV(false); return }
    urListeners.add(setV)
    setV(readUr())
    return () => { urListeners.delete(setV) }
  }, [])
  return [URDU_ON && v, setUrduMode]
}
