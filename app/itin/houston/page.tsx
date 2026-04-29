import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'ITIN en Houston — guía y documentos | HazloAsíYa',
  description:
    'ITIN en Houston: VITA gratis, BakerRipley, Goodwill y Acceptance Agents. Enlaces IRS. Contenido educativo.',
  alternates: alternatesForPath('/itin/houston/'),
  other: regulatoryMetadataOther('IRS'),
  openGraph: {
    url: absoluteUrl('/itin/houston/'),
    locale: 'es_US',
    images: [{ url: '/images/og/itin-houston-og.jpg', width: 1200, height: 630, alt: 'ITIN en Houston' }],
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa ITIN (Houston, Texas)',
  description:
    'Pasos generales para solicitar o renovar ITIN vinculados al área de Houston. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/itin/houston/'),
  areaServed: {
    '@type': 'City',
    name: 'Houston',
    containedInPlace: { '@type': 'State', name: 'Texas' },
  },
  availableLanguage: 'Spanish',
}

export default function ItinHoustonPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">
          ITIN en Houston
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · Autoridad exclusiva del IRS · Verificado: abril 2026
        </p>

        <div className="mb-8">
          <VerifiedInfoBanner officialUrl="https://www.irs.gov/individuals/international-taxpayers/taxpayer-identification-numbers-tin" />
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <p>
            El <strong>ITIN</strong> lo emite el <strong>IRS</strong> (Formulario W-7). En Houston hay opciones
            gratuitas o de bajo costo en temporada de impuestos y organizaciones con agentes de aceptación;{' '}
            <strong>confirma horario y cita antes de ir</strong>.
          </p>

          <h2 className="font-serif text-2xl text-navy">Dónde tramitar tu ITIN gratis en Houston</h2>

          <h3 className="font-serif text-lg text-navy">VITA (Volunteer Income Tax Assistance) — IRS</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Gratuito para quienes califican; muchos sitios usan un límite de ingresos (referencia frecuente del IRS:
              aprox. <strong>menos de $67,000</strong> — verifica el umbral vigente en la temporada actual).
            </li>
            <li>
              Algunos sitios cuentan con <strong>Acceptance Agents</strong> certificados por el IRS o pueden orientarte
              sobre el W-7 según capacidad.
            </li>
            <li>
              Buscar ubicaciones:{' '}
              <a
                href="https://www.irs.gov/individuals/find-a-location-for-free-tax-prep"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                irs.gov/individuals/find-a-location-for-free-tax-prep
              </a>
              .
            </li>
            <li>Muchas ubicaciones ofrecen ayuda en español; confirma al llamar o en el listado oficial.</li>
          </ul>
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Sedes y horarios VITA cambian cada temporada fiscal; usa solo el buscador oficial del IRS antes de visitar.
          </p>

          <h3 className="font-serif text-lg text-navy">BakerRipley Houston</h3>
          <p>
            BakerRipley ofrece servicios comunitarios amplios; según temporada pueden contar con apoyo fiscal o
            referencias a agentes de aceptación.
          </p>
          <p>
            <strong>Dirección de referencia:</strong> 6500 Rookin St, Houston TX 77074 ·{' '}
            <a href="https://www.bakerripley.org/" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              bakerripley.org
            </a>
          </p>
          <p className="text-sm font-medium text-amber-900 border border-amber-300 rounded-lg px-3 py-2 bg-amber-50">
            [Verificar disponibilidad antes de visitar] — llama o revisa el sitio para ITIN, VITA y citas.
          </p>

          <h3 className="font-serif text-lg text-navy">Goodwill Industries of Houston</h3>
          <p>
            Goodwill Houston participa en <strong>VITA</strong> en varias ubicaciones según temporada.{' '}
            <a
              href="https://www.goodwillhouston.org/"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              goodwillhouston.org
            </a>{' '}
            — confirma qué sitio ofrece VITA y si atienden casos con W-7.
          </p>
          <p className="text-sm font-medium text-amber-900 border border-amber-300 rounded-lg px-3 py-2 bg-amber-50">
            [Verificar horario vigente en su sitio] antes de desplazarte.
          </p>

          <h2 className="font-serif text-2xl text-navy">Acceptance Agents (IRS)</h2>
          <p>
            El IRS publica agentes certificados que pueden revisar documentos originales. Busca &quot;Acceptance
            Agent&quot; o &quot;Certifying Acceptance Agent&quot; en{' '}
            <a href="https://www.irs.gov/" className="text-green underline" target="_blank" rel="noopener noreferrer">
              IRS.gov
            </a>{' '}
            para Houston y códigos postales cercanos.
          </p>

          <h2 className="font-serif text-2xl text-navy">Próximo paso con HazloAsíYa</h2>
          <p>
            <Link href="/itin/" className="text-green font-semibold underline">
              Ir a la guía general de ITIN
            </Link>{' '}
            para armar documentos y revisar errores comunes del W-7.
          </p>

          <p className="text-sm text-gray-600 border-t border-cream pt-6 leading-relaxed">
            Estos recursos son independientes de HazloAsíYa. Te los compartimos como referencia. Verifica disponibilidad
            directamente con cada organización antes de visitarlos.
          </p>
          <p className="text-sm text-gray-500">
            HazloAsíYa no es el IRS ni ofrece asesoría fiscal profesional.
          </p>
        </div>
      </article>
    </div>
  )
}
