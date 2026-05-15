import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import RelatedLinks from '@/components/seo/RelatedLinks'
import {
  RELATED_MEDICAID_CALIFORNIA,
  excludeGeoByHref,
  MEDICAID_STATE_GEO,
} from '@/data/related-link-clusters'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'Cómo solicitar Medicaid en California en español',
  description:
    'California (Medi-Cal): guía en español — ingresos orientativos, documentos frecuentes y cómo aplicar en BenefitsCal antes de enviar.',
  alternates: alternatesForPath('/medicaid/california/'),
  other: regulatoryMetadataOther('DHCS California / CMS'),
  openGraph: {
    url: absoluteUrl('/medicaid/california/'),
    locale: 'es_US',
    title: 'Cómo solicitar Medicaid en California en español',
    description:
      'California (Medi-Cal): guía en español — ingresos orientativos, documentos frecuentes y cómo aplicar en BenefitsCal antes de enviar.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Medi-Cal California' }],
  },
}

const faqItems = [
  {
    q: '¿Qué es Medi-Cal?',
    a: 'Medi-Cal es el nombre de Medicaid en California. Es un programa de seguro médico gratuito o de bajo costo para personas con ingresos bajos, administrado por el Departamento de Servicios de Salud de California (DHCS).',
  },
  {
    q: '¿Los inmigrantes indocumentados califican para Medi-Cal?',
    a: 'California es uno de los pocos estados que ofrece cobertura completa de Medi-Cal a adultos sin importar su estatus migratorio (Medi-Cal para Todos los Adultos, desde enero 2024). Esto incluye adultos de 19 a 64 años sin documentos.',
  },
  {
    q: '¿Cómo aplico a Medi-Cal?',
    a: 'Puedes aplicar en BenefitsCal.com (en línea, en español), llamar al 1-800-541-5555, ir a tu condado, o aplicar directamente en una clínica comunitaria FQHC.',
  },
  {
    q: '¿Cuánto cuesta Medi-Cal?',
    a: 'Para la mayoría de los beneficiarios, Medi-Cal es gratuito. Algunos adultos con ingresos entre el 138% y el 200% del FPL pueden tener copagos pequeños.',
  },
  {
    q: '¿Qué cubre Medi-Cal?',
    a: 'Medi-Cal cubre visitas médicas, hospitalización, medicamentos, salud mental, odontología (para adultos desde 2023), visión, y más. La cobertura exacta depende del plan de tu condado.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa Medi-Cal / Medicaid (California)',
  description: 'Información general sobre Medi-Cal en California. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/medicaid/california/'),
  areaServed: { '@type': 'State', name: 'California' },
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
    { '@type': 'ListItem', position: 2, name: 'Medicaid', item: absoluteUrl('/medicaid/') },
    { '@type': 'ListItem', position: 3, name: 'Medi-Cal California', item: absoluteUrl('/medicaid/california/') },
  ],
}

export default function MedicaidCaliforniaPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
          <Link href="/" className="hover:text-navy">Inicio</Link>
          {' › '}
          <Link href="/medicaid/" className="hover:text-navy">Medicaid</Link>
          {' › '}
          <span className="text-navy font-medium">California</span>
        </nav>

        <VerifiedInfoBanner officialUrl="https://www.dhcs.ca.gov/medi-cal" officialLinkText="Medi-Cal oficial (DHCS)" />

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mt-6 mb-4">
          Medi-Cal en California: quién califica y cómo aplicar en 2026
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contenido educativo · La elegibilidad exacta la determina el DHCS o tu condado según tu situación
        </p>

        <div className="space-y-8 text-gray-700">

          {/* Dato destacado: inmigrantes */}
          <section className="rounded-xl border border-green/30 bg-emerald-50/60 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h2 className="font-serif text-lg text-navy mb-2">California cubre a todos los adultos, sin importar estatus migratorio</h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  Desde enero de 2024, California ofrece <strong>Medi-Cal completo para todos los adultos de 19 a 64 años</strong>,
                  incluyendo personas sin documentos. Si tienes ingresos bajos y vives en California, probablemente calificas.
                </p>
              </div>
            </div>
          </section>

          {/* Límites de ingresos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Límites de ingresos Medi-Cal 2026 (orientativos)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Medi-Cal cubre a personas con ingresos hasta el 138% del FPL (o más en algunos programas):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy/5">
                    <th className="text-left p-3 font-semibold text-navy">Personas en el hogar</th>
                    <th className="text-right p-3 font-semibold text-navy">Ingreso mensual aprox. (138% FPL)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', '$1,732'],
                    ['2', '$2,352'],
                    ['3', '$2,972'],
                    ['4', '$3,591'],
                    ['5', '$4,211'],
                  ].map(([n, amt]) => (
                    <tr key={n} className="border-t border-gray-100">
                      <td className="p-3">{n} persona{n !== '1' ? 's' : ''}</td>
                      <td className="p-3 text-right font-mono">{amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Fuente orientativa: DHCS / CMS. Tu condado verifica el monto exacto.
            </p>
          </section>

          {/* Documentos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Documentos que suelen pedir</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Identificación con foto (pasaporte, matrícula consular, ID estatal — sin SSN requerido para inmigrantes)',
                'Comprobante de domicilio en California',
                'Comprobante de ingresos (o declaración de ingresos si trabajas en efectivo)',
                'Información de todos los miembros del hogar',
                'Para niños: acta de nacimiento',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cómo aplicar */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Cómo aplicar a Medi-Cal</h2>
            <ol className="space-y-3 text-sm">
              {[
                { n: '1', t: 'En línea', d: 'BenefitsCal.com — portal oficial en español. Puedes aplicar en cualquier momento.' },
                { n: '2', t: 'Por teléfono', d: 'Llama al 1-800-541-5555. Tienen operadores en español.' },
                { n: '3', t: 'En una clínica FQHC', d: 'Las clínicas comunitarias federalmente calificadas pueden ayudarte a aplicar directamente.' },
                { n: '4', t: 'En tu condado', d: 'Ve a la oficina de servicios sociales de tu condado con tus documentos.' },
                { n: '5', t: 'Aprobación', d: 'Si calificas, la cobertura puede ser retroactiva al primer día del mes en que aplicaste.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-green/15 text-green font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{step.n}</span>
                  <div>
                    <strong className="text-navy">{step.t}:</strong>{' '}
                    <span className="text-gray-600">{step.d}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
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
        </div>

        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">🏥</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para Medi-Cal?</p>
            <p className="text-white/70 text-sm">Responde 5 preguntas y te decimos qué documentos necesitas.</p>
          </div>
          <Link href="/medicaid/form?state=california" className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors">
            Evalúate gratis →
          </Link>
        </div>

        <RelatedLinks
          links={RELATED_MEDICAID_CALIFORNIA}
          geoLinks={excludeGeoByHref(MEDICAID_STATE_GEO, '/medicaid/california/')}
        />

        <p className="text-sm text-gray-500 border-t border-cream pt-6 mt-8">
          HazloAsíYa no es el DHCS ni el CMS. No garantizamos aprobación de beneficios. Este contenido es educativo.
        </p>
      </article>
    </div>
  )
}
