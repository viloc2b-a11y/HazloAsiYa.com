import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué formularios se usan para renovar DACA?',
    a: 'La renovación típica incluye el Formulario I-821D (Consideration of Deferred Action for Childhood Arrivals) y el I-765 (solicitud de empleo), más la tarifa que USCIS indique en su sitio. Las versiones y instrucciones cambian; descarga siempre el paquete vigente en uscis.gov.',
  },
  {
    q: '¿Cuándo debo enviar la renovación?',
    a: 'USCIS ha publicado orientación para presentar la renovación antes de que expire tu periodo actual, con una ventana recomendada (históricamente alrededor de 120–150 días antes; verifica la guía actual en USCIS). Enviar tarde puede dejarte sin protección ni permiso de trabajo.',
  },
  {
    q: '¿Puede HazloAsíYa garantizar que USCIS apruebe mi caso?',
    a: 'No. Somos una herramienta educativa para organizar documentos y borradores. USCIS decide cada caso. Para situaciones complejas, antecedentes penales o viajes, necesitas abogado de inmigración o organización acreditada por el DOJ.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación renovación DACA (USCIS)',
  serviceType: 'Información migratoria educativa',
  description:
    'Contenido educativo en español sobre renovación DACA, formularios I-821D e I-765 y enlaces a USCIS. No es asesoría legal.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/daca/'),
  areaServed: { '@type': 'Country', name: 'United States' },
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
    { '@type': 'ListItem', position: 2, name: 'DACA', item: absoluteUrl('/daca/') },
  ],
}

