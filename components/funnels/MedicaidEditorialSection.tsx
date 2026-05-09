import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué diferencia hay entre Medicaid y CHIP?',
    a: 'Medicaid cubre a grupos elegibles como ciertos padres con hijos menores, embarazadas que califican, adultos mayores o personas con discapacidad. CHIP está orientado a niños y adolescentes hasta 18 años en hogares con ingresos moderados. Las reglas exactas varían por estado — California (Medi-Cal), Florida (Florida Medicaid), Nueva York y Texas tienen portales y límites distintos.',
  },
  {
    q: '¿Dónde aplico a Medicaid o CHIP según mi estado?',
    a: 'Cada estado tiene su propio portal: Texas usa YourTexasBenefits.com, California usa BenefitsCal.com (Medi-Cal), Florida usa AccessFlorida.com, y Nueva York usa myBenefits.ny.gov. Una misma solicitud puede evaluarte para Medicaid, CHIP y otros beneficios.',
  },
  {
    q: '¿Medicaid afecta mi proceso migratorio (carga pública)?',
    a: 'Solicitar Medicaid o CHIP en muchos casos no se considera perjudicial para el análisis de carga pública bajo las reglas vigentes en 2026: por ejemplo, Medicaid de menores y CHIP generalmente no se incluyen. Las reglas pueden cambiar — verifica tu situación con un abogado de inmigración acreditado.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación Medicaid y CHIP — TX, CA, FL, NY',
  serviceType: 'Asistencia médica gubernamental',
  description:
    'Contenido educativo en español sobre Medicaid y CHIP en Texas, California, Florida y Nueva York: grupos elegibles y pasos para preparar la solicitud.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/medicaid/'),
  areaServed: [
    { '@type': 'State', name: 'Texas' },
    { '@type': 'State', name: 'California' },
    { '@type': 'State', name: 'Florida' },
    { '@type': 'State', name: 'New York' },
  ],
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
 * Contenido editorial en /medicaid/ — multi-estado (TX, CA, FL, NY).
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
            Medicaid Texas
          </Link>
          {' · '}
          <Link href="/medicaid/california/" className="text-green font-semibold hover:underline">
            Medi-Cal California
          </Link>
          {' · '}
          <Link href="/medicaid/florida/" className="text-green font-semibold hover:underline">
            Medicaid Florida
          </Link>
          {' · '}
          <Link href="/medicaid/new-york/" className="text-green font-semibold hover:underline">
            Medicaid Nueva York
          </Link>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP
          </Link>
          {' · '}
          <Link href="/wic/" className="text-green font-semibold hover:underline">
            WIC
          </Link>
        </p>

        {/* §1 — Qué es Medicaid */}
        <div>
          <h2 id="medicaid-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es Medicaid y quién suele calificar?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Medicaid es un <strong>seguro médico gratuito o de muy bajo costo</strong> financiado con fondos federales y
            estatales. Cada estado administra su propio programa: <strong>Medi-Cal</strong> en California,{' '}
            <strong>Florida Medicaid</strong>, <strong>Medicaid + CHIP</strong> en Nueva York y Texas. Los nombres
            oficiales, portales y tablas de ingreso los publica cada agencia estatal.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Niños — CHIP:</strong> típicamente hasta ~<strong>200–250% del FPL</strong> según estado y tamaño
              del hogar (niños y adolescentes hasta 18 años).
            </li>
            <li>
              <strong>Embarazadas:</strong> Medicaid de embarazo suele evaluarse hasta ~<strong>196–200% del FPL</strong>;
              duración postparto según normas del estado.
            </li>
            <li>
              <strong>Padres con hijos menores:</strong> umbrales varían por estado — California y Nueva York son más
              amplios; Texas tiene límites más bajos.
            </li>
            <li>
              <strong>Mayores 65+ o discapacidad:</strong> a menudo bajo reglas federales vinculadas a SSI/SSA; la agencia
              estatal decide con tu expediente.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-400/80 bg-amber-50/90 p-4">
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            <strong>Texas:</strong> no adoptó la expansión Medicaid del ACA. Los adultos sin hijos dependientes menores{' '}
            <strong>generalmente no califican</strong> para Medicaid regular. Explora cobertura en{' '}
            <a
              href="https://www.healthcare.gov"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              healthcare.gov
            </a>{' '}
            (Marketplace). California, Florida y Nueva York sí tienen cobertura más amplia para adultos.
          </p>
        </div>

        {/* §2 — Portales por estado */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Portal oficial según tu estado</h2>
          <div className="overflow-x-auto rounded-xl border border-cream bg-white">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cream bg-cream-2">
                  <th className="p-3 font-semibold text-navy">Estado</th>
                  <th className="p-3 font-semibold text-navy">Programa</th>
                  <th className="p-3 font-semibold text-navy">Portal oficial</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cream">
                  <td className="p-3 font-medium">Texas</td>
                  <td className="p-3 text-gray-700">Medicaid / CHIP (HHSC)</td>
                  <td className="p-3">
                    <a href="https://yourtexasbenefits.com" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                      YourTexasBenefits.com
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="p-3 font-medium">California</td>
                  <td className="p-3 text-gray-700">Medi-Cal (DHCS)</td>
                  <td className="p-3">
                    <a href="https://www.benefitscal.com" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                      BenefitsCal.com
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-cream">
                  <td className="p-3 font-medium">Florida</td>
                  <td className="p-3 text-gray-700">Florida Medicaid (DCF)</td>
                  <td className="p-3">
                    <a href="https://www.myflorida.com/accessflorida" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                      AccessFlorida.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Nueva York</td>
                  <td className="p-3 text-gray-700">Medicaid / Child Health Plus</td>
                  <td className="p-3">
                    <a href="https://www.mybenefits.ny.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                      myBenefits.ny.gov
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* §3 — Documentos */}
        <div>
          <p
            className="text-sm text-amber-900/95 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-3 mb-3 leading-relaxed"
            role="note"
          >
            Un solo documento incorrecto o incompleto suele significar que te regresen la solicitud o te pidan volver con
            otra cita.
          </p>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Tu lista exacta depende de tu estado y categoría (CHIP, embarazo, padre con hijos, etc.). Si falta un papel,
            en muchos casos puedes guardar el borrador y subir después; lo que no conviene es ignorar el aviso con fecha
            límite.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y membresía del hogar</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> licencia de conducir, pasaporte, matrícula consular si aplica; acta de
                  nacimiento del niño para CHIP; orden de custodia si el solicitante no es el padre en el acta.
                </li>
                <li>
                  <strong>Si el acta está en otro país:</strong> acta + traducción si la piden; tramita copia certificada
                  antes de la cita si el portal la marca como obligatoria.
                </li>
                <li>
                  <strong>Suele fallar:</strong> hijo del cónyuge no declarado en el hogar fiscal; ID vencido; nombre que
                  no coincide con el que escribiste en la solicitud.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos (últimos 30–60 días o más)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> talones recientes, carta del patrón, W-2 del año si acaba de terminar
                  temporada de trabajo; capturas de depósitos de apps de trabajo si aplica.
                </li>
                <li>
                  <strong>Si trabajas por tu cuenta:</strong> libro de ingresos/gastos, 1099-NEC, estado de cuenta de
                  negocio; mejor documentación modesta pero honesta que inventar montos.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ingreso del esposo no reportado; solo un talón cuando el sistema pide 8
                  semanas; efectivo sin papeles que luego no cuadra con el banco.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio en tu estado</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> factura de servicio con nombre y dirección, lease firmado, carta del
                  propietario con teléfono de contacto.
                </li>
                <li>
                  <strong>Si vives con familiares:</strong> carta de hospedaje + ID del titular del recibo + prueba de que
                  el menor vive ahí (correo escolar, etc.).
                </li>
                <li>
                  <strong>Suele fallar:</strong> comprobante a nombre de otra ciudad; dirección vieja del último trámite.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
            Empieza por identidad y domicilio: son los que suelen pedir primero para abrir el caso.
          </p>
        </div>

        {/* §4 — Cómo aplicar */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Cómo aplicar</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Todo pasa en el portal de tu estado. La parte que tú controlas suele ser{' '}
            <strong>1–2 h</strong> en total (puedes hacerla por partes); lo que lleva esperar la respuesta son{' '}
            <strong>semanas</strong>, no minutos.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Entra al portal oficial de tu estado</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~1 min</span>
              <span className="block mt-1 text-gray-600">Ver tabla de portales arriba según tu estado.</span>
            </li>
            <li>
              <span className="font-medium text-navy">Crea cuenta o inicia sesión</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~5–10 min</span>
              <span className="block mt-1 text-gray-600">
                Guarda usuario y contraseña en un lugar seguro.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">
                Completa la solicitud (Medicaid, CHIP y otros programas en un solo flujo cuando aplica)
              </span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30–60 min</span>
              <span className="block mt-1 text-gray-600">
                Recibes número de caso o confirmación; el sistema te dirá qué falta por subir.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Sube o entrega lo que te pidan</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15–45 min</span>
              <span className="block mt-1 text-gray-600">
                Si algo está mal, te lo dicen con plazo para corregir.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Espera la determinación</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">días/semanas</span>
              <span className="block mt-1 text-gray-600">
                Carta o mensaje en el portal — muchos casos ~<strong>45 días</strong>; embarazo u otros pueden
                ser más cortos.
              </span>
            </li>
          </ol>
        </div>

        {/* §5 — Errores comunes */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que dejan al niño o a la embarazada sin cobertura</h2>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Subir documentos incompletos.</strong> Te regresan el caso con semanas
              adicionales de espera.
            </li>
            <li>
              <strong className="text-navy">Declarar menos personas de las que viven contigo.</strong> Cuando la agencia
              cruza datos, sale negación o auditoría.
            </li>
            <li>
              <strong className="text-navy">Ingresos incompletos o viejos.</strong> Genera un aviso de &quot;falta
              información&quot; con fecha límite; si no respondes, el caso se niega.
            </li>
            <li>
              <strong className="text-navy">Saltarte acta o prueba de embarazo cuando la categoría lo exige.</strong>{' '}
              El sistema no avanza a elegibilidad hasta subir lo mínimo.
            </li>
            <li>
              <strong className="text-navy">Ignorar la fecha del aviso o la entrevista.</strong> Sin respuesta, la agencia
              cierra el expediente; volver a abrir puede costarte semanas adicionales.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-navy/15 bg-white p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">Carga pública — lo que necesitas saber</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Solicitar Medicaid o CHIP <strong>en muchos casos no se considera</strong> perjudicial para el análisis de{' '}
            <strong>carga pública</strong> bajo las reglas vigentes en 2026: por ejemplo, la regla de carga pública{' '}
            <strong>no incluye Medicaid de menores ni CHIP</strong>. Las reglas pueden cambiar y cada caso es distinto —{' '}
            <strong>verifica tu situación con un abogado de inmigración acreditado</strong>.
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
          HazloAsíYa no es una agencia gubernamental. La elegibilidad oficial la determina la agencia de tu estado según
          tu solicitud y pruebas.
        </p>
      </section>
    </>
  )
}
