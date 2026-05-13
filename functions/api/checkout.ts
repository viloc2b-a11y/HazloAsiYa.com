/** Precios y etiquetas: fuente única `data/checkout-prices.json`. */
import { normalizeHazloOrigin } from '../../lib/canonical-origin'
import checkoutPricesData from '../../data/checkout-prices.json'

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

function isValidEmail(s: string): boolean {
  const t = s.trim()
  if (t.length > 254 || t.length < 3) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

type PriceRow = { priceCents: number; label: string }
const rows = checkoutPricesData.products as Record<string, PriceRow>

const PRODUCT_PRICE_CENTS: Record<string, number> = {}
const PRODUCT_LABEL: Record<string, string> = {}
for (const [key, row] of Object.entries(rows)) {
  PRODUCT_PRICE_CENTS[key] = row.priceCents
  PRODUCT_LABEL[key] = row.label
}

/** Nota en el pago para el webhook (sin `;` ni `=` dentro de valores codificados problemáticos). */
function buildPaymentNote(args: {
  userId: string
  productId: string
  funnelId: string
  email: string
  partnerSlug?: string | null
}) {
  const emailSafe = encodeURIComponent(args.email)
  let note = `userId=${args.userId};productId=${args.productId};funnelId=${args.funnelId};email=${emailSafe}`
  if (args.partnerSlug) note += `;ref=${encodeURIComponent(args.partnerSlug)}`
  return note
}

type SquarePaymentLinkResponse = {
  errors?: Array<{ detail?: string; code?: string; category?: string }>
  payment_link?: { url?: string }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env
  const rawToken = typeof env.SQUARE_ACCESS_TOKEN === 'string' ? env.SQUARE_ACCESS_TOKEN : ''
  console.log('checkout: env vars present', {
    hasToken: Boolean(rawToken.trim()),
    hasLocationId: Boolean(String(env.SQUARE_LOCATION_ID || '').trim()),
    tokenPrefix: rawToken.trim() ? rawToken.trim().slice(0, 10) : null,
  })

  if (!String(env.SQUARE_ACCESS_TOKEN || '').trim() || !String(env.SQUARE_LOCATION_ID || '').trim()) {
    return json(
      {
        error:
          'Pagos no configurados: en Cloudflare Pages → Settings → Environment variables añade SQUARE_ACCESS_TOKEN y SQUARE_LOCATION_ID (y vuelve a desplegar si hace falta).',
      },
      503,
    )
  }

  try {
    const body = (await context.request.json()) as {
      productId?: string
      userId?: string
      email?: string
      funnelId?: string
      /** Ruta absoluta en el sitio (p. ej. `/pdf/itin/?paid=1`) para volver tras Square. */
      returnPath?: string
      /** Partner slug from ?ref= attribution */
      partnerSlug?: string | null
    }

    const productId = body.productId?.trim() || ''
    const userId = body.userId?.trim() || ''
    const emailRaw = typeof body.email === 'string' ? body.email : ''
    const funnelId = body.funnelId?.trim() || ''

    if (!PRODUCT_PRICE_CENTS[productId]) return json({ error: 'Producto inválido' }, 400)
    if (!userId) return json({ error: 'Falta userId' }, 400)
    if (!emailRaw.trim()) return json({ error: 'Falta email' }, 400)
    if (!isValidEmail(emailRaw)) return json({ error: 'Email inválido' }, 400)

    const accessToken = String(env.SQUARE_ACCESS_TOKEN).trim()
    const locationId = String(env.SQUARE_LOCATION_ID).trim()

    const email = emailRaw.trim().toLowerCase()
    const lineItemPrice = PRODUCT_PRICE_CENTS[productId]
    const label = PRODUCT_LABEL[productId] || productId

    const appUrl = normalizeHazloOrigin(
      env.NEXT_PUBLIC_APP_URL || new URL(context.request.url).origin,
    )
    const returnPathRaw = typeof body.returnPath === 'string' ? body.returnPath.trim() : ''
    const redirectUrl =
      returnPathRaw && returnPathRaw.startsWith('/')
        ? `${appUrl}${returnPathRaw}`
        : `${appUrl}/${funnelId || 'snap'}/result/?paid=1`

    const idempotencyKey = crypto.randomUUID()

    const squareBody = {
      idempotency_key: idempotencyKey,
      description: `HazloAsíYa — ${label}`,
      order: {
        location_id: locationId,
        line_items: [
          {
            name: label,
            quantity: '1',
            base_price_money: { amount: lineItemPrice, currency: 'USD' },
          },
        ],
        metadata: {
          email,
          product_id: productId,
          funnel: funnelId,
          ...(body.partnerSlug ? { partner_slug: body.partnerSlug } : {}),
        },
      },
      payment_note: buildPaymentNote({ userId, productId, funnelId, email, partnerSlug: body.partnerSlug }),
      checkout_options: {
        redirect_url: redirectUrl,
        ask_for_shipping_address: false,
      },
      pre_populated_data: {
        buyer_email: email,
      },
    }

    console.log('checkout: calling Square', { productId, redirectUrl })

    const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'square-version': '2025-01-23',
      },
      body: JSON.stringify(squareBody),
    })

    const squareResponseBody = await response.text()
    let data: SquarePaymentLinkResponse | null = null
    try {
      if (squareResponseBody) data = JSON.parse(squareResponseBody) as SquarePaymentLinkResponse
    } catch {
      data = null
    }

    if (!response.ok) {
      console.error('Square checkout failed', {
        status: response.status,
        body: squareResponseBody,
      })
      const errs = Array.isArray(data?.errors) ? data.errors : []
      const parts = errs
        .map((e: { detail?: string; code?: string }) => [e?.detail, e?.code].filter(Boolean).join(' — '))
        .filter(Boolean)
      const msg = parts.join(' · ') || `Square respondió ${response.status}`
      return json({ error: msg }, 502)
    }

    const checkoutUrl = data?.payment_link?.url
    if (!checkoutUrl) return json({ error: 'Square no devolvió URL' }, 502)
    return json({ checkoutUrl })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error'
    console.error('checkout unhandled error:', message, e)
    return json({ error: message }, 502)
  }
}
