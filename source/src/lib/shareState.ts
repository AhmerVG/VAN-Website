import { useEffect, useSyncExternalStore } from 'react'

/**
 * WHAT A PAGE'S TOOLS HAVE MADE, FOR THE BOTTOM BAR. 19 Oct 2026 (D-262, D-263, D-266).
 *
 * The bottom bar ("My Wheat plan", "My crop's plan") lives in the shell, outside the page, so until now it could only
 * send a fixed enquiry. A tool that holds the farmer's own state publishes it here, keyed:
 *   calc:<crop>   the dynamic nutrition creator: the same WhatsApp text its own button sends, and its district
 *   list:<crop>   the shopping list, on a crop page that has no creator
 *   soil:district the district picked on the Soil Atlas farmer screens (Teesra Khata)
 * The bar reads it; with nothing published it keeps its old message and link. Nothing is stored beyond the page.
 * Revert: delete this file and its callers' publish/read lines.
 */
export type Shared = { text?: string; active?: boolean; district?: string }

const values = new Map<string, Shared>()
const subs = new Set<() => void>()
const notify = () => subs.forEach(f => f())

export function publishShared(key: string, value: Shared | null) {
  if (value) values.set(key, value)
  else values.delete(key)
  notify()
}

export function useShared(key: string | null | undefined): Shared | undefined {
  return useSyncExternalStore(
    cb => { subs.add(cb); return () => { subs.delete(cb) } },
    () => (key ? values.get(key) : undefined),
    () => (key ? values.get(key) : undefined),
  )
}

/** Publish while mounted; withdraw on unmount, so a value never outlives the tool that made it. */
export function usePublishShared(key: string, value: Shared) {
  const { text, active, district } = value
  useEffect(() => { publishShared(key, { text, active, district }) }, [key, text, active, district])
  useEffect(() => () => publishShared(key, null), [key])
}
