/**
 * Texas H1010 — Texas Works Application (HHSC fillable).
 * PDF: /public/forms/h1010.pdf (coloca aquí el PDF descargado desde Your Texas Benefits si no está en el repo).
 *
 * Sin archivo → el despacho usa el generador visual (`pdf-generator`).
 */
import { PDFDocument } from 'pdf-lib'

const H = {
  snap: 'form1[0].#subform[0].CheckBox_SNAP[0]',
  medicaid: 'form1[0].#subform[0].CheckBox_Medicaid[0]',
  chip: 'form1[0].#subform[0].CheckBox_CHIP[0]',
  tanf: 'form1[0].#subform[0].CheckBox_TANF[0]',
  expedited: 'form1[0].#subform[0].CheckBox_Expedited[0]',
  genderM: 'form1[0].#subform[0].CheckBox_P1GenderM[0]',
  genderF: 'form1[0].#subform[0].CheckBox_P1GenderF[0]',
  hhSize: 'form1[0].#subform[0].TextField_HHSize[0]',
  street: 'form1[0].#subform[0].TextField_StreetAddr[0]',
  city: 'form1[0].#subform[0].TextField_City[0]',
  county: 'form1[0].#subform[0].TextField_County[0]',
  state: 'form1[0].#subform[0].TextField_State[0]',
  zip: 'form1[0].#subform[0].TextField_ZIP[0]',
  p1First: 'form1[0].#subform[0].TextField_P1First[0]',
  p1Last: 'form1[0].#subform[0].TextField_P1Last[0]',
  p1Dob: 'form1[0].#subform[0].TextField_P1DOB[0]',
  p1Ssn: 'form1[0].#subform[0].TextField_P1SSN[0]',
  p1Phone: 'form1[0].#subform[0].TextField_P1Phone[0]',
  p1Email: 'form1[0].#subform[0].TextField_P1Email[0]',
  empIncome: 'form1[0].#subform[0].TextField_EmpIncome[0]',
  rent: 'form1[0].#subform[0].TextField_Rent[0]',
  utilities: 'form1[0].#subform[0].TextField_Utilities[0]',
  medical: 'form1[0].#subform[0].TextField_Medical[0]',
  childcare: 'form1[0].#subform[0].TextField_Childcare[0]',
  signDate: 'form1[0].#subform[0].TextField_SignDate[0]',
} as const

export interface H1010FormData {
  wantSNAP: boolean
  wantMedicaid: boolean
  wantCHIP: boolean
  wantTANF: boolean
  emergency: boolean
  householdSize: string
  streetAddr: string
  city: string
  county: string
  zip: string
  lastName: string
  firstName: string
  middleName?: string
  dob: string
  ssn?: string
  gender?: string
  phone: string
  email?: string
  hasEmployment: boolean
  employmentIncome: string
  rent: string
  utilities: string
  medical: string
  childcare: string
}

export async function fillH1010AcroForm(data: H1010FormData): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/h1010.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try {
      form.getTextField(id).setText(val)
    } catch {
      console.warn(`[H1010] setText: ${id}`)
    }
  }

  const setCheck = (id: string, on: boolean) => {
    try {
      const cb = form.getCheckBox(id)
      if (on) cb.check()
      else cb.uncheck()
    } catch {
      console.warn(`[H1010] checkbox ${id}`)
    }
  }

  setCheck(H.snap, data.wantSNAP)
  setCheck(H.medicaid, data.wantMedicaid)
  setCheck(H.chip, data.wantCHIP)
  setCheck(H.tanf, data.wantTANF)
  setCheck(H.expedited, data.emergency)

  const g = (data.gender ?? '').trim().toUpperCase()
  setCheck(H.genderM, g.startsWith('M'))
  setCheck(H.genderF, g.startsWith('F'))

  setText(H.hhSize, data.householdSize)
  setText(H.street, data.streetAddr)
  setText(H.city, data.city)
  setText(H.county, data.county)
  setText(H.state, 'TX')
  setText(H.zip, data.zip)

  setText(H.p1Last, data.lastName)
  setText(H.p1First, data.firstName + (data.middleName ? ` ${data.middleName}` : ''))
  setText(H.p1Dob, formatDateMMDDYYYY(data.dob))
  setText(H.p1Ssn, data.ssn ? formatSSN(data.ssn) : '')
  setText(H.p1Phone, data.phone)
  setText(H.p1Email, data.email ?? '')

  setText(H.empIncome, stripMoney(data.employmentIncome))
  setText(H.rent, stripMoney(data.rent))
  setText(H.utilities, stripMoney(data.utilities))
  setText(H.medical, stripMoney(data.medical))
  setText(H.childcare, stripMoney(data.childcare))

  return pdfDoc.save()
}

export async function debugH1010Fields(): Promise<void> {
  const pdfBytes = await fetch('/forms/h1010.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()
  console.group('H1010 AcroForm Fields')
  form.getFields().forEach(f => console.log(`"${f.getName()}" [${f.constructor.name}]`))
  console.groupEnd()
}

function formatSSN(s: string): string {
  const d = s.replace(/\D/g, '')
  return d.length === 9 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : s
}

function formatDateMMDDYYYY(raw: string): string {
  if (!raw) return ''
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const [, y, m, d] = iso
    return `${m}/${d}/${y}`
  }
  return raw
}

function stripMoney(s: string): string {
  return s.replace(/^\$/, '').trim()
}
