import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué documentos pide Texas para inscribir a un niño en escuela pública?',
    a: 'Suelen pedirse prueba de edad (acta de nacimiento o equivalente), comprobante de domicilio en el distrito, historial de vacunas o cartilla al día, identificación del padre o tutor y a veces el Home Language Survey. Cada distrito (ISD) publica su lista en su portal.',
  },
  {
    q: '¿Puedo inscribir si no tengo todos los papeles el primer día?',
    a: 'Muchos distritos permiten inscripción provisional mientras reúnes documentos, pero las reglas varían. Pregunta en la oficina de inscripciones de tu distrito y conserva copias de lo que entregues.',
  },
  {
    q: '¿Dónde verifico los requisitos oficiales del estado?',
    a: 'La TEA (Texas Education Agency) publica marcos generales; tu distrito concreta plazos, formularios y vacunas. Usa el sitio del distrito (HISD, Katy ISD, etc.) como referencia principal para tu dirección.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación inscripción escolar (Texas)',
  serviceType: 'Educación K-12',
  description:
    'Contenido educativo en español sobre inscripción en escuelas públicas de Texas, documentos comunes y enlaces a distritos. No sustituye las reglas de tu ISD.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/escuela/'),
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
    { '@type': 'ListItem', position: 2, name: 'Inscripción escolar', item: absoluteUrl('/escuela/') },
  ],
}

