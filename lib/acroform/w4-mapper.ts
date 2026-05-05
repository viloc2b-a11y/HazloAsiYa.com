/**
 * W-4 Employee's Withholding Certificate (IRS fillable).
 * PDF: /public/forms/fw4.pdf — https://www.irs.gov/pub/irs-pdf/fw4.pdf
 *
 * Nombres de campo alineados con `scripts/reconcile_fields.py` (revisar tras cada nueva edición).
 */
import { PDFDocument } from 'pdf-lib'

const W4_FIELDS = {
  firstName: 'f1_09[0]',
  lastName: 'f1_10[0]',
  address: 'f1_11[0]',
  cityStateZip: 'f1_12[0]',
  ssn: 'f1_13[0]',
  childTaxCredit: 'f1_14[0]',
  otherDependents: 'f1_15[0]',
  totalCredits: 'f1_16[0]',
  otherIncome: 'f1_17[0]',
  deductions: 'f1_18[0]',
  extraWithholding: 'f1_19[0]',
  exemptLine: 'f1_20[0]',
  filingStatusGroup: 'c1_1[0]',
  exemptCheck: 'c1_2[0]',
} as const

/** Valores export típicos IRS paso 1(c): revisar con inspect_fields si cambian. */
const FILING_EXPORT: Record<'single' | 'married' | 'hoh', string> = {
  single: '1',
  married: '2',
  hoh: '3',
}

export interface W4FormData {
  firstName: string
  lastName: string
  address: string
  /** Si viene vacío, se puede derivar del mismo bloque de dirección. */
  cityStateZip?: string
  ssn: string
  filingStatus: 'single' | 'married' | 'hoh'
  childrenUnder17: string
  otherDependents: string
  otherIncome: string
  deductions: string
  extraWithholding: string
  exempt: boolean
}

export async function fillW4AcroForm(data: W4FormData): Promise<Uint8Array> {
  const pdfBytes = await fetch('/forms/fw4.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()

  const setText = (id: string, val: string) => {
    if (!val) return
    try {
      form.getTextField(id).setText(val)
    } catch {
      console.warn(`[W4] setText: ${id}`)
    }
  }

  const kids = Math.max(0, parseInt(data.childrenUnder17, 10) || 0)
  const otherDeps = Math.max(0, parseInt(data.otherDependents, 10) || 0)
  const childTaxDollars = kids * 2000
  const otherDepDollars = otherDeps * 500
  const step3Total = childTaxDollars + otherDepDollars

  setText(W4_FIELDS.firstName, data.firstName)
  setText(W4_FIELDS.lastName, data.lastName)
  setText(W4_FIELDS.address, data.address)
  setText(W4_FIELDS.cityStateZip, data.cityStateZip ?? '')
  setText(W4_FIELDS.ssn, formatSSN(data.ssn))

  setText(W4_FIELDS.childTaxCredit, childTaxDollars ? String(childTaxDollars) : '')
  setText(W4_FIELDS.otherDependents, otherDepDollars ? String(otherDepDollars) : '')
  setText(W4_FIELDS.totalCredits, step3Total ? String(step3Total) : '')
  setText(W4_FIELDS.otherIncome, stripMoney(data.otherIncome))
  setText(W4_FIELDS.deductions, stripMoney(data.deductions))
  setText(W4_FIELDS.extraWithholding, stripMoney(data.extraWithholding))

  try {
    const ex = form.getCheckBox(W4_FIELDS.exemptCheck)
    if (data.exempt) {
      setText(W4_FIELDS.exemptLine, 'EXEMPT')
      ex.check()
    } else {
      ex.uncheck()
    }
  } catch {
    if (data.exempt) setText(W4_FIELDS.exemptLine, 'EXEMPT')
  }

  const exportVal = FILING_EXPORT[data.filingStatus]
  try {
    form.getRadioGroup(W4_FIELDS.filingStatusGroup).select(exportVal)
  } catch {
    console.warn(`[W4] filing radio ${exportVal} — revisar valores export del PDF`)
  }

  return pdfDoc.save()
}

export async function debugW4Fields(): Promise<void> {
  const pdfBytes = await fetch('/forms/fw4.pdf').then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()
  console.group('W-4 AcroForm Fields')
  form.getFields().forEach(f => console.log(`"${f.getName()}" [${f.constructor.name}]`))
  console.groupEnd()
}

function formatSSN(ssn: string): string {
  const d = ssn.replace(/\D/g, '')
  return d.length === 9 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : ssn
}

function stripMoney(s: string): string {
  const t = s.trim()
  if (!t) return ''
  return t.replace(/^\$/, '').trim()
}
