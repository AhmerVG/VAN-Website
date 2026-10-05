import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { mountLens } from '@/lens/lensEngine'

/* D-246, 2 Oct 2026: the Pakistan nutrient lenses, ported from the audited demo.
   The data (FAO via Our World in Data, plus the Punjab potash model) is one file,
   site-root/data/lenses.json, fetched once per visit and shared by every lens on the page.
   All unit conversion (per hectare to per acre, tonnes to maunds) happens in the engine. */

export type LensSpec = { id: string; opts?: string[]; opt?: string; year?: number; tab?: string; topic?: string }

let dataPromise: Promise<unknown> | null = null
function loadData() {
  if (!dataPromise) {
    // Resolved against the bundle's own URL, so it works at any page depth.
    // The static pages load the bundle as <script defer src="../demo.<hash>.js">, the dev build as a module.
    const script = [...document.querySelectorAll<HTMLScriptElement>('script[src]')].find(s => /\/(demo|v|index)\.[0-9a-f]+\.js$/.test(s.src))
      ?? document.querySelector<HTMLScriptElement>('script[type="module"][src]')
    const base = script ? script.src : location.origin + '/'
    dataPromise = fetch(new URL('data/lenses.json', base).href)
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .catch(e => { dataPromise = null; throw e })
  }
  return dataPromise
}

export function Lens({ specs, countries, label }: { specs: LensSpec[]; countries?: string[]; label?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const key = JSON.stringify([specs, countries])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let alive = true
    loadData().then(D => {
      if (!alive || !ref.current) return
      ref.current.querySelectorAll('[data-l="tabs"], [data-l="controls"]').forEach(n => { n.innerHTML = '' })
      cleanup = mountLens(ref.current, D, d3, specs, { countries })
    }).catch(() => { if (alive) setFailed(true) })
    return () => { alive = false; cleanup?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (failed) return <p className="lz-fail">This chart could not load. Please refresh the page.</p>

  return (
    <div className="lz" ref={ref} aria-label={label}>
      <nav className="lz-tabs" role="tablist" data-l="tabs" aria-label="Lenses" />
      <div className="lz-panel">
        <h3 className="lz-topic" data-l="topic" />
        <p className="lz-answer" data-l="answer" aria-live="polite" />
        <div className="lz-controls" data-l="controls" />
        <div className="lz-chartbox" data-l="chartbox"><div className="lz-tip" data-l="tip" hidden /></div>
        <p className="lz-read" data-l="read" />
        <div className="lz-tablebox" data-l="tablebox" hidden />
        <div className="lz-foot">
          <p className="lz-source" data-l="source" />
          <button className="lz-linkbtn" data-l="tbtn" type="button">Show the numbers</button>
        </div>
      </div>
    </div>
  )
}
