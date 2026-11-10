import { useMemo, useState } from 'react'
import { planUpdateNote } from '@/data/planNotes'
import { programmeSupply, allStages, NUTRIENT_LABEL, type Nutrient } from '@/lib/nutrientBalance'
import { removalFor, removalGapFor, uptakeFor, REMOVAL_SOURCE, KG_PER_MAUND } from '@/data/removal'
import { nutrientRanges, fmtRange, fmtPair, fmt } from '@/lib/planRange'
import { SectionHead } from './bits'

/**
 * NUTRIENT REMOVAL AND REPLACEMENT — added 9 September 2026.
 *
 * The site's knowledge pages argue that Pakistan's soils are being mined: more leaves each season
 * than goes back, and the 770,160-sample survey the site publishes is what that looks like after
 * thirty years. Until now that argument has been national and abstract. This is the same argument
 * about one field, in kilograms, for the programme the reader has just been reading.
 *
 * TWO HALVES FROM TWO VERY DIFFERENT PLACES, and the page says which is which.
 *
 *   WHAT GOES ON is VAN's own: the published plan's own rows, at the published rates, read against
 *   each row's own printed analysis. Arithmetic on VAN's numbers, nothing sourced from outside.
 *
 *   WHAT COMES OFF is not VAN's and cannot be: no Pakistani nutrient-removal table exists on the
 *   public record. These are IPNI's, a North-American compilation, named on the page with IPNI's
 *   own caution that local data should be preferred. If VAN or SFRI ever measures Pakistani
 *   coefficients they replace these outright.
 *
 * THE NUMBER THIS PRODUCES IS COMMERCIALLY AWKWARD AND IS PUBLISHED ANYWAY. On wheat at 60 maunds
 * with the straw sold — which is most Punjab farms, because bhusa is fodder — the programme returns
 * a fraction of the potash the crop takes away. A fertiliser company's own website saying so is the
 * point, not an oversight: it is the site's national argument holding when it is turned on VAN.
 *
 * WHAT IT REFUSES. Crops with no credible removal coefficient get the section's reason, not a
 * plausible figure — cotton above all, where the only published number is per tonne of LINT and a
 * Pakistani grower weighs phutti, so using it would overstate removal about threefold.
 */
