import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'Texas ID y licencia en español | HazloAsíYa',
  description:
    'Identificación estatal Texas (DPS): documentos, Real ID, primera licencia o traslado desde otro estado. Contenido educativo con fuentes oficiales.',
  alternates: alternatesForPath('/id/texas/'),
  other: regulatoryMetadataOther('Texas DPS'),
  openGraph: {
    url: absoluteUrl('/id/texas/'),
    locale: 'es_US',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Texas ID y licencia' }],
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa Texas ID y licencia (Texas)',
  description:
    'Información general en español sobre identificación y licencia de conducir en Texas. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/id/texas/'),
  areaServed: { '@type': 'State', name: 'Texas' },
  availableLanguage: 'Spanish',
}

export default function IdTexasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">Texas ID y licencia de conducir</h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · Los requisitos exactos los confirma el DPS en tu cita y según tu situación (primera vez,
          renovación, Real ID, etc.)
        </p>

        <div className="mb-6 rounded-xl border border-green/30 bg-emerald-50/90 px-4 py-3 text-sm text-navy">
          <strong>Verificado:</strong> abril 2026 · <strong>Fuente:</strong>{' '}
          <a
            href="https://www.dps.texas.gov/section/driver-license"
            className="text-green font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Texas DPS — Driver License
          </a>
        </div>

        <div className="mb-8">
          <VerifiedInfoBanner officialUrl="https://www.dps.texas.gov/section/driver-license" />
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <h2 className="font-serif text-2xl text-navy">Qué tramitas en el DPS</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            En Texas, el Departamento de Seguridad Pública (DPS) expide la tarjeta de identificación estatal y las
            licencias de conducir. Si necesitas volar dentro de EE. UU. con documento estatal, suele pedirse cumplimiento
            de <strong>Real ID</strong>; revisa en el sitio del DPS qué documentos originales exige para tu categoría.
          </p>

          <h2 className="font-serif text-2xl text-navy">Documentos que suele pedir Texas</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Prueba de identidad y presencia legal o estatus elegible según las listas vigentes del DPS.</li>
            <li>Prueba de número de Seguro Social o declaración correspondiente si aplica.</li>
            <li>Dos pruebas de domicilio en Texas con el formato que el DPS acepte en la fecha de tu cita.</li>
            <li>Si trasladas una licencia de otro estado, puede pedirse verificación adicional o exámenes.</li>
          </ul>

          <h2 className="font-serif text-2xl text-navy">Citas y oficinas</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            La mayoría de trámites requieren <strong>cita</strong>. Reserva en el sitio oficial del DPS; los tiempos de
            espera varían por región (Houston, Dallas, frontera, etc.).
          </p>

          <h2 className="font-serif text-2xl text-navy">Siguiente paso</h2>
          <p className="text-sm text-gray-600">
            Ordena tus documentos con el cuestionario orientativo:{' '}
            <Link href="/id/" className="text-green font-semibold underline">
              Guía Texas ID / licencia
            </Link>
            .
          </p>

          <p className="text-sm text-gray-500 border-t border-cream pt-6">
            HazloAsíYa no es el DPS ni un bufete. No garantizamos que te entreguen el documento.
          </p>
        </div>
      </article>
    </div>
  )
}
