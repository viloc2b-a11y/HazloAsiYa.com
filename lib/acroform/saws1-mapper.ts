/**
 * lib/acroform/saws1-mapper.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * California SAWS-1 — Initial Application for CalFresh, Medi-Cal & CalWORKs
 *
 * PDF oficial: /public/forms/saws1.pdf
 * Fuente: California Department of Social Services (CDSS)
 * URL: https://www.cdss.ca.gov/cdssweb/entres/forms/english/saws_1.pdf
 *
 * Campos AcroForm reales (115 campos, 8 páginas).
 * Los campos relevantes para el solicitante están en páginas 7-8.
 *
 * PROGRAMAS (checkboxes applicant_programs_1/2/3):
 *   programs_1 = CalFresh (SNAP)
 *   programs_2 = Medi-Cal (Medicaid)
 *   programs_3 = CalWORKs (TANF)
 *
 * EMERGENCIA (applicant_emergency-1-X-1):
 *   1-1 = Menos de $100 en efectivo/banco
 *   1-2 = Ingresos menores al 50% del límite federal
 *   1-3 = Desempleado o trabajó menos de 30h/semana en los últimos 30 días
 *   1-4 = Migrante o trabajador estacional con menos de $100
 *   1-5 = Recibió aviso de desalojo/corte de servicios
 *   1-6 = Otra emergencia (especificar)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { PDFDocument } from 'pdf-lib'

// ── Nombres exactos de los campos AcroForm del SAWS-1 ────────────────────
const F = {
  // Datos del solicitante
  name:             'applicant_name',
  nameOther:        'applicant_name_other',
  ssn:              'applicant_ssn',
  // Dirección física
  homeAddress:      'applicant_home_address',
  homeUnit:         'applicant_home_unit',
  homeCity:         'applicant_home_city',
  homeCounty:       'applicant_home_county',
  homeState:        'applicant_home_state',
  homeZip:          'applicant_home_zip',
  // Dirección de correo (si diferente)
  mailAddress:      'applicant_mailing_address',
  mailUnit:         'applicant_mailing_unit',
  mailCity:         'applicant_mailing_city',
  mailCounty:       'applicant_mailing_county',
  mailState:        'applicant_mailing_state',
  mailZip:          'applicant_mailing_zip',
  // Contacto
  phoneHome:        'applicant_phone_home',
  phoneAlt:         'applicant_phone_alternate',
  email:            'applicant_email',
  // Fechas
  signDate:         'applicant_date',
  spouseSignDate:   'applicant_spouse_date',
  // Programas solicitados
  wantCalFresh:     'applicant_programs_1',
  wantMediCal:      'applicant_programs_2',
  wantCalWORKs:     'applicant_programs_3',
  // Condiciones especiales
  hasDisability:    'applicant_disability-1',
  noDisability:     'applicant_disability-2',
  isHomeless:       'applicant_homeless-1',
  notHomeless:      'applicant_homeless-2',
  isPregnant:       'applicant_pregnant-1',
  notPregnant:      'applicant_pregnant-2',
  pregnantDue1:     'applicant_pregnant-1-1',
  pregnantDue2:     'applicant_pregnant-1-2',
  // Email preferences
  emailApp1:        'applicant_email_application-1',
  emailApp2:        'applicant_email_application-2',
  emailCase1:       'applicant_email_case-1',
  emailCase2:       'applicant_email_case-2',
  // Emergencia CalFresh expedited
  emergency1:       'applicant_emergency-1',
  noEmergency:      'applicant_emergency-2',
  emergLess100:     'applicant_emergency-1-1-1',
  emergLowIncome:   'applicant_emergency-1-2-1',
  emergUnemployed:  'applicant_emergency-1-3-1',
  emergMigrant:     'applicant_emergency-1-4-1',
  emergEviction:    'applicant_emergency-1-5-1',
  emergOther:       'applicant_emergency-1-6-1',
  emergOtherText:   'applicant_emergency-1-6-1-1',
  // Representante autorizado (página 8)
  repHasHelp1:      'rep_help-1',
  repHasHelp2:      'rep_help-2',
  repName1:         'rep_help-1-1',
  repName2:         'rep_help-1-2',
  repBenefits1:     'rep_benefits-1',
  repBenefits2:     'rep_benefits-2',
  repBenName1:      'rep_benefits-1-1',
  repBenName2:      'rep_benefits-1-2',
  repBenAddr1:      'rep_benefits-1-3',
  repBenAddr2:      'rep_benefits-1-4',
  repBenPhone1:     'rep_benefits-1-5',
  repBenPhone2:     'rep_benefits-1-6',
  // Etnicidad / raza (página 8 — opcional)
  isHispanic1:      'rep_hispanic-1',
  isHispanic2:      'rep_hispanic-2',
  raceWhite:        'rep_race-1',
  raceBlack:        'rep_race-2',
  raceAsian:        'rep_race-3',
  raceNative:       'rep_race-4',
  racePacific:      'rep_race-5',
  raceOther:        'rep_race-6',
  // Discapacidad rep
  repDisability:    'rep_disability',
  // Opt-out
  repOptOut:        'rep_opt_out',
} as const

export interface Saws1FormData {
  // Nombre completo (Last, First Middle)
  fullName: string
  otherName?: string
  ssn?: string
  // Dirección
  streetAddress: string
  unit?: string
  city: string
  county: string
  state?: string
  zip: string
  // Dirección de correo (si diferente)
  sameMailAddress?: boolean
  mailStreet?: string
  mailUnit?: string
  mailCity?: string
  mailCounty?: string
  mailZip?: string
  // Contacto
  phone: string
  altPhone?: string
  email?: string
  wantEmailNotifications?: boolean
  // Programas
  wantCalFresh: boolean
  wantMediCal: boolean
  wantCalWORKs?: boolean
  // Condiciones especiales
  hasDisability?: boolean
  isHomeless?: boolean
  isPregnant?: boolean
  pregnantDueDate?: string
  // Emergencia CalFresh expedited
  requestExpedited?: boolean
  emergLess100?: boolean
  emergLowIncome?: boolean
  emergUnemployed?: boolean
  emergMigrant?: boolean
  emergEviction?: boolean
  emergOther?: boolean
  emergOtherText?: string
  // Etnicidad (opcional)
  isHispanic?: boolean
  race?: 'white' | 'black' | 'asian' | 'native' | 'pacific' | 'other'
  // Fecha de firma
  signDate?: string
}

/**
 * Rellena el formulario oficial SAWS-1 de California con los datos del solicitante.
 * Requiere que /public/forms/saws1.pdf esté disponible en el servidor.
 */
