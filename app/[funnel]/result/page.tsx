'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FUNNELS, NEXT_STEP_MAP, funnelLandingPath, isValidFunnelId } from '@/data/funnels'
import Link from 'next/link'
import { authStatic, checkoutStatic, generateResultClient, submitLeadStatic, applyPendingPlan } from '@/lib/static-backend'
import { generatePDF } from '@/components/PDFGenerator'
import ResultPhase1Section from '@/components/monetization/ResultPhase1Section'
import {
  RESULT_DOC_TENSION_COPY,
  RESULT_DOC_TENSION_FUNNELS,
  augmentResultSteps,
} from '@/lib/result-steps'
import { getResultTrustActionLine } from '@/lib/result-trust-action'
import { gtagEvent, getAnalyticsDevice } from '@/lib/gtag'
import { getResultViewSource } from '@/lib/result-view-source'
import { getRecommendedFormForFunnel } from '@/types/pdf'
import EmailGate, { getEmailGateData } from '@/components/EmailGate'
import { PRICE_MAIN, PRICE_ANNUAL, PRICE_ASSISTED } from '@/lib/pricing'

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

function productIdToPlan(productId: string): NonNullable<User['plan']> {
  if (productId === 'annual') return 'annual'
  if (productId === 'assisted') return 'assisted'
  if (productId === 'revisionExpress') return 'revisionExpress'
  if (productId === 'kitSnap') return 'kitSnap'
  if (productId === 'kitItin') return 'kitItin'
  return 'paid_guide'
}

