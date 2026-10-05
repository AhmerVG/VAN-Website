import { useEffect, useMemo, useRef, useState } from 'react'
import { CROPS, PRODUCTS } from '@/data/catalogue'
import { cropSlug } from '@/lib/season'
import { hasCalculator, liveFirst } from '@/data/costPlans'
import { LiveCalcTag } from './bits'
import { TOOLS } from '@/data/tools'
import { DISTRICT_PROFILES } from '@/data/districtSoil'
import { COVERED } from '@/data/dealers'
import { CONTACT } from '@/data/site'

/**
 * THE MENU — rebuilt 10/11 September 2026.
 *
 * Tahir: "I have problem with menu design too, it's so conventional."
 *
 * He was right twice over. The panel was a flat column of a dozen links, which is every menu on
 * every site; and it was a list of PLACES, when a reader arrives with a JOB. Nobody wakes up
 * wanting the Knowledge section. They want to know what to put on their wheat this week, or whether
 * the bag in the shed is real.
 *
 * Two changes, and the second is the one that matters.
 *
 * 1 · SEARCH FIRST. The site is 79 pages, 28 crop programmes and 25 products. Reaching the sugarcane
 *     ratoon plan meant Crop Plans, then find it in a grid of 28. Now you type "ratoon". The index is
 *     built from the catalogue itself, so it can never fall out of step with the site, and it matches
 *     on the crop's sowing season and its programme name as well as its name — "October" finds wheat.
 *
 * 2 · THE HEADINGS ARE JOBS, NOT DEPARTMENTS. "Work out what to apply". "Check what you have been
 *     sold". "Manufacture with VAN". A reader picks the sentence that sounds like their morning.
 *     The department names are still in the masthead for anyone who thinks in sections.
 *
 * Keyboard: the field takes focus when the panel opens, ↑↓ move through results, Enter opens the
 * highlighted one, Escape closes. A menu that can be driven from the keyboard is worth more to the
 * commercial team than to a grower, and it costs a grower nothing.
 */
type Hit = { label: string; sub: string; href: string; kind: string; keys?: string; live?: boolean }

/** M9, 24 Sep 2026: words a reader types that are not in a page's name. "distributor" and "sahiwal"
 *  both found nothing. Districts come from the soil survey's own list and the towns with a dealer. */
const DISTRICT_WORDS = [...DISTRICT_PROFILES.map(d => d.name), ...COVERED].join(' ')
const PAGE_KEYS: Record<string, string> = {
  '#/become-a-dealer': 'distributor distribution distributorship stockist wholesale wholesaler dealership retailer trade',
  '#/where-to-buy': `dealer shop stockist near me district ${DISTRICT_WORDS}`,
  '#/soil': `district soil map survey ${DISTRICT_WORDS}`,
}

/** D-151 (QA 36): the names a farmer is likely to type, in Roman Urdu and in Urdu, per crop page. */
const CROP_WORDS: Record<string, string> = {
  wheat: 'gandum gundum گندم', maize: 'makai makki مکئی', 'rice-basmati': 'chawal chawel dhan basmati چاول دھان', 'rice-hybrid': 'chawal chawel dhan چاول دھان',
  cotton: 'kapas phutti کپاس پھٹی', sugarcane: 'ganna kamad گنا کماد', 'sugarcane-ratoon': 'ganna kamad mudhi مونڈھی گنا کماد', canola: 'sarson raya سرسوں کینولا',
  sesame: 'til تل', soybean: 'soyabean سویابین', sunflower: 'surajmukhi سورج مکھی', chickpea: 'chana channa چنا', lentil: 'masoor مسور',
  'mungbean-mash': 'moong mung mash مونگ ماش', potato: 'aloo alu آلو', tomato: 'tamatar ٹماٹر', chili: 'mirch mirchi مرچ', garlic: 'lehsan lahsan لہسن',
  watermelon: 'tarbooz تربوز', turmeric: 'haldi ہلدی', onion: 'piaz pyaz پیاز', 'banana-year1': 'kela کیلا', 'banana-year2': 'kela کیلا',
  citrus: 'kinnow kinno malta کینو مالٹا', 'date-palm': 'khajoor khajur کھجور', mango: 'aam آم', strawberry: 'اسٹرابیری', guava: 'amrood amrud امرود',
}

