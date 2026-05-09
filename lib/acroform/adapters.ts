/**
 * Convierte datos del PdfWizard (`Record<string, unknown>`) a los tipos de los mappers AcroForm.
 */
import type { I765FormData } from './i765-mapper'
import type { W7DocType, W7FormData } from './w7-mapper'
import type { I9Section1Data } from './i9-mapper'
import type { W4FormData } from './w4-mapper'
import type { I821dFormData } from './i821d-mapper'
import type { H1010FormData } from './h1010-mapper'
import type { Saws1FormData } from './saws1-mapper'
import type { CfEs2337FormData } from './cfes2337-mapper'
import type { CaWic100Data } from './cawic100-mapper'

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

function splitAddressBlock(full: string): { line1: string; cityStateZip: string } {
  const t = full.trim()
  if (!t) return { line1: '', cityStateZip: '' }
  const lines = t.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (lines.length >= 2) return { line1: lines[0], cityStateZip: lines.slice(1).join(', ') }
  const comma = t.lastIndexOf(',')
  if (comma > 0 && comma < t.length - 1)
    return { line1: t.slice(0, comma).trim(), cityStateZip: t.slice(comma + 1).trim() }
  return { line1: t, cityStateZip: '' }
}

/** W-4 — coincide con `pdf-form-steps` (w4). */
export function toW4FormData(data: Record<string, unknown>): W4FormData {
  const fs = raw(data, 'filingStatus')
  const filingStatus: W4FormData['filingStatus'] =
    fs === 'married' ? 'married' : fs === 'hoh' ? 'hoh' : 'single'

  const addr = raw(data, 'address')
  const { line1, cityStateZip } = splitAddressBlock(addr)

  return {
    firstName: raw(data, 'firstName'),
    lastName: raw(data, 'lastName'),
    address: line1 || addr,
    cityStateZip,
    ssn: raw(data, 'ssn'),
    filingStatus,
    childrenUnder17: raw(data, 'childrenUnder17'),
    otherDependents: raw(data, 'otherDependents'),
    otherIncome: raw(data, 'otherIncome'),
    deductions: raw(data, 'deductions'),
    extraWithholding: raw(data, 'extraWithholding'),
    exempt: raw(data, 'exempt') === 'yes',
  }
}

/** I-821D — `dacaRequestType`: `initial` | `renewal` (paso 0 del wizard). */
export function toI821dFormData(data: Record<string, unknown>): I821dFormData {
  const rt = raw(data, 'dacaRequestType').toLowerCase()
  const requestType: I821dFormData['requestType'] = rt === 'initial' ? 'initial' : 'renewal'
  return {
    familyName: raw(data, 'lastName'),
    givenName: raw(data, 'firstName'),
    middleName: raw(data, 'middleName') || undefined,
    dob: raw(data, 'dob'),
    countryBirth: raw(data, 'countryBirth'),
    countryCitizenship: raw(data, 'countryCitizenship') || undefined,
    ssn: raw(data, 'ssn') || undefined,
    aNumber: raw(data, 'aNumber') || undefined,
    uscisAccount: raw(data, 'uscisAccount') || undefined,
    lastArrival: raw(data, 'lastArrival'),
    i94: raw(data, 'i94') || undefined,
    passportNumber: raw(data, 'passportNumber') || undefined,
    passportCountry: raw(data, 'passportCountry') || undefined,
    passportExpiry: raw(data, 'passportExpiry') || undefined,
    streetAddr: raw(data, 'streetAddr'),
    city: raw(data, 'city'),
    state: 'TX',
    zip: raw(data, 'zip'),
    phone: raw(data, 'phone') || undefined,
    email: raw(data, 'email') || undefined,
    firstEntry: raw(data, 'firstEntry'),
    inSchool: raw(data, 'inSchool') === 'yes',
    graduated: raw(data, 'graduated') === 'yes',
    employed: raw(data, 'employed') === 'yes',
    requestType,
  }
}