export default function ResultPage() {
  const { funnel: id } = useParams<{ funnel: string }>()
  const router = useRouter()
  const f =
    typeof id === 'string' && isValidFunnelId(id) ? FUNNELS[id] : undefined

  const [result,   setResult]   = useState<Result | null>(null)
  const [user,     setUser]     = useState<User | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [pendingCheckoutProductId, setPendingCheckoutProductId] = useState<string | null>(null)
  const [showLead, setShowLead] = useState(false)
  const [lead,     setLead]     = useState({ name: '', phone: '', zip: '' })
  const [pdfing,   setPdfing]   = useState(false)
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', mode: 'login' as 'login'|'register' })
  const [paidInUrl, setPaidInUrl] = useState(false)
  const [purchaseVerified, setPurchaseVerified] = useState(false)
  const [emailGatePassed, setEmailGatePassed] = useState(false)
  const resultViewSent = useRef(false)

  const isPaid = user?.plan && !['free', '', undefined].includes(user.plan)
  const hasPaidAccess = Boolean(isPaid) || purchaseVerified
  const isLoggedIn = !!user

  const haveShow  = isLoggedIn ? result?.haveItems || []   : (result?.haveItems || []).slice(0, 2)
  const missShow  = isLoggedIn ? result?.missingItems || [] : (result?.missingItems || []).slice(0, 2)

  useEffect(() => {
    let cancelled = false

    const stored = sessionStorage.getItem(`haya_form_${id}`)
    const formData = stored ? JSON.parse(stored) : {}

    const storedUser = localStorage.getItem('haya_user')
    if (storedUser) setUser(JSON.parse(storedUser))
    // Email gate: skip if already logged in or already passed the gate
    if (storedUser || getEmailGateData()) setEmailGatePassed(true)

    if (new URLSearchParams(window.location.search).get('paid') === '1') {
      // FIX #3: applyPendingPlan() busca en sessionStorage Y localStorage como fallback,
      // cubriendo el caso en que el usuario cerró la pestaña antes de que cargara.
      const { applied } = applyPendingPlan()
      if (applied) {
        const uRaw = localStorage.getItem('haya_user')
        if (uRaw) {
          try { setUser(JSON.parse(uRaw) as User) } catch { /* ignore */ }
        }
      }
    }

    ;(async () => {
      try {
        const data = await generateResultClient({ funnelId: id, formData })
        if (!cancelled) setResult(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    setPaidInUrl(new URLSearchParams(window.location.search).get('paid') === '1')
  }, [id])

  useEffect(() => {
    if (!id || typeof id !== 'string' || !user?.email) return
    let cancelled = false
    fetch(
      `/api/check-purchase?email=${encodeURIComponent(user.email)}&funnel=${encodeURIComponent(id)}`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { paid?: boolean }) => {
        if (!cancelled && d.paid) setPurchaseVerified(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id, user?.email])

  useEffect(() => {
    if (loading || !result) return
    if (typeof id !== 'string' || !id || resultViewSent.current) return
    resultViewSent.current = true
    gtagEvent('result_view', {
      funnel: id,
      source: getResultViewSource(id),
      device: getAnalyticsDevice(),
    })
  }, [loading, result, id])

  const canDownloadFullPdf = hasPaidAccess || paidInUrl

  const handleAuth = async () => {
    const { mode, email, password, name } = authForm
    const res = await authStatic({ action: mode === 'login' ? 'login' : 'signup', email, password, name })
    if (!res.ok) return alert(res.error)
    setUser(res.user as unknown as User)
    setShowAuth(false)

    if (pendingCheckoutProductId) {
      const pid = pendingCheckoutProductId
      setPendingCheckoutProductId(null)
      await startCheckout(pid)
    }
  }

  const startCheckout = async (productId: string) => {
    if (!id) return
    const storedUser = localStorage.getItem('haya_user')
    if (!storedUser) {
      setPendingCheckoutProductId(productId)
      setShowAuth(true)
      return
    }
    const res = await checkoutStatic({ productId: productId as 'main' | 'annual' | 'assisted', funnelId: id })
    if (!res.ok) alert(res.error)
  }

  const downloadBasicPdf = async () => {
    if (!result || !f || pdfing) return
    setPdfing(true)
    try {
      await generatePDF({
        funnelName: f.name,
        funnelIcon: f.icon,
        headline: result.headline,
        subheadline: result.subheadline,
        haveItems: result.haveItems,
        missingItems: result.missingItems,
        steps: augmentResultSteps(typeof id === 'string' ? id : '', result.steps),
        isPaid: false,
        userName: user?.name || user?.email,
      })
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'No se pudo generar el PDF')
    } finally {
      setPdfing(false)
    }
  }

  const downloadFullPdf = async () => {
    if (!result || !f || pdfing) return
    setPdfing(true)
    try {
      await generatePDF({
        funnelName: f.name,
        funnelIcon: f.icon,
        headline: result.headline,
        subheadline: result.subheadline,
        haveItems: result.haveItems,
        missingItems: result.missingItems,
        steps: augmentResultSteps(typeof id === 'string' ? id : '', result.steps),
        isPaid: true,
        userName: user?.name || user?.email,
      })
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'No se pudo generar el PDF')
    } finally {
      setPdfing(false)
    }
  }

  const handleLead = async () => {
    await submitLeadStatic({ ...lead, funnel: id })
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

  // Show email gate for anonymous users who haven't provided email yet
  if (!emailGatePassed && !isLoggedIn) {
    return (
      <EmailGate
        funnelName={f.name}
        onContinue={(_email, _name) => setEmailGatePassed(true)}
      />
    )
  }

  const nextSteps =
    typeof id === 'string' && isValidFunnelId(id) ? NEXT_STEP_MAP[id] || [] : []

  const funnelKey = typeof id === 'string' ? id : ''
  const augmentedSteps = augmentResultSteps(funnelKey, result.steps)

  // Formulario oficial recomendado según funnel + estado del usuario
  const _storedFormRaw = typeof window !== 'undefined'
    ? sessionStorage.getItem(`haya_form_${id}`) : null
  const _storedFormData = _storedFormRaw ? (() => { try { return JSON.parse(_storedFormRaw) } catch { return {} } })() : {}
  const recommendedForm = getRecommendedFormForFunnel(funnelKey, _storedFormData?.state_of_residence as string | undefined)
  const stepsShow = hasPaidAccess
    ? augmentedSteps
    : isLoggedIn
      ? augmentedSteps.slice(0, 3)
      : augmentedSteps.slice(0, 1)
  const hiddenSteps = augmentedSteps.length - stepsShow.length

  return (
    <div className="min-h-screen bg-cream">
      {/* Mini header */}
      <header className="bg-navy px-4 h-12 flex items-center justify-between">
        <Link href={`/${id}`} className="text-white/70 text-sm hover:text-white">← {f.name}</Link>
        <Link href="/" className="font-serif text-white text-sm">HazloAsí<span className="text-green">Ya</span></Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {isValidFunnelId(funnelKey) && (
          <div className="rounded-xl border border-navy/10 bg-white px-4 py-4 shadow-sm space-y-3">
            <p className="text-sm text-navy/90 leading-relaxed" role="note">
              Esta lista está basada en lo que normalmente piden para casos como el tuyo.
            </p>
            <p className="text-sm text-navy/90 leading-relaxed">
              Si algo cambia, suele ser un documento específico—no todo el proceso.
            </p>
            <p className="text-sm text-navy font-medium leading-relaxed">
              {getResultTrustActionLine(funnelKey)}
            </p>
          </div>
        )}

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

        {RESULT_DOC_TENSION_FUNNELS.has(funnelKey) && (
          <p
            className="text-sm text-amber-900/95 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-3 leading-relaxed"
            role="note"
          >
            {RESULT_DOC_TENSION_COPY}
          </p>
        )}

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

        <ResultPhase1Section
          funnelId={typeof id === 'string' ? id : ''}
          tramiteLabel={f.name}
          eligible={result.eligible}
          missingCount={result.missingItems.length}
        />

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
            {hasPaidAccess ? (
              <span className="text-xs bg-green/25 text-green-light px-2.5 py-1 rounded-full font-bold">COMPLETO</span>
            ) : isLoggedIn ? (
              <span className="text-xs text-white/40">{stepsShow.length} de {augmentedSteps.length} pasos</span>
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
                <button onClick={() => startCheckout('main')} className="btn-primary py-2 px-5 text-sm">
                  Formulario oficial pre-llenado — {PRICE_MAIN}
                </button>
                <button onClick={() => startCheckout('annual')}
                        className="py-2 px-5 text-sm font-bold rounded-xl border-2 border-gold text-gold hover:bg-gold hover:text-white transition-colors">
                  Acceso anual familiar — {PRICE_ANNUAL}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulario oficial recomendado — CTA contextual (solo usuarios con acceso pago) */}
        {recommendedForm && hasPaidAccess && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-teal-700 mb-1">Formulario oficial</div>
            <h3 className="font-serif text-lg text-navy mb-1">
              {recommendedForm.icon} {recommendedForm.title}
            </h3>
            <p className="text-gray-500 text-sm mb-3">{recommendedForm.description}</p>
            <Link
              href={`/pdf/${recommendedForm.slug}`}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
            >
              Llenar formulario {recommendedForm.formCode} →
            </Link>
            <p className="text-xs text-teal-600 mt-2">
              Formulario pre-llenado con tus datos · Listo para entregar a la agencia
            </p>
          </div>
        )}

        {/* Free PDF (registered) */}
        {isLoggedIn && !hasPaidAccess && (
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-navy text-sm">PDF básico — descarga gratis</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Incluye: elegibilidad + documentos + {stepsShow.length} pasos
              </div>
            </div>
            <button
              onClick={downloadBasicPdf}
              disabled={pdfing}
              className="py-2 px-4 text-sm font-bold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-navy hover:text-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pdfing ? 'Generando…' : '⬇ Gratis'}
            </button>
          </div>
        )}

        {/* PDF completo: sin pago → checkout main; con plan o ?paid=1 → generar PDF */}
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-navy text-sm">PDF completo del plan</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {canDownloadFullPdf
                  ? 'Todos los pasos y listas en un solo archivo.'
                  : `Incluye tu formulario oficial pre-llenado + instrucciones de entrega — desbloquea por ${PRICE_MAIN}.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {canDownloadFullPdf ? (
                <>
                  <button
                    type="button"
                    onClick={downloadFullPdf}
                    disabled={pdfing}
                    className="btn-primary py-2.5 px-5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {pdfing ? 'Generando…' : '⬇️ Descargar PDF completo'}
                  </button>
                  <button type="button" className="btn-outline py-2.5 px-5 text-sm" onClick={() => window.print()}>
                    🖨️ Imprimir
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => startCheckout('main')}
                  disabled={pdfing}
                  className="btn-primary py-2.5 px-5 text-sm disabled:opacity-60"
                >
                  Desbloquear formulario oficial — {PRICE_MAIN}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade box (registered, not paid) */}
        {isLoggedIn && !hasPaidAccess && (
          <div className="card p-6 border-2 border-gold">
            <div className="text-xs font-bold tracking-widest uppercase text-gold mb-2">Formulario oficial pre-llenado — {PRICE_MAIN}</div>
            <h3 className="font-serif text-xl text-navy mb-2">Tu solicitud oficial lista para entregar</h3>
            <p className="text-gray-500 text-sm mb-4">
              Formulario oficial de tu estado completado con tus datos · Instrucciones exactas de entrega · Checklist de documentos · Sin errores
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => startCheckout('main')} className="btn-gold py-3 px-6">
                Obtener formulario oficial — {PRICE_MAIN} →
              </button>
              <button onClick={() => startCheckout('annual')}
                      className="text-sm font-semibold border-2 border-gray-200 rounded-xl px-5 py-3 text-gray-500 hover:border-gray-300">
                O anual familiar: {PRICE_ANNUAL} / todos los trámites
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
            <div className="text-white/45 text-sm">Especialista revisa tu paquete + orientación por WhatsApp en español</div>
          </div>
          <button onClick={() => startCheckout('assisted')} className="btn-primary whitespace-nowrap">
            {PRICE_ASSISTED} →
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
                <Link key={ns.id} href={funnelLandingPath(ns.id)}
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
