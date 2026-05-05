/**
 * Despacho AcroForm: intenta PDF oficial en `/public/forms/`; si falla → `generatePdf` visual.
 *
 * Formularios con mapper: **w4**, **h1010**, **i821d**, **i765**, **w7**, **i9**.
 * Coloca `h1010.pdf` en `public/forms/` si lo descargas desde Your Texas Benefits (si no, hay fallback visual).
 */
import type { PdfFormId } from '@/types/pdf'
import { generatePdf, downloadPdfBytes } from '@/lib/pdf-generator'

import { fillW4AcroForm } from './w4-mapper'
import { fillH1010AcroForm } from './h1010-mapper'
import { fillI821DAcroForm } from './i821d-mapper'
import { fillI765AcroForm } from './i765-mapper'
import { fillW7AcroForm } from './w7-mapper'
import { fillI9AcroForm } from './i9-mapper'
import {
  toH1010FormData,
  toI765FormData,
  toI821dFormData,
  toI9Section1Data,
  toW4FormData,
  toW7FormData,
} from './adapters'

const ACROFORM_READY: ReadonlySet<PdfFormId> = new Set([
  'w4',
  'h1010',
  'i821d',
  'i765',
  'w7',
  'i9',
])

export type PdfSource = 'acroform' | 'visual'

export interface GenerateResult {
  bytes: Uint8Array
  source: PdfSource
  name: string
}

export async function generateFormPdf(
  formId: PdfFormId,
  formData: Record<string, unknown>,
): Promise<GenerateResult> {
  if (ACROFORM_READY.has(formId)) {
    try {
      const bytes = await fillOfficial(formId, formData)
      return { bytes, source: 'acroform', name: officialFilename(formId) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[acroform] ${formId} → visual fallback: ${msg}`)
    }
  }

  const pdf = await generatePdf(formId, formData)
  return { bytes: pdf.bytes, source: 'visual', name: pdf.name }
}

export async function generateAndDownload(
  formId: PdfFormId,
  formData: Record<string, unknown>,
  lastName = 'applicant',
): Promise<PdfSource> {
  const result = await generateFormPdf(formId, formData)
  const suffix = result.source === 'acroform' ? '-oficial' : ''
  const filename = `hazloasiya-${formId}-${lastName}${suffix}.pdf`
  downloadPdfBytes(result.bytes, filename)
  return result.source
}

async function fillOfficial(
  formId: PdfFormId,
  data: Record<string, unknown>,
): Promise<Uint8Array> {
  const path = officialPdfPath(formId)
  const head = await fetch(path, { method: 'HEAD' })
  if (!head.ok) throw new Error(`PDF not found: ${path}`)

  switch (formId) {
    case 'w4':
      return fillW4AcroForm(toW4FormData(data))
    case 'h1010':
      return fillH1010AcroForm(toH1010FormData(data))
    case 'i821d':
      return fillI821DAcroForm(toI821dFormData(data))
    case 'i765':
      return fillI765AcroForm(toI765FormData(data))
    case 'w7':
      return fillW7AcroForm(toW7FormData(data))
    case 'i9':
      return fillI9AcroForm(toI9Section1Data(data))
    default:
      throw new Error(`No AcroForm mapper for: ${formId}`)
  }
}

const PDF_PATHS: Partial<Record<PdfFormId, string>> = {
  w4: '/forms/fw4.pdf',
  h1010: '/forms/h1010.pdf',
  i821d: '/forms/i821d.pdf',
  w7: '/forms/fw7.pdf',
  i765: '/forms/i765.pdf',
  i9: '/forms/i-9.pdf',
}

function officialPdfPath(formId: PdfFormId): string {
  return PDF_PATHS[formId] ?? `/forms/${formId}.pdf`
}

function officialFilename(formId: PdfFormId): string {
  const names: Partial<Record<PdfFormId, string>> = {
    w4: 'W-4 Withholding Certificate',
    h1010: 'H1010 Texas Benefits Application',
    i821d: 'I-821D DACA Application',
    w7: 'W-7 ITIN Application',
    i765: 'I-765 Employment Authorization',
    i9: 'I-9 Employment Eligibility',
  }
  return names[formId] ?? formId
}
