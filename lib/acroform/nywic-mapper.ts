/**
 * NY WIC Application — New York State WIC Program
 * Agency: NY State Department of Health (NYSDOH) — Bureau of Child and Adolescent Health
 * Portal: health.ny.gov/wic | Phone: 1-800-522-5006 | NYC: 311
 *
 * WIC in NY does not have a downloadable fillable PDF application.
 * Applications are completed in person at a local WIC agency.
 * This mapper generates a pre-filled reference document that participants
 * bring to their WIC appointment with their data already organized.
 * Strategy: VISUAL_ONLY
 */

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib'

export interface NyWicFormData {
  // Participant type
  participantType: 'pregnant' | 'postpartum' | 'breastfeeding' | 'infant' | 'child'
  // Applicant / Guardian
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  email?: string
  // Guardian (for infant/child)
  guardianName?: string
  guardianRelationship?: string
  // Address
  streetAddress: string
  apt?: string
  city: string
  state: string
  zip: string
  county: string
  // Household
  householdSize: number
  monthlyIncome: number
  incomeSource?: string
  // Health info
  isPregnant?: boolean
  dueDate?: string
  recentBirthDate?: string
  childName?: string
  childDob?: string
  // Current programs (auto-qualify)
  receivesMedicaid?: boolean
  receivesSnap?: boolean
  receivesTanf?: boolean
  // Language preference
  preferredLanguage: string
  // Signature
  signatureDate: string
}

const NY_GREEN = rgb(0.0, 0.502, 0.251)   // NY WIC green
const NY_BLUE = rgb(0.098, 0.271, 0.549)
const DARK = rgb(0.1, 0.1, 0.1)
const MID = rgb(0.4, 0.4, 0.4)
const LIGHT_GRAY = rgb(0.95, 0.95, 0.95)
const WHITE = rgb(1, 1, 1)
const CHECK_GREEN = rgb(0.133, 0.545, 0.133)
const RED = rgb(0.8, 0.1, 0.1)

function drawRect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y, width: w, height: h, color })
}

function drawBorderedBox(page: PDFPage, x: number, y: number, w: number, h: number, fillColor: ReturnType<typeof rgb>, borderColor: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y, width: w, height: h, color: fillColor, borderColor, borderWidth: 0.5 })
}

function drawText(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color: ReturnType<typeof rgb> = DARK) {
  page.drawText(text, { x, y, font, size, color })
}

function drawField(page: PDFPage, label: string, value: string, x: number, y: number, w: number, labelFont: PDFFont, valueFont: PDFFont) {
  drawBorderedBox(page, x, y - 22, w, 22, LIGHT_GRAY, rgb(0.7, 0.7, 0.7))
  drawText(page, label, x + 4, y - 8, labelFont, 6, MID)
  drawText(page, value || '—', x + 4, y - 18, valueFont, 9, DARK)
}

function drawCheckbox(page: PDFPage, checked: boolean, x: number, y: number, label: string, font: PDFFont) {
  page.drawRectangle({ x, y, width: 10, height: 10, color: WHITE, borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.75 })
  if (checked) {
    drawText(page, '✓', x + 1, y + 1, font, 9, CHECK_GREEN)
  }
  drawText(page, label, x + 14, y + 1, font, 8, DARK)
}

