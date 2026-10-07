/**
 * THE ONE PLACE THE WEBSITE TALKS TO O2S.
 *
 * 5 Oct 2026, on the rulings of 3 Oct 2026: a farmer types the batch number printed on his bag and
 * gets that batch's APPROVED LABORATORY REPORT (PDF), nothing else. No product name, pack size,
 * client, dates beyond the approval date, status or deviation on the website. Every batch in O2S can
 * be checked. The farmer does not pick a product. This replaces the contract of 10 Sep 2026 and
 * every field and file name it had.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 * THE CONTRACT. Built in VAN-OP, apps/o2s/public-routes.js.
 *
 *   GET  {base}/batch/{number}
 *        200  { batch, approved_on, report_url }     approved_on is YYYY-MM-DD
 *        404  empty body: not in O2S, or its lab report is not approved yet
 *        429  empty body: too many checks from this visitor (60 per 10 minutes)
 *
 *   GET  {report_url}
 *        200  application/pdf, the report; every page carries the batch number and the date it was
 *             downloaded, stamped by O2S, not by this site.
 *
 * The server tidies the number (any case, spaces). Only https://van.com.pk and
 * https://www.van.com.pk may call it from a browser.
 *
 * NOTHING HERE EVER INVENTS AN ANSWER. No answer, a server error, a 404 with a body, or a 200
 * without a usable report_url all come back as `offline`, and the page says the live check is not connected and
 * hands the reader WhatsApp. A farmer is never told his bag is fake because the server was down.
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 */

export type BatchReport = {
  batch: string
  /** ISO date, YYYY-MM-DD. */
  approvedOn: string
  reportUrl: string
}

export type LookupResult =
  | { ok: true; report: BatchReport }
  /** 404: not in O2S, or its lab report is not approved yet. */
  | { ok: false; reason: 'not-found' }
  /** 429: too many checks from this visitor. */
  | { ok: false; reason: 'too-many' }
  /** No answer, a server error, or an answer the page cannot use. Never shown as a pass or a fail. */
  | { ok: false; reason: 'offline' }

/**
 * 7 Oct 2026: live or local is chosen by where the page is open, so this file never has to be edited
 * before a push. On this computer (localhost, 127.0.0.1) the check asks the local VAN-OP on port
 * 3000, which must have PUBLIC_EXTRA_ORIGINS=http://localhost:5173 in its .env. Anywhere else,
 * van.com.pk included, it asks the live server.
 */
const IS_LOCAL = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)
const LIVE_BASE = 'https://van-control-tower.onrender.com/api/public'
const LOCAL_BASE = 'http://localhost:3000/api/public'

export const O2S = {
  enabled: true,
  base: IS_LOCAL ? LOCAL_BASE : LIVE_BASE,
  /** The free server can take a while to wake up, so the wait is generous. */
  timeoutMs: 30000,
  /**
   * The sample tracker (below) is a different endpoint that the 3 Oct contract does not include.
   * It stays off until O2S answers {base}/sample/{ref}.
   */
  samplesEnabled: false,
}

/** Batch numbers are printed in capitals on the bag and typed however the farmer types them. */
export const normaliseBatch = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '')

export async function lookupBatch(batchRaw: string): Promise<LookupResult> {
  const batch = normaliseBatch(batchRaw)
  // An empty box is not a bag, so it is never answered as "not found".
  if (!batch) return { ok: false, reason: 'offline' }
  if (!O2S.enabled) return { ok: false, reason: 'offline' }

  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), O2S.timeoutMs)
  try {
    const res = await fetch(`${O2S.base}/batch/${encodeURIComponent(batch)}`, {
      signal: ctrl.signal, headers: { Accept: 'application/json' },
    })
    // The contract's 404 and 429 have an empty body. A 404 WITH a body is the server saying the
    // address itself does not exist yet (before go-live it answers {"error":"No such endpoint."}),
    // which says nothing about the bag, so it is treated as no answer.
    if (res.status === 404) return (await res.text()).trim() ? { ok: false, reason: 'offline' } : { ok: false, reason: 'not-found' }
    if (res.status === 429) return { ok: false, reason: 'too-many' }
    if (!res.ok) return { ok: false, reason: 'offline' }
    const j = await res.json()
    const reportUrl = typeof j?.report_url === 'string' ? j.report_url : ''
    // Only an https address is opened, so nothing but a real file link can reach the button.
    // The local VAN-OP serves plain http, so on this computer http is accepted too.
    if (!(IS_LOCAL ? /^https?:\/\//i : /^https:\/\//i).test(reportUrl)) return { ok: false, reason: 'offline' }
    return {
      ok: true,
      report: {
        batch: String(j.batch ?? batch),
        approvedOn: typeof j.approved_on === 'string' ? j.approved_on : '',
        reportUrl,
      },
    }
  } catch {
    return { ok: false, reason: 'offline' }
  } finally {
    window.clearTimeout(t)
  }
}


/* ────────────────────────────────────────────────────────────────────────────────────────────────
 * THE SAMPLE TRACKER, on the same adapter.
 *
 * This is the other half of the Lab page and a different question: not "is this bag real" but
 * "where has my sample got to". It was built on 9 Sep against the same contract and deliberately
 * left unwired; it now sits on this file so the web team implements ONE integration rather than
 * finding a second one later. The same two rules hold: no customer detail in the response, ever —
 * the whole point of the blind chain is that the laboratory itself never knew whose sample it was,
 * so the tracker cannot leak what the laboratory did not know.
 * ──────────────────────────────────────────────────────────────────────────────────────────────── */

export type SampleStage = 'parcel' | 'reception' | 'coded' | 'split' | 'analysts' | 'compared' | 'released'

export const SAMPLE_STAGE_LABEL: Record<SampleStage, string> = {
  parcel: 'Your parcel is on its way',
  reception: 'Received at Sample Reception',
  coded: 'A code has been issued',
  split: 'Split 3 ways',
  analysts: 'With two analysts',
  compared: 'Compared, awaiting signature',
  released: 'Reported and released to you',
}

export type SampleRecord = { ref: string; receivedAt: string | null; stage: SampleStage; updatedAt: string | null; tests: string[] }
export type SampleResult = { ok: true; record: SampleRecord } | { ok: false; reason: 'not-found' | 'offline' }

export async function lookupSample(refRaw: string): Promise<SampleResult> {
  const ref = normaliseBatch(refRaw)
  if (!ref) return { ok: false, reason: 'not-found' }
  if (!O2S.enabled || !O2S.samplesEnabled) return { ok: false, reason: 'offline' }
  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), O2S.timeoutMs)
  try {
    const res = await fetch(`${O2S.base}/sample/${encodeURIComponent(ref)}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    if (res.status === 404) return { ok: false, reason: 'not-found' }
    if (!res.ok) return { ok: false, reason: 'offline' }
    const j = await res.json()
    return {
      ok: true,
      record: {
        ref: String(j.ref ?? ref),
        receivedAt: j.received_at ? String(j.received_at) : null,
        stage: (j.stage ?? 'reception') as SampleStage,
        updatedAt: j.updated_at ? String(j.updated_at) : null,
        tests: Array.isArray(j.tests) ? j.tests.map(String) : [],
      },
    }
  } catch {
    return { ok: false, reason: 'offline' }
  } finally {
    window.clearTimeout(t)
  }
}
