import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué es Section 8 o ayuda basada en voucher?',
    a: 'Son programas de HUD que ayudan a pagar parte de la renta en viviendas privadas; las listas de espera suelen ser largas y cada autoridad de vivienda (PHA) administra su propia lista.',
  },
  {
    q: '¿Dónde busco ayuda con renta en Texas?',
    a: 'HUD y las agencias locales publican recursos; también hay programas estatales o del condado según emergencias. Verifica sitios oficiales (.gov) y evita pagar por “acceso” a listas gratuitas.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación vivienda y renta',
  serviceType: 'Información sobre vivienda asequible',
  description: 'Contenido educativo sobre alquiler, HUD y recursos en Texas.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/rent/'),
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
    { '@type': 'ListItem', position: 2, name: 'Renta', item: absoluteUrl('/rent/') },
  ],
}

export default function RentEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="rent-edu">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <Link href="/guias/ayuda-para-pagar-renta-en-tu-ciudad/" className="text-green font-semibold hover:underline">
            Guía ayuda para renta
          </Link>
          {' · '}
          <a href="https://www.hud.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            HUD.gov
          </a>
        </p>
        <div>
          <h2 id="rent-edu" className="font-serif text-2xl text-navy mb-3">
            Alquiler y programas de vivienda (orientación)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Si tienes dificultad para pagar la renta, las opciones dependen de tu ciudad, ingresos y tamaño del hogar.
            Muchos programas tienen listas de espera; inscribirse temprano y mantener datos actualizados con la PHA es
            clave.
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
        <p className="text-xs text-gray-500">HazloAsíYa no es HUD ni tu arrendador.</p>
      </section>
    </>
  )
}
