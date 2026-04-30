import { createHash } from 'node:crypto'

type Env = {
  MAILCHIMP_API_KEY?: string
  MAILCHIMP_SERVER?: string
  MAILCHIMP_AUDIENCE_ID?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

function mailchimpDatacenterFromKey(apiKey: string): string | undefined {
  const segment = apiKey.split('-').pop()?.trim().toLowerCase()
  if (segment && /^us\d+$/.test(segment)) return segment
  return undefined
}

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
} as const

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      email?: string
      tramite?: string
      firstName?: string
      funnelId?: string
    }

    const apiKey = context.env.MAILCHIMP_API_KEY
    const audience = context.env.MAILCHIMP_AUDIENCE_ID
    const server =
      context.env.MAILCHIMP_SERVER?.trim().toLowerCase() ||
      (apiKey ? mailchimpDatacenterFromKey(apiKey) : undefined)

    if (!apiKey || !audience || !server) {
      return new Response(JSON.stringify({ error: 'Newsletter no configurado' }), {
        status: 501,
        headers: jsonHeaders,
      })
    }

    const emailRaw = body.email?.trim().toLowerCase() || ''
    const tramite = body.tramite?.trim() || body.funnelId?.trim() || 'general'
    const firstName = body.firstName?.trim() || ''

    if (!emailRaw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      return new Response(JSON.stringify({ error: 'Correo inválido' }), {
        status: 400,
        headers: jsonHeaders,
      })
    }

    const subscriberHash = createHash('md5').update(emailRaw).digest('hex')
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${audience}/members/${subscriberHash}`

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: emailRaw,
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
      return new Response(
        JSON.stringify({ error: err?.detail || err?.title || 'Error de Mailchimp' }),
        {
          status: res.status >= 400 && res.status < 600 ? res.status : 502,
          headers: jsonHeaders,
        }
      )
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders })
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: jsonHeaders,
    })
  }
}
