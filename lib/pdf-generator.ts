// ─────────────────────────────────────────────────────────────
// lib/pdf-generator.ts
// HazloAsíYa — PDF Generation Engine
// Uses pdf-lib (client-safe) — runs in browser via dynamic import
// All 9 forms: I-821D, I-765, W-7, H1010, W-4, I-9, DL-14A, Matrícula, Escuela
// ─────────────────────────────────────────────────────────────

import type { PdfFormId } from '@/types/pdf'

// Lazy import pdf-lib (client-side only)
async function getPdfLib() {
  const lib = await import('pdf-lib')
  return lib
}

export interface GeneratedPdf {
  id: PdfFormId
  name: string
  description: string
  bytes: Uint8Array
}

// ── Shared drawing helpers ────────────────────────────────────
interface DrawCtx {
  page: import('pdf-lib').PDFPage
  font: import('pdf-lib').PDFFont
  fontB: import('pdf-lib').PDFFont
  rgb: (r: number, g: number, b: number) => import('pdf-lib').Color
  width: number
  height: number
}

function drawHeader(ctx: DrawCtx, code: string, title: string, sub: string): number {
  const { page, font, fontB, rgb, width, height } = ctx
  page.drawRectangle({ x: 0, y: height - 65, width, height: 65, color: rgb(0.05, 0.05, 0.07) })
  page.drawText(code,  { x: 24, y: height - 26, font: fontB, size: 11, color: rgb(1, 1, 1) })
  page.drawText(title, { x: 24, y: height - 43, font: fontB, size: 9,  color: rgb(0.9, 0.9, 0.9) })
  page.drawText(sub,   { x: 24, y: height - 57, font,        size: 7.5, color: rgb(0.55, 0.65, 0.55) })
  page.drawRectangle({ x: 0, y: height - 67, width, height: 2, color: rgb(0.04, 0.45, 0.39) })
  return height - 90
}

function drawNotice(ctx: DrawCtx, y: number): number {
  const { page, font, fontB, rgb } = ctx
  page.drawRectangle({ x: 24, y: y - 32, width: 564, height: 28, color: rgb(0.98, 0.95, 0.85), borderColor: rgb(0.77, 0.49, 0.04), borderWidth: 1 })
  page.drawText('PREPARADO POR HAZLOASIYA.COM — No es asesoría legal. Verifique antes de presentar.', { x: 32, y: y - 18, font: fontB, size: 7.5, color: rgb(0.48, 0.29, 0.01) })
  return y - 44
}

function drawSection(ctx: DrawCtx, title: string, y: number): number {
  const { page, fontB, rgb } = ctx
  page.drawRectangle({ x: 24, y: y - 16, width: 564, height: 18, color: rgb(0.93, 0.97, 0.95) })
  page.drawText(title, { x: 28, y: y - 11, font: fontB, size: 8.5, color: rgb(0.03, 0.34, 0.29) })
  return y - 22
}

function drawField(ctx: DrawCtx, label: string, value: string, x: number, y: number, w = 260): number {
  const { page, font, fontB, rgb } = ctx
  page.drawText(label, { x, y: y + 2, font, size: 6.5, color: rgb(0.45, 0.45, 0.45) })
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) })
  if (value) page.drawText(String(value), { x: x + 2, y: y - 10, font: fontB, size: 9.5, color: rgb(0.05, 0.05, 0.07) })
  return y - 23
}

function drawCheckbox(ctx: DrawCtx, label: string, checked: boolean, x: number, y: number): number {
  const { page, font, fontB, rgb } = ctx
  page.drawRectangle({ x, y: y - 2, width: 9, height: 9, borderColor: rgb(0.35, 0.35, 0.35), borderWidth: 1, color: rgb(1, 1, 1) })
  if (checked) page.drawText('✓', { x: x + 1, y: y - 1, font: fontB, size: 8, color: rgb(0.04, 0.45, 0.39) })
  page.drawText(label, { x: x + 14, y, font, size: 8.5, color: rgb(0.15, 0.15, 0.15) })
  return y - 15
}

function drawSignature(ctx: DrawCtx, y: number): void {
  const { page, font, rgb } = ctx
  page.drawLine({ start: { x: 28, y }, end: { x: 360, y }, thickness: 0.5, color: rgb(0.4, 0.4, 0.4) })
  page.drawText('Firma / Signature', { x: 28, y: y - 12, font, size: 7, color: rgb(0.5, 0.5, 0.5) })
  page.drawLine({ start: { x: 380, y }, end: { x: 588, y }, thickness: 0.5, color: rgb(0.4, 0.4, 0.4) })
  page.drawText('Fecha / Date', { x: 380, y: y - 12, font, size: 7, color: rgb(0.5, 0.5, 0.5) })
}

function drawFooter(ctx: DrawCtx, text: string): void {
  const { page, font, rgb, width } = ctx
  page.drawRectangle({ x: 0, y: 0, width, height: 26, color: rgb(0.05, 0.05, 0.07) })
  page.drawText(text, { x: 24, y: 8, font, size: 7, color: rgb(0.45, 0.45, 0.45) })
}

async function makeCtx(doc: import('pdf-lib').PDFDocument): Promise<{ ctx: DrawCtx; page: import('pdf-lib').PDFPage }> {
  const { StandardFonts, rgb } = await getPdfLib()
  const font  = await doc.embedFont(StandardFonts.Helvetica)
  const fontB = await doc.embedFont(StandardFonts.HelveticaBold)
  const page  = doc.addPage([612, 792])
  const { width, height } = page.getSize()
  const ctx: DrawCtx = { page, font, fontB, rgb, width, height }
  return { ctx, page }
}

