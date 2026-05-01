import type { FunnelId } from '@/data/funnels'
import { isValidFunnelId } from '@/data/funnels'

/** Tercera línea del bloque de confianza en /[funnel]/result — acción concreta por trámite. */
const RESULT_TRUST_ACTION_BY_FUNNEL: Record<FunnelId, string> = {
  snap:
    'Puedes usar esta lista tal como está para subir a YourTexasBenefits, preparar la entrevista con HHSC o llevarla en el celular al centro.',
  medicaid:
    'Puedes usar esta lista tal como está para subir documentos hoy o prepararte antes de que te los pidan.',
  itin:
    'Puedes usar esta lista tal como está para preparar tu paquete, llevarlo a un Acceptance Agent o enviarlo con el orden correcto.',
  wic:
    'Puedes usar esta lista tal como está para tu cita en la clínica WIC o para llamar y saber qué traer sin ir dos veces.',
  id:
    'Puedes usar esta lista tal como está para tu cita en el DPS: el orden correcto de documentos evita perder el turno.',
  twc:
    'Puedes usar esta lista tal como está al llenar tu solicitud en unemployment.texas.gov o al llamar al TWC.',
  taxes:
    'Puedes usar esta lista tal como está para reunir papeles antes de VITA, H&R Block o tu preparador.',
  escuela:
    'Puedes usar esta lista tal como está para el portal del distrito o la ventanilla de inscripción.',
  daca:
    'Puedes usar esta lista tal como está para armar tu paquete USCIS y revisarlo antes de enviar.',
  iep:
    'Puedes usar esta lista tal como está para la reunión ARD o para pedir evaluación por escrito al distrito.',
  rent:
    'Puedes usar esta lista tal como está al hablar con el dueño, la PHA o la oficina de vivienda.',
  prek:
    'Puedes usar esta lista tal como está para la solicitud de Pre-K o la cita de elegibilidad.',
  utilities:
    'Puedes usar esta lista tal como está al llamar a tu compañía o aplicar a programas de asistencia.',
  jobs:
    'Puedes usar esta lista tal como está en entrevistas o al registrarte en portales de empleo.',
  bank:
    'Puedes usar esta lista tal como está antes de ir a la sucursal o abrir la cuenta en línea.',
  matricula:
    'Puedes usar esta lista tal como está para la cita en el consulado o el envío de documentos.',
}

const DEFAULT_RESULT_TRUST_ACTION =
  'Puedes usar esta lista tal como está para avanzar hoy: imprímela, súbela al portal o llévala en el celular.'

export function getResultTrustActionLine(funnelId: string): string {
  if (isValidFunnelId(funnelId)) return RESULT_TRUST_ACTION_BY_FUNNEL[funnelId]
  return DEFAULT_RESULT_TRUST_ACTION
}
