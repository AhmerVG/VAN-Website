/**
 * D-151 (QA 15): the right-edge fade on horizontal scrollers is shown only when the content really
 * overflows. Every scroller with a fade gets `.fits` while its content fits, and CSS drops the mask
 * for `.fits`. Scrollers mount and unmount as the reader moves between pages, so new ones are picked
 * up by a MutationObserver; each one is watched by a ResizeObserver (its own size and its content's).
 * Revert: delete this file, its call in main.tsx and the `.fits` rule in index.css.
 */
const SELECTOR = '.hrail, .tbl-scroll, .pj-rail, .pnav .wrap, .sc-wrap'

export function startScrollFade(): void {
  if (typeof window === 'undefined' || !('ResizeObserver' in window)) return
  const seen = new WeakSet<Element>()
  const check = (el: Element) => {
    const fits = el.scrollWidth <= el.clientWidth + 1
    el.classList.toggle('fits', fits)
  }
  const ro = new ResizeObserver(entries => {
    for (const e of entries) {
      const el = (e.target as Element).closest(SELECTOR) ?? e.target
      check(el)
    }
  })
  const watch = (root: ParentNode) => {
    root.querySelectorAll(SELECTOR).forEach(el => {
      if (seen.has(el)) { check(el); return }
      seen.add(el)
      ro.observe(el)
      if (el.firstElementChild) ro.observe(el.firstElementChild)
      check(el)
    })
  }
  watch(document)
  let queued = false
  new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; watch(document) })
  }).observe(document.body, { childList: true, subtree: true })
  window.addEventListener('load', () => watch(document))
}
