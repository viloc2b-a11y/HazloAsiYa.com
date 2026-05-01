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

        {/* §3c */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos frecuentes (con ejemplos)</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y edad del estudiante</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Acta de nacimiento estatal o pasaporte; algunos distritos aceptan afidávit bajo reglas locales.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio en el distrito</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Factura de luz/agua a nombre del padre, contrato de arrendamiento firmado o formulario de hospedaje si aplica.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Vacunas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Cartilla con sellos del médico o del condado; cita para pendientes si el distrito permite inscripción condicional.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Tutor y trámites del distrito</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>ID del padre/madre/tutor; custodia si solo un adulto firma; Home Language Survey que entrega el ISD.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Identifica tu ISD según tu dirección (herramientas “school finder” en el sitio del distrito).</li>
            <li>Abre una cuenta en el portal de inscripción del distrito o pide cita presencial.</li>
            <li>Sube o lleva documentos; pide recibo o confirmación.</li>
            <li>Completa vacunas faltantes en una clínica del condado si aplica.</li>
            <li>Confirma fecha de inicio y transporte escolar.</li>
          </ol>
        </div>

        {/* §3e */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que retrasan la inscripción</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Llevar recibo a nombre de un vecino sin carta de hospedaje que el ISD acepte.</li>
            <li>Acta en otro idioma sin traducción o apostilla cuando el distrito la exige.</li>
            <li>No traer custodia judicial actualizada si hay disputa entre padres.</li>
            <li>Omitir segunda dosis de vacunas obligatorias creyendo que “ya está inscrito provisionalmente para siempre”.</li>
            <li>No guardar número de confirmación del portal: pierdes el rastro si el distrito borra borradores viejos.</li>
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
