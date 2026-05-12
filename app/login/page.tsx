'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/Topbar'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'register') setMode('register')
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        const { authStatic } = await import('@/lib/static-backend')
        const { emitAuthChanged } = await import('@/lib/auth-session')
        const res = await authStatic({
          action: mode === 'register' ? 'signup' : 'login',
          email,
          password: '__local_only__',
          name: name || undefined,
        })
        if (!res.ok) {
          setError('error' in res ? res.error : 'No se pudo entrar')
          return
        }
        emitAuthChanged()
        router.push('/dashboard')
        return
      }

      const res = await fetch(`${supabaseUrl}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          email,
          create_user: mode === 'register',
          data: mode === 'register' ? { name } : undefined,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { msg?: string; error_description?: string }
        throw new Error(data.msg || data.error_description || 'Error al enviar el enlace')
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Topbar />

      <div className="bg-navy py-12 px-4 text-center">
        <p className="text-green text-sm font-bold uppercase tracking-widest mb-2">
          {mode === 'login' ? 'ACCEDER' : 'CREAR CUENTA'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-bold">
          {mode === 'login' ? 'Entra a tu cuenta' : 'Crea tu cuenta gratis'}
        </h1>
        <p className="text-white/60 mt-2 text-sm max-w-md mx-auto">
          {mode === 'login'
            ? 'Te enviamos un enlace mágico a tu correo — sin contraseña.'
            : 'Guarda tus trámites, descarga tus formularios y accede desde cualquier dispositivo.'}
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        {sent ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-stone-200">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-serif text-xl font-bold text-navy mb-2">Revisa tu correo</h2>
            <p className="text-stone-600 text-sm">
              Enviamos un enlace de acceso a <strong>{email}</strong>. Haz clic en el enlace para entrar — expira en 10
              minutos.
            </p>
            <p className="text-stone-400 text-xs mt-4">
              ¿No llegó? Revisa tu carpeta de spam o{' '}
              <button type="button" onClick={() => setSent(false)} className="text-green underline">
                intenta de nuevo
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login' ? 'bg-white text-navy shadow-sm' : 'text-stone-500'
                }`}
              >
                Ya tengo cuenta
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'register' ? 'bg-white text-navy shadow-sm' : 'text-stone-500'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">
                    Nombre <span className="text-stone-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-navy mb-1">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
              </div>

              {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-green text-navy font-bold py-3 rounded-xl text-sm hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : mode === 'login' ? 'Enviar enlace de acceso →' : 'Crear cuenta y entrar →'}
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-stone-400">
              <span>🔒 Sin contraseña</span>
              <span>📵 Sin spam</span>
              <span>🗑️ Cancela cuando quieras</span>
            </div>
          </div>
        )}

        <p className="text-center text-stone-400 text-xs mt-6">
          ¿Tienes preguntas?{' '}
          <Link href="/" className="text-green underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
