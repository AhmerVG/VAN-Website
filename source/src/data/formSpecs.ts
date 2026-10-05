import type { Field } from '@/components/VanForm'

/**
 * THE FOUR FORMS — 10 September 2026.
 *
 * Tahir ruled all four get a real Submit, text only, no file uploads. So a photograph of a bag still
 * travels on WhatsApp, and the report-a-bag form says so rather than offering an upload that goes
 * nowhere.
 *
 * THE RULE BEHIND THE FIELD COUNTS, and it is the only design decision in this file: every field is
 * a place a sender can stop. The dealer and partner forms can afford six or seven, because a company
 * filling one has already decided to make contact. The farmer form has four, because a man standing
 * in a field with one hand on a phone will abandon the fifth, and VAN would rather have his number
 * and his crop than a complete record of nobody.
 */

const PHONE: Field = { name: 'phone', label: 'Phone', type: 'tel', required: true, half: true, placeholder: '0300 1234567', autoComplete: 'tel' }
const DISTRICT: Field = { name: 'district', label: 'District', half: true, placeholder: 'e.g. Sahiwal', autoComplete: 'address-level2' }

/**
 * 11 Sep 2026 · the required fields were the wrong way round. A company email was required and the
 * shop name and the sender's name were optional, so an agri-input shopkeeper with a WhatsApp number
 * and no company address could not send the form at all, while the two fields that would let VAN
 * qualify him were the ones he could skip. The phone is the contact that matters in this trade.
 */
export const DEALER_FORM: Field[] = [
  { name: 'company', label: 'Company or shop name', required: true, half: true, autoComplete: 'organization' },
  { name: 'name', label: 'Your name', half: true, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', half: true, help: 'Optional. Give an email and we reply by email. Leave it blank and we reply on WhatsApp.', autoComplete: 'email' },
  PHONE,
  { name: 'territory', label: 'District or territory you cover', half: true, autoComplete: 'address-level2' },
  {
    name: 'volume', label: 'Volume you would expect to move', type: 'select', half: true,
    options: ['Under 10 tonnes a season', '10–50 tonnes a season', '50–200 tonnes a season', 'Over 200 tonnes a season', 'Not sure yet'],
  },
  { name: 'note', label: 'Anything else', type: 'textarea', placeholder: 'Which crops your customers grow, what you carry today, anything you want to ask' },
]

export const PARTNER_FORM: Field[] = [
  { name: 'company', label: 'Company', required: true, half: true, autoComplete: 'organization' },
  { name: 'name', label: 'Your name and role', half: true, autoComplete: 'name' },
  { name: 'email', label: 'Work email', type: 'email', required: true, half: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', half: true, placeholder: '0300 1234567', autoComplete: 'tel' },
  { name: 'market', label: 'Market', half: true, placeholder: 'Pakistan, or which country' },
  {
    name: 'route', label: 'Which route', type: 'select', half: true,
    options: ['Developed to our brief', 'Something already in your library', 'Not sure yet. We want to talk it through'],
  },
  { name: 'crop', label: 'Crop or crops', half: true },
  { name: 'volume', label: 'Indicative first-year volume', half: true, placeholder: 'Tonnes or litres, however rough' },
  {
    name: 'constraint', label: 'What the product has to do', type: 'textarea', required: true,
    placeholder: 'The problem, not the specification. What is going wrong in the field, or what the market is asking for and nobody is selling.',
  },
]

export const LAB_TEST_FORM: Field[] = [
  { name: 'name', label: 'Your name', required: true, half: true },
  PHONE,
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'company', label: 'Company', half: true },
  { name: 'product', label: 'What you want tested', required: true, half: true, placeholder: 'Any fertilizer, any brand, or soil' },
  { name: 'samples', label: 'How many samples', half: true, placeholder: 'e.g. 3' },
  { name: 'tests', label: 'Which tests, if you know', type: 'textarea', placeholder: 'Leave it blank and Sample Reception will tell you what applies.' },
]

/**
 * The counterfeit route. It arrives prefilled with the batch number the reader just checked, so he
 * does not type it twice. `dealer` is the field VAN actually acts on: a number that is not in the
 * records matters much less than where the bag came from.
 */
export const REPORT_BAG_FORM: Field[] = [
  { name: 'batch', label: 'Batch number on the bag', required: true, half: true },
  { name: 'product', label: 'What the bag says it is', half: true },
  { name: 'dealer', label: 'Where you bought it', required: true, half: true, placeholder: 'Shop or dealer name' },
  DISTRICT,
  { name: 'name', label: 'Your name', half: true },
  PHONE,
  { name: 'note', label: 'Anything else about the bag', type: 'textarea', placeholder: 'How it looked, what it cost, whether the stitching or printing seemed wrong' },
]

/**
 * FOUR FIELDS. Everything else was cut. He asked for this one built even after I argued against it,
 * so it is built to be finishable one-handed: name, number, district, crop, and a note nobody has to
 * write. WhatsApp is still offered first on every page that carries it, because that is what a
 * farmer will actually use.
 */
export const FARMER_FORM: Field[] = [
  { name: 'name', label: 'Your name', required: true, half: true },
  PHONE,
  DISTRICT,
  { name: 'crop', label: 'Crop', half: true, placeholder: 'e.g. wheat' },
  { name: 'acres', label: 'How many acres', half: true, placeholder: 'e.g. 12' },
  { name: 'note', label: 'Anything else', type: 'textarea', placeholder: 'Sowing date, what you applied last season, what went wrong' },
]
