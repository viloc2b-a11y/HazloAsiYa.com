'use client'
import { useState } from 'react'

interface LeadCaptureProps {
  funnelId: string
  funnelName: string
}

export default function LeadCapture({ funnelId, funnelName }: LeadCaptureProps) {
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [zip,      setZip]      = useState('')
  const [loading,  setLoading]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState('')

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3)  return digits
    if (digits.length <= 6)  return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  const handleSubmit = async () => {
    setError('')
    if (!name.trim()) { setError('Escribe tu nombre.'); return }
    if (phone.replace(/\D/g,'').length < 10) { setError('Escribe un número de teléfono válido de 10 dígitos.'); return }

    setLoading(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, zip, funnel: funnelId }),
      })
      setSent(true)
    } catch {
      setError('Error al enviar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="card p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--navy)' }}>¡Gracias, {name.split(' ')[0]}!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Un especialista en tu área te contactará por WhatsApp en menos de 24 horas.
          También puedes escribirnos directamente:
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '13468761439'}?text=${encodeURIComponent(`Hola, me llamo ${name} y necesito ayuda con: ${funnelName}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 font-bold text-sm px-5 py-2.5 rounded-xl text-white"
          style={{ background: '#25D366' }}
        >
          <span>💬</span> WhatsApp directo
        </a>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">¿Necesitas ayuda personalizada?</div>
      <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--navy)' }}>
        Conecta con ayuda local en español
      </h3>
      <p className="text-gray-500 text-sm mb-5 leading-relaxed">
        Un especialista local en tu área te orienta gratis. Para revisión completa del paquete, el servicio asistido es $89.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Tu nombre</label>
          <input
            className="input"
            placeholder="Ej: María García"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Teléfono (WhatsApp)</label>
          <input
            className="input"
            placeholder="(832) 555-0000"
            type="tel"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
          />
        </div>
        <div>
          <label className="label">ZIP code</label>
          <input
            className="input"
            placeholder="77450"
            maxLength={5}
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g,'').slice(0,5))}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-2.5 mt-3">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-outline w-full py-3 mt-4"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Enviando…' : 'Que me contacten →'}
      </button>

      <p className="text-xs text-gray-400 text-center mt-2">
        Sin costo · Solo te contactamos si podemos ayudarte
      </p>
    </div>
  )
}
