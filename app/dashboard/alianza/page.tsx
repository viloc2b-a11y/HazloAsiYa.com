'use client'
/**
 * /dashboard/alianza/ — Partner Impact Dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time dashboard for the Alianza HazloAsíYa program.
 * Shows per-partner stats: visits, funnel starts, purchases, revenue,
 * estimated savings, and conversion rates.
 *
 * Data sources:
 *   - partner_events table (visit, funnel_start, funnel_complete, purchase)
 *   - purchases table (partner_slug, amount, funnel, created_at)
 *   - partners table (name, org_type, city, state, tier, revenue_share_pct)
 *
 * Access: admin-only (checks localStorage for admin flag).
 * In production, replace with proper Supabase RLS + auth check.
 */

import { useState, useEffect, useCallback } from 'react'
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
  active: boolean
  created_at: string
}

interface PartnerStats {
  slug: string
  name: string
  organization_type: string | null
  city: string | null
  state: string | null
  tier: string
  revenue_share_pct: number
  visits: number
  funnel_starts: number
  funnel_completes: number
  purchases: number
  revenue_usd: number
  revenue_share_usd: number
  estimated_savings_usd: number
  conversion_rate: number // purchases / visits %
  top_funnel: string | null
}

interface SummaryStats {
  total_partners: number
  total_visits: number
  total_purchases: number
  total_revenue: number
  total_savings: number
  best_partner: string | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SAVINGS_PER_PURCHASE = 240 // avg savings vs hiring a notario/gestor
const DATE_RANGES = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Últimos 90 días', days: 90 },
  { label: 'Todo el tiempo', days: 0 },
]

const ORG_TYPE_LABELS: Record<string, string> = {
  iglesia: '⛪ Iglesia',
  clinica: '🏥 Clínica',
  nonprofit: '🤝 Nonprofit',
  centro: '🏘️ Centro comunitario',
  escuela: '🏫 Escuela',
  consulado: '🏛️ Consulado',
  legal: '⚖️ Clínica legal',
  red: '🌐 Red de inmigrantes',
}

const TIER_COLORS: Record<string, string> = {
  basica: 'bg-gray-100 text-gray-600',
  impacto: 'bg-blue-50 text-blue-700',
  estrategica: 'bg-amber-50 text-amber-700',
}

// ── Mock data for when Supabase is not yet configured ─────────────────────────

