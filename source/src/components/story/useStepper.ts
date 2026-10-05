import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '@/hooks/useInView'

/**
 * A step player shared by the About growth story and the potash loop (26 Sep 2026). It plays through
 * the steps once when it first comes into view, stops on the last, and any press of a control hands
 * the reader the controls for good. Under reduced motion it opens on the last step and never plays.
 */
export function useStepper(n: number, ms = 2600, startAtEnd = false) {
  const rm = useReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })
  const [i, setIRaw] = useState(rm || startAtEnd ? n - 1 : 0)
  const [playing, setPlaying] = useState(false)
  const started = useRef(false)
  useEffect(() => { if (rm) { setIRaw(n - 1); setPlaying(false) } }, [rm, n])
  useEffect(() => {
    if (inView && !started.current && !rm) { started.current = true; setIRaw(0); setPlaying(true) }
  }, [inView, rm])
  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => {
      setIRaw(x => { if (x >= n - 1) { setPlaying(false); return x } return x + 1 })
    }, ms)
    return () => clearTimeout(t)
  }, [playing, i, n, ms])
  const setI = (k: number) => { setPlaying(false); setIRaw(Math.max(0, Math.min(n - 1, k))) }
  const toggle = () => { if (playing) setPlaying(false); else { if (i >= n - 1) setIRaw(0); setPlaying(true) } }
  return { ref, i, setI, playing, toggle, rm }
}