function index(): Hit[] {
  const out: Hit[] = []
  // D-144: crops with a live calculator are indexed first and carry the tag.
  for (const c of liveFirst(CROPS, cropSlug)) out.push({ label: c.name, sub: `${c.sowing} · ${c.programme}`, href: `#/crops/${cropSlug(c)}`, kind: 'Crop plan', live: hasCalculator(cropSlug(c)), keys: CROP_WORDS[cropSlug(c)] })
  for (const p of PRODUCTS) if (!p.family) out.push({ label: p.name, sub: p.analysis, href: `#/products/${p.slug}`, kind: 'Product' })
  for (const t of TOOLS) if (t.href) out.push({ label: t.name, sub: t.one, href: t.href, kind: 'Tool', keys: t.keywords })
  for (const [label, sub, href] of PAGES) out.push({ label, sub, href, kind: 'Page', keys: PAGE_KEYS[href] })
  return out
}

/** The pages that are not a crop, a product or a tool. Kept here so the index is complete. */
const PAGES: [string, string, string][] = [
  ['Soil Atlas', 'The Punjab survey, 770,160 samples, district by district', '#/soil'],
  ['Where to buy', 'Dealers, and how to become one', '#/where-to-buy'],
  ['Become a dealer', 'Territory, terms and the enquiry form', '#/become-a-dealer'],
  ['Your Brand', 'Contract manufacturing and private label', '#/partner'],
  ['Formulation library', '27 unbranded formulations', '#/partner/pipeline#library'],
  ['Composition chart', 'Every brand and code with its analysis', '#/composition'],
  ['VAN Lab', 'PNAC accredited, ISO/IEC 17025:2017', '#/lab'],
  ['Verify a bag', 'Batch number to lab report', '#/verify'],
  ['Knowledge', 'Decks, evidence and the sources under them', '#/knowledge'],
  ['The 17 nutrients', 'What each does, and the barrel you fill with your own bags', '#/knowledge/nutrients'],
  ['Why Pakistan must shift', 'The national case, with every chart', '#/knowledge/why-pakistan-must-shift'],
  ['Circular economy', 'Potash recovered from crop residue ash', '#/circular-economy'],
  ['Farm discipline simulator', '10 levers, wheat and potato', '#/simulator'],
  ['Wheat discipline simulator', 'Score a wheat season across 10 levers', '#/simulator/wheat'],
  ['Potato discipline simulator', 'Score a potato season across 10 levers', '#/simulator/potato'],
  ['About VAN', 'The site, the plant, the board', '#/about'],
  // D-147
  ['Company profile', 'The whole company on 1 page, and the profile as a PDF', '#/company-profile'],
  ['All products', `Every one of the ${PRODUCTS.filter(p => !p.family).length} registered brands`, '#/products'],
  ['All crop plans', `Every one of the ${CROPS.length} programmes`, '#/crops'],
  ['Vitalytics', 'Every calculator on the site, under one name', '#/tools'],
]

const JOBS: { job: string; note: string; links: [string, string][] }[] = [
  {
    job: 'Work out what to apply',
    note: 'Per acre, stage by stage, for the crop you actually grow.',
    // D-144: was Wheat, Cotton, Sugarcane (February planting has no calculator). Live-calculator crops first.
    links: [['All 28 crop programmes', '#/crops'], ['Crops with a live calculator', '#/crops#live'], ['Wheat', '#/crops/wheat'], ['Cotton', '#/crops/cotton'], ['Ratoon sugarcane', '#/crops/sugarcane-ratoon'], ['Adjust a plan to my soil report', '#/crops/wheat#creator'], ['What my soil is like here', '#/soil']],
  },
  {
    job: 'Check what you have been sold',
    note: 'A batch number, a laboratory, and a certificate with a signature on it.',
    links: [['Verify a bag', '#/verify'], ['VAN Lab, tests and prices', '#/lab#prices'], ['Book a test on somebody else’s product', '#/lab#book'], ['What is in each product', '#/products']],
  },
  {
    job: 'Buy it, or sell it',
    note: 'For growers looking for a shop, and for shops looking for a supplier.',
    links: [['Where to buy', '#/where-to-buy'], ['Become a dealer', '#/become-a-dealer'], ['Compare every product', '#/products#table'], ['Ask on WhatsApp', '#/where-to-buy']],
  },
  {
    job: 'Manufacture with VAN',
    note: 'Toll manufacturing, private label, and the formulation library.',
    links: [['Your Brand', '#/partner'], ['The formulation library', '#/partner#library'], ['How a product gets made here', '#/partner/manufacturing'], ['Registration and standards', '#/partner/regulatory'], ['7 steps, brief to bag', '#/partner/brief-to-bag'], ['Company profile and PDF', '#/company-profile']],   // D-147
  },
  {
    job: 'Read the evidence',
    note: 'Every figure on this site is transcribed, sourced, or marked derived.',
    links: [['Knowledge hub', '#/knowledge'], ['The 17 nutrients', '#/knowledge/nutrients'], ['Why Pakistan must shift', '#/knowledge/why-pakistan-must-shift'], ['Soil Atlas', '#/soil'], ['Circular economy', '#/circular-economy'], ['Product knowledge decks', '#/knowledge#decks']],
  },
  {
    job: 'Work the numbers yourself',
    note: 'Free, no login, nothing to install.',
    links: [['All the tools', '#/tools'], ['Unit and bag converter', '#/tools#tools-converter'], ['Farm discipline simulator', '#/simulator'], ['Crop water requirement', '#/crops/cotton#water']],
  },
]