/** SAWS-1 California — CalFresh / Medi-Cal / CalWORKs. */
export function toSaws1FormData(data: Record<string, unknown>): Saws1FormData {
  return {
    fullName: `${raw(data, 'lastName')}, ${raw(data, 'firstName')}${raw(data, 'middleName') ? ' ' + raw(data, 'middleName').slice(0, 1) + '.' : ''}`,
    otherName: raw(data, 'otherName') || undefined,
    ssn: raw(data, 'ssn') || undefined,
    streetAddress: raw(data, 'streetAddr'),
    unit: raw(data, 'unit') || undefined,
    city: raw(data, 'city'),
    county: raw(data, 'county'),
    state: 'CA',
    zip: raw(data, 'zip'),
    sameMailAddress: raw(data, 'sameMailAddress') !== 'no',
    phone: raw(data, 'phone'),
    altPhone: raw(data, 'altPhone') || undefined,
    email: raw(data, 'email') || undefined,
    wantEmailNotifications: raw(data, 'wantEmailNotifications') === 'yes',
    wantCalFresh: !!data.wantCalFresh || raw(data, 'program') === 'calfresh',
    wantMediCal: !!data.wantMediCal || raw(data, 'program') === 'medicaid',
    wantCalWORKs: !!data.wantCalWORKs,
    hasDisability: raw(data, 'hasDisability') === 'yes' ? true : raw(data, 'hasDisability') === 'no' ? false : undefined,
    isHomeless: raw(data, 'isHomeless') === 'yes' ? true : raw(data, 'isHomeless') === 'no' ? false : undefined,
    isPregnant: raw(data, 'isPregnant') === 'yes' ? true : raw(data, 'isPregnant') === 'no' ? false : undefined,
    requestExpedited: raw(data, 'emergency') === 'yes',
    emergLess100: raw(data, 'emergLess100') === 'yes',
    emergLowIncome: raw(data, 'emergLowIncome') === 'yes',
    emergUnemployed: raw(data, 'emergUnemployed') === 'yes',
    emergMigrant: raw(data, 'emergMigrant') === 'yes',
    emergEviction: raw(data, 'emergEviction') === 'yes',
    emergOther: raw(data, 'emergOther') === 'yes',
    emergOtherText: raw(data, 'emergOtherText') || undefined,
    isHispanic: raw(data, 'isHispanic') === 'yes' ? true : raw(data, 'isHispanic') === 'no' ? false : undefined,
    race: (raw(data, 'race') as Saws1FormData['race']) || undefined,
  }
}

/** CF-ES 2337 Florida — SNAP / Medicaid / TCA. */
export function toCfEs2337FormData(data: Record<string, unknown>): CfEs2337FormData {
  const hhSize = parseInt(raw(data, 'householdSize') || '1', 10)
  return {
    firstName: raw(data, 'firstName'),
    lastName: raw(data, 'lastName'),
    middleInitial: raw(data, 'middleName') ? raw(data, 'middleName').slice(0, 1) : undefined,
    ssn: raw(data, 'ssn') || undefined,
    dob: raw(data, 'dob'),
    gender: (raw(data, 'gender') as 'M' | 'F') || undefined,
    streetAddress: raw(data, 'streetAddr'),
    apt: raw(data, 'unit') || undefined,
    city: raw(data, 'city'),
    county: raw(data, 'county'),
    zip: raw(data, 'zip'),
    phone: raw(data, 'phone'),
    altPhone: raw(data, 'altPhone') || undefined,
    email: raw(data, 'email') || undefined,
    wantFoodAssistance: !!data.wantSNAP || raw(data, 'program') === 'snap',
    wantMedicaid: !!data.wantMedicaid || raw(data, 'program') === 'medicaid',
    wantTCA: !!data.wantTCA,
    isUSCitizen: raw(data, 'isUSCitizen') === 'yes' ? true : raw(data, 'isUSCitizen') === 'no' ? false : undefined,
    immigrationStatus: raw(data, 'immigrationStatus') || undefined,
    householdSize: isNaN(hhSize) ? 1 : hhSize,
    hasEmployment: raw(data, 'hasEmployment') === 'yes',
    employerName: raw(data, 'employerName') || undefined,
    monthlyWages: raw(data, 'employmentIncome') || undefined,
    hasSelfEmployment: raw(data, 'hasSelfEmployment') === 'yes',
    selfEmploymentIncome: raw(data, 'selfEmploymentIncome') || undefined,
    hasOtherIncome: raw(data, 'hasOtherIncome') === 'yes',
    otherIncomeType: raw(data, 'otherIncomeType') || undefined,
    otherIncomeAmount: raw(data, 'otherIncome') || undefined,
    hasBankAccount: raw(data, 'hasBankAccount') === 'yes',
    bankBalance: raw(data, 'bankBalance') || undefined,
    hasVehicle: raw(data, 'hasVehicle') === 'yes',
    vehicleValue: raw(data, 'vehicleValue') || undefined,
    rentAmount: raw(data, 'rent') || undefined,
    mortgageAmount: raw(data, 'mortgage') || undefined,
  }
}

