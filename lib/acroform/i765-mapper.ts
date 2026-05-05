// ─────────────────────────────────────────────────────────────
// lib/acroform/i765-mapper.ts
// HazloAsíYa — I-765 (Ed. 09/27/23) AcroField Mapper
// Employment Authorization Document (EAD)
//
// PDF oficial: /public/forms/i765.pdf
// Descarga:    https://www.uscis.gov/sites/default/files/document/forms/i-765.pdf
//
// Después de descargar, correr:
//   python inspect_fields.py public/forms/i765.pdf > i765_actual.json
//   python reconcile_fields.py i765_actual.json i765
// ─────────────────────────────────────────────────────────────

import { PDFDocument } from 'pdf-lib'

// ── I-765 Field Map ───────────────────────────────────────────
// El I-765 usa el patrón form1[0].Page1[0].FieldName[0]
// Nombres basados en la edición 09/27/23 — verificar con inspect_fields.py

const I765_FIELDS = {
  // ── Part 1 — Reason for Applying ─────────────────────────
  // Radio: Initial / Renewal / Replacement
  appType:      'form1[0].Page1[0].RequestType[0]',

  // ── Part 2 — Information About You ───────────────────────
  familyName:   'form1[0].Page1[0].FamilyName[0]',
  givenName:    'form1[0].Page1[0].GivenName[0]',
  middleName:   'form1[0].Page1[0].MiddleName[0]',

  // Other names used
  otherName1:   'form1[0].Page1[0].OtherFamilyName1[0]',

  // Address
  streetNum:    'form1[0].Page1[0].StreetNumberName[0]',
  apt:          'form1[0].Page1[0].AptSteFlrNumber[0]',
  city:         'form1[0].Page1[0].CityOrTown[0]',
  state:        'form1[0].Page1[0].State[0]',
  zip:          'form1[0].Page1[0].ZipCode[0]',
  country:      'form1[0].Page1[0].Country[0]',

  // DOB split fields
  dobMonth:     'form1[0].Page1[0].DOBMonth[0]',
  dobDay:       'form1[0].Page1[0].DOBDay[0]',
  dobYear:      'form1[0].Page1[0].DOBYear[0]',

  // Country of birth / citizenship
  countryBirth: 'form1[0].Page1[0].CountryOfBirth[0]',
  citizenship:  'form1[0].Page1[0].CountryOfCitizenship[0]',

  // Gender radio
  gender:       'form1[0].Page1[0].Gender[0]',

  // A-Number and SSN
  aNumber:      'form1[0].Page1[0].ANumber[0]',
  ssn:          'form1[0].Page1[0].SSN[0]',

  // ── Part 2 — Eligibility Category ────────────────────────
  // The category code goes in a text field, e.g. "(c)(33)"
  // Some versions use a dropdown; others use text
  eligibilityCategory: 'form1[0].Page1[0].EligibilityCategory[0]',

  // I-94 Arrival-Departure Number
  i94:          'form1[0].Page1[0].I94Number[0]',

  // Travel document / passport
  passportNum:  'form1[0].Page1[0].PassportNumber[0]',
  passportExp:  'form1[0].Page1[0].PassportExpDate[0]',
  travelDocNum: 'form1[0].Page1[0].TravelDocNumber[0]',

  // ── Part 3 — Previous EAD ─────────────────────────────────
  prevEADNumber: 'form1[0].Page2[0].PrevEADNumber[0]',
  prevEADExpMonth: 'form1[0].Page2[0].PrevEADExpMonth[0]',
  prevEADExpDay:   'form1[0].Page2[0].PrevEADExpDay[0]',
  prevEADExpYear:  'form1[0].Page2[0].PrevEADExpYear[0]',

  // ── I-765 Worksheet (income) ──────────────────────────────
  // Attachment to I-821D/I-765 for DACA
  // Line 1a: Wages/salary
  wsWages:      'form1[0].Page3[0].WagesLine1a[0]',
  // Line 2: Adjusted gross income
  wsAGI:        'form1[0].Page3[0].AGILine2[0]',

  // ── Part 4 — Signature ────────────────────────────────────
  signDate:     'form1[0].Page2[0].SignDate[0]',
} as const

// ── App type radio values ─────────────────────────────────────
const APP_TYPE_VALUES: Record<string, string> = {
  initial:     '1',
  renewal:     '2',
  replacement: '3',
}

// ── Gender radio values ───────────────────────────────────────
const GENDER_VALUES: Record<string, string> = {
  M: '1',
  F: '2',
}

// ── Common EAD categories ─────────────────────────────────────
export const EAD_CATEGORIES = {
  DACA:       '(c)(33)',  // Deferred Action for Childhood Arrivals
  PENDING_485:'(c)(09)',  // Pending adjustment of status (I-485)
  REFUGEE:    '(a)(03)',  // Refugee
  ASYLUM:     '(a)(05)',  // Asylee
  PENDING_ASYLUM: '(c)(08)', // Pending asylum
  TPS:        '(a)(12)',  // Temporary Protected Status
  PAROLEE:    '(c)(11)',  // Parolee
} as const

