import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'WIC Texas 2026: clínicas, ingresos y cita | HazloAsíYa',
  description:
    'WIC en Texas: límites de ingresos orientativos, cómo pedir cita en texaswic.org y qué llevar a la clínica. Contenido en español.',
  alternates: alternatesForPath('/wic/texas/'),
  other: regulatoryMetadataOther('USDA FNS / HHSC Texas'),
  openGraph: {
    url: absoluteUrl('/wic/texas/'),
    locale: 'es_US',
    title: 'WIC en Texas — requisitos y cita',
    description:
      'WIC en Texas: límites de ingresos orientativos, cómo pedir cita y documentos frecuentes. Contenido educativo.',
    images: [{ url: '/images/og/wic-texas-og.jpg', width: 1200, height: 630, alt: 'WIC en Texas' }],
  },
}

const faqItems = [
  {
    q: '¿Cuál es el límite de ingresos para WIC en Texas?',
    a: 'WIC usa límites basados en el tamaño del hogar y el FPL; la referencia federal suele citarse alrededor del 185% del FPL. Tu clínica WIC confirma si calificas con los comprobantes que presentes.',
  },
  {
    q: '¿Dónde agendo cita WIC en Texas?',
    a: 'Puedes empezar en texaswic.org o llamar al proveedor WIC de tu condado. En áreas urbanas hay varias clínicas; confirma horario y idioma antes de ir.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa WIC (Texas)',
  description: 'Información general sobre el programa WIC en Texas. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/wic/texas/'),
  areaServed: { '@type': 'State', name: 'Texas' },
  availableLanguage: 'Spanish',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'WIC', item: absoluteUrl('/wic/') },
    { '@type': 'ListItem', position: 3, name: 'WIC en Texas', item: absoluteUrl('/wic/texas/') },
  ],
}

export default function WicTexasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
          <Link href="/" className="hover:text-green">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/wic/" className="hover:text-green">
            WIC
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">WIC en Texas</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">WIC en Texas: clínicas, ingresos y cómo pedir cita</h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · La elegibilidad la determina la clínica WIC con tu entrevista y documentos
        </p>

        <p className="text-sm text-gray-700 mb-6 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Relacionado:</strong>{' '}
          <Link href="/wic/form?state=texas" className="text-green font-semibold hover:underline">
            Cuestionario WIC (gratis)
          </Link>
          {' · '}
          <Link href="/medicaid/" className="text-green font-semibold hover:underline">
            Medicaid / CHIP
          </Link>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP
          </Link>
        </p>

        <div className="mb-8">
          <VerifiedInfoBanner officialUrl="https://www.hhs.texas.gov/services/health/women-infants-children" />
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-navy">Quién administra WIC en Texas</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              El programa es federal (<strong>USDA FNS</strong>) y en Texas lo supervisa <strong>HHSC</strong>. Las clínicas
              locales hacen la inscripción y las tarjetas de beneficios. Sitio útil:{' '}
              <a href="https://texaswic.org" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                texaswic.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Ingresos (orientación)</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Muchas familias califican si los ingresos están por debajo del{' '}
              <strong>185% del nivel federal de pobreza</strong> para el tamaño del hogar. Hay excepciones si ya participas
              en SNAP, Medicaid o TANF — la clínica aplica las reglas del momento.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Cómo pedir cita</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Entra a texaswic.org o llama al número de tu proveedor regional.</li>
              <li>Reúne identificación, ingresos y domicilio.</li>
              <li>Asiste a la cita con los niños que inscribas si te lo piden.</li>
              <li>Si calificas, te explican cómo usar la tarjeta WIC en tiendas autorizadas.</li>
            </ol>
          </section>

          <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5 not-prose">
            <h2 className="font-serif text-xl text-navy mb-4">Preguntas frecuentes</h2>
            <dl className="space-y-4 text-sm">
              {faqItems.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-navy">{f.q}</dt>
                  <dd className="text-gray-600 mt-1 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-xs text-gray-500">HazloAsíYa no es HHSC ni USDA FNS.</p>
        </div>
      </article>
    </div>
  )
}
