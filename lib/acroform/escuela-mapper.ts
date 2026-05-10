/**
 * lib/acroform/escuela-mapper.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Paquete de Inscripción Escolar en Texas (TEA 2026–2027)
 *
 * NOTA TÉCNICA: No existe un PDF AcroForm oficial único para la inscripción
 * escolar en Texas — cada distrito (HISD, KISD, CFISD, etc.) tiene su propio
 * formato. Se genera visualmente con pdf-lib un paquete estandarizado que
 * incluye todos los campos requeridos por la TEA y el derecho Plyler v. Doe.
 *
 * El documento generado incluye:
 * - Información del estudiante (nombre, DOB, grado, distrito, país de origen)
 * - Información del padre/guardián
 * - Domicilio en Texas
 * - Contacto de emergencia
 * - Historial de salud (alergias, medicamentos, médico, seguro)
 * - Checklist de documentos requeridos
 *
 * Fuente oficial: https://tea.texas.gov
 * Agencia: Texas Education Agency (TEA) · Plyler v. Doe
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { PDFDocument, StandardFonts, rgb as pdfRgb } from 'pdf-lib'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface EscuelaFormData {
  // Estudiante
  studentLastName: string
  studentFirstName: string
  studentMiddleName?: string
  studentDob: string
  studentGender?: 'F' | 'M' | 'X'
  grade?: string
  district?: string
  countryOfBirth?: string
  language?: 'es' | 'en' | 'both'
  // Guardián
  guardianFirstName: string
  guardianLastName: string
  relationship?: string
  phone?: string
  email?: string
  // Domicilio
  street: string
  city: string
  zip: string
  // Emergencia
  emergencyName?: string
  emergencyRelationship?: string
  emergencyPhone?: string
  // Salud
  allergies?: string
  medications?: string
  doctor?: string
  insurance?: 'none' | 'medicaid' | 'private'
  // Documentos
  docBirthCert?: boolean
  docVaccines?: boolean
  docAddress?: boolean
  docGuardianId?: boolean
  docSchoolRecords?: boolean
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
export async function generateEscuelaPdf(d: EscuelaFormData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font  = await doc.embedFont(StandardFonts.Helvetica)
  const fontB = await doc.embedFont(StandardFonts.HelveticaBold)
  const page  = doc.addPage([612, 792])
  const { width, height } = page.getSize()
  const ctx: Ctx = { page, font, fontB, width, height }

  const genderMap: Record<string, string> = { F: 'Femenino/F', M: 'Masculino/M', X: 'No binario/X' }
  const langMap:   Record<string, string> = { es: 'Español/Spanish', en: 'Inglés/English', both: 'Bilingüe' }
  const insMap:    Record<string, string> = { none: 'Sin seguro', medicaid: 'Medicaid/CHIP', private: 'Privado' }

  let y = hdr(ctx, 'STUDENT ENROLLMENT PACKET 2026–2027', 'Paquete de Inscripción Escolar / Student Registration', `Texas Education Agency (TEA) · ${d.district ?? 'HISD'} · Plyler v. Doe — All children have the right to public education in Texas`)
  y = notice(ctx, y)

  // Plyler notice bar
  page.drawRectangle({ x: 24, y: y - 26, width: 564, height: 22, color: pdfRgb(0.93, 0.97, 0.95), borderColor: pdfRgb(0.7, 0.85, 0.78), borderWidth: 1 })
  page.drawText('Plyler v. Doe: Todo nino tiene derecho a educacion publica en Texas sin importar estatus migratorio.', { x: 32, y: y - 16, font: fontB, size: 7.5, color: pdfRgb(0.03, 0.34, 0.29) })
  y -= 36

  y = section(ctx, 'SECCION A — ESTUDIANTE / STUDENT INFORMATION', y) - 8
  y = field(ctx, 'Apellido / Last Name',  d.studentLastName,   28,  y, 200)
  field(ctx, 'Primer nombre / First Name', d.studentFirstName, 240, y + 23, 180)
  field(ctx, 'Segundo nombre',             d.studentMiddleName ?? '', 432, y + 23, 148)
  y = field(ctx, 'Fecha de nacimiento / DOB', d.studentDob,    28,  y, 180)
  field(ctx, 'Genero / Gender',            genderMap[d.studentGender ?? ''] ?? '', 220, y + 23, 100)
  field(ctx, 'Grado / Grade',              d.grade ?? '',      332, y + 23, 80)
  field(ctx, 'Distrito / District',        d.district ?? '',   424, y + 23, 164)
  y = field(ctx, 'Pais de nacimiento / Country of Birth', d.countryOfBirth ?? '', 28, y, 200)
  field(ctx, 'Idioma / Language',          langMap[d.language ?? ''] ?? '', 240, y + 23, 200)
  y -= 4

  y = section(ctx, 'SECCION B — PADRE / GUARDIAN', y) - 8
  y = field(ctx, 'Nombre completo / Full Name', `${d.guardianFirstName} ${d.guardianLastName}`, 28, y, 300)
  field(ctx, 'Relacion / Relationship',    d.relationship ?? '', 340, y + 23, 248)
  y = field(ctx, 'Telefono / Cell Phone',  d.phone ?? '',        28,  y, 200)
  field(ctx, 'Email',                      d.email ?? '',        240, y + 23, 340)
  y -= 4

  y = section(ctx, 'SECCION C — DOMICILIO / ADDRESS', y) - 8
  y = field(ctx, 'Calle y numero / Street Address', d.street, 28, y, 400)
  y = field(ctx, 'Ciudad / City',  d.city,   28,  y, 200)
  field(ctx, 'State',              'Texas',  240, y + 23, 80)
  field(ctx, 'ZIP Code',           d.zip,    332, y + 23, 100)
  y -= 4

  y = section(ctx, 'SECCION D — CONTACTO DE EMERGENCIA', y) - 8
  y = field(ctx, 'Nombre / Name',   d.emergencyName ?? '',         28,  y, 260)
  field(ctx, 'Relacion / Rel.',     d.emergencyRelationship ?? '', 300, y + 23, 140)
  field(ctx, 'Telefono / Phone',    d.emergencyPhone ?? '',        452, y + 23, 136)
  y -= 4

  y = section(ctx, 'SECCION E — SALUD / HEALTH', y) - 8
  y = field(ctx, 'Alergias / Allergies',    d.allergies  ?? 'Ninguna/None', 28,  y, 260)
  field(ctx, 'Medicamentos / Medications',  d.medications ?? 'Ninguno/None', 300, y + 23, 288)
  y = field(ctx, 'Medico / Doctor',         d.doctor ?? '',                  28,  y, 300)
  field(ctx, 'Seguro / Insurance',          insMap[d.insurance ?? ''] ?? 'Sin seguro', 340, y + 23, 248)
  y -= 4

  y = section(ctx, 'SECCION F — DOCUMENTOS / CHECKLIST', y) - 8
  const docs: [boolean | undefined, string, string][] = [
    [d.docBirthCert,    'Acta de nacimiento / Birth Certificate (any country)', 'Required'],
    [d.docVaccines,     'Vacunas / Immunization Records',                       'Required'],
    [d.docAddress,      'Comprobante de domicilio / Proof of Address',           'Required'],
    [d.docGuardianId,   'ID del guardian / Guardian Photo ID',                   'Recommended'],
    [d.docSchoolRecords,'Expediente escolar anterior / Previous School Records', 'If applicable'],
  ]
  docs.forEach(([checked, label, req]) => {
    page.drawText(`${checked ? '\u2705' : '\u2B1C'} ${label}`, { x: 32, y, font, size: 9, color: checked ? pdfRgb(0.03, 0.34, 0.29) : pdfRgb(0.3, 0.3, 0.3) })
    page.drawText(req, { x: 450, y, font: fontB, size: 8, color: checked ? pdfRgb(0.03, 0.34, 0.29) : pdfRgb(0.55, 0.2, 0.1) })
    y -= 13
  })
  y -= 8
  page.drawText('Certifico que la informacion es verdadera y completa. / I certify all information provided is true and complete.', { x: 28, y, font, size: 7.5, color: pdfRgb(0.2, 0.2, 0.2) })
  y -= 26
  signature(ctx, y)
  footer(ctx, `Texas School Enrollment 2026-2027 · ${d.district ?? 'HISD'} · Prepared by HazloAsíYa.com · Plyler v. Doe`)

  return doc.save()
}
