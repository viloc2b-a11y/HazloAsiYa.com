import type { Metadata } from 'next'
import HomeJsonLd from '@/components/home/HomeJsonLd'
import HomePageClient from '@/components/HomePageClient'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'

const HOME_META_DESCRIPTION =
  'Completa trámites en EE.UU. sin errores. SNAP, Medicaid, ITIN, escuela, DACA y más. En español. Guías claras y formularios listos para entregar.'

export const metadata: Metadata = {
  title: 'HazloAsíYa: trámites en EE.UU. en español, paso a paso',
  description: HOME_META_DESCRIPTION,
  alternates: alternatesForPath('/'),
  openGraph: {
    title: 'HazloAsíYa: trámites en EE.UU. en español, paso a paso',
    description: HOME_META_DESCRIPTION,
    url: absoluteUrl('/'),
    locale: 'es_US',
    type: 'website',
    siteName: 'HazloAsíYa',
    images: [
      {
        url: '/images/og/default-og.jpg',
        width: 1200,
        height: 630,
        alt: 'HazloAsíYa — trámites en español',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HazloAsíYa: trámites en EE.UU. en español, paso a paso',
    description: HOME_META_DESCRIPTION,
    images: ['/images/og/default-og.jpg'],
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
