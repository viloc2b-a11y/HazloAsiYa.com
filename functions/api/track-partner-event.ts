/**
 * /api/track-partner-event
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudflare Pages Function that records a partner_events row in Supabase.
 *
 * POST body:
 * {
 *   partner_slug:      string   (required)
 *   event_type:        "visit" | "funnel_start" | "funnel_complete" | "purchase"
 *   funnel_id?:        string   e.g. "snap" | "medicaid" | "wic"
 *   state_slug?:       string   e.g. "texas" | "california"
 *   session_id?:       string
 *   user_id?:          string   (UUID)
 *   purchase_id?:      string   (UUID)
 *   organization_type?: string
 *   referral_source?:  string
 *   referral_city?:    string
 *   referral_state?:   string
 * }
 *
 * This endpoint is fire-and-forget from the frontend — errors are swallowed
 * so they never block the user flow.
 */

type Env = {
  SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  SUPABASE_SECRET_KEY?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  })
}

const VALID_EVENT_TYPES = new Set(['visit', 'funnel_start', 'funnel_complete', 'purchase'])

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const supabaseUrl = context.env.SUPABASE_URL || context.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !serviceKey) {
      // Silently succeed if Supabase is not configured (dev / staging)
      return json({ ok: true, skipped: true, reason: 'supabase_not_configured' })
    }

    const body = await context.request.json().catch(() => ({})) as Record<string, unknown>

    const partner_slug = typeof body.partner_slug === 'string' ? body.partner_slug.trim() : null
    const event_type = typeof body.event_type === 'string' ? body.event_type.trim() : null

    if (!partner_slug) return json({ error: 'partner_slug required' }, 400)
    if (!event_type || !VALID_EVENT_TYPES.has(event_type)) {
      return json({ error: 'event_type must be one of: visit, funnel_start, funnel_complete, purchase' }, 400)
    }

    const row: Record<string, unknown> = {
      partner_slug,
      event_type,
      funnel_id:         typeof body.funnel_id === 'string' ? body.funnel_id : null,
      state_slug:        typeof body.state_slug === 'string' ? body.state_slug : null,
      session_id:        typeof body.session_id === 'string' ? body.session_id : null,
      user_id:           typeof body.user_id === 'string' ? body.user_id : null,
      purchase_id:       typeof body.purchase_id === 'string' ? body.purchase_id : null,
      metadata: {
        organization_type: body.organization_type ?? null,
        referral_source:   body.referral_source ?? null,
        referral_city:     body.referral_city ?? null,
        referral_state:    body.referral_state ?? null,
      },
    }

    const r = await fetch(`${supabaseUrl}/rest/v1/partner_events`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        'content-type': 'application/json',
        prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    })

    if (!r.ok) {
      const text = await r.text().catch(() => '')
      // Log but don't fail — tracking should never block the user
      console.error(`[track-partner-event] Supabase error ${r.status}: ${text}`)
      return json({ ok: false, error: `Supabase ${r.status}` }, 200) // 200 intentional
    }

    return json({ ok: true })
  } catch (e: unknown) {
    // Swallow all errors — tracking must never break the funnel
    console.error('[track-partner-event]', e)
    return json({ ok: false, error: e instanceof Error ? e.message : 'Error' }, 200)
  }
}
