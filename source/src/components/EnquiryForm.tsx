import { CONTACT } from '@/data/site'
import { VanForm } from './VanForm'
import { DEALER_FORM } from '@/data/formSpecs'
export { normalisePkPhone } from '@/lib/forms'

/**
 * THE DEALER ENQUIRY — rebuilt on the shared engine, 10 September 2026.
 *
 * IT HAS A SUBMIT NOW. Tahir: "lets build all form as submitted, my backend team will do what need
 * to be done." So the long note that used to sit here explaining why a static site could not have a
 * Submit button is gone, and with it the reason.
 *
 * What has NOT changed is the promise underneath it: WhatsApp and email are still on the form, and
 * if the POST fails for any reason the enquiry is handed straight to them with the message already
 * written. The button was never the point. Not losing the enquiry was.
 *
 * The fields are his own right-hand sketch from 9 September, plus the two the reply depends on:
 * volume, company email, phone, territory, and a note nobody is required to write.
 */
export function EnquiryForm() {
  return (
    <VanForm
      form="dealer"
      fields={DEALER_FORM}
      intro="Hello VAN. I would like to carry your range."
      submitLabel="Send the enquiry"
      to={CONTACT.partnerEmail}
      subject="Distributor enquiry from van.com.pk"
      success="Someone from the commercial team answers within one working day. If you would rather talk it through first, the WhatsApp number on this page reaches the same team."
    />
  )
}
