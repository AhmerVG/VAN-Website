import { shortCropName } from '@/data/catalogue'
import { useEffect, useRef, useState } from 'react'
import { LOGO } from '@/data/assets'
import { CONTACT, WA } from '@/data/site'
import { PRODUCTS, CROPS } from '@/data/catalogue'
import { MenuPanel } from './MenuPanel'
import type { Route } from '@/lib/router'
import { WaIcon } from './bits'
import { PlainModeToggle } from './Detail'
import { UrduToggle } from './Ur'
import { URDU_ON } from '@/lib/readingMode'

/**
 * 10 Sep 2026 · "Make With Us" was in this list AND on a button two centimetres to its right, in
 * two capitalisations, pointing at one page. Tahir's 31 Aug ruling is that the call-to-action PAIR
 * stays site-wide, so the button is the one that stays and the nav item is the one that goes.
 * The partner route still lights the button, and the menu panel still carries the page under
 * Company, so nothing became unreachable.
 */
/**
 * 26 Sep 2026 · Tahir: the partner page "is hidden, we need to bring it to main", and "we have to
 * rethink the title". It returns to the main row as the 2nd item (VAN is mainly B2B, D-173), under a
 * name that says what the page is to a buying company (Tahir chose 'Your Brand'). PARTNER_NAV is the one place the name lives:
 * the nav item, the menu panel button and the footer all read it. Options put to Tahir: Private Label,
 * Your Brand, Contract Manufacturing, Make With Us. The masthead's ghost "Make with us" button goes, so
 * one destination has one label (the 10 Sep rule above).
 */
export const PARTNER_NAV = 'Your Brand'   // Tahir 26 Sep 2026 chose 'Your Brand'
const NAV: [string, string, Route['name'][]][] = [
  ['Products', '#/products', ['products', 'product']],
  [PARTNER_NAV, '#/partner', ['partner']],
  ['Crop Plans', '#/crops', ['crops', 'crop']],
  ['Soil Atlas', '#/soil', ['soil']],   // 11 Sep 2026, Tahir's name for the tab
  ['Vitalytics', '#/tools', ['tools', 'simulator']],   // 11 Sep 2026, Tahir's trademark name for the tools
  ['VAN Lab', '#/lab', ['lab', 'verify']],
  ['Knowledge', '#/knowledge', ['knowledge', 'circular']],
  ['About', '#/about', ['about', 'profile']],   // D-147: the company profile lights About
]

/**
 * The two view switches — Urdu labels, and Plain mode. Added 9 Sep 2026.
 *
 * They sit in their own slim bar under the header rather than inside it. Two reasons, and the second
 * is the real one: the header already carries a logo, eight nav items and two calls to action, and
 * adding two more controls pushed its row to 1,254px — wider than a 1,280px window once padding is
 * counted, and wider still than the 1,024–1,280 range where the desktop nav was already showing. A
 * control that changes how the whole site reads also does not belong in the same visual rank as
 * "For distributors". Here it is always visible, at every width, and never competes for the row.
 */
export function ViewBar() {
  return (
    <div className="view-bar">
      {/* O-2, 9 Sep 2026 (Tahir): "Home page, remove urdu. we are keeping it one luanage." Then, on
          the whole site: "urdu.. switch it off from web and keep it." So the SWITCH goes and the
          LAYER stays. Every Urdu string, the toggle component and its storage are untouched in the
          code, and turning URDU_ON back to true here brings the whole thing back with no other edit.
          Deleting the layer would have thrown away work that is finished and correct. */}
      <div className="wrap flex items-center justify-end gap-2 py-1.5">
        <span className="cap hidden sm:inline mr-1">View</span>
        {URDU_ON && <UrduToggle className="btn-ghost" />}
        <PlainModeToggle className="btn-ghost" />
      </div>
    </div>
  )
}

