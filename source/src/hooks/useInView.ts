import { useEffect, useRef, useState } from 'react'

/** True once the element has been scrolled into view (sticky by default). */
export function useInView<T extends HTMLElement = HTMLDivElement>(opts: { threshold?: number; once?: boolean; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const { threshold = 0.12, once = true, rootMargin = '0px 0px -5% 0px' } = opts
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { setInView(true); if (once) io.disconnect() }
        else if (!once) setInView(false)
      }
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once, rootMargin])
  return { ref, inView }
}

export function useReducedMotion() {
  const [rm, setRm] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const fn = () => setRm(mq.matches)
    mq.addEventListener?.('change', fn)
    return () => mq.removeEventListener?.('change', fn)
  }, [])
  return rm
}

export function useIsDesktop(bp = 1024) {
  const [d, setD] = useState(() => typeof window !== 'undefined' && window.innerWidth >= bp)
  useEffect(() => {
    const fn = () => setD(window.innerWidth >= bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return d
}

/**
 * Counts up to `target` once `active` is true. Tabular figures; respects reduced motion.
 *
 * FIXED 9 Sep 2026 — this shipped "0.00 mean pH" and "≈ 0 % nitrogen uptake" into the static HTML,
 * which an independent audit called the worst thing on the site, and it was right: the soil page's
 * whole authority rests on 8.22, and the file said 0.00.
 *
 * Two faults, both here:
 *   1. `useState(0)` meant the FIRST render was always zero. Whatever the animation did afterwards,
 *      the pre-rendered file and any reader without JavaScript got a zero.
 *   2. `if (!active) return` ran BEFORE the reduced-motion check, so a counter the build never
 *      scrolled into view never reached `setV(target)` at all. The 8 Sep fix made the builder scroll
 *      and emulate reduced motion, which patched the symptom for the counters it happened to reach.
 *
 * Now the value STARTS at the truth. The pre-rendered HTML therefore always carries the real figure,
 * with or without JavaScript, in view or not. The animation is a browser-only embellishment: on mount
 * a counter that is still off-screen drops to zero where nobody can see it and counts up when it
 * arrives. A wrong number can no longer reach a file, whatever the build does.
 */
export function useCountUp(target: number, active: boolean, duration = 1100, decimals = 0) {
  const rm = useReducedMotion()
  const [v, setV] = useState(target)
  useEffect(() => {
    if (rm) { setV(target); return }
    if (!active) { setV(0); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - p, 3)
      setV(+(target * e).toFixed(decimals))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setV(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration, decimals, rm])
  return v
}

/** Which of `ids` is currently in view (the last whose top passed a line 38% down the viewport), plus reading progress 0–1. */
export function useSectionIndex(ids: string[]) {
  const [current, setCurrent] = useState(ids[0] ?? '')
  const [progress, setProgress] = useState(0)
  const key = ids.join('|')
  useEffect(() => {
    const list = key.split('|')
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      const line = window.innerHeight * 0.38
      let best = list[0] ?? ''
      for (const id of list) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) best = id
      }
      setCurrent(best)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [key])
  return { current, progress }
}

/** Hover tooltip inside a `.chart` / `.soil-map` host. */
export function useTip() {
  const [tip, setTip] = useState<{ x: number; y: number; html: string } | null>(null)
  const show = (e: { clientX: number; clientY: number; currentTarget: EventTarget | null }, html: string, hostSel = '.chart') => {
    const host = (e.currentTarget as Element | null)?.closest(hostSel) as HTMLElement | null
    if (!host) return
    const r = host.getBoundingClientRect()
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, html })
  }
  const hide = () => setTip(null)
  return { tip, show, hide }
}