export default function EscuelaEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="escuela-edu-que-es">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>Houston y guías:</strong>{' '}
          <Link href="/escuela/houston/" className="text-green font-semibold hover:underline">
            Inscripción en Houston
          </Link>
          {' · '}
          <Link href="/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/" className="text-green font-semibold hover:underline">
            Documentos para inscribir (guía)
          </Link>
          {' · '}
          <Link href="/iep/" className="text-green font-semibold hover:underline">
            IEP / educación especial
          </Link>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP (hogar)
          </Link>
        </p>

        {/* §3b */}
        <div>
          <h2 id="escuela-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            Inscripción en escuela pública de Texas
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            En Texas, los distritos independientes (<strong>ISD</strong>) inscriben a estudiantes que viven dentro de sus
            límites. La{' '}
            <a href="https://tea.texas.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              TEA
            </a>{' '}
            publica marcos generales; cada ISD define fechas, portal y lista documental.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Si tu domicilio está en Houston, revisa <strong>HISD</strong>, <strong>Katy ISD</strong>, <strong>Cy-Fair</strong>,
            etc., según código postal. Sin domicilio válido en el distrito, suelen rechazar o posponer la inscripción.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Edad y grado:</strong> acta o prueba equivalente alineada al calendario escolar del distrito.
            </li>
            <li>
              <strong>Residencia:</strong> debes vivir en la zona; falsificar domicilio puede invalidar la plaza.
            </li>
            <li>
              <strong>Vacunas:</strong> Texas exige esquema o exención válida según reglas de salud pública.
            </li>
            <li>
              <strong>Idioma del hogar:</strong> el Home Language Survey ayuda a servicios; no determina por sí solo la
              colocación.
            </li>
          </ul>
        </div>

        {/* §3c — ejemplos, plan B, problemas típicos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos frecuentes (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Cada ISD tiene formulario propio; lo que sigue es lo que <strong>más seguido</strong> piden. Si te falta un
            papel, muchos distritos dan inscripción condicional con plazo para completar: pregunta en la oficina cuántos días
            tienes y en qué formato suben al portal.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y edad del estudiante</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> acta de nacimiento certificada de Texas u otro estado; pasaporte
                  mexicano o estadounidense con fecha de nacimiento legible.
                </li>
                <li>
                  <strong>Si el acta está en trámite o en otro país:</strong> pasaporte del menor, tarjeta consular con
                  datos de nacimiento si el distrito la acepta, o afidávit con reglas del condado.
                </li>
                <li>
                  <strong>Suele fallar:</strong> acta escaneada ilegible; nombre del niño distinto al del acta sin constancia
                  de cambio legal.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio en el distrito</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> factura de luz o agua de los últimos 30–60 días, lease firmado, deed si
                  eres dueño.
                </li>
                <li>
                  <strong>Si vives con un familiar y no hay recibo a tu nombre:</strong> formulario de hospedaje del ISD +
                  ID del dueño + a veces 2 pruebas del adulto que inscribe.
                </li>
                <li>
                  <strong>Suele fallar:</strong> recibo viejo; dirección del storage o del trabajo en lugar de la vivienda;
                  contrato de compra aún sin cerrar.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Vacunas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> cartilla con sello del médico o del condado (Harris Health, etc.);
                  historial del estado en el portal de inmunizaciones de Texas si el distrito lo pide.
                </li>
                <li>
                  <strong>Si faltan vacunas:</strong> cita en clínica del condado el mismo mes; muchos ISD permiten inscribir
                  con cita programada si entregas comprobante.
                </li>
                <li>
                  <strong>Suele fallar:</strong> foto del celular sin reverso; vacunas del hermano copiadas por error;
                  exención sin formulario estatal válido.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Tutor y trámites del distrito</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> licencia del padre/madre/tutor; orden de custodia si solo uno firma;
                  Home Language Survey (el distrito te lo da).
                </li>
                <li>
                  <strong>Si el tutor no es el padre biológico:</strong> poder notarial, custodia temporal o carta de
                  guardián según reglas del ISD — pide el folleto de “non-parent guardian”.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ID vencido; dos padres peleando la inscripción sin orden clara; firmar el
                  portal con correo que no revisas y perder el plazo de subir documentos.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
            Empieza por acta del estudiante y domicilio en el distrito: son los que más suelen pedir primero en el portal.
          </p>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Pasos típicos</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            No tienes que hacerlo todo el mismo día. Cuenta <strong>2–3 h</strong> repartidas (portal + copias) y, si
            faltan vacunas, <strong>otra cita</strong> en clínica; el distrito suele darte plazo en inscripción condicional.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Confirma tu ISD con tu dirección (school finder del distrito)</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes qué sitio web usar y qué zona escolar te toca; evitas llenar el portal del distrito
                equivocado.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Abre cuenta en el portal o pide cita en la escuela</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min</span>
              <span className="block mt-1 text-gray-600">
                Después: tienes usuario para subir archivos y ver el estatus; guarda la contraseña.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Sube o entrega documentos; pide confirmación</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20–40 min</span>
              <span className="block mt-1 text-gray-600">
                Después: el sistema muestra “recibido” o te dan recibo en ventanilla; ese número es el que citas si algo se
                pierde.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Vacunas pendientes: cita en clínica del condado</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~1 h otro día</span>
              <span className="block mt-1 text-gray-600">
                Después: vuelves al portal con cartilla sellada o la subes escaneada antes del plazo que te dieron.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Confirma primer día de clases y bus escolar</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min</span>
              <span className="block mt-1 text-gray-600">
                Después: tienes calendario claro y menos estrés la semana previa al arranque.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que dejan al niño fuera de clase el primer día</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            El distrito no “espera al niño con ganas”: sin papeles válidos, el resultado es{' '}
            <strong>lista de espera en casa</strong>, <strong>perder la plaza en escuela cercana</strong> o empezar tarde y
            ponerte al corriente sola.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Domicilio sin prueba que el ISD acepte.</strong> Recibo a nombre de un vecino sin
              hospedaje firmado = <strong>inscripción rechazada o congelada</strong>; el hijo no entra hasta demostrar
              residencia real.
            </li>
            <li>
              <strong className="text-navy">Acta solo en otro idioma o sin apostilla.</strong> Muchos distritos{' '}
              <strong>no abren expediente</strong> hasta tener documento traducido/certificado; pierdes semanas del inicio
              de clases.
            </li>
            <li>
              <strong className="text-navy">Dos padres peleando la inscripción sin orden clara.</strong> Sin custodia
              actualizada, el distrito puede <strong>bloquear</strong> hasta que un juez define — el niño queda en limbo.
            </li>
            <li>
              <strong className="text-navy">Vacunas a medias “porque ya quedó provisional”.</strong> La provisional{' '}
              <strong>vence</strong>; si no sellas la segunda dosis a tiempo, pueden sacar al niño de lista hasta cumplir el
              esquema.
            </li>
            <li>
              <strong className="text-navy">No guardar confirmación del portal.</strong> Si el sistema borra borradores o
              cambia de año escolar, <strong>no hay prueba de que aplicaste</strong> y repites fila desde cero.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-navy/10 bg-white p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">Educación especial (IEP)</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Si tu hijo necesita evaluación por discapacidad o dificultades de aprendizaje, tienes derecho a pedir una
            evaluación bajo <strong>IDEA</strong>. Usa nuestro flujo{' '}
            <Link href="/iep/" className="text-green font-semibold underline">
              IEP
            </Link>{' '}
            para preparar la solicitud; organizaciones como Disability Rights Texas ofrecen orientación gratuita.
          </p>
        </div>

        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5" aria-labelledby="escuela-faq">
          <h2 id="escuela-faq" className="font-serif text-xl text-navy mb-4">
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

        <p className="text-xs text-gray-500">HazloAsíYa no es tu distrito escolar ni la TEA. Confirma todo en el ISD que te corresponde.</p>
      </section>
    </>
  )
}
