// ─────────────────────────────────────────────────────────────
// lib/acroform/i9-mapper.ts
// HazloAsíYa — I-9 (Ed. 08/01/23) AcroField Mapper
// Employment Eligibility Verification — Section 1 (Employee)
//
// PDF oficial: /public/forms/i-9.pdf
// Descarga:    https://www.uscis.gov/sites/default/files/document/forms/i-9-paper-version.pdf
//
// IMPORTANTE: El I-9 oficial tiene dos versiones:
//   - Versión "fillable" PDF: AcroForm con campos editables (la que usamos)
//   - Versión "paper": imagen escaneada sin campos
// Asegúrate de descargar la versión "fillable" del link arriba.
//
// Después de descargar:
//   python inspect_fields.py public/forms/i-9.pdf > i9_actual.json
//   python reconcile_fields.py i9_actual.json i9
// ─────────────────────────────────────────────────────────────

import { PDFDocument } from 'pdf-lib'

// ── I-9 Field Map (Ed. 08/01/23) ─────────────────────────────
// USCIS nombra los campos del I-9 con el patrón:
// form1[0].#subform[0].Section1[0].FieldName[0]
// Verificar contra la versión exacta descargada.

const I9_FIELDS = {
  // ── Section 1 — Employee Information ─────────────────────

  // Name
  lastName:      'form1[0].#subform[0].Section1[0].LastName[0]',
  firstName:     'form1[0].#subform[0].Section1[0].FirstName[0]',
  middleInitial: 'form1[0].#subform[0].Section1[0].MiddleInitial[0]',
  otherLastName: 'form1[0].#subform[0].Section1[0].OtherLastNamesUsed[0]',

  // Address
  streetAddr:    'form1[0].#subform[0].Section1[0].Address[0]',
  aptNum:        'form1[0].#subform[0].Section1[0].AptNumber[0]',
  city:          'form1[0].#subform[0].Section1[0].CityOrTown[0]',
  state:         'form1[0].#subform[0].Section1[0].State[0]',
  zip:           'form1[0].#subform[0].Section1[0].ZipCode[0]',

  // DOB and SSN
  dobMonth:      'form1[0].#subform[0].Section1[0].DOBMonth[0]',
  dobDay:        'form1[0].#subform[0].Section1[0].DOBDay[0]',
  dobYear:       'form1[0].#subform[0].Section1[0].DOBYear[0]',
  ssn1:          'form1[0].#subform[0].Section1[0].SSN1[0]',   // XXX
  ssn2:          'form1[0].#subform[0].Section1[0].SSN2[0]',   // XX
  ssn3:          'form1[0].#subform[0].Section1[0].SSN3[0]',   // XXXX

  // Contact
  email:         'form1[0].#subform[0].Section1[0].Email[0]',
  phone:         'form1[0].#subform[0].Section1[0].Phone[0]',

  // ── Section 1 Attestation — Status checkboxes ─────────────
  // Radio group — select ONE
  // Values per version: '1'=citizen, '2'=national, '3'=LPR, '4'=alien
  citizenStatus: 'form1[0].#subform[0].Section1[0].CitizenshipStatus[0]',

  // If Lawful Permanent Resident (status = 3)
  alienRegNum:   'form1[0].#subform[0].Section1[0].AlienRegNum[0]',   // A-Number

  // If Alien Authorized to Work (status = 4)
  // One of these three must be provided:
  authExpDate:   'form1[0].#subform[0].Section1[0].AuthExpDate[0]',   // mm/dd/yyyy or N/A
  i94Num:        'form1[0].#subform[0].Section1[0].I94AdmissionNum[0]',
  foreignPassNum:'form1[0].#subform[0].Section1[0].ForeignPassportNum[0]',
  foreignPassCountry: 'form1[0].#subform[0].Section1[0].CountryOfIssuance[0]',

  // ── Preparer/Translator section (if used) ─────────────────
  // Leave blank if employee completed their own Section 1
  prepNotUsed:   'form1[0].#subform[0].Section1[0].PrepNotUsed[0]',   // checkbox
  prepLastName:  'form1[0].#subform[0].Section1[0].PrepLastName[0]',
  prepFirstName: 'form1[0].#subform[0].Section1[0].PrepFirstName[0]',
  prepAddress:   'form1[0].#subform[0].Section1[0].PrepAddress[0]',
  prepCity:      'form1[0].#subform[0].Section1[0].PrepCity[0]',
  prepState:     'form1[0].#subform[0].Section1[0].PrepState[0]',
  prepZip:       'form1[0].#subform[0].Section1[0].PrepZip[0]',

  // ── Sign date (employee fills day they sign) ──────────────
  signDate:      'form1[0].#subform[0].Section1[0].SignDate[0]',
} as const

