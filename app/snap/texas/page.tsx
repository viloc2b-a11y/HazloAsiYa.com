import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import RelatedLinks from '@/components/seo/RelatedLinks'
import { RELATED_SNAP_TEXAS, excludeGeoByHref, SNAP_STATE_GEO } from '@/data/related-link-clusters'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'Cómo solicitar SNAP en Texas en español',
  description:
    'Texas: SNAP en español con HHSC — ingresos orientativos, documentos frecuentes y pasos en YourTexasBenefits antes de aplicar.',
  alternates: alternatesForPath('/snap/texas/'),
  other: regulatoryMetadataOther('USDA FNS / HHSC Texas'),
  openGraph: {
    url: absoluteUrl('/snap/texas/'),
    locale: 'es_US',
    title: 'Cómo solicitar SNAP en Texas en español',
    description:
      'Texas: SNAP en español con HHSC — ingresos orientativos, documentos frecuentes y pasos en YourTexasBenefits antes de aplicar.',
    images: [{ url: '/images/og/snap-texas-og.jpg', width: 1200, height: 630, alt: 'SNAP en Texas' }],
  },
}

const faqItems = [
  {
    q: '¿Quién administra SNAP en Texas?',
    a: 'El programa federal SNAP en Texas lo administra HHSC (Health and Human Services Commission). La solicitud y el seguimiento suelen hacerse por YourTexasBenefits.com o las vías que HHSC indique.',
  },
  {
    q: '¿Cuánto tarda la decisión después de aplicar?',
    a: 'Según las reglas generales del programa, la revisión puede llevar hasta 30 días; en situaciones que califiquen como emergencia alimentaria, puede aplicarse un plazo más corto (p. ej. 7 días). HHSC confirma tu caso.',
  },
  {
    q: '¿Qué pasa si me niegan SNAP?',
    a: 'Si la decisión es denegación, sueles tener un plazo (típicamente 90 días) para apelar. Revisa la notificación oficial de HHSC para fechas y el canal correcto.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa SNAP (Texas)',
  description:
    'Información general en español sobre el programa SNAP en Texas y cómo preparar la solicitud. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/snap/texas/'),
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
    { '@type': 'ListItem', position: 2, name: 'SNAP', item: absoluteUrl('/snap/') },
    { '@type': 'ListItem', position: 3, name: 'SNAP en Texas', item: absoluteUrl('/snap/texas/') },
  ],
}

