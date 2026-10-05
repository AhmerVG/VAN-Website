import { useEffect } from 'react'
import { setPlainMode } from '@/lib/readingMode'

/**
 * D-199, Tahir 27 Sep 2026: "Crop pages open in Simple view on phones." A grower on a phone gets the
 * plan, the list and the tools first; the argument is 1 tap away (the View switch). Applied ONCE per
 * browser, only when the reader has never touched the switch (no stored choice), only under 768px.
 * His own choice, either way, is never overridden. Revert: remove the 2 calls to usePhonePlainDefault.
 */
export function usePhonePlainDefault() {
  useEffect(() => {
    try {
      if (localStorage.getItem('van.plain') !== null) return
      if (window.innerWidth < 768) setPlainMode(true)
    } catch { /* no storage: full view */ }
  }, [])
}
