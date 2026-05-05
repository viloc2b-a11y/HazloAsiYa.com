// ─────────────────────────────────────────────────────────────
// lib/acroform/w7-mapper.ts
// HazloAsíYa — W-7 (Rev. October 2023) AcroField Mapper
// Application for IRS Individual Taxpayer Identification Number
//
// PDF oficial: /public/forms/fw7.pdf
// Descarga:    https://www.irs.gov/pub/irs-pdf/fw7.pdf
//
// Después de descargar:
//   python inspect_fields.py public/forms/fw7.pdf > w7_actual.json
//   python reconcile_fields.py w7_actual.json w7
// ─────────────────────────────────────────────────────────────

import { PDFDocument } from 'pdf-lib'

// ── W-7 Field Map ─────────────────────────────────────────────
// La revisión Oct-2023 del W-7 es un AcroForm con campos tipo texto
// y checkboxes para las casillas a-h de razón.
// Los nombres siguen el patrón del IRS: f1_NN[0] para texto, c1_N[0] para checks.

const W7_FIELDS = {
  // ── Reason checkboxes (a-h) — solo marcar UNO ─────────────
  // a: Nonresident alien required to get ITIN for tax treaty benefit
  reasonA: 'c1_1[0]',
  // b: Nonresident alien filing U.S. federal tax return
  reasonB: 'c1_2[0]',
  // c: U.S. resident alien filing U.S. federal tax return
  reasonC: 'c1_3[0]',
  // d: Dependent of U.S. citizen/resident alien
  reasonD: 'c1_4[0]',
  // e: Spouse of U.S. citizen/resident alien
  reasonE: 'c1_5[0]',
  // f: Nonresident alien student, professor, or researcher
  reasonF: 'c1_6[0]',
  // g: Dependent/spouse of nonresident alien visa holder
  reasonG: 'c1_7[0]',
  // h: Other — specify in box
  reasonH: 'c1_8[0]',
  reasonHText: 'f1_01[0]',   // text box next to (h)

  // ── Line 1a — Name ─────────────────────────────────────────
  firstName:    'f1_02[0]',   // 1a First name
  middleName:   'f1_03[0]',   // 1a Middle name/initial
  lastName:     'f1_04[0]',   // 1a Last/family name (surname)

  // ── Line 1b — Name on prior tax return ────────────────────
  priorFirstName: 'f1_05[0]',
  priorLastName:  'f1_06[0]',

  // ── Line 2 — Applicant's mailing address ──────────────────
  streetAddr:   'f1_07[0]',   // Street address + apt
  city:         'f1_08[0]',   // City
  state:        'f1_09[0]',   // State/province
  zip:          'f1_10[0]',   // ZIP/postal code
  country:      'f1_11[0]',   // Country (if outside U.S.)

  // ── Line 3 — Foreign address (if different) ───────────────
  foreignStreet:  'f1_12[0]',
  foreignCity:    'f1_13[0]',
  foreignCountry: 'f1_14[0]',

  // ── Line 4 — Date of birth ────────────────────────────────
  dobMonth: 'f1_15[0]',
  dobDay:   'f1_16[0]',
  dobYear:  'f1_17[0]',

  // ── Line 5 — Country/ies of citizenship ───────────────────
  citizenship: 'f1_18[0]',

  // ── Line 6a — Foreign tax ID number ───────────────────────
  foreignTaxID: 'f1_19[0]',

  // ── Line 6b — Foreign passport ────────────────────────────
  passportNum:     'f1_20[0]',
  passportCountry: 'f1_21[0]',

  // ── Line 6c — Type of U.S. visa ───────────────────────────
  visaType:   'f1_22[0]',
  visaNumber: 'f1_23[0]',
  visaExp:    'f1_24[0]',   // Expiration date mm/dd/yyyy

  // ── Line 6d — Identification document (checkbox + number) ─
  // Checkboxes for doc type: passport, driver's license, etc.
  docPassport:        'c1_9[0]',
  docDriverLic:       'c1_10[0]',
  docNatIDCard:       'c1_11[0]',
  docUSStateLic:      'c1_12[0]',
  docForeignMilID:    'c1_13[0]',
  docUSMilID:         'c1_14[0]',
  docVoterRegCard:    'c1_15[0]',
  docCivilBirthCert:  'c1_16[0]',
  docMedRecords:      'c1_17[0]',
  docSchoolRecords:   'c1_18[0]',
  // Document number and exp date
  docNumber:    'f1_25[0]',
  docExp:       'f1_26[0]',
  docCountry:   'f1_27[0]',

  // ── Line 6e — Have you previously received a U.S. ITIN? ──
  prevITINYes: 'c1_19[0]',
  prevITINNo:  'c1_20[0]',
  prevITIN:    'f1_28[0]',   // Previous ITIN number 9XX-XX-XXXX
  prevName:    'f1_29[0]',   // Name under which ITIN was issued

  // ── Line 6f — Lost ITIN ───────────────────────────────────
  lostITINYes: 'c1_21[0]',
  lostITINNo:  'c1_22[0]',

  // ── Signature section ─────────────────────────────────────
  signDate: 'f1_30[0]',
  phone:    'f1_31[0]',
} as const