export function MenuPanel({ onClose, extras }: { onClose: () => void; extras?: React.ReactNode }) {
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const box = useRef<HTMLInputElement>(null)
  const all = useMemo(index, [])

  // Focus the field on a laptop, where it saves a click. NOT on a phone: autofocus there raises the
  // keyboard over two thirds of the menu the reader just asked to see.
  useEffect(() => { if (window.matchMedia('(min-width: 900px)').matches) box.current?.focus() }, [])

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    const words = s.split(/\s+/)
    const scored = all
      .map(h => {
        const hay = `${h.label} ${h.sub} ${h.kind} ${h.keys ?? ''}`.toLowerCase()
        if (!words.every(w => hay.includes(w))) return null
        // A name that STARTS with what was typed is what the reader meant. "pot" is potato before
        // it is "V-Potash Plus", and a page whose body merely mentions potash is last.
        const l = h.label.toLowerCase()
        const rank = l.startsWith(s) ? 0 : l.includes(s) ? 1 : 2
        return { h, rank }
      })
      .filter(Boolean) as { h: Hit; rank: number }[]
    // D-144: among names that match, a crop with a live calculator comes first (ruling 1). A hit
    // found only through its keywords still comes after every name match.
    const nameHit = (x: { rank: number }) => (x.rank < 2 ? 0 : 1)
    return scored.sort((a, b) => nameHit(a) - nameHit(b) || Number(!a.h.live) - Number(!b.h.live) || a.rank - b.rank || a.h.label.length - b.h.label.length).slice(0, 8).map(x => x.h)
  }, [q, all])

  useEffect(() => setCur(0), [q])

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (!hits.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setCur(c => (c + 1) % hits.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCur(c => (c - 1 + hits.length) % hits.length) }
    if (e.key === 'Enter') { e.preventDefault(); window.location.hash = hits[cur].href; onClose() }
  }

  return (
    // D-3, 28 Sep 2026: the panel used to fill the screen with no way to dismiss it by clicking
    // outside its content. `.mp` is now the backdrop — a click that lands on it (not on the search
    // box, a job link or a result) closes the panel; a click inside `.wrap.mp-in` is stopped before
    // it reaches this handler.
    <div className="mp" onClick={onClose}>
      <div className="wrap mp-in" onClick={e => e.stopPropagation()}>
        <div className="mp-search">
          <label className="sr-only" htmlFor="menu-search">Search crops, products, tools and pages</label>
          <input ref={box} id="menu-search" className="input input-lg" type="search" value={q} onKeyDown={key}
            onChange={e => setQ(e.target.value)} autoComplete="off"
            placeholder="Search crops, products, pages…" />
          {q && (
            <div className="mp-hits" role="listbox" aria-label="Search results">
              {hits.length === 0
                ? <p className="mp-none">Nothing by that name. Try the crop, the product, or what you are trying to do.</p>
                : hits.map((h, i) => (
                  <a key={h.href + h.label} href={h.href} className={`mp-hit ${i === cur ? 'on' : ''}`} onMouseEnter={() => setCur(i)} onClick={onClose}>
                    <span className="mp-hit-l">{h.label}{h.live && <> <LiveCalcTag compact /></>}</span>
                    <span className="mp-hit-s">{h.sub}</span>
                    <span className="mp-kind">{h.kind}</span>
                  </a>
                ))}
            </div>
          )}
        </div>

        <div className="mp-jobs">
          {JOBS.map(j => (
            <section key={j.job} className="mp-job">
              <h3 className="mp-job-h">{j.job}</h3>
              <p className="mp-job-n">{j.note}</p>
              <ul>{j.links.map(([l, h]) => <li key={l + h}><a href={h} onClick={onClose}>{l}</a></li>)}</ul>
            </section>
          ))}
        </div>

        {extras && <div className="mp-extras">{extras}</div>}
        <p className="cap mp-foot">{CONTACT.tagline}</p>
      </div>
    </div>
  )
}
