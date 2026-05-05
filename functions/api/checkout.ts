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

function requireEnv(env: Partial<Env>, key: keyof Env) {
  const val = env[key]
  if (!val) throw new Error(`Missing env: ${String(key)}`)
  return val
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
}) {
  const emailSafe = encodeURIComponent(args.email)
  return `userId=${args.userId};productId=${args.productId};funnelId=${args.funnelId};email=${emailSafe}`
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env
    const accessToken = requireEnv(env, 'SQUARE_ACCESS_TOKEN')
    const locationId = requireEnv(env, 'SQUARE_LOCATION_ID')

    const body = (await context.request.json()) as {
      productId?: string
      userId?: string
      email?: string
      funnelId?: string
      /** Ruta absoluta en el sitio (p. ej. `/pdf/itin/?paid=1`) para volver tras Square. */
      returnPath?: string
    }

    const productId = body.productId?.trim() || ''
    const userId = body.userId?.trim() || ''
    const emailRaw = typeof body.email === 'string' ? body.email : ''
    const funnelId = body.funnelId?.trim() || ''

    if (!PRODUCT_PRICE_CENTS[productId]) return json({ error: 'Producto inválido' }, 400)
    if (!userId) return json({ error: 'Falta userId' }, 400)
    if (!emailRaw.trim()) return json({ error: 'Falta email' }, 400)
    if (!isValidEmail(emailRaw)) return json({ error: 'Email inválido' }, 400)

    const email = emailRaw.trim()
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
        },
      },
      payment_note: buildPaymentNote({ userId, productId, funnelId, email }),
      checkout_options: {
        redirect_url: redirectUrl,
        ask_for_shipping_address: false,
      },
      pre_populated_data: {
        buyer_email: email,
      },
    }

    const r = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'square-version': '2025-01-23',
      },
      body: JSON.stringify(squareBody),
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
