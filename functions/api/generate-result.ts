import type { FunnelId } from '../../data/funnels'
import { FUNNELS } from '../../data/funnels'

type Env = {
  OPENAI_API_KEY: string
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

export interface GeneratedResult {
  eligible: boolean
  headline: string
  subheadline: string
  haveItems: string[]
  missingItems: string[]
  steps: string[]
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const apiKey = context.env.OPENAI_API_KEY
    if (!apiKey) return json({ error: 'Missing OPENAI_API_KEY' }, 500)

    const body = (await context.request.json()) as {
      funnelId?: string
      formData?: Record<string, string>
    }
    const funnelId = body.funnelId as FunnelId | undefined
    const formData = body.formData || {}

    if (!funnelId || !FUNNELS[funnelId]) {
      return json({ error: 'Trámite inválido' }, 400)
    }

    const funnel = FUNNELS[funnelId]
    const model = context.env.OPENAI_MODEL || 'gpt-4.1-mini'

    const prompt = `Eres HazloAsíYa, una plataforma que ayuda a familias hispanas en EE.UU. a completar trámites de gobierno.

Trámite: ${funnel.name}
Descripción: ${funnel.desc}
Datos del usuario: ${JSON.stringify(formData, null, 2)}

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin texto adicional) con esta estructura exacta:
{
  "eligible": boolean,
  "headline": "Hazlo así: [instrucción específica de máximo 80 caracteres]",
  "subheadline": "Contexto personalizado de máximo 120 caracteres basado en los datos",
  "haveItems": ["3-5 items específicos que el usuario ya tiene según sus datos"],
  "missingItems": ["3-5 items específicos que le faltan conseguir"],
  "steps": ["5-7 pasos exactos y accionables en orden, con detalles específicos"]
}

Sé específico con los datos del usuario. Usa los datos reales del formulario. Todos los pasos deben ser accionables y concretos.`

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    })

    const data = (await r.json().catch(() => null)) as {
      choices?: { message?: { content?: string } }[]
      error?: { message?: string }
    } | null

    if (!r.ok) {
      return json(
        { error: data?.error?.message || 'OpenAI error', details: data },
        502,
      )
    }

    const text = data?.choices?.[0]?.message?.content ?? ''
    const parsed = JSON.parse(text) as GeneratedResult
    return json(parsed)
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}