// ── Citizenship status radio values ───────────────────────────
const STATUS_VALUES: Record<string, string> = {
  citizen:  '1',   // A citizen of the United States
  national: '2',   // A noncitizen national of the United States
  pr:       '3',   // A lawful permanent resident
  alien:    '4',   // An alien authorized to work
}

export interface I9Section1Data {
  // Personal info
  lastName:      string
  firstName:     string
  middleInitial?: string
  otherLastName?: string

  // Address
  streetAddr:  string
  aptNum?:     string
  city:        string
  state:       string
  zip:         string

  // Identity
  dob:   string   // ISO YYYY-MM-DD
  ssn?:  string   // XXX-XX-XXXX (optional — employee may decline)
  email?: string
  phone?: string

  // Citizenship attestation
  citizenStatus: 'citizen' | 'national' | 'pr' | 'alien'

  // If LPR
  alienRegNum?: string   // A-Number e.g. A000000000

  // If alien authorized to work
  authExpDate?:         string   // ISO date or 'N/A'
  i94Num?:              string
  foreignPassNum?:      string
  foreignPassCountry?:  string

  // Preparer (if someone helped fill Section 1)
  preparer?: {
    lastName:  string
    firstName: string
    address:   string
    city:      string
    state:     string
    zip:       string
  }
}

