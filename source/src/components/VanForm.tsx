import { useMemo, useRef, useState } from 'react'
import { wa, CONTACT } from '@/data/site'
import { FORMS, asMessage, looksLikeEmail, normalisePkPhone, submitForm, type FormKey, type SubmitResult } from '@/lib/forms'

/**
 * ONE FORM, USED FOUR TIMES — 10 September 2026.
 *
 * Tahir: "lets build all form as submitted, my backend team will do what need to be done but what we
 * need to do at front end? what you needed to build it?"
 *
 * This is the answer to the first half. Every form on the site is a field list handed to this
 * component; the states, the validation, the spam checks and the fallback are written once. When his
 * team has the endpoint they set FORMS.enabled and all four go live together.
 *
 * WHAT THE FRONT END HAD TO DO, and each of these is a real decision rather than plumbing:
 *
 *  1. NEVER LOSE AN ENQUIRY. If the POST fails for any reason — server down, CORS misconfigured, no
 *     signal on a phone in a field, endpoint not built yet — the sender is not told "sorry, try
 *     later". He is handed the same message, already written, on WhatsApp or in his mail client. A
 *     form that loses an enquiry it already had is worse than no form, because he believes he has
 *     been in touch and VAN never learns he tried.
 *  2. NEVER SEND IT TWICE. The button disables while in flight, and a successful send closes the
 *     form rather than leaving a live Submit under a man's thumb.
 *  3. SPAM WITHOUT A CAPTCHA. A hidden field no person sees, and how long the form was open. Neither
 *     costs a farmer a single tap. Both are re-checked on the server, because a check that only runs
 *     in a browser is advice.
 *  4. VALIDATE ONLY WHERE BEING WRONG COSTS THE REPLY. The email must look like an email and the
 *     phone must be readable, because a mistyped one loses the enquiry silently. Everything else is
 *     accepted as typed. A man who wants to write two lines and his number should not be stopped by
 *     a form asking which volume band he falls into.
 *  5. SAY WHERE IT GOES. One line under the button naming the inbox, so nobody wonders whether he
 *     has just handed his phone number to a third party. He has not: the endpoint is VAN's own.
 */

export type Field = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  options?: string[]
  required?: boolean
  placeholder?: string
  help?: string
  /** Half width from 640px up. Two half fields sit on one row. */
  half?: boolean
  /**
   * The autocomplete token, so an Android keyboard can fill it. Every field used to be
   * autoComplete="off", which switched autofill off on exactly the fields it would have filled:
   * name, company, district. On a phone that is the difference between two taps and forty.
   */
  autoComplete?: string
}

type Props = {
  form: FormKey
  fields: Field[]
  /** The first line of the message, in the sender's voice, used on the fallback paths too. */
  intro: string
  submitLabel: string
  /** Which inbox this form goes to. Named on the page. */
  to: string
  /** Subject line for the email fallback. */
  subject: string
  /** What VAN will do next, shown once it is sent. */
  success: string
  /** Prefilled values, e.g. the batch number from the check above. */
  initial?: Record<string, string>
  compact?: boolean
}