export function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { setOpen(false) }, [route])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  /* D-2, 28 Sep 2026: the same "Menu" button and panel are used at every width. From 1024px the
     8-item primary nav to its left is already visible, so the panel's own job there is the search
     box it carries — the label says so, and the panel's "For farmers" / "Your Brand" buttons (both
     already one click away in the nav above) drop out at that width. Below 1024px the panel is still
     the only way to reach them, so they stay. */
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  const menuLabel = isDesktop ? 'Search' : 'Menu'
  /* D-3, 28 Sep 2026: close on Escape from anywhere (not only while the search field has focus) and
     return focus to the button that opened the panel. */
  const closeMenu = () => { setOpen(false); menuBtnRef.current?.focus() }
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <>
      <header className="hdr">
        <div className="wrap row">
          {/* O-14, 9 Sep 2026: the logo had no rules of its own. A bare <img> flush against the edge
              of the content column. Its padding and sizing now live in one place (.hdr-logo) and are
              used here and nowhere else, so it cannot drift again. */}
          <a href="#/" aria-label="VAN, home" className="hdr-logo"><img src={LOGO} alt="VAN, Vital Agri Nutrients" /></a>
          {/* O-14, and this is the real content of "I DONT LIKED THE MANU AND TOP NAVIGATION": the
              whole navigation was hidden below 1280px. On a normal laptop. The screen Tahir sent his
              screenshots from. The site had NO menu at all, only a logo and a hamburger. Eight items
              measure about 680px, which fits inside a 1024px window once the two call-to-action
              buttons step aside; those stay from 1280px up, where there is room for both. */}
          <nav className="hidden lg:flex items-center gap-0 ml-1 min-w-0" aria-label="Primary">
            {NAV.map(([l, h, names]) => <a key={h} href={h} className={`nav-btn ${names.includes(route.name) ? 'on' : ''}`}>{l}</a>)}
            {/* D-181, Tahir 26 Sep 2026 chose option B: the call to action sits in the nav row as a gold pill, at every
                laptop width. It never points at the page you are on (10 Sep rule), and on partner pages the
                commercial door replaces it (11 Sep rule). Was a separate button shown only from 1320px. */}
            {route.name === 'partner'
              ? <a className="nav-btn nav-cta" href="#/partner#talk">Talk to us</a>
              : !['crops', 'crop'].includes(route.name) && <a className="nav-btn nav-cta" href="#/crops">For farmers</a>}
          </nav>
          {/* Kept at every width. The inline nav carries eight top-level places; the panel carries
              everything under them, which is the only way the sub-pages are reachable without
              guessing a URL. It also stops the row overflowing, which was clipping this button. */}
          <button ref={menuBtnRef} className="hdr-menu btn btn-navy btn-sm shrink-0" aria-label={open ? `Close the ${menuLabel.toLowerCase()}` : menuLabel} style={{ minHeight: 40 }} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
            <span className="hdr-menu-t">{open ? 'Close' : menuLabel}</span> {open ? '✕' : '☰'}
          </button>
        </div>
      </header>
      {open && (
        <div id="mobile-menu">
          {/* 10/11 Sep 2026 · Tahir: "its so conventional." It was. A flat column of a dozen links,
              named after the site's sections. It is now a search field over every crop, product,
              tool and page, and six headings that name a job rather than a department. The reasoning
              is written out at the top of MenuPanel.tsx. Revert: the old flat list is in git, and
              nothing else on the site imports MenuPanel. */}
          <MenuPanel onClose={closeMenu} extras={
            <>
              {!isDesktop && (
                <>
                  <a className="btn btn-gold" href="#/crops" onClick={() => setOpen(false)}>For farmers</a>
                  <a className="btn btn-navy" href="#/partner" onClick={() => setOpen(false)}>{PARTNER_NAV}</a>
                </>
              )}
              <a className="btn btn-ghost" href={`tel:${CONTACT.landlineTel}`}>Call {CONTACT.landline}</a>
              <span className="cap ml-auto">Reading view</span>
              {URDU_ON && <UrduToggle />}
              <PlainModeToggle />
            </>
          } />
        </div>
      )}
    </>
  )
}

/**
 * Three doors, always within reach: mobile bottom bar, laptop right-side dock.
 *
 * ONE WhatsApp door, not two (Tahir 9 Sep). It used to offer the farmer line and the distributor line
 * side by side on every page, which meant every reader was shown a message that was not for him. The
 * dock now asks who is reading — a partner page gets the distributor line, everything else gets the
 * dealer line — and the other one is simply not shown.
 */
/**
 * WHERE THE DOCK APPEARS — O-16f, 9 Sep 2026.
 *
 * Tahir, on the About page: "THERE IS NO QUESTION TO PUT FIND A DEALER NEXT TO BOD PICTURES. SUCH A
 * BASIC THINGS." He was right, and it was worse than the About page: the dock was mounted
 * unconditionally on all 78 pages, so it also floated beside the regulatory licences and beside the
 * distributor pages, where the reader is a procurement head and not somebody looking for a bag.
 *
 * His ruling: crop, product and soil pages only. Everywhere else the reader is not buying, so the
 * page ends with whatever that page's own next step is, and nothing hovers over it.
 *
 * Revert: return true from this function.
 */