// ── FORM GENERATORS ───────────────────────────────────────────

async function generateI821D(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  let y = drawHeader(ctx, 'FORM I-821D', 'Consideration of Deferred Action for Childhood Arrivals', 'USCIS · OMB No. 1615-0124')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'PART 1 — INFORMATION ABOUT YOU', y) - 8
  y = drawField(ctx, 'Family Name (Last Name)', fv('lastName'), 28, y, 200)
  drawField(ctx, 'Given Name (First Name)', fv('firstName'), 240, y + 23, 180)
  drawField(ctx, 'Middle Name', fv('middleName'), 432, y + 23, 148)
  y = drawField(ctx, 'Date of Birth (mm/dd/yyyy)', fv('dob'), 28, y, 200)
  drawField(ctx, 'Country of Birth', fv('countryBirth'), 240, y + 23, 200)
  drawField(ctx, 'Country of Citizenship', fv('countryCitizenship'), 452, y + 23, 136)
  y = drawField(ctx, 'A-Number (if any)', fv('aNumber') || 'N/A', 28, y, 200)
  drawField(ctx, 'USCIS Online Account Number (if any)', fv('uscisAccount') || 'N/A', 240, y + 23, 340)
  y -= 4

  y = drawSection(ctx, 'PART 2 — ARRIVAL/ENTRY INFORMATION', y) - 8
  y = drawField(ctx, 'Date of Last Arrival (mm/dd/yyyy)', fv('lastArrival'), 28, y, 250)
  drawField(ctx, 'I-94 Arrival-Departure Record Number', fv('i94') || 'N/A', 290, y + 23, 298)
  y = drawField(ctx, 'Passport Number', fv('passportNumber') || 'N/A', 28, y, 200)
  drawField(ctx, 'Passport Country of Issuance', fv('passportCountry'), 240, y + 23, 200)
  drawField(ctx, 'Passport Expiration Date', fv('passportExpiry'), 452, y + 23, 136)
  y -= 4

  y = drawSection(ctx, 'PART 3 — ADDRESS', y) - 8
  y = drawField(ctx, 'Street Number and Name', fv('streetAddr'), 28, y, 400)
  y = drawField(ctx, 'City or Town', fv('city'), 28, y, 200)
  drawField(ctx, 'State', 'TX', 240, y + 23, 60)
  drawField(ctx, 'ZIP Code', fv('zip'), 312, y + 23, 100)
  y -= 4

  y = drawSection(ctx, 'PART 4 — CONTINUOUS RESIDENCE', y) - 8
  y = drawCheckbox(ctx, 'I have continuously resided in the United States since June 15, 2007', true, 28, y)
  y = drawField(ctx, 'Date first entered U.S.', fv('firstEntry'), 28, y, 200)
  y -= 4

  y = drawSection(ctx, 'PART 5 — EDUCATION / EMPLOYMENT / MILITARY', y) - 8
  y = drawCheckbox(ctx, 'Currently enrolled in school', fv('inSchool') === 'yes', 28, y)
  y = drawCheckbox(ctx, 'Graduated from high school or obtained GED/HiSET', fv('graduated') === 'yes', 28, y)
  y = drawCheckbox(ctx, 'Currently employed / serving in the military', fv('employed') === 'yes', 28, y)
  y -= 8

  ctx.page.drawText('Under penalty of perjury, I certify that the information provided is true and correct.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2), maxWidth: 560, lineHeight: 11 })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'Form I-821D · USCIS · Prepared by HazloAsíYa.com · Not a legal opinion')

  const bytes = await doc.save()
  return { id: 'i821d', name: 'Form I-821D (DACA)', description: 'Consideration of Deferred Action for Childhood Arrivals', bytes }
}

async function generateI765(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  let y = drawHeader(ctx, 'FORM I-765', 'Application for Employment Authorization', 'USCIS · OMB No. 1615-0044')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'PART 1 — INFORMATION ABOUT YOU', y) - 8
  y = drawField(ctx, 'Family Name (Last Name)', fv('lastName'), 28, y, 200)
  drawField(ctx, 'Given Name (First Name)', fv('firstName'), 240, y + 23, 180)
  drawField(ctx, 'Middle Name', fv('middleName'), 432, y + 23, 148)
  y = drawField(ctx, 'Date of Birth (mm/dd/yyyy)', fv('dob'), 28, y, 200)
  drawField(ctx, 'Country of Birth', fv('countryBirth'), 240, y + 23, 200)
  y = drawField(ctx, 'A-Number (if any)', fv('aNumber') || 'N/A', 28, y, 200)
  drawField(ctx, 'USCIS Online Account Number (if any)', fv('uscisAccount') || 'N/A', 240, y + 23, 340)
  y = drawField(ctx, 'US Social Security Number (if any)', fv('ssn') || 'N/A', 28, y, 300)
  y -= 4

  y = drawSection(ctx, 'PART 2 — ELIGIBILITY CATEGORY', y) - 8
  y = drawField(ctx, 'Eligibility category (see form instructions)', fv('eadCategory'), 28, y, 560)
  y -= 4

  y = drawSection(ctx, 'PART 3 — ADDRESS', y) - 8
  y = drawField(ctx, 'Street Number and Name', fv('streetAddr'), 28, y, 400)
  y = drawField(ctx, 'City or Town', fv('city'), 28, y, 200)
  drawField(ctx, 'State', fv('state') || 'TX', 240, y + 23, 60)
  drawField(ctx, 'ZIP Code', fv('zip'), 312, y + 23, 100)
  y -= 8

  ctx.page.drawText('Under penalty of perjury, I certify that the information provided is true and correct.', {
    x: 28,
    y,
    font: ctx.font,
    size: 7.5,
    color: ctx.rgb(0.2, 0.2, 0.2),
    maxWidth: 560,
    lineHeight: 11,
  })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'Form I-765 · USCIS · Prepared by HazloAsíYa.com · Not a legal opinion')

  const bytes = await doc.save()
  return { id: 'i765', name: 'Form I-765 (EAD)', description: 'Application for Employment Authorization', bytes }
}

