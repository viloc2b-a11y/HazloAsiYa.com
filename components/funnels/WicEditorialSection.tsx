import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué es WIC y quién puede recibirlo en Texas?',
    a: 'WIC (Women, Infants and Children) es un programa de nutrición federal que en Texas coordinan HHSC y proveedores locales. Suele dirigirse a embarazadas, mujeres posparto, bebés y niños hasta 5 años que califican por ingresos y riesgo nutricional. La elegibilidad la determina la clínica WIC con una evaluación.',
  },
  {
    q: '¿Dónde me inscribo a WIC en Texas?',
    a: 'Puedes empezar en texaswic.org para información y agendar cita, o contactar la clínica WIC de tu condado (por ejemplo Harris County o tu proveedor local). Lleva identificación, comprobante de ingresos y domicilio según te indiquen.',
  },
  {
    q: '¿WIC afecta mi caso migratorio o es carga pública?',
    a: 'Bajo las orientaciones generales que han circulado en años recientes, WIC suele tratarse distinto que otros beneficios en análisis de carga pública, pero cada caso es único y las reglas pueden cambiar. Consulta con un abogado de inmigración acreditado si tienes dudas sobre tu situación.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación WIC (Texas)',
  serviceType: 'Programa de nutrición para familia',
  description:
    'Contenido educativo en español sobre el programa WIC en Texas, documentos comunes y cómo preparar una cita. No sustituye la determinación de la clínica WIC.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/wic/'),
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
    { '@type': 'ListItem', position: 2, name: 'WIC', item: absoluteUrl('/wic/') },
  ],
}

