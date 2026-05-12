import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { fontSans, fontSerif } from '@/app/fonts'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CookieBanner from '@/components/legal/CookieBanner'
import GoogleAnalyticsClient from '@/components/analytics/GoogleAnalyticsClient'
import AuthHydrator from '@/components/AuthHydrator'
import PartnerTracker from '@/components/analytics/PartnerTracker'

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
    <html lang="es" className={`${fontSerif.variable} ${fontSans.variable}`}>
      <head>
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
        <AuthHydrator />
        <FloatingWhatsApp />
        <GoogleAnalyticsClient />
        <PartnerTracker />
        <CookieBanner />
      </body>
    </html>
  )
}
