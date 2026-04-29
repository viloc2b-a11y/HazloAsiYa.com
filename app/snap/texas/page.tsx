import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'SNAP Texas 2026 — cupones de comida | HazloAsíYa',
  description:
    'Límites de ingreso SNAP Texas 2026, Your Texas Benefits y oficina HHSC Houston oeste. Datos USDA FNS. Contenido educativo.',
  alternates: alternatesForPath('/snap/texas/'),
  other: regulatoryMetadataOther('USDA FNS / HHSC Texas'),
  openGraph: {
    url: absoluteUrl('/snap/texas/'),
    locale: 'es_US',
    images: [{ url: '/images/og/snap-texas-og.jpg', width: 1200, height: 630, alt: 'SNAP en Texas' }],
  },
}

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

export default function SnapTexasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">
          SNAP (cupones de comida) en Texas
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · Elegibilidad final la determina HHSC según tu hogar y documentación
        </p>

        <div className="mb-6 rounded-xl border border-green/30 bg-emerald-50/90 px-4 py-3 text-sm text-navy">
          <strong>Datos verificados:</strong> abril 2026 · <strong>Fuente:</strong> USDA FNS (límites vigentes oct.
          2025–sep. 2026) ·{' '}
          <a
            href="https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program"
            className="text-green font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Verificar en fns.usda.gov →
          </a>
        </div>

        <div className="mb-8 space-y-3">
          <VerifiedInfoBanner officialUrl="https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program">
            <p className="mt-3 text-xs text-gray-600 leading-relaxed border-t border-green/20 pt-3">
              <strong>Periodo de referencia federal SNAP:</strong> octubre 2025 – septiembre 2026. HHSC aplica las
              reglas del momento en Texas.
            </p>
          </VerifiedInfoBanner>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <h2 className="font-serif text-2xl text-navy">Límites de ingresos SNAP Texas 2026</h2>
          <p className="text-sm text-gray-600">
            Referencia federal vigente <strong>octubre 2025 – septiembre 2026</strong>. Los montos son orientativos;
            HHSC aplica las reglas del momento y puede solicitar pruebas adicionales.
          </p>
          <div className="overflow-x-auto rounded-xl border border-cream bg-white">
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
            Fuente: USDA FNS — límites de ingreso para el periodo 1 oct. 2025 – 30 sept. 2026.{' '}
            <a
              href="https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program"
              className="text-green underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentación oficial FNS
            </a>
            .
          </p>

          <h2 className="font-serif text-2xl text-navy">Cómo aplicar en Texas</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Portal oficial:</strong>{' '}
              <a
                href="https://yourtexasbenefits.com"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                YourTexasBenefits.com
              </a>
            </li>
            <li>
              <strong>Teléfono HHSC:</strong> marca <strong>2-1-1</strong> (gratuito; disponible en español en muchas
              áreas).
            </li>
            <li>
              <strong>App móvil:</strong> Your Texas Benefits (iOS y Android) — descarga desde la tienda de tu teléfono;
              verifica el nombre exacto del desarrollador (Texas HHSC).
            </li>
            <li>
              <strong>En persona:</strong> busca una oficina HHSC en{' '}
              <a
                href="https://www.hhs.texas.gov/about/hhs-locations"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                hhs.texas.gov (ubicaciones)
              </a>
              .
            </li>
          </ul>

          <h2 className="font-serif text-2xl text-navy">Qué suele revisar Texas</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Tamaño del hogar e ingresos frente a los límites de la tabla (bruto y neto según deducciones permitidas).</li>
            <li>Identidad, estatus cualificado y domicilio en Texas.</li>
            <li>Recursos y gastos deducibles según reglas vigentes.</li>
          </ul>

          <h2 className="font-serif text-2xl text-navy">Próximo paso con HazloAsíYa</h2>
          <p>
            Nuestro cuestionario te ayuda a ordenar documentos antes del portal oficial.{' '}
            <Link href="/snap/" className="text-green font-semibold underline">
              Ir a la guía general de SNAP
            </Link>
            .
          </p>
          <p className="text-sm text-gray-500 border-t border-cream pt-6">
            HazloAsíYa no es HHSC ni el USDA. No garantizamos aprobación de beneficios.
          </p>
        </div>
      </article>
    </div>
  )
}
