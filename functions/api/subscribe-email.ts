type Env = {
  EMAIL_PROVIDER?: string
  CONVERTKIT_API_KEY?: string
  CONVERTKIT_FORM_ID?: string
  BREVO_API_KEY?: string
  BREVO_LIST_ID?: string
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      email?: string
      funnelId?: string
      consent?: boolean
    }
    const email = body.email?.trim().toLowerCase()
    const funnelId = body.funnelId?.trim() || 'general'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Correo inválido' }, 400)
    }
    if (!body.consent) return json({ error: 'Se requiere consentimiento explícito' }, 400)

    const env = context.env
    const provider = (env.EMAIL_PROVIDER || 'convertkit').toLowerCase()

    if (provider === 'convertkit') {
      const apiKey = env.CONVERTKIT_API_KEY
      const formId = env.CONVERTKIT_FORM_ID
      if (!apiKey || !formId) return json({ error: 'Newsletter no configurado (ConvertKit)' }, 501)

      const r = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          fields: { tramite: funnelId },
        }),
      })
      const data = await r.json().catch(() => null)
      if (!r.ok) {
        return json({ error: (data as { message?: string })?.message || 'ConvertKit error' }, 502)
      }
      return json({ ok: true, provider: 'convertkit' })
    }

    if (provider === 'brevo') {
      const apiKey = env.BREVO_API_KEY
      const listId = parseInt(env.BREVO_LIST_ID || '', 10)
      if (!apiKey || !listId) return json({ error: 'Newsletter no configurado (Brevo)' }, 501)

      const r = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          listIds: [listId],
          attributes: { TRAMITE: funnelId },
          updateEnabled: true,
        }),
      })
      if (!r.ok) {
        const text = await r.text().catch(() => '')
        return json({ error: text || 'Brevo error' }, 502)
      }
      return json({ ok: true, provider: 'brevo' })
    }

    return json({ error: `Proveedor desconocido: ${provider}` }, 400)
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}
