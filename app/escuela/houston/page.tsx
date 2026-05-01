import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'Inscripción escolar Houston: distritos | HazloAsíYa',
  description:
    'Inscripción en Houston: HISD, Katy ISD y más. Documentos típicos, vacunas y enlaces oficiales. Guía en español.',
  alternates: alternatesForPath('/escuela/houston/'),
  other: regulatoryMetadataOther('TEA / Houston-area ISDs'),
  openGraph: {
    url: absoluteUrl('/escuela/houston/'),
    locale: 'es_US',
    title: 'Inscripción escolar en Houston',
    description:
      'Distritos, documentos y pasos para inscribir a tu hijo en escuela pública en el área de Houston. Contenido educativo.',
    images: [{ url: '/images/og/escuela-houston-og.jpg', width: 1200, height: 630, alt: 'Escuela en Houston' }],
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa inscripción escolar (Houston)',
  description: 'Orientación sobre distritos y documentos para inscripción en el área de Houston.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/escuela/houston/'),
  areaServed: {
    '@type': 'City',
    name: 'Houston',
    containedInPlace: { '@type': 'State', name: 'Texas' },
  },
  availableLanguage: 'Spanish',
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Inscripción escolar', item: absoluteUrl('/escuela/') },
    { '@type': 'ListItem', position: 3, name: 'Houston', item: absoluteUrl('/escuela/houston/') },
  ],
}

export default function EscuelaHoustonPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
          <Link href="/" className="hover:text-green">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/escuela/" className="hover:text-green">
            Inscripción escolar
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Houston</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">
          Inscripción escolar en Houston: distritos, documentos y enlaces oficiales
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · Cada ISD publica fechas y formularios; confirma en el sitio de tu distrito
        </p>

        <p className="text-sm text-gray-700 mb-6 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Relacionado:</strong>{' '}
          <Link href="/escuela/" className="text-green font-semibold hover:underline">
            Inscripción Texas (cuestionario)
          </Link>
          {' · '}
          <Link href="/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/" className="text-green font-semibold hover:underline">
            Documentos para inscribir (guía)
          </Link>
          {' · '}
          <Link href="/iep/" className="text-green font-semibold hover:underline">
            IEP
          </Link>
        </p>

        <div className="mb-8">
          <VerifiedInfoBanner officialUrl="https://tea.texas.gov/" />
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-navy">Grandes distritos en el área</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>
                <strong>HISD (Houston ISD):</strong>{' '}
                <a href="https://www.houstonisd.org" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                  houstonisd.org
                </a>{' '}
                — portal de inscripción y fechas.
              </li>
              <li>
                <strong>Katy ISD:</strong>{' '}
                <a href="https://www.katyisd.org" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                  katyisd.org
                </a>{' '}
                — común para familias al oeste de Houston.
              </li>
              <li>
                Otros: Cypress-Fairbanks, Aldine, Fort Bend, etc. Usa el buscador de escuelas del distrito según tu dirección.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Documentos que casi siempre piden</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Acta o prueba de edad, comprobante de domicilio en el distrito, vacunas, identificación del tutor y a veces
              custodia si aplica. Lista detallada:{' '}
              <Link href="/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/" className="text-green font-bold underline">
                guía de documentos →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Vacunas y salud</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Texas exige ciertas vacunas para escuela pública. Si faltan, el condado Harris y clínicas comunitarias suelen
              ofrecer vacunación; verifica horarios en sitios oficiales del condado o del distrito.
            </p>
          </section>

          <p className="text-xs text-gray-500">HazloAsíYa no es HISD, Katy ISD ni TEA.</p>
        </div>
      </article>
    </div>
  )
}