export async function fillSaws1AcroForm(data: Saws1FormData): Promise<Uint8Array> {
  const pdfPath = '/forms/saws1.pdf'

  // Cargar el PDF oficial
  const res = await fetch(pdfPath)
  if (!res.ok) throw new Error(`SAWS-1 PDF no encontrado en ${pdfPath}`)
  const pdfBytes = await res.arrayBuffer()

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const form = pdfDoc.getForm()

  // ── Helper para setear campos de forma segura ─────────────────────────
  function setText(fieldName: string, value: string | undefined) {
    if (!value) return
    try {
      form.getTextField(fieldName).setText(value)
    } catch {
      // Campo no encontrado — ignorar silenciosamente
    }
  }

  function setCheck(fieldName: string, checked: boolean) {
    if (!checked) return
    try {
      const cb = form.getCheckBox(fieldName)
      if (checked) cb.check()
      else cb.uncheck()
    } catch {
      // Campo no encontrado — ignorar silenciosamente
    }
  }

  // ── Datos del solicitante ─────────────────────────────────────────────
  setText(F.name, data.fullName)
  setText(F.nameOther, data.otherName)
  setText(F.ssn, data.ssn)

  // ── Dirección física ──────────────────────────────────────────────────
  setText(F.homeAddress, data.streetAddress + (data.unit ? ` ${data.unit}` : ''))
  setText(F.homeCity, data.city)
  setText(F.homeCounty, data.county)
  setText(F.homeState, data.state ?? 'CA')
  setText(F.homeZip, data.zip)

  // ── Dirección de correo ───────────────────────────────────────────────
  if (!data.sameMailAddress && data.mailStreet) {
    setText(F.mailAddress, data.mailStreet + (data.mailUnit ? ` ${data.mailUnit}` : ''))
    setText(F.mailCity, data.mailCity)
    setText(F.mailCounty, data.mailCounty)
    setText(F.mailState, 'CA')
    setText(F.mailZip, data.mailZip)
  }

  // ── Contacto ──────────────────────────────────────────────────────────
  setText(F.phoneHome, data.phone)
  setText(F.phoneAlt, data.altPhone)
  setText(F.email, data.email)

  // Email notifications
  if (data.wantEmailNotifications && data.email) {
    setCheck(F.emailApp1, true)
    setCheck(F.emailCase1, true)
  } else {
    setCheck(F.emailApp2, true)
    setCheck(F.emailCase2, true)
  }

  // ── Programas solicitados ─────────────────────────────────────────────
  setCheck(F.wantCalFresh, data.wantCalFresh)
  setCheck(F.wantMediCal, data.wantMediCal)
  setCheck(F.wantCalWORKs, data.wantCalWORKs ?? false)

  // ── Condiciones especiales ────────────────────────────────────────────
  if (data.hasDisability !== undefined) {
    setCheck(F.hasDisability, data.hasDisability)
    setCheck(F.noDisability, !data.hasDisability)
  }
  if (data.isHomeless !== undefined) {
    setCheck(F.isHomeless, data.isHomeless)
    setCheck(F.notHomeless, !data.isHomeless)
  }
  if (data.isPregnant !== undefined) {
    setCheck(F.isPregnant, data.isPregnant)
    setCheck(F.notPregnant, !data.isPregnant)
  }

  // ── CalFresh Expedited (emergencia) ───────────────────────────────────
  const hasAnyEmergency = data.requestExpedited ||
    data.emergLess100 || data.emergLowIncome || data.emergUnemployed ||
    data.emergMigrant || data.emergEviction || data.emergOther

  if (hasAnyEmergency) {
    setCheck(F.emergency1, true)
    setCheck(F.emergLess100, data.emergLess100 ?? false)
    setCheck(F.emergLowIncome, data.emergLowIncome ?? false)
    setCheck(F.emergUnemployed, data.emergUnemployed ?? false)
    setCheck(F.emergMigrant, data.emergMigrant ?? false)
    setCheck(F.emergEviction, data.emergEviction ?? false)
    if (data.emergOther) {
      setCheck(F.emergOther, true)
      setText(F.emergOtherText, data.emergOtherText)
    }
  } else {
    setCheck(F.noEmergency, true)
  }

  // ── Etnicidad (opcional) ──────────────────────────────────────────────
  if (data.isHispanic !== undefined) {
    setCheck(F.isHispanic1, data.isHispanic)
    setCheck(F.isHispanic2, !data.isHispanic)
  }
  if (data.race) {
    const raceMap: Record<string, string> = {
      white: F.raceWhite,
      black: F.raceBlack,
      asian: F.raceAsian,
      native: F.raceNative,
      pacific: F.racePacific,
      other: F.raceOther,
    }
    if (raceMap[data.race]) setCheck(raceMap[data.race], true)
  }

  // ── Fecha de firma ────────────────────────────────────────────────────
  const today = data.signDate ?? new Date().toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
  })
  setText(F.signDate, today)

  // ── Aplanar y devolver bytes ──────────────────────────────────────────
  // NO aplanamos para que el usuario pueda revisar y firmar
  return pdfDoc.save()
}
