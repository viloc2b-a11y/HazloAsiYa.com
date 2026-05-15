import { HOME_FAQ_ITEMS, HOME_TESTIMONIALS } from '@/data/home-structured-content'
import { SITE_ORIGIN } from '@/lib/site'

const LOCAL_ID = `${SITE_ORIGIN}/#localbusiness`

function homeStructuredGraph() {
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_ORIGIN}/#faq`,
    inLanguage: 'es-US',
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const localBusiness = {
    '@type': 'LocalBusiness',
    '@id': LOCAL_ID,
    name: 'HazloAsíYa',
    description:
      'Plataforma educativa en español para orientar en trámites y beneficios en EE. UU. (no es asesoría legal ni gubernamental).',
    url: `${SITE_ORIGIN}/`,
    telephone: '+13468761439',
    email: 'soporte@hazloasiya.com',
    image: `${SITE_ORIGIN}/images/og/default-og.jpg`,
    priceRange: '$0-$179',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  }

  const reviews = HOME_TESTIMONIALS.map((t) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: t.nombre,
    },
    reviewBody: t.texto,
    itemReviewed: { '@id': LOCAL_ID },
    inLanguage: 'es-US',
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [faqPage, localBusiness, ...reviews],
  }
}

/**
 * JSON-LD solo en home: FAQPage + LocalBusiness + Review (sin aggregateRating; citas visibles en la misma página).
 */
export default function HomeJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredGraph()) }}
    />
  )
}
