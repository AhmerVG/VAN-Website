import { CONTACT } from '@/data/site'

/**
 * HOW VAN COMPETES, D-320, 27 Oct 2026.
 *
 * Tahir, 26 Oct 2026 (multiple choice): the antitrust page is VAN's own commitment, naming the CropLife Pakistan
 * Antitrust Guidelines (revised 5 Oct 2023) without quoting or posting them, because the guidelines are marked
 * "Confidential & privileged"; linked from the footer next to the CropLife line. 27 Oct 2026: contact
 * partner@van.com.pk; text OK'd ("okay for antitrust"). The text below is the approved draft, word for word.
 */

const NOT_DISCUSSED = [
  'Prices, discounts, margins, credit terms or terms of sale',
  'Costs, production, capacity, stock or sales volumes',
  'Customers, dealers, districts or markets',
  'Bids and tenders',
  'Research, new products, investment, and business or marketing plans',
]

const HOW_VAN_WORKS = [
  'VAN decides its prices, products, suppliers and customers on its own.',
  'VAN does not join any agreement to stop a supplier, dealer or company from doing lawful business.',
  'VAN takes part in an industry standard only where taking part is voluntary and open. It does not use a standard to keep another product out of the market.',
  'At association meetings VAN works to a written agenda. If the talk turns to any topic above, VAN’s representative objects, leaves the meeting and says why.',
]

export default function HowVanCompetes() {
  return (
    <div className="wrap py-8 lg:py-10">
      <p className="cap"><a href="#/about">About VAN</a> / How VAN competes</p>
      <h1 className="max-w-[24ch] mt-3">How VAN competes</h1>
      <p className="lead mt-3 max-w-[70ch]">VAN sets its own prices and runs its own business. It does not agree any of it with a competitor.</p>
      <p className="mt-4 max-w-[70ch]">VAN has been a full member of CropLife Pakistan since 2024. As a member, VAN follows the CropLife Pakistan Antitrust Guidelines (revised October 2023) at every association meeting and event, and in the talk before and after them.</p>
      <div className="grid lg:grid-cols-2 gap-5 mt-7 max-w-[120ch]">
        <div className="panel p-5">
          <h2 style={{ fontSize: 22, lineHeight: 1.25 }}>What VAN does not discuss or agree with any competitor</h2>
          <ul className="mt-3 pl-5 grid gap-2" style={{ listStyle: 'disc' }}>{NOT_DISCUSSED.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="panel p-5">
          <h2 style={{ fontSize: 22, lineHeight: 1.25 }}>How VAN works</h2>
          <ul className="mt-3 pl-5 grid gap-2" style={{ listStyle: 'disc' }}>{HOW_VAN_WORKS.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <p className="mt-7">Questions about how VAN competes: <a href={`mailto:${CONTACT.partnerEmail}`}>{CONTACT.partnerEmail}</a></p>
    </div>
  )
}
