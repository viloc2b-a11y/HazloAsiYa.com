/**
 * CA-WIC 100 — California WIC Application
 * Women, Infants and Children Program (CDPH / USDA)
 *
 * El California WIC no distribuye un PDF de solicitud descargable con AcroForm.
 * La aplicación oficial se realiza en persona en una agencia local WIC o en línea
 * en mybenefitscalwin.org / BenefitsCal.com.
 *
 * Este mapper genera un documento visual de 2 páginas que reproduce el formato
 * estándar de solicitud WIC de California, listo para llevar a la cita en la
 * agencia WIC local como referencia pre-llenada.
 *
 * Fuente oficial: https://www.cdph.ca.gov/Programs/CFH/DWICSN
 * Localizador de agencias: https://www.cdph.ca.gov/Programs/CFH/DWICSN/Pages/LocalAgencies.aspx
 */

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib'

export interface CaWic100Data {
  // Sección 1 — Tipo de solicitante
  applicantType: 'pregnant' | 'postpartum' | 'breastfeeding' | 'infant' | 'child' | ''
  dueDate?: string          // si está embarazada
  childDob?: string         // si es para un niño/infante

  // Sección 2 — Datos del participante
  participantLastName: string
  participantFirstName: string
  participantMiddleName?: string
  participantDob: string
  participantGender: 'F' | 'M' | 'X' | ''

  // Sección 3 — Datos del padre/tutor (si el participante es menor)
  guardianLastName?: string
  guardianFirstName?: string
  guardianRelationship?: string

  // Sección 4 — Contacto y dirección
  streetAddr: string
  unit?: string
  city: string
  county: string
  state: string
  zip: string
  phone: string
  altPhone?: string
  email?: string

  // Sección 5 — Elegibilidad por ingresos
  householdSize: string
  monthlyIncome: string
  incomeSource: string      // 'employment' | 'selfEmployment' | 'ssi' | 'none' | 'other'

  // Sección 6 — Estatus de residencia
  isUSCitizen: 'yes' | 'no' | ''
  immigrationStatus?: string

  // Sección 7 — Programas actuales
  onMediCal: boolean
  onCalFresh: boolean
  onCalWORKs: boolean

  // Sección 8 — Información de salud
  isBreastfeeding?: boolean
  infantAge?: string        // en meses, si aplica
  hasSpecialNeeds?: boolean
  specialNeedsDesc?: string

  // Sección 9 — Idioma preferido
  preferredLanguage: string

  // Firma
  signatureDate: string
}

// ─── Helpers de dibujo ────────────────────────────────────────────────────────

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size = 9,
  color = rgb(0.1, 0.1, 0.1)
) {
  page.drawText(text || '', { x, y, font, size, color })
}

function drawLabel(page: PDFPage, label: string, x: number, y: number, font: PDFFont) {
  page.drawText(label, { x, y, font, size: 7, color: rgb(0.45, 0.45, 0.45) })
}

function drawField(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  font: PDFFont,
  boldFont: PDFFont
) {
  drawLabel(page, label, x, y + 11, font)
  page.drawRectangle({ x, y, width, height: 14, borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.98) })
  drawText(page, value, x + 3, y + 3, boldFont, 8.5)
}

function drawCheckbox(
  page: PDFPage,
  label: string,
  checked: boolean,
  x: number,
  y: number,
  font: PDFFont
) {
  page.drawRectangle({ x, y, width: 9, height: 9, borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.6, color: rgb(1, 1, 1) })
  if (checked) {
    page.drawText('✓', { x: x + 1, y: y + 1, font, size: 8, color: rgb(0.1, 0.55, 0.2) })
  }
  page.drawText(label, { x: x + 13, y: y + 1, font, size: 8, color: rgb(0.15, 0.15, 0.15) })
}

