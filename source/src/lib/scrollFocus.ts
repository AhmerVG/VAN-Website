import { useEffect } from 'react'

/**
 * R4, 18 Oct 2026 (audit): a table or strip that scrolls sideways could not be scrolled with the
 * keyboard, because nothing inside it takes focus. Every such box that actually overflows gets
 * tabindex="0" and a name, so Tab reaches it and the arrow keys scroll it. A box that fits is left
 * alone (no empty stop in the Tab order), and so is a box whose own buttons already take focus.
 * Runs after each page change, after the View switch (Simple / Full redraws tables) and on resize.
 */
const SEL = '.tbl-scroll, .overflow-x-auto, .strip-scroll, .sc-wrap'

function mark() {
  document.querySelectorAll<HTMLElement>(SEL).forEach(el => {
    const scrolls = el.scrollWidth > el.clientWidth + 1
    // A box whose own buttons or links already take focus (a tab row) needs no extra stop.
    const hasOwnStops = !!el.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (scrolls && !hasOwnStops && !el.hasAttribute('tabindex')) {
      el.tabIndex = 0
      el.dataset.sf = '1'
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        const cap = el.querySelector('caption, th')?.textContent?.trim()
        el.setAttribute('aria-label', `${el.querySelector('table') ? 'Table' : 'Strip'}${cap ? `, ${cap.slice(0, 40)}` : ''}. Scrolls sideways; use the arrow keys.`)
      }
      if (!el.getAttribute('role')) el.setAttribute('role', 'region')
    } else if ((!scrolls || hasOwnStops) && el.dataset.sf === '1') {
      el.removeAttribute('tabindex'); delete el.dataset.sf
      if ((el.getAttribute('aria-label') ?? '').endsWith('Scrolls sideways; use the arrow keys.')) el.removeAttribute('aria-label')
      if (el.getAttribute('role') === 'region') el.removeAttribute('role')
    }
  })
}

export function useScrollFocus(key: string) {
  useEffect(() => {
    const t1 = window.setTimeout(mark, 300), t2 = window.setTimeout(mark, 1500)
    let t: number | undefined
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(mark, 200) }
    window.addEventListener('resize', onResize)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [key])
}
