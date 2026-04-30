import crypto from 'crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function mailchimpDatacenterFromKey(apiKey: string): string | undefined {
  const segment = apiKey.split('-').pop()?.trim().toLowerCase()
  if (segment && /^us\d+$/.test(segment)) return segment
  return undefined
}

export async function POST(req: Request) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audience = process.env.MAILCHIMP_AUDIENCE_ID
  const server =
    process.env.MAILCHIMP_SERVER?.trim().toLowerCase() ||
    (apiKey ? mailchimpDatacenterFromKey(apiKey) : undefined)

  if (!apiKey || !audience || !server) {
    return NextResponse.json({ error: 'Newsletter no configurado' }, { status: 501 })
  }

  let body: { email?: string; tramite?: string; firstName?: string; funnelId?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase() || ''
  const tramite = body.tramite?.trim() || body.funnelId?.trim() || 'general'
  const firstName = body.firstName?.trim() || ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Correo inválido' }, { status: 400 })
  }

  const subscriberHash = crypto.createHash('md5').update(email).digest('hex')
  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audience}/members/${subscriberHash}`
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        TRAMITE: tramite || 'general',
      },
    }),
  })

  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const err = data as { detail?: string; title?: string }
    return NextResponse.json(
      { error: err?.detail || err?.title || 'Error de Mailchimp' },
      { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
