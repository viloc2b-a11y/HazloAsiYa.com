import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Necesito ITIN o SSN para declarar impuestos?',
    a: 'Si no tienes SSN elegible pero debes declarar, el IRS usa el ITIN. El formulario W-7 solicita el ITIN; muchas personas declaran con ITIN y reciben créditos si califican según las reglas del año fiscal.',
  },
  {
    q: '¿Dónde preparo la declaración gratis?',
    a: 'El programa VITA del IRS ofrece preparación gratuita para quienes califican por ingresos. Busca sitios en irs.gov/vita. HazloAsíYa no sustituye a un preparador certificado.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación declaración de impuestos',
  serviceType: 'Información fiscal educativa',
  description: 'Contenido educativo en español sobre declaración federal, ITIN y VITA.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/taxes/'),
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
    { '@type': 'ListItem', position: 2, name: 'Impuestos', item: absoluteUrl('/taxes/') },
  ],
}

export default function TaxesEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="taxes-edu">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <Link href="/itin/" className="text-green font-semibold hover:underline">
            ITIN / W-7
          </Link>
          {' · '}
          <Link href="/bank/" className="text-green font-semibold hover:underline">
            Cuenta bancaria
          </Link>
          {' · '}
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Guías
          </Link>
          {' · '}
          <a href="https://www.irs.gov/vita" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            VITA (IRS)
          </a>
        </p>

        {/* §3b */}
        <div>
          <h2 id="taxes-edu" className="font-serif text-2xl text-navy mb-3">
            Declaración federal en español (orientación)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            La temporada fiscal suele concentrarse entre enero y abril. Reúne comprobantes de ingresos (W-2, 1099-NEC,
            1099-INT), gastos deducibles si aplica, y datos de dependientes (SSN o ITIN según reglas del año).
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            HazloAsíYa no prepara la declaración ni representa ante el IRS; usa{' '}
            <a href="https://www.irs.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              irs.gov
            </a>{' '}
            y, si calificas, VITA o preparador certificado.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Con SSN:</strong> empleo por cuenta ajena (W-2) y otros ingresos reportados en 1099.
            </li>
            <li>
              <strong>Con ITIN:</strong> declaras según obligación; algunos créditos tienen reglas adicionales — ver
              publicación federal del año.
            </li>
            <li>
              <strong>Dependientes:</strong> custodia y prueba de residencia del niño cuando el crédito lo exige.
            </li>
            <li>
              <strong>Plazos:</strong> 15 de abril o extensión válida; multas por no declarar cuando hay obligación.
            </li>
          </ul>
        </div>

        {/* §3c */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que conviene reunir (con ejemplos)</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Último W-2 de cada empleador; 1099 si cobraste como contratista o intereses.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Identificación fiscal</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Tarjetas SSN o carta de ITIN vigente para quien declara y dependientes que apliquen.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Gastos deducibles o créditos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Facturas de guardería con EIN, formularios 1098-T si estudias, gastos médicos mayores al piso legal.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Cuenta bancaria para reembolso</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Número de ruta y cuenta para depósito directo; verifica dígitos para evitar rechazo del IRS.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos antes de declarar</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Junta todos los W-2 y 1099; espera correcciones si un empleador los reemplaza.</li>
            <li>Decide si usar software, VITA o preparador; no firmes en blanco.</li>
            <li>Revisa estatus de declaración conjunta vs. separada si te casaste o divorciaste.</li>
            <li>Calcula créditos aplicables con las tablas del año fiscal en curso.</li>
            <li>Presenta electrónicamente o por correo según instrucciones; guarda acuse.</li>
            <li>Corrige con formulario de enmienda si descubres errores después de enviar.</li>
          </ol>
        </div>

        {/* §3e */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que disparan auditorías o multas</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Declarar ingresos en efectivo “en cero” cuando hubo 1099 o depósitos rastreables.</li>
            <li>Reclamar dependiente que ya reclamó el otro padre sin custodia que corresponda.</li>
            <li>ITIN vencido o SSN incorrecto: retrasa reembolsos meses.</li>
            <li>Mezclar años fiscales o usar tablas del año equivocado para créditos.</li>
            <li>No pagar impuesto estimado si eres por cuenta propia y debías hacerlo: intereses después.</li>
          </ul>
        </div>
        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5">
          <h2 className="font-serif text-xl text-navy mb-4">Preguntas frecuentes</h2>
          <dl className="space-y-4 text-sm">
            {faqItems.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-navy">{f.q}</dt>
                <dd className="text-gray-600 mt-1 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="text-xs text-gray-500">HazloAsíYa no es el IRS ni preparador certificado.</p>
      </section>
    </>
  )
}
