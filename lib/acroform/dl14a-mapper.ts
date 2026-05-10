/**
 * lib/acroform/dl14a-mapper.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Texas DL-14A — Driver License / Identification Card Application
 *
 * NOTA TÉCNICA: El formulario DL-14A de Texas DPS no está disponible como
 * PDF AcroForm rellenable digitalmente. Se genera visualmente con pdf-lib
 * reproduciendo el formato oficial del formulario.
 *
 * El documento generado incluye:
 * - Tipo de solicitud (DL vs ID, Original/Renewal/Replacement/Change)
 * - Información personal completa
 * - Dirección en Texas
 * - Ciudadanía e historial médico
 * - Checklist de documentos requeridos por categoría
 *
 * Fuente oficial: https://www.dps.texas.gov/section/driver-license
 * Agencia: Texas Department of Public Safety (DPS)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { PDFDocument, StandardFonts, rgb as pdfRgb } from 'pdf-lib'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Dl14aFormData {
  // Application type
  documentType: 'dl' | 'id'
  applicationType: 'orig' | 'ren' | 'rep' | 'chg'
  // Personal info
  lastName: string
  firstName: string
  middleName?: string
  suffix?: string
  maidenName?: string
  ssn?: string
  dob: string
  sex?: 'M' | 'F'
  heightFt?: string
  heightIn?: string
  weight?: string
  // Texas address
  street: string
  city: string
  county?: string
  zip: string
  // Citizenship & medical
  usCitizen?: boolean
  medicalCondition?: boolean
  // Documents checklist
  docPassport?: boolean
  docBirthCert?: boolean
  docGreenCard?: boolean
  docEad?: boolean
  docI94?: boolean
  docSsn?: boolean
  docW2?: boolean
  docUtility?: boolean
  docLease?: boolean
  docBank?: boolean
}

// ── Shared drawing helpers (self-contained) ───────────────────────────────────
interface Ctx {
  page: import('pdf-lib').PDFPage
  font: import('pdf-lib').PDFFont
  fontB: import('pdf-lib').PDFFont
  width: number
  height: number
}

function hdr(ctx: Ctx, code: string, title: string, sub: string): number {
  const { page, font, fontB, width, height } = ctx
  page.drawRectangle({ x: 0, y: height - 65, width, height: 65, color: pdfRgb(0.05, 0.05, 0.07) })
  page.drawText(code,  { x: 24, y: height - 26, font: fontB, size: 11, color: pdfRgb(1, 1, 1) })
  page.drawText(title, { x: 24, y: height - 43, font: fontB, size: 9,  color: pdfRgb(0.9, 0.9, 0.9) })
  page.drawText(sub,   { x: 24, y: height - 57, font,        size: 7.5, color: pdfRgb(0.55, 0.65, 0.55) })
  page.drawRectangle({ x: 0, y: height - 67, width, height: 2, color: pdfRgb(0.04, 0.45, 0.39) })
  return height - 90
}

function notice(ctx: Ctx, y: number): number {
  const { page, font, fontB } = ctx
  page.drawRectangle({ x: 24, y: y - 32, width: 564, height: 28, color: pdfRgb(0.98, 0.95, 0.85), borderColor: pdfRgb(0.77, 0.49, 0.04), borderWidth: 1 })
  page.drawText('PREPARADO POR HAZLOASIYA.COM — No es asesoría legal. Verifique antes de presentar.', { x: 32, y: y - 18, font: fontB, size: 7.5, color: pdfRgb(0.48, 0.29, 0.01) })
  return y - 44
}

function section(ctx: Ctx, title: string, y: number): number {
  const { page, fontB } = ctx
  page.drawRectangle({ x: 24, y: y - 16, width: 564, height: 18, color: pdfRgb(0.93, 0.97, 0.95) })
  page.drawText(title, { x: 28, y: y - 11, font: fontB, size: 8.5, color: pdfRgb(0.03, 0.34, 0.29) })
  return y - 22
}

function field(ctx: Ctx, label: string, value: string, x: number, y: number, w = 260): number {
  const { page, font, fontB } = ctx
  page.drawText(label, { x, y: y + 2, font, size: 6.5, color: pdfRgb(0.45, 0.45, 0.45) })
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 0.5, color: pdfRgb(0.8, 0.8, 0.8) })
  if (value) page.drawText(String(value), { x: x + 2, y: y - 10, font: fontB, size: 9.5, color: pdfRgb(0.05, 0.05, 0.07) })
  return y - 23
}

function checkbox(ctx: Ctx, label: string, checked: boolean, x: number, y: number): number {
  const { page, font, fontB } = ctx
  page.drawRectangle({ x, y: y - 2, width: 9, height: 9, borderColor: pdfRgb(0.35, 0.35, 0.35), borderWidth: 1, color: pdfRgb(1, 1, 1) })
  if (checked) page.drawText('✓', { x: x + 1, y: y - 1, font: fontB, size: 8, color: pdfRgb(0.04, 0.45, 0.39) })
  page.drawText(label, { x: x + 14, y, font, size: 8.5, color: pdfRgb(0.15, 0.15, 0.15) })
  return y - 15
}

function signature(ctx: Ctx, y: number): void {
  const { page, font } = ctx
  page.drawLine({ start: { x: 28, y }, end: { x: 360, y }, thickness: 0.5, color: pdfRgb(0.4, 0.4, 0.4) })
  page.drawText('Firma / Signature', { x: 28, y: y - 12, font, size: 7, color: pdfRgb(0.5, 0.5, 0.5) })
  page.drawLine({ start: { x: 380, y }, end: { x: 588, y }, thickness: 0.5, color: pdfRgb(0.4, 0.4, 0.4) })
  page.drawText('Fecha / Date', { x: 380, y: y - 12, font, size: 7, color: pdfRgb(0.5, 0.5, 0.5) })
}

function footer(ctx: Ctx, text: string): void {
  const { page, font, width } = ctx
  page.drawRectangle({ x: 0, y: 0, width, height: 26, color: pdfRgb(0.05, 0.05, 0.07) })
  page.drawText(text, { x: 24, y: 8, font, size: 7, color: pdfRgb(0.45, 0.45, 0.45) })
}

// ── Main generator ────────────────────────────────────────────────────────────
export async function generateDl14aPdf(d: Dl14aFormData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font  = await doc.embedFont(StandardFonts.Helvetica)
  const fontB = await doc.embedFont(StandardFonts.HelveticaBold)
  const page  = doc.addPage([612, 792])
  const { width, height } = page.getSize()
  const ctx: Ctx = { page, font, fontB, width, height }

  const appMap: Record<string, string> = {
    orig: 'Original',
    ren:  'Renewal',
    rep:  'Replacement',
    chg:  'Address or Name Change',
  }

  let y = hdr(ctx, 'FORM DL-14A (Rev. 8/2025)', 'Texas Driver License or Identification Card Application', 'Texas Department of Public Safety (DPS) · Adult — 17 years 10 months and older')
  y = notice(ctx, y)

  y = section(ctx, 'APPLICATION TYPE', y) - 8
  y = checkbox(ctx, 'Driver License',                                d.documentType === 'dl', 28, y)
  y = checkbox(ctx, 'Identification Card (No driving privileges)',   d.documentType === 'id', 28, y)
  y -= 4
  ;(['orig', 'ren', 'rep', 'chg'] as const).forEach(k => {
    y = checkbox(ctx, appMap[k], d.applicationType === k, 200, y)
  })
  y -= 8

  y = section(ctx, 'PERSONAL INFORMATION', y) - 8
  y = field(ctx, 'Last Name',   d.lastName,   28,  y, 200)
  field(ctx, 'First Name',      d.firstName,  240, y + 23, 180)
  field(ctx, 'Middle Name',     d.middleName ?? '', 432, y + 23, 148)
  y = field(ctx, 'Suffix',      d.suffix ?? '', 28, y, 80)
  field(ctx, 'Birth Surname / Maiden Name', d.maidenName ?? '', 120, y + 23, 460)
  y = field(ctx, 'Social Security Number', d.ssn ?? '', 28, y, 200)
  field(ctx, 'Date of Birth (mm/dd/yyyy)', d.dob, 240, y + 23, 180)
  field(ctx, 'Sex', d.sex === 'M' ? 'Male' : d.sex === 'F' ? 'Female' : '', 432, y + 23, 148)
  y = field(ctx, "Height (Ft'  In\")", `${d.heightFt ?? '?'}' ${d.heightIn ?? '?'}"`, 28, y, 160)
  field(ctx, 'Weight (lbs)', d.weight ?? '', 200, y + 23, 120)
  y -= 4

  y = section(ctx, 'ADDRESS IN TEXAS', y) - 8
  y = field(ctx, 'Street Address / Apt / Suite', d.street, 28, y, 400)
  y = field(ctx, 'City', d.city, 28, y, 200)
  field(ctx, 'County', d.county ?? '', 240, y + 23, 160)
  field(ctx, 'ZIP Code', d.zip, 412, y + 23, 130)
  y -= 4

  y = section(ctx, 'CITIZENSHIP & MEDICAL HISTORY (Confidential)', y) - 8
  y = checkbox(ctx, 'Yes — U.S. Citizen',                                  d.usCitizen === true,  28, y)
  y = checkbox(ctx, 'No — Non-citizen with lawful presence',               d.usCitizen === false, 28, y)
  y -= 4
  y = checkbox(ctx, 'No medical condition affecting ability to operate a motor vehicle', d.medicalCondition === false, 28, y)
  y = checkbox(ctx, 'Yes — medical condition exists (reviewed by DPS)',    d.medicalCondition === true, 28, y)
  y -= 8

  y = section(ctx, 'DOCUMENTS CHECKLIST — Bring originals to DPS appointment (txdpsscheduler.com)', y) - 8
  const docs: [boolean | undefined, string][] = [
    [d.docPassport,   'Cat. 1 Identity: U.S. Passport'],
    [d.docBirthCert,  'Cat. 1 Identity: U.S. Certified Birth Certificate'],
    [d.docGreenCard,  'Cat. 1 Identity: Permanent Resident Card (I-551)'],
    [d.docEad,        'Cat. 1 Identity: Employment Authorization Document (EAD)'],
    [d.docI94,        'Cat. 1 Identity: Foreign Passport + I-94 + Work Auth'],
    [d.docSsn,        'Cat. 2 SSN: Social Security Card (original)'],
    [d.docW2,         'Cat. 2 SSN: W-2 or 1099 showing SSN'],
    [d.docUtility,    'Cat. 3 TX Residency #1: Utility Bill'],
    [d.docLease,      'Cat. 3 TX Residency #2: Lease or Mortgage Statement'],
    [d.docBank,       'Cat. 3 TX Residency (alt): Bank Statement'],
  ]
  docs.filter(([checked]) => checked).forEach(([, label]) => {
    page.drawText(`✓ ${label}`, { x: 32, y, font, size: 9, color: pdfRgb(0.03, 0.34, 0.29) })
    y -= 13
  })
  y -= 8
  page.drawText('I certify that the information I have given is true, complete, and correct.', { x: 28, y, font, size: 7.5, color: pdfRgb(0.2, 0.2, 0.2) })
  y -= 26
  signature(ctx, y)
  footer(ctx, 'DL-14A (Rev. 8/2025) · Texas DPS · Prepared by HazloAsíYa.com · Present at txdpsscheduler.com appointment')

  return doc.save()
}
