/**
 * Convierte datos del PdfWizard (`Record<string, unknown>`) a los tipos de los mappers AcroForm.
 */
import type { I765FormData } from './i765-mapper'
import type { W7DocType, W7FormData } from './w7-mapper'
import type { I9Section1Data } from './i9-mapper'

function raw(data: Record<string, unknown>, key: string): string {
  const v = data[key]
  if (v == null) return ''
  return String(v).trim()
}

function parseStateZip(combined: string): { state: string; zip: string } {
  const t = combined.trim()
  const m = t.match(/^([A-Za-z]{2})\s+(.+)$/)
  if (m) return { state: m[1].toUpperCase(), zip: m[2].trim() }
  const parts = t.split(/\s+/).filter(Boolean)
  if (parts.length >= 2 && /^[A-Za-z]{2}$/.test(parts[0]))
    return { state: parts[0].toUpperCase(), zip: parts.slice(1).join(' ') }
  return { state: '', zip: t }
}

/** I-765 — campos del wizard alineados con `pdf-form-steps` (i765). */
export function toI765FormData(data: Record<string, unknown>): I765FormData {
  const app = raw(data, 'appType').toLowerCase()
  let appType: I765FormData['appType'] = 'renewal'
  if (app === 'initial') appType = 'initial'
  else if (app === 'replacement') appType = 'replacement'

  return {
    appType,
    familyName: raw(data, 'lastName'),
    givenName: raw(data, 'firstName'),
    middleName: raw(data, 'middleName') || undefined,
    streetNum: raw(data, 'streetAddr'),
    city: raw(data, 'city'),
    state: raw(data, 'state'),
    zip: raw(data, 'zip'),
    dob: raw(data, 'dob'),
    countryBirth: raw(data, 'countryBirth'),
    citizenship: raw(data, 'countryCitizenship') || raw(data, 'countryBirth'),
    aNumber: raw(data, 'aNumber') || undefined,
    ssn: raw(data, 'ssn') || undefined,
    eligibilityCategory: raw(data, 'eadCategory'),
    i94: raw(data, 'i94') || undefined,
    passportNum: raw(data, 'passportNum') || undefined,
    passportExp: raw(data, 'passportExp') || undefined,
    prevEADNumber: raw(data, 'priorEAD') || undefined,
    prevEADExp: raw(data, 'priorEADExp') || undefined,
    annualWages: raw(data, 'annualWages') || undefined,
    agi: raw(data, 'agi') || undefined,
  }
}

function inferW7Reason(text: string): { reason: W7FormData['reason']; reasonHText?: string } {
  const t = text.toLowerCase()
  if (/\bdependiente\b|\bdependent\b/.test(t)) return { reason: 'd' }
  if (/\bespos|spouse\b/.test(t)) return { reason: 'e' }
  if (/\bestudiant|student|professor|researcher\b/.test(t)) return { reason: 'f' }
  if (/\btreaty\b|tax treaty|tratado/.test(t)) return { reason: 'a' }
  if (/\bdeclaración\b|\btax return\b|\b1040\b/.test(t)) return { reason: 'b' }
  return { reason: 'h', reasonHText: text || 'Razón según instrucciones IRS Form W-7' }
}

function inferDocType(label: string): W7DocType {
  const s = label.toLowerCase()
  if (s.includes('driver') || s.includes('licen')) return 'driverLic'
  if (s.includes('pasaport')) return 'passport'
  if (s.includes('nacimiento') || s.includes('birth')) return 'birthCert'
  if (s.includes('militar')) return 'foreignMilID'
  if (s.includes('escuela') || s.includes('school')) return 'schoolRecords'
  if (s.includes('médic') || s.includes('medical')) return 'medRecords'
  if (s.includes('voter')) return 'voterReg'
  return 'passport'
}

/** W-7 — el wizard usa texto libre `w7Reason`; el PDF oficial usa casillas a–h. */
export function toW7FormData(data: Record<string, unknown>): W7FormData {
  const w7Reason = raw(data, 'w7Reason')
  const { reason, reasonHText } = inferW7Reason(w7Reason)

  const foreignAddr = raw(data, 'foreignAddress')

  return {
    reason,
    reasonHText: reason === 'h' ? reasonHText : undefined,
    firstName: raw(data, 'firstName'),
    middleName: raw(data, 'middleName') || undefined,
    lastName: raw(data, 'lastName'),
    priorFirstName: raw(data, 'nameAtBirth') || undefined,
    streetAddr: raw(data, 'streetAddr'),
    city: raw(data, 'city'),
    state: raw(data, 'state') || undefined,
    zip: raw(data, 'zip') || undefined,
    country: raw(data, 'mailCountry') || undefined,
    foreignStreet: foreignAddr || undefined,
    dob: raw(data, 'dob'),
    citizenship: raw(data, 'countryCitizenship'),
    foreignTaxID: raw(data, 'foreignTaxId') || undefined,
    passportNum: raw(data, 'passportNum') || undefined,
    passportCountry: raw(data, 'passportCountry') || undefined,
    visaType: raw(data, 'visaInfo') || undefined,
    docType: inferDocType(raw(data, 'idDocType')),
    docNumber: raw(data, 'idDocNumber') || undefined,
    docCountry: raw(data, 'idDocCountry') || undefined,
    hadPrevITIN: raw(data, 'hadPrevITIN') === 'yes',
    prevITIN: raw(data, 'prevITIN') || undefined,
    prevName: raw(data, 'prevITINName') || undefined,
    phone: raw(data, 'phone') || undefined,
  }
}

/** I-9 Sección 1 — `stateZip` del wizard se parte en estado + ZIP. */
export function toI9Section1Data(data: Record<string, unknown>): I9Section1Data {
  const mid = raw(data, 'middleName')
  const ws = raw(data, 'workStatus') as I9Section1Data['citizenStatus']
  const citizenStatus =
    ws === 'citizen' || ws === 'national' || ws === 'pr' || ws === 'alien' ? ws : 'citizen'

  const { state, zip } = parseStateZip(raw(data, 'stateZip'))

  return {
    lastName: raw(data, 'lastName'),
    firstName: raw(data, 'firstName'),
    middleInitial: mid ? mid.slice(0, 1) : undefined,
    otherLastName: raw(data, 'otherLastName') || undefined,
    streetAddr: raw(data, 'streetAddr'),
    city: raw(data, 'city'),
    state: state || raw(data, 'state'),
    zip: zip || raw(data, 'zip'),
    dob: raw(data, 'dob'),
    ssn: raw(data, 'ssn') || undefined,
    email: raw(data, 'email') || undefined,
    phone: raw(data, 'phone') || undefined,
    citizenStatus,
    alienRegNum:
      citizenStatus === 'pr'
        ? raw(data, 'aNumber')
        : citizenStatus === 'alien'
          ? raw(data, 'uscisNum') || raw(data, 'aNumber')
          : undefined,
    authExpDate: raw(data, 'authExpiry') || undefined,
    i94Num: raw(data, 'i94') || undefined,
    foreignPassNum: raw(data, 'foreignPassport') || undefined,
    foreignPassCountry: raw(data, 'foreignPassCountry') || undefined,
  }
}
