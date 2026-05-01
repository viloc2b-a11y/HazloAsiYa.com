import type { FunnelId } from '../data/funnels'
import type { AIOutput, GeneratedResult } from '../types/ai'
import { getSystemPrompt, STANDARD_DISCLAIMER } from './ai-prompts'
import { mapAIOutputToGeneratedResult } from './ai-output-mapper'
import { sanitizeFormDataForAi } from './questionnaire-validator'

/** Credenciales opcionalmente inyectadas (p. ej. Cloudflare `env`). */
export type AiSecrets = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
}

function resolveSecrets(overrides?: AiSecrets): Required<Pick<AiSecrets, 'OPENAI_MODEL'>> & AiSecrets {
  return {
    OPENAI_API_KEY: overrides?.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
    OPENAI_MODEL: overrides?.OPENAI_MODEL ?? process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
  }
}

function stripJsonFence(text: string): string {
  const t = text.trim()
  if (t.startsWith('```')) {
    return t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  }
  return t
}

function isEligibilityLevel(x: unknown): x is AIOutput['eligibility'] {
  return x === 'likely' || x === 'possible' || x === 'unlikely'
}

function parseAIOutput(text: string): AIOutput | null {
  try {
    const raw = stripJsonFence(text)
    const o = JSON.parse(raw) as Record<string, unknown>
    if (!isEligibilityLevel(o.eligibility)) return null
    const summary = typeof o.summary === 'string' ? o.summary : ''
    const missing_documents = Array.isArray(o.missing_documents)
      ? o.missing_documents.filter((x): x is string => typeof x === 'string')
      : []
    const steps = Array.isArray(o.steps)
      ? o.steps.filter((x): x is string => typeof x === 'string').slice(0, 6)
      : []
    const common_errors = Array.isArray(o.common_errors)
      ? o.common_errors.filter((x): x is string => typeof x === 'string').slice(0, 4)
      : []
    const official_links = Array.isArray(o.official_links)
      ? o.official_links.filter((x): x is string => typeof x === 'string')
      : []
    const disclaimer = typeof o.disclaimer === 'string' ? o.disclaimer : STANDARD_DISCLAIMER
    return {
      eligibility: o.eligibility,
      summary,
      missing_documents,
      steps,
      common_errors,
      official_links,
      disclaimer,
    }
  } catch {
    return null
  }
}

function normalizeAIOutput(funnelId: FunnelId, ai: AIOutput): AIOutput {
  let eligibility = ai.eligibility
  if (funnelId === 'daca' && eligibility === 'likely') eligibility = 'possible'
  return {
    ...ai,
    eligibility,
    disclaimer: STANDARD_DISCLAIMER,
    steps: ai.steps.slice(0, 6),
    common_errors: ai.common_errors.slice(0, 4),
  }
}

function fallbackOutput(): AIOutput {
  return {
    eligibility: 'possible',
    summary:
      'Faltan datos o no pudimos leer la respuesta del modelo. Te recomendamos completar el cuestionario y verificar en la fuente oficial.',
    missing_documents: ['Completa los documentos que pide la agencia en su lista oficial'],
    steps: ['Vuelve a intentar en unos minutos', 'Consulta el enlace oficial del trámite para requisitos al día'],
    common_errors: [],
    official_links: [],
    disclaimer: STANDARD_DISCLAIMER,
  }
}

async function callOpenAI(
  system: string,
  userJson: string,
  secrets: ReturnType<typeof resolveSecrets>,
): Promise<string> {
  const apiKey = secrets.OPENAI_API_KEY
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: secrets.OPENAI_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userJson },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    }),
  })
  const data = (await r.json().catch(() => null)) as {
    choices?: { message?: { content?: string } }[]
    error?: { message?: string }
  } | null
  if (!r.ok) {
    throw new Error(data?.error?.message || `OpenAI HTTP ${r.status}`)
  }
  return data?.choices?.[0]?.message?.content ?? ''
}

/**
 * Respuesta JSON estándar (`AIOutput`) vía API de OpenAI (ChatGPT).
 */
export async function getEligibilityResult(
  funnelId: FunnelId,
  userInput: Record<string, unknown>,
  secrets?: AiSecrets,
): Promise<AIOutput> {
  const s = resolveSecrets(secrets)
  const system = getSystemPrompt(funnelId)
  const userJson = JSON.stringify(userInput)

  let text = ''
  try {
    if (!s.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')
    text = await callOpenAI(system, userJson, s)
  } catch {
    return fallbackOutput()
  }

  const parsed = parseAIOutput(text)
  if (!parsed) return fallbackOutput()
  return normalizeAIOutput(funnelId, parsed)
}

/** Pipeline: sanea formulario → IA → `GeneratedResult` para la UI. */
export async function generateFunnelResultFromAi(
  funnelId: FunnelId,
  formData: Record<string, string>,
  secrets?: AiSecrets,
): Promise<GeneratedResult> {
  const { payload } = sanitizeFormDataForAi(funnelId, formData)
  const ai = await getEligibilityResult(funnelId, payload, secrets)
  return mapAIOutputToGeneratedResult(ai, formData)
}