async function generateW7(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  let y = drawHeader(
    ctx,
    'FORM W-7',
    'Application for IRS Individual Taxpayer Identification Number',
    'IRS · OMB No. 1545-0074',
  )
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'REASON FOR SUBMITTING FORM W-7', y) - 8
  y = drawField(ctx, 'Reason (see W-7 instructions)', fv('w7Reason'), 28, y, 560)
  y -= 4

  y = drawSection(ctx, 'NAME', y) - 8
  y = drawField(ctx, 'First name', fv('firstName'), 28, y, 180)
  drawField(ctx, 'Middle name', fv('middleName'), 220, y + 23, 160)
  drawField(ctx, 'Last name', fv('lastName'), 392, y + 23, 200)
  y = drawField(ctx, 'Name at birth if different', fv('nameAtBirth') || 'N/A', 28, y, 560)
  y -= 4

  y = drawSection(ctx, 'MAILING ADDRESS', y) - 8
  y = drawField(ctx, 'Street address', fv('streetAddr'), 28, y, 400)
  y = drawField(ctx, 'City', fv('city'), 28, y, 200)
  drawField(ctx, 'State', fv('state'), 240, y + 23, 80)
  drawField(ctx, 'ZIP', fv('zip'), 332, y + 23, 100)
  y -= 4

  y = drawSection(ctx, 'FOREIGN ADDRESS (if no U.S. address)', y) - 8
  y = drawField(ctx, 'Foreign address (optional)', fv('foreignAddress') || 'N/A', 28, y, 560)
  y -= 4

  y = drawSection(ctx, 'OTHER INFORMATION', y) - 8
  y = drawField(ctx, 'Date of birth', fv('dob'), 28, y, 200)
  drawField(ctx, 'Country of birth', fv('countryBirth'), 240, y + 23, 200)
  y = drawField(ctx, 'Country of citizenship', fv('countryCitizenship'), 28, y, 260)
  drawField(ctx, 'Foreign tax ID (if any)', fv('foreignTaxId') || 'N/A', 300, y + 23, 288)
  y = drawField(ctx, 'U.S. visa type / number (if any)', fv('visaInfo') || 'N/A', 28, y, 560)
  y -= 4

  y = drawSection(ctx, 'IDENTIFICATION DOCUMENT (SUBMIT WITH W-7)', y) - 8
  y = drawField(ctx, 'Document type', fv('idDocType'), 28, y, 280)
  drawField(ctx, 'Document number', fv('idDocNumber'), 316, y + 23, 272)
  y = drawField(ctx, 'Issuing country', fv('idDocCountry'), 28, y, 300)
  y -= 8

  ctx.page.drawText('Under penalties of perjury, I declare that I have examined this application and it is true.', {
    x: 28,
    y,
    font: ctx.font,
    size: 7.5,
    color: ctx.rgb(0.2, 0.2, 0.2),
    maxWidth: 560,
    lineHeight: 11,
  })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'Form W-7 · IRS · Prepared by HazloAsíYa.com · Not tax or legal advice')

  const bytes = await doc.save()
  return { id: 'w7', name: 'Form W-7 (ITIN)', description: 'IRS Individual Taxpayer Identification Number', bytes }
}

