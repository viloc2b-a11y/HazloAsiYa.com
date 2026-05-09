import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  /** Brief Semana 2 (≤60 chars para validate-content) */
  title: 'Medicaid Texas: CHIP, embarazadas y familias | HazloAsíYa',
  description:
    '¿Calificas para Medicaid en Texas? Guía actualizada 2026: CHIP para niños, cobertura para embarazadas y familias. Evaluación gratis.',
  alternates: alternatesForPath('/medicaid/texas/'),
  other: regulatoryMetadataOther('HHSC Texas / CMS'),
  openGraph: {
    url: absoluteUrl('/medicaid/texas/'),
    locale: 'es_US',
    images: [{ url: '/images/og/medicaid-texas-og.jpg', width: 1200, height: 630, alt: 'Medicaid en Texas' }],
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa Medicaid y CHIP (Texas)',
  description:
    'Información general sobre Medicaid y CHIP en Texas y preparación de solicitud. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/medicaid/texas/'),
  areaServed: { '@type': 'State', name: 'Texas' },
  availableLanguage: 'Spanish',
}

export default function MedicaidTexasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-4">
          Medicaid y CHIP en Texas
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Contenido educativo · La elegibilidad exacta la determina HHSC según tu categoría y documentación
        </p>

        <div className="mb-6 rounded-xl border border-green/30 bg-emerald-50/90 px-4 py-3 text-sm text-navy">
          <strong>Datos verificados:</strong> abril 2026 · <strong>Fuentes:</strong>{' '}
          <a
            href="https://www.hhs.texas.gov/services/health/medicaid-chip"
            className="text-green font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            hhs.texas.gov (Medicaid y CHIP)
          </a>
        </div>

        <div className="mb-8">
          <VerifiedInfoBanner officialUrl="https://www.hhs.texas.gov/services/health/medicaid-chip" />
        </div>

        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-navy mb-6">
          <p className="font-bold mb-1">Texas no expandió Medicaid (ACA) a adultos sin hijos dependientes</p>
          <p className="leading-relaxed">
            Un adulto sin hijos menores en Texas <strong>generalmente no califica</strong> para Medicaid regular solo
            por ingreso bajo. Si eres adulto sin hijos en Texas y no calificas para Medicaid, puedes explorar planes del{' '}
            <strong>Marketplace</strong> en{' '}
            <a
              href="https://www.healthcare.gov"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              healthcare.gov
            </a>{' '}
            — algunos tienen costos reducidos según tus ingresos y tamaño del hogar.
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-navy mb-8">
          <p className="font-bold mb-1">Importante</p>
          <p className="leading-relaxed">
            Verifica siempre tu caso en{' '}
            <a
              href="https://yourtexasbenefits.com"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YourTexasBenefits.com
            </a>{' '}
            o con HHSC — no asumas elegibilidad por lo que leas en sitios generales.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6">
          <h2 className="font-serif text-2xl text-navy">Quién puede calificar en Texas (orientación)</h2>
          <p className="text-sm text-gray-600">
            Texas administra Medicaid y CHIP con reglas estatales y federales. Las cifras son orientativas; HHSC decide
            según tu solicitud.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Niños (CHIP):</strong> cobertura para niños en hogares con ingresos más altos que Medicaid
              tradicional — orientativamente hasta alrededor de <strong>201% del FPL</strong> para CHIP (no es Medicaid
              pleno).
            </li>
            <li>
              <strong>Embarazadas:</strong> Medicaid para embarazadas con orientación de hasta aproximadamente{' '}
              <strong>198% FPL</strong>, más continuidad de cobertura posparto según reglas vigentes (p. ej. hasta{' '}
              <strong>12 meses</strong> postparto en muchos casos — confirma en HHSC).
            </li>
            <li>
              <strong>Padres con hijos dependientes elegibles:</strong> umbral muy bajo — orientativamente ingresos del
              hogar hasta alrededor del <strong>18% FPL</strong> para ciertos padres (verifica tablas oficiales).
            </li>
            <li>
              <strong>Adultos de 65 años o más y personas con discapacidad:</strong> pueden calificar bajo reglas
              federales y estatales específicas (no es lo mismo que la categoría de “adulto sin hijos” sin otras
              cualificaciones).
            </li>
            <li>
              <strong>Adultos sin hijos menores (sin embarazo ni otra categoría protegida):</strong> en general{' '}
              <strong>no</strong> califican por Medicaid solo por ingreso en Texas, porque el estado no adoptó la
              expansión de Medicaid de la ACA para ese grupo.
            </li>
          </ul>

          <h2 className="font-serif text-2xl text-navy">Dónde aplicar</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Portal integrado (Medicaid, SNAP, TANF, etc.):</strong>{' '}
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
              <strong>CHIP Texas:</strong>{' '}
              <a
                href="https://chip.hhs.texas.gov/"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                chip.hhs.texas.gov
              </a>
              . Si el enlace cambia, usa la sección oficial{' '}
              <a
                href="https://www.hhs.texas.gov/services/health/medicaid-chip"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medicaid y CHIP en hhs.texas.gov
              </a>
              .
            </li>
          </ul>

          <h2 className="font-serif text-2xl text-navy">Si estás en el área de Houston</h2>
          <p>
            Además del portal, <strong>2-1-1</strong> y centros comunitarios pueden orientarte. Prioriza información de
            HHSC y organizaciones acreditadas.
          </p>

          <h2 className="font-serif text-2xl text-navy">Próximo paso con HazloAsíYa</h2>
          <p>
            <Link href="/medicaid/form?state=texas" className="text-green font-semibold underline">
              Evaluar elegibilidad Medicaid / CHIP en Texas (gratis)
            </Link>{' '}
            para preparar documentos antes de la solicitud.
          </p>
          <p className="text-sm text-gray-500 border-t border-cream pt-6">
            HazloAsíYa no es HHSC ni CMS. No somos intermediarios del gobierno.
          </p>
        </div>
      </article>
    </div>
  )
}