export function dockShowsOn(name: Route['name']): boolean {
  // 11 Sep 2026 · 'partner' and 'dealers' added. Tahir's ruling was that the dock belongs where a
  // reader is buying and nowhere else, which is why it came off the board photos and the licence
  // tables. On those two pages the reader IS deciding, and they were the only long pages on the
  // site with no persistent way to act. They get the ONE-ITEM dock (see Dock below), not the three.
  // Revert: delete the two names from this line.
  return name === 'crop' || name === 'crops' || name === 'product' || name === 'products'
    // D-192, 26 Sep 2026: 'dealers' removed. Where to buy carried the PARTNER dock, so a farmer looking
    // for a shop got the own-brand manufacturing message (UX review). Revert: add it back.
    || name === 'soil' || name === 'home' || name === 'partner'
}

export function Dock({ partner = false, crop }: { partner?: boolean; crop?: string } = {}) {
  /**
   * 11 Sep 2026 · two faults, both measured.
   *
   * 1 · On a partner or dealer page the three farmer doors are the wrong doors, so those pages get
   *     one: talk to VAN, on the partner WhatsApp line rather than the distributor one.
   * 2 · "My crop's plan" was hard-wired to #/crops. On the crops index that is a link to the page
   *     you are standing on, and on a crop page it walks you backwards to the index. It is the most
   *     prominent persistent control on a 24,000px page. It now carries the crop.
   */
  const all = [
    partner
      ? { l: 'Talk to VAN', h: WA.partner, cls: 'green', ext: true, icon: <WaIcon size={22} /> }
      // O-9: this used to open WhatsApp directly, which asked a farmer to start a conversation before
      // he had seen whether there is a shop in his town. It now opens the list; the WhatsApp line is
      // on that page, where it answers a question the reader has actually formed.
      : { l: 'Find a dealer', h: '#/where-to-buy', cls: 'green', ext: false, icon: <WaIcon size={22} /> },
    crop
      // The dock button is 78px wide. "Ask for my wheat plan" overflowed the pill at 390px and the
      // last word sat outside it, so the label is the crop and the plan, and the WhatsApp message
      // carries the sentence.
      // D-151 (QA 18): the short crop name in its own case, on 1 line; "My plan" when that is still too long.
      // Was: `My ${crop.toLowerCase()} plan`.
      ? { l: `My ${shortCropName(crop)} plan`.length <= 16 ? `My ${shortCropName(crop)} plan` : 'My plan', h: WA.crop(crop), cls: 'gold', ext: true, icon: <WaIcon size={22} /> }
      : { l: "My crop's plan", h: '#/crops', cls: 'gold', ext: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 21V9M12 13c-4 0-6-2-6-6 4 0 6 2 6 6zM12 11c0-4 2-6 6-6 0 4-2 6-6 6z" /><path d="M4 21h16" /></svg> },
    { l: 'Verify a bag', h: '#/verify', cls: '', ext: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12l2 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" /><path d="M8 13l3 3 5-6" /></svg> },
  ]
  // A partner or dealer page gets the first door only; the other two are farmer doors.
  const items = partner ? all.slice(0, 1) : all
  return (
    <>
      <nav className="dock-bottom" aria-label="Quick actions">
        {items.map(i => <a key={i.l} href={i.h} className={i.cls} target={i.ext ? '_blank' : undefined} rel={i.ext ? 'noopener' : undefined}>{i.icon}<span>{i.l}</span></a>)}
      </nav>
      <nav className="dock-side" aria-label="Quick actions">
        {items.map(i => <a key={i.l} href={i.h} className={i.cls} target={i.ext ? '_blank' : undefined} rel={i.ext ? 'noopener' : undefined}>{i.icon}<span>{i.l}</span></a>)}
      </nav>
    </>
  )
}

/** The footer's top edge: a low line of crop blades, irregular like a field margin, drawn once. */
const FT_EDGE = (() => {
  let seed = 7, x = 0, d = 'M0 22 '
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  while (x < 1440) {
    const w = 3 + rnd() * 3, h = 4 + rnd() * (rnd() > 0.85 ? 16 : 9), lean = (rnd() - 0.5) * 5
    d += `L${x.toFixed(1)} 22 L${(x + w / 2 + lean).toFixed(1)} ${(22 - h).toFixed(1)} L${(x + w).toFixed(1)} 22 `
    x += w + rnd() * 4
  }
  return d + 'L1440 22 Z'
})()

export function Footer() {
  const brands = PRODUCTS.filter(p => !p.family).length
  const crops = CROPS.length
  const cols: [string, [string, string][]][] = [
    ['Products', [[`All ${brands} brands`, '#/products'], ['Compare them', '#/products#table'], ['Vital Urea', '#/products/vital-urea'], ['Where to buy', '#/where-to-buy'], ['Verify a bag', '#/verify']]],
    ['Crops', [[`${crops} crop plans`, '#/crops'], ['Wheat', '#/crops/wheat'], ['How you apply it', '#/crops/wheat#methods'], ['Soil Atlas', '#/soil']]],
    ['Knowledge', [['Why Pakistan must shift', '#/knowledge/why-pakistan-must-shift'], ['Product decks', '#/knowledge#decks'], ['Circular economy', '#/circular-economy'], ['Vitalytics tools', '#/tools']]],
    ['Company', [[PARTNER_NAV, '#/partner'], ['VAN Lab', '#/lab'], ['About', '#/about'], ['Company profile', '#/company-profile']]],   // D-147
  ]
  return (
    /* D-176, 26 Sep 2026. Tahir, with a screenshot of the D-171 footer: "rethink the footer, more stylish,
       a little compact." What made it tall: a full-width top row (logo, tagline, numbers), then an address
       column whose 2 addresses wrapped to 4 lines each beside 4 link columns, then the bottom row: 3 bands
       stacked. Now 2 bands. Left, the brand block: logo, tagline, the 3 ways to reach VAN as small buttons,
       the 2 addresses on one line each. Right, 4 short link columns. Under both, the circular-economy line
       (Tahir: circularity "should go to the footer", it was hidden) and the copyright row. The drawn ground
       line on the top edge is the one the About and Lab drawings stand on.
       Every link, address and number from D-171 is still here. Revert: the v58 source zip. */
    <footer className="ft mt-10">
      <svg className="ft-ground" viewBox="0 0 1440 22" preserveAspectRatio="none" aria-hidden="true"><path d={FT_EDGE} fill="currentColor" /></svg>
      <div className="wrap ft-inner">
        <div className="ft-main">
          <div className="ft-brand">
            <a href="#/" className="ft-logo" aria-label="VAN, home"><img src={LOGO} alt="VAN, Vital Agri Nutrients" /></a>
            <p className="ft-tag">{CONTACT.tagline}</p>
            <div className="ft-reach">
              <a href={`tel:${CONTACT.landlineTel}`} className="ft-chip">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l2.6 3.8-1.7 2a12 12 0 0 0 7.2 7.2l2-1.7 3.8 2.6-1.2 3a3 3 0 0 1-3 1.6C9.6 20.9 3.1 14.4 2 7.7a3 3 0 0 1 1.6-3z" /></svg>
                {CONTACT.landline}</a>
              <a href={WA.products} target="_blank" rel="noopener" className="ft-chip">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8.5 8.5 0 1 1 8 18.8z" /></svg>
                WhatsApp {CONTACT.whatsapp}</a>
              <a href={`mailto:${CONTACT.email}`} className="ft-chip">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></svg>
                {CONTACT.email}</a>
            </div>
          </div>
          <nav className="ft-links" aria-label="Footer">
            {cols.map(([h, links]) => (
              <div key={h}>
                {/* D-4, 28 Sep 2026: was <h4>. Nothing on any page between the body's last heading
                    and the footer is an <h3>, so <h4> here skipped a level. */}
                <h3>{h}</h3>
                <ul>{links.map(([l, href]) => <li key={l}><a href={href} className="ft-tap">{l}</a></li>)}</ul>
              </div>
            ))}
          </nav>
        </div>
        {/* D-221, 28 Sep 2026. Tahir: the 2 addresses "in one line across website footer", and the
            circular economy line out of the footer, kept "under the Knowledge title like an ordinary tab"
            (the Knowledge column already carries that link, so it stays as it is). Revert: the v61.4 source zip. */}
        <p className="ft-addr">
          <span><b>Head office</b> {CONTACT.headOffice}</span>
          <span><b>Plant</b> {CONTACT.plant}</span>
        </p>
        <div className="ft-bottom">
          <span>© 2026 {CONTACT.company}</span>
          <span className="ft-social">
            <a href={CONTACT.linkedin} target="_blank" rel="noopener" className="ft-tap">LinkedIn</a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener" className="ft-tap">Facebook</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener" className="ft-tap">Instagram</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
