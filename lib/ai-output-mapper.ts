import type { AIOutput, GeneratedResult } from '../types/ai'

const DOC_LABELS: Record<string, string> = {
  photo_id: 'Identificación con foto',
  proof_address: 'Comprobante de domicilio',
  proof_income: 'Comprobante de ingresos',
  ssn_itin: 'SSN o ITIN',
  immigration: 'Estatus migratorio',
  household: 'Información del hogar',
  expenses: 'Gastos mensuales',
  insurance: 'Seguro médico actual',
  kids_docs: 'Documentos de niños',
  pregnancy_baby: 'Documentación embarazo o bebé',
  birth_cert: 'Acta de nacimiento / pasaporte',
  ssn_card: 'Tarjeta de SSN',
  w2_1099: 'W-2 / 1099',
  dependents: 'Datos de dependientes',
  last_employer: 'Datos del último empleador',
  employment_dates: 'Fechas de empleo',
}

function parseDocsSelected(formData: Record<string, string>): string[] {
  const raw = formData.docsSelected
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function deriveHaveItems(formData: Record<string, string>): string[] {
  const docsMulti = formData.documents_available
  if (docsMulti) {
    try {
      const p = JSON.parse(docsMulti) as unknown
      if (Array.isArray(p) && p.length > 0) {
        const labels = p.filter((x): x is string => typeof x === 'string')
        if (labels.length > 0) return labels.slice(0, 5)
      }
    } catch {
      /* ignore */
    }
  }
  const ids = parseDocsSelected(formData)
  const labels = ids.map(id => DOC_LABELS[id] || id.replace(/_/g, ' '))
  if (labels.length > 0) return labels.slice(0, 5)
  const fallback: string[] = []
  if (formData.familySize || formData.income || formData.household_size) {
    fallback.push('Datos básicos del hogar que compartiste en el cuestionario')
  }
  if (fallback.length === 0) {
    fallback.push('Revisa el resumen del formulario antes de enviar documentos')
  }
  return fallback.slice(0, 5)
}

export function mapAIOutputToGeneratedResult(
  ai: AIOutput,
  formData: Record<string, string>,
): GeneratedResult {
  const eligible = ai.eligibility !== 'unlikely'
  const summary = (ai.summary || '').trim()
  const firstSentence = summary.split(/(?<=[.!?])\s+/)[0]?.trim() || summary
  const headline = firstSentence.length > 90 ? `${firstSentence.slice(0, 87)}…` : firstSentence || 'Revisa tu plan y los documentos sugeridos'
  const errHint =
    ai.common_errors?.length > 0
      ? ` Evita: ${ai.common_errors.slice(0, 2).join(' · ')}`
      : ''
  const subheadline = `${summary}${errHint}`.slice(0, 280)

  const stepsBase = (ai.steps || []).filter(s => typeof s === 'string').slice(0, 6)
  const extraSteps = (ai.common_errors || [])
    .filter(s => typeof s === 'string')
    .slice(0, 2)
    .map(e => `Evita este error común: ${e}`)
  const steps = [...stepsBase, ...extraSteps].slice(0, 7)

  return {
    eligible,
    headline,
    subheadline,
    haveItems: deriveHaveItems(formData),
    missingItems: (ai.missing_documents || []).filter(x => typeof x === 'string').slice(0, 5),
    steps,
  }
}
