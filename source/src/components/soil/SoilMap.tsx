import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SOIL_GRID } from '@/data/soil'
import { SOIL_SOURCE, SOIL_COPY } from '@/data/soilLens'
import { ANALYTES, GRID, type AtlasCell, analyteByKey, colourFor, fmtVal, rampCss, districtName, thousands, type AnalyteKey } from '@/lib/soil'
import { useInView, useReducedMotion, useIsDesktop } from '@/hooks/useInView'

const CYCLE_MS = 2500, TRANS_MS = 700, REVEAL_MS = 1900
/** The four a partner formulates against. The other four describe the ground they land in. */
const NUTRIENT_KEYS: AnalyteKey[] = ['p', 'k', 'zn', 'b']

type Props = {
  /** The analyte to start on (the map owns the switch after that). */
  initial?: AnalyteKey
  /** Home version: pH only, colours in once, no switcher. */
  mini?: boolean
  /** District key to hold in focus — every other cell is dimmed. */
  focus?: string | null
  onPick?: (districtKey: string) => void
  /** Cycle through the analytes once when scrolled into view, then rest on `initial`. */
  autoplay?: boolean
  /**
   * 10 Sep 2026. The map can now be driven from outside — the soil page's vitals tiles and the
   * district matrix both set the analyte, so pressing "Potash" up in the readings redraws the ground
   * below. Leave both undefined and the map behaves exactly as it always did, which is what the home
   * page and the national page still want.
   */
  analyte?: AnalyteKey
  onAnalyte?: (k: AnalyteKey) => void
  maxHeight?: number
  className?: string
}

