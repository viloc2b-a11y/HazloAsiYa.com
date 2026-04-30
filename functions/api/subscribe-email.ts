type Env = {
  MAILCHIMP_API_KEY?: string
  MAILCHIMP_AUDIENCE_ID?: string
  MAILCHIMP_SERVER?: string
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
      tramite?: string
      firstName?: string
    }
    const email = body.email?.trim().toLowerCase() || ''
    const tramite = body.tramite?.trim() || 'general'
    const firstName = body.firstName?.trim() || ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Correo inválido' }, 400)
    }

    const env = context.env
    const server = env.MAILCHIMP_SERVER || 'us2'
    const apiKey = env.MAILCHIMP_API_KEY
    const audience = env.MAILCHIMP_AUDIENCE_ID
    if (!apiKey || !audience) return json({ error: 'Newsletter no configurado' }, 501)

    const url = `https://${server}.api.mailchimp.com/3.0/lists/${audience}/members`
    const auth = `Basic ${btoa(`anystring:${apiKey}`)}`

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // double opt-in
        merge_fields: {
          FNAME: firstName || '',
          TRAMITE: tramite,
        },
        tags: [tramite, 'hazloasiya-web'],
        language: 'es',
      }),
    })

    const data = (await r.json().catch(() => null)) as null | { title?: string; detail?: string }
    if (r.ok) return json({ ok: true, status: 'pending' })

    if (r.status === 400 && data?.title === 'Member Exists') {
      return json({ ok: true, status: 'exists' })
    }

    // No filtrar detalles sensibles al cliente (key/audience). Mensajes simples.
    if (r.status === 401) return json({ error: 'No se pudo registrar. Intenta más tarde.' }, 502)
    if (r.status === 404) return json({ error: 'No se pudo registrar. Intenta más tarde.' }, 502)

    return json({ error: data?.detail || 'No se pudo registrar. Intenta de nuevo.' }, 502)
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}
