'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FUNNELS, NEXT_STEP_MAP, FunnelId } from '@/data/funnels'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Result {
  eligible: boolean
  headline: string
  subheadline: string
  haveItems: string[]
  missingItems: string[]
  steps: string[]
}

interface User {
  id: string; email: string; name?: string; plan?: string
}

export default function ResultPage() {
  const { funnel: id } = useParams<{ funnel: string }>()
  const router = useRouter()
  const f = FUNNELS[id as FunnelId]

  const [result,   setResult]   = useState<Result | null>(null)
  const [user,     setUser]     = useState<User | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [showPay,  setShowPay]  = useState<string | null>(null)
  const [showLead, setShowLead] = useState(false)
  const [lead,     setLead]     = useState({ name: '', phone: '', zip: '' })
  const [paying,   setPaying]   = useState(false)
  const [payDone,  setPayDone]  = useState(false)
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', mode: 'login' as 'login'|'register' })

  const isPaid = user?.plan && !['free', '', undefined].includes(user.plan)
  const isLoggedIn = !!user

  const haveShow  = isLoggedIn ? result?.haveItems || []   : (result?.haveItems || []).slice(0, 2)
  const missShow  = isLoggedIn ? result?.missingItems || [] : (result?.missingItems || []).slice(0, 2)
  const stepsShow = isPaid     ? result?.steps || []
                  : isLoggedIn ? (result?.steps || []).slice(0, 3)
                  : (result?.steps || []).slice(0, 1)
  const hiddenSteps = (result?.steps?.length || 0) - stepsShow.length

  useEffect(() => {
    const stored = sessionStorage.getItem(`haya_form_${id}`)
    const formData = stored ? JSON.parse(stored) : {}

    // Load user from localStorage (set by auth)
    const storedUser = localStorage.getItem('haya_user')
    if (storedUser) setUser(JSON.parse(storedUser))

    // Generate result via Claude API
    fetch('/api/generate-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ funnelId: id, formData }),
    })
      .then(r => r.json())
      .then(data => { setResult(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleAuth = async () => {
    const { mode, email, password, name } = authForm
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: mode === 'login' ? 'login' : 'signup', email, password, name }),
    })
    const data = await res.json()
    if (data.error) return alert(data.error)
    const u = { ...data.user, name: authForm.name || data.user.email.split('@')[0], plan: 'free' }
    localStorage.setItem('haya_user', JSON.stringify(u))
    setUser(u)
    setShowAuth(false)
  }

  const handlePay = async () => {
    if (!showPay) return
    setPaying(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: showPay, funnelId: id }),
      })
      const { clientSecret } = await res.json()
      const stripe = await stripePromise
      if (!stripe || !clientSecret) throw new Error('Stripe not loaded')

      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/${id}/result?paid=1` },
        redirect: 'if_required',
      })
      if (error) throw error

      // Update local user plan
      const updatedUser = { ...user!, plan: showPay === 'annual' ? 'annual' : showPay === 'assisted' ? 'assisted' : 'paid_guide' }
      localStorage.setItem('haya_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setPayDone(true)
      setShowPay(null)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al procesar el pago')
    }
    setPaying(false)
  }

  const handleLead = async () => {
    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, funnel: id }),
    })
    setShowLead(false)
    alert('✅ ¡Gracias! Te contactaremos pronto por WhatsApp.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-green"/>
          </div>
          <div className="font-serif text-xl text-navy">Preparando tu plan con IA…</div>
          <div className="text-gray-400 text-sm mt-2">Personalizando según tus respuestas</div>
        </div>
      </div>
    )
  }

  if (!f || !result) return <div className="p-8 text-center">Error al cargar el resultado.</div>

  const nextSteps = NEXT_STEP_MAP[id as FunnelId] || []

  return (
    <div className="min-h-screen bg-cream">
      {/* Mini header */}
      <header className="bg-navy px-4 h-12 flex items-center justify-between">
        <Link href={`/${id}`} className="text-white/70 text-sm hover:text-white">← {f.name}</Link>
        <Link href="/" className="font-serif text-white text-sm">HazloAsí<span className="text-green">Ya</span></Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Logo + status headline */}
        <div className="flex items-center gap-4 mb-2">
          <div className="text-5xl animate-pop-in">{f.icon}</div>
          <div>
            <div
              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                result.eligible ? 'bg-green/15 text-green' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {result.eligible ? '✅ Probablemente elegible' : '⚠️ Verificar elegibilidad'}
            </div>
            <h1 className="font-serif text-2xl text-navy leading-tight">{result.headline}</h1>
            <p className="text-gray-500 text-sm mt-1">{result.subheadline}</p>
          </div>
        </div>

        {/* Have / Missing */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-green mb-3">✅ Lo que ya tienes</div>
            <div className="space-y-2">
              {haveShow.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green font-bold mt-0.5 shrink-0">✓</span>{item}
                </div>
              ))}
              {!isLoggedIn && (result.haveItems.length - 2) > 0 && (
                <div className="text-xs text-gray-400 italic pt-1 border-t border-gray-50">
                  + {result.haveItems.length - 2} más — regístrate para ver todo
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-gold mb-3">❌ Lo que te falta</div>
            <div className="space-y-2">
              {missShow.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gold font-bold mt-0.5 shrink-0">!</span>{item}
                </div>
              ))}
              {!isLoggedIn && (result.missingItems.length - 2) > 0 && (
                <div className="text-xs text-gray-400 italic pt-1 border-t border-gray-50">
                  + {result.missingItems.length - 2} más — regístrate para ver todo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Anonymous gate */}
        {!isLoggedIn && (
          <div className="bg-navy rounded-2xl p-6 text-center">
            <div className="text-white/50 text-sm mb-2">
              Tienes {result.haveItems.length - 2} items más y {result.missingItems.length - 2} documentos por ver
            </div>
            <h3 className="font-serif text-xl text-white mb-4">Crea tu cuenta gratis para ver el plan completo</h3>
            <button onClick={() => setShowAuth(true)} className="btn-primary px-8 py-3">
              Crear cuenta gratis — ver todo →
            </button>
            <p className="text-white/30 text-xs mt-3">Sin tarjeta · 30 segundos · Gratis para siempre</p>
          </div>
        )}

        {/* Steps */}
        <div className="card overflow-hidden">
          <div className="bg-navy px-5 py-3.5 flex items-center justify-between">
            <div className="font-bold text-white text-sm">📋 Hazlo así — pasos en orden</div>
            {isPaid ? (
              <span className="text-xs bg-green/25 text-green-light px-2.5 py-1 rounded-full font-bold">COMPLETO</span>
            ) : isLoggedIn ? (
              <span className="text-xs text-white/40">{stepsShow.length} de {result.steps.length} pasos</span>
            ) : null}
          </div>
          <div className="p-5 space-y-4">
            {stepsShow.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-light to-green flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pt-1">{s}</p>
              </div>
            ))}
          </div>

          {/* Locked steps gate */}
          {hiddenSteps > 0 && (
            <div className="border-t border-dashed border-gray-100 p-5 bg-cream">
              <div className="flex items-center gap-4 opacity-50 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm shrink-0">🔒</div>
                <p className="text-gray-400 text-sm">{hiddenSteps} paso{hiddenSteps > 1 ? 's' : ''} más — con ejemplos exactos, contactos y errores a evitar</p>
              </div>
              <p className="text-xs text-gray-400 mb-3">La guía completa incluye los pasos restantes + formulario de ejemplo + instrucciones de entrega</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowPay('main')} className="btn-primary py-2 px-5 text-sm">
                  Guía completa — $19
                </button>
                <button onClick={() => setShowPay('annual')}
                        className="py-2 px-5 text-sm font-bold rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-white transition-colors">
                  Acceso anual — $49
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Free PDF (registered) */}
        {isLoggedIn && !isPaid && (
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-navy text-sm">PDF básico — descarga gratis</div>
              <div className="text-xs text-gray-400 mt-0.5">Incluye: elegibilidad + documentos + {stepsShow.length} pasos</div>
            </div>
            <button className="py-2 px-4 text-sm font-bold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-navy hover:text-navy transition-colors">
              ⬇ Gratis
            </button>
          </div>
        )}

        {/* Full PDF (paid) */}
        {isPaid && (
          <div className="flex gap-3 flex-wrap">
            <button className="btn-primary py-3 px-6">⬇️ Descargar PDF completo</button>
            <button className="btn-outline py-3 px-6" onClick={() => window.print()}>🖨️ Imprimir</button>
          </div>
        )}

        {/* Upgrade box (registered, not paid) */}
        {isLoggedIn && !isPaid && (
          <div className="card p-6 border-2 border-gold">
            <div className="text-xs font-bold tracking-widest uppercase text-gold mb-2">Guía completa — $19</div>
            <h3 className="font-serif text-xl text-navy mb-2">Desbloquea los {hiddenSteps} pasos restantes + ejemplos</h3>
            <p className="text-gray-500 text-sm mb-4">
              Formulario de ejemplo ya llenado · Errores comunes a evitar · Instrucciones exactas de entrega · PDF profesional
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowPay('main')} className="btn-gold py-3 px-6">
                Obtener guía completa — $19 →
              </button>
              <button onClick={() => setShowPay('annual')}
                      className="text-sm font-semibold border-2 border-gray-200 rounded-xl px-5 py-3 text-gray-500 hover:border-gray-300">
                O anual: $49 / 16 trámites
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Pago único · Sin suscripción · Garantía 30 días</p>
          </div>
        )}

        {/* Assisted service */}
        <div className="bg-navy rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-teal-xl mb-1">Servicio asistido</div>
            <div className="font-serif text-lg text-white mb-1">Un especialista revisa tu paquete</div>
            <div className="text-white/45 text-sm">Documentos verificados + orientación por WhatsApp</div>
          </div>
          <button onClick={() => setShowPay('assisted')} className="btn-primary whitespace-nowrap">
            $89 →
          </button>
        </div>

        {/* Lead capture */}
        <div className="card p-6">
          <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">¿Necesitas ayuda personalizada?</div>
          <h3 className="font-serif text-xl text-navy mb-2">Conecta con ayuda local en español</h3>
          <p className="text-gray-500 text-sm mb-4">
            Un especialista local en tu área te orienta gratis. Si necesitas revisión completa, el servicio asistido es $89.
          </p>
          <button onClick={() => setShowLead(true)} className="btn-outline py-2.5 px-5 text-sm">
            Quiero que me contacten →
          </button>
        </div>

        {/* Next steps */}
        {nextSteps.length > 0 && (
          <div className="bg-cream-2 rounded-2xl p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Al terminar, también puedes hacer:</div>
            <div className="flex flex-wrap gap-3">
              {nextSteps.map(ns => (
                <Link key={ns.id} href={`/${ns.id}`}
                      className="flex items-center gap-2 bg-white border border-cream rounded-xl px-4 py-2.5 hover:border-green hover:text-green transition-colors text-sm font-medium">
                  <span>{ns.icon}</span><span>{ns.name}</span><span className="text-gray-300">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center py-4">
          <p className="text-xs text-gray-400 italic">
            Hazlo así: te decimos exactamente qué hacer, paso a paso · HazloAsíYa.com
          </p>
        </div>
      </div>

      {/* ── AUTH MODAL ── */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-serif text-2xl text-navy">HazloAsíYa</h3>
              <p className="text-gray-500 text-sm mt-1">
                {authForm.mode === 'login' ? 'Inicia sesión para ver tu plan' : 'Crea tu cuenta gratis'}
              </p>
            </div>
            <div className="space-y-3">
              {authForm.mode === 'register' && (
                <input className="input" placeholder="Tu nombre" value={authForm.name}
                       onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))}/>
              )}
              <input className="input" type="email" placeholder="tu@correo.com" value={authForm.email}
                     onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}/>
              <input className="input" type="password" placeholder="Contraseña" value={authForm.password}
                     onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}/>
              <button onClick={handleAuth} className="btn-primary w-full py-3">
                {authForm.mode === 'login' ? 'Iniciar sesión →' : 'Crear cuenta gratis →'}
              </button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              {authForm.mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button className="text-green font-semibold"
                      onClick={() => setAuthForm(f => ({ ...f, mode: f.mode === 'login' ? 'register' : 'login' }))}>
                {authForm.mode === 'login' ? 'Regístrate gratis' : 'Iniciar sesión'}
              </button>
            </p>
            <button onClick={() => setShowAuth(false)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl">×</button>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {showPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            {payDone ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-serif text-2xl text-navy mb-2">¡Pago exitoso!</h3>
                <p className="text-gray-500 text-sm mb-6">Tu guía está desbloqueada. Revisa tu correo.</p>
                <button onClick={() => setPayDone(false)} className="btn-primary w-full py-3">Ver mi plan completo →</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-3 mb-1">
                    <span className="font-serif text-5xl text-navy">
                      ${showPay === 'main' ? '19' : showPay === 'annual' ? '49' : '89'}
                    </span>
                    {showPay === 'main' && <span className="text-gray-400 text-sm line-through">$150–$400 con preparador</span>}
                  </div>
                  <div className="text-gray-400 text-sm">Pago único · Sin suscripción · Garantía 30 días</div>
                  <div className="font-semibold text-navy mt-2">
                    {showPay === 'main' ? 'Guía Completa' : showPay === 'annual' ? 'Acceso Anual — 16 Trámites' : 'Revisión Asistida'}
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 mb-5 space-y-2 text-sm">
                  {(showPay === 'main' ? [
                    '🔓 Todos los pasos desbloqueados',
                    '📝 Formulario de ejemplo ya llenado',
                    '⚠️ Errores comunes y cómo evitarlos',
                    '📋 Instrucciones de entrega',
                  ] : showPay === 'annual' ? [
                    '🔓 Los 16 trámites ilimitados',
                    '🔔 Alertas cuando cambien requisitos',
                    '📁 Historial de tus documentos',
                    '💬 Soporte WhatsApp básico',
                  ] : [
                    '🔓 Plan completo desbloqueado',
                    '👤 Revisión humana de documentos',
                    '💬 Orientación por WhatsApp',
                    '✅ Garantía de paquete correcto',
                  ]).map(i => (
                    <div key={i} className="flex items-center gap-2 text-gray-700"><span>{i.split(' ')[0]}</span><span>{i.slice(i.indexOf(' ')+1)}</span></div>
                  ))}
                </div>

                {/* Simulated card form — in production use Stripe Elements */}
                <div className="space-y-3 mb-5">
                  <input className="input" placeholder="Número de tarjeta" maxLength={19}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input" placeholder="MM/AA" maxLength={5}/>
                    <input className="input" placeholder="CVC" maxLength={4}/>
                  </div>
                </div>

                <button onClick={handlePay} disabled={paying} className="btn-primary w-full py-3.5">
                  {paying ? 'Procesando…' : `🔒 Pagar $${showPay === 'main' ? '19' : showPay === 'annual' ? '49' : '89'}`}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Pago seguro SSL · VISA · MC · AMEX
                </p>
              </>
            )}
            <button onClick={() => { setShowPay(null); setPayDone(false) }}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl">×</button>
          </div>
        </div>
      )}

      {/* ── LEAD MODAL ── */}
      {showLead && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="font-serif text-xl text-navy mb-1">Ayuda local en español</h3>
            <p className="text-gray-500 text-sm mb-5">Un especialista te contactará por WhatsApp.</p>
            <div className="space-y-3">
              <input className="input" placeholder="Tu nombre" value={lead.name}
                     onChange={e => setLead(l => ({ ...l, name: e.target.value }))}/>
              <input className="input" placeholder="Tu teléfono (WhatsApp)" type="tel" value={lead.phone}
                     onChange={e => setLead(l => ({ ...l, phone: e.target.value }))}/>
              <input className="input" placeholder="Tu ZIP code" maxLength={5} value={lead.zip}
                     onChange={e => setLead(l => ({ ...l, zip: e.target.value }))}/>
              <button onClick={handleLead} className="btn-primary w-full py-3">
                Que me contacten →
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Sin costo · Solo te contactamos si puedes ayudarte</p>
            <button onClick={() => setShowLead(false)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl">×</button>
          </div>
        </div>
      )}
    </div>
  )
}
