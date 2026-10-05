import { useSowing } from '@/lib/sowing'

/**
 * BLOCK 06 — "What is actually standing."  Placeholder, 9 Sep 2026.
 *
 * The yield assessment is a MEASUREMENT of the crop that exists, as against the discipline
 * simulator's PREDICTION from how the season was farmed. The two are deliberately separate tools and
 * the gap between them is the first real calibration VAN will have.
 *
 * It is not built, and it is not built for a stated reason rather than for want of time: the
 * sugarcane workbook records cane length, thickness, nodes and node length and then multiplies the
 * count by a flat weight, so four measured parameters do nothing. Tahir ruled that cane weight comes
 * from girth and length. Until that weight model exists there is no honest yield figure to print,
 * and a tool that printed one anyway would be exactly the "estimator" this site refuses to be.
 *
 * So the block holds its place in the order and says what it is waiting on. His standing rule:
 * lay the foundation now, "coming soon" is acceptable for what cannot yet be finished — but a
 * placeholder must name its blocker, or it is an advert for vapour.
 */
export function StandingCrop({ cropKey, cropName }: { cropKey: string; cropName: string }) {
  const [sown] = useSowing(cropKey)
  const counted = COUNTABLE.includes(cropKey)
  return (
    <div className="panel p-5" id="standing" style={{ borderStyle: 'dashed' }}>
      <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
        <div>
          <span className="eyebrow">Not built yet · what it is waiting on</span>
          <h3 className="mt-1">What is actually standing in your field.</h3>
          <p className="muted mt-2 max-w-[140ch]">
            The programme above is what the crop should get. The simulator below is what your season
            should give. Neither is a measurement of the {cropName} that is actually there. The yield
            assessment will be: {counted
              ? <>count the millable canes in a frame thrown across the field and read the yield off the count.</>
              : <>count what is standing in a measured area and read the yield off the count.</>}
          </p>
          <p className="cap mt-2 max-w-[140ch]">
            {counted
              ? <>Waiting on one thing: a cane <b>weight model from girth and length</b>. VAN's own
                  assessment sheet measures length, thickness, nodes and node length and then applies
                  a flat weight to every cane regardless, and its two sheets disagree on that weight
                  by a third. Until there is a measured relationship, a yield figure here would be a
                  cane count wearing a yield's name.</>
              : <>Waiting on the method for {cropName}, which is not sugarcane's. Grain crops are
                  assessed on heads per square metre, grains per head and thousand-grain weight, 
                  a different instrument wearing the same name.</>}
            {sown?.kind === 'date' && <> Your sowing date is already saved, and this block will open
              at the point in the season where there is something countable.</>}
          </p>
        </div>
        <a className="btn btn-sm btn-ghost" href="#/tools">What else is being built →</a>
      </div>
    </div>
  )
}

/** The crops assessed by counting stems in a frame — VAN has a real sheet for these. */
const COUNTABLE = ['sugarcane', 'sugarcane-ratoon']
