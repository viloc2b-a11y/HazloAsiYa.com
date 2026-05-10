'use client'
/**
 * /alianza/reporte/[slug]/ — Monthly Impact Report for Partners
 * ─────────────────────────────────────────────────────────────────────────────
 * A shareable, printable monthly report for each Alianza partner.
 * Designed to be sent via email or WhatsApp to the partner contact.
 *
 * URL: hazloasiya.com/alianza/reporte/iglesia-bethel-houston/
 *      hazloasiya.com/alianza/reporte/iglesia-bethel-houston/?month=2026-04
 *
 * The report shows:
 *   - "Tu organización ayudó a X familias este mes."
 *   - 4 KPIs: visitas, cuestionarios, compras, revenue
 *   - Top trámites del mes
 *   - Ahorro estimado para la comunidad
 *   - Revenue share ganado
 *   - Mensaje de agradecimiento personalizado
 */

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
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
  revenue_share_pct: number
  contact_email: string | null
}

interface ReportData {
  partner: Partner
  month_label: string
  families_helped: number
  visits: number
  funnel_starts: number
  purchases: number
  revenue_usd: number
  revenue_share_usd: number
  estimated_savings_usd: number
  top_funnels: { name: string; icon: string; count: number }[]
  completion_rate: number
  prev_month_purchases: number
  growth_pct: number | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SAVINGS_PER_PURCHASE = 240

const FUNNEL_META: Record<string, { label: string; icon: string }> = {
  snap:     { label: 'SNAP',     icon: '🛒' },
  medicaid: { label: 'Medicaid', icon: '🏥' },
  wic:      { label: 'WIC',      icon: '🍼' },
  itin:     { label: 'ITIN',     icon: '📋' },
  daca:     { label: 'DACA',     icon: '🛡️' },
}

const ORG_GREETINGS: Record<string, string> = {
  iglesia:   'Estimado pastor y equipo',
  clinica:   'Estimado equipo de la clínica',
  nonprofit: 'Estimado equipo',
  centro:    'Estimado equipo del centro',
  escuela:   'Estimado equipo escolar',
  consulado: 'Estimado equipo consular',
  legal:     'Estimado equipo legal',
  red:       'Estimado equipo',
}

// ── Mock data ─────────────────────────────────────────────────────────────────

function getMockReport(slug: string, monthLabel: string): ReportData {
  const mockPartners: Record<string, Partner> = {
    'iglesia-bethel-houston': {
      slug: 'iglesia-bethel-houston', name: 'Iglesia Bethel Houston',
      organization_type: 'iglesia', city: 'Houston', state: 'TX',
      tier: 'impacto', revenue_share_pct: 15, contact_email: 'pastor@iglesiabetel.org',
    },
    'clinica-salud-san-antonio': {
      slug: 'clinica-salud-san-antonio', name: 'Clínica Salud Comunitaria SA',
      organization_type: 'clinica', city: 'San Antonio', state: 'TX',
      tier: 'estrategica', revenue_share_pct: 20, contact_email: 'director@clinicasalud.org',
    },
    'centro-esperanza-dallas': {
      slug: 'centro-esperanza-dallas', name: 'Centro Esperanza Dallas',
      organization_type: 'nonprofit', city: 'Dallas', state: 'TX',
      tier: 'basica', revenue_share_pct: 10, contact_email: 'info@centroesperanza.org',
    },
  }
  const partner = mockPartners[slug] || {
    slug, name: slug, organization_type: null, city: null, state: null,
    tier: 'basica', revenue_share_pct: 10, contact_email: null,
  }
  return {
    partner,
    month_label: monthLabel,
    families_helped: 47,
    visits: 184,
    funnel_starts: 112,
    purchases: 47,
    revenue_usd: 1363,
    revenue_share_usd: Math.round(1363 * partner.revenue_share_pct) / 100,
    estimated_savings_usd: 47 * SAVINGS_PER_PURCHASE,
    top_funnels: [
      { name: 'SNAP', icon: '🛒', count: 21 },
      { name: 'Medicaid', icon: '🏥', count: 14 },
      { name: 'WIC', icon: '🍼', count: 8 },
      { name: 'ITIN', icon: '📋', count: 4 },
    ],
    completion_rate: 82,
    prev_month_purchases: 38,
    growth_pct: Math.round(((47 - 38) / 38) * 100),
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMonthLabel(monthParam: string | null): { label: string; start: string; end: string } {
  const now = new Date()
  const target = monthParam
    ? new Date(`${monthParam}-01`)
    : new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const label = target.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  const start = target.toISOString().slice(0, 10)
  const endDate = new Date(target.getFullYear(), target.getMonth() + 1, 0)
  const end = endDate.toISOString().slice(0, 10)
  return { label: label.charAt(0).toUpperCase() + label.slice(1), start, end }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PartnerReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const monthParam = searchParams.get('month')

  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isMock, setIsMock] = useState(false)

  const { label: monthLabel, start: monthStart, end: monthEnd } = getMonthLabel(monthParam)

  useEffect(() => {
    async function load() {
      if (!slug) { setNotFound(true); setLoading(false); return }

      if (!isSupabaseConfigured()) {
        setReport(getMockReport(slug, monthLabel))
        setIsMock(true)
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()

        // Load partner
        const { data: partnerData, error: pErr } = await supabase
          .from('partners')
          .select('*')
          .eq('slug', slug)
          .eq('active', true)
          .single()

        if (pErr || !partnerData) { setNotFound(true); setLoading(false); return }
        const partner = partnerData as Partner

        // Load events for this month
        const { data: events } = await supabase
          .from('partner_events')
          .select('event_type, funnel_id')
          .eq('partner_slug', slug)
          .gte('created_at', `${monthStart}T00:00:00Z`)
          .lte('created_at', `${monthEnd}T23:59:59Z`)

        // Load purchases for this month
        const { data: purchases } = await supabase
          .from('purchases')
          .select('amount, funnel')
          .eq('partner_slug', slug)
          .gte('created_at', `${monthStart}T00:00:00Z`)
          .lte('created_at', `${monthEnd}T23:59:59Z`)

        // Load prev month purchases for growth calc
        const prevEnd = new Date(monthStart)
        prevEnd.setDate(prevEnd.getDate() - 1)
        const prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1)
        const { data: prevPurchases } = await supabase
          .from('purchases')
          .select('id')
          .eq('partner_slug', slug)
          .gte('created_at', prevStart.toISOString().slice(0, 10) + 'T00:00:00Z')
          .lte('created_at', prevEnd.toISOString().slice(0, 10) + 'T23:59:59Z')

        // Aggregate
        const visits = (events || []).filter(e => e.event_type === 'visit').length
        const funnel_starts = (events || []).filter(e => e.event_type === 'funnel_start').length
        const funnel_completes = (events || []).filter(e => e.event_type === 'funnel_complete').length
        const purchaseCount = (purchases || []).length
        const revenue = (purchases || []).reduce((s, p) => s + (p.amount || 0), 0)

        // Top funnels
        const funnelCounts: Record<string, number> = {}
        for (const p of (purchases || [])) {
          const f = p.funnel || 'unknown'
          funnelCounts[f] = (funnelCounts[f] || 0) + 1
        }
        const topFunnels = Object.entries(funnelCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([id, count]) => ({
            name: FUNNEL_META[id]?.label || id,
            icon: FUNNEL_META[id]?.icon || '📋',
            count,
          }))

        const prevCount = (prevPurchases || []).length
        const growthPct = prevCount > 0 ? Math.round(((purchaseCount - prevCount) / prevCount) * 100) : null

        setReport({
          partner,
          month_label: monthLabel,
          families_helped: purchaseCount,
          visits,
          funnel_starts,
          purchases: purchaseCount,
          revenue_usd: revenue,
          revenue_share_usd: Math.round(revenue * partner.revenue_share_pct) / 100,
          estimated_savings_usd: purchaseCount * SAVINGS_PER_PURCHASE,
          top_funnels: topFunnels,
          completion_rate: funnel_starts > 0 ? Math.round((funnel_completes / funnel_starts) * 100) : 0,
          prev_month_purchases: prevCount,
          growth_pct: growthPct,
        })
        setIsMock(false)
      } catch {
        setReport(getMockReport(slug, monthLabel))
        setIsMock(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, monthLabel, monthStart, monthEnd])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-[#0A2540]/30 text-sm">Cargando reporte…</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <div className="text-4xl">🤔</div>
        <div className="font-bold text-[#0A2540]">Partner no encontrado</div>
        <p className="text-[#0A2540]/50 text-sm">El slug "{slug}" no existe en la Alianza.</p>
        <Link href="/dashboard/alianza/" className="text-[#0EC96A] font-bold text-sm">← Volver al dashboard</Link>
      </div>
    )
  }

  if (!report) return null

  const { partner } = report
  const greeting = ORG_GREETINGS[partner.organization_type || ''] || 'Estimado equipo'
  const fmt = (n: number) => n.toLocaleString('es-MX')
  const fmtUSD = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav (hidden on print) */}
      <header className="bg-[#0A2540] px-4 h-14 flex items-center justify-between print:hidden">
        <Link href="/" className="font-serif text-white text-lg">
          HazloAsí<span className="text-[#0EC96A]">Ya</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/alianza/" className="text-white/50 hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-[#0EC96A] text-[#0A2540] font-black text-sm px-4 py-2 rounded-xl hover:bg-[#0EC96A]/90 transition-colors"
          >
            🖨️ Imprimir / PDF
          </button>
        </div>
      </header>

      {/* Mock banner */}
      {isMock && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-2 print:hidden">
          <span className="text-amber-500">⚠️</span>
          <p className="text-xs text-amber-700">Datos de demostración — aplica la migración de Supabase para ver datos reales.</p>
        </div>
      )}

      {/* Report content */}
      <div className="max-w-2xl mx-auto px-4 py-10 print:py-6 print:px-0">

        {/* Header */}
        <div className="bg-[#0A2540] rounded-3xl p-8 mb-6 text-center print:rounded-none">
          <div className="text-4xl mb-3">🤝</div>
          <div className="font-serif text-2xl text-white mb-1">
            Reporte de Impacto
          </div>
          <div className="text-[#0EC96A] font-bold text-lg">{report.month_label}</div>
          <div className="text-white/50 text-sm mt-2">{partner.name}</div>
          {partner.city && (
            <div className="text-white/30 text-xs mt-0.5">{partner.city}, {partner.state}</div>
          )}
        </div>

        {/* Greeting */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 mb-6">
          <p className="text-[#0A2540] text-sm leading-relaxed">
            <span className="font-bold">{greeting},</span>
          </p>
          <p className="text-[#0A2540] text-sm leading-relaxed mt-3">
            Gracias por ser parte de la <strong>Alianza HazloAsíYa</strong>. Gracias a su apoyo y a los enlaces que compartieron con su comunidad, este mes{' '}
            <strong className="text-[#0EC96A] text-base">{fmt(report.families_helped)} familias</strong>{' '}
            pudieron completar trámites de gobierno en español — solas, sin pagar a un notario, desde su teléfono.
          </p>
          {report.growth_pct !== null && report.growth_pct > 0 && (
            <p className="text-[#0A2540]/60 text-sm mt-3">
              📈 Eso es un <strong className="text-[#0EC96A]">+{report.growth_pct}%</strong> más que el mes anterior.
            </p>
          )}
        </div>

        {/* Big headline stat */}
        <div className="bg-[#0EC96A] rounded-2xl p-8 mb-6 text-center">
          <div className="text-6xl font-black text-[#0A2540]">{fmt(report.families_helped)}</div>
          <div className="text-[#0A2540]/70 font-bold text-lg mt-1">familias ayudadas este mes</div>
          <div className="text-[#0A2540]/50 text-sm mt-2">
            a través de los enlaces de {partner.name}
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Visitas a tu enlace', value: fmt(report.visits), icon: '👁️', sub: 'personas que hicieron clic' },
            { label: 'Cuestionarios iniciados', value: fmt(report.funnel_starts), icon: '📝', sub: `${report.completion_rate}% los completaron solos` },
            { label: 'Trámites completados', value: fmt(report.purchases), icon: '✅', sub: 'familias con acceso a guía oficial' },
            { label: 'Ahorro para la comunidad', value: fmtUSD(report.estimated_savings_usd), icon: '💰', sub: 'vs contratar un notario/gestor' },
          ].map(k => (
            <div key={k.label} className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-2xl mb-2">{k.icon}</div>
              <div className="text-2xl font-black text-[#0A2540]">{k.value}</div>
              <div className="text-xs font-bold text-[#0A2540] mt-0.5">{k.label}</div>
              <div className="text-[10px] text-[#0A2540]/40 mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Top funnels */}
        {report.top_funnels.length > 0 && (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 mb-6">
            <div className="font-bold text-[#0A2540] mb-4">Trámites más solicitados</div>
            <div className="space-y-3">
              {report.top_funnels.map((f, i) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#0A2540]">{f.name}</span>
                      <span className="text-xs text-[#0A2540]/50">{f.count} familias</span>
                    </div>
                    <div className="w-full bg-[#E8E2D8] rounded-full h-2">
                      <div
                        className="bg-[#0EC96A] h-2 rounded-full"
                        style={{ width: `${Math.max(10, (f.count / report.purchases) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0A2540]/30 w-5 text-right">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue share (only if tier > basica or has revenue) */}
        {report.revenue_share_usd > 0 && (
          <div className="bg-[#0A2540] rounded-2xl p-6 mb-6">
            <div className="font-bold text-white mb-1">💸 Su parte del revenue</div>
            <p className="text-white/50 text-xs mb-4">
              Como miembro del programa Alianza ({partner.tier}), reciben el {partner.revenue_share_pct}% del revenue generado por sus referencias.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-white/40">Revenue total generado</div>
                <div className="text-xl font-black text-white">{fmtUSD(report.revenue_usd)}</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Su parte ({partner.revenue_share_pct}%)</div>
                <div className="text-xl font-black text-[#0EC96A]">{fmtUSD(report.revenue_share_usd)}</div>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-4">
              El pago se procesa en los primeros 5 días del mes siguiente. Contacta a alianza@hazloasiya.com para confirmar datos bancarios.
            </p>
          </div>
        )}

        {/* Thank you + next steps */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 mb-6">
          <div className="font-bold text-[#0A2540] mb-3">Gracias por su confianza 🙏</div>
          <p className="text-[#0A2540]/70 text-sm leading-relaxed">
            Cada familia que ayudaron este mes es una familia que no tuvo que pagar $150–$300 a un notario, que no perdió una cita por no entender los formularios, y que pudo hacerlo sola — en español, desde su teléfono.
          </p>
          <p className="text-[#0A2540]/70 text-sm leading-relaxed mt-3">
            Para seguir creciendo juntos, les recomendamos compartir el enlace de {FUNNEL_META['snap']?.label} esta semana — es el trámite con mayor demanda en su área.
          </p>
          <div className="mt-4 bg-[#F5F0E8] rounded-xl p-3 font-mono text-xs text-[#0EC96A] break-all">
            hazloasiya.com/snap/texas/?ref={partner.slug}&org={partner.organization_type}&utm_source=whatsapp
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#0A2540]/30 text-xs">
          <div className="font-bold text-[#0A2540]/50 mb-1">HazloAsíYa · Alianza Comunitaria</div>
          <div>alianza@hazloasiya.com · hazloasiya.com</div>
          <div className="mt-1">Reporte generado automáticamente · {report.month_label}</div>
        </div>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
