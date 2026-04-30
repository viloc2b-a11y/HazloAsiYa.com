'use client'

import { useState } from 'react'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent'

type Props = {
  funnelId: string
  tramiteLabel: string
}

export default function EmailCapture({ funnelId, tramiteLabel }: Props) {
  const { analyticsAllowed } = useAnalyticsConsent()
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
      setMsg('¡Listo! Recibirás alertas sobre este trámite.')
    } catch {
      setStatus('err')
      setMsg('Error de red. Intenta más tarde.')
    }
  }

  return (
    <div className="rounded-2xl border-2 border-navy/15 bg-navy/[0.03] p-6">
      <h3 className="font-serif text-lg text-navy mb-2">Recibe alertas sobre este trámite</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Recibe avisos cuando cambien los requisitos de <strong>{tramiteLabel}</strong> y nuevas guías gratuitas. Sin
        spam: solo lo relevante para tu situación.
      </p>
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
        <button type="submit" disabled={status === 'loading' || !consent} className="btn-primary w-full py-3 text-sm">
          {status === 'loading' ? 'Enviando…' : 'Recibir alertas'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">
        Sin spam. Solo actualizaciones relevantes. Puedes cancelar en cualquier momento con un clic.
      </p>
      {msg && (
        <p className={`text-sm mt-2 ${status === 'ok' ? 'text-green font-medium' : 'text-amber-800'}`}>{msg}</p>
      )}
    </div>
  )
}
