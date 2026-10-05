import { useState } from 'react'
import { HOME_COPY, WA, CONTACT, wa } from '@/data/site'
import { WaButton, Plots } from './bits'

/** Two doors: the dealer near you, or the plant direct. Both end in WhatsApp. */
export function Doors() {
  const [district, setDistrict] = useState('')
  const dealerHref = district.trim() ? wa(`Hello VAN. I’d like the name of my nearest dealer. My district is: ${district.trim()}`) : WA.dealer
  return (
    <section className="sec" id="dealer">
      <div className="wrap grid lg:grid-cols-2 gap-5">
        <div className="panel-green p-6 lg:p-8 flex flex-col">
          <span className="eyebrow">Find a dealer</span>
          <h2 className="text-[clamp(30px,3vw,40px)]">The dealer near you.</h2>
          <p className="mt-3 muted">Type your district. We send back the name and number of the nearest dealer carrying VAN brands.</p>
          <Plots cols={10} rows={2} seed={11} className="my-5 opacity-80" />
          <label className="font-bold" htmlFor="district">Your district</label>
          <input id="district" className="input mt-2" placeholder="e.g. Sahiwal, Multan, Sukkur…" value={district} onChange={e => setDistrict(e.target.value)} autoComplete="off" />
          <div className="mt-4"><WaButton href={dealerHref} lg>Ask for my dealer</WaButton></div>
        </div>
        <div className="panel-navy p-6 lg:p-8 flex flex-col">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Direct from the plant</span>
          <h2 className="text-[clamp(30px,3vw,40px)]">{HOME_COPY.orderH2}</h2>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,.8)' }}>{HOME_COPY.orderLead}</p>
          <ol className="list-none p-0 m-0 mt-5 grid gap-3">
            {HOME_COPY.orderSteps.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span className="num flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold)', color: 'var(--navy)', fontSize: 20 }}>{i + 1}</span>
                <span className="text-[18px]">{s}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3 mt-6">
            <WaButton href={WA.order} lg>Order on WhatsApp</WaButton>
            <a className="btn btn-lg" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} href={`tel:${CONTACT.landlineTel}`}>Call {CONTACT.landline}</a>
          </div>
          <p className="cap mt-4" style={{ color: 'rgba(255,255,255,.7)' }}>Or write to <a href={`mailto:${CONTACT.email}`} style={{ color: '#fff' }}>{CONTACT.email}</a></p>
        </div>
      </div>
    </section>
  )
}
