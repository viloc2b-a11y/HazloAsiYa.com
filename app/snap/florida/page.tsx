import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import RelatedLinks from '@/components/seo/RelatedLinks'
import { RELATED_SNAP_FLORIDA, excludeGeoByHref, SNAP_STATE_GEO } from '@/data/related-link-clusters'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'SNAP Florida 2026: ACCESS Florida, ingresos y cómo aplicar',
  description:
    'SNAP Florida 2026: ingresos, ACCESS Florida y documentos requeridos. Guía en español.',
  alternates: alternatesForPath('/snap/florida/'),
  other: regulatoryMetadataOther('USDA FNS / Florida DCF'),
  openGraph: {
    url: absoluteUrl('/snap/florida/'),
    locale: 'es_US',
    title: 'SNAP Florida — ACCESS Florida y cómo aplicar',
    description:
      'SNAP en Florida: límites de ingresos, documentos y pasos para aplicar en ACCESS Florida. Contenido educativo en español.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'SNAP Florida' }],
  },
}

const faqItems = [
  {
    q: '¿Cómo aplico a SNAP en Florida?',
    a: 'Puedes aplicar en línea en myflorida.com/accessflorida (en español), en persona en tu oficina del DCF local, o por teléfono al 1-866-762-2237.',
  },
  {
    q: '¿Cuáles son los límites de ingresos para SNAP en Florida 2026?',
    a: 'Florida usa el límite federal estándar del 130% del FPL para ingresos brutos. Para un hogar de 3 personas, el límite orientativo es aproximadamente $2,311/mes. El DCF verifica el monto exacto.',
  },
  {
    q: '¿Cuánto tiempo tarda la aprobación de SNAP en Florida?',
    a: 'El DCF tiene 30 días para procesar tu solicitud. Si tu hogar tiene ingresos muy bajos o está en situación de emergencia, puedes calificar para beneficios expeditos en 7 días.',
  },
  {
    q: '¿Puedo renovar SNAP en Florida en línea?',
    a: 'Sí. Puedes renovar tu caso en myflorida.com/accessflorida antes de que expire tu período de certificación. Recibirás un aviso por correo con la fecha límite.',
  },
  {
    q: '¿Qué pasa si no reporto un cambio de ingresos en Florida?',
    a: 'Debes reportar cambios de ingresos dentro de los 10 días del mes siguiente. No hacerlo puede resultar en una sobrecompensación que tendrás que devolver, o en la cancelación de tus beneficios.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa SNAP (Florida)',
  description: 'Información general sobre SNAP en Florida. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/snap/florida/'),
  areaServed: { '@type': 'State', name: 'Florida' },
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
    { '@type': 'ListItem', position: 2, name: 'SNAP', item: absoluteUrl('/snap/') },
    { '@type': 'ListItem', position: 3, name: 'SNAP en Florida', item: absoluteUrl('/snap/florida/') },
  ],
}

export default function SnapFloridaPage() {
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
          <Link href="/snap/form?state=florida" className="hover:text-navy">SNAP</Link>
          {' › '}
          <span className="text-navy font-medium">Florida</span>
        </nav>

        <VerifiedInfoBanner officialUrl="https://www.myflorida.com/accessflorida" officialLinkText="ACCESS Florida (DCF)" />

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mt-6 mb-4">
          SNAP en Florida: cómo aplicar con ACCESS Florida en 2026
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contenido educativo · La elegibilidad exacta la determina el DCF según tu situación y documentación
        </p>

        {/* CTA principal */}
        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">🛒</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para SNAP en Florida?</p>
            <p className="text-white/70 text-sm">Responde 5 preguntas y te decimos qué documentos necesitas.</p>
          </div>
          <Link href="/snap/form?state=florida" className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors">
            Evalúate gratis →
          </Link>
        </div>

        <div className="space-y-8 text-gray-700">

          {/* Qué es SNAP en Florida */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">SNAP en Florida: lo que necesitas saber</h2>
            <p className="text-sm leading-relaxed mb-3">
              En Florida, SNAP es administrado por el{' '}
              <strong>Departamento de Niños y Familias (DCF)</strong> a través del portal{' '}
              <strong>ACCESS Florida</strong>. Florida tiene una de las poblaciones hispanas más grandes del país
              (especialmente en Miami-Dade, Broward, Orange y Hillsborough).
            </p>
            <p className="text-sm leading-relaxed">
              A diferencia de California, Florida usa los límites federales estándar (130% del FPL para ingresos brutos)
              y requiere que la mayoría de adultos aptos trabajen o participen en programas de empleo.
            </p>
          </section>

          {/* Límites de ingresos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Límites de ingresos SNAP Florida 2026 (orientativos)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Florida usa el 130% del FPL como límite de ingresos brutos mensuales. Valores orientativos:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy/5">
                    <th className="text-left p-3 font-semibold text-navy">Personas en el hogar</th>
                    <th className="text-right p-3 font-semibold text-navy">Ingreso bruto mensual (aprox.)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', '$1,632'],
                    ['2', '$2,215'],
                    ['3', '$2,798'],
                    ['4', '$3,380'],
                    ['5', '$3,963'],
                    ['6', '$4,546'],
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
              Fuente orientativa: USDA FNS / Florida DCF. Verifica con el DCF antes de aplicar.
            </p>
          </section>

          {/* Documentos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Documentos que suelen pedir en Florida</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Identificación con foto (pasaporte, ID estatal de Florida, matrícula consular)',
                'Número de Seguro Social de todos los miembros del hogar que aplican',
                'Comprobante de domicilio en Florida (factura de servicios, contrato de renta)',
                'Comprobante de ingresos del último mes (talones de pago, carta del empleador)',
                'Información de cuentas bancarias (si aplica)',
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
            <h2 className="font-serif text-xl text-navy mb-3">Cómo aplicar a SNAP en Florida</h2>
            <ol className="space-y-3 text-sm">
              {[
                { n: '1', t: 'En línea (recomendado)', d: 'Ve a myflorida.com/accessflorida — disponible en español. Crea una cuenta y llena la solicitud.' },
                { n: '2', t: 'Por teléfono', d: 'Llama al 1-866-762-2237 (ACCESS Florida). Tienen operadores en español.' },
                { n: '3', t: 'En persona', d: 'Ve a tu oficina del DCF local. Lleva originales y copias de todos los documentos.' },
                { n: '4', t: 'Entrevista telefónica', d: 'El DCF te llamará para una entrevista. Responde en el plazo indicado o tu caso puede cerrarse.' },
                { n: '5', t: 'Tarjeta EBT', d: 'Si te aprueban, recibirás tu tarjeta EBT por correo en 7–10 días hábiles.' },
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

          <RelatedLinks
            links={RELATED_SNAP_FLORIDA}
            geoLinks={excludeGeoByHref(SNAP_STATE_GEO, '/snap/florida/')}
          />
        </div>

        <p className="text-sm text-gray-500 border-t border-cream pt-6 mt-8">
          HazloAsíYa no es el DCF ni el USDA. No garantizamos aprobación de beneficios. Este contenido es educativo.
        </p>
      </article>
    </div>
  )
}
