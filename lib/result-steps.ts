/** Funnels donde aplicamos micro-tensión en documentos y sufijo en el último paso del resultado. */
export const RESULT_DOC_TENSION_FUNNELS = new Set(['snap', 'medicaid', 'itin'])

export const RESULT_DOC_TENSION_COPY =
  'Un documento incorrecto o incompleto suele significar que te regresen la solicitud o tengas que volver con otra cita.'

const LAST_STEP_SUFFIX =
  ' Después: recibes confirmación o te piden correcciones; si falta algo, el proceso puede reiniciarse.'

export function augmentResultSteps(funnelId: string, steps: string[]): string[] {
  if (!steps.length || !RESULT_DOC_TENSION_FUNNELS.has(funnelId)) return steps
  const last = steps[steps.length - 1]
  if (last.includes('proceso puede reiniciarse')) return steps
  return [...steps.slice(0, -1), last + LAST_STEP_SUFFIX]
}
