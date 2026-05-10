'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { PartnerPublic } from './page'

// ── Constants ─────────────────────────────────────────────────────────────────

const ORG_ICONS: Record<string, string> = {
  iglesia:   '⛪',
  clinica:   '🏥',
  nonprofit: '🤝',
  escuela:   '🏫',
  consulado: '🏛️',
  legal:     '⚖️',
  red:       '🌐',
  default:   '🏢',
}

const ORG_LABELS: Record<string, string> = {
  iglesia:   'Iglesia',
  clinica:   'Clínica comunitaria',
  nonprofit: 'Organización sin fines de lucro',
  escuela:   'Escuela',
  consulado: 'Consulado',
  legal:     'Clínica legal',
  red:       'Red comunitaria',
  default:   'Organización comunitaria',
}

const ORG_MESSAGES: Record<string, string> = {
  iglesia:   'Tu iglesia te conecta con esta herramienta para que puedas hacer tus trámites de gobierno en español — solo, en minutos, desde tu teléfono.',
  clinica:   'Tu clínica te conecta con esta herramienta para que puedas acceder a beneficios de salud y gobierno en español, sin necesidad de abogado.',
  nonprofit: 'Tu organización te conecta con esta herramienta para que puedas hacer tus trámites de gobierno en español — gratis para empezar.',
  escuela:   'Tu escuela te conecta con esta herramienta para que tu familia pueda acceder a beneficios de gobierno en español, en minutos.',
  consulado: 'Tu consulado te conecta con esta herramienta para que puedas hacer tus trámites de gobierno en español, desde cualquier dispositivo.',
  default:   'Esta organización te conecta con HazloAsíYa para que puedas hacer tus trámites de gobierno en español — solo, en minutos.',
}

const FUNNELS = [
  {
    id: 'snap',
    label: 'SNAP',
    sublabel: 'Estampillas de comida',
    icon: '🛒',
    description: 'Beneficios de alimentos para familias de bajos ingresos.',
    states: ['texas', 'california', 'florida', 'new-york'],
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    iconBg: 'bg-orange-100',
  },
  {
    id: 'medicaid',
    label: 'Medicaid',
    sublabel: 'Seguro médico',
    icon: '🏥',
    description: 'Seguro médico gratuito o de bajo costo para tu familia.',
    states: ['texas', 'california', 'florida', 'new-york'],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'wic',
    label: 'WIC',
    sublabel: 'Nutrición para madres',
    icon: '🍼',
    description: 'Apoyo de nutrición para madres embarazadas y niños menores de 5 años.',
    states: ['texas', 'california', 'florida', 'new-york'],
    color: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    iconBg: 'bg-pink-100',
  },
  {
    id: 'itin',
    label: 'ITIN',
    sublabel: 'Número fiscal',
    icon: '📋',
    description: 'Número fiscal para declarar impuestos sin Social Security.',
    states: [],
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconBg: 'bg-purple-100',
  },
  {
    id: 'daca',
    label: 'DACA',
    sublabel: 'Permiso de trabajo',
    icon: '🛡️',
    description: 'Solicita o renueva tu permiso de trabajo y protección DACA.',
    states: [],
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconBg: 'bg-green-100',
  },
]

const STATE_LABELS: Record<string, string> = {
  texas: 'Texas',
  california: 'California',
  florida: 'Florida',
  'new-york': 'Nueva York',
}

