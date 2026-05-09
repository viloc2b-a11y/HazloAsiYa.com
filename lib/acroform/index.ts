/**
 * lib/acroform/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Despacho AcroForm: intenta PDF oficial en `/public/forms/`; si falla → `generatePdf` visual.
 *
 * Formularios con mapper AcroForm (PDF oficial rellenable):
 *   w4      → fw4.pdf (IRS)
 *   i821d   → i821d.pdf (USCIS)
 *   i765    → i765.pdf (USCIS)
 *   w7      → fw7.pdf (IRS)
 *   i9      → i-9.pdf (USCIS)
 *   saws1   → saws1.pdf (California CDSS) — CalFresh / Medi-Cal / CalWORKs
 *
 * Formularios con generación visual (PDF oficial sin AcroForm):
 *   h1010   → Texas H1010 (HHSC) — visual fallback siempre activo
 *   cfes2337 → Florida CF-ES 2337 (DCF) — generación visual fiel al original
 *
 * NOTA: h1010.pdf de Texas no está disponible para descarga automática desde HHSC.
 * Si tienes el archivo, colócalo en public/forms/h1010.pdf y el sistema lo usará.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import type { PdfFormId } from '@/types/pdf'
import { generatePdf, downloadPdfBytes } from '@/lib/pdf-generator'

import { fillW4AcroForm } from './w4-mapper'
import { fillH1010AcroForm } from './h1010-mapper'
import { fillI821DAcroForm } from './i821d-mapper'
import { fillI765AcroForm } from './i765-mapper'
import { fillW7AcroForm } from './w7-mapper'
import { fillI9AcroForm } from './i9-mapper'
import { fillSaws1AcroForm } from './saws1-mapper'
import { fillCfEs2337Form } from './cfes2337-mapper'
import { generateCaWic100 } from './cawic100-mapper'
import { generateLdss2921Pdf } from './ldss2921-mapper'
import { generateNyWicPdf } from './nywic-mapper'

import {
  toH1010FormData,
  toI765FormData,
  toI821dFormData,
  toI9Section1Data,
  toW4FormData,
  toW7FormData,
  toSaws1FormData,
  toCfEs2337FormData,
  toCaWic100FormData,
  toLdss2921FormData,
  toNyWicFormData,
} from './adapters'

// Formularios que tienen PDF oficial con campos AcroForm rellenables
const ACROFORM_READY: ReadonlySet<PdfFormId> = new Set([
  'w4',
  'h1010',
  'i821d',
  'i765',
  'w7',
  'i9',
  'saws1',
])

// Formularios que se generan visualmente (no tienen AcroForm en el PDF oficial)
const VISUAL_ONLY: ReadonlySet<PdfFormId> = new Set([
  'cfes2337',
  'cawic100',
  'ldss2921',
  'nywic',
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
  // Formularios de generación visual directa (sin PDF oficial AcroForm)
  if (VISUAL_ONLY.has(formId)) {
    const bytes = await fillVisualDirect(formId, formData)
    return { bytes, source: 'visual', name: officialFilename(formId) }
  }

  // Formularios con AcroForm: intentar oficial, fallback a visual
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

/**
 * Rellena el PDF oficial con AcroForm.
 * Lanza error si el PDF no está disponible → generateFormPdf usa fallback visual.
 */
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
    case 'saws1':
      return fillSaws1AcroForm(toSaws1FormData(data))
    default:
      throw new Error(`No AcroForm mapper for: ${formId}`)
  }
}

/**
 * Genera el PDF visualmente (sin depender de un PDF oficial con AcroForm).
 * Usado para formularios como CF-ES 2337 de Florida que no tienen campos digitales.
 */
async function fillVisualDirect(
  formId: PdfFormId,
  data: Record<string, unknown>,
): Promise<Uint8Array> {
  switch (formId) {
    case 'cfes2337':
      return fillCfEs2337Form(toCfEs2337FormData(data))
    case 'cawic100':
      return generateCaWic100(toCaWic100FormData(data))
    case 'ldss2921':
      return generateLdss2921Pdf(toLdss2921FormData(data))
    case 'nywic':
      return generateNyWicPdf(toNyWicFormData(data))
    default:
      throw new Error(`No visual generator for: ${formId}`)
  }
}

const PDF_PATHS: Partial<Record<PdfFormId, string>> = {
  w4:      '/forms/fw4.pdf',
  h1010:   '/forms/h1010.pdf',
  i821d:   '/forms/i821d.pdf',
  w7:      '/forms/fw7.pdf',
  i765:    '/forms/i765.pdf',
  i9:      '/forms/i-9.pdf',
  saws1:   '/forms/saws1.pdf',
}

function officialPdfPath(formId: PdfFormId): string {
  return PDF_PATHS[formId] ?? `/forms/${formId}.pdf`
}

function officialFilename(formId: PdfFormId): string {
  const names: Partial<Record<PdfFormId, string>> = {
    w4:       'W-4 Withholding Certificate',
    h1010:    'H1010 Texas Works Application',
    i821d:    'I-821D DACA Application',
    w7:       'W-7 ITIN Application',
    i765:     'I-765 Employment Authorization',
    i9:       'I-9 Employment Eligibility',
    saws1:    'SAWS-1 California CalFresh Medi-Cal Application',
    cfes2337: 'CF-ES-2337 Florida ACCESS Application',
    cawic100: 'CA-WIC-100 California WIC Application',
    ldss2921: 'LDSS-2921 New York SNAP Medicaid Application',
    nywic:    'NY WIC New York WIC Application',
  }
  return names[formId] ?? formId
}
