import { MetadataRoute } from 'next'
import { FUNNEL_ORDER } from '@/data/funnels'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://hazloasiya.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include indexable URLs. Gated flows like /form and /result should be noindex and excluded.
  const funnelPages = FUNNEL_ORDER.map(id => (
    { url: `${BASE}/${id}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 }
  ))

  return [
    { url: BASE,                   lastModified: new Date(), changeFrequency: 'daily' as const,   priority: 1.0 },
    { url: `${BASE}/terms`,        lastModified: new Date(), changeFrequency: 'yearly' as const,  priority: 0.3 },
    { url: `${BASE}/privacy`,      lastModified: new Date(), changeFrequency: 'yearly' as const,  priority: 0.3 },
    ...funnelPages,
  ]
}