/** The living map — SOIL_GRID cells drawn as squares on a canvas, coloured by the selected analyte. No boundary file, no interpolation. */
export function SoilMap({ initial = 'ph', mini = false, focus = null, onPick, autoplay = true, maxHeight = 640, className = '', analyte: driven, onAnalyte }: Props) {
  const rm = useReducedMotion()
  const desktop = useIsDesktop()
  const { ref: hostRef, inView } = useInView<HTMLDivElement>({ threshold: 0.25 })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [analyte, setAnalyteRaw] = useState<AnalyteKey>(mini ? 'ph' : initial)
  // One writer at a time: a driven value pushes down, a click inside pushes up. Keeping the internal
  // state as the single source the canvas reads means the autoplay cycle needs no special case.
  const setAnalyte = (k: AnalyteKey) => { setAnalyteRaw(k); onAnalyte?.(k) }
  useEffect(() => { if (driven && driven !== analyte) { setAnalyteRaw(driven); setDone(true); setCycle(null); setPlaying(false) } }, [driven]) // eslint-disable-line react-hooks/exhaustive-deps
  const [labels, setLabels] = useState(true)
  const [playing, setPlaying] = useState(!rm)
  const [cycle, setCycle] = useState<number | null>(null)   // index into ANALYTES while the autoplay cycle runs
  const [done, setDone] = useState(false)
  const [tip, setTip] = useState<{ x: number; y: number; cell: AtlasCell } | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0, ch: 0 })

  // ---- colour buffers ----
  const n = GRID.cells.length
  const disp = useRef(new Float32Array(n * 3))
  const target = useRef(new Float32Array(n * 3))
  const from = useRef(new Float32Array(n * 3))
  const nullMask = useRef(new Uint8Array(n))
  const transStart = useRef<number | null>(null)
  const revealStart = useRef<number | null>(null)
  const revealDone = useRef(false)
  const raf = useRef(0)
  const stateRef = useRef({ analyte, focus, labels, desktop, mini })
  stateRef.current = { analyte, focus, labels, desktop, mini }

  const fillTarget = (a: AnalyteKey, into: Float32Array) => {
    for (let i = 0; i < n; i++) {
      const c = GRID.cells[i]
      const rgb = colourFor(a, c[a])
      if (!rgb) { nullMask.current[i] = 1; into[i * 3] = 236; into[i * 3 + 1] = 238; into[i * 3 + 2] = 240; continue }
      nullMask.current[i] = 0
      into[i * 3] = rgb[0]; into[i * 3 + 1] = rgb[1]; into[i * 3 + 2] = rgb[2]
    }
  }

  // size to the host
  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => {
      const w = host.clientWidth
      const ch = Math.max(2, Math.min(w / (GRID.cols * GRID.xScale), maxHeight / GRID.rows))
      setSize({ w: Math.round(GRID.cols * GRID.xScale * ch), h: Math.round(GRID.rows * ch), ch })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [maxHeight]) // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (now: number) => {
    const cv = canvasRef.current
    if (!cv || !size.w) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    if (cv.width !== Math.round(size.w * dpr)) { cv.width = Math.round(size.w * dpr); cv.height = Math.round(size.h * dpr) }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size.w, size.h)
    const { focus: f, labels: lb, desktop: dk, mini: mn } = stateRef.current
    const ch = size.ch, cw = ch * GRID.xScale
    // transition progress
    let t = 1
    if (transStart.current != null) { t = Math.min(1, (now - transStart.current) / TRANS_MS); if (t >= 1) transStart.current = null }
    const te = 1 - Math.pow(1 - t, 3)
    // reveal progress
    let rv = 1
    if (revealStart.current != null) { rv = Math.min(1, (now - revealStart.current) / REVEAL_MS); if (rv >= 1) { revealStart.current = null; revealDone.current = true } }
    else if (!revealDone.current) rv = 0
    const d = disp.current, tg = target.current, fr = from.current
    for (let i = 0; i < n; i++) {
      const c = GRID.cells[i]
      if (t < 1) { d[i * 3] = fr[i * 3] + (tg[i * 3] - fr[i * 3]) * te; d[i * 3 + 1] = fr[i * 3 + 1] + (tg[i * 3 + 1] - fr[i * 3 + 1]) * te; d[i * 3 + 2] = fr[i * 3 + 2] + (tg[i * 3 + 2] - fr[i * 3 + 2]) * te }
      else { d[i * 3] = tg[i * 3]; d[i * 3 + 1] = tg[i * 3 + 1]; d[i * 3 + 2] = tg[i * 3 + 2] }
      const px = (c.x - GRID.minX) * cw, py = (GRID.maxY - c.y) * ch
      let a = 1
      if (rv < 1) { const rowFrac = (GRID.maxY - c.y) / GRID.rows; a = Math.max(0, Math.min(1, (rv * 1.3 - rowFrac) * 4)) }
      if (f && c.dist !== f) a *= 0.18
      if (a <= 0) continue
      ctx.fillStyle = `rgba(${d[i * 3] | 0},${d[i * 3 + 1] | 0},${d[i * 3 + 2] | 0},${a})`
      ctx.fillRect(px, py, cw + 0.6, ch + 0.6)
      if (nullMask.current[i]) { ctx.fillStyle = `rgba(20,35,26,${0.18 * a})`; ctx.fillRect(px, py, cw + 0.6, ch * 0.5) }
    }
    // centroids
    if (!mn && rv >= 1) {
      ctx.textAlign = 'center'
      for (const [key, [lon, lat]] of Object.entries(SOIL_GRID.centroids)) {
        const px = (lon / GRID.deg - GRID.minX) * cw + cw / 2, py = (GRID.maxY - lat / GRID.deg) * ch + ch / 2
        const on = f === key
        ctx.beginPath(); ctx.arc(px, py, on ? 5 : 3.2, 0, Math.PI * 2)
        ctx.fillStyle = on ? '#D9A21B' : '#fff'; ctx.fill()
        ctx.lineWidth = on ? 2 : 1.2; ctx.strokeStyle = '#14231A'; ctx.stroke()
        if (lb && dk) {
          const name = districtName(key)
          ctx.font = `${on ? 700 : 600} ${on ? 12 : 10.5}px Public Sans, system-ui, sans-serif`
          ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineJoin = 'round'
          ctx.strokeText(name, px, py - 7)
          ctx.fillStyle = '#14231A'; ctx.fillText(name, px, py - 7)
        }
      }
    }
    if (t < 1 || (rv < 1)) raf.current = requestAnimationFrame(draw)
  }
  const kick = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(draw) }

  // initial colours + analyte switch
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { fillTarget(analyte, target.current); disp.current.set(target.current); first.current = false }
    else {
      from.current.set(disp.current)
      fillTarget(analyte, target.current)
      transStart.current = rm ? null : performance.now()
      if (rm) disp.current.set(target.current)
    }
    kick()
  }, [analyte]) // eslint-disable-line react-hooks/exhaustive-deps

  // redraw on size / focus / labels
  useEffect(() => { kick() }, [size, focus, labels, desktop]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  // reveal when scrolled into view
  useEffect(() => {
    if (!inView || revealDone.current || revealStart.current != null) return
    if (rm) { revealDone.current = true; kick(); return }
    revealStart.current = performance.now()
    kick()
  }, [inView, rm]) // eslint-disable-line react-hooks/exhaustive-deps

  // Autoplay cycle: once through the analytes, then rest on whatever the page opened on. It used to
  // rest on pH whatever it started from, which is how the soil page ended up always sitting on pH
  // even when Tahir asked for it to open on a nutrient.
  useEffect(() => {
    if (mini || !autoplay || rm || !inView || done || !playing) return
    if (cycle === null) { const t = window.setTimeout(() => setCycle(1), REVEAL_MS + 900); return () => window.clearTimeout(t) }
    if (cycle >= ANALYTES.length) { setAnalyte(initial); setDone(true); setCycle(null); return }
    setAnalyte(ANALYTES[cycle].key)
    const t = window.setTimeout(() => setCycle(c => (c ?? 0) + 1), CYCLE_MS)
    return () => window.clearTimeout(t)
  }, [mini, autoplay, rm, inView, done, playing, cycle]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (k: AnalyteKey) => { setAnalyte(k); setDone(true); setCycle(null); setPlaying(false) }
  const togglePlay = () => {
    if (playing && cycle !== null) { setPlaying(false); return }
    setDone(false); setCycle(ANALYTES.findIndex(a => a.key === analyte)); setPlaying(true)
  }

  const cellAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - r.left, cy = e.clientY - r.top
    const gx = Math.floor(cx / (size.ch * GRID.xScale)) + GRID.minX
    const gy = GRID.maxY - Math.floor(cy / size.ch)
    return { cell: GRID.byKey.get(`${gx},${gy}`) ?? null, cx, cy }
  }
  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => { const { cell, cx, cy } = cellAt(e); setTip(cell ? { x: cx, y: cy, cell } : null) }
  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => { const { cell, cx, cy } = cellAt(e); if (cell) { setTip({ x: cx, y: cy, cell }); onPick?.(cell.dist) } }

  const A = analyteByKey(analyte)
  const mid = (A.lo + A.hi) / 2
  const cycling = playing && cycle !== null && !done

  return (
    <div className={className}>
      {!mini && (
        <div className="grid gap-2 mb-3">
          {/* 10 Sep 2026, Tahir: "the heat map is wonderful and it should show as default nutrients."
              Eight chips in one undifferentiated row gave no clue that four of them are nutrients a
              partner formulates against and four describe the ground those nutrients land in. Same
              eight, in two named groups, nutrients first. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2" role="tablist" aria-label="Analyte">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>Nutrients</span>
              {ANALYTES.filter(a => NUTRIENT_KEYS.includes(a.key)).map(a => <button key={a.key} role="tab" aria-selected={analyte === a.key} className={`chip chip-xs ${analyte === a.key ? 'soil on' : ''}`} onClick={() => pick(a.key)} title={a.label}>{a.short}</button>)}
            </span>
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="cap" style={{ fontWeight: 700, color: 'var(--navy)' }}>The ground</span>
              {ANALYTES.filter(a => !NUTRIENT_KEYS.includes(a.key)).map(a => <button key={a.key} role="tab" aria-selected={analyte === a.key} className={`chip chip-xs ${analyte === a.key ? 'soil on' : ''}`} onClick={() => pick(a.key)} title={a.label}>{a.short}</button>)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`btn btn-sm ${cycling ? 'btn-navy' : 'btn-gold'}`} onClick={togglePlay} aria-pressed={cycling}>{cycling ? '❚❚ Pause' : done ? '▶ Play the cycle again' : '▶ Play'}</button>
            <span className="cap" style={{ color: 'var(--gold-text)' }}>▸ Pick an analyte · hover · tap for a district</span>
            {desktop && <button className={`chip chip-xs ml-auto ${labels ? 'on' : ''}`} onClick={() => setLabels(l => !l)} aria-pressed={labels}>Labels {labels ? 'on' : 'off'}</button>}
          </div>
        </div>
      )}
      <div ref={hostRef} className="soil-map" style={{ minHeight: size.h || 200 }}>
        <div className="flex justify-center">
          <canvas ref={canvasRef} style={{ width: size.w || '100%', height: size.h || 'auto', cursor: onPick ? 'pointer' : 'crosshair' }} onMouseMove={onMove} onMouseLeave={() => setTip(null)} onClick={onClick} role="img" aria-label={`Map of Punjab soil samples coloured by ${A.label}`} />
        </div>
        {tip && (
          <div className="soil-tip" style={{ left: tip.x + (size.w ? (hostRef.current!.clientWidth - size.w) / 2 : 0), top: tip.y }}>
            <b>{districtName(tip.cell.dist)}</b> · {thousands(tip.cell.n)} samples<br />{A.label}: median {fmtVal(analyte, tip.cell[analyte])} · mean {fmtVal(analyte, tip.cell.mean[analyte])}
          </div>
        )}
      </div>
      <div className="mt-3 grid gap-2">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="font-bold" style={{ fontSize: 15 }}>{A.label}{A.unit ? ` · ${A.unit}` : ''} <span className="cap font-normal">· {A.note}</span></div>
          {!mini && cycling && <div className="cap">cycling · {Math.min((cycle ?? 0) + 1, ANALYTES.length)} of {ANALYTES.length}</div>}
        </div>
        <div className="legend">
          <span className="num">{A.lo.toFixed(A.dec)}</span>
          <div className="bar" style={{ background: rampCss(analyte) }} />
          <span className="num">{A.hi.toFixed(A.dec)}{A.unit ? ` ${A.unit}` : ''}</span>
        </div>
        <div className="legend" style={{ marginTop: -6 }}><span /><span className="mid num">{mid.toFixed(A.dec)}</span><span /></div>
        <p className="cap">{mini ? 'Every square is the median of the georeferenced samples inside it.' : SOIL_COPY.mapLead} {analyte === 'zn' ? 'Hatched squares carry no zinc determination (Jhelum). ' : ''}{thousands(GRID.cells.length)} cells of 0.05°, {mini ? 'no boundary file, no interpolation, ' : ''}no district polygons.</p>{/* D-244: on the full map the lead above already says no boundary file, no interpolation */}
        <p className="src"><b>Source ·</b> {SOIL_SOURCE.short}. <a href="#/soil#caveats">Read this before quoting ›</a></p>
      </div>
    </div>
  )
}
