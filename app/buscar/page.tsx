import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import PagefindSearch from '@/components/PagefindSearch'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

const PATH = '/buscar/'

export const metadata: Metadata = {
  title: 'Buscar trámites y guías | HazloAsíYa',
  description:
    'Busca en español en HazloAsíYa: SNAP, Medicaid, escuela, impuestos, ITIN y más. Resultados en tu navegador.',
  alternates: alternatesForPath(PATH),
  robots: { index: true, follow: true },
  openGraph: {
    url: absoluteUrl(PATH),
    locale: 'es_US',
    title: 'Buscar | HazloAsíYa',
    description: 'Búsqueda en el sitio HazloAsíYa.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
}

export default function BuscarPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="text-green hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Buscar</span>
        </nav>
        <h1 className="font-serif text-3xl text-navy mb-2">Buscar en HazloAsíYa</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Escribe palabras como &quot;SNAP&quot;, &quot;Medicaid&quot;, &quot;W-7&quot; o &quot;escuela&quot;. Los
          resultados son locales a este sitio (sin enviar tu consulta a un servidor de terceros).
        </p>
        <PagefindSearch />
        <p className="text-xs text-gray-500 mt-10 border-t border-cream pt-6">
          Búsqueda con{' '}
          <a href="https://pagefind.app/" className="text-green underline" target="_blank" rel="noopener noreferrer">
            Pagefind
          </a>
          . Si no ves resultados tras un despliegue, confirma que el pipeline ejecutó el indexado post-build.
        </p>
      </main>
    </div>
  )
}
