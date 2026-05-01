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
        </p>

        <div>
          <h2 id="escuela-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            Inscripción en escuela pública de Texas
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            En Texas, los distritos independientes (<strong>ISD</strong>) inscriben a estudiantes que viven dentro de sus
            límites. La agencia estatal{' '}
            <a href="https://tea.texas.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              TEA
            </a>{' '}
            establece marcos generales; cada distrito publica fechas, portales en línea y requisitos locales. Si tu
            domicilio está en Houston, revisa{' '}
            <strong>HISD</strong>, <strong>Katy ISD</strong>, <strong>Cy-Fair</strong>, etc., según tu código postal.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos frecuentes</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Prueba de identidad y edad del estudiante</li>
            <li>Comprobante de domicilio (factura, contrato o carta del distrito según acepten)</li>
            <li>Registro de vacunas con sellos válidos en Texas</li>
            <li>Identificación del padre, madre o tutor legal</li>
            <li>Home Language Survey (idioma del hogar) — lo entrega el distrito</li>
          </ul>
        </div>

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
