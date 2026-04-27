'use client'
import { useState } from 'react'

interface AuthModalProps {
  onSuccess: (user: { id: string; email: string; name?: string; plan: string }) => void
  onClose: () => void
  initialMode?: 'login' | 'register'
}

const LogoMark = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect width="52" height="52" rx="13" fill="url(#auth-lm)"/>
    <path d="M15 37 L26 15 L37 37" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M26 15 L26 38" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <defs>
      <linearGradient id="auth-lm" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EC96A"/>
        <stop offset="100%" stopColor="#087A3F"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function AuthModal({ onSuccess, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode,    setMode]    = useState<'login'|'register'>(initialMode)
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [name,    setName]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('Completa todos los campos.'); return }
    if (mode === 'register' && password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode === 'login' ? 'login' : 'signup',
          email, password, name,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }

      const user = {
        id:    data.user.id,
        email: data.user.email,
        name:  name || data.user.email.split('@')[0],
        plan:  'free',
      }
      localStorage.setItem('haya_user', JSON.stringify(user))
      onSuccess(user)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-pop-in relative">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors text-2xl leading-none">×</button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><LogoMark/></div>
          <h3 className="font-serif text-2xl" style={{ color: 'var(--navy)' }}>HazloAsíYa</h3>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Inicia sesión para ver tu plan completo' : 'Crea tu cuenta gratis en 30 segundos'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="label">Tu nombre</label>
              <input
                className="input"
                placeholder="Ej: María García"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          )}
          <div>
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3.5"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión →' : 'Crear cuenta gratis →'}
          </button>

          {mode === 'register' && (
            <p className="text-center text-xs text-gray-400">
              Sin tarjeta · En 30 segundos · Gratis para siempre
            </p>
          )}
        </div>

        {/* Toggle */}
        <div className="text-center text-sm text-gray-400 mt-5">
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}
            className="font-semibold transition-colors"
            style={{ color: 'var(--green)' }}
          >
            {mode === 'login' ? 'Regístrate gratis' : 'Iniciar sesión'}
          </button>
        </div>

        {/* What's free */}
        {mode === 'register' && (
          <div className="mt-5 pt-5 border-t border-gray-50">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-300 mb-3">Qué obtienes gratis:</div>
            <div className="space-y-1.5">
              {[
                'Cuestionario completo — 16 trámites',
                'Evaluación de elegibilidad',
                'Lista completa de documentos',
                'Primeros 3 pasos de tu plan',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-bold" style={{ color: 'var(--green)' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
