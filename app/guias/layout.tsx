import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Guías de trámites en EE.UU. en español | HazloAsíYa',
  description:
    'Explora guías paso a paso en español para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos, ITIN, renta y más, con fuentes oficiales.',
  alternates: alternatesForPath('/guias/'),
  openGraph: {
    url: absoluteUrl('/guias/'),
    locale: 'es_US',
    type: 'website',
    title: 'Guías de trámites en EE.UU. en español | HazloAsíYa',
    description:
      'Explora guías paso a paso en español para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos, ITIN, renta y más, con fuentes oficiales.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return children
}
