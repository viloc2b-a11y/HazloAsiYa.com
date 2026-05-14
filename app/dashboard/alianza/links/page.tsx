'use client'
export const dynamic = 'force-static'
/**
 * /dashboard/alianza/links/ — Partner Link Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates per-funnel, per-channel tracking links for each Alianza partner.
 * Features:
 *   - QR code preview (live, downloadable as PNG)
 *   - PDF flyer download (digital, branded, ready to email)
 *   - HTML widget snippet (partner pastes on their website)
 *   - All-channels table with copy buttons
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
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

type Tab = 'link' | 'qr' | 'flyer' | 'widget'

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

const FUNNEL_LABELS_ES: Record<string, string> = {
  snap: 'SNAP / Estampillas de comida',
  medicaid: 'Medicaid / Seguro médico',
  wic: 'WIC / Nutrición para madres',
  itin: 'ITIN / Número fiscal',
  daca: 'DACA / Permiso de trabajo',
}

const MOCK_PARTNERS: Partner[] = [
  { slug: 'iglesia-bethel-houston',    name: 'Iglesia Bethel Houston',       organization_type: 'iglesia',   city: 'Houston',     state: 'TX', tier: 'impacto' },
  { slug: 'clinica-salud-san-antonio', name: 'Clínica Salud Comunitaria SA', organization_type: 'clinica',   city: 'San Antonio', state: 'TX', tier: 'estrategica' },
  { slug: 'centro-esperanza-dallas',   name: 'Centro Esperanza Dallas',      organization_type: 'nonprofit', city: 'Dallas',      state: 'TX', tier: 'basica' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Primary link format: /ref/[slug]/?funnel=snap&state=texas&utm_source=whatsapp
 * This lands the family on the personalized partner page first.
 * Deep-links directly to the funnel if funnel+state are provided.
 */
function buildLink(slug: string, orgType: string | null, funnelId: string, stateSlug: string | null, channel: string): string {
  const params = new URLSearchParams({
    funnel: funnelId,
    ...(stateSlug ? { state: stateSlug } : {}),
    utm_source: channel,
    utm_medium: 'alianza',
    utm_campaign: slug,
  })
  return `${BASE_URL}/ref/${slug}/?${params.toString()}`
}

/**
 * Direct funnel link (bypasses partner page) — used in the quick-reference table.
 */
