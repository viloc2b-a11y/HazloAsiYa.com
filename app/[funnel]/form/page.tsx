'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { FUNNELS, type FunnelId, isValidFunnelId } from '@/data/funnels'
import Link from 'next/link'
import { trackEvent } from '@/lib/static-backend'
import { FUNNEL_EVENTS } from '@/lib/analytics-events'
import AgeGate from '@/components/legal/AgeGate'
import GdprBadge from '@/components/legal/GdprBadge'
import { useIsEU } from '@/hooks/useIsEU'
import { buildQuestionnaireSteps, fieldsForQuestionnaireStep } from '@/lib/funnel-questionnaire-wizard'
import { getQuestionnaireFields } from '@/lib/ai-prompts'
import QuestionnaireBatchFields, {
  isQuestionnaireBatchComplete,
  formatQuestionnaireValue,
} from '@/components/funnels/QuestionnaireBatchFields'

const COPPA_FUNNELS = new Set<string>(['escuela', 'iep', 'prek', 'medicaid'])

const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="url(#wlm)" />
    <path
      d="M7 20 L14 8 L21 20"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M14 8 L14 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="wlm" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EC96A" />
        <stop offset="100%" stopColor="#087A3F" />
      </linearGradient>
    </defs>
  </svg>
)

const AI_MESSAGES: Partial<Record<FunnelId | 'default', string[]>> = {
  snap: [
    'Analizando ingresos del hogar…',
    'Comparando con límites de SNAP en tu estado…',
    'Calculando beneficio estimado…',
    'Verificando documentos requeridos…',
    '✅ Evaluación completa',
  ],
  medicaid: [
    'Verificando composición del hogar…',
    'Comparando ingresos con el FPL…',
    'Identificando programa aplicable (Medicaid vs CHIP)…',
    'Verificando documentos requeridos…',
    '✅ Evaluación completa',
  ],
  daca: [
    'Verificando fechas de vencimiento DACA…',
    'Revisando requisitos actualizados USCIS…',
    'Completando formulario I-821D…',
    'Completando formulario I-765…',
    '✅ Paquete de renovación listo',
  ],
  taxes: [
    'Analizando tipo de ingresos y formularios…',
    'Verificando estado civil y dependientes…',
    'Calculando deducciones posibles…',
    'Identificando créditos fiscales disponibles…',
    '✅ Tu plan de taxes está listo',
  ],
  default: [
    'Analizando tu información…',
    'Verificando requisitos…',
    'Preparando tu plan personalizado…',
    'Identificando recursos locales…',
    '✅ Tu plan está listo',
  ],
}

