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
          <a href="https://www.irs.gov/vita" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            VITA (IRS)
          </a>
        </p>
        <div>
          <h2 id="taxes-edu" className="font-serif text-2xl text-navy mb-3">
            Declaración federal en español (orientación)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            La temporada fiscal suele concentrarse entre enero y abril. Reúne comprobantes de ingresos (W-2, 1099), gastos
            deducibles si aplica, y datos de dependientes. El IRS publica instrucciones actualizadas en{' '}
            <a href="https://www.irs.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              irs.gov
            </a>
            .
          </p>
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
