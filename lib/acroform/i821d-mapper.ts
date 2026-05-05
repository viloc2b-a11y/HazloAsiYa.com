/**
 * I-821D DACA (USCIS fillable).
 * PDF: /public/forms/i821d.pdf — https://www.uscis.gov/sites/default/files/document/forms/i-821d.pdf
 *
 * Si el PDF deja de ser AcroForm editable, `pdf-lib` fallará y el despacho usará el PDF visual.
 */
import { PDFDocument } from 'pdf-lib'

const F = {
  familyName: 'form1[0].Page1[0].FamilyName[0]',
  givenName: 'form1[0].Page1[0].GivenName[0]',
  middleName: 'form1[0].Page1[0].MiddleName[0]',
  aNumber: 'form1[0].Page1[0].ANumber[0]',
  dobMonth: 'form1[0].Page1[0].DOBMonth[0]',
  dobDay: 'form1[0].Page1[0].DOBDay[0]',
  dobYear: 'form1[0].Page1[0].DOBYear[0]',
  countryBirth: 'form1[0].Page1[0].CountryOfBirth[0]',
  ssn: 'form1[0].Page1[0].SSN[0]',
  street: 'form1[0].Page1[0].StreetNumberName[0]',
  city: 'form1[0].Page1[0].CityOrTown[0]',
  state: 'form1[0].Page1[0].State[0]',
  zip: 'form1[0].Page1[0].ZipCode[0]',
  phone: 'form1[0].Page1[0].DaytimeTelephone[0]',
  email: 'form1[0].Page1[0].EmailAddress[0]',
  entryMonth: 'form1[0].Page2[0].EntryMonth[0]',
  entryDay: 'form1[0].Page2[0].EntryDay[0]',
  entryYear: 'form1[0].Page2[0].EntryYear[0]',
  schoolName: 'form1[0].Page3[0].SchoolName[0]',
  schoolCity: 'form1[0].Page3[0].SchoolCity[0]',
  schoolState: 'form1[0].Page3[0].SchoolState[0]',
  requestType: 'form1[0].Page1[0].RequestType[0]',
  eduStatus: 'form1[0].Page3[0].EduStatus[0]',
  contResYes: 'form1[0].Page2[0].ContRes[1]',
  contResNo: 'form1[0].Page2[0].ContRes[2]',
} as const

export interface I821dFormData {
  familyName: string
  givenName: string
  middleName?: string
  /** ISO YYYY-MM-DD o mm/dd/yyyy */
  dob: string
  countryBirth: string
  countryCitizenship?: string
  ssn?: string
  aNumber?: string
  uscisAccount?: string
  lastArrival: string
  i94?: string
  passportNumber?: string
  passportCountry?: string
  passportExpiry?: string
  streetAddr: string
  city: string
  state: string
  zip: string
  phone?: string
  email?: string
  firstEntry: string
  inSchool: boolean
  graduated: boolean
  employed: boolean
  /** Solicitud inicial vs renovación — por defecto renovación DACA */
  requestType: 'initial' | 'renewal'
}

export async function fillI821DAcroForm(data: I821dFormData): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/i821d.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try {
      form.getTextField(id).setText(val)
    } catch {
      console.warn(`[I821D] setText: ${id}`)
    }
  }

  const setRadio = (id: string, val: string) => {
    try {
      form.getRadioGroup(id).select(val)
    } catch {
      console.warn(`[I821D] radio ${id}=${val}`)
    }
  }

  const setCheck = (id: string, on: boolean) => {
    try {
      const cb = form.getCheckBox(id)
      if (on) cb.check()
      else cb.uncheck()
    } catch {
      console.warn(`[I821D] checkbox ${id}`)
    }
  }

  setText(F.familyName, data.familyName)
  setText(F.givenName, data.givenName)
  setText(F.middleName, data.middleName ?? '')
  setText(F.aNumber, data.aNumber ? formatANumber(data.aNumber) : '')
  setText(F.countryBirth, data.countryBirth)
  setText(F.ssn, data.ssn ? formatSSN(data.ssn) : '')
  setText(F.street, data.streetAddr)
  setText(F.city, data.city)
  setText(F.state, data.state || 'TX')
  setText(F.zip, data.zip)
  setText(F.phone, data.phone ?? '')
  setText(F.email, data.email ?? '')

  const dobParts = splitDateToMDY(data.dob)
  if (dobParts) {
    setText(F.dobMonth, dobParts.m)
    setText(F.dobDay, dobParts.d)
    setText(F.dobYear, dobParts.y)
  }

  const arrParts = splitDateToMDY(data.lastArrival)
  if (arrParts) {
    setText(F.entryMonth, arrParts.m)
    setText(F.entryDay, arrParts.d)
    setText(F.entryYear, arrParts.y)
  }

  // Renovación típica DACA
  const reqVal = data.requestType === 'initial' ? '1' : '2'
  setRadio(F.requestType, reqVal)

  // Residencia continua desde 15/06/2007 — marcar Sí si el usuario siguió el flujo DACA
  setCheck(F.contResYes, true)
  setCheck(F.contResNo, false)

  // Educación / empleo (valores aproximados; verificar con inspect_fields)
  if (data.graduated) setRadio(F.eduStatus, '2')
  else if (data.inSchool) setRadio(F.eduStatus, '1')
  else if (data.employed) setRadio(F.eduStatus, '3')

  setText(F.schoolName, '')
  setText(F.schoolCity, '')
  setText(F.schoolState, '')

  return pdfDoc.save()
}

export async function debugI821dFields(): Promise<void> {
  const pdfBytes = await fetch('/forms/i821d.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()
  console.group('I-821D AcroForm Fields')
  form.getFields().forEach(f => console.log(`"${f.getName()}" [${f.constructor.name}]`))
  console.groupEnd()
}

function formatSSN(s: string): string {
  const d = s.replace(/\D/g, '')
  return d.length === 9 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : s
}

function formatANumber(a: string): string {
  const d = a.replace(/\D/g, '')
  if (!d) return ''
  return d.length <= 9 ? `A${d.padStart(9, '0')}` : a
}

function splitDateToMDY(raw: string): { m: string; d: string; y: string } | null {
  if (!raw) return null
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const [, y, m, d] = iso
    return { m: m.padStart(2, '0'), d: d.padStart(2, '0'), y }
  }
  const us = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (us) {
    const [, m, d, y] = us
    return { m: m.padStart(2, '0'), d: d.padStart(2, '0'), y }
  }
  return null
}
