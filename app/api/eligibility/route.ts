import { NextResponse } from 'next/server'
import { generateFunnelResultFromAi } from '@/lib/ai-client'
import { parseEligibilityBody } from '@/lib/eligibility-api'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON inválido' }, { status: 400 })
  }

  const parsed = parseEligibilityBody(body)
  if (!parsed) {
    return NextResponse.json(
      { error: 'Se requiere funnelId válido y campos del formulario (o formData anidado).' },
      { status: 400 },
    )
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
  }

  try {
    const data = await generateFunnelResultFromAi(parsed.funnelId, parsed.formData)
    return NextResponse.json(data, {
      headers: { 'cache-control': 'no-store' },
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error' },
      { status: 500 },
    )
  }
}