async function generateW4(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  const kidsCredit  = (parseInt(fv('childrenUnder17')) || 0) * 2000
  const otherCredit = (parseInt(fv('otherDependents')) || 0) * 500
  const totalCredit = kidsCredit + otherCredit

  let y = drawHeader(ctx, 'IRS FORM W-4 (2026)', "Employee's Withholding Certificate", '2026 · Give to your employer — Do NOT file with IRS · OMB No. 1545-0074')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'STEP 1 — PERSONAL INFORMATION', y) - 8
  y = drawField(ctx, '(a) First name and middle initial', fv('firstName'), 28, y, 260)
  drawField(ctx, 'Last name', fv('lastName'), 300, y + 23, 288)
  y = drawField(ctx, '(b) Social Security Number', fv('ssn'), 28, y, 260)
  drawField(ctx, 'Address (Street, City, State, ZIP)', fv('address'), 300, y + 23, 288)
  y -= 8

  y = drawSection(ctx, 'STEP 1(c) — FILING STATUS', y) - 8
  y = drawCheckbox(ctx, 'Single or Married filing separately', fv('filingStatus') === 'single', 28, y)
  y = drawCheckbox(ctx, 'Married filing jointly or Qualifying surviving spouse', fv('filingStatus') === 'married', 28, y)
  y = drawCheckbox(ctx, 'Head of household', fv('filingStatus') === 'hoh', 28, y)
  y -= 8

  y = drawSection(ctx, 'STEP 2 — MULTIPLE JOBS', y) - 8
  y = drawCheckbox(ctx, 'Check box (2 jobs total, similar pay)', fv('multiJob') === 'checkbox', 28, y)
  y = drawCheckbox(ctx, 'Used Multiple Jobs Worksheet', fv('multiJob') === 'worksheet', 28, y)
  y = drawCheckbox(ctx, 'N/A — only one job household', fv('multiJob') === 'no', 28, y)
  y -= 8

  y = drawSection(ctx, 'STEP 3 — CLAIM DEPENDENTS', y) - 8
  ctx.page.drawText(`Qualifying children under 17 × $2,000:`, { x: 28, y, font: ctx.font, size: 8.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  drawField(ctx, `${fv('childrenUnder17') || 0} children`, `$${kidsCredit.toLocaleString()}`, 420, y, 168)
  y -= 23
  ctx.page.drawText(`Other dependents × $500:`, { x: 28, y, font: ctx.font, size: 8.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  drawField(ctx, `${fv('otherDependents') || 0} dependents`, `$${otherCredit.toLocaleString()}`, 420, y, 168)
  y -= 23
  drawField(ctx, 'Total Step 3 (enter on W-4)', `$${totalCredit.toLocaleString()}`, 28, y, 560)
  y -= 12

  y = drawSection(ctx, 'STEP 4 — OTHER ADJUSTMENTS (Optional)', y) - 8
  y = drawField(ctx, '4(a) Other income not from jobs', fv('otherIncome') || '$0', 28, y, 560)
  y = drawField(ctx, '4(b) Deductions (from worksheet)', fv('deductions') || '$0', 28, y, 560)
  y = drawField(ctx, '4(c) Extra withholding per period', fv('extraWithholding') || '$0', 28, y, 560)
  if (fv('exempt') === 'yes') {
    ctx.page.drawRectangle({ x: 24, y: y - 20, width: 564, height: 22, color: ctx.rgb(0.99, 0.95, 0.85), borderColor: ctx.rgb(0.77, 0.49, 0.04), borderWidth: 1 })
    ctx.page.drawText('EXEMPT — Employee claims exemption from withholding for 2026', { x: 32, y: y - 12, font: ctx.fontB, size: 9, color: ctx.rgb(0.48, 0.29, 0.01) })
    y -= 28
  }

  y -= 8
  ctx.page.drawText('Under penalties of perjury, I declare this certificate is correct.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'Form W-4 (2026) · IRS · Prepared by HazloAsíYa.com · Give to employer NOT to IRS')

  const bytes = await doc.save()
  return { id: 'w4', name: 'Form W-4 (2026)', description: "Employee's Withholding Certificate — Entrega a tu empleador", bytes }
}

async function generateH1010(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')
  const members: Array<{ name: string; dob: string; rel: string }> = (data.members as Array<{ name: string; dob: string; rel: string }>) ?? []

  const benefits = [
    data.wantSNAP && 'SNAP Food Benefits',
    data.wantMedicaid && 'Medicaid',
    data.wantCHIP && 'CHIP',
    data.wantTANF && 'TANF',
  ].filter(Boolean).join(', ')

  let y = drawHeader(ctx, 'FORM H1010 (04/2024)', 'Texas Works Application for Assistance — Your Texas Benefits', 'Texas Health and Human Services Commission (HHSC)')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'SECTION A — BENEFITS REQUESTED', y) - 8
  y = drawCheckbox(ctx, 'SNAP Food Benefits', !!data.wantSNAP, 28, y)
  y = drawCheckbox(ctx, 'Medicaid', !!data.wantMedicaid, 28, y)
  y = drawCheckbox(ctx, 'CHIP', !!data.wantCHIP, 28, y)
  y = drawCheckbox(ctx, 'TANF Cash Help', !!data.wantTANF, 28, y)
  if (data.emergency === 'yes') { y -= 4; y = drawCheckbox(ctx, '⚠ Requesting EXPEDITED (Emergency) processing', true, 28, y) }
  y -= 4

  y = drawSection(ctx, `SECTION B — HOUSEHOLD SIZE: ${fv('householdSize') || members.length + 1} persons`, y) - 8
  y -= 4

  y = drawSection(ctx, 'SECTION C — ADDRESS', y) - 8
  y = drawField(ctx, 'Street Address', fv('streetAddr'), 28, y, 400)
  y = drawField(ctx, 'City', fv('city'), 28, y, 200)
  drawField(ctx, 'County', fv('county'), 240, y + 23, 160)
  drawField(ctx, 'ZIP Code', fv('zip'), 412, y + 23, 130)
  y -= 4

  y = drawSection(ctx, 'SECTION D — PERSON 1 (Applicant)', y) - 8
  y = drawField(ctx, 'Last Name', fv('lastName'), 28, y, 200)
  drawField(ctx, 'First Name', fv('firstName'), 240, y + 23, 180)
  drawField(ctx, 'Middle Name', fv('middleName'), 432, y + 23, 148)
  y = drawField(ctx, 'Date of Birth', fv('dob'), 28, y, 180)
  drawField(ctx, 'Social Security Number', fv('ssn'), 220, y + 23, 200)
  drawField(ctx, 'Gender', fv('gender'), 432, y + 23, 148)
  y = drawField(ctx, 'Phone', fv('phone'), 28, y, 200)
  drawField(ctx, 'Email', fv('email'), 240, y + 23, 340)
  y -= 4

  if (members.length > 0) {
    y = drawSection(ctx, 'SECTION D — ADDITIONAL HOUSEHOLD MEMBERS', y) - 8
    members.forEach((m, i) => {
      ctx.page.drawText(`Person ${i + 2}: ${m.name || '—'}  |  DOB: ${m.dob || '—'}  |  Relationship: ${m.rel || '—'}`, { x: 32, y, font: ctx.font, size: 9, color: ctx.rgb(0.1, 0.1, 0.1) })
      y -= 14
    })
    y -= 4
  }

  y = drawSection(ctx, 'SECTION F — EMPLOYMENT INCOME', y) - 8
  y = drawCheckbox(ctx, 'Someone in household is employed', fv('hasEmployment') === 'yes', 28, y)
  if (fv('hasEmployment') === 'yes') y = drawField(ctx, 'Gross Monthly Employment Income', fv('employmentIncome'), 28, y, 250)
  y -= 4

  y = drawSection(ctx, 'SECTION I — EXPENSES', y) - 8
  y = drawField(ctx, 'Monthly Rent/Mortgage', fv('rent') || '$0', 28, y, 200)
  drawField(ctx, 'Monthly Utilities', fv('utilities') || '$0', 240, y + 23, 180)
  drawField(ctx, 'Medical Expenses', fv('medical') || '$0', 432, y + 23, 148)
  y = drawField(ctx, 'Dependent Care Cost', fv('childcare') || '$0', 28, y, 200)
  y -= 8

  ctx.page.drawText('I declare that the information provided is true and correct.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, `Form H1010 (04/2024) · Texas HHSC · Benefits: ${benefits} · Prepared by HazloAsíYa.com`)

  const bytes = await doc.save()
  return { id: 'h1010', name: 'Form H1010', description: 'Texas Benefits Application (SNAP / Medicaid / CHIP / TANF)', bytes }
}

async function generateI9(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  const statusMap: Record<string, string> = {
    citizen:  'A citizen of the United States',
    national: 'A noncitizen national of the United States',
    pr:       'A lawful permanent resident',
    alien:    'An alien authorized to work',
  }

  let y = drawHeader(ctx, 'FORM I-9 (Ed. 01/20/25)', 'Employment Eligibility Verification', 'USCIS · Department of Homeland Security · Do NOT file with USCIS or ICE')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'SECTION 1 — EMPLOYEE INFORMATION AND ATTESTATION', y) - 8
  y = drawField(ctx, 'Last Name (Family Name)', fv('lastName'), 28, y, 200)
  drawField(ctx, 'First Name (Given Name)', fv('firstName'), 240, y + 23, 200)
  drawField(ctx, 'Middle Initial', fv('middleName') ? fv('middleName')[0] : 'N/A', 452, y + 23, 136)
  y = drawField(ctx, 'Other Last Names Used', fv('otherLastName') || 'N/A', 28, y, 200)
  y = drawField(ctx, 'Street Address', fv('streetAddr'), 28, y, 300)
  y = drawField(ctx, 'City', fv('city'), 28, y, 200)
  drawField(ctx, 'State / ZIP', fv('stateZip'), 240, y + 23, 200)
  y = drawField(ctx, 'Date of Birth', fv('dob'), 28, y, 200)
  drawField(ctx, 'SSN', fv('ssn'), 240, y + 23, 200)
  drawField(ctx, 'Email', fv('email'), 452, y + 23, 136)
  y = drawField(ctx, 'Phone', fv('phone'), 28, y, 200)
  y -= 8

  y = drawSection(ctx, 'ATTESTATION — Check one', y) - 8
  ;(['citizen', 'national', 'pr', 'alien'] as const).forEach(k => {
    y = drawCheckbox(ctx, statusMap[k], fv('workStatus') === k, 28, y)
  })

  if (fv('workStatus') === 'pr') {
    y -= 4
    y = drawField(ctx, 'A-Number / USCIS Number', fv('aNumber'), 28, y, 300)
  }
  if (fv('workStatus') === 'alien') {
    y -= 4
    y = drawField(ctx, 'Authorization Expiration Date', fv('authExpiry') || 'N/A - Does not expire', 28, y, 250)
    drawField(ctx, 'I-94 Number', fv('i94') || '', 290, y + 23, 200)
    y = drawField(ctx, 'USCIS/A-Number', fv('uscisNum') || '', 28, y, 200)
    drawField(ctx, 'Foreign Passport + Country', fv('foreignPassport') || '', 240, y + 23, 348)
    y -= 4
  }

  y = drawSection(ctx, 'SECTION 2 — EMPLOYER (completed by employer on first day)', y) - 8
  ctx.page.drawRectangle({ x: 24, y: y - 40, width: 564, height: 40, color: ctx.rgb(0.96, 0.97, 0.99), borderColor: ctx.rgb(0.7, 0.75, 0.85), borderWidth: 1 })
  ctx.page.drawText('Employer examines documents and completes this section. Employee does not fill this in.', { x: 32, y: y - 20, font: ctx.font, size: 8, color: ctx.rgb(0.4, 0.4, 0.6) })
  y -= 50

  ctx.page.drawText('I attest, under penalty of perjury, that I am aware that federal law provides for imprisonment and/or fines for false statements or false documents.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2), maxWidth: 560, lineHeight: 11 })
  y -= 28
  drawSignature(ctx, y)
  drawFooter(ctx, 'Form I-9 · Ed. 01/20/25 · USCIS · Prepared by HazloAsíYa.com · Retain with employer — do NOT file with USCIS')

  const bytes = await doc.save()
  return { id: 'i9', name: 'Form I-9', description: 'Employment Eligibility Verification — Section 1 (Employee)', bytes }
}

async function generateDL14A(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  const appMap: Record<string, string> = { orig: 'Original', ren: 'Renewal', rep: 'Replacement', chg: 'Address or Name Change' }

  let y = drawHeader(ctx, 'FORM DL-14A (Rev. 8/2025)', 'Texas Driver License or Identification Card Application', 'Texas Department of Public Safety (DPS) · Adult — 17 years 10 months and older')
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'APPLICATION TYPE', y) - 8
  y = drawCheckbox(ctx, 'Driver License', fv('dt') === 'dl', 28, y)
  y = drawCheckbox(ctx, 'Identification Card (No driving privileges)', fv('dt') === 'id', 28, y)
  y -= 4
  ;(['orig', 'ren', 'rep', 'chg'] as const).forEach(k => { y = drawCheckbox(ctx, appMap[k], fv('at') === k, 200, y) })
  y -= 8

  y = drawSection(ctx, 'PERSONAL INFORMATION', y) - 8
  y = drawField(ctx, 'Last Name', fv('ln'), 28, y, 200)
  drawField(ctx, 'First Name', fv('fn'), 240, y + 23, 180)
  drawField(ctx, 'Middle Name', fv('mn'), 432, y + 23, 148)
  y = drawField(ctx, 'Suffix', fv('sfx'), 28, y, 80)
  drawField(ctx, 'Birth Surname / Maiden Name', fv('maiden'), 120, y + 23, 460)
  y = drawField(ctx, 'Social Security Number', fv('ssn'), 28, y, 200)
  drawField(ctx, 'Date of Birth (mm/dd/yyyy)', fv('dob'), 240, y + 23, 180)
  drawField(ctx, 'Sex', fv('sex') === 'M' ? 'Male' : fv('sex') === 'F' ? 'Female' : '', 432, y + 23, 148)
  y = drawField(ctx, "Height (Ft'  In\")", `${fv('hft') || '?'}' ${fv('hin') || '?'}"`, 28, y, 160)
  drawField(ctx, 'Weight (lbs)', fv('wt'), 200, y + 23, 120)
  y -= 4

  y = drawSection(ctx, 'ADDRESS IN TEXAS', y) - 8
  y = drawField(ctx, 'Street Address / Apt / Suite', fv('str'), 28, y, 400)
  y = drawField(ctx, 'City', fv('cty'), 28, y, 200)
  drawField(ctx, 'County', fv('cnty'), 240, y + 23, 160)
  drawField(ctx, 'ZIP Code', fv('zip'), 412, y + 23, 130)
  y -= 4

  y = drawSection(ctx, 'CITIZENSHIP & MEDICAL HISTORY (Confidential)', y) - 8
  y = drawCheckbox(ctx, 'Yes — U.S. Citizen', fv('cit') === 'y', 28, y)
  y = drawCheckbox(ctx, 'No — Non-citizen with lawful presence', fv('cit') === 'n', 28, y)
  y -= 4
  y = drawCheckbox(ctx, 'No medical condition affecting ability to operate a motor vehicle', fv('med') === 'n', 28, y)
  y = drawCheckbox(ctx, 'Yes — medical condition exists (reviewed by DPS)', fv('med') === 'y', 28, y)
  y -= 8

  y = drawSection(ctx, 'DOCUMENTS CHECKLIST — Bring originals to DPS appointment (txdpsscheduler.com)', y) - 8
  const docs = [
    [data.dp,   'Cat. 1 Identity: U.S. Passport'],
    [data['db_'], 'Cat. 1 Identity: U.S. Certified Birth Certificate'],
    [data.dgc,  'Cat. 1 Identity: Permanent Resident Card (I-551)'],
    [data.dead, 'Cat. 1 Identity: Employment Authorization Document (EAD)'],
    [data.di94, 'Cat. 1 Identity: Foreign Passport + I-94 + Work Auth'],
    [data.dss,  'Cat. 2 SSN: Social Security Card (original)'],
    [data.dw2,  'Cat. 2 SSN: W-2 or 1099 showing SSN'],
    [data.dut,  'Cat. 3 TX Residency #1: Utility Bill'],
    [data.dls,  'Cat. 3 TX Residency #2: Lease or Mortgage Statement'],
    [data.dbk,  'Cat. 3 TX Residency (alt): Bank Statement'],
  ].filter((d): d is [unknown, string] => Boolean(d[0]))
  docs.forEach(d => { ctx.page.drawText(`✓ ${d[1]}`, { x: 32, y, font: ctx.font, size: 9, color: ctx.rgb(0.03, 0.34, 0.29) }); y -= 13 })
  y -= 8

  ctx.page.drawText('I certify that the information I have given is true, complete, and correct.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'DL-14A (Rev. 8/2025) · Texas DPS · Prepared by HazloAsíYa.com · Present at txdpsscheduler.com appointment')

  const bytes = await doc.save()
  return { id: 'dl14a', name: 'DL-14A Pre-llenado', description: 'Texas Driver License / ID Application + Checklist de documentos', bytes }
}

async function generateMatricula(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  const consMap: Record<string, string> = {
    hou: 'Houston — 4200 Montrose Blvd, Houston TX 77006 · (713) 271-6800',
    aus: 'Austin — Round Rock, TX',
    dal: 'Dallas — 1210 River Bend Dr, Dallas TX 75247',
  }

  let y = drawHeader(ctx, 'MATRÍCULA CONSULAR — SRE', 'Solicitud de Matrícula Consular de Alta Seguridad (MCAS)', 'Secretaría de Relaciones Exteriores · ' + (consMap[fv('cons')] || 'Consulado General de México'))
  y = drawNotice(ctx, y)

  y = drawSection(ctx, 'CONSULADO Y TIPO DE TRÁMITE', y) - 8
  y = drawField(ctx, 'Consulado', consMap[fv('cons')] || '', 28, y, 560)
  y = drawField(ctx, 'Tipo de trámite', ({ nueva: 'Nueva Matrícula', ren: 'Renovación', rep: 'Reposición' } as Record<string, string>)[fv('mt')] || '', 28, y, 300)
  y -= 4

  y = drawSection(ctx, 'DATOS DEL SOLICITANTE', y) - 8
  y = drawField(ctx, 'Primer nombre', fv('fn'), 28, y, 180)
  drawField(ctx, 'Segundo nombre', fv('mn'), 220, y + 23, 140)
  y = drawField(ctx, 'Primer apellido (paterno)', fv('ln'), 28, y, 200)
  drawField(ctx, 'Segundo apellido (materno)', fv('ln2'), 240, y + 23, 200)
  y = drawField(ctx, 'Fecha de nacimiento', fv('dob'), 28, y, 200)
  drawField(ctx, 'Lugar de nacimiento', fv('bp'), 240, y + 23, 340)
  y = drawField(ctx, 'CURP', fv('curp'), 28, y, 300)
  y = drawField(ctx, 'Teléfono', fv('phone'), 28, y, 200)
  drawField(ctx, 'Email', fv('email'), 240, y + 23, 340)
  y -= 4

  y = drawSection(ctx, 'DOMICILIO EN ESTADOS UNIDOS', y) - 8
  y = drawField(ctx, 'Calle, número y apartamento', fv('str'), 28, y, 400)
  y = drawField(ctx, 'Ciudad', fv('cty'), 28, y, 200)
  drawField(ctx, 'Estado', fv('st'), 240, y + 23, 80)
  drawField(ctx, 'ZIP Code', fv('zip'), 332, y + 23, 100)
  y -= 4

  y = drawSection(ctx, 'DOCUMENTOS A PRESENTAR — Originales, buen estado, SIN laminar', y) - 8
  const dm = [
    [data.m_acta, 'Nacionalidad: Acta de nacimiento mexicana (original o copia certificada)'],
    [data.m_pas,  'Nacionalidad: Pasaporte mexicano (vigente o vencido)'],
    [data.m_nat,  'Nacionalidad: Carta de naturalización'],
    [data.m_ine,  'Identidad: Credencial para votar INE/IFE vigente'],
    [data.m_lic,  'Identidad: Licencia de conducir (mexicana o de EE.UU.)'],
    [data.m_uti,  'Domicilio: Recibo de servicios (máx. 3 meses)'],
    [data.m_rent, 'Domicilio: Contrato de renta con nombre y dirección'],
    [data.m_bank, 'Domicilio: Estado de cuenta bancario'],
  ].filter((d): d is [unknown, string] => Boolean(d[0]))
  dm.forEach(d => { ctx.page.drawText(`✓ ${d[1]}`, { x: 32, y, font: ctx.font, size: 9, color: ctx.rgb(0.03, 0.34, 0.29) }); y -= 13 })
  y -= 8;

  ([
    ['Cita previa',   'mexitel.sre.gob.mx o (713) 271-6800'],
    ['Costo',         '$33 USD — efectivo o money order'],
    ['Horario',       'Lunes a Viernes 8:00 AM – 5:00 PM'],
    ['Entrega',       'El mismo día con documentos completos'],
    ['Vigencia',      '5 años'],
    ['No se acepta',  'Documentos laminados o en mal estado'],
  ] as const).forEach(([k, v]) => {
    ctx.page.drawText(`${k}:`, { x: 28, y, font: ctx.fontB, size: 8.5, color: ctx.rgb(0.03, 0.34, 0.29) })
    ctx.page.drawText(v, { x: 160, y, font: ctx.font, size: 8.5, color: ctx.rgb(0.1, 0.1, 0.1) })
    y -= 14
  })
  y -= 8

  ctx.page.drawText('Bajo protesta de decir verdad, manifiesto que los datos y documentos son correctos y auténticos.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2), maxWidth: 560, lineHeight: 11 })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, 'Matrícula Consular Mexicana · SRE · Prepared by HazloAsíYa.com · No es documento oficial hasta ser aprobado por el Consulado')

  const bytes = await doc.save()
  return { id: 'matricula', name: 'Expediente Matrícula Consular', description: 'Resumen de solicitud + checklist · Consulado México Houston', bytes }
}

async function generateEscuela(data: Record<string, unknown>): Promise<GeneratedPdf> {
  const { PDFDocument } = await getPdfLib()
  const doc = await PDFDocument.create()
  const { ctx } = await makeCtx(doc)
  const fv = (k: string) => String(data[k] ?? '')

  let y = drawHeader(ctx, 'STUDENT ENROLLMENT PACKET 2026–2027', 'Paquete de Inscripción Escolar / Student Registration', `Texas Education Agency (TEA) · ${fv('dist') || 'HISD'} · Plyler v. Doe — All children have the right to public education in Texas`)
  y = drawNotice(ctx, y)

  ctx.page.drawRectangle({ x: 24, y: y - 26, width: 564, height: 22, color: ctx.rgb(0.93, 0.97, 0.95), borderColor: ctx.rgb(0.7, 0.85, 0.78), borderWidth: 1 })
  ctx.page.drawText('⚖️ Plyler v. Doe: Todo niño tiene derecho a educación pública en Texas sin importar estatus migratorio.', { x: 32, y: y - 16, font: ctx.fontB, size: 7.5, color: ctx.rgb(0.03, 0.34, 0.29) })
  y -= 36

  y = drawSection(ctx, 'SECCIÓN A — ESTUDIANTE / STUDENT INFORMATION', y) - 8
  y = drawField(ctx, 'Apellido / Last Name', fv('sln'), 28, y, 200)
  drawField(ctx, 'Primer nombre / First Name', fv('sfn'), 240, y + 23, 180)
  drawField(ctx, 'Segundo nombre', fv('smn'), 432, y + 23, 148)
  y = drawField(ctx, 'Fecha de nacimiento / DOB', fv('sdob'), 28, y, 180)
  drawField(ctx, 'Género / Gender', ({ F: 'Femenino/F', M: 'Masculino/M', X: 'No binario/X' } as Record<string, string>)[fv('sg')] || '', 220, y + 23, 100)
  drawField(ctx, 'Grado / Grade', fv('grd'), 332, y + 23, 80)
  drawField(ctx, 'Distrito / District', fv('dist'), 424, y + 23, 164)
  y = drawField(ctx, 'País de nacimiento / Country of Birth', fv('scob'), 28, y, 200)
  drawField(ctx, 'Idioma / Language', ({ es: 'Español/Spanish', en: 'Inglés/English', both: 'Bilingüe' } as Record<string, string>)[fv('slng')] || '', 240, y + 23, 200)
  y -= 4

  y = drawSection(ctx, 'SECCIÓN B — PADRE / GUARDIAN', y) - 8
  y = drawField(ctx, 'Nombre completo / Full Name', `${fv('fn')} ${fv('ln')}`, 28, y, 300)
  drawField(ctx, 'Relación / Relationship', fv('rel'), 340, y + 23, 248)
  y = drawField(ctx, 'Teléfono / Cell Phone', fv('phone'), 28, y, 200)
  drawField(ctx, 'Email', fv('email'), 240, y + 23, 340)
  y -= 4

  y = drawSection(ctx, 'SECCIÓN C — DOMICILIO / ADDRESS', y) - 8
  y = drawField(ctx, 'Calle y número / Street Address', fv('str'), 28, y, 400)
  y = drawField(ctx, 'Ciudad / City', fv('cty'), 28, y, 200)
  drawField(ctx, 'State', 'Texas', 240, y + 23, 80)
  drawField(ctx, 'ZIP Code', fv('zip'), 332, y + 23, 100)
  y -= 4

  y = drawSection(ctx, 'SECCIÓN D — CONTACTO DE EMERGENCIA', y) - 8
  y = drawField(ctx, 'Nombre / Name', fv('en'), 28, y, 260)
  drawField(ctx, 'Relación / Rel.', fv('er'), 300, y + 23, 140)
  drawField(ctx, 'Teléfono / Phone', fv('ep'), 452, y + 23, 136)
  y -= 4

  y = drawSection(ctx, 'SECCIÓN E — SALUD / HEALTH', y) - 8
  y = drawField(ctx, 'Alergias / Allergies', fv('allergy') || 'Ninguna/None', 28, y, 260)
  drawField(ctx, 'Medicamentos / Medications', fv('meds') || 'Ninguno/None', 300, y + 23, 288)
  y = drawField(ctx, 'Médico / Doctor', fv('doctor'), 28, y, 300)
  drawField(ctx, 'Seguro / Insurance', ({ none: 'Sin seguro', medicaid: 'Medicaid/CHIP', private: 'Privado' } as Record<string, string>)[fv('ins')] || 'Sin seguro', 340, y + 23, 248)
  y -= 4

  y = drawSection(ctx, 'SECCIÓN F — DOCUMENTOS / CHECKLIST', y) - 8
  const sds: [unknown, string, string][] = [
    [data.sch_bc,   'Acta de nacimiento / Birth Certificate (any country)', 'Required'],
    [data.sch_vx,   'Vacunas / Immunization Records',                       'Required'],
    [data.sch_addr, 'Comprobante de domicilio / Proof of Address',           'Required'],
    [data.sch_id,   'ID del guardián / Guardian Photo ID',                   'Recommended'],
    [data.sch_rec,  'Expediente escolar anterior / Previous School Records', 'If applicable'],
  ]
  sds.forEach(d => {
    ctx.page.drawText(`${d[0] ? '✅' : '⬜'} ${d[1]}`, { x: 32, y, font: ctx.font, size: 9, color: d[0] ? ctx.rgb(0.03, 0.34, 0.29) : ctx.rgb(0.3, 0.3, 0.3) })
    ctx.page.drawText(d[2], { x: 450, y, font: ctx.fontB, size: 8, color: d[0] ? ctx.rgb(0.03, 0.34, 0.29) : ctx.rgb(0.55, 0.2, 0.1) })
    y -= 13
  })
  y -= 8

  ctx.page.drawText('Certifico que la información es verdadera y completa. / I certify all information provided is true and complete.', { x: 28, y, font: ctx.font, size: 7.5, color: ctx.rgb(0.2, 0.2, 0.2) })
  y -= 26
  drawSignature(ctx, y)
  drawFooter(ctx, `Texas School Enrollment 2026–2027 · ${fv('dist') || 'HISD'} · Prepared by HazloAsíYa.com · Plyler v. Doe`)

  const bytes = await doc.save()
  return { id: 'escuela', name: 'Paquete Inscripción Escolar', description: `${fv('dist') || 'HISD'} · ${fv('sfn')} ${fv('sln')} · 2026-2027`, bytes }
}

// ── Main dispatcher ───────────────────────────────────────────
export async function generatePdf(
  formId: PdfFormId,
  data: Record<string, unknown>
): Promise<GeneratedPdf> {
  switch (formId) {
    case 'i821d':    return generateI821D(data)
    case 'i765':     return generateI765(data)
    case 'w7':       return generateW7(data)
    case 'h1010':    return generateH1010(data)
    case 'w4':       return generateW4(data)
    case 'i9':       return generateI9(data)
    case 'dl14a':    return generateDL14A(data)
    case 'matricula':return generateMatricula(data)
    case 'escuela':  return generateEscuela(data)
    default:         throw new Error(`Unknown form: ${formId}`)
  }
}

// ── Download helper (client-side) ─────────────────────────────
export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
