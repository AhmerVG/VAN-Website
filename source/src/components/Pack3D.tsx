import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * "TURN IN 3D" — 26 Sep 2026. Tahir made a 3D model of the Crop Force 10 kg bag (22 Sep,
 * Brand and Artwork\New Labels\Crop Force 12 12 18\3D Bag Model\cropforce-10kg-bag.glb) and asked for
 * "still image + Turn in 3D". The still pack shot on the page is rendered from that same model.
 *
 * The viewer is a separate small page, site-root/3d/view.html, with its own script (three.js, about
 * 600 KB) and the model (about 1.8 MB). Nothing of it loads until the visitor presses the button, so
 * the product page itself is no heavier. Add a product by putting <slug>.glb in site-root/3d/ and
 * its slug and label in MODELS below.
 */
export const MODELS: Record<string, string> = {
  'crop-force': 'The NPK 12-12-18 bag, 10 kg',
}

/** The viewer sits beside the site's shared bundle, so resolve it from there: works at the domain root,
 *  under a subfolder and in a local preview alike (every other link in the build is relative too). */
function viewerUrl(slug: string) {
  const js = document.querySelector<HTMLScriptElement>('script[src*="demo."]')
  const base = js ? new URL('.', js.src).href : new URL('/', location.href).href
  return new URL(`3d/view.html?m=${slug}`, base).href
}

export function Pack3D({ slug, name }: { slug: string; name: string }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (!open) { if (wasOpen.current) btnRef.current?.focus(); return }
    wasOpen.current = true
    closeRef.current?.focus()
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      // Keep Tab inside the window: its only focusable things are Close and the model.
      if (e.key === 'Tab' && boxRef.current) {
        const f = [...boxRef.current.querySelectorAll<HTMLElement>('button, iframe')]
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    addEventListener('keydown', k)
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [open])
  const label = MODELS[slug]
  if (!label) return null
  return (
    <>
      <button ref={btnRef} className="p3d-btn" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
        Turn in 3D
      </button>
      {open && createPortal(
        <div className="p3d-back" role="dialog" aria-modal="true" aria-label={`${name} in 3D`} onClick={() => setOpen(false)}>
          <div ref={boxRef} className="p3d-box" onClick={e => e.stopPropagation()}>
            <div className="p3d-top">
              <div><b>{name}</b><span>{label}. Drag to turn it.</span></div>
              <button ref={closeRef} className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Close ✕</button>
            </div>
            <iframe src={viewerUrl(slug)} title={`${name}, 3D model`} />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
