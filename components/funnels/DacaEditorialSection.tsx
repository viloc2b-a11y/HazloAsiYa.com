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

        {/* §3c */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suele pedir USCIS (con ejemplos)</h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Tu lista exacta depende del formulario y de tu historial. Estos ejemplos orientan; no sustituyen instrucciones
            oficiales.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Estatus DACA previo</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Copia del último EAD, aviso I-797 o documentos de aprobación reciente.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Pasaporte, permiso estatal o ID que USCIS acepte según las instrucciones vigentes.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Residencia continua</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Arriendos, registros escolares, facturas médicas o bancarias con nombre y fechas dentro del periodo pedido.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Antecedentes y preguntas de elegibilidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Certificados de arresto sellados o declaraciones bajo juramento si las preguntas del formulario aplican.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos de renovación</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Lee la página oficial de DACA y descarga formularios e instrucciones del día.</li>
            <li>Completa I-821D e I-765 con la misma información coherente en ambos.</li>
            <li>Prepara pruebas de identidad y residencia continua según el checklist vigente.</li>
            <li>Paga tarifas con el método que USCIS indique y guarda recibos.</li>
            <li>Arma el paquete en el orden que pidan las instrucciones; copia todo antes de enviar.</li>
            <li>Envía a la casilla correcta (USPS/UPS/FedEx según guía) y rastrea la entrega.</li>
          </ol>
        </div>

        {/* §3e */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que cuestan el EAD o el tiempo</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Enviar tarde y quedar sin protección ni permiso de trabajo mientras esperas decisión.</li>
            <li>Firmar formularios viejos o mezclar páginas de revisiones distintas.</li>
            <li>Ocultar arrestos o viajes que debieron declararse: puede verse como falta de credibilidad.</li>
            <li>Mandar cheques o montos incorrectos: USCIS rechaza el paquete completo.</li>
            <li>No copiar el sobre: dirección o servicio de mensajería equivocado devuelve el envío.</li>
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
