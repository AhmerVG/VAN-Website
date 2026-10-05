import { CROPS, PRODUCTS } from '@/data/catalogue'
import { SOIL_HEADLINE } from '@/data/soilLens'
import { Converter } from '@/components/Converter'
import { ToolFinder } from '@/components/ToolFinder'
import { TOOLS, TOOL_PAGES } from '@/data/tools'
import { WaButton } from '@/components/bits'
import { WA } from '@/data/site'

/**
 * THE TOOLS PAGE — rebuilt 10/11 September 2026.
 *
 * Tahir: "tool page is not really well drafted, what is live is at the bottom and what is coming is
 * up, and also the page is too dense to find a tool. We should research how such pages are designed
 * by industry who run such tools."
 *
 * The research is written up in src/data/tools.ts. The short of it: the industry's own tool indexes
 * — Nutrien's eKonomics is the closest comparable, a fertilizer company running free public
 * calculators — give each tool an icon, a title and ten to fifteen words. Not a paragraph. And the
 * directory-page guidance is consistent: put the filters above the results, show the count each
 * filter would give, and give one control that clears everything.
 *
 * What was wrong here:
 *   · 23 tools, each with a four-to-six-line paragraph, about 1,900 words to read end to end.
 *   · The finished tools were split across three sections by audience, which is how VAN thinks
 *     about them, not how a farmer looks for one.
 *   · The roadmap sat at the bottom as a second half of the page, so on a phone the page appeared
 *     to be mostly things that do not work.
 *
 * What it is now: a finder. Search, topic chips with live counts, and a switch for the unbuilt
 * tools that is off when the page opens. Then the converter, which is the one tool that runs on
 * this page rather than linking away. Then the case for why any of it exists, last, because a
 * reader who has just used a calculator no longer needs to be sold one.
 *
 * Nothing was deleted. Every paragraph from the old page is on this one, one press away — the
 * tool records themselves moved wholesale into src/data/tools.ts, which is where to look if you
 * want any sentence back exactly as it read.
 */
export default function Tools() {
  const live = TOOLS.filter(t => t.state === 'live').length
  const pilot = TOOLS.filter(t => t.state === 'pilot').length
  const soon = TOOLS.filter(t => t.state === 'building').length

  return (
    <div>
      <section style={{ background: 'linear-gradient(180deg, var(--sky), var(--sand))' }}>
        <div className="wrap py-8 lg:py-11">
          {/* O-13, 9 Sep 2026 (Tahir): "IT NEVER TELL THE MAIN THINGS UNLESS YOU SCROL, IT SHOULD
              CLEARLY TELL WHAT IS FOR BEFORE IT MAKE A CASE. AND AGAIN 'Instruments, not brochures'
              SUCH STATEMENT IS NOT CORRECT. WE SAID TOOLS AND THEN WE SAY INSTRUMENTS, WE ARE
              CONFUSING USER." Both faults were real and the fix holds: the page says what it is,
              who it is for and what it costs to use, in that order.
              Old headline, for revert: "Instruments, not brochures." */}
          <span className="eyebrow navy">Vitalytics · VAN’s tools</span>
          <h1 className="max-w-[24ch]">Work out your own numbers.</h1>
          {/* D-177, Tahir 26 Sep 2026: "are we not trying to say more and doing less?" The lead said "14 tools
              you can use right now ... what to apply, when to apply it". It is now the honest count. */}
          <p className="lead mt-4">
            {live} finished tools and {pilot} pilots. No login and nothing to install. Put in your crop,
            your acres, your sowing date or your soil reading, and each tool gives back an answer for
            your own field. A pilot works, and says on the tool what it cannot do yet.
          </p>
          <p className="small mt-3">
            The {soon} we have not built yet are here too, behind a switch, each saying what it is waiting on.
          </p>
        </div>
      </section>

      <section className="sec"><div className="wrap">
        <ToolFinder />
      </div></section>

      {/* The converter is the only tool that runs on this page instead of linking away, so it sits
          on the page rather than behind a tile. Its tile in the finder scrolls here. */}
      <section className="sec" style={{ background: 'var(--sand-2)' }} id="tools-converter"><div className="wrap">
        <div className="mb-6">
          <span className="eyebrow navy">Use it here</span>
          <h2 className="max-w-[26ch]">Land, weight, and what is in the bag.</h2>
          <p className="lead mt-3">3 sums a farmer or a dealer does on paper every week. The bag tab reads VAN's own registered analyses, so the kilograms it gives you are the guaranteed figures off the label.</p>
        </div>
        <Converter />
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="panel p-5 lg:p-6">
          <span className="eyebrow navy">What they run on</span>
          <p className="mt-2">VAN’s <b>{CROPS.length} published crop plans</b> and <b>{PRODUCTS.filter(p => !p.family).length} registered analyses</b>, the Punjab survey of <b>{SOIL_HEADLINE.samples} soil samples</b>, and public methods named on each tool: FAO Paper 56 for water, IPNI for what a harvest removes. Where a figure is an estimate or a starting model, the tool says so.</p>
          <div className="mt-5">
            <span className="eyebrow navy">Pages, not tools</span>
            <p className="small muted mt-1">These answer a question without a figure of your own.</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {TOOL_PAGES.map(([t, d, h]) => <li key={t}><a className="panel p-4 block" href={h}><b style={{ color: 'var(--navy)' }}>{t} →</b><span className="block small muted mt-1">{d}</span></a></li>)}
            </ul>
          </div>
        </div>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Want one of these sooner?</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>Tell us which, and what you would use it for. That is how the order gets decided.</p></div>
          <WaButton href={WA.farmer} lg>Tell us on WhatsApp</WaButton>
        </div>
      </section>
    </div>
  )
}
