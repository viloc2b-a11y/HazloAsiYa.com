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

        {/* §3c — documentos: ejemplos, plan B, problemas típicos */}
        <div>
          <p
            className="text-sm text-amber-900/95 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-3 mb-3 leading-relaxed"
            role="note"
          >
            Un solo documento incorrecto o incompleto suele significar que te regresen la solicitud o te pidan volver con
            otra cita.
          </p>
          <p className="text-sm text-navy/90 bg-emerald-50/80 border border-green/20 rounded-xl px-4 py-3 mb-4 leading-relaxed">
            Aquí tienes ejemplos reales de lo que sí aceptan, para que no adivines.
          </p>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Tu lista sale de <strong>YourTexasBenefits</strong> según si es CHIP, embarazo, padre con hijos, etc. Si falta
            un papel, en muchos casos puedes guardar el borrador y subir después; lo que no conviene es ignorar el aviso
            con fecha límite.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y membresía del hogar</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> licencia Texas, pasaporte, matrícula consular si aplica; acta de
                  nacimiento del niño para CHIP; orden de custodia si el solicitante no es el padre en el acta.
                </li>
                <li>
                  <strong>Si el acta está en otro país:</strong> acta + traducción si la piden; tramita copia certificada
                  antes de la cita si el portal la marca como obligatoria.
                </li>
                <li>
                  <strong>Suele fallar:</strong> hijo del cónyuge no declarado en el hogar fiscal; ID vencido; nombre de la
                  madre en el acta que no coincide con el nombre que escribiste en la solicitud.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos (últimos 30–60 días o más)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> talones recientes, carta del patrón, W-2 del año si acaba de terminar
                  temporada de trabajo; captura de depósitos de Uber/DoorDash si aplica; carta de TWC si hay desempleo.
                </li>
                <li>
                  <strong>Si trabajas por tu cuenta:</strong> libro de ingresos/gastos, 1099-NEC, estado de cuenta de
                  negocio; mejor documentación modesta pero honesta que inventar montos.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ingreso del esposo no reportado; solo un talón cuando el sistema pide 8
                  semanas; efectivo “sin papeles” que luego no cuadra con el banco.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio en Texas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> factura de servicio con nombre y dirección, lease firmado, carta del
                  propietario con teléfono de contacto.
                </li>
                <li>
                  <strong>Si vives con familiares:</strong> carta de hospedaje + ID del titular del recibo + prueba de que
                  el menor vive ahí (correo escolar, etc.) según lo que acepte HHSC.
                </li>
                <li>
                  <strong>Suele fallar:</strong> comprobante a nombre de otra ciudad cuando pides cobertura en otro condado;
                  dirección vieja del último trámite.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Categorías especiales</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> resultado de prueba de embarazo con fecha, informe prenatal con nombre
                  de la clínica; carta de SSI/SSA; documentos de discapacidad o terapia si la categoría lo requiere.
                </li>
                <li>
                  <strong>Si aún no tienes primera cita prenatal:</strong> pregunta si aceptan prueba de farmacia o carta
                  de clínica comunitaria; no pospongas todo por esperar el primer ultrasonido si el portal te deja avanzar.
                </li>
                <li>
                  <strong>Suele fallar:</strong> subir foto del ultrasonido ilegible; embarazo no vinculado al nombre de la
                  solicitante en el sistema.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
            Empieza por identidad y domicilio: son los que suelen pedir primero para abrir el caso.
          </p>
          <p className="text-sm mt-3">
            Más orientación:{' '}
            <Link href="/medicaid/texas/" className="text-green font-bold underline">
              Medicaid Texas — documentos y pasos →
            </Link>
          </p>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Cómo aplicar</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Todo pasa en el mismo portal. La parte que tú controlas suele ser{' '}
            <strong>1–2 h</strong> en total (puedes hacerla por partes); lo que lleva esperar la respuesta de HHSC son{' '}
            <strong>semanas</strong>, no minutos.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Entra a YourTexasBenefits.com</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~1 min</span>
              <span className="block mt-1 text-gray-600">Después: eliges crear cuenta o iniciar sesión.</span>
            </li>
            <li>
              <span className="font-medium text-navy">Crea cuenta o inicia sesión</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~5–10 min</span>
              <span className="block mt-1 text-gray-600">
                Después: ya puedes abrir la solicitud de beneficios; guarda usuario y contraseña en un lugar seguro.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">
                Completa la solicitud (Medicaid, CHIP y otros programas HHSC en un solo flujo cuando aplica)
              </span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30–60 min</span>
              <span className="block mt-1 text-gray-600">
                Después: recibes número de caso o confirmación; el sistema te dirá qué falta por subir.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Sube o entrega lo que te pidan</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15–45 min</span>
              <span className="block mt-1 text-gray-600">
                Después: el estado “documentos recibidos” o un aviso te confirma; si algo está mal, te lo dicen con plazo
                para corregir. Recibes confirmación o te piden correcciones; si falta algo, el proceso puede reiniciarse.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Espera la determinación</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">días/semanas</span>
              <span className="block mt-1 text-gray-600">
                Después: carta o mensaje en el portal — muchos casos ~<strong>45 días</strong>; embarazo u otros pueden
                ser más cortos. Ahí sabes si aprueban, niegan o piden más pruebas.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que dejan al niño o a la embarazada sin cobertura</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            El costo real es <strong>cuentas médicas sin seguro</strong>, <strong>embarazo sin prenatal a tiempo</strong> o
            meses más en la fila. Evita estos puntos antes de cerrar la solicitud.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Subir documentos incompletos.</strong> Lo más común es que te regresen el caso y
              tengas que volver a empezar con semanas adicionales de espera.
            </li>
            <li>
              <strong className="text-navy">“Probar” el hogar con menos gente de la que vive contigo.</strong> Cuando HHSC
              cruza datos, sale <strong>negación o auditoría</strong>; mientras tanto el niño sigue sin CHIP o Medicaid
              activo.
            </li>
            <li>
              <strong className="text-navy">Ingresos incompletos o viejos.</strong> Segundo trabajo o efectivo sin respaldo
              casi siempre genera un <strong>aviso de “falta información”</strong> con fecha límite; si no respondes, el
              caso se niega y
              la reaplicación puede correr otro ciclo de 45 días o más.
            </li>
            <li>
              <strong className="text-navy">Saltarte acta o prueba de embarazo cuando la categoría lo exige.</strong> No
              “siguen después”: muchas veces el sistema <strong>no avanza a elegibilidad</strong> hasta subir lo mínimo, y
              pierdes citas médicas programadas.
            </li>
            <li>
              <strong className="text-navy">Ignorar la fecha del aviso o la entrevista.</strong> Sin respuesta, HHSC{' '}
              <strong>cierra el expediente</strong>; volver a abrir puede costarte semanas adicionales sin tarjeta médica.
            </li>
            <li>
              <strong className="text-navy">Código postal o dirección que no coincide con donde vive el menor.</strong>{' '}
              Puede resultar en <strong>negación por residencia</strong> o asignación al condado equivocado; arreglarlo no
              es automático.
            </li>
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
