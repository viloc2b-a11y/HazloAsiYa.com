import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import CookieBanner from '@/components/legal/CookieBanner'
import GoogleAnalyticsClient from '@/components/analytics/GoogleAnalyticsClient'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const searchUrlTemplate = `${absoluteUrl('/buscar')}?q={search_term_string}`

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HazloAsíYa',
  url: `${SITE_ORIGIN}/`,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: searchUrlTemplate,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const metadata: Metadata = {
  title: 'HazloAsíYa — Haz tus trámites en Estados Unidos sin errores',
  description: 'Te decimos exactamente qué hacer, qué documentos necesitas y cómo completar tus trámites en EE.UU. desde la primera vez. En español.',
  metadataBase: new URL(SITE_ORIGIN),
  alternates: alternatesForPath('/'),
  openGraph: {
    title: 'HazloAsíYa — Haz tus trámites en EE.UU. sin errores',
    description: 'Guías paso a paso en español para SNAP, Medicaid, DACA, taxes, escuela y más.',
    type: 'website',
    locale: 'es_US',
    url: `${SITE_ORIGIN}/`,
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'HazloAsíYa' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet"/>
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
`}
        </Script>
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">
              {`
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, { send_page_view: false });
`}
            </Script>
          </>
        ) : null}
      </head>
      <body className="bg-cream text-gray-800 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <GoogleAnalyticsClient />
        <CookieBanner />
      </body>
    </html>
  )
}
