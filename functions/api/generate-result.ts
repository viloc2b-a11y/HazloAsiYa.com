import type { FunnelId } from '../../data/funnels'
import { FUNNELS } from '../../data/funnels'
import { generateFunnelResultFromAi } from '../../lib/ai-client'
import type { GeneratedResult } from '../../types/ai'

type Env = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  ANTHROPIC_API_KEY?: string
  ANTHROPIC_MODEL?: string
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
    const body = (await context.request.json()) as {
      funnelId?: string
      formData?: Record<string, string>
    }
    const funnelId = body.funnelId as FunnelId | undefined
    const formData = body.formData || {}

    if (!funnelId || !FUNNELS[funnelId]) {
      return json({ error: 'Trámite inválido' }, 400)
    }

    const secrets = {
      OPENAI_API_KEY: context.env.OPENAI_API_KEY,
      OPENAI_MODEL: context.env.OPENAI_MODEL,
      ANTHROPIC_API_KEY: context.env.ANTHROPIC_API_KEY,
      ANTHROPIC_MODEL: context.env.ANTHROPIC_MODEL,
    }

    if (!secrets.OPENAI_API_KEY && !secrets.ANTHROPIC_API_KEY) {
      return json({ error: 'Missing OPENAI_API_KEY or ANTHROPIC_API_KEY' }, 500)
    }

    const parsed = await generateFunnelResultFromAi(funnelId, formData, secrets)
    return json(parsed)
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}