/* D-317 (26 Oct 2026): visible text cleaned of build notes and page narration, Tahir's instruction */
export function NutrientBalance({ cropKey, cropName, defaultYieldMaunds }: { cropKey: string; cropName: string; defaultYieldMaunds?: number }) {
  const removal = removalFor(cropKey)
  const gap = removalGapFor(cropKey)
  const uptake = uptakeFor(cropKey)
  const supply = useMemo(() => programmeSupply(cropKey, allStages(cropKey)), [cropKey])
  // 11 Sep 2026, Tahir's ruling. On wheat and potato VAN holds two documents for the same
  // programme and they do not agree, so "what the programme puts on" is printed as a range rather
  // than as whichever of the two this component happens to read. See src/lib/planRange.ts.
  const ranges = useMemo(() => nutrientRanges(cropKey), [cropKey])

  const [yieldMaunds, setYieldMaunds] = useState<string>(defaultYieldMaunds ? String(defaultYieldMaunds) : '')
  const [residueOff, setResidueOff] = useState(false)

  // No coefficient: say why, show what the programme puts on, and stop.
  if (!removal) {
    return (
      <div className="panel p-5 lg:p-6" id="balance">
        <span className="eyebrow">Nutrients applied</span>
        {/* Tahir 7 Nov 2026 (CR-12): on a crop whose main doses are per plant (mango and others), the heading says the
            figures come from the per-acre rows only. Was "Nutrients applied per acre by the {crop} plan." on every crop.
            CR-23: no full stop at the end of a heading. */}
        <h3 className="mt-1">{supply.perPlantRows.length > 0
          ? <>Nutrients from the per-acre rows of the {cropName} plan{supply.ageBand ? `, for the ${supply.ageBand.replace(' · ', ' (')}) age band` : ''} (per-plant doses not included)</>
          : <>Nutrients applied per acre by the {cropName} plan{supply.ageBand ? `, for the ${supply.ageBand.replace(' · ', ' (')}) age band` : ''}</>}</h3>
        <SupplyTable supply={supply} cropName={cropName} cropKey={cropKey} />
        {/* B5, 24 Sep 2026: crops with no removal coefficient (onion among them) printed the supply
            total without saying which rows it leaves out. The same note now shows here. */}
        <NotCounted supply={supply} where="in the total above" />
        <p className="cap mt-4 max-w-[140ch]">
          {/* D-317: was "What the crop takes out is not shown for {cropName}, and here is why." followed by the removalGapFor note */}
          {/* L1 7 Nov 2026 (crops-a 22): the ruled term. Was "This page does not compare {cropName} nutrient removal with the plan." */}
          {/* L2 fact check 9 Nov 2026 (crops-a W7, house rule of 26 Oct: no line that narrates the page): a plain fact. Was "This page does not compare the nutrients taken out in the harvested {cropName} with the nutrients the plan applies." */}
          No figure for the nutrients taken out in the harvested {cropName} is available that can be compared with this plan.{gap ? <> {gap}</> : null}
        </p>
      </div>
    )
  }

  const t = Number(yieldMaunds) > 0 ? (Number(yieldMaunds) * KG_PER_MAUND) / 1000 : 0
  const taken: Partial<Record<Nutrient, number>> = {}
  for (const n of ['N', 'P', 'K', 'S'] as Nutrient[]) {
    const grain = (removal as unknown as Record<string, number | undefined>)[n] ?? 0
    const res = residueOff && removal.residue ? ((removal.residue as unknown as Record<string, number | undefined>)[n] ?? 0) : 0
    if (grain || res) taken[n] = (grain + res) * t
  }

  const rows = (['N', 'P', 'K', 'S'] as Nutrient[]).filter(n => (supply.perAcre[n] ?? 0) > 0 || (taken[n] ?? 0) > 0)

  return (
    <div id="balance">
      <SectionHead
        eyebrow="Nutrient balance"
        title="Nutrients applied and nutrients taken out in the harvested crop."
        tone="soil"
        lead={`Each season, nutrients are taken out of the field in the harvested crop, and the plan applies nutrients to the field. The table below compares, per acre, the amount of each nutrient that the plan applies with the estimated amount taken out in the harvested ${cropName}.`}
      />

      <div className="panel p-5 lg:p-6">
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-1">
            <span className="cap">What yield are you expecting?</span>
            <span className="flex items-center gap-2">
              <input
                className="input num" style={{ width: 110 }} inputMode="decimal"
                value={yieldMaunds} onChange={e => setYieldMaunds(e.target.value.replace(/[^\d.]/g, ''))}
                aria-label={`Expected ${cropName} yield in maunds per acre`} placeholder="maunds"
              />
              <span className="cap">maunds/acre</span>
            </span>
            {/* 11 Sep 2026 · the prefill on potato is the discipline simulator's CEILING, 686.25
                maunds an acre, not a typical crop. Left unlabelled under "What yield are you
                expecting?" it reads as an expectation, and it drives the most alarming figure on the
                page. It is named now, and it is still there to be typed over. */}
            {defaultYieldMaunds && String(defaultYieldMaunds) === yieldMaunds && (
              <span className="cap" style={{ color: 'var(--rust)' }}>
                {/* Tahir 7 Nov 2026 (CR-19): "assumed", not "working figure". Was "The figure already entered is VAN’s working figure for what a good progressive farmer achieves. Type your own expected yield." */}
                The yield already entered, {defaultYieldMaunds} maunds per acre, is VAN’s assumed yield for a good progressive farmer. Type the yield you expect.
              </span>
            )}
          </label>
          {removal.residue && (
            <label className="flex items-center gap-2 pb-1">
              <input type="checkbox" checked={residueOff} onChange={e => setResidueOff(e.target.checked)} />
              <span>I take the {removal.residue.label.toLowerCase()} off the field too</span>
            </label>
          )}
        </div>

        {t === 0 ? (
          <p className="small mt-4 max-w-[140ch]">Enter your expected yield to see the nutrients taken out in the harvested crop beside the nutrients applied. Until you do, the table shows only what the plan applies.</p>
        ) : null}

        <div className="mt-5 overflow-x-auto tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th className="r">Applied by the plan</th>
                <th className="r">{t > 0 ? `Taken out in the harvested crop at ${yieldMaunds} maunds per acre (estimated)` : 'Taken out in the harvested crop (estimated)'}</th>
                <th className="r">Applied minus taken out (estimated)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(n => {
                const r = ranges?.[n]
                const on = supply.perAcre[n] ?? 0
                const lo = r?.differs ? r.low : on
                const hi = r?.differs ? r.high : on
                const off = taken[n] ?? 0
                // A range on what goes on is a range on the balance. Both ends are shown signed, so
                // a balance that is negative at one end and positive at the other cannot be read as
                // a single verdict it does not support.
                // Tahir 7 Nov 2026 (CR-13, fact check): the difference is now taken from the 2 figures as printed (each
                // rounded to 0.1 kg), so a reader's own subtraction matches it. Wheat potash showed 12.0 − 11.5 as
                // "+0.4 kg". Was: balLo = lo - off, balHi = hi - off (unrounded).
                // L2 fact check 9 Nov 2026 (crops-a W11): fmt from planRange, which now rounds exact halves up, so the difference still
                // matches the 2 printed figures (potato nitrogen 101.35 now prints 101.4 in both). Was: Number(v.toFixed(1)). The "taken
                // out" column below prints through fmt too (was off.toFixed(1)).
                const r1 = (v: number) => Number(fmt(v))   // the same rounding the 2 printed figures use
                const balLo = r1(lo) - r1(off)
                const balHi = r1(hi) - r1(off)
                // L1 7 Nov 2026 (crops-a 20, crops-b m8): a true minus sign, "−3.2", was a hyphen "-3.2". Display only.
                const sign = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1).replace('-', '−')}`
                return (
                  <tr key={n}>
                    <td className="font-bold">{NUTRIENT_LABEL[n]}</td>
                    <td className="r num">{hi ? fmtPair(lo, hi) : 'n/a'}</td>
                    <td className="r num">{t > 0 && off ? `${fmt(off)} kg` : 'n/a'}</td>
                    <td className="r num" style={{ color: t > 0 && off ? (balHi < 0 ? 'var(--rust)' : balLo > 0 ? 'var(--green)' : undefined) : undefined, fontWeight: 700 }}>
                      {t > 0 && off
                        ? (Math.abs(balHi - balLo) > 0.05 ? `${sign(balLo)} to ${sign(balHi)} kg` : `${sign(balHi)} kg`)
                        : 'n/a'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Tahir 7 Nov 2026 (CR-20): the range is explained once, in the 2-lists paragraph above the Nutrition creator, so
            RANGE_NOTE is no longer shown here. Was {ranged && <p ...>{RANGE_NOTE}</p>}. */}

        {/* D-311 (Tahir, 23 Oct 2026): the notes under the table, short and plain for farmers and dealers (were method
            notes: the range's 2 documents, the minus at length, why a product is left out, and 1 litre counted as 1 kg). */}
        <p className="cap mt-3 max-w-[140ch]">
          Per acre, per season. A minus means the crop takes more of that nutrient than the plan puts back; the soil
          makes up the difference, which is why a soil test matters.
        </p>

        <NotCounted supply={supply} where="on the left" />
        {/* D-311: the 1 litre = 1 kg note is no longer shown (it moves a total by less than 1 kg); the count still works that way. */}
      </div>

      {uptake && t > 0 && (
        <div className="panel-soft p-5 mt-4">
          <span className="eyebrow">Uptake by the whole crop</span>
          <p className="mt-1 max-w-[140ch]">
            The table above shows the nutrients <b>taken out in the harvested crop</b>. The whole crop takes
            up more of each nutrient than is taken out in the harvested crop, and the difference is held in the
            crop residue{removal.residue ? `: the ${removal.residue.label.toLowerCase()}` : ''}. At {yieldMaunds} maunds per acre, {cropName} takes up an estimated{' '}
            {/* L1 7 Nov 2026 (crops-b m19): "maunds per acre", "kg of N", "and" before the last figure, "per acre". Was "maunds an acre ... 77 kg N, 26 kg P₂O₅, 79 kg K₂O in total,". Figures unchanged. */}
            {(['N', 'P', 'K'] as Nutrient[]).map(n => `${(((uptake as unknown as Record<string, number>)[n] ?? 0) * t).toFixed(0)} kg of ${NUTRIENT_LABEL[n].replace(/.*\(|\)/g, '')}`).join(', ').replace(/, ([^,]*)$/, ' and $1')} per acre,
            counting both the harvested crop and the residue. If the residue stays in the field, the nutrients in it return to
            the soil. If the residue is taken off the field, those nutrients go with it.
          </p>
        </div>
      )}

      <p className="cap mt-4 max-w-[140ch]">
        <b>Sources.</b> <b>Nutrients applied:</b> VAN’s published {cropName} plan.{planUpdateNote(cropKey) ? <> {planUpdateNote(cropKey)}</> : null} <b>Nutrients taken out in the harvested crop:</b> no
        Pakistani nutrient-removal table has been published, so these figures are estimated from the{' '}
        {REMOVAL_SOURCE.name} ({removal.region}), for “{removal.verbatim}”, per {removal.basis}. IPNI is the
        International Plant Nutrition Institute. IPNI’s note: “{REMOVAL_SOURCE.footnote}”
      </p>
    </div>
  )
}

function SupplyTable({ supply, cropName, cropKey }: { supply: ReturnType<typeof programmeSupply>; cropName: string; cropKey: string }) {
  const rows = (['N', 'P', 'K', 'S', 'Zn', 'B', 'Mg'] as Nutrient[]).filter(n => (supply.perAcre[n] ?? 0) > 0)
  const ranges = nutrientRanges(cropKey)
  if (!rows.length) return <p className="small mt-3">The published {cropName} plan gives no nutrient analysis that can be totalled.</p>
  // Tahir 7 Nov 2026 (CR-12): on a per-plant crop the caption moves above the figures, and a total below 0.05 kg prints
  // "under 0.1 kg" (fmtPair), not "0.0 kg". Was: caption after the figures for every crop; figures as toFixed(1).
  const perPlant = supply.perPlantRows.length > 0
  return (
    <>
      {perPlant && <p className="cap mt-3 max-w-[140ch]">These totals are per acre and include only the rows published per acre. Each figure is the published rate multiplied by the product’s nutrient analysis.</p>}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {rows.map(n => (
          <div key={n}>
            {/* D-323, 27 Oct 2026: on a crop with a calculator this prints through fmtRange, as the calculator does, so the 2
                figures on one page cannot round apart (garlic N is exactly 53.55: 53.5 here and 53.6 in the calculator before). */}
            <div className="display text-[22px]">{ranges?.[n] ? fmtRange(ranges[n]) : fmtPair(supply.perAcre[n]!, supply.perAcre[n]!)}</div>
            <div className="cap">{NUTRIENT_LABEL[n]}</div>
          </div>
        ))}
      </div>
      {/* B3, 24 Sep 2026: on mango the per-tree rows are left out of this total, and the caption
          said "across the whole programme", so a grower read 0.2 kg N as the orchard's dose. */}
      {/* L2 fact check 9 Nov 2026 (crops-a W10): on an age-band plan (date palm) the totals are for 1 age band, as the heading says. Was "These totals are per acre, for the whole plan." on every crop. */}
      {!perPlant && <p className="cap mt-3 max-w-[140ch]">These totals are per acre, {supply.ageBand ? `for the ${supply.ageBand.replace(' · ', ' (')}) age band` : 'for the whole plan'}. Each figure is the published rate multiplied by the product’s nutrient analysis.</p>}
    </>
  )
}

/** Rows the supply total leaves out, and why. Shared by the balance table and the supply-only panel. */
function NotCounted({ supply, where }: { supply: ReturnType<typeof programmeSupply>; where: string }) {
  return (
    <>
      {supply.uncounted.length > 0 && (
        <p className="cap mt-2 max-w-[140ch]">
          {/* D-311: was "Not counted …: X. The plan gives this no nutrient analysis (…), so it is left out of the total rather
              than given a figure it does not have. The real total is therefore higher than shown." */}
          {(() => {
            const names = [...new Set(supply.uncounted.map(u => /bio-?stimulant/i.test(u.analysis || '') ? `${u.product} (a bio-stimulant)` : u.product))]
            const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
            return `${list} ${names.length > 1 ? 'have' : 'has'} no nutrient figure, so ${names.length > 1 ? 'they are' : 'it is'} not counted.`
          })()}
        </p>
      )}
      {/* L1 7 Nov 2026 (crops-a 29): "trees per acre", was "trees on your acre". */}
      {supply.perPlantRows.length > 0 && (
        <p className="cap mt-2 max-w-[140ch]">
          <b>Not counted {where}:</b> {[...new Set(supply.perPlantRows.map(r => r.product))].join(', ')}. These doses are published
          per plant, not per acre. To turn a dose into kg of product per acre, multiply it by the number of trees per acre.
        </p>
      )}
    </>
  )
}