export interface I765FormData {
  // Part 1 — Reason
  appType: 'initial' | 'renewal' | 'replacement'

  // Part 2 — Personal info
  familyName:   string
  givenName:    string
  middleName?:  string
  otherName?:   string

  // Address
  streetNum:  string
  apt?:       string
  city:       string
  state:      string
  zip:        string

  // Identity
  dob:            string   // ISO YYYY-MM-DD
  countryBirth:   string
  citizenship:    string
  gender?:        'M' | 'F'
  aNumber?:       string
  ssn?:           string

  // Eligibility
  eligibilityCategory: string   // e.g. '(c)(33)'
  i94?:             string
  passportNum?:     string
  passportExp?:     string      // ISO date

  // Previous EAD (for renewal/replacement)
  prevEADNumber?:  string
  prevEADExp?:     string       // ISO date

  // I-765 Worksheet (DACA)
  annualWages?: string
  agi?:         string
}

// ── Main fill function ────────────────────────────────────────
export async function fillI765AcroForm(data: I765FormData): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/i765.pdf').then(r => r.arrayBuffer())
  const pdfDoc  = await PDFDocument.load(pdfBytes)
  const form    = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try { form.getTextField(id).setText(val) }
    catch { console.warn(`[I765] setText: ${id}`) }
  }

  const setRadio = (id: string, val: string) => {
    try { form.getRadioGroup(id).select(val) }
    catch {
      // Some versions use checkboxes per option
      try { form.getCheckBox(id).check() }
      catch { console.warn(`[I765] radio: ${id}`) }
    }
  }

  // ── Part 1 — App type ──────────────────────────────────────
  const appVal = APP_TYPE_VALUES[data.appType]
  if (appVal) setRadio(I765_FIELDS.appType, appVal)

  // ── Part 2 — Personal ─────────────────────────────────────
  setText(I765_FIELDS.familyName,   data.familyName)
  setText(I765_FIELDS.givenName,    data.givenName)
  setText(I765_FIELDS.middleName,   data.middleName ?? '')
  setText(I765_FIELDS.otherName1,   data.otherName  ?? '')

  // Address
  setText(I765_FIELDS.streetNum, data.streetNum)
  setText(I765_FIELDS.apt,       data.apt ?? '')
  setText(I765_FIELDS.city,      data.city)
  setText(I765_FIELDS.state,     data.state)
  setText(I765_FIELDS.zip,       data.zip)

  // DOB — split
  if (data.dob) {
    const [y, m, d] = data.dob.split('-')
    setText(I765_FIELDS.dobMonth, m)
    setText(I765_FIELDS.dobDay,   d)
    setText(I765_FIELDS.dobYear,  y)
  }

  setText(I765_FIELDS.countryBirth, data.countryBirth)
  setText(I765_FIELDS.citizenship,  data.citizenship)

  if (data.gender) setRadio(I765_FIELDS.gender, GENDER_VALUES[data.gender])

  setText(I765_FIELDS.aNumber, data.aNumber ? formatANumber(data.aNumber) : '')
  setText(I765_FIELDS.ssn,     data.ssn     ? formatSSN(data.ssn)         : '')

  // ── Eligibility category ───────────────────────────────────
  setText(I765_FIELDS.eligibilityCategory, data.eligibilityCategory)
  setText(I765_FIELDS.i94,        data.i94        ?? '')
  setText(I765_FIELDS.passportNum, data.passportNum ?? '')

  if (data.passportExp) {
    setText(I765_FIELDS.passportExp, formatDateMMDDYYYY(data.passportExp))
  }

  // ── Previous EAD ───────────────────────────────────────────
  if (data.prevEADNumber) {
    setText(I765_FIELDS.prevEADNumber, data.prevEADNumber)
  }
  if (data.prevEADExp) {
    const [y, m, d] = data.prevEADExp.split('-')
    setText(I765_FIELDS.prevEADExpMonth, m)
    setText(I765_FIELDS.prevEADExpDay,   d)
    setText(I765_FIELDS.prevEADExpYear,  y)
  }

  // ── I-765 Worksheet (DACA income) ─────────────────────────
  if (data.annualWages) setText(I765_FIELDS.wsWages, data.annualWages)
  if (data.agi)         setText(I765_FIELDS.wsAGI,   data.agi)

  return pdfDoc.save()
}

// ── Dev tool ──────────────────────────────────────────────────
export async function debugI765Fields(): Promise<void> {
  const pdfBytes = await fetch('/forms/i765.pdf').then(r => r.arrayBuffer())
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
  console.group('I-765 AcroForm Fields')
  form.getFields().forEach(f => console.log(`"${f.getName()}" [${f.constructor.name}]`))
  console.groupEnd()
}

// ── Utilities ─────────────────────────────────────────────────
function formatSSN(ssn: string): string {
  const d = ssn.replace(/\D/g, '')
  return d.length === 9 ? `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}` : ssn
}

function formatANumber(a: string): string {
  const d = a.replace(/\D/g, '')
  return d.startsWith('A') ? a : `A${d}`
}

function formatDateMMDDYYYY(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}