function buildDirectLink(slug: string, orgType: string | null, funnelId: string, stateSlug: string | null, channel: string): string {
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

function tierColor(tier: string) {
  if (tier === 'estrategica') return 'bg-[#0A2540] text-white'
  if (tier === 'impacto') return 'bg-[#0EC96A]/10 text-[#0A6640]'
  return 'bg-[#F5F0E8] text-[#0A2540]/60'
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
  const [activeTab, setActiveTab] = useState<Tab>('link')
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

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
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentLink = selectedPartner
    ? buildLink(selectedPartner.slug, selectedPartner.organization_type, selectedFunnel.id, selectedState, selectedChannel.id)
    : ''

  // Download QR as PNG
  const downloadQR = useCallback(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${selectedPartner?.slug ?? 'partner'}-${selectedFunnel.id}.png`
    a.click()
  }, [selectedPartner, selectedFunnel])

  // Download PDF flyer (opens print-ready page in new tab)
  const downloadFlyer = useCallback(() => {
    if (!selectedPartner) return
    const params = new URLSearchParams({
      partner: selectedPartner.slug,
      name: selectedPartner.name,
      funnel: selectedFunnel.id,
      state: selectedState ?? '',
      link: currentLink,
      funnelLabel: FUNNEL_LABELS_ES[selectedFunnel.id] ?? selectedFunnel.label,
      stateLabel: selectedState ? STATE_LABELS[selectedState] : '',
    })
    window.open(`/alianza/flyer/?${params.toString()}`, '_blank')
  }, [selectedPartner, selectedFunnel, selectedState, currentLink])

  // Widget HTML snippet
  const widgetSnippet = selectedPartner ? `<!-- HazloAsíYa — Widget de trámites para ${selectedPartner.name} -->
<a href="${currentLink}"
   target="_blank"
   rel="noopener noreferrer"
   style="display:inline-flex;align-items:center;gap:10px;background:#0A2540;color:#fff;
          font-family:sans-serif;font-size:15px;font-weight:700;padding:12px 22px;
          border-radius:12px;text-decoration:none;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0EC96A" stroke-width="2.5">
    <path d="M9 12l2 2 4-4"/>
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
  </svg>
  Tramita con HazloAsíYa →
</a>` : ''

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'link',   label: 'Link',    icon: '🔗' },
    { id: 'qr',     label: 'QR Code', icon: '▦' },
    { id: 'flyer',  label: 'Flyer',   icon: '📄' },
    { id: 'widget', label: 'Widget',  icon: '🌐' },
  ]

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
          <span className="text-white/60 text-sm hidden sm:block">Materiales</span>
        </div>
        <Link href="/dashboard/alianza/" className="text-white/50 hover:text-white text-sm transition-colors">
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {isMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <p className="text-xs text-amber-700">
              Mostrando partners de demostración. Aplica la migración de Supabase para ver partners reales.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0A2540]">
            🔗 Materiales del partner
          </h1>
          <p className="text-[#0A2540]/50 text-sm mt-1">
            Links de tracking, QR codes, flyers digitales y widget web para cada organización.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: Configuration ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Step 1: Partner */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-wide mb-3">
                1 · Organización
              </div>
              {loading ? (
                <div className="text-sm text-[#0A2540]/30">Cargando…</div>
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
                      <div className={`text-xs mt-0.5 flex items-center gap-2 ${selectedPartner?.slug === p.slug ? 'text-white/50' : 'text-[#0A2540]/40'}`}>
                        <span>{p.city}, {p.state}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${selectedPartner?.slug === p.slug ? 'bg-white/20 text-white' : tierColor(p.tier)}`}>
                          {p.tier}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Funnel */}
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

            {/* Step 3: State */}
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
                {selectedFunnel.states.length > 0 ? '4' : '3'} · Canal
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

          {/* ── Right: Output tabs ── */}
          <div className="lg:col-span-2 space-y-4">

            {selectedPartner && (
              <>
                {/* Tab bar */}
                <div className="flex gap-1 bg-white border border-[#E8E2D8] rounded-2xl p-1.5">
                  {TABS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === t.id
                          ? 'bg-[#0A2540] text-white'
                          : 'text-[#0A2540]/50 hover:text-[#0A2540]'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* ── Tab: Link ── */}
                {activeTab === 'link' && (
                  <div className="space-y-4">
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
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* All channels table */}
                    <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-[#E8E2D8] bg-[#F5F0E8]">
                        <div className="font-bold text-[#0A2540] text-sm">Todos los canales</div>
                        <div className="text-xs text-[#0A2540]/40 mt-0.5">{selectedFunnel.icon} {selectedFunnel.label}{selectedState ? ` · ${STATE_LABELS[selectedState]}` : ''} — {selectedPartner.name}</div>
                      </div>
                      <div className="divide-y divide-[#E8E2D8]">
                        {CHANNELS.map(ch => {
                          const link = buildLink(selectedPartner.slug, selectedPartner.organization_type, selectedFunnel.id, selectedState, ch.id)
                          const id = `ch-${ch.id}`
                          return (
                            <div key={ch.id} className="px-5 py-3 flex items-center gap-3">
                              <span className="text-lg shrink-0">{ch.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-[#0A2540]">{ch.label}</div>
                                <div className="text-xs text-[#0A2540]/40 font-mono truncate mt-0.5">
                                  {link.replace('https://hazloasiya.com', '')}
                                </div>
                              </div>
                              <button
                                onClick={() => copyToClipboard(link, id)}
                                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied === id ? 'bg-[#0EC96A]/10 text-[#0A6640]' : 'bg-[#F5F0E8] text-[#0A2540] hover:bg-[#E8E2D8]'}`}
                              >
                                {copied === id ? '✅' : '📋 Copiar'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab: QR Code ── */}
                {activeTab === 'qr' && (
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
                    <div className="text-sm font-bold text-[#0A2540] mb-1">QR Code</div>
                    <div className="text-xs text-[#0A2540]/40 mb-5">
                      {selectedPartner.name} · {selectedFunnel.icon} {selectedFunnel.label}{selectedState ? ` · ${STATE_LABELS[selectedState]}` : ''} · {selectedChannel.label}
                    </div>

                    {/* QR preview centered */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="bg-white border-2 border-[#E8E2D8] rounded-2xl p-6 inline-block">
                        {/* Visible SVG for display */}
                        <QRCodeSVG
                          value={currentLink}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#0A2540"
                          level="H"
                          includeMargin={false}
                        />
                        {/* Hidden canvas for download */}
                        <QRCodeCanvas
                          id="qr-canvas"
                          value={currentLink}
                          size={400}
                          bgColor="#ffffff"
                          fgColor="#0A2540"
                          level="H"
                          includeMargin={true}
                          style={{ display: 'none' }}
                        />
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-[#0A2540]/40 font-mono break-all max-w-xs mb-4">
                          {currentLink}
                        </div>
                        <button
                          onClick={downloadQR}
                          className="bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0D2A42] transition-colors text-sm"
                        >
                          ⬇️ Descargar QR (PNG)
                        </button>
                        <p className="text-xs text-[#0A2540]/30 mt-2">
                          400×400px · Listo para imprimir o insertar en flyers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab: Flyer ── */}
                {activeTab === 'flyer' && (
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
                    <div className="text-sm font-bold text-[#0A2540] mb-1">Flyer digital</div>
                    <div className="text-xs text-[#0A2540]/40 mb-5">
                      Página imprimible lista para enviar por email o WhatsApp al partner.
                    </div>

                    {/* Flyer preview mockup */}
                    <div className="border-2 border-[#E8E2D8] rounded-2xl overflow-hidden mb-5">
                      <div className="bg-[#0A2540] px-6 py-5 text-center">
                        <div className="text-[#0EC96A] font-black text-xl mb-1">HazloAsíYa</div>
                        <div className="text-white/60 text-xs">hazloasiya.com</div>
                      </div>
                      <div className="bg-cream px-6 py-5 text-center">
                        <div className="text-[#0A2540] font-black text-base mb-1">
                          {FUNNEL_LABELS_ES[selectedFunnel.id]}
                        </div>
                        {selectedState && (
                          <div className="text-[#0A2540]/50 text-xs mb-3">{STATE_LABELS[selectedState]}</div>
                        )}
                        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 inline-block mb-3">
                          <QRCodeSVG value={currentLink} size={120} bgColor="#ffffff" fgColor="#0A2540" level="H" />
                        </div>
                        <div className="text-[#0A2540]/40 text-xs font-mono break-all max-w-xs mx-auto mb-3">
                          {currentLink}
                        </div>
                        <div className="text-[#0A2540]/30 text-xs">
                          Presentado por {selectedPartner.name}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={downloadFlyer}
                      className="w-full bg-[#0EC96A] text-[#0A2540] font-black px-6 py-3 rounded-xl hover:bg-[#0EC96A]/90 transition-colors text-sm"
                    >
                      📄 Abrir flyer para imprimir / guardar como PDF
                    </button>
                    <p className="text-xs text-[#0A2540]/30 mt-2 text-center">
                      Se abre en nueva pestaña · Usa Ctrl+P / Cmd+P para guardar como PDF
                    </p>
                  </div>
                )}

                {/* ── Tab: Widget ── */}
                {activeTab === 'widget' && (
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
                    <div className="text-sm font-bold text-[#0A2540] mb-1">Widget para sitio web</div>
                    <div className="text-xs text-[#0A2540]/40 mb-5">
                      El partner pega este código HTML en su página web para mostrar un botón de trámites.
                    </div>

                    {/* Live preview */}
                    <div className="bg-[#F5F0E8] border border-[#E8E2D8] rounded-xl p-5 mb-4 flex items-center justify-center min-h-[80px]">
                      <a
                        href={currentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 bg-[#0A2540] text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#0D2A42] transition-colors"
                        onClick={e => e.preventDefault()}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EC96A" strokeWidth="2.5">
                          <path d="M9 12l2 2 4-4"/>
                          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                        </svg>
                        Tramita con HazloAsíYa →
                      </a>
                    </div>
                    <div className="text-xs text-[#0A2540]/30 text-center mb-4">Vista previa del botón</div>

                    {/* Code block */}
                    <div className="bg-[#0A2540] rounded-xl p-4 mb-4 relative">
                      <pre className="text-[#0EC96A] text-xs font-mono whitespace-pre-wrap break-all leading-relaxed overflow-x-auto">
                        {widgetSnippet}
                      </pre>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(widgetSnippet, 'widget')}
                        className="flex-1 bg-[#0A2540] text-white font-black px-5 py-2.5 rounded-xl hover:bg-[#0D2A42] transition-colors text-sm"
                      >
                        {copied === 'widget' ? '✅ Copiado' : '📋 Copiar código HTML'}
                      </button>
                    </div>
                    <p className="text-xs text-[#0A2540]/30 mt-2">
                      Compatible con WordPress, Wix, Squarespace y cualquier sitio web.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* All funnels quick reference */}
            {selectedPartner && activeTab === 'link' && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8E2D8] bg-[#F5F0E8]">
                  <div className="font-bold text-[#0A2540] text-sm">Todos los trámites — WhatsApp</div>
                  <div className="text-xs text-[#0A2540]/40 mt-0.5">{selectedPartner.name} · Links directos al trámite</div>
                </div>
                <div className="divide-y divide-[#E8E2D8]">
                  {FUNNELS.flatMap(f => {
                    const states = f.states.length > 0 ? f.states : [null]
                    return states.map(s => {
                      const link = buildDirectLink(selectedPartner.slug, selectedPartner.organization_type, f.id, s, 'whatsapp')
                      const id = `quick-${f.id}-${s}`
                      return (
                        <div key={id} className="px-5 py-3 flex items-center gap-3">
                          <span className="text-lg shrink-0">{f.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#0A2540]">
                              {f.label}{s ? ` · ${STATE_LABELS[s]}` : ''}
                            </div>
                            <div className="text-xs text-[#0A2540]/40 font-mono truncate mt-0.5">
                              {link.replace('https://hazloasiya.com', '')}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(link, id)}
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied === id ? 'bg-[#0EC96A]/10 text-[#0A6640]' : 'bg-[#F5F0E8] text-[#0A2540] hover:bg-[#E8E2D8]'}`}
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
