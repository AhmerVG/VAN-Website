import { useCallback, useSyncExternalStore } from 'react'

/**
 * ONE ACRES VALUE PER CROP, shared by the shopping list and the nutrition creator. 24 Sep 2026, user
 * review M1: the wheat and potato pages carry both tools, each with its own Acres box, so a farmer who
 * set 5 acres in one got a WhatsApp message for 1 acre from the other. Each component still calls
 * this exactly as it called useState(1); the value simply lives here, keyed by crop, so both boxes
 * move together. Nothing is stored beyond the page session.
 * Revert: replace useSharedAcres(key) with useState(1) in ListBuilder.tsx and NutritionCreator.tsx.
 */
const values = new Map<string, number>()
const subs = new Set<() => void>()

export function useSharedAcres(key: string): [number, (v: number | ((a: number) => number)) => void] {
  const acres = useSyncExternalStore(
    cb => { subs.add(cb); return () => { subs.delete(cb) } },
    () => values.get(key) ?? 1,
    () => values.get(key) ?? 1,
  )
  const set = useCallback((v: number | ((a: number) => number)) => {
    const cur = values.get(key) ?? 1
    const next = typeof v === 'function' ? v(cur) : v
    if (next === cur) return
    values.set(key, next)
    subs.forEach(f => f())
  }, [key])
  return [acres, set]
}