export default function WicEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="wic-edu-que-es">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Texas y cluster beneficios:</strong>{' '}
          <Link href="/wic/texas/" className="text-green font-semibold hover:underline">
            WIC en Texas (clínicas y pasos)
          </Link>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP
          </Link>
          {' · '}
          <Link href="/medicaid/" className="text-green font-semibold hover:underline">
            Medicaid / CHIP
          </Link>
          {' · '}
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Guías
          </Link>
        </p>

        {/* §3b */}
        <div>
          <h2 id="wic-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es WIC y quién suele calificar?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            WIC ayuda a comprar alimentos nutritivos (fruta, verdura, leche, cereal, etc.) con tarjeta o beneficios
            electrónicos en tiendas autorizadas, más educación nutricional y referidos a salud. En Texas operan HHSC y
            clínicas locales; fuentes generales:{' '}
            <a
              href="https://www.fns.usda.gov/wic"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              USDA FNS
            </a>{' '}
            y{' '}
            <a
              href="https://www.hhs.texas.gov/services/health/women-infants-children"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HHSC Texas
            </a>
            .
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            La clínica confirma elegibilidad con ingresos, tamaño del hogar y evaluación de riesgo nutricional; no es lo
            mismo que SNAP: los pasos y papeles son distintos.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Embarazadas y posparto:</strong> ventanas de elegibilidad según amamantamiento (p. ej. 6 o 12
              meses; confirma en tu cita).
            </li>
            <li>
              <strong>Bebés y niños hasta 5 años:</strong> suelen medir y revisar salud o nutrición en la primera visita.
            </li>
            <li>
              <strong>Ingreso del hogar:</strong> orientación común hasta ~185% del FPL; la clínica aplica la tabla
              vigente.
            </li>
            <li>
              <strong>Residencia:</strong> suele pedirse comprobante en el área que atiende el proveedor WIC.
            </li>
          </ul>
        </div>

        {/* §3c — ejemplos, plan B, problemas típicos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Cada clínica WIC publica su lista; llevar <strong>copia y original</strong> cuando puedas evita una segunda
            cita. Si falta algo, llama antes: a veces aceptan un comprobante distinto o te dan 48 h para volver.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> licencia Texas, pasaporte, matrícula consular si la clínica la acepta;
                  algunas piden ID del adulto que firma aunque el bebé sea el beneficiario.
                </li>
                <li>
                  <strong>Si tu ID está vencido o en trámite:</strong> pregunta por pasaporte, recibo de renovación o
                  combinación que ellos usen; no faltes sin llamar.
                </li>
                <li>
                  <strong>Suele fallar:</strong> nombre distinto al de la cita (casada sin actualizar ID); foto del ID
                  cortada del chat.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos o otros programas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> 2–4 talones recientes, carta de empleo con sueldo por hora, carta de
                  aprobación de SNAP o Medicaid (a veces acelera la verificación de ingreso).
                </li>
                <li>
                  <strong>Si trabajas por tu cuenta o en efectivo:</strong> libreta de depósitos, 1099, contrato informal o
                  declaración del patrón en hoja firmada.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ingreso del otro padre en el hogar no declarado; talones viejos cuando el
                  sueldo subió.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> factura de luz/agua, lease, correo médico o escolar con la dirección
                  del condado donde te atienden.
                </li>
                <li>
                  <strong>Si todo está a nombre del esposo o del dueño:</strong> carta de residencia firmada + recibo a
                  nombre de quien vive contigo.
                </li>
                <li>
                  <strong>Suele fallar:</strong> dirección de un familiar en otro condado cuando la clínica exige prueba
                  local.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Niño o bebé</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> cartilla de vacunas con sellos del pediatra, clínica o condado; carnet
                  del último control; a veces piden traer al niño para medición.
                </li>
                <li>
                  <strong>Si faltan vacunas:</strong> cita en clínica del condado o pediatra y vuelves con sello; pregunta si
                  pueden inscribirte con cita pendiente.
                </li>
                <li>
                  <strong>Suele fallar:</strong> llegar sin el niño cuando la cita era de medición; cartilla ilegible o
                  solo foto del celular.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
            Empieza por identidad e ingresos del hogar y el comprobante de domicilio: la clínica casi siempre los mira
            primero.
          </p>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Cómo empezar en Texas</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            La parte “de casa” son unos <strong>15–20 min</strong> (web o teléfono). El día de la clínica cuenta{' '}
            <strong>1–2 h</strong> entre llegada, fila y charla; lleva snack para los niños si toca esperar.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">
                Entra a{' '}
                <a href="https://texaswic.org" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                  texaswic.org
                </a>{' '}
                o llama al número de tu área
              </span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes qué clínica te corresponde y si hay lista de espera o cita inmediata.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Agenda la cita</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~5 min</span>
              <span className="block mt-1 text-gray-600">
                Después: recibes fecha, hora y a veces SMS; anótalo en el calendario del teléfono.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Prepara carpeta y niños si la clínica lo pidió</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min la noche anterior</span>
              <span className="block mt-1 text-gray-600">
                Después: llegas sin correr por copias; si falta algo, a veces te dan días para volver en vez de cancelar
                todo.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Asiste a la cita: orientación y evaluación</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~45–90 min en sitio</span>
              <span className="block mt-1 text-gray-600">
                Después: si calificas, activan beneficios o te dicen cuándo cargan la tarjeta; si no, te explican por qué
                o qué traer la próxima vez.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que te dejan sin cita — o sin leche en la tarjeta</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            WIC no espera: si pierdes la ventana, el bebé o la embarazada pueden quedarse{' '}
            <strong>semanas más sin beneficios</strong> hasta la próxima apertura de cupo.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Llegar sin el niño cuando pidieron medición o vacunas.</strong> Muchas clínicas{' '}
              <strong>cancelan y reprograman</strong>; el hueco siguiente puede ser en 2–4 semanas con alimentación de
              bolsillo mientras tanto.
            </li>
            <li>
              <strong className="text-navy">Talones viejos si tu sueldo cambió.</strong> La clínica puede{' '}
              <strong>negar elegibilidad ese día</strong> o congelar el caso hasta nuevos comprobantes — sales sin activar
              la tarjeta.
            </li>
            <li>
              <strong className="text-navy">ID ilegible o nombre distinto al de la cita.</strong> No es “arreglar en el
              acto”: a menudo te mandan a <strong>volver con copias nuevas</strong> y pierdes el turno del mes.
            </li>
            <li>
              <strong className="text-navy">Llegar tarde o no confirmar.</strong> Cupos ajustados ={' '}
              <strong>te saltan ese día</strong>; en zonas con lista larga, eso se traduce en menos comida para el hogar
              inmediato.
            </li>
            <li>
              <strong className="text-navy">Creer que SNAP = WIC automático.</strong> Son sistemas distintos: puedes tener
              uno y <strong>seguir sin el otro</strong> hasta completar la cita WIC; no esperes que “se sincronice solo”.
            </li>
          </ul>
        </div>

        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5" aria-labelledby="wic-faq">
          <h2 id="wic-faq" className="font-serif text-xl text-navy mb-4">
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

        <p className="text-xs text-gray-500">HazloAsíYa no es HHSC ni USDA. La elegibilidad la determina la clínica WIC.</p>
      </section>
    </>
  )
}
