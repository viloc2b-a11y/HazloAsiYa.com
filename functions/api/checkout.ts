type Env = {
  SQUARE_ACCESS_TOKEN: string
  SQUARE_LOCATION_ID: string
  NEXT_PUBLIC_APP_URL?: string
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

function requireEnv(env: Partial<Env>, key: keyof Env) {
  const val = env[key]
  if (!val) throw new Error(`Missing env: ${String(key)}`)
  return val
}

const PRODUCT_PRICE_CENTS: Record<string, number> = {
  main: 1900,
  annual: 4900,
  assisted: 8900,
}

const PRODUCT_LABEL: Record<string, string> = {
  main: 'Guía Completa por Trámite',
  annual: 'Acceso Anual — 16 Trámites',
  assisted: 'Revisión Asistida por Especialista',
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env
    const accessToken = requireEnv(env, 'SQUARE_ACCESS_TOKEN')
    const locationId = requireEnv(env, 'SQUARE_LOCATION_ID')

    const { productId, userId, userEmail, funnelId } = (await context.request.json()) as {
      productId: 'main' | 'annual' | 'assisted'
      userId: string
      userEmail?: string
      funnelId?: string
    }

    if (!PRODUCT_PRICE_CENTS[productId]) return json({ error: 'Producto inválido' }, 400)
    if (!userId) return json({ error: 'Falta userId' }, 400)

    const appUrl = env.NEXT_PUBLIC_APP_URL || new URL(context.request.url).origin

    // Square Payment Links API (hosted checkout)
    const idempotencyKey = crypto.randomUUID()
    const lineItemPrice = PRODUCT_PRICE_CENTS[productId]
    const label = PRODUCT_LABEL[productId] || productId

    const body = {
      idempotency_key: idempotencyKey,
      description: `HazloAsíYa — ${label}`,
      quick_pay: {
        name: label,
        price_money: { amount: lineItemPrice, currency: 'USD' },
        location_id: locationId,
      },
      // Use a reference_id so webhook can map it back.
      // Keep it short-ish and parseable.
      payment_note: `userId=${userId};productId=${productId};funnelId=${funnelId || ''};email=${userEmail || ''}`,
      checkout_options: {
        redirect_url: `${appUrl}/${funnelId || 'snap'}/result?paid=1`,
        ask_for_shipping_address: false,
      },
    }

    const r = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'square-version': '2025-01-23',
      },
      body: JSON.stringify(body),
    })

    const data = await r.json().catch(() => null)
    if (!r.ok) {
      return json({ error: data?.errors?.[0]?.detail || 'Square error', details: data }, 502)
    }

    const checkoutUrl = data?.payment_link?.url
    if (!checkoutUrl) return json({ error: 'Square no devolvió URL' }, 502)
    return json({ checkoutUrl })
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}