export default function DacaEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="daca-edu-que-es">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Fuente oficial:</strong>{' '}
          <a
            href="https://www.uscis.gov/humanitarian/consideration-deferred-action-childhood-arrivals-daca"
            className="text-green font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            USCIS — DACA
          </a>
          {' · '}
          <Link href="/id/texas/" className="text-green font-semibold hover:underline">
            Texas ID
          </Link>
          {' · '}
          <Link href="/bank/" className="text-green font-semibold hover:underline">
            Cuenta bancaria
          </Link>
          {' · '}
          <Link href="/itin/" className="text-green font-semibold hover:underline">
            ITIN / impuestos
          </Link>
        </p>

        {/* §3b */}
        <div>
          <h2 id="daca-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es renovar DACA?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            <strong>DACA</strong> es una política administrativa que <strong>USCIS</strong> aplica según reglas y litigios
            vigentes. No es residencia permanente ni garantía futura. La renovación demuestra que sigues cumpliendo
            requisitos publicados en uscis.gov.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Formularios, tarifas y plazos cambian; descarga siempre la versión vigente de{' '}
            <strong>I-821D</strong> e <strong>I-765</strong> antes de firmar o pagar.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>I-821D:</strong> consideración de DACA; respuestas deben coincidir con tu historial previo salvo
              cambios declarados.
            </li>
            <li>
              <strong>I-765:</strong> permiso de trabajo cuando aplica a tu paquete de renovación.
            </li>
            <li>
              <strong>Ventana de tiempo:</strong> USCIS ha orientado presentar con anticipación (históricamente ~120–150
              días; verifica guía actual).
            </li>
            <li>
              <strong>Elegibilidad continua:</strong> arrestos, viajes o nuevas denuncias pueden cambiar el análisis; caso
              complejo requiere abogado.
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Tarifas y revisiones de formularios:{' '}
          <a href="https://www.uscis.gov/forms" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            uscis.gov/forms
          </a>
          .
        </p>

        {/* §3c — ejemplos, plan B, problemas típicos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suele pedir USCIS (con ejemplos)</h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Tu lista sale del paquete de instrucciones del mes en que envías. Aquí va lo que <strong>más seguido</strong>
            piden en renovaciones; si falta una prueba, mejor pedir tiempo y reunirla que enviar incompleto y recibir RFE
            con el EAD por vencer.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Estatus DACA previo</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> frente y reverso del EAD actual; I-797 de aprobaciones recientes;
                  copia del último I-821D aprobado si lo tienes.
                </li>
                <li>
                  <strong>Si perdiste el EAD físico:</strong> solicita reemplazo o junta copias de lo que tengas (notificaciones,
                  fotos nítidas) y declara en el formulario según instrucciones; caso raro: abogado.
                </li>
                <li>
                  <strong>Suele fallar:</strong> copia cortada donde no se lee la fecha de vencimiento; número de receipt
                  ilegible.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> pasaporte vigente, permiso de manejo estatal, ID emitida por el estado.
                </li>
                <li>
                  <strong>Si el nombre cambió por matrimonio:</strong> acta de matrimonio o orden judicial que enlace el
                  nombre del ID con el del sistema.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ID vencida cuando las instrucciones piden vigente; foto del pasaporte con
                  flash que tapa el número.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Residencia continua</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> contratos de renta con fechas, facturas de luz/internet a tu nombre,
                  reportes de escuela o universidad, registros médicos, extractos bancarios con dirección.
                </li>
                <li>
                  <strong>Si casi todo está a nombre de padres o cónyuge:</strong> carta de hospedaje + prueba de que tú
                  vives ahí (correo, seguro, trabajo) en el periodo que pide el formulario.
                </li>
                <li>
                  <strong>Suele fallar:</strong> mezclar pruebas de años equivocados; solo declarar “he vivido aquí” sin
                  documento fechado.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Antecedentes y preguntas de elegibilidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> certificado de no arresto del condado; orden de corte sellada si hubo
                  caso; declaración jurada solo si las instrucciones lo permiten para tu situación.
                </li>
                <li>
                  <strong>Si hubo contacto con policía:</strong> no ocultes: consulta abogado antes de enviar; el error más
                  caro es marcar “no” cuando hay registro.
                </li>
                <li>
                  <strong>Suele fallar:</strong> certificado viejo cuando piden reciente; mandar traducción sin certificar.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Pasos típicos de renovación</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Reserva <strong>2–4 h</strong> en varias sesiones (leer, imprimir, firmar, pagar). El envío en sí son{' '}
            <strong>~30 min</strong> en mensajería; la decisión de USCIS va en <strong>meses</strong> salvo que te pidan
            algo extra (RFE).
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Lee uscis.gov y descarga I-821D, I-765 e instrucciones del día</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30–45 min</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes tarifas vigentes, orden de páginas y dirección de envío — sin adivinar con un PDF de hace 6
                meses.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Llena ambos formularios con los mismos datos</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~45–90 min</span>
              <span className="block mt-1 text-gray-600">
                Después: menos riesgo de que un dato no coincida y devuelvan todo el sobre.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Fotocopias de ID y pruebas de residencia continua</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30–60 min</span>
              <span className="block mt-1 text-gray-600">
                Después: tienes carpeta numerada como el checklist; falta solo pagar y armar.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Paga tarifas en línea o como indique la guía; imprime recibos</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min</span>
              <span className="block mt-1 text-gray-600">
                Después: montos correctos = el sobre no rebota por cheque malo o fee vieja.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Arma el paquete en orden; fotografía o escanea todo antes de cerrar</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20 min</span>
              <span className="block mt-1 text-gray-600">
                Después: si USCIS pierde una página, tienes respaldo con fecha; si no, al menos tú sabes qué enviaste.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Envía con servicio rastreable; guarda número de tracking</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30 min</span>
              <span className="block mt-1 text-gray-600">
                Después: ves “entregado” en el rastreo; luego esperas recibo o notificación en la cuenta USCIS — ahí
                empieza el tiempo oficial del caso.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que te dejan sin EAD — o con el sobre de vuelta</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Sin permiso de trabajo vigente, muchas personas <strong>pierden el empleo formal</strong> de un día para otro.
            Un sobre rechazado puede significar <strong>meses más</strong> sin protección mientras rearmas y reenvías.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Enviar tarde respecto a tu vencimiento.</strong> Si el EAD expira antes de
              aprobar renovación, puedes quedar <strong>sin autorización de trabajo</strong> — el patrón por ley suele
              pararte hasta nuevo EAD.
            </li>
            <li>
              <strong className="text-navy">Formularios viejos o páginas mezcladas.</strong> USCIS{' '}
              <strong>rechaza el paquete entero</strong>; pierdes el tiempo de ida y vuelta y el lugar en la fila de
              procesamiento.
            </li>
            <li>
              <strong className="text-navy">Callar arrestos o viajes que debían ir en el formulario.</strong> Si lo
              descubren, el riesgo no es solo demora: puede ser <strong>negación por credibilidad</strong> o referido a
              fraude; ante duda, abogado antes de enviar.
            </li>
            <li>
              <strong className="text-navy">Cheque o pago en línea por monto equivocado.</strong> El sobre vuelve sin
              procesar; <strong>no hay recibo de caso válido</strong> hasta pagar bien — cada semana cuenta si el EAD vence.
            </li>
            <li>
              <strong className="text-navy">Dirección o mensajería incorrecta.</strong> Paquete devuelto ={' '}
              <strong>cero “received”</strong> hasta que reenvías; algunos pierden la ventana de renovación temprana por
              ese solo error logístico.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-400/80 bg-amber-50/90 p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">Cuándo buscar abogado</h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            Si tuviste contacto con autoridades migratorias, arrestos, viajes fuera de EE.UU. después de tu primer DACA,
            o dudas sobre elegibilidad, <strong>no uses solo una guía web</strong>. Consulta a un abogado de inmigración o
            clínica acreditada por el DOJ antes de enviar.
          </p>
        </div>

        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5" aria-labelledby="daca-faq">
          <h2 id="daca-faq" className="font-serif text-xl text-navy mb-4">
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
          HazloAsíYa no es USCIS ni bufete de abogados. No presentamos formularios en tu nombre ante el gobierno.
        </p>
      </section>
    </>
  )
}
