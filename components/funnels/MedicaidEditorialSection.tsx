import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Texas expandió Medicaid a todos los adultos sin hijos?',
    a: 'No. Texas no adoptó la expansión Medicaid de la Ley del Cuidado de Salud Asequible (ACA). Por eso los adultos sin hijos dependientes menores en el hogar generalmente no califican para Medicaid regular en Texas. Si ese es tu caso, suele tocarse explorar cobertura en el Marketplace (healthcare.gov) u otras opciones según tu situación.',
  },
  {
    q: '¿Qué diferencia hay entre Medicaid y CHIP en Texas?',
    a: 'Medicaid cubre a grupos elegibles como ciertos padres con hijos menores (con límites de ingreso muy bajos), embarazadas que califican, y a menudo a adultos mayores o personas con discapacidad según reglas federales. CHIP está orientado a niños y adolescentes hasta 18 años en hogares con ingresos un poco más altos (hasta alrededor del 201% del FPL según el tamaño del hogar). Ambos programas se suelen tramitar por el mismo portal: YourTexasBenefits.com.',
  },
  {
    q: '¿Dónde aplico a Medicaid o CHIP en Texas?',
    a: 'La vía principal es crear o usar tu cuenta en YourTexasBenefits.com, completar la solicitud y subir la documentación que HHSC pida. Una misma solicitud puede evaluarte para Medicaid, CHIP y otros beneficios; los plazos de respuesta varían según el caso (por ejemplo, HHSC publica orientación sobre plazos para embarazo frente a otros casos).',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación Medicaid y CHIP (Texas)',
  serviceType: 'Asistencia médica gubernamental',
  description:
    'Contenido educativo en español sobre Medicaid y CHIP en Texas, grupos elegibles y pasos para preparar la solicitud. No sustituye la determinación oficial de HHSC.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/medicaid/'),
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
    { '@type': 'ListItem', position: 2, name: 'Medicaid', item: absoluteUrl('/medicaid/') },
  ],
}

/**
 * Contenido editorial en /medicaid/ (HHSC / CMS — Texas, abril 2026).
 */
