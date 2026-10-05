import { useLayoutEffect, useRef, useState } from 'react'

/**
 * D-151 (QA 5): chart text at least 11px on a phone.
 *
 * A chart drawn in a fixed viewBox shrinks everything, text included, when its box is narrower than
 * the design width: a 14-unit label in a 620-unit chart on a 280px phone renders at 6.3px. This hook
 * measures the box the chart sits in and returns W = that width in CSS pixels, capped at the design
 * width. A chart that lays itself out in W units then draws 1 unit = 1 px on a phone, so its font
 * sizes are real pixels, and is exactly as before on a screen at least as wide as its design.
 * `narrow` is true when the chart should switch to its phone layout.
 */
export function useFitWidth<T extends HTMLElement = HTMLDivElement>(designW: number, minW = 240) {
  const ref = useRef<T>(null)
  const [W, setW] = useState(designW)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const cw = el.getBoundingClientRect().width
      if (cw > 0) setW(Math.round(Math.max(minW, Math.min(designW, cw))))
    }
    update()
    if (!('ResizeObserver' in window)) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [designW, minW])
  return { ref, W, narrow: W < designW * 0.8 }
}
