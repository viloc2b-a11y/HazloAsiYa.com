/**
 * lib/acroform/cfes2337-mapper.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Florida CF-ES 2337 — ACCESS Florida Application (SNAP / Medicaid / TCA)
 *
 * NOTA TÉCNICA: El PDF oficial del CF-ES 2337 descargado desde el portal
 * de Florida DCF (eds.myflfamilies.com) es un PDF de solo lectura escaneado
 * sin campos AcroForm digitales. Por esta razón, usamos pdf-lib para generar
 * un documento visual que reproduce fielmente el formato oficial del formulario.
 *
 * El documento generado incluye:
 * - Encabezado oficial con número de formulario CF-ES 2337
 * - Todos los campos de datos del solicitante
 * - Tabla de miembros del hogar
 * - Sección de ingresos
 * - Sección de recursos
 * - Declaración y firma
 *
 * Fuente oficial: https://myaccess.myflfamilies.com/
 * Agencia: Florida Department of Children and Families (DCF)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib'

export interface CfEs2337FormData {
  // Sección 1: Información del solicitante
  firstName: string
  lastName: string
  middleInitial?: string
  ssn?: string
  dob: string
  gender?: 'M' | 'F'
  maritalStatus?: 'single' | 'married' | 'separated' | 'divorced' | 'widowed'
  // Dirección
  streetAddress: string
  apt?: string
  city: string
  county: string
  zip: string
  phone: string
  altPhone?: string
  email?: string
  // Programas solicitados
  wantFoodAssistance: boolean
  wantMedicaid: boolean
  wantTCA?: boolean
  // Ciudadanía
  isUSCitizen?: boolean
  immigrationStatus?: string
  // Hogar
  householdSize: number
  householdMembers?: Array<{
    name: string
    dob: string
    ssn?: string
    relationship: string
    isUSCitizen?: boolean
  }>
  // Ingresos
  hasEmployment?: boolean
  employerName?: string
  monthlyWages?: string
  hasSelfEmployment?: boolean
  selfEmploymentIncome?: string
  hasOtherIncome?: boolean
  otherIncomeType?: string
  otherIncomeAmount?: string
  // Recursos
  hasBankAccount?: boolean
  bankBalance?: string
  hasVehicle?: boolean
  vehicleValue?: string
  // Vivienda
  rentAmount?: string
  mortgageAmount?: string
  // Firma
  signDate?: string
}

interface DrawCtx {
  page: PDFPage
  font: PDFFont
  fontB: PDFFont
  width: number
  height: number
}

function drawHeaderFL(ctx: DrawCtx): number {
  const { page, font, fontB, width, height } = ctx
  // Barra superior azul Florida
  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: rgb(0.0, 0.29, 0.57) })
  page.drawText('STATE OF FLORIDA', { x: 20, y: height - 22, font: fontB, size: 9, color: rgb(1, 1, 1) })
  page.drawText('Department of Children and Families', { x: 20, y: height - 34, font, size: 8, color: rgb(0.85, 0.92, 1) })
  page.drawText('ACCESS Florida Application', { x: 20, y: height - 47, font: fontB, size: 10, color: rgb(1, 0.85, 0) })
  page.drawText('CF-ES 2337', { x: width - 100, y: height - 22, font: fontB, size: 9, color: rgb(1, 1, 1) })
  page.drawText('myaccess.myflfamilies.com', { x: width - 160, y: height - 35, font, size: 7.5, color: rgb(0.75, 0.88, 1) })
  // Aviso legal
  page.drawRectangle({ x: 20, y: height - 80, width: width - 40, height: 16, color: rgb(1, 0.95, 0.8), borderColor: rgb(0.8, 0.5, 0), borderWidth: 0.5 })
  page.drawText('PREPARADO POR HAZLOASIYA.COM — Documento de referencia. Presente la solicitud oficial en myaccess.myflfamilies.com o en su Family Resource Center local.', {
    x: 24, y: height - 72, font, size: 6.5, color: rgb(0.45, 0.25, 0),
  })
  return height - 95
}

function drawSectionHeader(ctx: DrawCtx, title: string, y: number): number {
  const { page, fontB, width } = ctx
  page.drawRectangle({ x: 20, y: y - 14, width: width - 40, height: 16, color: rgb(0.0, 0.29, 0.57) })
  page.drawText(title, { x: 24, y: y - 9, font: fontB, size: 8.5, color: rgb(1, 1, 1) })
  return y - 20
}

function drawFieldLine(ctx: DrawCtx, label: string, value: string, x: number, y: number, w = 240): number {
  const { page, font, fontB } = ctx
  page.drawText(label, { x, y: y + 2, font, size: 6.5, color: rgb(0.4, 0.4, 0.4) })
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) })
  if (value) page.drawText(value, { x: x + 2, y: y - 10, font: fontB, size: 9, color: rgb(0.05, 0.05, 0.07) })
  return y - 22
}

function drawCheckField(ctx: DrawCtx, label: string, checked: boolean, x: number, y: number): void {
  const { page, font, fontB } = ctx
  page.drawRectangle({ x, y: y - 2, width: 9, height: 9, borderColor: rgb(0.3, 0.3, 0.3), borderWidth: 1, color: rgb(1, 1, 1) })
  if (checked) {
    page.drawText('✓', { x: x + 1, y: y - 1, font: fontB, size: 8, color: rgb(0.0, 0.29, 0.57) })
  }
  page.drawText(label, { x: x + 13, y, font, size: 8.5, color: rgb(0.1, 0.1, 0.1) })
}

/**
 * Genera el documento CF-ES 2337 de Florida visualmente.
 * Devuelve los bytes del PDF listo para descargar.
 */
