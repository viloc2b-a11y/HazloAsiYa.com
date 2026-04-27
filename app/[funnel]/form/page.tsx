'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FUNNELS, FunnelId } from '@/data/funnels'
import Link from 'next/link'
import { trackEvent } from '@/lib/static-backend'

const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="url(#wlm)"/>
    <path d="M7 20 L14 8 L21 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 8 L14 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <defs>
      <linearGradient id="wlm" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EC96A"/>
        <stop offset="100%" stopColor="#087A3F"/>
      </linearGradient>
    </defs>
  </svg>
)

const AI_MESSAGES: Partial<Record<FunnelId | 'default', string[]>> = {
  snap:     ['Analizando ingresos del hogar…','Comparando con límites de SNAP en Texas…','Calculando beneficio estimado…','Verificando documentos requeridos…','✅ Evaluación completa'],
  medicaid: ['Verificando composición del hogar…','Comparando ingresos con el FPL…','Identificando programa aplicable (Medicaid vs CHIP)…','Verificando documentos requeridos…','✅ Evaluación completa'],
  daca:     ['Verificando fechas de vencimiento DACA…','Revisando requisitos actualizados USCIS…','Completando formulario I-821D…','Completando formulario I-765…','✅ Paquete de renovación listo'],
  taxes:    ['Analizando tipo de ingresos y formularios…','Verificando estado civil y dependientes…','Calculando deducciones posibles…','Identificando créditos fiscales disponibles…','✅ Tu plan de taxes está listo'],
  default:  ['Analizando tu información…','Verificando requisitos…','Preparando tu plan personalizado…','Identificando recursos locales…','✅ Tu plan está listo'],
}