function drawSectionHeader(
  page: PDFPage,
  title: string,
  x: number,
  y: number,
  width: number,
  font: PDFFont
) {
  page.drawRectangle({ x, y, width, height: 14, color: rgb(0.1, 0.45, 0.22) })
  page.drawText(title, { x: x + 5, y: y + 3, font, size: 8.5, color: rgb(1, 1, 1) })
}

// ─── Generador principal ──────────────────────────────────────────────────────

export async function generateCaWic100(data: CaWic100Data): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const W = 612
  const H = 792
  const MARGIN = 36
  const CONTENT_W = W - MARGIN * 2

  // ─── PÁGINA 1 ──────────────────────────────────────────────────────────────
  const page1 = pdfDoc.addPage([W, H])

  // Encabezado institucional
  page1.drawRectangle({ x: 0, y: H - 60, width: W, height: 60, color: rgb(0.1, 0.45, 0.22) })
  page1.drawText('CALIFORNIA WIC PROGRAM', { x: MARGIN, y: H - 25, font: boldFont, size: 14, color: rgb(1, 1, 1) })
  page1.drawText('Women, Infants and Children — Solicitud de Beneficios / Application for Benefits', {
    x: MARGIN, y: H - 42, font, size: 8.5, color: rgb(0.85, 1, 0.85)
  })
  page1.drawText('CDPH — California Department of Public Health', {
    x: W - 250, y: H - 25, font, size: 7.5, color: rgb(0.85, 1, 0.85)
  })
  page1.drawText('www.cdph.ca.gov/wic  |  1-800-852-5770', {
    x: W - 250, y: H - 38, font, size: 7, color: rgb(0.7, 0.95, 0.7)
  })

  // Aviso informativo
  page1.drawRectangle({ x: MARGIN, y: H - 90, width: CONTENT_W, height: 22, color: rgb(0.95, 0.98, 0.95), borderColor: rgb(0.1, 0.45, 0.22), borderWidth: 0.5 })
  page1.drawText(
    'Este documento es una referencia pre-llenada para tu cita WIC. Llévalo a tu agencia WIC local. La solicitud oficial se completa en persona.',
    { x: MARGIN + 5, y: H - 81, font, size: 7, color: rgb(0.1, 0.35, 0.15) }
  )

  let y = H - 115

  // ── Sección 1: Tipo de participante ──────────────────────────────────────
  drawSectionHeader(page1, '1. TIPO DE PARTICIPANTE / Participant Type', MARGIN, y, CONTENT_W, boldFont)
  y -= 22
  const types = [
    { key: 'pregnant', label: 'Embarazada / Pregnant' },
    { key: 'postpartum', label: 'Postparto / Postpartum (hasta 6 meses)' },
    { key: 'breastfeeding', label: 'Lactando / Breastfeeding (hasta 1 año)' },
    { key: 'infant', label: 'Infante / Infant (0–12 meses)' },
    { key: 'child', label: 'Niño/a / Child (1–5 años)' },
  ]
  let tx = MARGIN
  for (const t of types) {
    drawCheckbox(page1, t.label, data.applicantType === t.key, tx, y, font)
    tx += 110
    if (tx > W - 120) { tx = MARGIN; y -= 16 }
  }
  y -= 20

  if (data.applicantType === 'pregnant' && data.dueDate) {
    drawField(page1, 'Fecha probable de parto / Due Date', data.dueDate, MARGIN, y, 160, font, boldFont)
    y -= 30
  }
  if ((data.applicantType === 'infant' || data.applicantType === 'child') && data.childDob) {
    drawField(page1, 'Fecha de nacimiento del niño/a / Child DOB', data.childDob, MARGIN, y, 160, font, boldFont)
    y -= 30
  }

  // ── Sección 2: Datos del participante ────────────────────────────────────
  drawSectionHeader(page1, '2. DATOS DEL PARTICIPANTE / Participant Information', MARGIN, y, CONTENT_W, boldFont)
  y -= 28
  const nameW = (CONTENT_W - 10) / 3
  drawField(page1, 'Apellido / Last Name', data.participantLastName, MARGIN, y, nameW, font, boldFont)
  drawField(page1, 'Nombre / First Name', data.participantFirstName, MARGIN + nameW + 5, y, nameW, font, boldFont)
  drawField(page1, 'Segundo nombre / Middle', data.participantMiddleName || '', MARGIN + (nameW + 5) * 2, y, nameW, font, boldFont)
  y -= 30
  drawField(page1, 'Fecha de nacimiento / Date of Birth', data.participantDob, MARGIN, y, 140, font, boldFont)
  drawField(page1, 'Género / Gender', data.participantGender === 'F' ? 'Femenino / Female' : data.participantGender === 'M' ? 'Masculino / Male' : data.participantGender === 'X' ? 'No binario / Non-binary' : '', MARGIN + 150, y, 120, font, boldFont)
  y -= 30

  // ── Sección 3: Padre/Tutor ────────────────────────────────────────────────
  if (data.guardianFirstName || data.guardianLastName) {
    drawSectionHeader(page1, '3. PADRE / TUTOR / Parent or Guardian', MARGIN, y, CONTENT_W, boldFont)
    y -= 28
    const gW = (CONTENT_W - 10) / 3
    drawField(page1, 'Apellido / Last Name', data.guardianLastName || '', MARGIN, y, gW, font, boldFont)
    drawField(page1, 'Nombre / First Name', data.guardianFirstName || '', MARGIN + gW + 5, y, gW, font, boldFont)
    drawField(page1, 'Relación / Relationship', data.guardianRelationship || '', MARGIN + (gW + 5) * 2, y, gW, font, boldFont)
    y -= 30
  }

  // ── Sección 4: Dirección y contacto ──────────────────────────────────────
  drawSectionHeader(page1, '4. DIRECCIÓN Y CONTACTO / Address & Contact', MARGIN, y, CONTENT_W, boldFont)
  y -= 28
  drawField(page1, 'Dirección / Street Address', data.streetAddr, MARGIN, y, CONTENT_W - 80, font, boldFont)
  drawField(page1, 'Apt/Unit', data.unit || '', MARGIN + CONTENT_W - 75, y, 75, font, boldFont)
  y -= 30
  const addrW = (CONTENT_W - 15) / 4
  drawField(page1, 'Ciudad / City', data.city, MARGIN, y, addrW + 20, font, boldFont)
  drawField(page1, 'Condado / County', data.county, MARGIN + addrW + 25, y, addrW, font, boldFont)
  drawField(page1, 'Estado / State', data.state || 'CA', MARGIN + (addrW + 5) * 2 + 20, y, 40, font, boldFont)
  drawField(page1, 'ZIP', data.zip, MARGIN + (addrW + 5) * 2 + 65, y, 60, font, boldFont)
  y -= 30
  drawField(page1, 'Teléfono / Phone', data.phone, MARGIN, y, 140, font, boldFont)
  drawField(page1, 'Teléfono alternativo / Alt Phone', data.altPhone || '', MARGIN + 150, y, 140, font, boldFont)
  drawField(page1, 'Correo / Email', data.email || '', MARGIN + 300, y, CONTENT_W - 300, font, boldFont)
  y -= 30

  // ── Sección 5: Ingresos ───────────────────────────────────────────────────
  drawSectionHeader(page1, '5. INFORMACIÓN DE INGRESOS / Income Information', MARGIN, y, CONTENT_W, boldFont)
  y -= 28
  drawField(page1, 'Personas en el hogar / Household Size', data.householdSize, MARGIN, y, 160, font, boldFont)
  drawField(page1, 'Ingreso mensual total / Monthly Income ($)', data.monthlyIncome, MARGIN + 170, y, 160, font, boldFont)
  y -= 30
  const srcLabels: Record<string, string> = {
    employment: 'Empleo / Employment',
    selfEmployment: 'Trabajo independiente / Self-Employment',
    ssi: 'SSI / Beneficios federales',
    calworks: 'CalWORKs',
    none: 'Sin ingresos / No income',
    other: 'Otro / Other',
  }
  drawLabel(page1, 'Fuente de ingresos / Income Source:', MARGIN, y + 11, font)
  y -= 4
  const srcKeys = Object.keys(srcLabels)
  let sx = MARGIN
  for (const k of srcKeys) {
    drawCheckbox(page1, srcLabels[k], data.incomeSource === k, sx, y, font)
    sx += 130
    if (sx > W - 130) { sx = MARGIN; y -= 16 }
  }
  y -= 24

  // ── Sección 6: Estatus migratorio ─────────────────────────────────────────
  drawSectionHeader(page1, '6. RESIDENCIA / Residency Status', MARGIN, y, CONTENT_W, boldFont)
  y -= 22
  drawCheckbox(page1, 'Ciudadano/Nacional de EE.UU. / U.S. Citizen or National', data.isUSCitizen === 'yes', MARGIN, y, font)
  drawCheckbox(page1, 'Inmigrante calificado / Qualified Immigrant', data.isUSCitizen === 'no', MARGIN + 260, y, font)
  y -= 20
  if (data.isUSCitizen === 'no' && data.immigrationStatus) {
    drawField(page1, 'Estado migratorio / Immigration Status', data.immigrationStatus, MARGIN, y, 250, font, boldFont)
    y -= 30
  } else {
    y -= 10
  }

  // ── Sección 7: Programas actuales ─────────────────────────────────────────
  drawSectionHeader(page1, '7. ¿PARTICIPAS EN OTROS PROGRAMAS? / Other Program Participation', MARGIN, y, CONTENT_W, boldFont)
  y -= 22
  drawCheckbox(page1, 'Medi-Cal', data.onMediCal, MARGIN, y, font)
  drawCheckbox(page1, 'CalFresh (SNAP)', data.onCalFresh, MARGIN + 100, y, font)
  drawCheckbox(page1, 'CalWORKs', data.onCalWORKs, MARGIN + 230, y, font)
  y -= 28

  // ─── PÁGINA 2 ──────────────────────────────────────────────────────────────
  const page2 = pdfDoc.addPage([W, H])

  // Encabezado página 2
  page2.drawRectangle({ x: 0, y: H - 40, width: W, height: 40, color: rgb(0.1, 0.45, 0.22) })
  page2.drawText('CALIFORNIA WIC — Solicitud (continuación / continued)', { x: MARGIN, y: H - 25, font: boldFont, size: 11, color: rgb(1, 1, 1) })

  let y2 = H - 65

  // ── Sección 8: Información de salud ───────────────────────────────────────
  drawSectionHeader(page2, '8. INFORMACIÓN DE SALUD / Health Information', MARGIN, y2, CONTENT_W, boldFont)
  y2 -= 22
  drawCheckbox(page2, 'Lactando / Breastfeeding', !!data.isBreastfeeding, MARGIN, y2, font)
  drawCheckbox(page2, 'Necesidades especiales / Special Needs', !!data.hasSpecialNeeds, MARGIN + 200, y2, font)
  y2 -= 20
  if (data.infantAge) {
    drawField(page2, 'Edad del infante (meses) / Infant Age (months)', data.infantAge, MARGIN, y2, 180, font, boldFont)
    y2 -= 30
  }
  if (data.hasSpecialNeeds && data.specialNeedsDesc) {
    drawField(page2, 'Descripción de necesidades especiales / Special Needs Description', data.specialNeedsDesc, MARGIN, y2, CONTENT_W, font, boldFont)
    y2 -= 30
  }

  // ── Sección 9: Idioma preferido ───────────────────────────────────────────
  drawSectionHeader(page2, '9. IDIOMA PREFERIDO / Preferred Language', MARGIN, y2, CONTENT_W, boldFont)
  y2 -= 22
  const langs = ['Español', 'English', 'Vietnamese', 'Chinese', 'Tagalog', 'Korean', 'Armenian', 'Otro/Other']
  let lx = MARGIN
  for (const l of langs) {
    drawCheckbox(page2, l, data.preferredLanguage === l || (l === 'Español' && data.preferredLanguage === 'es') || (l === 'English' && data.preferredLanguage === 'en'), lx, y2, font)
    lx += 95
    if (lx > W - 95) { lx = MARGIN; y2 -= 16 }
  }
  y2 -= 24

  // ── Sección 10: Derechos y firma ──────────────────────────────────────────
  drawSectionHeader(page2, '10. DERECHOS Y FIRMA / Rights & Signature', MARGIN, y2, CONTENT_W, boldFont)
  y2 -= 18
  const disclaimer = [
    'Al firmar, certifico que la información proporcionada es verdadera y correcta. Entiendo que proporcionar información',
    'falsa puede resultar en la pérdida de beneficios WIC. / By signing, I certify that the information provided is true',
    'and correct. I understand that providing false information may result in loss of WIC benefits.',
  ]
  for (const line of disclaimer) {
    page2.drawText(line, { x: MARGIN, y: y2, font, size: 7.5, color: rgb(0.25, 0.25, 0.25) })
    y2 -= 11
  }
  y2 -= 10

  // Línea de firma
  page2.drawLine({ start: { x: MARGIN, y: y2 }, end: { x: MARGIN + 250, y: y2 }, thickness: 0.8, color: rgb(0.3, 0.3, 0.3) })
  page2.drawText('Firma del solicitante / Applicant Signature', { x: MARGIN, y: y2 - 12, font, size: 7.5, color: rgb(0.4, 0.4, 0.4) })
  drawField(page2, 'Fecha / Date', data.signatureDate, MARGIN + 270, y2 - 14, 120, font, boldFont)
  y2 -= 40

  // ── Información de agencias WIC ───────────────────────────────────────────
  drawSectionHeader(page2, 'PRÓXIMOS PASOS / Next Steps', MARGIN, y2, CONTENT_W, boldFont)
  y2 -= 18
  const steps = [
    '1. Llama al 1-800-852-5770 o visita www.cdph.ca.gov/wic para encontrar tu agencia WIC local.',
    '2. Lleva este documento, una ID con foto, comprobante de domicilio y comprobante de ingresos a tu cita.',
    '3. Si estás embarazada, lleva también la confirmación de embarazo de tu médico.',
    '4. Los beneficios WIC incluyen alimentos nutritivos, educación nutricional y apoyo para lactancia.',
    '5. Para aplicar en línea: BenefitsCal.com  |  Para citas: MyBenefitsCalWIN.org',
  ]
  for (const step of steps) {
    page2.drawText(step, { x: MARGIN, y: y2, font, size: 8, color: rgb(0.15, 0.15, 0.15) })
    y2 -= 14
  }
  y2 -= 10

  // Pie de página
  page2.drawRectangle({ x: 0, y: 0, width: W, height: 28, color: rgb(0.1, 0.45, 0.22) })
  page2.drawText(
    'California WIC Program  |  CDPH  |  www.cdph.ca.gov/wic  |  Este documento es solo una referencia — la solicitud oficial se completa en la agencia WIC.',
    { x: MARGIN, y: 10, font, size: 6.5, color: rgb(0.85, 1, 0.85) }
  )

  // Pie de página 1
  page1.drawRectangle({ x: 0, y: 0, width: W, height: 28, color: rgb(0.1, 0.45, 0.22) })
  page1.drawText(
    'California WIC Program  |  CDPH  |  www.cdph.ca.gov/wic  |  Página 1 de 2',
    { x: MARGIN, y: 10, font, size: 6.5, color: rgb(0.85, 1, 0.85) }
  )

  return pdfDoc.save()
}