function WizardPageInner() {
  const { funnel: id } = useParams<{ funnel: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isEU, ready } = useIsEU()
  const f = typeof id === 'string' && isValidFunnelId(id) ? FUNNELS[id] : undefined

  // Pre-populate state_of_residence from ?state= URL param (e.g. from /snap/new-york/ CTA)
  const stateParam = searchParams.get('state') ?? ''
  const STATE_MAP: Record<string, string> = {
    'texas': 'Texas', 'tx': 'Texas',
    'california': 'California', 'ca': 'California',
    'florida': 'Florida', 'fl': 'Florida',
    'nueva-york': 'Nueva York', 'new-york': 'Nueva York', 'ny': 'Nueva York',
  }
  const prefilledState = STATE_MAP[stateParam.toLowerCase()] ?? ''

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>(
    prefilledState ? { state_of_residence: prefilledState } : {}
  )
  const [aiIdx, setAiIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stepError, setStepError] = useState<string | null>(null)

  const funnelId = typeof id === 'string' && isValidFunnelId(id) ? id : null

  const wizardSteps = useMemo(() => {
    if (!funnelId) return []
    const q = buildQuestionnaireSteps(funnelId)
    if (q.length === 0) return []
    return [
      ...q,
      { id: 'ai', title: 'Evaluando', desc: 'Preparando tu plan personalizado.' },
      { id: 'review', title: 'Revisa', desc: 'Confirma antes de continuar.' },
    ]
  }, [funnelId])

  useEffect(() => {
    trackEvent({ event: 'form_started', funnel: id }).catch(() => {})
    trackEvent({ event: FUNNEL_EVENTS.QUIZ_START, funnel: id }).catch(() => {})
  }, [id])

  const currentStep = wizardSteps[step]
  const isAiStep = currentStep?.id === 'ai'
  const aiMsgs = funnelId ? (AI_MESSAGES[funnelId] ?? AI_MESSAGES.default!) : AI_MESSAGES.default!

  useEffect(() => {
    if (!isAiStep) return
    setAiIdx(0)
    const int = setInterval(() => {
      setAiIdx(i => {
        if (i >= aiMsgs.length - 1) {
          clearInterval(int)
          setTimeout(() => setStep(s => s + 1), 1000)
          return i
        }
        return i + 1
      })
    }, 900)
    return () => clearInterval(int)
  }, [step, isAiStep, aiMsgs.length])

  if (!f || !funnelId || wizardSteps.length === 0) {
    return <div className="p-8 text-center">Trámite no encontrado o sin cuestionario configurado.</div>
  }

  const childDataExpected = COPPA_FUNNELS.has(String(id))
  const progress = Math.round((step / Math.max(wizardSteps.length - 1, 1)) * 100)
  const qFields = getQuestionnaireFields(funnelId)

  const handleBack = () => {
    setStepError(null)
    setStep(s => {
      if (s <= 0) return 0
      if (wizardSteps[s]?.id === 'review' && wizardSteps[s - 1]?.id === 'ai') return s - 2
      return s - 1
    })
  }

  const handleNext = () => {
    setStepError(null)
    const sid = currentStep?.id
    if (sid?.startsWith('qb:')) {
      const batch = fieldsForQuestionnaireStep(funnelId, sid)
      if (!isQuestionnaireBatchComplete(batch, formData)) {
        setStepError('Completa los campos obligatorios antes de continuar.')
        return
      }
    }
    if (step < wizardSteps.length - 1) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await trackEvent({ event: FUNNEL_EVENTS.QUIZ_COMPLETE, funnel: id }).catch(() => {})
      sessionStorage.setItem(`haya_form_${id}`, JSON.stringify(formData))
      router.push(`/${id}/result`)
    } catch {
      router.push(`/${id}/result`)
    }
    setLoading(false)
  }

  const updateField = (key: string, val: string) => {
    setFormData(d => ({ ...d, [key]: val }))
  }

  const isReview = currentStep?.id === 'review'
  const isQuestionBatch = currentStep?.id?.startsWith('qb:') ?? false
  const batchFields = isQuestionBatch && currentStep
    ? fieldsForQuestionnaireStep(funnelId, currentStep.id)
    : []

  return (
    <AgeGate childDataExpected={childDataExpected} onAdultConfirmed={() => {}}>
      <div className="min-h-screen bg-cream flex flex-col">
        {ready && isEU && (
          <div className="max-w-2xl mx-auto w-full px-4 pt-3 shrink-0">
            <GdprBadge show />
          </div>
        )}
        <header className="bg-navy px-4 h-12 flex items-center justify-between shrink-0">
          <Link href={`/${id}`} className="flex items-center gap-2">
            <LogoMark />
            <span className="text-white/70 text-sm">
              HazloAsí<span className="text-green">Ya</span>
            </span>
          </Link>
          <div className="text-white/50 text-sm">
            {f.icon} {f.name.split(' ')[0]}
          </div>
        </header>

        <div className="h-1.5 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-green-light to-green transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-navy/5 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Paso <span className="font-bold text-navy">{step + 1}</span> de {wizardSteps.length}
          </div>
          <div className="text-xs font-bold text-green">{progress}% completado</div>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          {isAiStep ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 rounded-full bg-green animate-pulse" />
              </div>
              <h2 className="font-serif text-2xl text-navy mb-6">Preparando tu plan…</h2>
              <div className="space-y-3 max-w-sm mx-auto">
                {aiMsgs.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                      i < aiIdx
                        ? 'bg-green/8 text-green'
                        : i === aiIdx
                          ? 'bg-navy/5 text-navy font-medium'
                          : 'opacity-30 text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        i < aiIdx ? 'bg-green' : i === aiIdx ? 'bg-navy animate-pulse' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-sm">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : isReview ? (
            <div>
              <h2 className="font-serif text-2xl text-navy mb-2">Revisa tu información</h2>
              <p className="text-gray-500 mb-6">
                Verifica antes de continuar — lo enviamos a tu plan personalizado.
              </p>
              {stepError && (
                <p className="text-red-600 text-sm mb-4" role="alert">
                  {stepError}
                </p>
              )}
              <div className="card p-5 space-y-3 mb-6">
                {qFields.map(field => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 text-sm py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-500 shrink-0 max-w-[55%]">{field.label}</span>
                    <span className="font-medium text-navy text-right sm:text-left break-words">
                      {formatQuestionnaireValue(field, formData[field.id] || '')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-colors"
                >
                  ← Atrás
                </button>
                <button onClick={handleSubmit} disabled={loading} className="flex-[2] btn-primary py-4">
                  {loading ? 'Procesando…' : 'Completa este trámite →'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-green mb-1">{f.name}</div>
              <h2 className="font-serif text-2xl text-navy mb-1">{currentStep?.title}</h2>
              <p className="text-gray-500 text-sm mb-6">{currentStep?.desc}</p>

              {stepError && (
                <p className="text-red-600 text-sm mb-4" role="alert">
                  {stepError}
                </p>
              )}

              <QuestionnaireBatchFields fields={batchFields} formData={formData} onUpdate={updateField} />

              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-colors"
                  >
                    ← Atrás
                  </button>
                )}
                <button type="button" onClick={handleNext} className="flex-[2] btn-primary py-3">
                  {step === wizardSteps.length - 3 ? 'Continuar →' : 'Hazlo así →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AgeGate>
  )
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-gray-400">Cargando…</div></div>}>
      <WizardPageInner />
    </Suspense>
  )
}