export async function fillCfEs2337Form(data: CfEs2337FormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // ── PÁGINA 1: Información del solicitante ─────────────────────────────
  const page1 = pdfDoc.addPage([612, 792])
  const { width, height } = page1.getSize()
  const ctx: DrawCtx = { page: page1, font, fontB, width, height }

  let y = drawHeaderFL(ctx)

  // Programas solicitados
  y = drawSectionHeader(ctx, 'SECTION 1 — PROGRAMS REQUESTED / PROGRAMAS SOLICITADOS', y - 5)
  y -= 5
  drawCheckField(ctx, 'Food Assistance (SNAP) / Asistencia de Alimentos', data.wantFoodAssistance, 24, y)
  y -= 18
  drawCheckField(ctx, 'Medicaid / Cobertura Médica', data.wantMedicaid, 24, y)
  y -= 18
  drawCheckField(ctx, 'Temporary Cash Assistance (TCA) / Asistencia en Efectivo', data.wantTCA ?? false, 24, y)
  y -= 25

  // Información personal
  y = drawSectionHeader(ctx, 'SECTION 2 — APPLICANT INFORMATION / INFORMACIÓN DEL SOLICITANTE', y - 5)
  y -= 5

  const fullName = `${data.lastName}, ${data.firstName}${data.middleInitial ? ' ' + data.middleInitial + '.' : ''}`
  y = drawFieldLine(ctx, 'Full Name / Nombre Completo (Last, First, MI)', fullName, 24, y, width - 48)
  y -= 5

  // Fila: SSN + DOB + Gender
  drawFieldLine(ctx, 'Social Security Number', data.ssn ?? 'N/A', 24, y, 150)
  drawFieldLine(ctx, 'Date of Birth / Fecha de Nacimiento', data.dob, 200, y, 120)
  if (data.gender) {
    page1.drawText('Gender:', { x: 340, y: y + 2, font, size: 6.5, color: rgb(0.4, 0.4, 0.4) })
    drawCheckField(ctx, 'Male', data.gender === 'M', 380, y)
    drawCheckField(ctx, 'Female', data.gender === 'F', 420, y)
  }
  y -= 27

  // Dirección
  y = drawFieldLine(ctx, 'Street Address / Dirección', data.streetAddress + (data.apt ? ` Apt ${data.apt}` : ''), 24, y, width - 48)
  y -= 5

  drawFieldLine(ctx, 'City / Ciudad', data.city, 24, y, 160)
  drawFieldLine(ctx, 'County / Condado', data.county, 210, y, 130)
  drawFieldLine(ctx, 'ZIP', data.zip, 360, y, 80)
  y -= 27

  drawFieldLine(ctx, 'Phone / Teléfono', data.phone, 24, y, 160)
  drawFieldLine(ctx, 'Alternate Phone / Tel. Alternativo', data.altPhone ?? '', 210, y, 160)
  drawFieldLine(ctx, 'Email', data.email ?? '', 390, y, 180)
  y -= 27

  // Ciudadanía
  y = drawSectionHeader(ctx, 'SECTION 3 — CITIZENSHIP / CIUDADANÍA', y - 5)
  y -= 5
  if (data.isUSCitizen !== undefined) {
    drawCheckField(ctx, 'U.S. Citizen or U.S. National', data.isUSCitizen, 24, y)
    drawCheckField(ctx, 'Qualified Non-Citizen (specify status below)', !data.isUSCitizen, 280, y)
    y -= 18
    if (!data.isUSCitizen && data.immigrationStatus) {
      y = drawFieldLine(ctx, 'Immigration Status / Estado Migratorio', data.immigrationStatus, 24, y, 300)
    }
  }
  y -= 10

  // Hogar
  y = drawSectionHeader(ctx, 'SECTION 4 — HOUSEHOLD MEMBERS / MIEMBROS DEL HOGAR', y - 5)
  y -= 5
  y = drawFieldLine(ctx, 'Total Household Size / Tamaño del Hogar', String(data.householdSize), 24, y, 100)
  y -= 5

  if (data.householdMembers && data.householdMembers.length > 0) {
    // Encabezado de tabla
    page1.drawRectangle({ x: 24, y: y - 12, width: width - 48, height: 14, color: rgb(0.9, 0.93, 0.97) })
    page1.drawText('Name', { x: 28, y: y - 8, font: fontB, size: 7, color: rgb(0.1, 0.1, 0.1) })
    page1.drawText('Date of Birth', { x: 190, y: y - 8, font: fontB, size: 7, color: rgb(0.1, 0.1, 0.1) })
    page1.drawText('Relationship', { x: 290, y: y - 8, font: fontB, size: 7, color: rgb(0.1, 0.1, 0.1) })
    page1.drawText('SSN', { x: 400, y: y - 8, font: fontB, size: 7, color: rgb(0.1, 0.1, 0.1) })
    y -= 16

    for (const member of data.householdMembers.slice(0, 8)) {
      page1.drawLine({ start: { x: 24, y }, end: { x: width - 24, y }, thickness: 0.3, color: rgb(0.85, 0.85, 0.85) })
      page1.drawText(member.name, { x: 28, y: y - 9, font, size: 8, color: rgb(0.1, 0.1, 0.1) })
      page1.drawText(member.dob, { x: 190, y: y - 9, font, size: 8, color: rgb(0.1, 0.1, 0.1) })
      page1.drawText(member.relationship, { x: 290, y: y - 9, font, size: 8, color: rgb(0.1, 0.1, 0.1) })
      page1.drawText(member.ssn ?? '—', { x: 400, y: y - 9, font, size: 8, color: rgb(0.1, 0.1, 0.1) })
      y -= 16
    }
  }
  y -= 10

  // ── PÁGINA 2: Ingresos, recursos y firma ─────────────────────────────
  const page2 = pdfDoc.addPage([612, 792])
  const ctx2: DrawCtx = { page: page2, font, fontB, width, height }
  let y2 = drawHeaderFL(ctx2)

  // Ingresos
  y2 = drawSectionHeader(ctx2, 'SECTION 5 — INCOME / INGRESOS', y2 - 5)
  y2 -= 5

  drawCheckField(ctx2, 'Employment Income / Ingresos por Empleo', data.hasEmployment ?? false, 24, y2)
  y2 -= 18
  if (data.hasEmployment) {
    y2 = drawFieldLine(ctx2, 'Employer Name / Nombre del Empleador', data.employerName ?? '', 40, y2, 200)
    y2 = drawFieldLine(ctx2, 'Monthly Wages / Salario Mensual ($)', data.monthlyWages ?? '', 40, y2, 150)
    y2 -= 5
  }

  drawCheckField(ctx2, 'Self-Employment / Trabajo Independiente', data.hasSelfEmployment ?? false, 24, y2)
  y2 -= 18
  if (data.hasSelfEmployment) {
    y2 = drawFieldLine(ctx2, 'Monthly Net Income / Ingreso Neto Mensual ($)', data.selfEmploymentIncome ?? '', 40, y2, 150)
    y2 -= 5
  }

  drawCheckField(ctx2, 'Other Income / Otros Ingresos', data.hasOtherIncome ?? false, 24, y2)
  y2 -= 18
  if (data.hasOtherIncome) {
    drawFieldLine(ctx2, 'Type / Tipo', data.otherIncomeType ?? '', 40, y2, 150)
    drawFieldLine(ctx2, 'Monthly Amount / Monto Mensual ($)', data.otherIncomeAmount ?? '', 220, y2, 120)
    y2 -= 27
  }
  y2 -= 10

  // Recursos
  y2 = drawSectionHeader(ctx2, 'SECTION 6 — RESOURCES / RECURSOS', y2 - 5)
  y2 -= 5

  drawCheckField(ctx2, 'Bank/Savings Account / Cuenta Bancaria', data.hasBankAccount ?? false, 24, y2)
  if (data.hasBankAccount) {
    drawFieldLine(ctx2, 'Balance ($)', data.bankBalance ?? '', 250, y2, 100)
  }
  y2 -= 18

  drawCheckField(ctx2, 'Vehicle / Vehículo', data.hasVehicle ?? false, 24, y2)
  if (data.hasVehicle) {
    drawFieldLine(ctx2, 'Estimated Value / Valor Estimado ($)', data.vehicleValue ?? '', 250, y2, 100)
  }
  y2 -= 25

  // Vivienda
  y2 = drawSectionHeader(ctx2, 'SECTION 7 — HOUSING COSTS / GASTOS DE VIVIENDA', y2 - 5)
  y2 -= 5
  if (data.rentAmount) {
    y2 = drawFieldLine(ctx2, 'Monthly Rent / Renta Mensual ($)', data.rentAmount, 24, y2, 150)
  }
  if (data.mortgageAmount) {
    y2 = drawFieldLine(ctx2, 'Monthly Mortgage / Hipoteca Mensual ($)', data.mortgageAmount, 24, y2, 150)
  }
  y2 -= 20

  // Declaración y firma
  y2 = drawSectionHeader(ctx2, 'SECTION 8 — CERTIFICATION AND SIGNATURE / CERTIFICACIÓN Y FIRMA', y2 - 5)
  y2 -= 10

  const certText = [
    'I certify that the information I have provided on this application is true and correct to the best of my knowledge.',
    'Certifico que la información que he proporcionado en esta solicitud es verdadera y correcta a mi mejor entender.',
    '',
    'I understand that providing false information may result in disqualification from benefits and possible criminal prosecution.',
    'Entiendo que proporcionar información falsa puede resultar en descalificación de beneficios y posible procesamiento criminal.',
  ]

  for (const line of certText) {
    if (line === '') { y2 -= 6; continue }
    page2.drawText(line, { x: 24, y: y2, font, size: 7.5, color: rgb(0.2, 0.2, 0.2), maxWidth: width - 48 })
    y2 -= 12
  }

  y2 -= 15
  const today = data.signDate ?? new Date().toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
  })

  page2.drawLine({ start: { x: 24, y: y2 }, end: { x: 350, y: y2 }, thickness: 0.5, color: rgb(0.3, 0.3, 0.3) })
  page2.drawText('Applicant Signature / Firma del Solicitante', { x: 24, y: y2 - 12, font, size: 7, color: rgb(0.5, 0.5, 0.5) })
  page2.drawLine({ start: { x: 380, y: y2 }, end: { x: 580, y: y2 }, thickness: 0.5, color: rgb(0.3, 0.3, 0.3) })
  page2.drawText(today, { x: 382, y: y2 - 10, font: fontB, size: 9, color: rgb(0.1, 0.1, 0.1) })
  page2.drawText('Date / Fecha', { x: 380, y: y2 - 20, font, size: 7, color: rgb(0.5, 0.5, 0.5) })

  // Footer
  page2.drawText('Para presentar esta solicitud: myaccess.myflfamilies.com | Por correo: P.O. Box 1770, Ocala, FL 34478 | Fax: 1-866-886-4342', {
    x: 24, y: 30, font, size: 7, color: rgb(0.4, 0.4, 0.4),
  })
  page2.drawText('CF-ES 2337 — Florida Department of Children and Families', {
    x: 24, y: 18, font, size: 6.5, color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}
