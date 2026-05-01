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

        {/* §3c */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Licencia, matrícula consular o ID aceptada por la clínica para la adulta solicitante.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos o otros programas</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Últimos talones, carta de empleador o carta de aprobación de SNAP/Medicaid si te eximen de más papeles.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Domicilio</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Recibo de servicio, contrato o correo oficial con tu dirección en el condado.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Niño o bebé</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Cartilla de vacunas, carnet del pediatra o bebé presente si la clínica mide y evalúa en sitio.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d — ≤ 6 pasos */}
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

        {/* §3e — 5 errores */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que hacen perder la cita o beneficios</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Llegar sin el niño cuando la clínica pidió asistencia para medición o vacunas.</li>
            <li>Llevar ingresos de hace meses si tu sueldo cambió: demoran o piden nueva prueba.</li>
            <li>Documentos ilegibles o con nombre distinto al de la solicitud.</li>
            <li>No confirmar la cita o llegar tarde: algunas clínicas reasignan el cupo el mismo día.</li>
            <li>Asumir que SNAP automático te inscribe en WIC: son trámites separados salvo excepciones locales.</li>
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
