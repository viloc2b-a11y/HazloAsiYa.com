import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import NoVenderForm from './NoVenderForm'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'No vender ni compartir mis datos | HazloAsíYa',
  description:
    'Opt-out de compartición de datos personales. Transparencia CCPA/CPRA para California. HazloAsíYa no vende datos.',
  alternates: alternatesForPath('/no-vender-mis-datos/'),
  openGraph: {
    url: absoluteUrl('/no-vender-mis-datos/'),
    locale: 'es_US',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Privacidad' }],
  },
}

export default function NoVenderPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/privacy/" className="text-sm text-green underline">
          ← Política de privacidad
        </Link>
        <h1 className="font-serif text-3xl text-navy mt-4 mb-3">No vender ni compartir mis datos personales</h1>
        <NoVenderForm />
      </main>
    </div>
  )
}
