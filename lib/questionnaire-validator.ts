import type { FunnelId } from '../data/funnels'
import { getQuestionnaireFields } from './ai-prompts'

const MAX_PAYLOAD_CHARS = 2000

/** Patrones que no deben enviarse al modelo (datos sensibles). */
const SSN_LIKE = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g
const NINE_DIGITS = /\b\d{9}\b/g

export interface SanitizeForAiResult {
  payload: Record<string, unknown>
  truncated: boolean
  validationErrors: string[]
}

function redactSensitiveStrings(value: string): string {
  return value
    .replace(SSN_LIKE, '[redactado]')
    .replace(NINE_DIGITS, m => (m.length === 9 ? '[redactado]' : m))
}

function sanitizeValue(v: unknown): unknown {
  if (typeof v === 'string') return redactSensitiveStrings(v)
  if (Array.isArray(v)) return v.map(sanitizeValue)
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const o: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      o[k] = sanitizeValue(val)
    }
    return o
  }
  return v
}

function coerceNumber(n: unknown): number | undefined {
  if (typeof n === 'number' && Number.isFinite(n) && n >= 0) return n
  if (typeof n === 'string' && n.trim() !== '') {
    const x = Number(String(n).replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(x) && x >= 0) return x
  }
  return undefined
}

/**
 * Convierte `formData` del wizard actual en objeto seguro para la API de IA.
 * No sustituye un formulario dinámico por `QUESTIONNAIRE_FIELDS`; solo sanea y recorta.
 */
export function sanitizeFormDataForAi(
  funnelId: FunnelId,
  formData: Record<string, string>,
): SanitizeForAiResult {
  const validationErrors: string[] = []
  const fields = getQuestionnaireFields(funnelId)

  const out: Record<string, unknown> = {}
  for (const [k, raw] of Object.entries(formData)) {
    if (raw === undefined || raw === '') continue
    const trimmed = redactSensitiveStrings(String(raw))
    const meta = fields.find(f => f.id === k)
    if (meta?.type === 'number' || meta?.type === 'currency') {
      const n = coerceNumber(trimmed)
      out[k] = n ?? trimmed
      if (meta.required && n === undefined && trimmed !== '') {
        validationErrors.push(`Campo numérico inválido: ${k}`)
      }
    } else {
      out[k] = trimmed
    }
  }

  let serialized = JSON.stringify(sanitizeValue(out))
  let truncated = false
  if (serialized.length > MAX_PAYLOAD_CHARS) {
    truncated = true
    console.warn(
      `[questionnaire-validator] Payload truncado de ${serialized.length} a ~${MAX_PAYLOAD_CHARS} chars (funnel=${funnelId})`,
    )
    serialized = serialized.slice(0, MAX_PAYLOAD_CHARS)
    try {
      const partial = JSON.parse(serialized) as Record<string, unknown>
      return { payload: partial, truncated, validationErrors }
    } catch {
      return { payload: { _truncated_note: 'payload demasiado largo' }, truncated, validationErrors }
    }
  }

  return { payload: out, truncated, validationErrors }
}

/** Comprueba campos `required` del cuestionario ideal (si existen ids en formData). */
export function validateRequiredQuestionnaireFields(
  funnelId: FunnelId,
  formData: Record<string, string>,
): string[] {
  const missing: string[] = []
  for (const f of getQuestionnaireFields(funnelId)) {
    if (!f.required) continue
    const v = formData[f.id]
    if (v === undefined || String(v).trim() === '') missing.push(f.id)
  }
  return missing
}
