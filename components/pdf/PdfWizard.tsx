'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { PdfFormMeta, PdfAssistResponse } from '@/types/pdf'
import type { PdfFormId } from '@/types/pdf'
import { downloadPdfBytes } from '@/lib/pdf-generator'
import { generateFormPdf } from '@/lib/acroform'
import { validatePdfStep } from '@/lib/pdf-step-validate'
import { checkoutStatic, getStoredUser } from '@/lib/static-backend'
import { checkPdfPurchase, isPdfPaywallDisabled, isUuid, pdfUnlockStorageKey } from '@/lib/pdf-access'
import PdfFormSteps from '@/components/pdf/pdf-form-steps'

interface PdfWizardProps {
  form: PdfFormMeta
  sessionId: string
  initialStep?: number
  initialData?: Record<string, unknown>
  initialPaid?: boolean
}

type WizardStatus = 'idle' | 'generating' | 'done' | 'error' | 'paywall'

export default function PdfWizard({
  form,
  sessionId,
  initialStep = 0,
  initialData = {},
  initialPaid = false,
}: PdfWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData)
  const [paid, setPaid] = useState(initialPaid || isPdfPaywallDisabled())
  const [status, setStatus] = useState<WizardStatus>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [assistOpen, setAssistOpen] = useState(false)
  const [assistField, setAssistField] = useState('')
  const [assistQ, setAssistQ] = useState('')
  const [assistResp, setAssistResp] = useState<PdfAssistResponse | null>(null)
  const [assistLoading, setAssistLoading] = useState(false)
  const [logLines, setLogLines] = useState<string[]>([])
  const [payEmail, setPayEmail] = useState('')
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  const totalSteps = form.totalSteps
  const isLastStep = currentStep === totalSteps - 1
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100)

  const draftKey = `haya_pdf_draft_${form.id}`

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logLines])

  useEffect(() => {
    if (initialPaid) setPaid(true)
  }, [initialPaid])

  useEffect(() => {
    if (isPdfPaywallDisabled()) {
      setPaid(true)
      return
    }
    try {
      if (sessionStorage.getItem(pdfUnlockStorageKey(form.slug)) === '1') setPaid(true)
    } catch {
      /* ignore */
    }
  }, [form.slug])

  useEffect(() => {
    const u = getStoredUser()
    if (u?.email && isUuid(u.id)) {
      void (async () => {
        const ok = await checkPdfPurchase(u.email, `pdf-${form.slug}`)
        if (ok) setPaid(true)
      })()
    }
    if (u?.email) setPayEmail(u.email)
  }, [form.slug])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as { data?: Record<string, unknown>; step?: number }
      if (parsed.data && typeof parsed.data === 'object') setFormData(prev => ({ ...parsed.data, ...prev }))
      if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step < totalSteps) setCurrentStep(parsed.step)
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only hydrate once on mount
  }, [])

  const persistDraft = useCallback(
    (step: number, data: Record<string, unknown>) => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ sessionId, step, data, updatedAt: Date.now() }))
      } catch {
        /* ignore */
      }
    },
    [draftKey, sessionId],
  )

  function handleChange(fieldId: string, value: unknown) {
    const next = { ...formData, [fieldId]: value }
    setFormData(next)
    if (errors[fieldId]) setErrors(prev => { const e = { ...prev }; delete e[fieldId]; return e })
    persistDraft(currentStep, next)
  }

  function validateStep(): boolean {
    const miss = validatePdfStep(form.id as PdfFormId, currentStep, formData)
    if (miss.length === 0) {
      setErrors({})
      return true
    }
    const nextErr: Record<string, string> = {}
    for (const k of miss) {
      if (k === 'benefits') nextErr.benefits = 'Selecciona al menos un beneficio'
      else nextErr[k] = 'Requerido'
    }
    setErrors(nextErr)
    return false
  }

  async function handleNext() {
    if (!validateStep()) return
    const nextStep = currentStep + 1
    if (!paid && !isPdfPaywallDisabled() && nextStep >= form.freeSteps) {
      setStatus('paywall')
      return
    }
    setCurrentStep(nextStep)
    setStatus('idle')
    persistDraft(nextStep, formData)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setCurrentStep(s => Math.max(0, s - 1))
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handlePayment(annual: boolean) {
    const u = getStoredUser()
    const email = (payEmail || u?.email || '').trim()
    if (!email) {
      setErrors(prev => ({ ...prev, payEmail: 'Necesitamos tu correo para el recibo de Square' }))
      return
    }
    setCheckoutBusy(true)
    try {
      const productId = annual ? 'annual' : 'main'
      const returnPath = `/pdf/${form.slug}/?paid=1`
      const res = await checkoutStatic({
        productId,
        funnelId: `pdf-${form.slug}`,
        userEmail: email,
        returnPath,
      })
      if (!res.ok) setStatus('error')
    } catch {
      setStatus('error')
    } finally {
      setCheckoutBusy(false)
    }
  }

  async function handleGenerate() {
    if (!paid && !isPdfPaywallDisabled()) {
      setStatus('paywall')
      return
    }
    setStatus('generating')
    setLogLines([])
    const logs = [
      'Cargando plantilla…',
      'Mapeando tus datos…',
      'Dibujando secciones…',
      'Añadiendo avisos legales…',
      'Compilando PDF…',
      '✅ Listo para descargar',
    ]
    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 280))
      setLogLines(prev => [...prev, logs[i]])
    }
    try {
      const result = await generateFormPdf(form.id as PdfFormId, formData)
      const safeName = String(formData.firstName || formData.fn || formData.sfn || 'formulario')
        .replace(/[^\w\-]+/g, '')
        .slice(0, 24)
      const suffix = result.source === 'acroform' ? '-oficial' : ''
      downloadPdfBytes(result.bytes, `hazloasiya-${form.id}-${safeName || 'descarga'}${suffix}.pdf`)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  async function handleAssist() {
    if (!assistQ.trim() || !assistField) return
    setAssistLoading(true)
    setAssistResp(null)
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
    const path = '/api/pdf-assist'
    const url = base ? `${base}${path}` : path
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.id,
          fieldId: assistField,
          question: assistQ,
          context: formData,
          lang: 'es',
        }),
      })
      const data = (await resp.json()) as PdfAssistResponse
      setAssistResp(data)
    } catch {
      setAssistResp({ answer: 'No pudimos contactar al asistente. Intenta de nuevo.' })
    } finally {
      setAssistLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20">
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-stone-500">
            PASO {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-xs font-mono text-teal-700 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {status === 'paywall' && (
        <div className="bg-white border-2 border-teal-600 rounded-2xl overflow-hidden mb-5">
          <div className="bg-stone-900 px-6 py-5 text-center">
            <div className="text-4xl mb-2">🔓</div>
            <h2 className="text-white text-xl font-bold">Desbloquea la descarga del PDF</h2>
            <p className="text-stone-400 text-sm mt-1">
              Llenar el asistente es gratis; la descarga usa el mismo checkout seguro (Square) que el resto del sitio.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <label className="block text-sm">
              <span className="font-semibold text-stone-700">Correo para el pago</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
                value={payEmail}
                onChange={e => setPayEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
              {errors.payEmail && <span className="text-xs text-red-600">{errors.payEmail}</span>}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handlePayment(false)}
                disabled={checkoutBusy}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                Pagar guía / trámite — desbloquear PDF
              </button>
              <button
                type="button"
                onClick={() => handlePayment(true)}
                disabled={checkoutBusy}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                Plan anual (si aplica)
              </button>
            </div>
            <button type="button" onClick={() => setStatus('idle')} className="text-sm text-stone-500 underline w-full">
              ← Seguir sin pagar
            </button>
            <p className="text-xs text-stone-400 text-center">
              Tras pagar, Square te devuelve a esta página con acceso a la descarga. No guardamos datos de tarjeta.
            </p>
          </div>
        </div>
      )}

      {(status === 'generating' || status === 'done') && (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-5">
          <div className="bg-stone-900 px-6 py-5 text-center">
            <div className="text-5xl mb-2">{status === 'done' ? '✅' : '⚙️'}</div>
            <h2 className="text-white text-xl font-bold">{status === 'done' ? '¡PDF generado!' : 'Generando PDF…'}</h2>
          </div>
          <div className="p-6">
            <div className="bg-stone-900 rounded-xl p-4 max-h-40 overflow-y-auto mb-4" ref={logRef}>
              {logLines.map((line, i) => (
                <div key={i} className="font-mono text-xs text-emerald-400 leading-7">
                  {'>'} {line}
                </div>
              ))}
            </div>
            {status === 'done' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl"
                >
                  ⬇️ Descargar de nuevo
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('idle'); setCurrentStep(0) }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-xl"
                >
                  Volver al inicio del asistente
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-5 text-sm">
          Hubo un error al generar el PDF. Recarga la página e intenta de nuevo.
          <button type="button" className="block mt-2 underline font-semibold" onClick={() => setStatus('idle')}>
            Cerrar
          </button>
        </div>
      )}

      {status !== 'paywall' && status !== 'generating' && status !== 'done' && (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="bg-stone-900 px-6 py-5 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-stone-500 mb-1">
                {form.formCode} · PASO {currentStep + 1}
              </div>
              <div className="text-white text-xl font-bold leading-tight">{getStepTitle(form.id, currentStep)}</div>
            </div>
            <div className="bg-white/10 border border-white/20 text-emerald-400 text-xs font-mono font-bold px-3 py-1.5 rounded-full shrink-0">
              {form.agency}
            </div>
          </div>

          {!paid && currentStep < form.freeSteps && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700">✓ Vista previa gratuita</span>
              <span className="text-xs text-emerald-600">
                Paso {currentStep + 1} de {form.freeSteps} sin costo
              </span>
            </div>
          )}
          {paid && (
            <div className="bg-teal-50 border-b border-teal-200 px-6 py-2">
              <span className="text-xs font-bold text-teal-700">🔓 Descarga desbloqueada</span>
            </div>
          )}

          <div className="px-6 pt-5">
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex gap-2 items-start mb-5">
              <span className="text-base shrink-0">⚠️</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Borrador orientativo preparado por HazloAsíYa. No es asesoría legal ni garantía ante la agencia. Revisa el
                formulario oficial antes de firmar o enviar.
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <PdfFormSteps
              formId={form.id as PdfFormId}
              stepIndex={currentStep}
              formData={formData}
              onChange={handleChange}
              errors={errors}
              onAskAssist={id => { setAssistField(id); setAssistOpen(true) }}
            />
          </div>

          <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-sm ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              ← Atrás
            </button>

            {isLastStep && paid ? (
              <button
                type="button"
                onClick={handleGenerate}
                className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-2.5 rounded-xl text-sm"
              >
                ⬇️ Generar PDF
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-none bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-2.5 rounded-xl text-sm"
              >
                Continuar →
              </button>
            )}
          </div>
        </div>
      )}

      {assistOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-stone-900 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-stone-500 mb-0.5">ASISTENTE (GPT)</div>
                <div className="text-white font-bold text-sm">Duda sobre un campo</div>
              </div>
              <button type="button" onClick={() => setAssistOpen(false)} className="text-stone-400 hover:text-white text-xl leading-none">
                ✕
              </button>
            </div>
            <div className="p-5">
              {assistResp && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-teal-900 leading-relaxed">{assistResp.answer}</p>
                  {assistResp.tip && <p className="text-xs text-teal-700 mt-2 font-medium">💡 {assistResp.tip}</p>}
                  {assistResp.warning && <p className="text-xs text-amber-700 mt-2 font-medium">⚠️ {assistResp.warning}</p>}
                </div>
              )}
              <textarea
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                rows={3}
                placeholder="Ej.: ¿Qué pongo si no tengo número A?"
                value={assistQ}
                onChange={e => setAssistQ(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleAssist()
                  }
                }}
              />
              <button
                type="button"
                onClick={() => void handleAssist()}
                disabled={assistLoading || !assistQ.trim()}
                className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
              >
                {assistLoading ? 'Consultando…' : 'Preguntar en español'}
              </button>
              <p className="text-xs text-stone-400 text-center mt-2">Respuesta generada por IA · No es consejo legal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getStepTitle(formId: string, stepIndex: number): string {
  const stepTitles: Record<string, string[]> = {
    i821d: [
      'Tipo de solicitud y datos personales',
      'Entrada a EE.UU.',
      'Dirección',
      'Residencia continua',
      'Educación y empleo',
      'Revisa y genera PDF',
    ],
    i765: ['Información personal', 'Categoría EAD', 'Dirección', 'Empleo previo (opcional)', 'Revisa y genera PDF'],
    w7: ['Información personal', 'Razón del ITIN', 'Dirección e identificación', 'Revisa y genera PDF'],
    h1010: ['Beneficios solicitados', 'Solicitante principal', 'Dirección', 'Miembros del hogar', 'Ingresos y gastos', 'Revisa y genera PDF'],
    w4: ['Información personal', 'Estado civil y empleos', 'Dependientes y ajustes', 'Revisa y genera PDF'],
    i9: ['Información personal', 'Estatus de elegibilidad', 'Documentos', 'Revisa y genera PDF'],
    dl14a: ['Tipo de solicitud', 'Información personal', 'Dirección en Texas', 'Documentos', 'Revisa y genera PDF'],
    matricula: ['Consulado y trámite', 'Datos personales', 'Domicilio', 'Documentos', 'Revisa y genera PDF'],
    escuela: ['Estudiante', 'Padre o tutor', 'Domicilio y salud', 'Documentos', 'Revisa y genera PDF'],
  }
  return stepTitles[formId]?.[stepIndex] ?? `Paso ${stepIndex + 1}`
}
