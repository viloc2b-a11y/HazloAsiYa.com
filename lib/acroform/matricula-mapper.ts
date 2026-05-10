/**
 * lib/acroform/matricula-mapper.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Matrícula Consular Mexicana (MCAS)
 *
 * NOTA TÉCNICA: La Matrícula Consular no tiene un PDF AcroForm oficial
 * descargable. Se genera visualmente con pdf-lib reproduciendo el formato
 * de solicitud y checklist de documentos requeridos por el Consulado.
 *
 * El documento generado incluye:
 * - Consulado destino y tipo de trámite
 * - Datos del solicitante (nombre, CURP, fecha/lugar de nacimiento)
 * - Domicilio en Estados Unidos
 * - Checklist de documentos originales requeridos
 * - Información de cita, costo y horarios
 *
 * Fuente oficial: https://mexitel.sre.gob.mx
 * Agencia: Secretaría de Relaciones Exteriores (SRE) · Consulado General de México
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { PDFDocument, StandardFonts, rgb as pdfRgb } from 'pdf-lib'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MatriculaFormData {
  // Consulado y tipo
  consulado: 'hou' | 'aus' | 'dal' | string
  tipoTramite: 'nueva' | 'ren' | 'rep'
  // Datos personales
  firstName: string
  middleName?: string
  lastName: string
  lastName2?: string
  dob: string
  birthPlace?: string
  curp?: string
  phone?: string
  email?: string
  // Domicilio en EE.UU.
  street: string
  city: string
  state?: string
  zip: string
  // Documentos
  docActa?: boolean
  docPasaporte?: boolean
  docNaturalizacion?: boolean
  docIne?: boolean
  docLicencia?: boolean
  docUtility?: boolean
  docRenta?: boolean
  docBank?: boolean
}

// ── Shared drawing helpers ────────────────────────────────────────────────────
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
  const { page, fontB } = ctx
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
export async function generateMatriculaPdf(d: MatriculaFormData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font  = await doc.embedFont(StandardFonts.Helvetica)
  const fontB = await doc.embedFont(StandardFonts.HelveticaBold)
  const page  = doc.addPage([612, 792])
  const { width, height } = page.getSize()
  const ctx: Ctx = { page, font, fontB, width, height }

  const consMap: Record<string, string> = {
    hou: 'Houston — 4200 Montrose Blvd, Houston TX 77006 · (713) 271-6800',
    aus: 'Austin — Round Rock, TX',
    dal: 'Dallas — 1210 River Bend Dr, Dallas TX 75247',
  }
  const tramiteMap: Record<string, string> = {
    nueva: 'Nueva Matrícula',
    ren:   'Renovación',
    rep:   'Reposición',
  }

  let y = hdr(ctx, 'MATRÍCULA CONSULAR — SRE', 'Solicitud de Matrícula Consular de Alta Seguridad (MCAS)', 'Secretaría de Relaciones Exteriores · ' + (consMap[d.consulado] ?? d.consulado))
  y = notice(ctx, y)

  y = section(ctx, 'CONSULADO Y TIPO DE TRÁMITE', y) - 8
  y = field(ctx, 'Consulado',       consMap[d.consulado] ?? d.consulado, 28, y, 560)
  y = field(ctx, 'Tipo de trámite', tramiteMap[d.tipoTramite] ?? d.tipoTramite, 28, y, 300)
  y -= 4

  y = section(ctx, 'DATOS DEL SOLICITANTE', y) - 8
  y = field(ctx, 'Primer nombre',              d.firstName,        28,  y, 180)
  field(ctx, 'Segundo nombre',                 d.middleName ?? '', 220, y + 23, 140)
  y = field(ctx, 'Primer apellido (paterno)',  d.lastName,         28,  y, 200)
  field(ctx, 'Segundo apellido (materno)',     d.lastName2 ?? '',  240, y + 23, 200)
  y = field(ctx, 'Fecha de nacimiento',        d.dob,              28,  y, 200)
  field(ctx, 'Lugar de nacimiento',            d.birthPlace ?? '', 240, y + 23, 340)
  y = field(ctx, 'CURP',                       d.curp ?? '',       28,  y, 300)
  y = field(ctx, 'Teléfono',                   d.phone ?? '',      28,  y, 200)
  field(ctx, 'Email',                          d.email ?? '',      240, y + 23, 340)
  y -= 4

  y = section(ctx, 'DOMICILIO EN ESTADOS UNIDOS', y) - 8
  y = field(ctx, 'Calle, número y apartamento', d.street,       28,  y, 400)
  y = field(ctx, 'Ciudad',                      d.city,         28,  y, 200)
  field(ctx, 'Estado',                          d.state ?? '',  240, y + 23, 80)
  field(ctx, 'ZIP Code',                        d.zip,          332, y + 23, 100)
  y -= 4

  y = section(ctx, 'DOCUMENTOS A PRESENTAR — Originales, buen estado, SIN laminar', y) - 8
  const docs: [boolean | undefined, string][] = [
    [d.docActa,          'Nacionalidad: Acta de nacimiento mexicana (original o copia certificada)'],
    [d.docPasaporte,     'Nacionalidad: Pasaporte mexicano (vigente o vencido)'],
    [d.docNaturalizacion,'Nacionalidad: Carta de naturalización'],
    [d.docIne,           'Identidad: Credencial para votar INE/IFE vigente'],
    [d.docLicencia,      'Identidad: Licencia de conducir (mexicana o de EE.UU.)'],
    [d.docUtility,       'Domicilio: Recibo de servicios (máx. 3 meses)'],
    [d.docRenta,         'Domicilio: Contrato de renta con nombre y dirección'],
    [d.docBank,          'Domicilio: Estado de cuenta bancario'],
  ]
  docs.filter(([checked]) => checked).forEach(([, label]) => {
    page.drawText(`✓ ${label}`, { x: 32, y, font, size: 9, color: pdfRgb(0.03, 0.34, 0.29) })
    y -= 13
  })
  y -= 8

  const info: [string, string][] = [
    ['Cita previa',  'mexitel.sre.gob.mx o (713) 271-6800'],
    ['Costo',        '$33 USD — efectivo o money order'],
    ['Horario',      'Lunes a Viernes 8:00 AM – 5:00 PM'],
    ['Entrega',      'El mismo día con documentos completos'],
    ['Vigencia',     '5 años'],
    ['No se acepta', 'Documentos laminados o en mal estado'],
  ]
  info.forEach(([k, v]) => {
    page.drawText(`${k}:`, { x: 28, y, font: fontB, size: 8.5, color: pdfRgb(0.03, 0.34, 0.29) })
    page.drawText(v,       { x: 160, y, font,        size: 8.5, color: pdfRgb(0.1, 0.1, 0.1) })
    y -= 14
  })
  y -= 8
  page.drawText('Bajo protesta de decir verdad, manifiesto que los datos y documentos son correctos y auténticos.', { x: 28, y, font, size: 7.5, color: pdfRgb(0.2, 0.2, 0.2), maxWidth: 560, lineHeight: 11 })
  y -= 26
  signature(ctx, y)
  footer(ctx, 'Matrícula Consular Mexicana · SRE · Prepared by HazloAsíYa.com · No es documento oficial hasta ser aprobado por el Consulado')

  return doc.save()
}