// ── Main fill function ────────────────────────────────────────
export async function fillI9AcroForm(data: I9Section1Data): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/i-9.pdf').then(r => r.arrayBuffer())
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try { form.getTextField(id).setText(val) }
    catch { console.warn(`[I9] setText: ${id}`) }
  }

  const setCheck = (id: string, checked: boolean) => {
    try {
      const cb = form.getCheckBox(id)
      if (checked) cb.check(); else cb.uncheck()
    } catch { console.warn(`[I9] checkbox: ${id}`) }
  }

  const setRadio = (id: string, val: string) => {
    try { form.getRadioGroup(id).select(val) }
    catch {
      // Fallback: algunos I-9 usan checkboxes individuales
      // c1_1[0]=citizen, c1_2[0]=national, c1_3[0]=LPR, c1_4[0]=alien
      const idxMap: Record<string,number> = { citizen:1, national:2, pr:3, alien:4 }
      const status = Object.keys(STATUS_VALUES).find(k => STATUS_VALUES[k] === val)
      if (status) {
        const idx = idxMap[status]
        try { form.getCheckBox(`c1_${idx}[0]`).check() } catch { /**/ }
      }
      console.warn(`[I9] radio fallback: ${id}`)
    }
  }

  // ── Name ───────────────────────────────────────────────────
  setText(I9_FIELDS.lastName,      data.lastName)
  setText(I9_FIELDS.firstName,     data.firstName)
  setText(I9_FIELDS.middleInitial, data.middleInitial ?? '')
  setText(I9_FIELDS.otherLastName, data.otherLastName ?? 'N/A')

  // ── Address ────────────────────────────────────────────────
  setText(I9_FIELDS.streetAddr, data.streetAddr)
  setText(I9_FIELDS.aptNum,     data.aptNum ?? '')
  setText(I9_FIELDS.city,       data.city)
  setText(I9_FIELDS.state,      data.state)
  setText(I9_FIELDS.zip,        data.zip)

  // ── DOB — split ────────────────────────────────────────────
  if (data.dob) {
    const [y, m, d] = data.dob.split('-')
    setText(I9_FIELDS.dobMonth, m)
    setText(I9_FIELDS.dobDay,   d)
    setText(I9_FIELDS.dobYear,  y)
  }

  // ── SSN — split into 3 fields ──────────────────────────────
  if (data.ssn) {
    const digits = data.ssn.replace(/\D/g, '')
    if (digits.length === 9) {
      setText(I9_FIELDS.ssn1, digits.slice(0, 3))
      setText(I9_FIELDS.ssn2, digits.slice(3, 5))
      setText(I9_FIELDS.ssn3, digits.slice(5, 9))
    } else {
      // Some versions have a single SSN field
      try { form.getTextField('form1[0].#subform[0].Section1[0].SSN[0]').setText(data.ssn) } catch { /**/ }
    }
  }

  setText(I9_FIELDS.email, data.email ?? '')
  setText(I9_FIELDS.phone, data.phone ?? '')

  // ── Citizenship status ─────────────────────────────────────
  const statusVal = STATUS_VALUES[data.citizenStatus]
  if (statusVal) setRadio(I9_FIELDS.citizenStatus, statusVal)

  // ── LPR fields ─────────────────────────────────────────────
  if (data.citizenStatus === 'pr' && data.alienRegNum) {
    setText(I9_FIELDS.alienRegNum, formatANumber(data.alienRegNum))
  }

  // ── Alien authorized to work fields ───────────────────────
  if (data.citizenStatus === 'alien') {
    // Expiration date
    const expDisplay = data.authExpDate === 'N/A' || !data.authExpDate
      ? 'N/A - Does Not Expire'
      : formatDateMMDDYYYY(data.authExpDate)
    setText(I9_FIELDS.authExpDate, expDisplay)

    // ONE of: I-94, USCIS#/A-Number, or Foreign Passport+Country
    if (data.i94Num) {
      setText(I9_FIELDS.i94Num, data.i94Num)
    } else if (data.alienRegNum) {
      setText(I9_FIELDS.alienRegNum, formatANumber(data.alienRegNum))
    }
    if (data.foreignPassNum) {
      setText(I9_FIELDS.foreignPassNum,     data.foreignPassNum)
      setText(I9_FIELDS.foreignPassCountry, data.foreignPassCountry ?? '')
    }
  }

  // ── Preparer section ───────────────────────────────────────
  if (!data.preparer) {
    // Employee completed own Section 1 — check the "not used" box
    setCheck(I9_FIELDS.prepNotUsed, true)
  } else {
    const p = data.preparer
    setText(I9_FIELDS.prepLastName,  p.lastName)
    setText(I9_FIELDS.prepFirstName, p.firstName)
    setText(I9_FIELDS.prepAddress,   p.address)
    setText(I9_FIELDS.prepCity,      p.city)
    setText(I9_FIELDS.prepState,     p.state)
    setText(I9_FIELDS.prepZip,       p.zip)
  }

  return pdfDoc.save()
}

// ── Dev tool ──────────────────────────────────────────────────
export async function debugI9Fields(): Promise<void> {
  const pdfBytes = await fetch('/forms/i-9.pdf').then(r => r.arrayBuffer())
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
  console.group('I-9 AcroForm Fields (Section 1)')
  form.getFields().forEach(f =>
    console.log(`"${f.getName()}" [${f.constructor.name}]`)
  )
  console.groupEnd()
  console.log(`Total: ${form.getFields().length} fields`)
}

// ── Utilities ─────────────────────────────────────────────────
function formatANumber(a: string): string {
  const digits = a.replace(/\D/g, '')
  return `A${digits.padStart(9, '0')}`
}

function formatDateMMDDYYYY(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}
