/**
 * EVERY FORM ON THIS SITE POSTS THROUGH HERE — 10 September 2026.
 *
 * Tahir: "lets build all form as submitted, my backend team will do what need to be done but what we
 * need to do at front end?"
 *
 * So: one adapter, one endpoint, one contract, the same shape as src/lib/o2s.ts. Four forms use it
 * (dealer, partner, laboratory, farmer) and none of them knows anything about the network.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 * THE CONTRACT, for whoever writes the endpoint
 *
 *   POST {endpoint}
 *   Content-Type: application/json
 *
 *   { "form":   "dealer" | "partner" | "lab-test" | "report-bag" | "farmer-plan",
 *     "fields": { "<name>": "<value>", ... },     flat, all strings, already validated
 *     "page":   "#/become-a-dealer",              where it was sent from
 *     "sentAt": "2026-09-10T19:04:11.271Z",
 *     "openedMs": 41822,                          how long the form was open before it was sent
 *     "hp":     "" }                              the honeypot — see below
 *
 *   200  { "ok": true,  "ref": "ENQ-2026-0184" }   `ref` may be null; the page shows it if present
 *   422  { "ok": false, "message": "…" }           something the sender can fix; shown verbatim
 *   429  anything                                  too many, too fast — the page says so
 *   any other status, or no answer at all          treated as offline, see the fallback below
 *
 * ONE ENDPOINT, NOT FIVE. The `form` field says which. Adding a form later needs no server change.
 *
 * IF IT IS NOT ON van.com.pk, the endpoint must return
 *   Access-Control-Allow-Origin: https://van.com.pk      (and the www host, if that is used)
 *   Access-Control-Allow-Headers: Content-Type
 * and answer OPTIONS, or every submission fails silently in the browser.
 *
 * SPAM, WITHOUT PUNISHING A REAL PERSON. No CAPTCHA. Two cheap checks instead, and BOTH must be
 * repeated on the server, because anything done only in a browser is advice, not a control:
 *   · `hp` is a hidden field a person never sees and never fills. Non-empty means a bot. Drop it.
 *   · `openedMs` is how long the form was open. A person takes seconds; a script takes none.
 *     Under 2,500 ms, treat with suspicion.
 * Neither of these costs a farmer a single tap, which is the whole point.
 *
 * WHERE THEY LAND is your team's decision, but the `form` key is designed to route it: dealer and
 * partner to partner@van.com.pk, lab-test and report-bag to info@, farmer-plan to kisan@. Those three
 * addresses already exist and already mean those three audiences.
 * ────────────────────────────────────────────────────────────────────────────────────────────────
 *
 * NOTHING IS EVER LOST. This is the part that matters more than the endpoint.
 *
 * If the POST fails — server down, wrong CORS header, no signal on a phone in a field, or the flag
 * still off — the form does NOT tell the sender it failed and leave him there. It hands him the same
 * message, already assembled, on WhatsApp or in his mail client. He can see it before it goes. The
 * enquiry arrives either way, and the only difference is which inbox it lands in.
 *
 * A form that loses an enquiry it already had is worse than a form that never existed, because the
 * sender believes he has been in touch and VAN never knows he tried.
 */

export type FormKey = 'dealer' | 'partner' | 'lab-test' | 'report-bag' | 'farmer-plan'

export type SubmitResult =
  | { ok: true; ref: string | null }
  /** Something the sender can fix. `message` comes from the server and is shown as written. */
  | { ok: false; reason: 'invalid'; message: string }
  /** Too many, too fast. */
  | { ok: false; reason: 'rate-limited' }
  /** Not wired yet, unreachable, or refused. The form falls back and says so plainly. */
  | { ok: false; reason: 'offline' }

