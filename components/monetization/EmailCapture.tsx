'use client'

import { useState } from 'react'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent'
import { getEmailCaptureCopy } from '@/data/email-capture-copy'

type Props = {
  funnelId: string
  tramiteLabel: string
}

export default function EmailCapture({ funnelId, tramiteLabel }: Props) {
  const { analyticsAllowed } = useAnalyticsConsent()
  const copy = getEmailCaptureCopy(funnelId, tramiteLabel)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !consent) return
    setStatus('loading')
    setMsg('')
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
    const url = base ? `${base}/api/subscribe-email` : '/api/subscribe-email'
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          tramite: funnelId,
          firstName: firstName.trim() || undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('err')
        setMsg(
          typeof data?.error === 'string'
            ? data.error
            : 'Hubo un problema. Intenta de nuevo o escríbenos a hola@hazloasiya.com'
        )
        return
      }
      if (analyticsAllowed) trackFunnelEvent(FUNNEL_EVENTS.EMAIL_CAPTURE, { tramite: funnelId })
      setStatus('ok')
      setMsg(getEmailCaptureCopy(funnelId, tramiteLabel).success)
    } catch {
      setStatus('err')
      setMsg('Error de red. Intenta más tarde.')
    }
  }

  return (
    <div className="rounded-2xl border-2 border-navy/15 bg-navy/[0.03] p-6">
      <h3 className="font-serif text-lg text-navy mb-2">{copy.title}</h3>
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{copy.hook}</p>
      <p className="text-sm text-navy/90 mb-3 leading-relaxed font-medium">
        Al pulsar el botón de abajo, guardamos tu correo en una lista de HazloAsíYa etiquetada con{' '}
        <strong>{tramiteLabel}</strong>. En seguida verás aquí un mensaje en verde de confirmación; no abrimos boletín. El
        siguiente correo (si llega) será <strong>un solo email</strong> cuando publiquemos un cambio que afecte
        documentos, montos, fechas o pasos de este trámite.
      </p>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{copy.stakes}</p>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          name="alert_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
          placeholder="Tu nombre (opcional)"
          autoComplete="given-name"
        />
        <input
          type="email"
          name="alert_email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
          placeholder="tu@correo.com"
          autoComplete="email"
        />
        <label className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            name="alert_consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 accent-green"
          />
          <span>
            Acepto recibir emails de HazloAsíYa. Puedo cancelar en cualquier momento.
          </span>
        </label>
        <div className="rounded-xl border border-navy/10 bg-white/80 px-4 py-3 text-sm text-gray-800 leading-relaxed">
          {copy.closer}
        </div>
        <button type="submit" disabled={status === 'loading' || !consent} className="btn-primary w-full py-3 text-sm">
          {status === 'loading' ? 'Guardando tu correo…' : copy.button}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">
        No vendemos tu correo. Si un día ya no quieres recibir nada, cancelas con un enlace en el mismo email.
      </p>
      {msg && (
        <p className={`text-sm mt-2 ${status === 'ok' ? 'text-green font-medium' : 'text-amber-800'}`}>{msg}</p>
      )}
    </div>
  )
}
