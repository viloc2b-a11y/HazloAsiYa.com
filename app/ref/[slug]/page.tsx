/**
 * /ref/[slug]/ — Personalized partner landing page
 * ─────────────────────────────────────────────────────────────────────────────
 * When a family arrives via a partner's tracking link, they land here first.
 * The page shows the partner's name, org type, and city — making it feel like
 * the institution's own tool — then lets the family pick their tramite.
 *
 * URL: hazloasiya.com/ref/iglesia-bethel-houston/
 * Also accepts: hazloasiya.com/ref/iglesia-bethel-houston/?funnel=snap&state=texas
 *   to deep-link directly to a specific funnel (skips the selector).
 *
 * Attribution is captured automatically via PartnerTracker (root layout).
 */

import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PartnerLandingClient from './PartnerLandingClient'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PartnerPublic {
  slug: string
  name: string
  organization_type: string | null
  city: string | null
  state: string | null
  tier: string
}

// ── Server component — fetches partner from Supabase ─────────────────────────

async function getPartner(slug: string): Promise<PartnerPublic | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured (local dev), return a mock partner
  if (!url || !key) {
    const MOCK: Record<string, PartnerPublic> = {
      'iglesia-bethel-houston':    { slug: 'iglesia-bethel-houston',    name: 'Iglesia Bethel Houston',       organization_type: 'iglesia',   city: 'Houston',     state: 'TX', tier: 'impacto' },
      'clinica-salud-san-antonio': { slug: 'clinica-salud-san-antonio', name: 'Clínica Salud Comunitaria SA', organization_type: 'clinica',   city: 'San Antonio', state: 'TX', tier: 'estrategica' },
      'centro-esperanza-dallas':   { slug: 'centro-esperanza-dallas',   name: 'Centro Esperanza Dallas',      organization_type: 'nonprofit', city: 'Dallas',      state: 'TX', tier: 'basica' },
    }
    return MOCK[slug] ?? null
  }

  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('partners')
      .select('slug, name, organization_type, city, state, tier')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (error || !data) return null
    return data as PartnerPublic
  } catch {
    return null
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const partner = await getPartner(slug)
  if (!partner) return { title: 'HazloAsíYa' }
  return {
    title: `Trámites con ${partner.name} — HazloAsíYa`,
    description: `${partner.name} te conecta con HazloAsíYa para que puedas hacer tus trámites de gobierno en español, solo, en minutos.`,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PartnerRefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const partner = await getPartner(slug)

  if (!partner) notFound()

  return <PartnerLandingClient partner={partner} />
}
