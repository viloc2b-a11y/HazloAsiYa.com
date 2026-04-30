type Env = {
  MAILCHIMP_API_KEY?: string
  MAILCHIMP_SERVER?: string
  MAILCHIMP_AUDIENCE_ID?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      email?: string
      tramite?: string
      firstName?: string
    }
    const { email, tramite, firstName } = body

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      })
    }

    const MAILCHIMP_API_KEY = context.env.MAILCHIMP_API_KEY
    const MAILCHIMP_SERVER = context.env.MAILCHIMP_SERVER
    const MAILCHIMP_AUDIENCE_ID = context.env.MAILCHIMP_AUDIENCE_ID

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_AUDIENCE_ID) {
      return new Response(JSON.stringify({ error: 'Missing env vars' }), {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      })
    }

    const res = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`any:${MAILCHIMP_API_KEY}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
            TRAMITE: tramite || 'general',
          },
        }),
      }
    )

    const data = (await res.json().catch(() => ({}))) as { title?: string; error?: string }

    if (!res.ok) {
      if (data?.title === 'Member Exists') {
        return new Response(JSON.stringify({ duplicate: true }), {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
        })
      }
      const errBody =
        data && typeof data === 'object' && Object.keys(data).length > 0
          ? data
          : { error: 'Error de Mailchimp' }
      return new Response(JSON.stringify(errBody), {
        status: res.status >= 400 && res.status < 600 ? res.status : 502,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    })
  }
}