export default function WizardPage() {
  const { funnel: id } = useParams<{ funnel: string }>()
  const router = useRouter()
  const f = FUNNELS[id as FunnelId]

  const [step,     setStep]     = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [aiIdx,    setAiIdx]    = useState(0)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    trackEvent({ event: 'form_started', funnel: id }).catch(() => {})
  }, [id])

  if (!f) return <div className="p-8 text-center">Trámite no encontrado.</div>

  const steps = f.steps
  const progress = Math.round((step / steps.length) * 100)
  const currentStep = steps[step]
  const isAiStep = currentStep?.id === 'ai'
  const isLastStep = step === steps.length - 1

  const aiMsgs = AI_MESSAGES[id as FunnelId] || (AI_MESSAGES as Record<string, string[]>)['default']!

  // Start AI simulation
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

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Save form data to sessionStorage for result page
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

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Mini topbar */}
      <header className="bg-navy px-4 h-12 flex items-center justify-between shrink-0">
        <Link href={`/${id}`} className="flex items-center gap-2">
          <LogoMark/>
          <span className="text-white/70 text-sm">HazloAsí<span className="text-green">Ya</span></span>
        </Link>
        <div className="text-white/50 text-sm">{f.icon} {f.name.split(' ')[0]}</div>
      </header>

      {/* Progress */}
      <div className="h-1.5 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-green-light to-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="bg-navy/5 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Paso <span className="font-bold text-navy">{step + 1}</span> de {steps.length}
        </div>
        <div className="text-xs font-bold text-green">{progress}% completado</div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {isAiStep ? (
          /* AI Processing */
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 rounded-full bg-green animate-pulse"/>
            </div>
            <h2 className="font-serif text-2xl text-navy mb-6">Preparando tu plan…</h2>
            <div className="space-y-3 max-w-sm mx-auto">
              {aiMsgs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                    i < aiIdx ? 'bg-green/8 text-green' :
                    i === aiIdx ? 'bg-navy/5 text-navy font-medium' :
                    'opacity-30 text-gray-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    i < aiIdx ? 'bg-green' : i === aiIdx ? 'bg-navy animate-pulse' : 'bg-gray-300'
                  }`}/>
                  <span className="text-sm">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        ) : currentStep?.id === 'review' ? (
          /* Review step */
          <div>
            <h2 className="font-serif text-2xl text-navy mb-2">Revisa tu información</h2>
            <p className="text-gray-500 mb-6">Verifica antes de continuar — lo usamos para personalizar tu plan.</p>
            <div className="card p-5 space-y-3 mb-6">
              {Object.entries(formData).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium text-navy">{v}</span>
                </div>
              ))}
              {Object.keys(formData).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">Sin datos registrados aún.</p>
              )}
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-4">
              {loading ? 'Procesando…' : 'Completa este trámite →'}
            </button>
          </div>
        ) : currentStep?.id === 'download' ? (
          /* This shouldn't show — handled by result page */
          <div className="text-center">
            <p>Redirigiendo…</p>
          </div>
        ) : (
          /* Generic step */
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-green mb-1">
              {f.name}
            </div>
            <h2 className="font-serif text-2xl text-navy mb-1">{currentStep?.title}</h2>
            <p className="text-gray-500 text-sm mb-6">{currentStep?.desc}</p>

            <GenericStepFields
              stepId={currentStep?.id || ''}
              funnelId={id}
              formData={formData}
              onUpdate={updateField}
            />

            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-colors"
                >
                  ← Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-[2] btn-primary py-3"
              >
                {step === steps.length - 2 ? 'Revisar y confirmar →' : 'Hazlo así →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* Generic field renderer based on step ID */
function GenericStepFields({
  stepId, funnelId, formData, onUpdate,
}: {
  stepId: string; funnelId: string; formData: Record<string, string>; onUpdate: (k: string, v: string) => void
}) {
  const Radio = ({ name, value, label, desc }: { name: string; value: string; label: string; desc?: string }) => (
    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
      formData[name] === value ? 'border-green bg-green/5' : 'border-gray-100 hover:border-gray-200'
    }`}>
      <input type="radio" name={name} value={value} checked={formData[name] === value}
             onChange={() => onUpdate(name, value)} className="mt-0.5 accent-green shrink-0"/>
      <div>
        <div className="font-semibold text-navy text-sm">{label}</div>
        {desc && <div className="text-gray-400 text-xs mt-0.5">{desc}</div>}
      </div>
    </label>
  )

  if (stepId === 'docs') {
    const key = 'docsSelected'
    const selected: string[] = (() => {
      const raw = formData[key]
      if (!raw) return []
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : []
      } catch {
        return []
      }
    })()

    const toggle = (id: string) => {
      const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
      onUpdate(key, JSON.stringify(next))
    }

    const DOCS_BASE: { id: string; label: string; hint?: string }[] = [
      { id: 'photo_id', label: 'Identificación con foto', hint: 'ID/License/Pasaporte' },
      { id: 'proof_address', label: 'Comprobante de domicilio', hint: 'renta, luz, agua, internet' },
      { id: 'proof_income', label: 'Comprobante de ingresos', hint: 'talones de cheque, carta del empleador, 1099' },
      { id: 'ssn_itin', label: 'SSN o ITIN (si tienes)', hint: 'si no tienes, igual puedes iniciar' },
      { id: 'immigration', label: 'Estatus migratorio (si aplica)', hint: 'permiso, residencia, etc.' },
      { id: 'household', label: 'Información del hogar', hint: 'quién vive contigo / niños' },
    ]

    const DOCS_EXTRA: Record<string, { id: string; label: string; hint?: string }[]> = {
      snap: [
        { id: 'expenses', label: 'Gastos mensuales', hint: 'renta/hipoteca, luz, agua, internet, childcare' },
      ],
      medicaid: [
        { id: 'insurance', label: 'Seguro médico actual (si tienes)', hint: 'tarjeta o póliza' },
        { id: 'kids_docs', label: 'Documentos de niños', hint: 'acta de nacimiento / vacunas (si aplica)' },
      ],
      wic: [
        { id: 'pregnancy_baby', label: 'Embarazo o bebé (si aplica)', hint: 'ultrasonido, acta, etc.' },
      ],
      id: [
        { id: 'birth_cert', label: 'Acta de nacimiento / pasaporte', hint: 'para identidad' },
        { id: 'ssn_card', label: 'Tarjeta de SSN (si aplica)', hint: 'si te la piden en DPS' },
      ],
      taxes: [
        { id: 'w2_1099', label: 'Formularios W-2 / 1099', hint: 'tus ingresos del año' },
        { id: 'dependents', label: 'Datos de dependientes', hint: 'nombres/fechas de nacimiento/SSN o ITIN' },
      ],
    }

    const docs = [...DOCS_BASE, ...(DOCS_EXTRA[funnelId] || [])]

    return (
      <div className="bg-cream-2 border border-cream rounded-xl p-5">
        <div className="text-sm font-semibold text-navy mb-3">Marca los documentos que ya tienes:</div>
        <p className="text-gray-500 text-sm mb-4">
          Selecciona todo lo que ya tienes. Esto nos ayuda a darte un plan realista (si te falta algo, te decimos cómo conseguirlo).
        </p>

        <div className="space-y-2">
          {docs.map(d => {
            const checked = selected.includes(d.id)
            return (
              <label
                key={d.id}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  checked ? 'border-green bg-green/5' : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(d.id)}
                  className="mt-0.5 accent-green shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-navy text-sm">{d.label}</div>
                  {d.hint && <div className="text-gray-400 text-xs mt-0.5">{d.hint}</div>}
                </div>
              </label>
            )
          })}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Tip: si no tienes nada todavía, no pasa nada — solo continúa.
        </div>
      </div>
    )
  }

  if (stepId === 'income') {
    return (
      <div className="space-y-3">
        <label className="label">Ingreso mensual total del hogar</label>
        {[['0-500','$0 – $500'],['500-1000','$500 – $1,000'],['1000-1500','$1,000 – $1,500'],['1500-2000','$1,500 – $2,000'],['2000-2500','$2,000 – $2,500'],['2500+','Más de $2,500']].map(([v,l]) => (
          <Radio key={v} name="monthlyIncome" value={v} label={l}/>
        ))}
      </div>
    )
  }

  if (stepId === 'family') {
    return (
      <div className="space-y-4">
        <div>
          <label className="label">¿Cuántas personas viven en tu hogar? (incluyéndote)</label>
          <input className="input" type="number" min="1" max="20" placeholder="Ej: 4"
                 value={formData.householdSize || ''} onChange={e => onUpdate('householdSize', e.target.value)}/>
        </div>
        <div>
          <label className="label">¿Hay niños menores de 18 años?</label>
          <div className="space-y-2">
            <Radio name="hasKids" value="yes" label="Sí, hay niños en el hogar"/>
            <Radio name="hasKids" value="no" label="No, solo adultos"/>
          </div>
        </div>
      </div>
    )
  }

  if (stepId === 'personal') {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre(s)</label>
          <input className="input" placeholder="Ej: María" value={formData.firstName || ''}
                 onChange={e => onUpdate('firstName', e.target.value)}/>
        </div>
        <div>
          <label className="label">Apellido(s)</label>
          <input className="input" placeholder="Ej: García" value={formData.lastName || ''}
                 onChange={e => onUpdate('lastName', e.target.value)}/>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Correo electrónico</label>
          <input className="input" type="email" placeholder="tu@correo.com" value={formData.email || ''}
                 onChange={e => onUpdate('email', e.target.value)}/>
        </div>
      </div>
    )
  }

  if (stepId === 'address') {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Dirección</label>
          <input className="input" placeholder="Ej: 1234 Main St" value={formData.address1 || ''}
                 onChange={e => onUpdate('address1', e.target.value)}/>
        </div>
        <div>
          <label className="label">Ciudad</label>
          <input className="input" placeholder="Ej: Katy" value={formData.city || ''}
                 onChange={e => onUpdate('city', e.target.value)}/>
        </div>
        <div>
          <label className="label">ZIP Code</label>
          <input className="input" placeholder="Ej: 77450" maxLength={5} value={formData.zipCode || ''}
                 onChange={e => onUpdate('zipCode', e.target.value)}/>
        </div>
      </div>
    )
  }

  if (stepId === 'employment') {
    return (
      <div className="space-y-3">
        <label className="label">Situación laboral actual</label>
        {[
          ['employed_w2','Empleado con W-2','Trabajo con cheque y deducciones'],
          ['self_employed','Trabajo por cuenta propia','Contratista, 1099, negocio propio'],
          ['unemployed','Sin trabajo actualmente','Buscando trabajo o entre trabajos'],
          ['part_time','Trabajo de medio tiempo','Menos de 32 horas por semana'],
        ].map(([v,l,d]) => <Radio key={v} name="employmentType" value={v} label={l} desc={d}/>)}
      </div>
    )
  }

  if (stepId === 'child') {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre del niño/a</label>
          <input className="input" placeholder="Ej: Sebastián" value={formData.childFirst || ''}
                 onChange={e => onUpdate('childFirst', e.target.value)}/>
        </div>
        <div>
          <label className="label">Apellido(s)</label>
          <input className="input" placeholder="Ej: García" value={formData.childLast || ''}
                 onChange={e => onUpdate('childLast', e.target.value)}/>
        </div>
        <div>
          <label className="label">Fecha de nacimiento</label>
          <input className="input" type="date" value={formData.childDOB || ''}
                 onChange={e => onUpdate('childDOB', e.target.value)}/>
        </div>
        <div>
          <label className="label">Grado actual o al que va a entrar</label>
          <select className="input" value={formData.childGrade || ''}
                  onChange={e => onUpdate('childGrade', e.target.value)}>
            <option value="">Seleccionar...</option>
            {['PK','K','1','2','3','4','5','6','7','8','9','10','11','12'].map(g => (
              <option key={g} value={g}>{g === 'PK' ? 'Pre-Kínder' : g === 'K' ? 'Kínder' : `${g}° Grado`}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  if (stepId === 'reason' || stepId === 'sepReason') {
    return (
      <div className="space-y-3">
        <label className="label">¿Por qué dejaste de trabajar?</label>
        {[
          ['laid_off','Me despidieron / layoff','Reducción de personal, cierre de empresa'],
          ['fired','Me terminaron el contrato','Por causas ajenas a un delito'],
          ['temp','Era un trabajo temporal','El contrato terminó según lo acordado'],
          ['quit','Renuncié voluntariamente','Por decisión propia'],
        ].map(([v,l,d]) => <Radio key={v} name="sepReason" value={v} label={l} desc={d}/>)}
      </div>
    )
  }

  // Default — generic text area
  return (
    <div>
      <label className="label">Información adicional (opcional)</label>
      <textarea
        className="input resize-none h-28"
        placeholder="Escribe cualquier información adicional relevante para tu trámite..."
        value={formData[stepId] || ''}
        onChange={e => onUpdate(stepId, e.target.value)}
      />
    </div>
  )
}