// ── Reason codes ──────────────────────────────────────────────
export type W7Reason = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

const REASON_FIELD_MAP: Record<W7Reason, keyof typeof W7_FIELDS> = {
  a: 'reasonA',
  b: 'reasonB',
  c: 'reasonC',
  d: 'reasonD',
  e: 'reasonE',
  f: 'reasonF',
  g: 'reasonG',
  h: 'reasonH',
}

// ── Document types ────────────────────────────────────────────
export type W7DocType =
  | 'passport' | 'driverLic' | 'natIDCard' | 'usStateLic'
  | 'foreignMilID' | 'usMilID' | 'voterReg' | 'birthCert'
  | 'medRecords' | 'schoolRecords'

const DOC_FIELD_MAP: Record<W7DocType, keyof typeof W7_FIELDS> = {
  passport:     'docPassport',
  driverLic:    'docDriverLic',
  natIDCard:    'docNatIDCard',
  usStateLic:   'docUSStateLic',
  foreignMilID: 'docForeignMilID',
  usMilID:      'docUSMilID',
  voterReg:     'docVoterRegCard',
  birthCert:    'docCivilBirthCert',
  medRecords:   'docMedRecords',
  schoolRecords:'docSchoolRecords',
}

export interface W7FormData {
  // Reason
  reason:      W7Reason
  reasonHText?: string   // only if reason === 'h'

  // Line 1a — Name
  firstName:   string
  middleName?: string
  lastName:    string

  // Line 1b — Prior name (if different on previous return)
  priorFirstName?: string
  priorLastName?:  string

  // Line 2 — Mailing address
  streetAddr:  string
  city:        string
  state?:      string
  zip?:        string
  country?:    string    // if outside U.S.

  // Line 3 — Foreign address (if different from mailing)
  foreignStreet?:  string
  foreignCity?:    string
  foreignCountry?: string

  // Line 4 — DOB
  dob: string   // ISO YYYY-MM-DD

  // Line 5 — Citizenship
  citizenship: string   // country name(s)

  // Line 6a — Foreign tax ID
  foreignTaxID?: string

  // Line 6b — Passport
  passportNum?:     string
  passportCountry?: string

  // Line 6c — Visa
  visaType?:   string
  visaNumber?: string
  visaExp?:    string   // ISO date

  // Line 6d — ID document
  docType:      W7DocType
  docNumber?:   string
  docExp?:      string   // ISO date
  docCountry?:  string

  // Line 6e — Previous ITIN
  hadPrevITIN:  boolean
  prevITIN?:    string   // 9XX-XX-XXXX
  prevName?:    string

  // Line 6f — Lost ITIN
  lostITIN?: boolean

  // Contact
  phone?: string
}

