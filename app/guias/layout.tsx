import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Guías para trámites en EE.UU. en español | HazloAsíYa',
  description:
    'Listas de documentos, pasos, errores comunes y enlaces oficiales para SNAP, Medicaid, escuela, ITIN, renta y más — en español.',
  alternates: alternatesForPath('/guias/'),
  openGraph: {
    url: absoluteUrl('/guias/'),
    locale: 'es_US',
    type: 'website',
    title: 'Guías para trámites en EE.UU. en español | HazloAsíYa',
    description:
      'Listas de documentos, pasos, errores comunes y enlaces oficiales para SNAP, Medicaid, escuela, ITIN, renta y más — en español.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return children
}
