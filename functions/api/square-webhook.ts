type Env = {
  SQUARE_WEBHOOK_SIGNATURE_KEY: string
  SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

async function readRawBody(req: Request) {
  const buf = await req.arrayBuffer()
  return new Uint8Array(buf)
}

function toBase64(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  // btoa expects binary string
  return btoa(binary)
}

async function hmacSha256Base64(key: string, message: string) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message))
  return toBase64(new Uint8Array(sig))
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

function parsePaymentNote(note?: string) {
  const out: Record<string, string> = {}
  if (!note) return out
  note.split(';').forEach((part) => {
    const [k, ...rest] = part.split('=')
    if (!k) return
    out[k.trim()] = rest.join('=').trim()
  })
  return out
}

/** Supabase `users.id` is UUID; local-only sessions use ids like `local_*`. */
function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
}

async function supabaseUpdatePlan(args: { supabaseUrl: string; serviceKey: string; userId: string; plan: string }) {
  const { supabaseUrl, serviceKey, userId, plan } = args
  const r = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify({ plan }),
  })
  if (!r.ok) {
    const text = await r.text().catch(() => '')
    throw new Error(`Supabase users update failed: ${r.status} ${text}`)
  }
}

async function supabaseInsertPurchase(args: {
  supabaseUrl: string
  serviceKey: string
  userId: string
  productId: string
  funnelId?: string
  amountCents?: number
  squarePaymentId?: string
}) {
  const { supabaseUrl, serviceKey, userId, productId, funnelId, amountCents, squarePaymentId } = args
  const r = await fetch(`${supabaseUrl}/rest/v1/purchases`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      funnel: funnelId || null,
      amount: Math.round((amountCents || 0) / 100),
      stripe_payment_intent: null,
      square_payment_id: squarePaymentId || null,
    }),
  })
  if (!r.ok) {
    const text = await r.text().catch(() => '')
    throw new Error(`Supabase purchases insert failed: ${r.status} ${text}`)
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const req = context.request
    const signatureKey = context.env.SQUARE_WEBHOOK_SIGNATURE_KEY
    const supabaseUrl = context.env.SUPABASE_URL || context.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = context.env.SUPABASE_SERVICE_ROLE_KEY

    if (!signatureKey || !supabaseUrl || !serviceKey) return json({ error: 'Missing env' }, 500)

    const sigHeader = req.headers.get('x-square-hmacsha256-signature')
    if (!sigHeader) return json({ error: 'Missing signature header' }, 401)

    const raw = await readRawBody(req)
    const bodyText = new TextDecoder().decode(raw)

    // Square signature base string: notification_url + body
    const notificationUrl = new URL(req.url).toString()
    const expected = await hmacSha256Base64(signatureKey, notificationUrl + bodyText)
    if (!safeEqual(sigHeader, expected)) return json({ error: 'Invalid signature' }, 401)

    const event = JSON.parse(bodyText) as any
    const type = event?.type || ''

    // We handle only payment updates that indicate completion.
    // Depending on your Square settings you might receive other types.
    const payment = event?.data?.object?.payment
    const status = payment?.status
    if (!payment || status !== 'COMPLETED') {
      return json({ ok: true, ignored: true, type, status })
    }

    const note = payment?.note || payment?.payment_note || payment?.statement_description_identifier
    const meta = parsePaymentNote(note)

    const productId = meta.productId || 'main'
    const funnelId = meta.funnelId || null
    const userId = meta.userId
    if (!userId) return json({ error: 'Missing userId in payment_note' }, 400)

    if (!isUuid(userId)) {
      return json({
        ok: true,
        skipped: true,
        reason: 'user_id_not_uuid',
      })
    }

    const plan =
      productId === 'annual' ? 'annual' :
      productId === 'assisted' ? 'assisted' :
      'paid_guide'

    const amountMoney = payment?.amount_money
    const amountCents = typeof amountMoney?.amount === 'number' ? amountMoney.amount : undefined
    const squarePaymentId = payment?.id

    await supabaseUpdatePlan({ supabaseUrl, serviceKey, userId, plan })
    await supabaseInsertPurchase({
      supabaseUrl,
      serviceKey,
      userId,
      productId,
      funnelId: funnelId || undefined,
      amountCents,
      squarePaymentId,
    })

    return json({ ok: true })
  } catch (e: unknown) {
    return json({ error: e instanceof Error ? e.message : 'Error' }, 500)
  }
}