export default function MedicaidEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="medicaid-edu-que-es">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>También te puede interesar:</strong>{' '}
          <Link href="/medicaid/texas/" className="text-green font-semibold hover:underline">
            Medicaid en Texas (detalle estatal)
          </Link>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP
          </Link>
          {' · '}
          <Link href="/wic/" className="text-green font-semibold hover:underline">
            WIC
          </Link>
          {' · '}
          <Link href="/escuela/" className="text-green font-semibold hover:underline">
            Inscripción escolar
          </Link>
        </p>

        <div>
          <h2 id="medicaid-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es Medicaid?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Medicaid es un <strong>seguro médico gratuito o de muy bajo costo</strong> financiado con fondos federales y
            estatales. En Texas, <strong>HHSC</strong> administra el programa junto con <strong>CHIP</strong> para niños
            en familias con ingresos moderados. En el lenguaje cotidiano también se dice{' '}
            <strong>cobertura médica</strong> o <strong>seguro médico gratis</strong> para referirse a estos beneficios,
            aunque los nombres oficiales y las reglas las publica HHSC.
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-400/80 bg-amber-50/90 p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">Quién califica en Texas (dato crítico)</h2>
          <p className="text-gray-800 text-sm leading-relaxed font-medium mb-3">
            Texas <strong>no</strong> adoptó la expansión Medicaid del ACA.{' '}
            <strong>No incluyas a “adultos sin hijos” como grupo que califica por regla general:</strong> en la práctica,
            los adultos sin hijos dependientes menores en el hogar <strong>generalmente no</strong> tienen Medicaid
            regular en Texas.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Grupos que <strong>sí</strong> pueden calificar (según ingresos, tamaño del hogar y documentación; HHSC
            decide cada caso):
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>Niños — CHIP:</strong> típicamente hasta alrededor del <strong>201% del FPL</strong> según el tamaño
              del hogar (CHIP cubre niños y adolescentes hasta 18 años en hogares con ingresos algo más altos que el
              límite de Medicaid infantil).
            </li>
            <li>
              <strong>Embarazadas:</strong> Medicaid para embarazadas suele evaluarse hasta cerca del{' '}
              <strong>198% del FPL</strong>, con cobertura de <strong>perinatal</strong> (embarazo y un periodo
              postparto; HHSC define la duración exacta según normativa vigente).
            </li>
            <li>
              <strong>Padres o cuidadores con hijos menores dependientes:</strong> Medicaid para padres en Texas es{' '}
              <strong>muy restrictivo</strong> (históricamente en torno al <strong>18% del FPL</strong> u otros umbrales
              publicados por HHSC — verifica la tabla actual en fuentes oficiales).
            </li>
            <li>
              <strong>Adultos mayores (65+) y personas con discapacidad:</strong> a menudo bajo reglas federales
              vinculadas a SSI/SSA u otras categorías; los detalles dependen de tu situación y de lo que HHSC determine.
            </li>
          </ul>
          <p className="text-gray-700 text-sm leading-relaxed mt-4">
            Si eres <strong>adulto sin hijos dependientes</strong> en Texas, Medicaid regular{' '}
            <strong>generalmente no está disponible</strong>. Puedes explorar planes en{' '}
            <a
              href="https://www.healthcare.gov"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              healthcare.gov
            </a>{' '}
            (Marketplace) — algunos planes tienen costo reducido según tus ingresos y circunstancias.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Medicaid vs CHIP — cuál aplica a tu familia</h2>
          <div className="overflow-x-auto rounded-xl border border-cream bg-white">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cream bg-cream-2">
                  <th className="p-3 font-semibold text-navy">Programa</th>
                  <th className="p-3 font-semibold text-navy">Enfoque</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cream">
                  <td className="p-3 font-medium">Medicaid</td>
                  <td className="p-3 text-gray-700">
                    Adultos elegibles en categorías cubiertas (muy limitado para padres), embarazadas que califican,
                    muchos niños de muy bajos ingresos, y otras categorías como mayores o discapacidad según reglas.
                  </td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="p-3 font-medium">CHIP</td>
                  <td className="p-3 text-gray-700">
                    Niños y adolescentes hasta 18 años en hogares con ingresos moderados (por encima del límite de
                    Medicaid infantil, hasta aprox. 201% FPL según composición del hogar).
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Ambos</td>
                  <td className="p-3 text-gray-700">
                    Solicitud y seguimiento en{' '}
                    <a
                      href="https://yourtexasbenefits.com"
                      className="text-green font-semibold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      YourTexasBenefits.com
                    </a>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Identificación de los adultos del hogar</li>
            <li>Prueba de ingresos de quienes aportan al hogar</li>
            <li>Prueba de domicilio en Texas</li>
            <li>Actas de nacimiento de los niños (para CHIP o dependientes)</li>
            <li>Documentación de embarazo si aplica</li>
          </ul>
          <p className="text-sm mt-3">
            Para listas orientativas por estado:{' '}
            <Link href="/medicaid/texas/" className="text-green font-bold underline">
              Medicaid Texas — documentos y pasos →
            </Link>
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Cómo aplicar</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Entra a YourTexasBenefits.com</li>
            <li>Crea una cuenta o inicia sesión</li>
            <li>
              Completa la solicitud (una sola solicitud puede aplicar a Medicaid, CHIP y otros programas que maneja
              HHSC)
            </li>
            <li>Sube o entrega los documentos que te pidan</li>
            <li>
              Espera la determinación — HHSC indica plazos orientativos (por ejemplo, alrededor de{' '}
              <strong>45 días</strong> en muchos casos y plazos más cortos en situaciones de embarazo; confirma en tu
              aviso o en el portal)
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-navy/15 bg-white p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">Carga pública — lo que necesitas saber</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Solicitar Medicaid o CHIP <strong>en muchos casos no se considera</strong> perjudicial para el análisis de{' '}
            <strong>carga pública</strong> bajo las reglas que han estado en vigor en años recientes (2026): por ejemplo,
            la regla de carga pública{' '}
            <strong>no incluye Medicaid de menores ni CHIP</strong> en el sentido que publican las agencias federales.
            Las reglas pueden cambiar y cada caso es distinto —{' '}
            <strong>verifica tu situación con un abogado de inmigración acreditado</strong> y no tomes esta página como
            garantía absoluta.
          </p>
        </div>

        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5" aria-labelledby="medicaid-faq">
          <h2 id="medicaid-faq" className="font-serif text-xl text-navy mb-4">
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

        <p className="text-xs text-gray-500">
          HazloAsíYa no es HHSC ni CMS. La elegibilidad oficial la determina el estado según tu solicitud y pruebas.
        </p>
      </section>
    </>
  )
}