/** CA-WIC 100 — California WIC Application. */
export function toCaWic100FormData(data: Record<string, unknown>): CaWic100Data {
  const appType = raw(data, 'applicantType') as CaWic100Data['applicantType']
  const incomeSource = raw(data, 'incomeSource') || 'none'
  return {
    applicantType: appType || '',
    dueDate: raw(data, 'dueDate') || undefined,
    childDob: raw(data, 'childDob') || undefined,
    participantLastName: raw(data, 'lastName'),
    participantFirstName: raw(data, 'firstName'),
    participantMiddleName: raw(data, 'middleName') || undefined,
    participantDob: raw(data, 'dob'),
    participantGender: (raw(data, 'gender') as CaWic100Data['participantGender']) || '',
    guardianLastName: raw(data, 'guardianLastName') || undefined,
    guardianFirstName: raw(data, 'guardianFirstName') || undefined,
    guardianRelationship: raw(data, 'guardianRelationship') || undefined,
    streetAddr: raw(data, 'streetAddr'),
    unit: raw(data, 'unit') || undefined,
    city: raw(data, 'city'),
    county: raw(data, 'county'),
    state: 'CA',
    zip: raw(data, 'zip'),
    phone: raw(data, 'phone'),
    altPhone: raw(data, 'altPhone') || undefined,
    email: raw(data, 'email') || undefined,
    householdSize: raw(data, 'householdSize') || '1',
    monthlyIncome: raw(data, 'monthlyIncome') || '0',
    incomeSource,
    isUSCitizen: (raw(data, 'isUSCitizen') as CaWic100Data['isUSCitizen']) || '',
    immigrationStatus: raw(data, 'immigrationStatus') || undefined,
    onMediCal: !!data.onMediCal || raw(data, 'onMediCal') === 'yes',
    onCalFresh: !!data.onCalFresh || raw(data, 'onCalFresh') === 'yes',
    onCalWORKs: !!data.onCalWORKs || raw(data, 'onCalWORKs') === 'yes',
    isBreastfeeding: raw(data, 'isBreastfeeding') === 'yes' ? true : undefined,
    infantAge: raw(data, 'infantAge') || undefined,
    hasSpecialNeeds: raw(data, 'hasSpecialNeeds') === 'yes' ? true : undefined,
    specialNeedsDesc: raw(data, 'specialNeedsDesc') || undefined,
    preferredLanguage: raw(data, 'preferredLanguage') || 'Español',
    signatureDate: raw(data, 'signatureDate') || new Date().toLocaleDateString('en-US'),
  }
}

/** H1010 — coincide con `pdf-form-steps` (h1010). */
export function toH1010FormData(data: Record<string, unknown>): H1010FormData {
  return {
    wantSNAP: !!data.wantSNAP,
    wantMedicaid: !!data.wantMedicaid,
    wantCHIP: !!data.wantCHIP,
    wantTANF: !!data.wantTANF,
    emergency: raw(data, 'emergency') === 'yes',
    householdSize: raw(data, 'householdSize'),
    streetAddr: raw(data, 'streetAddr'),
    city: raw(data, 'city'),
    county: raw(data, 'county'),
    zip: raw(data, 'zip'),
    lastName: raw(data, 'lastName'),
    firstName: raw(data, 'firstName'),
    middleName: raw(data, 'middleName') || undefined,
    dob: raw(data, 'dob'),
    ssn: raw(data, 'ssn') || undefined,
    gender: raw(data, 'gender') || undefined,
    phone: raw(data, 'phone'),
    email: raw(data, 'email') || undefined,
    hasEmployment: raw(data, 'hasEmployment') === 'yes',
    employmentIncome: raw(data, 'employmentIncome'),
    rent: raw(data, 'rent'),
    utilities: raw(data, 'utilities'),
    medical: raw(data, 'medical'),
    childcare: raw(data, 'childcare'),
  }
}

