import OpenAI from 'openai'
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

/** Extrae texto de `responses.create` (SDK v5: `output_text` o `output[].content[].text`). */
function responseOutputText(res: unknown): string {
  if (!res || typeof res !== 'object') return ''
  const r = res as Record<string, unknown>
  if (typeof r.output_text === 'string' && r.output_text.trim()) return r.output_text
  const output = r.output
  if (!Array.isArray(output)) return ''
  for (const item of output) {
    if (!item || typeof item !== 'object') continue
    const content = (item as { content?: unknown }).content
    if (!Array.isArray(content)) continue
    for (const part of content) {
      if (part && typeof part === 'object' && 'text' in part) {
        const t = (part as { text?: unknown }).text
        if (typeof t === 'string' && t.trim()) return t
      }
    }
  }
  return ''
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

function useResponsesApiFirst(): boolean {
  return process.env.OPENAI_USE_RESPONSES_API !== 'false' && process.env.OPENAI_USE_RESPONSES_API !== '0'
}

async function callOpenAIResponses(
  client: OpenAI,
  system: string,
  userJson: string,
  model: string,
): Promise<string> {
  const response = await client.responses.create({
    model,
    instructions: system,
    input: `Datos del usuario (JSON):\n${userJson}\n\nResponde solo con el objeto JSON acordado en las instrucciones.`,
  })
  return responseOutputText(response)
}

async function callOpenAIChat(
  client: OpenAI,
  system: string,
  userJson: string,
  model: string,
): Promise<string> {
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userJson },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  })
  return completion.choices[0]?.message?.content ?? ''
}

async function callOpenAI(
  system: string,
  userJson: string,
  secrets: ReturnType<typeof resolveSecrets>,
): Promise<string> {
  const apiKey = secrets.OPENAI_API_KEY
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')

  const client = new OpenAI({ apiKey })
  const model = secrets.OPENAI_MODEL

  if (useResponsesApiFirst()) {
    try {
      return await callOpenAIResponses(client, system, userJson, model)
    } catch {
      /* p. ej. modelo sin Responses API — seguir con Chat Completions */
    }
  }
  return callOpenAIChat(client, system, userJson, model)
}

/**
 * Respuesta JSON estándar (`AIOutput`): OpenAI SDK — Responses API si aplica, si no Chat Completions.
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
