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
          <strong>Texas:</strong>{' '}
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
        </p>

        <div>
          <h2 id="wic-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es WIC?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            WIC ayuda a familias a comprar alimentos nutritivos (fruta, verdura, leche, cereal, etc.) mediante una tarjeta
            o beneficios electrónicos en tiendas autorizadas. También ofrece educación nutricional y derivaciones a salud.
            En Texas, el programa opera bajo reglas federales y estatales; la fuente general es{' '}
            <a
              href="https://www.fns.usda.gov/wic"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              USDA FNS (WIC)
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
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Quién suele calificar (orientación)</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Embarazadas y mujeres hasta 6 meses posparto (o 12 meses si amamantan, según reglas vigentes).</li>
            <li>Bebés y niños hasta 5 años, con evaluación de salud o nutrición en la clínica.</li>
            <li>Ingresos del hogar dentro de los límites que publica el estado (aproximadamente hasta 185% del FPL para WIC).</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Los números exactos y excepciones las confirma tu clínica WIC al agendar.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Identificación de la adulta que aplica</li>
            <li>Prueba de ingresos o participación en SNAP/Medicaid (si aplica)</li>
            <li>Comprobante de domicilio</li>
            <li>Cartilla de vacunas o control del niño, según la clínica</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Cómo empezar en Texas</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              Visita{' '}
              <a href="https://texaswic.org" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                texaswic.org
              </a>{' '}
              o llama al número que publica HHSC para tu área.
            </li>
            <li>Agenda cita en la clínica WIC más cercana.</li>
            <li>Lleva documentos y a los niños que inscribas, si te lo piden.</li>
            <li>Completa la orientación inicial; si calificas, activan tus beneficios.</li>
          </ol>
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
