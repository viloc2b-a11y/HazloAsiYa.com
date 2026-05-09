/**
 * LDSS-2921 — New York State Application for Certain Benefits and Services
 * Covers: SNAP (Food Stamps), Medicaid, Family Assistance (FA), Safety Net Assistance (SNA)
 * Agency: NY Office of Temporary and Disability Assistance (OTDA) / HRA
 * Portal: myBenefits.ny.gov | Phone: 1-800-342-3009
 *
 * The official PDF is a scanned document without AcroForm fields.
 * This mapper generates a high-fidelity visual replica using pdf-lib.
 * Strategy: VISUAL_ONLY — generates a pre-filled reference document.
 */

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib'

export interface Ldss2921FormData {
  // Programs applying for
  programs: {
    snap: boolean
    medicaid: boolean
    familyAssistance: boolean
    safetyNet: boolean
    childCare: boolean
  }
  // Applicant
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn?: string
  gender?: 'male' | 'female' | 'other'
  // Contact
  phone: string
  email?: string
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
  // Citizenship
  citizenshipStatus: 'citizen' | 'permanent_resident' | 'daca' | 'tps' | 'other'
  // Special conditions
  isPregnant?: boolean
  dueDateOrRecentBirth?: string
  isHomeless?: boolean
  isDisabled?: boolean
  // Expedited SNAP
  expeditedSnap?: boolean
  expeditedReason?: string
  // Signature
  signatureDate: string
  // Delivery
  preferredDelivery: 'in_person' | 'mail' | 'online'
}

const NY_BLUE = rgb(0.098, 0.271, 0.549)   // NY State blue
const NY_GOLD = rgb(0.847, 0.647, 0.0)     // NY State gold
const DARK = rgb(0.1, 0.1, 0.1)
const MID = rgb(0.4, 0.4, 0.4)
const LIGHT_GRAY = rgb(0.95, 0.95, 0.95)
const WHITE = rgb(1, 1, 1)
const GREEN = rgb(0.133, 0.545, 0.133)
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
    drawText(page, '✓', x + 1, y + 1, font, 9, GREEN)
  }
  drawText(page, label, x + 14, y + 1, font, 8, DARK)
}

