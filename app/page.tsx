import type { Metadata } from 'next'
import HomeJsonLd from '@/components/home/HomeJsonLd'
import HomePageClient from '@/components/HomePageClient'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'HazloAsíYa: trámites en EE.UU. en español, paso a paso',
  description:
    'Guías y ayuda en español para trámites en EE.UU.: SNAP, Medicaid, ITIN, escuela, DACA y más. Documentos, requisitos y pasos exactos.',
  alternates: alternatesForPath('/'),
  openGraph: {
    title: 'HazloAsíYa: trámites en EE.UU. en español, paso a paso',
    description:
      'Guías y ayuda en español para trámites en EE.UU.: SNAP, Medicaid, ITIN, escuela, DACA y más. Documentos, requisitos y pasos exactos.',
    url: absoluteUrl('/'),
    locale: 'es_US',
    type: 'website',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomePageClient />
    </>
  )
}
