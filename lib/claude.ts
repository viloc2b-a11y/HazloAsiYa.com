import { FunnelId, FUNNELS } from '@/data/funnels'
import OpenAI from 'openai'

export interface GeneratedResult {
  eligible: boolean
  headline: string
  subheadline: string
  haveItems: string[]
  missingItems: string[]
  steps: string[]
}

export async function generateFunnelResult(
  funnelId: FunnelId,
  formData: Record<string, string>,
): Promise<GeneratedResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')

  const client = new OpenAI({ apiKey })
  const funnel = FUNNELS[funnelId]

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

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content ?? ''
  return JSON.parse(text) as GeneratedResult
}
