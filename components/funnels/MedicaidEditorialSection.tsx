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
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Guías HazloAsíYa
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

        {/* §3b — 2 párrafos + 4 viñetas */}
        <div>
          <h2 id="medicaid-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es Medicaid y quién suele calificar en Texas?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Medicaid es un <strong>seguro médico gratuito o de muy bajo costo</strong> financiado con fondos federales y
            estatales. En Texas, <strong>HHSC</strong> administra el programa junto con <strong>CHIP</strong> para niños
            en familias con ingresos moderados; los nombres oficiales y tablas de ingreso los publica HHSC.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Texas <strong>no</strong> adoptó la expansión Medicaid del ACA: los adultos sin hijos dependientes menores en
            el hogar <strong>generalmente no</strong> tienen Medicaid regular. La elegibilidad final depende de tu
            solicitud, pruebas y categoría (niños, embarazo, padres con límites muy bajos, mayores o discapacidad).
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Niños — CHIP:</strong> típicamente hasta ~<strong>201% del FPL</strong> según tamaño del hogar
              (niños y adolescentes hasta 18 años).
            </li>
            <li>
              <strong>Embarazadas:</strong> Medicaid de embarazo suele evaluarse hasta ~<strong>198% del FPL</strong>;
              duración postparto según normas vigentes.
            </li>
            <li>
              <strong>Padres con hijos menores:</strong> umbrales <strong>muy bajos</strong> (históricamente ~18% del FPL u
              otros límites HHSC — confirma tabla actual).
            </li>
            <li>
              <strong>Mayores 65+ o discapacidad:</strong> a menudo bajo reglas federales vinculadas a SSI/SSA u otras
              categorías; HHSC decide con tu expediente.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-400/80 bg-amber-50/90 p-4">
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            Si eres <strong>adulto sin hijos dependientes</strong> en Texas, Medicaid regular{' '}
            <strong>suele no aplicar</strong>. Explora cobertura en{' '}
            <a
              href="https://www.healthcare.gov"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              healthcare.gov
            </a>{' '}
            (Marketplace).
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

        {/* §3c — documentos por categorías con ejemplos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Tu lista exacta sale del portal y del tipo de solicitud (embarazo, niño, padre, etc.). Mejor sobrar copias
            claras que reenviar por calidad.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y membresía del hogar</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>ID con foto de adultos (licencia, pasaporte, matrícula consular si aplica al caso).</li>
                <li>Actas de nacimiento de menores o custodia si HHSC pide prueba de parentesco.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos (últimos 30–60 días o más)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Talones de cheque, W-2 reciente o declaración si trabajas por cuenta propia.</li>
                <li>Carta de desempleo, manutención ordenada por tribunal o pensión con monto mensual.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio en Texas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Recibo de servicio, contrato de arrendamiento o carta del dueño con fecha.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Categorías especiales</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Prueba de embarazo o informe prenatal si aplicas como embarazada.</li>
                <li>Cartas de SSI/SSA o discapacidad cuando la categoría lo requiera.</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-3">
            Más orientación:{' '}
            <Link href="/medicaid/texas/" className="text-green font-bold underline">
              Medicaid Texas — documentos y pasos →
            </Link>
          </p>
        </div>

        {/* §3d — ≤ 6 pasos */}
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

        {/* §3e — 5 errores */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que retrasan o niegan la cobertura</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Declarar solo a algunos miembros del hogar fiscal para “ver si pasa”: discrepancias disparan revisiones.</li>
            <li>Mandar ingresos viejos o incompletos cuando hay segundo trabajo o efectivo sin respaldo.</li>
            <li>No subir prueba de embarazo o actas cuando la categoría lo exige desde el inicio.</li>
            <li>Perder la fecha límite de pruebas o entrevistas: sin respuesta, HHSC puede cerrar el expediente.</li>
            <li>Usar dirección o código postal que no coincide donde vive el niño o la embarazada solicitante.</li>
          </ul>
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
