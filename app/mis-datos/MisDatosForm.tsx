'use client'

import { useState } from 'react'

const REQUEST_TYPES = [
  { id: 'access', label: 'Acceso a mis datos' },
  { id: 'correction', label: 'Corrección' },
  { id: 'deletion', label: 'Eliminación' },
  { id: 'portability', label: 'Portabilidad' },
  { id: 'opt_out_sale', label: 'Opt-out de venta / compartición (California u otros)' },
  { id: 'limitation', label: 'Limitación del tratamiento (GDPR)' },
  { id: 'objection', label: 'Objeción (GDPR)' },
] as const

export default function MisDatosForm() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState<string>(REQUEST_TYPES[0].id)
  const [detail, setDetail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[HazloAsíYa] Solicitud de datos: ${type}`)
    const body = encodeURIComponent(
      `Email del solicitante: ${email}\n\nTipo: ${type}\n\nDetalle:\n${detail}\n\n---\nEnviado desde hazloasiya.com/mis-datos/`,
    )
    window.location.href = `mailto:privacidad@hazloasiya.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-cream bg-white p-6">
      <div>
        <label className="block text-sm font-semibold text-navy mb-1">Correo electrónico</label>
        <input
          type="email"
          name="requester_email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy mb-1">Tipo de solicitud</label>
        <select
          name="request_type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5"
        >
          {REQUEST_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy mb-1">Detalle (opcional)</label>
        <textarea
          name="request_detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5"
          placeholder="Describe tu solicitud con el mayor detalle posible."
        />
      </div>
      <button type="submit" className="btn-primary w-full py-3">
        Enviar solicitud
      </button>
      {sent && (
        <p className="text-sm text-green font-medium">
          Se abrió tu cliente de correo. Si no se abrió, escribe a{' '}
          <a href="mailto:privacidad@hazloasiya.com" className="underline">
            privacidad@hazloasiya.com
          </a>
          . Responderemos en un máximo de <strong>45 días (TDPSA)</strong> o <strong>30 días (GDPR)</strong>, según
          corresponda.
        </p>
      )}
    </form>
  )
}
