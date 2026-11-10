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
          <h1 className="max-w-[24ch]">Tools that work out fertiliser quantities, crop water needs and other figures for your own field</h1>
          {/* D-177, Tahir 26 Sep 2026: "are we not trying to say more and doing less?" The lead said "14 tools
              you can use right now ... what to apply, when to apply it". It is now the honest count. */}
          <p className="lead mt-4">
            VAN has {live} finished tools and {pilot} pilot tools. The pilot tools work, but they do not yet cover every crop. You do not need to sign in to any of them or install anything. Enter your crop,
            your acres, your sowing date or your soil test reading, and each tool works out a result for
            your own field.
          </p>
          {/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */}
          <p className="small mt-3">
            {soon} more tools are being built. To see them, turn on the switch “Include the {soon} still being built” below.
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
          <h2 className="max-w-[26ch]">Convert land, weight and the nutrients in a bag</h2>
          <p className="lead mt-3">This converter does 3 calculations that farmers and dealers otherwise do on paper. The “What's in the bag” tab uses the declared analyses of VAN’s brands, so the kilograms it shows are the guaranteed figures printed on the label.</p>
        </div>
        <Converter />
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="panel p-5 lg:p-6">
          <span className="eyebrow navy">What the tools are based on</span>
          <p className="mt-2">The tools are based on 5 sources: VAN’s <b>{CROPS.length} published crop plans</b>; the declared analyses of VAN’s <b>{PRODUCTS.filter(p => !p.family).length} brands</b>; the Punjab soil survey of <b>{SOIL_HEADLINE.samples} samples</b>, tested in about 2016 to 2018; FAO Irrigation and Drainage Paper 56, for crop water needs; and figures from the International Plant Nutrition Institute (IPNI), for the nutrients taken out in the harvested crop. Wherever a tool shows an estimate, the figure is labelled as an estimate.</p>
          <div className="mt-5">
            <span className="eyebrow navy">Pages, not tools</span>
            <p className="small muted mt-1">These pages do not need any figures from you.</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {TOOL_PAGES.map(([t, d, h]) => <li key={t}><a className="panel p-4 block" href={h}><b style={{ color: 'var(--navy)' }}>{t} →</b><span className="block small muted mt-1">{d}</span></a></li>)}
            </ul>
          </div>
        </div>
      </div></section>

      <section className="wrap sec-tight">
        <div className="panel-navy p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
          <div><h3>Ask for a tool to be built sooner</h3><p className="mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>Tell VAN which tool you need and what you would use it for. VAN uses these requests to decide the order in which tools are built.</p></div>
          <WaButton href={WA.farmer} lg>Send VAN a WhatsApp message</WaButton>
        </div>
      </section>
    </div>
  )
}
