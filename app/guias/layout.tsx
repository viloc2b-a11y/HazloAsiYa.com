import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Guías en español | HazloAsíYa',
  description:
    'Guías paso a paso para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos y más. Fechas de vigencia y fuentes oficiales.',
  alternates: alternatesForPath('/guias/'),
  openGraph: {
    url: absoluteUrl('/guias/'),
    locale: 'es_US',
    type: 'website',
    title: 'Guías en español | HazloAsíYa',
    description:
      'Guías paso a paso para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos y más. Fechas de vigencia y fuentes oficiales.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return children
}
