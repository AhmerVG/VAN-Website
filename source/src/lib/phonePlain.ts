import { useEffect } from 'react'
import { setPlainMode } from '@/lib/readingMode'

/**
 * D-199, Tahir 27 Sep 2026: "Crop pages open in Simple view on phones." A grower on a phone gets the
 * plan, the list and the tools first; the argument is 1 tap away (the View switch). Applied ONCE per
 * browser, only when the reader has never touched the switch (no stored choice), only under 768px.
 * His own choice, either way, is never overridden.
 * R5, Tahir 18 Oct 2026: every phone visitor, on every page (called once from the Header); the
 * crop-page calls stay and do nothing more. Revert: remove the call in Shell.tsx Header.
 */
export function usePhonePlainDefault() {
  useEffect(() => {
    try {
      if (localStorage.getItem('van.plain') !== null) return
      // A phone: narrow AND a touch screen, so a narrow desktop window is not saved as a choice.
      if (window.innerWidth < 768 && window.matchMedia('(hover: none) and (pointer: coarse)').matches) setPlainMode(true)
    } catch { /* no storage: full view */ }
  }, [])
}
