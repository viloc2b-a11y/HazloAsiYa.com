import Anthropic from '@anthropic-ai/sdk'
import { FunnelId, FUNNELS } from '@/data/funnels'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
  const funnel = FUNNELS[funnelId]

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Eres HazloAsíYa, una plataforma que ayuda a familias hispanas en EE.UU. a completar trámites de gobierno.

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

Sé específico con los datos del usuario. Usa los datos reales del formulario. Todos los pasos deben ser accionables y concretos.`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as GeneratedResult
}
