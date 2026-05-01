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
        </p>

        <div>
          <h2 id="daca-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es la renovación DACA?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong>DACA</strong> (Deferred Action for Childhood Arrivals) es una política administrativa que{' '}
            <strong>USCIS</strong> aplica según reglas y litigios vigentes. No es lo mismo que residencia permanente. La
            renovación demuestra que sigues cumpliendo los requisitos publicados en el sitio oficial. Las reglas y
            formularios cambian;{' '}
            <strong>verifica la página actual de USCIS</strong> antes de enviar.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Formularios y tarifas</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>I-821D:</strong> solicitud de consideración de DACA.
            </li>
            <li>
              <strong>I-765:</strong> permiso de trabajo (EAD) asociado en muchos casos.
            </li>
            <li>
              Tarifas: USCIS publica montos y exenciones en{' '}
              <a href="https://www.uscis.gov/forms" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                uscis.gov/forms
              </a>
              .
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suele pedir USCIS</h2>
          <p className="text-sm text-gray-700 mb-2">Orientación general (tu lista exacta depende del formulario vigente):</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Copia del último permiso de trabajo o notificación de aprobación previa</li>
            <li>Identificación con foto</li>
            <li>Pruebas continuas de residencia en EE.UU. desde tu última aprobación</li>
            <li>Certificado de no antecedentes o respuestas en el formulario según te aplique</li>
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
