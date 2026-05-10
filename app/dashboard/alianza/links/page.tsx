'use client'
/**
 * /dashboard/alianza/links/ — Partner Link Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates per-funnel, per-channel tracking links for each Alianza partner.
 * Partners share these links via WhatsApp, flyers, Facebook, or their website.
 *
 * Link format:
 *   hazloasiya.com/{funnel}/{state}/?ref={slug}&org={type}&utm_source={channel}
 *
 * The 4 KPIs tracked from day 1:
 *   1. Visitas por partner
 *   2. Cuestionarios iniciados
 *   3. Compras
 *   4. Revenue por partner
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Partner {
  slug: string
  name: string
  organization_type: string | null
  city: string | null
  state: string | null
  tier: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = 'https://hazloasiya.com'

const FUNNELS = [
  { id: 'snap',     label: 'SNAP (Estampillas)',    icon: '🛒', states: ['texas', 'california', 'florida', 'new-york'] },
  { id: 'medicaid', label: 'Medicaid',              icon: '🏥', states: ['texas', 'california', 'florida', 'new-york'] },
  { id: 'wic',      label: 'WIC',                   icon: '🍼', states: ['texas', 'california', 'florida', 'new-york'] },
  { id: 'itin',     label: 'ITIN (Número fiscal)',  icon: '📋', states: [] },
  { id: 'daca',     label: 'DACA',                  icon: '🛡️', states: [] },
]

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp',   icon: '💬' },
  { id: 'flyer',    label: 'Flyer PDF',  icon: '📄' },
  { id: 'facebook', label: 'Facebook',   icon: '📘' },
  { id: 'web',      label: 'Sitio web',  icon: '🌐' },
  { id: 'pulpito',  label: 'Anuncio',    icon: '🎙️' },
]

const STATE_LABELS: Record<string, string> = {
  texas: 'Texas',
  california: 'California',
  florida: 'Florida',
  'new-york': 'Nueva York',
}

const MOCK_PARTNERS: Partner[] = [
  { slug: 'iglesia-bethel-houston',    name: 'Iglesia Bethel Houston',       organization_type: 'iglesia',   city: 'Houston',     state: 'TX', tier: 'impacto' },
  { slug: 'clinica-salud-san-antonio', name: 'Clínica Salud Comunitaria SA', organization_type: 'clinica',   city: 'San Antonio', state: 'TX', tier: 'estrategica' },
  { slug: 'centro-esperanza-dallas',   name: 'Centro Esperanza Dallas',      organization_type: 'nonprofit', city: 'Dallas',      state: 'TX', tier: 'basica' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLink(slug: string, orgType: string | null, funnelId: string, stateSlug: string | null, channel: string): string {
  const path = stateSlug ? `/${funnelId}/${stateSlug}/` : `/${funnelId}/`
  const params = new URLSearchParams({
    ref: slug,
    ...(orgType ? { org: orgType } : {}),
    utm_source: channel,
    utm_medium: 'alianza',
    utm_campaign: slug,
  })
  return `${BASE_URL}${path}?${params.toString()}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PartnerLinksPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [selectedFunnel, setSelectedFunnel] = useState(FUNNELS[0])
  const [selectedState, setSelectedState] = useState<string | null>('texas')
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0])
  const [copied, setCopied] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setPartners(MOCK_PARTNERS)
        setSelectedPartner(MOCK_PARTNERS[0])
        setIsMock(true)
        setLoading(false)
        return
      }
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('partners')
          .select('slug, name, organization_type, city, state, tier')
          .eq('active', true)
          .order('name')
        if (error) throw error
        const list = (data as Partner[]) || []
        setPartners(list)
        if (list.length > 0) setSelectedPartner(list[0])
        setIsMock(false)
      } catch {
        setPartners(MOCK_PARTNERS)
        setSelectedPartner(MOCK_PARTNERS[0])
        setIsMock(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // When funnel changes, reset state selection
  useEffect(() => {
    if (selectedFunnel.states.length > 0) {
      setSelectedState(selectedFunnel.states[0])
    } else {
      setSelectedState(null)
    }
  }, [selectedFunnel])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const currentLink = selectedPartner
    ? buildLink(selectedPartner.slug, selectedPartner.organization_type, selectedFunnel.id, selectedState, selectedChannel.id)
    : ''

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-[#0A2540] px-4 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-white text-lg">
            HazloAsí<span className="text-[#0EC96A]">Ya</span>
          </Link>
          <span className="text-white/25 hidden sm:block">/</span>
          <Link href="/dashboard/alianza/" className="text-white/50 hover:text-white text-sm hidden sm:block transition-colors">
            Alianza
          </Link>
          <span className="text-white/25 hidden sm:block">/</span>
          <span className="text-white/60 text-sm hidden sm:block">Generador de links</span>
        </div>
        <Link href="/dashboard/alianza/" className="text-white/50 hover:text-white text-sm transition-colors">
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Mock banner */}
        {isMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <p className="text-xs text-amber-700">
              Mostrando partners de demostración. Aplica la migración de Supabase para ver partners reales.
            </p>
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0A2540]">
            🔗 Generador de links
          </h1>
          <p className="text-[#0A2540]/50 text-sm mt-1">
            Crea links de seguimiento personalizados por trámite y canal para cada partner.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Configuration panel */}
          <div className="lg:col-span-1 space-y-4">

            {/* Step 1: Select partner */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">
                1 · Selecciona el partner
              </div>
              {loading ? (
                <div className="text-sm text-[#0A2540]/30">Cargando partners…</div>
              ) : (
                <div className="space-y-2">
                  {partners.map(p => (
                    <button
                      key={p.slug}
                      onClick={() => setSelectedPartner(p)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm ${
                        selectedPartner?.slug === p.slug
                          ? 'bg-[#0A2540] text-white border-[#0A2540]'
                          : 'bg-white text-[#0A2540] border-[#E8E2D8] hover:border-[#0EC96A]'
                      }`}
                    >
                      <div className="font-bold">{p.name}</div>
                      <div className={`text-xs mt-0.5 ${selectedPartner?.slug === p.slug ? 'text-white/50' : 'text-[#0A2540]/40'}`}>
                        {p.city}, {p.state} · {p.tier}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select funnel */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">
                2 · Trámite
              </div>
              <div className="space-y-1.5">
                {FUNNELS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFunnel(f)}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-all text-sm ${
                      selectedFunnel.id === f.id
                        ? 'bg-[#0EC96A]/10 text-[#0A6640] border-[#0EC96A]/40 font-bold'
                        : 'bg-white text-[#0A2540] border-[#E8E2D8] hover:border-[#0EC96A]/40'
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: State (if applicable) */}
            {selectedFunnel.states.length > 0 && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
                <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">
                  3 · Estado
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedFunnel.states.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedState(s)}
                      className={`px-3 py-2 rounded-xl border transition-all text-xs font-bold ${
                        selectedState === s
                          ? 'bg-[#0A2540] text-white border-[#0A2540]'
                          : 'bg-white text-[#0A2540] border-[#E8E2D8] hover:border-[#0A2540]/30'
                      }`}
                    >
                      {STATE_LABELS[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Channel */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">
                {selectedFunnel.states.length > 0 ? '4' : '3'} · Canal de distribución
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CHANNELS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChannel(c)}
                    className={`px-3 py-2 rounded-xl border transition-all text-xs font-bold ${
                      selectedChannel.id === c.id
                        ? 'bg-[#0A2540] text-white border-[#0A2540]'
                        : 'bg-white text-[#0A2540] border-[#E8E2D8] hover:border-[#0A2540]/30'
                    }`}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Generated link + all-channels table */}
          <div className="lg:col-span-2 space-y-4">

            {/* Main generated link */}
            {selectedPartner && (
              <div className="bg-[#0A2540] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-bold">{selectedFunnel.icon} {selectedFunnel.label}</span>
                  {selectedState && <span className="text-white/40 text-sm">· {STATE_LABELS[selectedState]}</span>}
                  <span className="text-white/40 text-sm">· {selectedChannel.icon} {selectedChannel.label}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 mb-4 font-mono text-xs text-[#0EC96A] break-all leading-relaxed">
                  {currentLink}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => copyToClipboard(currentLink, 'main')}
                    className="bg-[#0EC96A] text-[#0A2540] font-black px-5 py-2.5 rounded-xl hover:bg-[#0EC96A]/90 transition-colors text-sm"
                  >
                    {copied === 'main' ? '✅ Copiado' : '📋 Copiar link'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Usa este enlace para iniciar tu trámite con HazloAsíYa: ${currentLink}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
                  >
                    💬 Compartir WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* All channels for this funnel */}
            {selectedPartner && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8E2D8] bg-[#F5F0E8]">
                  <div className="font-bold text-[#0A2540] text-sm">
                    Todos los canales — {selectedFunnel.icon} {selectedFunnel.label}
                    {selectedState && ` · ${STATE_LABELS[selectedState]}`}
                  </div>
                  <div className="text-xs text-[#0A2540]/40 mt-0.5">
                    Para {selectedPartner.name}
                  </div>
                </div>
                <div className="divide-y divide-[#E8E2D8]">
                  {CHANNELS.map(ch => {
                    const link = buildLink(selectedPartner.slug, selectedPartner.organization_type, selectedFunnel.id, selectedState, ch.id)
                    const id = `${selectedFunnel.id}-${ch.id}`
                    return (
                      <div key={ch.id} className="px-5 py-3 flex items-center gap-3">
                        <span className="text-lg shrink-0">{ch.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#0A2540]">{ch.label}</div>
                          <div className="text-[10px] text-[#0A2540]/40 font-mono truncate mt-0.5">
                            {link.replace('https://hazloasiya.com', '')}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(link, id)}
                          className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                            copied === id
                              ? 'bg-[#0EC96A]/10 text-[#0A6640]'
                              : 'bg-[#F5F0E8] text-[#0A2540] hover:bg-[#E8E2D8]'
                          }`}
                        >
                          {copied === id ? '✅' : '📋 Copiar'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All funnels quick reference */}
            {selectedPartner && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8E2D8] bg-[#F5F0E8]">
                  <div className="font-bold text-[#0A2540] text-sm">
                    Referencia rápida — todos los trámites via WhatsApp
                  </div>
                  <div className="text-xs text-[#0A2540]/40 mt-0.5">
                    Para {selectedPartner.name}
                  </div>
                </div>
                <div className="divide-y divide-[#E8E2D8]">
                  {FUNNELS.flatMap(f => {
                    const states = f.states.length > 0 ? f.states : [null]
                    return states.map(s => {
                      const link = buildLink(selectedPartner.slug, selectedPartner.organization_type, f.id, s, 'whatsapp')
                      const id = `quick-${f.id}-${s}`
                      return (
                        <div key={id} className="px-5 py-3 flex items-center gap-3">
                          <span className="text-lg shrink-0">{f.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#0A2540]">
                              {f.label}{s ? ` · ${STATE_LABELS[s]}` : ''}
                            </div>
                            <div className="text-[10px] text-[#0A2540]/40 font-mono truncate mt-0.5">
                              {link.replace('https://hazloasiya.com', '')}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(link, id)}
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                              copied === id
                                ? 'bg-[#0EC96A]/10 text-[#0A6640]'
                                : 'bg-[#F5F0E8] text-[#0A2540] hover:bg-[#E8E2D8]'
                            }`}
                          >
                            {copied === id ? '✅' : '📋'}
                          </button>
                        </div>
                      )
                    })
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
