import { useEffect, useState } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'products' }
  | { name: 'product'; slug: string }
  | { name: 'crops' }
  | { name: 'crop'; slug: string }
  | { name: 'soil'; rel: string | null; district: string | null }
  | { name: 'partner'; slug: string | null }
  | { name: 'lab' }
  | { name: 'verify' }
  | { name: 'knowledge'; slug: string | null }
  | { name: 'circular'; slug: string | null }
  | { name: 'about' }
  | { name: 'profile' }
  | { name: 'simulator'; slug: string | null }
  | { name: 'tools' }
  | { name: 'composition' }   // D-202
  | { name: 'dealers' }
  | { name: 'becomeDealer' }
  | { name: 'notfound' }

/** `#/path/slug?key=value#anchor` → route + optional in-page anchor. Unknown paths → null (the shell sends them home). */
export function parseHash(hash: string): { route: Route; anchor: string | null } | null {
  const raw = hash.replace(/^#/, '')
  const [pathPart, anchor = ''] = raw.split('#')
  const [pathOnly, queryPart = ''] = pathPart.split('?')
  const query = new URLSearchParams(queryPart)
  const h = pathOnly.replace(/^\/?/, '').replace(/\/+$/, '')
  const a = anchor || null
  if (h === '') return { route: { name: 'home' }, anchor: a }
  const [p, b] = h.split('/')
  switch (p) {
    case 'products': return { route: b ? { name: 'product', slug: b } : { name: 'products' }, anchor: a }
    case 'crops': return { route: b ? { name: 'crop', slug: b } : { name: 'crops' }, anchor: a }
    case 'soil': {
      const rel = query.get('rel')
      const district = query.get('district')
      // `?rel=` pre-selects the relation explorer and lands on it; `?district=` lands on the district panel.
      return { route: { name: 'soil', rel, district }, anchor: a ?? (rel ? 'soil-relations' : district ? 'soil-districts' : null) }
    }
    case 'partner': return { route: { name: 'partner', slug: b || null }, anchor: a }
    case 'circular-economy': return { route: { name: 'circular', slug: b || null }, anchor: a }
    case 'lab': return { route: { name: 'lab' }, anchor: a }
    case 'verify': return { route: { name: 'verify' }, anchor: a }
    case 'knowledge': return { route: { name: 'knowledge', slug: b || null }, anchor: a }
    case 'about': return { route: { name: 'about' }, anchor: a }
    // D-147: the company profile, the web version of the profile deck, with its PDF.
    case 'company-profile': return { route: { name: 'profile' }, anchor: a }
    case 'simulator': return { route: { name: 'simulator', slug: b || null }, anchor: a }
    case 'tools': return { route: { name: 'tools' }, anchor: a }
    case 'composition': return { route: { name: 'composition' }, anchor: a }
    // O-9: where to buy. Slug chosen to read as what it is in a URL a farmer might be sent.
    case 'where-to-buy': return { route: { name: 'dealers' }, anchor: a }
    // 10 Sep 2026: the distributor page moved OUT from under /partner. Tahir: "this page is not for
    // dealers and distributors." The content and the enquiry form are unchanged; only its home moved,
    // and .htaccess 301s the old /partner/distributor.html so nothing indexed breaks.
    case 'become-a-dealer': return { route: { name: 'becomeDealer' }, anchor: a }
    // The build's own 404 file declares itself as #/404 (see build-static.mjs). Without this
    // case the router would treat it as an unknown path and reset the visitor to the home
    // page — which is exactly the silent redirect a 404 page exists to avoid.
    case '404': return { route: { name: 'notfound' }, anchor: a }
    default: return null
  }
}

/**
 * Static-build support (8 Sep 2026). The site ships as one pre-rendered HTML file per URL at the
 * paths the live site already ranks for, all sharing one bundle. Each generated file declares its
 * own route in `window.__ROUTE__` before the bundle loads, so the app renders that page rather than
 * the home page. In the dev server there is no __ROUTE__ and the hash is used exactly as before.
 */
declare global { interface Window { __ROUTE__?: string } }

function read(): { route: Route; anchor: string | null } {
  const raw = window.location.hash
  // A bare "#section" is an in-page anchor, not a route. Before this check the router failed to
  // parse it, decided it was a 404 and reset to the home page — which silently broke every
  // "jump to section" link on the site.
  if (raw && !raw.startsWith('#/')) {
    const here = parseHash(window.__ROUTE__ || '#/')
    return { route: here ? here.route : { name: 'home' }, anchor: raw.slice(1) || null }
  }
  const r = parseHash(raw || window.__ROUTE__ || '')
  if (!r) {
    window.history.replaceState(null, '', '#/')
    return { route: { name: 'home' }, anchor: null }
  }
  return r
}

export function useRoute(): Route {
  const [state, setState] = useState(read)
  useEffect(() => {
    const fn = () => setState(read())
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])
  // After the page renders: jump to the anchor if there is one, else to the top.
  useEffect(() => {
    if (state.anchor) {
      const el = document.getElementById(state.anchor)
      if (el) { el.scrollIntoView({ block: 'start', behavior: 'instant' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [state])
  return state.route
}

export function go(hash: string) {
  if (window.location.hash === hash) { window.scrollTo({ top: 0 }); return }
  window.location.hash = hash
}

export function scrollToId(id: string, offset = 116) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: y, behavior: 'smooth' })
}