function participantLabel(type: string): string {
  const map: Record<string, string> = {
    pregnant: 'Mujer Embarazada (Pregnant Woman)',
    postpartum: 'Madre Posparto (Postpartum — hasta 6 meses)',
    breastfeeding: 'Madre Lactante (Breastfeeding — hasta 12 meses)',
    infant: 'Bebé (Infant — hasta 12 meses)',
    child: 'Niño/a (Child — 1 a 5 años)',
  }
  return map[type] || type
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export async function generateNyWicPdf(data: NyWicFormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  const W = 612
  const H = 792
  const M = 36

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 1 — Header + Participant Info + Household + Health
  // ─────────────────────────────────────────────────────────────────────────
  const page1 = pdfDoc.addPage([W, H])

  // Header
  drawRect(page1, 0, H - 52, W, 52, NY_GREEN)
  drawText(page1, 'NEW YORK STATE WIC PROGRAM', M, H - 18, helveticaBold, 12, WHITE)
  drawText(page1, 'NY Dept. of Health — Bureau of Child and Adolescent Health', M, H - 30, helvetica, 7.5, rgb(0.85, 1, 0.85))
  drawText(page1, '1-800-522-5006 | health.ny.gov/wic', W - 165, H - 18, helvetica, 8, rgb(0.85, 1, 0.85))
  drawText(page1, 'NYC: 311 · Español disponible', W - 155, H - 30, helvetica, 7, rgb(0.75, 0.95, 0.75))

  // Gold accent
  drawRect(page1, 0, H - 56, W, 4, rgb(0.847, 0.647, 0.0))

  // Title
  drawText(page1, 'SOLICITUD DE PARTICIPACIÓN EN EL PROGRAMA WIC', M, H - 74, helveticaBold, 13, NY_GREEN)
  drawText(page1, 'Women, Infants, and Children — New York State', M, H - 87, helvetica, 9, MID)

  // Pre-filled notice
  drawBorderedBox(page1, M, H - 118, W - 2 * M, 26, rgb(0.95, 1, 0.95), rgb(0.4, 0.8, 0.4))
  drawText(page1, '✓ DOCUMENTO DE REFERENCIA PRE-LLENADO POR HAZLOASÍYA — Lleve este documento a su cita WIC', M + 6, H - 100, helveticaBold, 8, CHECK_GREEN)
  drawText(page1, 'La solicitud oficial se completa en persona en su agencia WIC local. HazloAsíYa NO es una agencia gubernamental.', M + 6, H - 111, helvetica, 7, MID)

  // ── SECTION A: Participant Type ───────────────────────────────────────────
  let y = H - 140
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page1, 'SECCIÓN A — TIPO DE PARTICIPANTE', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 26

  const types = ['pregnant', 'postpartum', 'breastfeeding', 'infant', 'child']
  types.forEach((t, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    drawCheckbox(page1, data.participantType === t, M + col * 185, y - row * 18, participantLabel(t), helvetica)
  })
  y -= 40

  // ── SECTION B: Personal Information ──────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page1, 'SECCIÓN B — INFORMACIÓN PERSONAL', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  const colW = (W - 2 * M - 12) / 3
  drawField(page1, 'Apellido (Last Name)', data.lastName, M, y, colW, helvetica, helveticaBold)
  drawField(page1, 'Nombre (First Name)', data.firstName, M + colW + 6, y, colW, helvetica, helveticaBold)
  drawField(page1, 'Fecha de Nacimiento (DOB)', data.dateOfBirth, M + 2 * (colW + 6), y, colW, helvetica, helveticaBold)
  y -= 30

  const colW2 = (W - 2 * M - 8) / 2
  drawField(page1, 'Teléfono (Phone)', data.phone, M, y, colW2, helvetica, helveticaBold)
  drawField(page1, 'Idioma preferido (Preferred Language)', data.preferredLanguage, M + colW2 + 8, y, colW2, helvetica, helveticaBold)
  y -= 30

  // Guardian (for infant/child)
  if (data.participantType === 'infant' || data.participantType === 'child') {
    if (data.guardianName) {
      drawField(page1, 'Nombre del padre/tutor (Guardian Name)', data.guardianName, M, y, colW2, helvetica, helveticaBold)
      drawField(page1, 'Relación (Relationship)', data.guardianRelationship || '', M + colW2 + 8, y, colW2, helvetica, helveticaBold)
      y -= 30
    }
    if (data.childName) {
      drawField(page1, 'Nombre del niño/bebé (Child Name)', data.childName, M, y, colW2, helvetica, helveticaBold)
      drawField(page1, 'Fecha de nacimiento del niño/a (Child DOB)', data.childDob || '', M + colW2 + 8, y, colW2, helvetica, helveticaBold)
      y -= 30
    }
  }

  // ── SECTION C: Address ────────────────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page1, 'SECCIÓN C — DIRECCIÓN / ADDRESS', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  const addrW = (W - 2 * M - 8) * 0.65
  const zipW = (W - 2 * M - 8) * 0.35 - 8
  drawField(page1, 'Dirección (Street Address)', `${data.streetAddress}${data.apt ? `, Apt ${data.apt}` : ''}`, M, y, addrW, helvetica, helveticaBold)
  drawField(page1, 'ZIP Code', data.zip, M + addrW + 8, y, zipW, helvetica, helveticaBold)
  y -= 30

  const cityW = (W - 2 * M - 8) * 0.5
  const countyW = (W - 2 * M - 8) * 0.5 - 8
  drawField(page1, 'Ciudad (City)', data.city, M, y, cityW, helvetica, helveticaBold)
  drawField(page1, 'Condado (County)', data.county, M + cityW + 8, y, countyW, helvetica, helveticaBold)
  y -= 30

  // ── SECTION D: Household & Income ────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page1, 'SECCIÓN D — HOGAR E INGRESOS / HOUSEHOLD & INCOME', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  drawField(page1, 'Número de personas en el hogar', String(data.householdSize), M, y, colW2, helvetica, helveticaBold)
  drawField(page1, 'Ingreso mensual bruto total', formatCurrency(data.monthlyIncome), M + colW2 + 8, y, colW2, helvetica, helveticaBold)
  y -= 30

  if (data.incomeSource) {
    drawField(page1, 'Fuente de ingresos', data.incomeSource, M, y, W - 2 * M, helvetica, helveticaBold)
    y -= 30
  }

  // Auto-qualify note
  if (data.receivesMedicaid || data.receivesSnap || data.receivesTanf) {
    drawBorderedBox(page1, M, y - 26, W - 2 * M, 26, rgb(0.9, 1, 0.9), rgb(0.3, 0.7, 0.3))
    drawText(page1, '✓ Califica automáticamente por ingresos:', M + 6, y - 8, helveticaBold, 8, CHECK_GREEN)
    const autoQual = []
    if (data.receivesMedicaid) autoQual.push('Medicaid')
    if (data.receivesSnap) autoQual.push('SNAP')
    if (data.receivesTanf) autoQual.push('TANF/FA')
    drawText(page1, autoQual.join(' · '), M + 6, y - 19, helvetica, 8, DARK)
    y -= 34
  }

  // ── SECTION E: Health Information ────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page1, 'SECCIÓN E — INFORMACIÓN DE SALUD', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 26

  if (data.isPregnant && data.dueDate) {
    drawField(page1, 'Fecha probable de parto (Due Date)', data.dueDate, M, y, colW2, helvetica, helveticaBold)
    y -= 30
  }
  if (data.recentBirthDate) {
    drawField(page1, 'Fecha de parto reciente (Recent Birth Date)', data.recentBirthDate, M, y, colW2, helvetica, helveticaBold)
    y -= 30
  }

  // Footer page 1
  drawRect(page1, 0, 0, W, 36, NY_GREEN)
  drawText(page1, 'NY WIC — Documento de referencia pre-llenado por HazloAsíYa.com | Solicitud oficial se completa en su agencia WIC local', M, 22, helvetica, 6.5, WHITE)
  drawText(page1, 'Página 1 de 2', W - 80, 22, helvetica, 7, rgb(0.85, 1, 0.85))

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 2 — Document Checklist + Agency Instructions + Signature
  // ─────────────────────────────────────────────────────────────────────────
  const page2 = pdfDoc.addPage([W, H])

  drawRect(page2, 0, H - 52, W, 52, NY_GREEN)
  drawText(page2, 'NEW YORK STATE WIC — Documentos y Próximos Pasos', M, H - 22, helveticaBold, 11, WHITE)
  drawText(page2, 'Página 2 de 2', W - 80, H - 22, helvetica, 8, rgb(0.85, 1, 0.85))
  drawRect(page2, 0, H - 56, W, 4, rgb(0.847, 0.647, 0.0))

  let y2 = H - 80

  // ── Documents ─────────────────────────────────────────────────────────────
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page2, 'DOCUMENTOS PARA SU CITA WIC', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 26

  const docs = [
    { doc: 'Identificación con foto (ID, pasaporte, matrícula consular)', required: true },
    { doc: 'Comprobante de domicilio en Nueva York (factura de servicios, contrato)', required: true },
    { doc: 'Comprobante de ingresos del último mes (talones de pago o carta del empleador)', required: !data.receivesMedicaid && !data.receivesSnap },
    { doc: 'Tarjeta de Medicaid o carta de aprobación de SNAP (si aplica — exime comprobante de ingresos)', required: !!(data.receivesMedicaid || data.receivesSnap) },
    { doc: 'Acta de nacimiento del bebé/niño (para participantes infant/child)', required: data.participantType === 'infant' || data.participantType === 'child' },
    { doc: 'Documentación médica de embarazo (para participantes embarazadas)', required: !!data.isPregnant },
    { doc: 'Número de Medicaid del niño/a (si lo tiene — acelera el proceso)', required: false },
  ]

  docs.forEach((item) => {
    const color = item.required ? RED : MID
    drawText(page2, '☐', M, y2, helveticaBold, 10, color)
    drawText(page2, `${item.required ? '[REQUERIDO] ' : '[OPCIONAL] '}${item.doc}`, M + 16, y2, helvetica, 8, DARK)
    y2 -= 16
  })

  y2 -= 10

  // ── Agency Instructions ───────────────────────────────────────────────────
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, NY_GREEN)
  drawText(page2, 'CÓMO ENCONTRAR SU AGENCIA WIC EN NUEVA YORK', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 26

  const agencies = [
    { icon: '📞', title: 'Línea WIC Nueva York', detail: '1-800-522-5006 · Lun–Vie · Español disponible' },
    { icon: '🌐', title: 'En línea', detail: 'health.ny.gov/wic — Busque agencias por código postal' },
    { icon: '🏙️', title: 'En la Ciudad de Nueva York', detail: '311 — Di "WIC" · Más de 100 clínicas en los 5 boroughs' },
    { icon: '📱', title: 'App WIC2Go', detail: 'Consulte su saldo eWIC, busque tiendas participantes y recetas' },
  ]

  agencies.forEach((a) => {
    drawBorderedBox(page2, M, y2 - 24, W - 2 * M, 24, LIGHT_GRAY, rgb(0.8, 0.8, 0.8))
    drawText(page2, `${a.icon}  ${a.title}`, M + 6, y2 - 8, helveticaBold, 8.5, NY_GREEN)
    drawText(page2, a.detail, M + 6, y2 - 19, helvetica, 7.5, MID)
    y2 -= 30
  })

  y2 -= 10

  // ── Signature ─────────────────────────────────────────────────────────────
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page2, 'CONFIRMACIÓN DE INFORMACIÓN', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 28

  drawText(page2, 'Confirmo que la información proporcionada en este documento es correcta y la llevaré a mi cita WIC.', M, y2, helvetica, 8, DARK)
  y2 -= 20

  drawBorderedBox(page2, M, y2 - 30, W - 2 * M - 120, 30, LIGHT_GRAY, rgb(0.7, 0.7, 0.7))
  drawText(page2, 'Nombre del Solicitante / Tutor', M + 4, y2 - 8, helvetica, 7, MID)
  drawText(page2, data.guardianName || `${data.firstName} ${data.lastName}`, M + 4, y2 - 22, helveticaOblique, 11, NY_GREEN)

  drawBorderedBox(page2, W - M - 110, y2 - 30, 110, 30, LIGHT_GRAY, rgb(0.7, 0.7, 0.7))
  drawText(page2, 'Fecha (Date)', W - M - 106, y2 - 8, helvetica, 7, MID)
  drawText(page2, data.signatureDate, W - M - 106, y2 - 22, helveticaBold, 10, DARK)

  y2 -= 50

  // ── Important note ────────────────────────────────────────────────────────
  drawBorderedBox(page2, M, y2 - 44, W - 2 * M, 44, rgb(1, 0.97, 0.9), rgb(0.9, 0.7, 0.3))
  drawText(page2, '⚠ RECUERDE', M + 6, y2 - 10, helveticaBold, 9, rgb(0.6, 0.3, 0))
  drawText(page2, '• La solicitud oficial de WIC se completa EN PERSONA en su agencia WIC local.', M + 6, y2 - 22, helvetica, 7.5, DARK)
  drawText(page2, '• Este documento es una guía de referencia para facilitar su cita. Llévelo con sus documentos originales.', M + 6, y2 - 33, helvetica, 7.5, DARK)

  // Footer
  drawRect(page2, 0, 0, W, 36, NY_GREEN)
  drawText(page2, 'NY WIC — Documento de referencia pre-llenado por HazloAsíYa.com | HazloAsíYa NO es una agencia gubernamental', M, 22, helvetica, 6.5, WHITE)
  drawText(page2, `Generado: ${new Date().toLocaleDateString('es-US')}`, W - 110, 22, helvetica, 7, rgb(0.85, 1, 0.85))

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
