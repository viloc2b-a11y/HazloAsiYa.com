/**
 * Cron mensual (configurar en el dashboard de Cloudflare Pages → Functions): día 1, 10:00 UTC.
 * Envío del informe vía Resend cuando RESEND_API_KEY y RESEND_REPORT_TO están definidos en Cloudflare.
 *
 * Logs: Workers & Pages → proyecto → Logs.
 */
type ScheduledBits = {
  readonly cron: string
  readonly scheduledTime: number
  readonly type: 'scheduled'
}

type ScheduledEnv = {
  RESEND_API_KEY?: string
  /** Remitente verificado en Resend (dominio o sandbox onboarding@resend.dev). */
  RESEND_FROM?: string
  /** Destinatarios del informe, separados por coma. */
  RESEND_REPORT_TO?: string
  NEXT_PUBLIC_APP_URL?: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendMonthlyReportEmail(env: ScheduledEnv, controller: ScheduledBits): Promise<void> {
  const apiKey = env.RESEND_API_KEY?.trim()
  const rawTo = env.RESEND_REPORT_TO?.trim()
  const from = env.RESEND_FROM?.trim() || 'onboarding@resend.dev'

  if (!apiKey) {
    console.log('[scheduled] RESEND_API_KEY ausente — sin envío Resend (solo cron registrado).')
    return
  }
  if (!rawTo) {
    console.warn('[scheduled] RESEND_REPORT_TO ausente — añade destinatario(s) en variables de entorno.')
    return
  }

  const to = rawTo.split(',').map(s => s.trim()).filter(Boolean)
  if (to.length === 0) return

  const origin = (env.NEXT_PUBLIC_APP_URL || 'https://hazloasiya.com').replace(/\/+$/, '')
  const whenUtc = new Date(controller.scheduledTime).toISOString()

  const subject = `HazloAsíYa — Informe mensual (${whenUtc.slice(0, 10)} UTC)`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;line-height:1.55;color:#082B49;background:#faf9f6;padding:24px">
<p>Hola,</p>
<p>Este correo lo genera el <strong>cron mensual</strong> de HazloAsíYa en Cloudflare.</p>
<ul>
<li><strong>Expresión cron:</strong> <code>${escapeHtml(controller.cron)}</code></li>
<li><strong>Hora programada (UTC):</strong> ${escapeHtml(whenUtc)}</li>
</ul>
<p>Puedes sustituir este cuerpo por un resumen regulatorio, métricas o enlaces útiles en <code>functions/_scheduled.ts</code>.</p>
<p><a href="${origin}/" style="color:#2CA58D;font-weight:600">Abrir HazloAsíYa</a></p>
</body></html>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  const bodyText = await res.text()
  if (!res.ok) {
    console.error('[scheduled] Resend HTTP', res.status, bodyText)
    return
  }
  console.log('[scheduled] Resend enviado:', bodyText)
}

export default {
  async scheduled(
    controller: ScheduledBits,
    env: ScheduledEnv,
    ctx: { waitUntil(p: Promise<unknown>): void },
  ): Promise<void> {
    ctx.waitUntil(
      sendMonthlyReportEmail(env, controller).catch(err => {
        console.error('[scheduled] fallo:', err instanceof Error ? err.message : String(err))
      }),
    )
  },
}