function formatSSN(ssn?: string): string {
  if (!ssn) return '***-**-****'
  const clean = ssn.replace(/\D/g, '')
  if (clean.length === 9) return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`
  return ssn
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function citizenshipLabel(status: string): string {
  const map: Record<string, string> = {
    citizen: 'Ciudadano/a de EE.UU.',
    permanent_resident: 'Residente Permanente (Green Card)',
    daca: 'DACA / Deferred Action',
    tps: 'TPS / Temporary Protected Status',
    other: 'Otro estatus migratorio',
  }
  return map[status] || status
}

export async function generateLdss2921Pdf(data: Ldss2921FormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  const W = 612
  const H = 792
  const M = 36  // margin

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 1 — Header + Programs + Personal Info + Household
  // ─────────────────────────────────────────────────────────────────────────
  const page1 = pdfDoc.addPage([W, H])

  // NY State header bar
  drawRect(page1, 0, H - 52, W, 52, NY_BLUE)
  drawText(page1, 'NEW YORK STATE', M, H - 18, helveticaBold, 11, WHITE)
  drawText(page1, 'Office of Temporary and Disability Assistance (OTDA)', M, H - 30, helvetica, 7.5, rgb(0.8, 0.9, 1))
  drawText(page1, 'LDSS-2921 (Rev. 2024)', W - 130, H - 18, helvetica, 8, rgb(0.8, 0.9, 1))
  drawText(page1, 'myBenefits.ny.gov | 1-800-342-3009', W - 175, H - 30, helvetica, 7, rgb(0.7, 0.85, 1))

  // Gold accent bar
  drawRect(page1, 0, H - 56, W, 4, NY_GOLD)

  // Title
  drawText(page1, 'SOLICITUD PARA CIERTOS BENEFICIOS Y SERVICIOS', M, H - 74, helveticaBold, 13, NY_BLUE)
  drawText(page1, 'Application for Certain Benefits and Services', M, H - 87, helvetica, 9, MID)

  // Pre-filled notice
  drawBorderedBox(page1, M, H - 118, W - 2 * M, 26, rgb(0.95, 1, 0.95), rgb(0.4, 0.8, 0.4))
  drawText(page1, '✓ FORMULARIO PRE-LLENADO POR HAZLOASÍYA — Revise todos los campos antes de firmar y entregar', M + 6, H - 100, helveticaBold, 8, GREEN)
  drawText(page1, 'HazloAsíYa NO es una agencia gubernamental. Este documento es un borrador orientativo.', M + 6, H - 111, helvetica, 7, MID)

  // ── SECTION A: Programs ──────────────────────────────────────────────────
  let y = H - 140
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page1, 'SECCIÓN A — PROGRAMAS SOLICITADOS', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 26

  const programRow1 = [
    { key: 'snap', label: 'SNAP (Cupones de Comida / Food Stamps)' },
    { key: 'medicaid', label: 'Medicaid (Seguro Médico)' },
    { key: 'familyAssistance', label: 'Family Assistance (FA)' },
  ]
  const programRow2 = [
    { key: 'safetyNet', label: 'Safety Net Assistance (SNA)' },
    { key: 'childCare', label: 'Child Care (Cuidado Infantil)' },
  ]

  programRow1.forEach((p, i) => {
    drawCheckbox(page1, data.programs[p.key as keyof typeof data.programs] as boolean, M + i * 185, y, p.label, helvetica)
  })
  y -= 18
  programRow2.forEach((p, i) => {
    drawCheckbox(page1, data.programs[p.key as keyof typeof data.programs] as boolean, M + i * 185, y, p.label, helvetica)
  })

  // ── SECTION B: Personal Information ─────────────────────────────────────
  y -= 28
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page1, 'SECCIÓN B — INFORMACIÓN PERSONAL DEL SOLICITANTE', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  const colW = (W - 2 * M - 12) / 3
  drawField(page1, 'Apellido (Last Name)', data.lastName, M, y, colW, helvetica, helveticaBold)
  drawField(page1, 'Nombre (First Name)', data.firstName, M + colW + 6, y, colW, helvetica, helveticaBold)
  drawField(page1, 'Fecha de Nacimiento (DOB)', data.dateOfBirth, M + 2 * (colW + 6), y, colW, helvetica, helveticaBold)
  y -= 30

  const colW2 = (W - 2 * M - 8) / 2
  drawField(page1, 'Número de Seguro Social (SSN)', formatSSN(data.ssn), M, y, colW2, helvetica, helveticaBold)
  drawField(page1, 'Teléfono (Phone)', data.phone, M + colW2 + 8, y, colW2, helvetica, helveticaBold)
  y -= 30

  drawField(page1, 'Estatus Migratorio (Immigration Status)', citizenshipLabel(data.citizenshipStatus), M, y, W - 2 * M, helvetica, helveticaBold)
  y -= 30

  // ── SECTION C: Address ───────────────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page1, 'SECCIÓN C — DIRECCIÓN / ADDRESS', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  const addrW = (W - 2 * M - 8) * 0.6
  const aptW = (W - 2 * M - 8) * 0.15
  const zipW = (W - 2 * M - 8) * 0.25 - 8
  drawField(page1, 'Dirección (Street Address)', data.streetAddress, M, y, addrW, helvetica, helveticaBold)
  drawField(page1, 'Apt/Unit', data.apt || '', M + addrW + 4, y, aptW, helvetica, helveticaBold)
  drawField(page1, 'ZIP Code', data.zip, M + addrW + aptW + 8, y, zipW, helvetica, helveticaBold)
  y -= 30

  const cityW = (W - 2 * M - 8) * 0.45
  const countyW = (W - 2 * M - 8) * 0.55 - 8
  drawField(page1, 'Ciudad (City)', data.city, M, y, cityW, helvetica, helveticaBold)
  drawField(page1, 'Condado (County)', data.county, M + cityW + 8, y, countyW, helvetica, helveticaBold)
  y -= 30

  // ── SECTION D: Household ─────────────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page1, 'SECCIÓN D — COMPOSICIÓN DEL HOGAR / HOUSEHOLD', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 28

  const hhW = (W - 2 * M - 8) / 2
  drawField(page1, 'Número de personas en el hogar', String(data.householdSize), M, y, hhW, helvetica, helveticaBold)
  drawField(page1, 'Ingreso mensual bruto total', formatCurrency(data.monthlyIncome), M + hhW + 8, y, hhW, helvetica, helveticaBold)
  y -= 30

  if (data.incomeSource) {
    drawField(page1, 'Fuente de ingresos (Income Source)', data.incomeSource, M, y, W - 2 * M, helvetica, helveticaBold)
    y -= 30
  }

  // ── SECTION E: Special Conditions ────────────────────────────────────────
  drawRect(page1, M, y - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page1, 'SECCIÓN E — CONDICIONES ESPECIALES', M + 4, y + 4, helveticaBold, 9, WHITE)
  y -= 26

  drawCheckbox(page1, !!data.isPregnant, M, y, 'Embarazada / Pregnant', helvetica)
  drawCheckbox(page1, !!data.isHomeless, M + 200, y, 'Sin hogar fijo / Homeless', helvetica)
  drawCheckbox(page1, !!data.isDisabled, M + 380, y, 'Discapacidad / Disability', helvetica)
  y -= 20

  if (data.isPregnant && data.dueDateOrRecentBirth) {
    drawField(page1, 'Fecha probable de parto / Fecha de nacimiento reciente', data.dueDateOrRecentBirth, M, y, W - 2 * M, helvetica, helveticaBold)
    y -= 30
  }

  // ── SECTION F: Expedited SNAP ─────────────────────────────────────────────
  if (data.programs.snap) {
    y -= 4
    drawRect(page1, M, y - 2, W - 2 * M, 18, rgb(0.2, 0.5, 0.2))
    drawText(page1, 'SECCIÓN F — SNAP EXPEDITED (PROCESAMIENTO DE EMERGENCIA)', M + 4, y + 4, helveticaBold, 9, WHITE)
    y -= 26

    drawCheckbox(page1, !!data.expeditedSnap, M, y, 'Solicito procesamiento expedited — mi hogar tiene menos de $100 en efectivo o estamos en emergencia', helvetica)
    y -= 18

    if (data.expeditedSnap && data.expeditedReason) {
      drawField(page1, 'Razón de emergencia (Expedited Reason)', data.expeditedReason, M, y, W - 2 * M, helvetica, helveticaBold)
      y -= 30
    }
  }

  // ── Footer page 1 ─────────────────────────────────────────────────────────
  drawRect(page1, 0, 0, W, 36, NY_BLUE)
  drawText(page1, 'LDSS-2921 — Borrador pre-llenado por HazloAsíYa.com | NO es un documento oficial hasta ser firmado y aceptado por OTDA/HRA', M, 22, helvetica, 6.5, WHITE)
  drawText(page1, 'Página 1 de 2', W - 80, 22, helvetica, 7, rgb(0.8, 0.9, 1))

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 2 — Signature + Delivery Instructions + Document Checklist
  // ─────────────────────────────────────────────────────────────────────────
  const page2 = pdfDoc.addPage([W, H])

  // Header
  drawRect(page2, 0, H - 52, W, 52, NY_BLUE)
  drawText(page2, 'NEW YORK STATE — LDSS-2921', M, H - 18, helveticaBold, 11, WHITE)
  drawText(page2, 'Firma y Declaración / Signature and Declaration', M, H - 30, helvetica, 8, rgb(0.8, 0.9, 1))
  drawText(page2, 'Página 2 de 2', W - 80, H - 22, helvetica, 8, rgb(0.8, 0.9, 1))
  drawRect(page2, 0, H - 56, W, 4, NY_GOLD)

  // ── SECTION G: Declaration ────────────────────────────────────────────────
  let y2 = H - 80
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page2, 'SECCIÓN G — DECLARACIÓN Y FIRMA', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 30

  const declaration = [
    'Declaro bajo pena de perjurio que la información proporcionada en esta solicitud es verdadera y completa.',
    'Entiendo que si proporciono información falsa, puedo ser sujeto a sanciones civiles y penales.',
    'Autorizo al estado de Nueva York a verificar la información proporcionada con otras agencias.',
    'He leído y entiendo mis derechos y responsabilidades como solicitante de beneficios.',
  ]

  declaration.forEach((line, i) => {
    drawText(page2, `${i + 1}. ${line}`, M, y2, helvetica, 7.5, DARK)
    y2 -= 13
  })

  y2 -= 10
  // Signature line
  drawBorderedBox(page2, M, y2 - 30, W - 2 * M - 120, 30, LIGHT_GRAY, rgb(0.7, 0.7, 0.7))
  drawText(page2, 'Firma del Solicitante (Applicant Signature)', M + 4, y2 - 8, helvetica, 7, MID)
  drawText(page2, `${data.firstName} ${data.lastName}`, M + 4, y2 - 22, helveticaOblique, 11, NY_BLUE)

  drawBorderedBox(page2, W - M - 110, y2 - 30, 110, 30, LIGHT_GRAY, rgb(0.7, 0.7, 0.7))
  drawText(page2, 'Fecha (Date)', W - M - 106, y2 - 8, helvetica, 7, MID)
  drawText(page2, data.signatureDate, W - M - 106, y2 - 22, helveticaBold, 10, DARK)

  y2 -= 50

  // ── SECTION H: Document Checklist ────────────────────────────────────────
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, rgb(0.2, 0.5, 0.2))
  drawText(page2, 'SECCIÓN H — DOCUMENTOS REQUERIDOS / Required Documents', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 26

  const requiredDocs = [
    { doc: 'Identificación con foto (ID, pasaporte, licencia de conducir)', required: true },
    { doc: 'Comprobante de domicilio en Nueva York (factura de servicios, contrato de arrendamiento)', required: true },
    { doc: 'Comprobante de ingresos (talones de pago, carta del empleador, estado de cuenta bancario)', required: true },
    { doc: 'Número de Seguro Social (SSN) o ITIN para cada miembro que aplica', required: true },
    { doc: 'Documentos de inmigración (si aplica: green card, EAD, I-94, etc.)', required: data.citizenshipStatus !== 'citizen' },
    { doc: 'Documentación médica de embarazo o discapacidad (si aplica)', required: !!(data.isPregnant || data.isDisabled) },
  ]

  requiredDocs.forEach((item) => {
    if (item.required) {
      drawText(page2, '☐', M, y2, helveticaBold, 10, RED)
      drawText(page2, item.doc, M + 16, y2, helvetica, 8, DARK)
      y2 -= 16
    }
  })

  y2 -= 10

  // ── SECTION I: Delivery Instructions ─────────────────────────────────────
  drawRect(page2, M, y2 - 2, W - 2 * M, 18, NY_BLUE)
  drawText(page2, 'SECCIÓN I — CÓMO ENTREGAR ESTA SOLICITUD', M + 4, y2 + 4, helveticaBold, 9, WHITE)
  y2 -= 26

  const deliveryOptions = [
    {
      icon: '🌐',
      title: 'En línea (Recomendado)',
      detail: 'myBenefits.ny.gov — Disponible 24/7',
      highlight: data.preferredDelivery === 'online',
    },
    {
      icon: '📞',
      title: 'Por teléfono',
      detail: '1-800-342-3009 · Lun–Vie 8am–5pm · Español disponible',
      highlight: false,
    },
    {
      icon: '🏢',
      title: 'En persona',
      detail: 'Oficina HRA local o Community Partner de OTDA',
      highlight: data.preferredDelivery === 'in_person',
    },
    {
      icon: '📬',
      title: 'Por correo',
      detail: 'Envíe a su oficina del Departamento de Servicios Sociales del condado',
      highlight: data.preferredDelivery === 'mail',
    },
  ]

  deliveryOptions.forEach((opt) => {
    const bgColor = opt.highlight ? rgb(0.9, 0.97, 0.9) : LIGHT_GRAY
    const borderColor = opt.highlight ? rgb(0.3, 0.7, 0.3) : rgb(0.8, 0.8, 0.8)
    drawBorderedBox(page2, M, y2 - 24, W - 2 * M, 24, bgColor, borderColor)
    drawText(page2, `${opt.icon}  ${opt.title}`, M + 6, y2 - 8, helveticaBold, 8.5, opt.highlight ? GREEN : DARK)
    drawText(page2, opt.detail, M + 6, y2 - 19, helvetica, 7.5, MID)
    y2 -= 30
  })

  y2 -= 10

  // ── Important notes ───────────────────────────────────────────────────────
  drawBorderedBox(page2, M, y2 - 50, W - 2 * M, 50, rgb(1, 0.97, 0.9), rgb(0.9, 0.7, 0.3))
  drawText(page2, '⚠ IMPORTANTE — Próximos pasos', M + 6, y2 - 10, helveticaBold, 9, rgb(0.6, 0.3, 0))
  const notes = [
    '• Recibirá una respuesta en 30 días (7 días si califica para procesamiento expedited).',
    '• Si no recibe respuesta, llame al 1-800-342-3009 para verificar el estado de su solicitud.',
    '• Guarde una copia de esta solicitud y todos los documentos entregados.',
  ]
  notes.forEach((note, i) => {
    drawText(page2, note, M + 6, y2 - 24 - i * 11, helvetica, 7.5, DARK)
  })

  // Footer
  drawRect(page2, 0, 0, W, 36, NY_BLUE)
  drawText(page2, 'LDSS-2921 — Borrador pre-llenado por HazloAsíYa.com | NO es un documento oficial hasta ser firmado y aceptado por OTDA/HRA', M, 22, helvetica, 6.5, WHITE)
  drawText(page2, `Generado: ${new Date().toLocaleDateString('es-US')}`, W - 110, 22, helvetica, 7, rgb(0.8, 0.9, 1))

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