/** LDSS-2921 — New York SNAP + Medicaid application */
export function toLdss2921FormData(data: Record<string, unknown>): import('./ldss2921-mapper').Ldss2921FormData {
  return {
    programs: {
      snap: raw(data, 'wantSNAP') === 'yes' || !!data.wantSNAP,
      medicaid: raw(data, 'wantMedicaid') === 'yes' || !!data.wantMedicaid,
      familyAssistance: raw(data, 'wantFA') === 'yes' || !!data.wantFA,
      safetyNet: raw(data, 'wantSNA') === 'yes' || !!data.wantSNA,
      childCare: raw(data, 'wantChildCare') === 'yes' || !!data.wantChildCare,
    },
    firstName: raw(data, 'firstName'),
    lastName: raw(data, 'lastName'),
    dateOfBirth: raw(data, 'dob'),
    ssn: raw(data, 'ssn') || undefined,
    gender: (raw(data, 'gender') as 'male' | 'female' | 'other') || undefined,
    phone: raw(data, 'phone'),
    email: raw(data, 'email') || undefined,
    streetAddress: raw(data, 'streetAddr'),
    apt: raw(data, 'unit') || undefined,
    city: raw(data, 'city'),
    state: 'NY',
    zip: raw(data, 'zip'),
    county: raw(data, 'county'),
    householdSize: parseInt(raw(data, 'householdSize') || '1', 10),
    monthlyIncome: parseFloat(raw(data, 'monthlyIncome') || '0'),
    incomeSource: raw(data, 'incomeSource') || undefined,
    citizenshipStatus: (raw(data, 'citizenshipStatus') as 'citizen' | 'permanent_resident' | 'daca' | 'tps' | 'other') || 'citizen',
    isPregnant: raw(data, 'isPregnant') === 'yes' || undefined,
    dueDateOrRecentBirth: raw(data, 'dueDate') || raw(data, 'recentBirthDate') || undefined,
    isHomeless: raw(data, 'isHomeless') === 'yes' || undefined,
    isDisabled: raw(data, 'isDisabled') === 'yes' || undefined,
    expeditedSnap: raw(data, 'expeditedSnap') === 'yes' || undefined,
    expeditedReason: raw(data, 'expeditedReason') || undefined,
    signatureDate: raw(data, 'signatureDate') || new Date().toLocaleDateString('en-US'),
    preferredDelivery: (raw(data, 'preferredDelivery') as 'in_person' | 'mail' | 'online') || 'online',
  }
}

/** NY WIC — New York WIC program application reference */
export function toNyWicFormData(data: Record<string, unknown>): import('./nywic-mapper').NyWicFormData {
  return {
    participantType: (raw(data, 'participantType') as 'pregnant' | 'postpartum' | 'breastfeeding' | 'infant' | 'child') || 'pregnant',
    firstName: raw(data, 'firstName'),
    lastName: raw(data, 'lastName'),
    dateOfBirth: raw(data, 'dob'),
    phone: raw(data, 'phone'),
    email: raw(data, 'email') || undefined,
    guardianName: raw(data, 'guardianName') || undefined,
    guardianRelationship: raw(data, 'guardianRelationship') || undefined,
    streetAddress: raw(data, 'streetAddr'),
    apt: raw(data, 'unit') || undefined,
    city: raw(data, 'city'),
    state: 'NY',
    zip: raw(data, 'zip'),
    county: raw(data, 'county'),
    householdSize: parseInt(raw(data, 'householdSize') || '1', 10),
    monthlyIncome: parseFloat(raw(data, 'monthlyIncome') || '0'),
    incomeSource: raw(data, 'incomeSource') || undefined,
    isPregnant: raw(data, 'isPregnant') === 'yes' || undefined,
    dueDate: raw(data, 'dueDate') || undefined,
    recentBirthDate: raw(data, 'recentBirthDate') || undefined,
    childName: raw(data, 'childName') || undefined,
    childDob: raw(data, 'childDob') || undefined,
    receivesMedicaid: raw(data, 'receivesMedicaid') === 'yes' || undefined,
    receivesSnap: raw(data, 'receivesSnap') === 'yes' || undefined,
    receivesTanf: raw(data, 'receivesTanf') === 'yes' || undefined,
    preferredLanguage: raw(data, 'preferredLanguage') || 'Español',
    signatureDate: raw(data, 'signatureDate') || new Date().toLocaleDateString('en-US'),
  }
}
