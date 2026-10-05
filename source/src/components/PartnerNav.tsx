import { useEffect, useState } from 'react'

/**
 * THE IN-PAGE BAR — 10 September 2026.
 *
 * Tahir: "we should stitch it to the top somewhere, so one can move straight to library if he want."
 *
 * The Make With Us page is long by design: two routes, seven stages each, a library of twenty-five
 * formulations, five sub-pages, the limits, and a way to start a conversation. Before this bar the
 * only way to reach the library was to scroll past all of it, and a partner who arrived wanting to
 * see what is already on the shelf had no way of knowing the shelf was there at all.
 *
 * It sticks under the masthead, marks the section the reader is in, and is the same four words at
 * every width. It is not a second navigation for the site; it is a table of contents for one page.
 */

const ITEMS: [string, string][] = [
  ['journey', 'The two routes'],
  ['models', 'The 3 models'],   // D-185
  ['library', 'The library'],
  ['portfolio', 'The portfolio'],
  ['detail', 'In more detail'],
  ['limits', 'Before you ask'],
  // 11 Sep 2026 · this bar followed the reader down 13,606px of the page on a phone and never once
  // pointed at the way to make an enquiry. The enquiry section is #talk; it is a tab now.
  ['talk', 'Talk to us'],
]

/** D-147: `items` lets the company profile page use the same in-page bar with its own sections.
 *  With no argument the bar is exactly the Make With Us bar it always was. Revert: drop the prop. */
export function PartnerNav({ items = ITEMS }: { items?: [string, string][] } = {}) {
  const [here, setHere] = useState(items[0][0])

  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    // The section whose top has most recently passed under the bar is the one the reader is in.
    // An IntersectionObserver alone marks a section as soon as one pixel of it appears, which lights
    // the NEXT heading while the reader is still in the previous section.
    const onScroll = () => {
      const line = 150
      let cur = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id
      setHere(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="pnav">
      <div className="wrap flex items-center gap-1 overflow-x-auto">
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={e => jump(e, id)}
            className={`pnav-link ${here === id ? 'on' : ''}`}
            aria-current={here === id ? 'true' : undefined}>{label}</a>
        ))}
      </div>
    </div>
  )
}
