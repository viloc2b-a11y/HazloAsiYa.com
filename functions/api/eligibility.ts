import { generateFunnelResultFromAi } from '../../lib/ai-client'
import { parseEligibilityBody } from '../../lib/eligibility-api'
import type { GeneratedResult } from '../../types/ai'

type Env = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export type { GeneratedResult }

export const onRequestPost: PagesFunction<Env> = async context => {
  try {
    let body: Record<string, unknown>
    try {
      body = (await context.request.json()) as Record<string, unknown>
    } catch {
      return json({ error: 'Cuerpo JSON inválido' }, 400)
    }

    const parsed = parseEligibilityBody(body)
    if (!parsed) {
      return json(
        { error: 'Se requiere funnelId válido y campos del formulario (o formData anidado).' },
        400,
      )
    }

    const secrets = {
      OPENAI_API_KEY: context.env.OPENAI_API_KEY,
      OPENAI_MODEL: context.env.OPENAI_MODEL,
    }

    if (!secrets.OPENAI_API_KEY) {
      return json({ error: 'Missing OPENAI_API_KEY' }, 500)
    }

    const data = await generateFunnelResultFromAi(parsed.funnelId, parsed.formData, secrets)
    return json(data)
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}