// ── Main fill function ────────────────────────────────────────
export async function fillW7AcroForm(data: W7FormData): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/fw7.pdf').then(r => r.arrayBuffer())
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try { form.getTextField(id).setText(val) }
    catch { console.warn(`[W7] setText: ${id}`) }
  }

  const setCheck = (id: string, checked: boolean) => {
    try {
      const cb = form.getCheckBox(id)
      if (checked) cb.check(); else cb.uncheck()
    } catch { console.warn(`[W7] checkbox: ${id}`) }
  }

  // ── Reason ─────────────────────────────────────────────────
  const reasonFieldKey = REASON_FIELD_MAP[data.reason]
  setCheck(W7_FIELDS[reasonFieldKey] as string, true)
  if (data.reason === 'h' && data.reasonHText) {
    setText(W7_FIELDS.reasonHText, data.reasonHText)
  }

  // ── Line 1a — Name ─────────────────────────────────────────
  setText(W7_FIELDS.firstName,  data.firstName)
  setText(W7_FIELDS.middleName, data.middleName ?? '')
  setText(W7_FIELDS.lastName,   data.lastName)

  // ── Line 1b — Prior name ───────────────────────────────────
  setText(W7_FIELDS.priorFirstName, data.priorFirstName ?? '')
  setText(W7_FIELDS.priorLastName,  data.priorLastName  ?? '')

  // ── Line 2 — Mailing address ───────────────────────────────
  setText(W7_FIELDS.streetAddr, data.streetAddr)
  setText(W7_FIELDS.city,       data.city)
  setText(W7_FIELDS.state,      data.state   ?? '')
  setText(W7_FIELDS.zip,        data.zip     ?? '')
  setText(W7_FIELDS.country,    data.country ?? '')

  // ── Line 3 — Foreign address ───────────────────────────────
  setText(W7_FIELDS.foreignStreet,  data.foreignStreet  ?? '')
  setText(W7_FIELDS.foreignCity,    data.foreignCity    ?? '')
  setText(W7_FIELDS.foreignCountry, data.foreignCountry ?? '')

  // ── Line 4 — DOB ───────────────────────────────────────────
  if (data.dob) {
    const [y, m, d] = data.dob.split('-')
    setText(W7_FIELDS.dobMonth, m)
    setText(W7_FIELDS.dobDay,   d)
    setText(W7_FIELDS.dobYear,  y)
  }

  // ── Line 5 — Citizenship ───────────────────────────────────
  setText(W7_FIELDS.citizenship, data.citizenship)

  // ── Line 6a — Foreign tax ID ───────────────────────────────
  setText(W7_FIELDS.foreignTaxID, data.foreignTaxID ?? '')

  // ── Line 6b — Passport ────────────────────────────────────
  setText(W7_FIELDS.passportNum,     data.passportNum     ?? '')
  setText(W7_FIELDS.passportCountry, data.passportCountry ?? '')

  // ── Line 6c — Visa ─────────────────────────────────────────
  setText(W7_FIELDS.visaType,   data.visaType   ?? '')
  setText(W7_FIELDS.visaNumber, data.visaNumber ?? '')
  if (data.visaExp) setText(W7_FIELDS.visaExp, formatDateMMDDYYYY(data.visaExp))

  // ── Line 6d — ID document ──────────────────────────────────
  const docFieldKey = DOC_FIELD_MAP[data.docType]
  setCheck(W7_FIELDS[docFieldKey] as string, true)
  setText(W7_FIELDS.docNumber,  data.docNumber  ?? '')
  setText(W7_FIELDS.docCountry, data.docCountry ?? '')
  if (data.docExp) setText(W7_FIELDS.docExp, formatDateMMDDYYYY(data.docExp))

  // ── Line 6e — Previous ITIN ────────────────────────────────
  setCheck(W7_FIELDS.prevITINYes, !!data.hadPrevITIN)
  setCheck(W7_FIELDS.prevITINNo,  !data.hadPrevITIN)
  if (data.hadPrevITIN) {
    setText(W7_FIELDS.prevITIN, data.prevITIN ?? '')
    setText(W7_FIELDS.prevName, data.prevName ?? '')
  }

  // ── Line 6f — Lost ITIN ────────────────────────────────────
  if (data.lostITIN !== undefined) {
    setCheck(W7_FIELDS.lostITINYes, !!data.lostITIN)
    setCheck(W7_FIELDS.lostITINNo,  !data.lostITIN)
  }

  // ── Contact ────────────────────────────────────────────────
  setText(W7_FIELDS.phone, data.phone ?? '')

  return pdfDoc.save()
}

// ── Dev tool ──────────────────────────────────────────────────
export async function debugW7Fields(): Promise<void> {
  const pdfBytes = await fetch('/forms/fw7.pdf').then(r => r.arrayBuffer())
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
  console.group('W-7 AcroForm Fields')
  form.getFields().forEach(f =>
    console.log(`"${f.getName()}" [${f.constructor.name}]`)
  )
  console.groupEnd()
  console.log(`Total: ${form.getFields().length} fields`)
}

// ── Utilities ─────────────────────────────────────────────────
function formatDateMMDDYYYY(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}