const MOCK_STATS: PartnerStats[] = [
  {
    slug: 'iglesia-bethel-houston',
    name: 'Iglesia Bethel Houston',
    organization_type: 'iglesia',
    city: 'Houston', state: 'TX', tier: 'impacto', revenue_share_pct: 15,
    visits: 312, funnel_starts: 184, funnel_completes: 156, purchases: 89,
    revenue_usd: 2581, revenue_share_usd: 387.15, estimated_savings_usd: 21360,
    conversion_rate: 28.5, top_funnel: 'snap',
  },
  {
    slug: 'centro-esperanza-dallas',
    name: 'Centro Esperanza Dallas',
    organization_type: 'centro',
    city: 'Dallas', state: 'TX', tier: 'basica', revenue_share_pct: 10,
    visits: 198, funnel_starts: 112, funnel_completes: 94, purchases: 51,
    revenue_usd: 1479, revenue_share_usd: 147.90, estimated_savings_usd: 12240,
    conversion_rate: 25.8, top_funnel: 'medicaid',
  },
  {
    slug: 'clinica-salud-san-antonio',
    name: 'Clínica Salud San Antonio',
    organization_type: 'clinica',
    city: 'San Antonio', state: 'TX', tier: 'estrategica', revenue_share_pct: 20,
    visits: 445, funnel_starts: 267, funnel_completes: 231, purchases: 134,
    revenue_usd: 3886, revenue_share_usd: 777.20, estimated_savings_usd: 32160,
    conversion_rate: 30.1, top_funnel: 'wic',
  },
  {
    slug: 'consulado-mx-houston',
    name: 'Consulado México Houston',
    organization_type: 'consulado',
    city: 'Houston', state: 'TX', tier: 'impacto', revenue_share_pct: 15,
    visits: 521, funnel_starts: 298, funnel_completes: 254, purchases: 147,
    revenue_usd: 4263, revenue_share_usd: 639.45, estimated_savings_usd: 35280,
    conversion_rate: 28.2, top_funnel: 'itin',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function AlianzaDashboard() {
  const [stats, setStats] = useState<PartnerStats[]>([])
  const [summary, setSummary] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState(1) // index into DATE_RANGES
  const [orgFilter, setOrgFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<keyof PartnerStats>('purchases')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [selectedPartner, setSelectedPartner] = useState<PartnerStats | null>(null)
  const [isMock, setIsMock] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured()) {
      // Show mock data with a banner
      setStats(MOCK_STATS)
      setSummary(computeSummary(MOCK_STATS))
      setIsMock(true)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const days = DATE_RANGES[dateRange].days
      const since = days > 0
        ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
        : null

      // Load partners
      const { data: partners, error: pErr } = await supabase
        .from('partners')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (pErr) throw pErr

      // Load partner_events (aggregated by slug)
      let eventsQuery = supabase
        .from('partner_events')
        .select('partner_slug, event_type')
      if (since) eventsQuery = eventsQuery.gte('created_at', since)
      const { data: events, error: eErr } = await eventsQuery
      if (eErr) throw eErr

      // Load purchases with partner_slug
      let purchasesQuery = supabase
        .from('purchases')
        .select('partner_slug, amount, funnel, created_at')
        .not('partner_slug', 'is', null)
      if (since) purchasesQuery = purchasesQuery.gte('created_at', since)
      const { data: purchases, error: purchErr } = await purchasesQuery
      if (purchErr) throw purchErr

      // Aggregate
      const statsMap: Record<string, PartnerStats> = {}

      for (const p of (partners as Partner[])) {
        statsMap[p.slug] = {
          slug: p.slug,
          name: p.name,
          organization_type: p.organization_type,
          city: p.city,
          state: p.state,
          tier: p.tier,
          revenue_share_pct: p.revenue_share_pct,
          visits: 0,
          funnel_starts: 0,
          funnel_completes: 0,
          purchases: 0,
          revenue_usd: 0,
          revenue_share_usd: 0,
          estimated_savings_usd: 0,
          conversion_rate: 0,
          top_funnel: null,
        }
      }

      // Count events
      for (const e of (events || [])) {
        if (!statsMap[e.partner_slug]) continue
        if (e.event_type === 'visit') statsMap[e.partner_slug].visits++
        if (e.event_type === 'funnel_start') statsMap[e.partner_slug].funnel_starts++
        if (e.event_type === 'funnel_complete') statsMap[e.partner_slug].funnel_completes++
      }

      // Count purchases and revenue
      const funnelCount: Record<string, Record<string, number>> = {}
      for (const pur of (purchases || [])) {
        const slug = pur.partner_slug
        if (!slug || !statsMap[slug]) continue
        statsMap[slug].purchases++
        statsMap[slug].revenue_usd += pur.amount || 0
        // Track funnel distribution
        if (!funnelCount[slug]) funnelCount[slug] = {}
        const f = pur.funnel || 'unknown'
        funnelCount[slug][f] = (funnelCount[slug][f] || 0) + 1
      }

      // Compute derived stats
      for (const slug of Object.keys(statsMap)) {
        const s = statsMap[slug]
        s.revenue_share_usd = Math.round(s.revenue_usd * s.revenue_share_pct) / 100
        s.estimated_savings_usd = s.purchases * SAVINGS_PER_PURCHASE
        s.conversion_rate = s.visits > 0 ? Math.round((s.purchases / s.visits) * 1000) / 10 : 0
        // Top funnel
        if (funnelCount[slug]) {
          s.top_funnel = Object.entries(funnelCount[slug]).sort((a, b) => b[1] - a[1])[0]?.[0] || null
        }
      }

      const allStats = Object.values(statsMap)
      setStats(allStats)
      setSummary(computeSummary(allStats))
      setIsMock(false)
    } catch (err) {
      console.error(err)
      setError('No se pudo cargar los datos. Verifica que la migración de Supabase esté aplicada.')
      setStats(MOCK_STATS)
      setSummary(computeSummary(MOCK_STATS))
      setIsMock(true)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => { loadData() }, [loadData])

  function computeSummary(data: PartnerStats[]): SummaryStats {
    const best = data.sort((a, b) => b.purchases - a.purchases)[0]
    return {
      total_partners: data.length,
      total_visits: data.reduce((s, p) => s + p.visits, 0),
      total_purchases: data.reduce((s, p) => s + p.purchases, 0),
      total_revenue: data.reduce((s, p) => s + p.revenue_usd, 0),
      total_savings: data.reduce((s, p) => s + p.estimated_savings_usd, 0),
      best_partner: best?.name || null,
    }
  }

  // Filter + sort
  const filtered = stats
    .filter(p => orgFilter === 'all' || p.organization_type === orgFilter)
    .sort((a, b) => {
      const av = a[sortBy] as number
      const bv = b[sortBy] as number
      return sortDir === 'desc' ? bv - av : av - bv
    })

  const toggleSort = (col: keyof PartnerStats) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const fmt = (n: number) => n.toLocaleString('es-MX')
  const fmtUSD = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-[#0A2540] px-4 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-white text-lg">
            HazloAsí<span className="text-[#0EC96A]">Ya</span>
          </Link>
          <span className="text-white/25 hidden sm:block">/</span>
          <span className="text-white/60 text-sm hidden sm:block">Dashboard Alianza</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/" className="text-white/50 hover:text-white text-sm transition-colors">
            ← Mi cuenta
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Mock data banner */}
        {isMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <div>
              <div className="font-bold text-amber-800 text-sm">Datos de demostración</div>
              <p className="text-xs text-amber-700 mt-0.5">
                Supabase no está configurado o la migración de partner tracking no se ha aplicado.
                Los datos mostrados son ejemplos. Aplica la migración{' '}
                <code className="bg-amber-100 px-1 rounded">20260509180000_partner_tracking.sql</code>{' '}
                en Supabase → SQL Editor para ver datos reales.
              </p>
            </div>
          </div>
        )}

        {/* Page title + controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0A2540]">
              🤝 Alianza HazloAsíYa
            </h1>
            <p className="text-[#0A2540]/50 text-sm mt-1">
              Impacto de partners comunitarios en tiempo real
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Date range */}
            <select
              value={dateRange}
              onChange={e => setDateRange(Number(e.target.value))}
              className="text-sm border border-[#E8E2D8] bg-white rounded-xl px-3 py-2 text-[#0A2540] font-medium"
            >
              {DATE_RANGES.map((r, i) => (
                <option key={r.label} value={i}>{r.label}</option>
              ))}
            </select>
            {/* Org type filter */}
            <select
              value={orgFilter}
              onChange={e => setOrgFilter(e.target.value)}
              className="text-sm border border-[#E8E2D8] bg-white rounded-xl px-3 py-2 text-[#0A2540] font-medium"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(ORG_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <Link
              href="/dashboard/alianza/links/"
              className="text-sm bg-[#0EC96A] text-[#0A2540] px-4 py-2 rounded-xl font-bold hover:bg-[#0EC96A]/90 transition-colors"
            >
              🔗 Generar links
            </Link>
            <button
              onClick={loadData}
              className="text-sm bg-[#0A2540] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#0D2A42] transition-colors"
            >
              ↻ Actualizar
            </button>
          </div>
        </div>

        {/* Summary KPI cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {[
              { label: 'Partners activos', value: fmt(summary.total_partners), icon: '🤝', color: 'border-[#0EC96A]/30' },
              { label: 'Visitas totales', value: fmt(summary.total_visits), icon: '👁️', color: 'border-blue-200' },
              { label: 'Compras', value: fmt(summary.total_purchases), icon: '✅', color: 'border-green-200' },
              { label: 'Revenue total', value: fmtUSD(summary.total_revenue), icon: '💰', color: 'border-amber-200' },
              { label: 'Ahorro comunidad', value: fmtUSD(summary.total_savings), icon: '🏘️', color: 'border-purple-200' },
            ].map(k => (
              <div key={k.label} className={`bg-white border ${k.color} rounded-2xl p-4`}>
                <div className="text-2xl mb-1">{k.icon}</div>
                <div className="text-xl font-black text-[#0A2540]">{k.value}</div>
                <div className="text-xs text-[#0A2540]/45 mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Partner table */}
        {loading ? (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-12 text-center">
            <div className="text-[#0A2540]/30 text-sm">Cargando datos de partners…</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">{error}</div>
        ) : (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E2D8] bg-[#F5F0E8]">
                    <th className="text-left px-4 py-3 font-bold text-[#0A2540]/60 text-xs uppercase tracking-wide">
                      Partner
                    </th>
                    {[
                      ['visits', 'Visitas'],
                      ['funnel_starts', 'Funnels'],
                      ['purchases', 'Compras'],
                      ['conversion_rate', 'Conv. %'],
                      ['revenue_usd', 'Revenue'],
                      ['revenue_share_usd', 'Su parte'],
                      ['estimated_savings_usd', 'Ahorro comunidad'],
                    ].map(([col, label]) => (
                      <th
                        key={col}
                        onClick={() => toggleSort(col as keyof PartnerStats)}
                        className="text-right px-4 py-3 font-bold text-[#0A2540]/60 text-xs uppercase tracking-wide cursor-pointer hover:text-[#0A2540] select-none whitespace-nowrap"
                      >
                        {label} {sortBy === col ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                      </th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-[#0A2540]/30 text-sm">
                        No hay partners en este filtro todavía.
                      </td>
                    </tr>
                  ) : filtered.map((p, i) => (
                    <tr
                      key={p.slug}
                      className={`border-b border-[#E8E2D8] hover:bg-[#F5F0E8]/50 transition-colors cursor-pointer ${
                        i === filtered.length - 1 ? 'border-b-0' : ''
                      }`}
                      onClick={() => setSelectedPartner(selectedPartner?.slug === p.slug ? null : p)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold text-[#0A2540] text-sm">{p.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.organization_type && (
                                <span className="text-[10px] text-[#0A2540]/40">
                                  {ORG_TYPE_LABELS[p.organization_type] || p.organization_type}
                                </span>
                              )}
                              {p.city && (
                                <span className="text-[10px] text-[#0A2540]/30">
                                  · {p.city}, {p.state}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[p.tier] || 'bg-gray-100 text-gray-500'}`}>
                            {p.tier}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#0A2540]">{fmt(p.visits)}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#0A2540]">{fmt(p.funnel_starts)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#0A2540]">{fmt(p.purchases)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          p.conversion_rate >= 25 ? 'bg-green-50 text-green-700' :
                          p.conversion_rate >= 15 ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {p.conversion_rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#0A2540]">{fmtUSD(p.revenue_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#0EC96A] font-bold">{fmtUSD(p.revenue_share_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-purple-600">{fmtUSD(p.estimated_savings_usd)}</td>
                      <td className="px-4 py-3 text-[#0A2540]/30 text-xs">
                        {selectedPartner?.slug === p.slug ? '▲' : '▼'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded partner detail */}
            {selectedPartner && (
              <div className="border-t border-[#E8E2D8] bg-[#F5F0E8] p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
                    <div className="text-xs text-[#0A2540]/40 mb-1">Enlace de partner</div>
                    <code className="text-xs text-[#0EC96A] break-all">
                      hazloasiya.com/snap/texas/?ref={selectedPartner.slug}
                    </code>
                  </div>
                  <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
                    <div className="text-xs text-[#0A2540]/40 mb-1">Trámite más popular</div>
                    <div className="font-bold text-[#0A2540] capitalize">
                      {selectedPartner.top_funnel || '—'}
                    </div>
                  </div>
                  <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
                    <div className="text-xs text-[#0A2540]/40 mb-1">Familias completaron solas</div>
                    <div className="font-bold text-[#0A2540]">
                      {selectedPartner.funnel_completes > 0
                        ? `${Math.round((selectedPartner.funnel_completes / selectedPartner.funnel_starts) * 100)}%`
                        : '—'}
                    </div>
                  </div>
                  <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
                    <div className="text-xs text-[#0A2540]/40 mb-1">Revenue share ({selectedPartner.revenue_share_pct}%)</div>
                    <div className="font-bold text-[#0EC96A] text-lg">
                      {fmtUSD(selectedPartner.revenue_share_usd)}
                    </div>
                  </div>
                </div>

                {/* Mini funnel bar */}
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
                  <div className="text-xs font-bold text-[#0A2540]/50 uppercase tracking-wide mb-3">
                    Embudo de conversión
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Visitas', val: selectedPartner.visits, color: 'bg-blue-400' },
                      { label: 'Iniciaron cuestionario', val: selectedPartner.funnel_starts, color: 'bg-amber-400' },
                      { label: 'Completaron cuestionario', val: selectedPartner.funnel_completes, color: 'bg-green-400' },
                      { label: 'Compraron', val: selectedPartner.purchases, color: 'bg-[#0EC96A]' },
                    ].map(step => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div className="text-xs text-[#0A2540]/50 w-44 shrink-0">{step.label}</div>
                        <div className="flex-1 bg-[#E8E2D8] rounded-full h-2">
                          <div
                            className={`${step.color} h-2 rounded-full transition-all`}
                            style={{ width: `${selectedPartner.visits > 0 ? Math.min(100, (step.val / selectedPartner.visits) * 100) : 0}%` }}
                          />
                        </div>
                        <div className="text-xs font-bold text-[#0A2540] w-10 text-right">{fmt(step.val)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add partner CTA */}
        <div className="mt-8 bg-[#0A2540] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-white">¿Agregar un nuevo partner?</div>
            <p className="text-white/50 text-sm mt-1">
              Ejecuta este SQL en Supabase para registrar una nueva organización:
            </p>
            <code className="text-[#0EC96A] text-xs mt-2 block bg-white/5 rounded-lg p-3 font-mono leading-relaxed">
              {`INSERT INTO partners (slug, name, organization_type, city, state, contact_email, tier)\nVALUES ('slug-unico', 'Nombre Org', 'iglesia', 'Houston', 'TX', 'email@org.com', 'basica');`}
            </code>
          </div>
          <a
            href="mailto:alianza@hazloasiya.com"
            className="shrink-0 bg-[#0EC96A] text-[#0A2540] font-black px-5 py-2.5 rounded-xl hover:bg-[#0EC96A]/90 transition-colors text-sm whitespace-nowrap"
          >
            Invitar partner →
          </a>
        </div>

      </div>
    </div>
  )
}
