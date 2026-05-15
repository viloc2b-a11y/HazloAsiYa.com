/**
 * /api/send-partner-report — Monthly impact report email for Alianza partners
 * ─────────────────────────────────────────────────────────────────────────────
 * Sends a branded HTML email to one or all active partners with their
 * monthly impact stats (partner-referred activity, tramites, estimated savings).
 *
 * Called:
 *   - Manually: POST /api/send-partner-report { slug?: string, month?: "2026-05" }
 *   - Automatically: Cloudflare Cron Trigger on the 1st of each month
 *     (configure in wrangler.toml: crons = ["0 10 1 * *"])
 *
 * Required env vars (Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY        — from resend.com
 *   SUPABASE_URL          — your Supabase project URL
 *   SUPABASE_SERVICE_KEY  — service role key (not anon)
 *
 * Optional:
 *   REPORT_FROM_EMAIL     — defaults to "alianza@hazloasiya.com"
 *   REPORT_FROM_NAME      — defaults to "Alianza HazloAsíYa"
 */

import checkoutPricesData from '../../data/checkout-prices.json'

const MAIN_PRICE_DOLLARS = checkoutPricesData.products.main.priceCents / 100

type Env = {
  RESEND_API_KEY?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_KEY?: string
  REPORT_FROM_EMAIL?: string
  REPORT_FROM_NAME?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
} as const

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function supabaseQuery(url: string, key: string, query: string) {
  const res = await fetch(`${url}/rest/v1/${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`)
  return res.json()
}

// ── Stats calculation ─────────────────────────────────────────────────────────

interface PartnerStats {
  visits: number
  funnelStarts: number
  purchases: number
  revenue: number
  topFunnels: { funnel: string; count: number }[]
}

async function getPartnerStats(
  supabaseUrl: string,
  supabaseKey: string,
  slug: string,
  monthStart: string,
  monthEnd: string
): Promise<PartnerStats> {
  // Get events for this partner in this month
  const events = await supabaseQuery(
    supabaseUrl,
    supabaseKey,
    `partner_events?partner_slug=eq.${encodeURIComponent(slug)}&created_at=gte.${monthStart}&created_at=lt.${monthEnd}&select=event_type,funnel_id`
  ) as { event_type: string; funnel_id: string | null }[]

  const visits = events.filter(e => e.event_type === 'visit').length
  const funnelStarts = events.filter(e => e.event_type === 'funnel_start').length

  // Get purchases for this partner in this month
  const purchases = await supabaseQuery(
    supabaseUrl,
    supabaseKey,
    `purchases?partner_slug=eq.${encodeURIComponent(slug)}&created_at=gte.${monthStart}&created_at=lt.${monthEnd}&select=id`
  ) as { id: string }[]

  // Count funnel distribution
  const funnelCounts: Record<string, number> = {}
  for (const e of events) {
    if (e.event_type === 'funnel_complete' && e.funnel_id) {
      funnelCounts[e.funnel_id] = (funnelCounts[e.funnel_id] ?? 0) + 1
    }
  }
  const topFunnels = Object.entries(funnelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([funnel, count]) => ({ funnel, count }))

  return {
    visits,
    funnelStarts,
    purchases: purchases.length,
    revenue: purchases.length * MAIN_PRICE_DOLLARS,
    topFunnels,
  }
}

// ── Email HTML template ───────────────────────────────────────────────────────

const FUNNEL_LABELS: Record<string, string> = {
  snap: 'SNAP / Estampillas',
  medicaid: 'Medicaid',
  wic: 'WIC',
  itin: 'ITIN',
  daca: 'DACA',
}

const ORG_GREETINGS: Record<string, string> = {
  iglesia: 'Estimado pastor y equipo',
  clinica: 'Estimado equipo de la clínica',
  nonprofit: 'Estimado equipo',
  escuela: 'Estimado equipo escolar',
  consulado: 'Estimado equipo consular',
  default: 'Estimado equipo',
}