export const FORMS = {
  /**
   * FALSE UNTIL THE BACKEND TEAM WIRES IT. With it off, every Submit returns `offline` and the form
   * hands the reader WhatsApp or email with the message already written — which is exactly what the
   * site did before, so nothing regresses while they build.
   */
  // D-190, 27 Sep 2026: the endpoint now exists (site-root/api/enquiry.php, deployed with the static
  // files, dormant). The flag stays OFF until Ahmer's live test passes (open /api/ping.php, then the
  // curl in the file's header, then 1 test per form arriving on Zoho), because with it on and PHP not
  // running a distributor would see "did not go through", which the 24 Sep ruling (H3) forbids.
  // TO SWITCH ON: enabled: true, rebuild, redeploy. 1 line.
  enabled: false,
  endpoint: '/api/enquiry.php',
  timeoutMs: 12000,
  /** A person filling a form honestly takes longer than this. Repeated on the server. */
  minOpenMs: 2500,
}

export type SubmitInput = {
  form: FormKey
  fields: Record<string, string>
  page: string
  openedAt: number
  /** The honeypot's value. Anything but an empty string is a bot. */
  hp: string
}

export async function submitForm(input: SubmitInput): Promise<SubmitResult> {
  // A bot filled the hidden field. Answer as though it worked and post nothing: telling a script it
  // was caught only teaches whoever wrote it to fill the field differently next time.
  if (input.hp.trim() !== '') return { ok: true, ref: null }
  if (!FORMS.enabled) return { ok: false, reason: 'offline' }

  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), FORMS.timeoutMs)
  try {
    const res = await fetch(FORMS.endpoint, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        form: input.form,
        fields: input.fields,
        page: input.page,
        sentAt: new Date().toISOString(),
        openedMs: Date.now() - input.openedAt,
        hp: input.hp,
      }),
    })
    if (res.status === 429) return { ok: false, reason: 'rate-limited' }
    if (res.status === 422) {
      const j = await res.json().catch(() => ({}))
      return { ok: false, reason: 'invalid', message: String(j.message || 'Something in the form needs correcting.') }
    }
    if (!res.ok) return { ok: false, reason: 'offline' }
    // A 200 is only a success if the body is the endpoint's own JSON with ok:true. A host that serves
    // the PHP file as text also answers 200, and that must read as offline, not as sent.
    const j = await res.json().catch(() => null)
    if (!j || j.ok !== true) return { ok: false, reason: 'offline' }
    return { ok: true, ref: j.ref ? String(j.ref) : null }
  } catch {
    return { ok: false, reason: 'offline' }
  } finally {
    window.clearTimeout(t)
  }
}

/**
 * The same enquiry as one block of text, for the fallback and for the mail subject. Written the way
 * a person would write it rather than as a dump of field names, because on the WhatsApp path a human
 * reads this before he presses send.
 */
export function asMessage(intro: string, fields: Record<string, string>, labels: Record<string, string>) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${labels[k] ?? k}: ${v.trim()}`)
  return `${intro}\n\n${lines.join('\n')}`
}

/**
 * Accept what people type; normalise to +92 3XX XXXXXXX. Returns null if it cannot be read.
 *
 * Moved here from EnquiryForm.tsx on 10 Sep 2026 so all four forms validate a phone number the same
 * way. The rule it encodes is the one that matters: 0300 1234567, +92 300 1234567, 92300…, and
 * 300-1234567 are all the same number, and rejecting one of them over its spacing is how a form
 * loses a customer it already had.
 */
export function normalisePkPhone(raw: string): string | null {
  const d = raw.replace(/[^\d+]/g, '').replace(/^\+/, '')
  let n = d
  if (n.startsWith('0092')) n = n.slice(4)
  else if (n.startsWith('92')) n = n.slice(2)
  else if (n.startsWith('0')) n = n.slice(1)
  // A Pakistani mobile is 3XXXXXXXXX after the country code — ten digits starting with 3.
  if (!/^3\d{9}$/.test(n)) return null
  return `+92 ${n.slice(0, 3)} ${n.slice(3)}`
}

export const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
