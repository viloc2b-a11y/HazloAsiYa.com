import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

const CANONICAL_PATH = '/sobre-nosotros/'

export const metadata: Metadata = {
  /** ≤60 caracteres; alineado al brief Semana 2 */
  title: 'Quiénes somos | HazloAsíYa — Información verificada',
  description:
    'Conoce quiénes somos, cómo verificamos la información y por qué HazloAsíYa es la guía más confiable de trámites en español en EE. UU.',
  alternates: alternatesForPath(CANONICAL_PATH),
  openGraph: {
    url: absoluteUrl(CANONICAL_PATH),
    locale: 'es_US',
    title: 'Quiénes somos | HazloAsíYa',
    description:
      'Plataforma educativa en español. Cómo verificamos la información y qué servicios ofrecemos.',
    images: [{ url: '/images/og/sobre-nosotros-og.jpg', width: 1200, height: 630, alt: 'Quiénes somos | HazloAsíYa' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HazloAsíYa',
  url: SITE_ORIGIN,
  description:
    'Plataforma educativa en español que guía a familias hispanas en EE. UU. a completar trámites de beneficios sociales, impuestos y servicios gubernamentales sin errores y sin intermediarios costosos.',
  areaServed: 'United States',
  availableLanguage: 'Spanish',
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Topbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-navy mb-4">Quiénes somos</h1>
        <p className="text-gray-500 text-sm mb-8">Última revisión de esta página: abril 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Quiénes somos</h2>
            <p>
              <strong>HazloAsíYa</strong> es una plataforma educativa en español que guía a familias hispanas en EE. UU.
              a completar trámites de beneficios sociales, impuestos y servicios gubernamentales sin errores y sin
              intermediarios costosos. Operamos desde <strong>Houston, Texas</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Nuestra metodología</h2>
            <p className="mb-4">
              La información de cada guía se verifica contra fuentes oficiales antes de publicarse y se revisa cuando
              las regulaciones cambian. Nuestras fuentes incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <ExtLink href="https://www.fns.usda.gov/">USDA Food and Nutrition Service (fns.usda.gov)</ExtLink> —
                SNAP, WIC
              </li>
              <li>
                <ExtLink href="https://www.irs.gov/">IRS.gov</ExtLink> — ITIN, formulario W-7, declaración de impuestos
              </li>
              <li>
                <ExtLink href="https://www.hhs.texas.gov/">Texas HHSC (hhs.texas.gov)</ExtLink> — Medicaid Texas, CHIP
                Texas
              </li>
              <li>
                <ExtLink href="https://www.hud.gov/">HUD.gov</ExtLink> — programas de vivienda y renta
              </li>
              <li>
                <ExtLink href="https://tea.texas.gov/">Texas Education Agency (tea.texas.gov)</ExtLink> — inscripción
                escolar
              </li>
            </ul>
          </section>

          <section
            className="rounded-2xl border-4 border-navy/25 bg-white p-6 shadow-sm"
            aria-label="Aviso importante"
          >
            <h2 className="font-serif text-2xl text-navy mb-3">Aviso importante</h2>
            <p className="leading-relaxed">
              HazloAsíYa no es una agencia gubernamental, no somos abogados y no representamos al gobierno de EE. UU.
              ni del estado de Texas. La información que ofrecemos es educativa. Para asesoría legal o representación
              oficial, consulta a un abogado certificado o una organización de servicios legales gratuitos en tu área.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Contacto</h2>
            <p>
              Escríbenos a{' '}
              <a href="mailto:hola@hazloasiya.com" className="text-green font-semibold underline">
                hola@hazloasiya.com
              </a>{' '}
              para soporte del producto o aclaraciones sobre el uso del sitio.
            </p>
          </section>

          <p>
            <Link href="/" className="text-green font-semibold">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
