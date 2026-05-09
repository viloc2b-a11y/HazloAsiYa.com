'use client'
import { useState } from 'react'

interface Props {
  funnelName: string
  onContinue: (email: string, name: string) => void
}

const STORAGE_KEY = 'haya_email_gate'

export function getEmailGateData(): { email: string; name: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function EmailGate({ funnelName, onContinue }: Props) {
  const [email, setEmail]   = useState('')
  const [name,  setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Ingresa un correo válido'); return }
    setLoading(true)
    setError('')

    // Save to localStorage so result page can use it
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: email.trim(), name: name.trim() }))

    // Subscribe to Mailchimp (best-effort, don't block on failure)
    try {
      await fetch('/api/subscribe-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), tag: `funnel-${funnelName}` }),
      })
    } catch {
      // Non-blocking — continue even if Mailchimp fails
    }

    setLoading(false)
    onContinue(email.trim(), name.trim())
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Trust badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-green/10 text-green text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
            ✅ Tu resultado está listo
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="font-serif text-2xl text-navy text-center mb-2">
            ¿A dónde enviamos tu guía?
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
            Ingresa tu nombre y correo para ver tu resultado de <strong>{funnelName}</strong> y guardar tu progreso.
            Gratis, sin tarjeta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-1.5">
                Tu nombre
              </label>
              <input
                type="text"
                placeholder="María García"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-1.5">
                Tu correo electrónico *
              </label>
              <input
                type="email"
                placeholder="maria@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base font-bold disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Ver mi resultado gratis →'}
            </button>
          </form>

          {/* Trust signals */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400">
            <span>🔒 Sin tarjeta</span>
            <span>📵 Sin spam</span>
            <span>🗑️ Cancela cuando quieras</span>
            <span>🇺🇸 100% en español</span>
          </div>
        </div>

        {/* Already have account */}
        <p className="text-center text-xs text-gray-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-green underline hover:text-navy transition-colors">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  )
}
