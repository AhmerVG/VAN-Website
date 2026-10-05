/**
 * WHERE TO BUY — O-9, 9 September 2026.
 *
 * Tahir: "find a deler, add dealers in the backend somewhere, how we will confubure dealer, we only
 * have 6-7 delaers" — then, when asked where the list lives: "go to os2 and craete the list yourseld,
 * go in dealer and find the list and extract infotmation."
 *
 * SOURCE OF RECORD is the O2S Customer Master (van-control-tower.onrender.com, internal, behind a
 * sign-in). Every row below was read from O2S and then checked against the export Tahir sent. VAN Lab
 * did not enter the credentials; Tahir signed in himself and the records were opened read-only and
 * cancelled, so nothing in O2S was changed.
 *
 * WHAT IS DELIBERATELY NOT HERE:
 *   · Zaem Trader, Multan (DLR-PB-MUL-007) — the eighth dealer record and the only one marked
 *     *Inclusive* rather than *Exclusive*. Tahir left it out of the list he sent. Not an oversight
 *     on our side; it stays off until he says otherwise.
 *   · The three Distributor records (BKK, Kashmir Sugar Mills Shorkot, Excel Chemical Karachi). A
 *     sugar mill and a chemical company are not places a farmer buys a bag. BKK was looked at
 *     properly and ruled off the site the same day: "so remobve bkk and leys fo to dealers".
 *   · White-label, VGreen and Direct Farmer segments — business lines, not shops.
 *
 * PHONE NUMBERS: Tahir confirmed on 9 September that every dealer has already agreed to have their
 * number published — "ALL DEALER AGGRED ALRADY" — and, on staff numbers, "I KNOW I HAVE ASKED MY
 * TEAM". Asked once, answered, and taken as answered.
 *
 * WHY A PLAIN LIST AND NOT A SEARCH BOX: seven dealers and two company shops cover Jhang, Kot Addu,
 * Chiniot, Lahore, Kasur, Tando Allahyar and Matiari. A farmer in Faisalabad, Sargodha, Multan,
 * Bahawalpur, Rahim Yar Khan or DG Khan has nobody near him. A search box at this size mostly returns
 * nothing, and the nothing advertises how thin the network is. A list shows the whole network at once
 * and turns the gap into an enquiry instead of a dead end.
 *
 * AT THIS SIZE THIS IS A DATA FILE, NOT A BACKEND. That holds to roughly a hundred outlets, or until
 * outlets need to edit their own listings. When either happens it moves to O2S as the live source.
 */

export type Outlet = {
  code: string
  name: string
  kind: 'dealer' | 'centre'
  city: string
  province: 'Punjab' | 'Sindh'
  contact: string
  role?: string
  phone: string | null
  note?: string
}

export const OUTLETS: Outlet[] = [
  // ── VAN's own shops. Tahir: "Vital Agri Centers, YES" — that is the trading name, and it goes on
  //    the site. NOT to be confused with VGreen's four hubs, which carry no brand name.
  //    "BOTH VITAL AGRI CENTER GO LIVE, I SAID NO MNORE, THOSE TWO WILL GO" — two live, no more yet.
  { code: 'VAC-SN-MAT', name: 'Vital Agri Center, Matiari', kind: 'centre', city: 'Matiari', province: 'Sindh', contact: 'Naqi Haider', role: 'Business Head, Matiari', phone: '+92 300 0652297' },
  { code: 'VAC-SN-TAY', name: 'Vital Agri Center, Tando Allahyar', kind: 'centre', city: 'Tando Allahyar', province: 'Sindh', contact: 'Muhammad Irfan', role: 'Regional Business Head, Sindh', phone: '+92 300 8299001' },

  // ── The seven dealers, read from the O2S Customer Master.
  { code: 'DLR-PB-JHN-001', name: 'Kissan Zarai Merkaz', kind: 'dealer', city: 'Jhang', province: 'Punjab', contact: 'Rana Shahab', phone: '0300 3503000' },
  { code: 'DLR-PB-KTA-002', name: 'Ubaid Agro Traders', kind: 'dealer', city: 'Kot Addu', province: 'Punjab', contact: 'Ch Abdul Zahoor', phone: '0300 7486986' },
  { code: 'DLR-PB-CNT-004', name: 'Chiniot Agri Center', kind: 'dealer', city: 'Chiniot', province: 'Punjab', contact: 'Nafay Arabi', phone: '0307 6666513' },
  { code: 'DLR-PB-LHR-005', name: 'Bilal & Co', kind: 'dealer', city: 'Lahore', province: 'Punjab', contact: 'Muhammad Bilal', phone: '0322 4604653' },
  { code: 'DLR-PB-KSR-006', name: 'Afaq Zari Merkaz', kind: 'dealer', city: 'Kasur', province: 'Punjab', contact: 'Saadat Munir', phone: '0322 4991479' },
  { code: 'DLR-SN-TAY-003', name: 'Ghfar Zari Merkaz', kind: 'dealer', city: 'Tando Allahyar', province: 'Sindh', contact: 'Saim Sagheer', phone: '0300 3241663' },
  // Arain Traders has no number in O2S. Rather than print a blank or invent one, the row says so and
  // routes through VAN's own line — which is the honest version and still reaches the shop.
  { code: 'DLR-SN-TAN-008', name: 'Arain Traders', kind: 'dealer', city: 'Tando Allahyar', province: 'Sindh', contact: 'Muhammad Afzal', phone: null, note: 'No number on record. Reach them through VAN and we will connect you.' },
]

/**
 * The Sindh focal person. Tahir placed him three times: the contact on the Tando Allahyar centre,
 * the named Sindh contact on this page, and the route for a new dealership enquiry from the province
 * — "AND YES, WE CAN PLACE IRFAN IN SINDH AS MAIN FOCAL PEFSON FOR NEW DEALER AS WELL." One title
 * everywhere, or it reads as three different jobs.
 */
export const SINDH_FOCAL = {
  name: 'Muhammad Irfan',
  role: 'Regional Business Head, Sindh',
  phone: '+92 300 8299001',
  email: 'irfan@van.com.pk',
  linkedin: 'https://www.linkedin.com/in/muhammad-irfan-219784146/',
}

/** Districts with an outlet, used to say plainly where there is nobody. */
export const COVERED = Array.from(new Set(OUTLETS.map(o => o.city)))