export function VanForm({ form, fields, intro, submitLabel, to, subject, success, initial = {}, compact = false }: Props) {
  const [vals, setVals] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    for (const f of fields) v[f.name] = initial[f.name] ?? ''
    return v
  })
  const [hp, setHp] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<SubmitResult | null>(null)
  const openedAt = useRef(Date.now())

  const labels = useMemo(() => Object.fromEntries(fields.map(f => [f.name, f.label])), [fields])
  const set = (n: string, v: string) => setVals(x => ({ ...x, [n]: v }))

  const errorFor = (f: Field): string | null => {
    const v = (vals[f.name] ?? '').trim()
    if (f.required && !v) return 'We need this to reply'
    if (!v) return null
    if (f.type === 'email' && !looksLikeEmail(v)) return 'That does not look like an email address'
    if (f.type === 'tel' && !normalisePkPhone(v)) return 'Write it as 0300 1234567 or +92 300 1234567'
    return null
  }
  const errors = fields.map(f => [f, errorFor(f)] as const).filter(([, e]) => e)
  const canSend = errors.length === 0 && fields.some(f => (vals[f.name] ?? '').trim())

  /** What actually gets sent, and what the fallback paths carry. Phone normalised on the way out. */
  const outgoing = useMemo(() => {
    const o: Record<string, string> = {}
    for (const f of fields) {
      const v = (vals[f.name] ?? '').trim()
      if (!v) continue
      o[f.name] = f.type === 'tel' ? (normalisePkPhone(v) ?? v) : v
    }
    return o
  }, [vals, fields])

  const message = asMessage(intro, outgoing, labels)
  const waHref = wa(message)
  const mailHref = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    /**
     * 11 Sep 2026 · the button used to be disabled until every required field passed, and `touched`
     * is only set on blur. A reader who skipped a required field without ever focusing it saw a
     * grey button, no message, and no way to find out what was wrong. A disabled button also fires
     * no event, so there was nothing to tell him with. The button is live now: pressing it marks
     * everything touched, shows the errors, and takes him to the first one.
     */
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])))
    if (busy) return
    if (!canSend) {
      const bad = fields.find(f => errorFor(f))
      if (bad) {
        const el = document.getElementById(`${form}-${bad.name}`)
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        ;(el as HTMLInputElement | null)?.focus({ preventScroll: true })
      }
      return
    }
    /**
     * H3, 24 Sep 2026: with FORMS.enabled false the POST can never succeed, so pressing the main
     * button told a distributor "The form is not connected yet" and offered a "Try again" that could
     * not work. While the endpoint is unbuilt the button now does the fallback directly: it opens the
     * ready-written WhatsApp message (synchronously, inside the click, so no popup blocker stops it)
     * and shows email as the second route. A filled honeypot still goes through submitForm, which
     * answers a bot with a silent "ok". Revert: delete this block.
     */
    if (!FORMS.enabled && hp.trim() === '') {
      window.open(waHref, '_blank', 'noopener')
      setRes({ ok: false, reason: 'offline' })
      return
    }
    setBusy(true)
    setRes(await submitForm({ form, fields: outgoing, page: window.location.hash || '#/', openedAt: openedAt.current, hp }))
    setBusy(false)
  }

  // ── sent ──────────────────────────────────────────────────────────────────────────────────────
  if (res?.ok) {
    return (
      <div className="panel p-5 lg:p-6" style={{ borderColor: 'var(--green)', borderWidth: 2 }}>
        <div className="flex items-center gap-3">
          <span className="bv-mark bv-pass" aria-hidden="true">✓</span>
          <div>
            <div className="display text-[20px]" style={{ color: 'var(--navy)' }}>Sent.</div>
            {res.ref && <div className="cap num">Your reference is {res.ref}. Quote it if you follow up.</div>}
          </div>
        </div>
        <p className="small mt-3 max-w-[140ch]">{success}</p>
        <p className="cap mt-2">It went to {to}.</p>
      </div>
    )
  }

  const failed = res && !res.ok
  const offline = failed && (res.reason === 'offline' || res.reason === 'rate-limited')

  return (
    <form onSubmit={send} className={`panel ${compact ? 'p-4' : 'p-5 lg:p-6'}`} noValidate>
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map(f => {
          const err = touched[f.name] ? errorFor(f) : null
          const id = `${form}-${f.name}`
          return (
            <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
              <label className="block font-bold small" htmlFor={id}>
                {f.label}{!f.required && <span className="cap" style={{ fontWeight: 400 }}> · optional</span>}
              </label>
              {f.type === 'select' ? (
                <select id={id} className="input mt-1" value={vals[f.name]} onChange={e => set(f.name, e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, [f.name]: true }))}>
                  <option value="">Choose one</option>
                  {(f.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea id={id} className="input mt-1" rows={3} value={vals[f.name]} placeholder={f.placeholder}
                  onChange={e => set(f.name, e.target.value)} onBlur={() => setTouched(t => ({ ...t, [f.name]: true }))}
                  aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} />
              ) : (
                <input id={id} className="input mt-1" type={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'text'}
                  inputMode={f.type === 'tel' ? 'tel' : undefined} autoComplete={f.autoComplete ?? (f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'off')}
                  value={vals[f.name]} placeholder={f.placeholder}
                  onChange={e => set(f.name, e.target.value)} onBlur={() => setTouched(t => ({ ...t, [f.name]: true }))}
                  aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} />
              )}
              {/* A phone number is the one field the site rewrites before sending. Showing the
                  rewritten form under the box means nobody discovers on WhatsApp that VAN read
                  their number differently from how they typed it. It shows even when the rewrite
                  changed nothing, because "we read it the same way you wrote it" is also worth
                  saying. Carried over from the form this engine replaced; it was lost in the
                  rebuild, and formtest.mjs caught it. */}
              {f.type === 'tel' && !err && normalisePkPhone(vals[f.name] ?? '') && (
                <span className="cap block mt-1" style={{ color: 'var(--green)' }}>Will be sent as {normalisePkPhone(vals[f.name] ?? '')}</span>
              )}
              {f.help && !err && <span className="cap block mt-1">{f.help}</span>}
              {err && <span id={`${id}-err`} className="cap block mt-1" style={{ color: 'var(--rust)', fontWeight: 700 }} role="alert">{err}</span>}
            </div>
          )
        })}
      </div>

      {/* The honeypot. A person never sees it and never fills it; a script fills everything. Not
          display:none, some bots skip hidden inputs, but off-screen and out of the tab order. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={`${form}-website`}>Company website</label>
        <input id={`${form}-website`} name="company_website" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button className="btn btn-navy btn-lg" type="submit" disabled={busy}>{busy ? 'Sending…' : submitLabel}</button>
        {/* Not "instead". Both routes carry the same assembled message and reach the same inbox, and
            while the endpoint is unbuilt WhatsApp is the one that actually arrives. */}
        {FORMS.enabled
          ? <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener">Send it on WhatsApp</a>
          : <a className="btn btn-ghost" href={mailHref}>Send it by email instead</a>}
      </div>
      {FORMS.enabled
        ? <p className="cap mt-2">It goes to {to}. VAN's own inbox, not a third party.</p>
        : <p className="cap mt-2">Pressing it opens WhatsApp with your message already written, addressed to VAN on {CONTACT.whatsapp}. You see it before it goes. Or send the same message by email to {to}.</p>}

      {failed && res.reason === 'invalid' && (
        <p className="small mt-3" style={{ color: 'var(--rust)', fontWeight: 700 }} role="alert">{res.message}</p>
      )}

      {offline && !FORMS.enabled && (
        <div className="panel-soft p-4 mt-3" role="status" style={{ borderLeft: '4px solid var(--green)' }}>
          <p className="small">
            <b>Your message is written and ready.</b> It has opened in WhatsApp. If WhatsApp did not
            open, send it from here, or send it by email to {to}. Both reach the same people.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener">Send on WhatsApp</a>
            <a className="btn btn-ghost" href={mailHref}>Send by email</a>
          </div>
        </div>
      )}
      {offline && FORMS.enabled && (
        <div className="panel-soft p-4 mt-3" role="alert" style={{ borderLeft: '4px solid var(--gold)' }}>
          <p className="small">
            <b>{res.reason === 'rate-limited' ? 'That has been sent a few times already.' : 'That did not go through.'}</b>{' '}
            Your message is written and ready. Send it whichever way suits you and it reaches the same people.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener">Send on WhatsApp</a>
            <a className="btn btn-ghost" href={mailHref}>Send by email</a>
            <button className="btn btn-ghost" type="submit" disabled={busy}>Try again</button>
          </div>
        </div>
      )}
    </form>
  )
}
