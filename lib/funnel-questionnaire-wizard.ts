import type { FunnelId } from '@/data/funnels'
import type { Step } from '@/data/funnels'
import type { QuestionnaireField } from '@/types/ai'
import { getQuestionnaireFields } from '@/lib/ai-prompts'

export const QUESTIONNAIRE_BATCH_SIZE = 3

/** Pasos del wizard derivados del cuestionario específico del trámite. */
export function buildQuestionnaireSteps(funnelId: FunnelId): Step[] {
  const fields = getQuestionnaireFields(funnelId)
  if (fields.length === 0) return []

  const steps: Step[] = []
  for (let i = 0; i < fields.length; i += QUESTIONNAIRE_BATCH_SIZE) {
    const batch = fields.slice(i, i + QUESTIONNAIRE_BATCH_SIZE)
    const desc = batch.map(f => f.label).join(' · ')
    steps.push({
      id: `qb:${i}`,
      title: i === 0 ? 'Tu información' : 'Continúa',
      desc: desc.length > 140 ? `${desc.slice(0, 137)}…` : desc,
    })
  }
  return steps
}

export function fieldsForQuestionnaireStep(funnelId: FunnelId, stepId: string): QuestionnaireField[] {
  const m = /^qb:(\d+)$/.exec(stepId)
  if (!m) return []
  const start = parseInt(m[1], 10)
  return getQuestionnaireFields(funnelId).slice(start, start + QUESTIONNAIRE_BATCH_SIZE)
}

export function questionnaireStepIds(funnelId: FunnelId): Set<string> {
  return new Set(buildQuestionnaireSteps(funnelId).map(s => s.id))
}
