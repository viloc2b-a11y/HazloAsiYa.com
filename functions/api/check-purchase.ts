type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = context.env.SUPABASE_URL
    const key = context.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return json({ error: 'Configuración incompleta' }, 500)
    }

    const { searchParams } = new URL(context.request.url)
    const email = searchParams.get('email')?.trim() || ''
    const funnel = searchParams.get('funnel')?.trim() || ''
    if (!email || !funnel) {
      return json({ error: 'Faltan email o funnel' }, 400)
    }

    const q = new URLSearchParams({
      select: 'id',
      email: `eq.${email}`,
      funnel: `eq.${funnel}`,
      limit: '1',
    })
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/purchases?${q}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return json({ error: 'Error al consultar compras', detail: text.slice(0, 200) }, 500)
    }

    const rows = (await res.json()) as unknown[]
    return json({ paid: Array.isArray(rows) && rows.length > 0 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido'
    return json({ error: msg }, 500)
  }
}