export default function SnapTexasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
          <Link href="/" className="hover:text-navy">
            Inicio
          </Link>
          {' › '}
          <Link href="/snap/" className="hover:text-navy">
            SNAP
          </Link>
          {' › '}
          <span className="text-navy font-medium">Texas</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">
          SNAP en Texas: requisitos, ingresos y pasos para aplicar
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · La elegibilidad exacta la determina HHSC según tu hogar y documentación
        </p>

        <p className="text-sm text-gray-700 mb-6 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Enlazado en este tema:</strong>{' '}
          <Link href="/snap/form?state=texas" className="text-green font-semibold hover:underline">
            Cuestionario SNAP (gratis)
          </Link>
          {' · '}
          <Link href="/guias/documentos-para-snap/" className="text-green font-semibold hover:underline">
            Lista de documentos (guía)
          </Link>
        </p>

        <div className="mb-6 rounded-xl border border-green/30 bg-emerald-50/90 px-4 py-3 text-sm text-navy">
          <strong>Datos verificados:</strong> abril 2026 · <strong>Fuente ingresos:</strong> USDA FNS (oct. 2025–sep. 2026) ·{' '}
          <a
            href="https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program"
            className="text-green font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            fns.usda.gov
          </a>
        </div>

        <div className="mb-8 space-y-3">
          <VerifiedInfoBanner officialUrl="https://www.hhs.texas.gov/services/food/snap-food-benefits">
            <p className="mt-3 text-xs text-gray-600 leading-relaxed border-t border-green/20 pt-3">
              Para normativa y canales oficiales en Texas, revisa también{' '}
              <a
                href="https://www.hhs.texas.gov/services/food/snap-food-benefits"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                hhs.texas.gov (SNAP)
              </a>{' '}
              y{' '}
              <a
                href="https://yourtexasbenefits.com"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                YourTexasBenefits.com
              </a>
              .
            </p>
          </VerifiedInfoBanner>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section aria-labelledby="st-administra">
            <h2 id="st-administra" className="font-serif text-2xl text-navy">
              ¿Quién administra SNAP en Texas?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              En Texas, <strong>HHSC</strong> (Health and Human Services Commission) opera el programa bajo las reglas
              federales. La solicitud y el seguimiento se hacen principalmente a través de{' '}
              <a
                href="https://yourtexasbenefits.com"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                YourTexasBenefits.com
              </a>{' '}
              y la información de programa en{' '}
              <a
                href="https://www.hhs.texas.gov/services/food/snap-food-benefits"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                hhs.texas.gov
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="st-documentos">
            <h2 id="st-documentos" className="font-serif text-2xl text-navy">
              Documentos que suelen pedir en Texas
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Suele pedirse identidad, composición del hogar, ingresos, gastos deducibles y domicilio. Los formatos
              exactos cambian según tu caso.
            </p>
            <p className="text-sm">
              <Link href="/guias/documentos-para-snap/" className="text-green font-bold underline">
                Ver lista completa con ejemplos →
              </Link>
            </p>
          </section>

          <section aria-labelledby="st-limites">
            <h2 id="st-limites" className="font-serif text-2xl text-navy">
              Límites de ingresos SNAP Texas 2026
            </h2>
            <p className="text-sm text-gray-600">
              Referencia federal <strong>octubre 2025 – septiembre 2026</strong>. HHSC aplica las reglas del momento.
            </p>
            <div className="overflow-x-auto rounded-xl border border-cream bg-white not-prose">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-cream bg-cream-2">
                    <th className="p-3 font-semibold text-navy">Tamaño del hogar</th>
                    <th className="p-3 font-semibold text-navy">Ingreso bruto mensual máx.</th>
                    <th className="p-3 font-semibold text-navy">Ingreso neto mensual máx.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cream">
                    <td className="p-3">1 persona</td>
                    <td className="p-3">$1,580</td>
                    <td className="p-3">$1,215</td>
                  </tr>
                  <tr className="border-b border-cream">
                    <td className="p-3">2 personas</td>
                    <td className="p-3">$2,137</td>
                    <td className="p-3">$1,644</td>
                  </tr>
                  <tr className="border-b border-cream">
                    <td className="p-3">3 personas</td>
                    <td className="p-3">$2,694</td>
                    <td className="p-3">$2,072</td>
                  </tr>
                  <tr className="border-b border-cream">
                    <td className="p-3">4 personas</td>
                    <td className="p-3">$3,250</td>
                    <td className="p-3">$2,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              Fuente: USDA FNS — periodo 1 oct. 2025 – 30 sept. 2026.
            </p>
          </section>

          <section aria-labelledby="st-pasos">
            <h2 id="st-pasos" className="font-serif text-2xl text-navy">
              Cómo aplicar en Texas paso a paso
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Crea una cuenta en YourTexasBenefits.com (o usa la app oficial si aplica).</li>
              <li>Completa la solicitud en línea con los datos del hogar.</li>
              <li>Sube o entrega en oficina HHSC los documentos que te pidan.</li>
              <li>Asiste a una entrevista telefónica si HHSC te contacta para programarla.</li>
              <li>Revisa el estado en el portal o en la app de Your Texas Benefits.</li>
            </ol>
          </section>

          <section aria-labelledby="st-despues">
            <h2 id="st-despues" className="font-serif text-2xl text-navy">
              ¿Qué pasa después de enviar la solicitud?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>
                <strong>Revisión:</strong> hasta 30 días en muchos casos; plazos más cortos pueden aplicar en emergencias
                alimentarias según reglas vigentes.
              </li>
              <li>Puede haber entrevista telefónica o pedidos adicionales de información.</li>
              <li>Si aprueban: recibes la tarjeta EBT de Texas según el proceso estándar.</li>
              <li>Si deniegan: revisa el aviso para apelar (típicamente hasta 90 días para apelar según la notificación).</li>
            </ul>
          </section>

          <section aria-labelledby="st-errores">
            <h2 id="st-errores" className="font-serif text-2xl text-navy">
              Errores comunes en Texas
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>No revisar el estado del caso en YourTexasBenefits después de aplicar.</li>
              <li>No responder a requerimientos de HHSC dentro del plazo.</li>
              <li>Enviar fotos o PDF ilegibles o recortados.</li>
              <li>No reportar cambios de ingresos o de domicilio cuando corresponde.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-navy/10 bg-white p-5 not-prose" aria-labelledby="st-faq">
            <h2 id="st-faq" className="font-serif text-xl text-navy mb-4">
              Preguntas frecuentes
            </h2>
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

        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 not-prose">
          <div className="text-4xl">🛒</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para SNAP en Texas?</p>
            <p className="text-white/70 text-sm">Responde unas preguntas y revisa qué documentos preparar.</p>
          </div>
          <Link
            href="/snap/form?state=texas"
            className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors"
          >
            Evalúate gratis →
          </Link>
        </div>

        <RelatedLinks
          links={RELATED_SNAP_TEXAS}
          geoLinks={excludeGeoByHref(SNAP_STATE_GEO, '/snap/texas/')}
        />

        <p className="text-sm text-gray-500 pt-6 not-prose">
          HazloAsíYa no es HHSC ni el USDA. No garantizamos aprobación de beneficios.
        </p>
      </article>
    </div>
  )
}
