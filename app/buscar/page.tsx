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
  robots: { index: false, follow: true },
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

      {/* ── Hero: navy background (mismo estilo que /pdf/) ── */}
      <div className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-green tracking-widest uppercase mb-5">
            🔍 BÚSQUEDA EN EL SITIO
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-3">
            Buscar en{' '}
            <span className="text-green">HazloAsíYa</span>
          </h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-xl">
            Escribe palabras como <span className="text-white/90 font-semibold">&quot;SNAP&quot;</span>,{' '}
            <span className="text-white/90 font-semibold">&quot;Medicaid&quot;</span>,{' '}
            <span className="text-white/90 font-semibold">&quot;W-7&quot;</span> o{' '}
            <span className="text-white/90 font-semibold">&quot;escuela&quot;</span>. Los resultados son locales a este
            sitio — tu consulta no se envía a servidores de terceros.
          </p>
        </div>
      </div>

      {/* ── Search body: cream background ── */}
      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
          <Link href="/" className="text-green hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-[#0A2540]/30">/</span>
          <span className="text-[#0A2540]/60">Buscar</span>
        </nav>

        {/* Pagefind search widget */}
        <PagefindSearch />

        {/* Footer note */}
        <p className="text-xs text-[#0A2540]/35 mt-10 border-t border-[#E8E2D8] pt-6">
          Búsqueda con{' '}
          <a
            href="https://pagefind.app/"
            className="text-green underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pagefind
          </a>
          . Si no ves resultados tras un despliegue, confirma que el pipeline ejecutó el indexado post-build.
        </p>
      </main>
    </div>
  )
}
