import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'HazloAsíYa — Trámites en EE.UU. sin errores',
  description:
    'Guías en español para SNAP, Medicaid, escuela, ITIN y más. Te decimos qué hacer y qué documentos necesitas. Empieza gratis.',
  openGraph: {
    url: absoluteUrl('/'),
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function HomePage() {
  return <HomePageClient />
}