const STATE_FLAGS: Record<string, string> = {
  texas: '🤠',
  california: '🌴',
  florida: '☀️',
  'new-york': '🗽',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PartnerLandingClient({ partner }: { partner: PartnerPublic }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedFunnel, setSelectedFunnel] = useState<typeof FUNNELS[0] | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [step, setStep] = useState<'funnel' | 'state' | 'ready'>('funnel')

  const orgIcon = ORG_ICONS[partner.organization_type ?? 'default'] ?? ORG_ICONS.default
  const orgLabel = ORG_LABELS[partner.organization_type ?? 'default'] ?? ORG_LABELS.default
  const orgMessage = ORG_MESSAGES[partner.organization_type ?? 'default'] ?? ORG_MESSAGES.default

  // Deep-link: if ?funnel= is in URL, skip to state or ready
  useEffect(() => {
    const funnelParam = searchParams.get('funnel')
    const stateParam = searchParams.get('state')
    if (funnelParam) {
      const f = FUNNELS.find(f => f.id === funnelParam)
      if (f) {
        setSelectedFunnel(f)
        if (f.states.length === 0) {
          setStep('ready')
        } else if (stateParam && f.states.includes(stateParam)) {
          setSelectedState(stateParam)
          setStep('ready')
        } else {
          setStep('state')
        }
      }
    }
  }, [searchParams])

  function buildFunnelUrl(funnelId: string, stateSlug: string | null): string {
    const path = stateSlug ? `/${funnelId}/${stateSlug}/` : `/${funnelId}/`
    const params = new URLSearchParams({
      ref: partner.slug,
      ...(partner.organization_type ? { org: partner.organization_type } : {}),
      utm_source: 'partner-page',
      utm_medium: 'alianza',
      utm_campaign: partner.slug,
    })
    return `${path}?${params.toString()}`
  }

  function handleFunnelSelect(funnel: typeof FUNNELS[0]) {
    setSelectedFunnel(funnel)
    if (funnel.states.length === 0) {
      setStep('ready')
    } else {
      setSelectedState(funnel.states[0])
      setStep('state')
    }
  }

  function handleStart() {
    if (!selectedFunnel) return
    const url = buildFunnelUrl(selectedFunnel.id, selectedState)
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">

      {/* ── Top bar — partner identity ── */}
      <div className="bg-[#0A2540] px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Partner avatar */}
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
              {orgIcon}
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">{partner.name}</div>
              <div className="text-white/40 text-[11px]">{orgLabel} · {partner.city}, {partner.state}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#0EC96A] font-black text-sm">HazloAsí<span className="text-white">Ya</span></div>
            <div className="text-white/30 text-[10px]">hazloasiya.com</div>
          </div>
        </div>
      </div>

      {/* ── Green accent bar ── */}
      <div className="h-1 bg-[#0EC96A]" />

      {/* ── Main content ── */}
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Partner message */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-2xl shrink-0">
            {orgIcon}
          </div>
          <div>
            <div className="font-bold text-[#0A2540] text-sm mb-1">{partner.name} te invita a usar HazloAsíYa</div>
            <p className="text-[#0A2540]/60 text-sm leading-relaxed">{orgMessage}</p>
          </div>
        </div>

        {/* ── Step: Select funnel ── */}
        {step === 'funnel' && (
          <div>
            <h1 className="font-serif text-2xl text-[#0A2540] mb-1">¿Qué trámite necesitas?</h1>
            <p className="text-[#0A2540]/50 text-sm mb-5">Selecciona el beneficio que quieres solicitar.</p>

            <div className="space-y-3">
              {FUNNELS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFunnelSelect(f)}
                  className={`w-full text-left border-2 rounded-2xl p-4 transition-all ${f.color}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[#0A2540] text-base">{f.label}</div>
                      <div className="text-[#0A2540]/60 text-sm">{f.sublabel}</div>
                      <div className="text-[#0A2540]/40 text-xs mt-0.5 leading-relaxed">{f.description}</div>
                    </div>
                    <div className="text-[#0A2540]/30 text-xl shrink-0">→</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust signals */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: '🆓', text: 'Gratis para empezar' },
                { icon: '🇲🇽', text: 'Todo en español' },
                { icon: '📱', text: 'Desde tu teléfono' },
              ].map(item => (
                <div key={item.text} className="bg-white border border-[#E8E2D8] rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-[10px] font-bold text-[#0A2540]/60">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: Select state ── */}
        {step === 'state' && selectedFunnel && (
          <div>
            <button
              onClick={() => setStep('funnel')}
              className="text-[#0A2540]/40 text-sm mb-4 flex items-center gap-1 hover:text-[#0A2540] transition-colors"
            >
              ← Cambiar trámite
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-xl ${selectedFunnel.iconBg ?? 'bg-[#F5F0E8]'} flex items-center justify-center text-2xl`}>
                {selectedFunnel.icon}
              </div>
              <div>
                <div className="font-black text-[#0A2540] text-lg">{selectedFunnel.label}</div>
                <div className="text-[#0A2540]/50 text-sm">{selectedFunnel.sublabel}</div>
              </div>
            </div>

            <h2 className="font-serif text-xl text-[#0A2540] mb-1">¿En qué estado vives?</h2>
            <p className="text-[#0A2540]/50 text-sm mb-5">Los requisitos varían por estado.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedFunnel.states.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedState(s)}
                  className={`border-2 rounded-2xl p-4 text-left transition-all ${
                    selectedState === s
                      ? 'bg-[#0A2540] border-[#0A2540] text-white'
                      : 'bg-white border-[#E8E2D8] text-[#0A2540] hover:border-[#0A2540]/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{STATE_FLAGS[s]}</div>
                  <div className="font-bold text-sm">{STATE_LABELS[s]}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('ready')}
              disabled={!selectedState}
              className="w-full bg-[#0EC96A] text-[#0A2540] font-black py-4 rounded-2xl text-base hover:bg-[#0EC96A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── Step: Ready to start ── */}
        {step === 'ready' && selectedFunnel && (
          <div className="text-center">
            <button
              onClick={() => setStep(selectedFunnel.states.length > 0 ? 'state' : 'funnel')}
              className="text-[#0A2540]/40 text-sm mb-6 flex items-center gap-1 hover:text-[#0A2540] transition-colors mx-auto"
            >
              ← Cambiar selección
            </button>

            {/* Summary card */}
            <div className="bg-white border-2 border-[#0EC96A]/30 rounded-2xl p-6 mb-6">
              <div className="text-4xl mb-3">{selectedFunnel.icon}</div>
              <div className="font-black text-[#0A2540] text-xl mb-1">{selectedFunnel.label}</div>
              <div className="text-[#0A2540]/50 text-sm mb-1">{selectedFunnel.sublabel}</div>
              {selectedState && (
                <div className="text-[#0A2540]/40 text-sm">
                  {STATE_FLAGS[selectedState]} {STATE_LABELS[selectedState]}
                </div>
              )}
            </div>

            {/* What to expect */}
            <div className="bg-[#F5F0E8] border border-[#E8E2D8] rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">Qué vas a hacer</div>
              <div className="space-y-2.5">
                {[
                  { n: '1', text: 'Responder unas preguntas sencillas sobre tu familia (5 min)' },
                  { n: '2', text: 'Ver si calificas para el beneficio' },
                  { n: '3', text: 'Recibir una guía paso a paso para completar tu solicitud' },
                ].map(item => (
                  <div key={item.n} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0A2540] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {item.n}
                    </div>
                    <div className="text-[#0A2540]/70 text-sm leading-relaxed">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner attribution */}
            <div className="text-[#0A2540]/30 text-xs mb-5">
              {orgIcon} Presentado por {partner.name}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              className="w-full bg-[#0A2540] text-white font-black py-4 rounded-2xl text-base hover:bg-[#0D2A42] transition-colors mb-3"
            >
              Empezar ahora — es gratis →
            </button>
            <p className="text-[#0A2540]/30 text-xs">
              Gratis para empezar · Solo pagas si quieres el PDF oficial al finalizar
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-[#E8E2D8] text-center">
          <Link href="/" className="text-[#0A2540]/30 text-xs hover:text-[#0A2540]/60 transition-colors">
            HazloAsíYa · hazloasiya.com
          </Link>
        </div>
      </div>
    </div>
  )
}