function buildEmailHtml(
  partner: { name: string; slug: string; organization_type: string | null; city: string | null; state: string | null; tier: string; revenue_share_pct: number },
  stats: PartnerStats,
  monthLabel: string
): string {
  const greeting = ORG_GREETINGS[partner.organization_type ?? 'default'] ?? ORG_GREETINGS.default
  const savings = stats.purchases * 240 // avg $240 saved per family vs hiring a notary
  const revenueShare = Math.floor(stats.revenue * (partner.revenue_share_pct / 100))
  const reportUrl = `https://hazloasiya.com/alianza/reporte/${partner.slug}/`

  const funnelRows = stats.topFunnels.length > 0
    ? stats.topFunnels.map(f => `
        <tr>
          <td style="padding:8px 0;color:#0A2540;font-size:14px;">${FUNNEL_LABELS[f.funnel] ?? f.funnel}</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;color:#0A2540;font-size:14px;">${f.count} personas</td>
        </tr>`).join('')
    : `<tr><td colspan="2" style="padding:8px 0;color:rgba(10,37,64,0.4);font-size:13px;">Sin datos de trámites este mes.</td></tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte mensual — ${partner.name}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0A2540;border-radius:20px 20px 0 0;padding:32px 40px;text-align:center;">
              <div style="font-size:26px;font-weight:900;color:white;letter-spacing:-0.5px;">
                HazloAsí<span style="color:#0EC96A;">Ya</span>
              </div>
              <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">Alianza de Partners Comunitarios</div>
            </td>
          </tr>

          <!-- Green bar -->
          <tr><td style="background:#0EC96A;height:4px;"></td></tr>

          <!-- Body -->
          <tr>
            <td style="background:white;padding:36px 40px;">

              <!-- Greeting -->
              <p style="color:rgba(10,37,64,0.5);font-size:13px;margin:0 0 4px;">${monthLabel}</p>
              <h1 style="color:#0A2540;font-size:22px;font-weight:800;margin:0 0 6px;">${greeting},</h1>
              <p style="color:rgba(10,37,64,0.6);font-size:14px;margin:0 0 28px;line-height:1.6;">
                Aquí está el reporte de impacto de <strong>${partner.name}</strong> para este mes.
                Gracias por conectar a tu comunidad con HazloAsíYa.
              </p>

              <!-- Big number -->
              <div style="background:#F5F0E8;border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
                <div style="font-size:56px;font-weight:900;color:#0A2540;line-height:1;">${stats.purchases}</div>
                <div style="color:rgba(10,37,64,0.5);font-size:14px;margin-top:6px;">Personas orientadas con tu enlace (este mes)</div>
              </div>

              <!-- 4 KPIs -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding:0 6px 12px 0;">
                    <div style="background:#F5F0E8;border-radius:12px;padding:16px;text-align:center;">
                      <div style="font-size:24px;font-weight:800;color:#0A2540;">${stats.visits}</div>
                      <div style="color:rgba(10,37,64,0.5);font-size:12px;margin-top:2px;">visitas</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 12px 6px;">
                    <div style="background:#F5F0E8;border-radius:12px;padding:16px;text-align:center;">
                      <div style="font-size:24px;font-weight:800;color:#0A2540;">${stats.funnelStarts}</div>
                      <div style="color:rgba(10,37,64,0.5);font-size:12px;margin-top:2px;">cuestionarios iniciados</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:0 6px 0 0;">
                    <div style="background:#0EC96A;border-radius:12px;padding:16px;text-align:center;">
                      <div style="font-size:24px;font-weight:800;color:#0A2540;">$${savings.toLocaleString()}</div>
                      <div style="color:rgba(10,37,64,0.6);font-size:12px;margin-top:2px;">ahorro estimado</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 0 6px;">
                    <div style="background:#0A2540;border-radius:12px;padding:16px;text-align:center;">
                      <div style="font-size:24px;font-weight:800;color:#0EC96A;">$${revenueShare}</div>
                      <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:2px;">tu revenue share (${partner.revenue_share_pct}%)</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Top funnels -->
              <div style="border-top:1px solid #E8E2D8;padding-top:20px;margin-bottom:28px;">
                <div style="font-size:12px;font-weight:700;color:rgba(10,37,64,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">
                  Trámites más solicitados
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${funnelRows}
                </table>
              </div>

              <!-- CTA button -->
              <div style="text-align:center;margin-bottom:8px;">
                <a href="${reportUrl}"
                   style="display:inline-block;background:#0A2540;color:white;font-weight:800;font-size:14px;
                          padding:14px 28px;border-radius:12px;text-decoration:none;">
                  Ver reporte completo →
                </a>
              </div>
              <p style="text-align:center;color:rgba(10,37,64,0.3);font-size:11px;margin:8px 0 0;">
                ${reportUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#08213A;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 4px;">
                Alianza HazloAsíYa · ${partner.name}
              </p>
              <p style="color:rgba(255,255,255,0.2);font-size:10px;margin:0;">
                Para cancelar tu participación en la Alianza, escríbenos a alianza@hazloasiya.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Main handler ──────────────────────────────────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const resendKey = context.env.RESEND_API_KEY
  const supabaseUrl = context.env.SUPABASE_URL
  const supabaseKey = context.env.SUPABASE_SERVICE_KEY
  const fromEmail = context.env.REPORT_FROM_EMAIL ?? 'alianza@hazloasiya.com'
  const fromName = context.env.REPORT_FROM_NAME ?? 'Alianza HazloAsíYa'

  if (!resendKey || !supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({
      error: 'Faltan variables de entorno: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY',
    }), { status: 501, headers: jsonHeaders })
  }

  // Parse request body
  let body: { slug?: string; month?: string; dryRun?: boolean } = {}
  try {
    body = await context.request.json() as typeof body
  } catch { /* empty body is fine */ }

  // Determine month range
  const now = new Date()
  const monthStr = body.month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [year, month] = monthStr.split('-').map(Number)
  const monthStart = new Date(year, month - 1, 1).toISOString()
  const monthEnd   = new Date(year, month, 1).toISOString()
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  // Fetch partners
  const partnerFilter = body.slug
    ? `partners?slug=eq.${encodeURIComponent(body.slug)}&active=eq.true&select=slug,name,organization_type,city,state,tier,revenue_share_pct,contact_email`
    : `partners?active=eq.true&select=slug,name,organization_type,city,state,tier,revenue_share_pct,contact_email`

  const partners = await supabaseQuery(supabaseUrl, supabaseKey, partnerFilter) as {
    slug: string
    name: string
    organization_type: string | null
    city: string | null
    state: string | null
    tier: string
    revenue_share_pct: number
    contact_email: string | null
  }[]

  if (partners.length === 0) {
    return new Response(JSON.stringify({ error: 'No se encontraron partners activos' }), {
      status: 404, headers: jsonHeaders,
    })
  }

  const results: { slug: string; email: string | null; status: string; error?: string }[] = []

  for (const partner of partners) {
    if (!partner.contact_email) {
      results.push({ slug: partner.slug, email: null, status: 'skipped — no email' })
      continue
    }

    try {
      // Get stats
      const stats = await getPartnerStats(supabaseUrl, supabaseKey, partner.slug, monthStart, monthEnd)

      // Build email
      const html = buildEmailHtml(partner, stats, monthLabel)
      const subject = `📊 Reporte ${monthLabel} — ${partner.name}: ${stats.purchases} personas orientadas con guías`

      if (body.dryRun) {
        results.push({ slug: partner.slug, email: partner.contact_email, status: 'dry-run — email not sent' })
        continue
      }

      // Send via Resend
      const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [partner.contact_email],
          subject,
          html,
        }),
      })

      if (!sendRes.ok) {
        const err = await sendRes.text()
        results.push({ slug: partner.slug, email: partner.contact_email, status: 'error', error: err })
      } else {
        results.push({ slug: partner.slug, email: partner.contact_email, status: 'sent' })
      }
    } catch (err) {
      results.push({ slug: partner.slug, email: partner.contact_email, status: 'error', error: String(err) })
    }
  }

  const sent = results.filter(r => r.status === 'sent').length
  const errors = results.filter(r => r.status === 'error').length

  return new Response(JSON.stringify({
    ok: errors === 0,
    month: monthStr,
    sent,
    errors,
    results,
  }), { status: 200, headers: jsonHeaders })
}

// ── Cron handler (Cloudflare Cron) ───────────────────────────────────────────
// No añadas cron en wrangler.toml de Pages: configúralo en el dashboard del proyecto.
// El disparador programado reutiliza la misma lógica que el POST.
export const onScheduled = async (env: Env) => {
  const fakeRequest = new Request('https://hazloasiya.com/api/send-partner-report', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  })
  return onRequestPost({ request: fakeRequest, env })
}
