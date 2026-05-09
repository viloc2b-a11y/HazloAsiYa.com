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

      {/* Hero */}
      <section className="bg-navy px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-bold tracking-widest uppercase text-green/70 mb-3">Quiénes somos</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-5">
            Somos de Houston.<br />Entendemos lo que vives.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            HazloAsíYa nació en el área de Houston/Katy, Texas — construido por personas que han visto de cerca
            lo difícil que es navegar el sistema sin ayuda, sin tiempo y sin que nadie te explique en español.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-12 text-gray-700 leading-relaxed">

        {/* Historia */}
        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Por qué existe HazloAsíYa</h2>
          <p className="mb-4">
            La comunidad hispana de Houston es una de las más grandes y trabajadoras del país. Pero navegar
            los trámites del gobierno en EE.&nbsp;UU. — SNAP, Medicaid, ITIN, DACA, escuela, taxes — es
            complicado incluso para quien habla inglés perfectamente.
          </p>
          <p className="mb-4">
            Para una familia hispana, el proceso se complica todavía más: formularios en inglés, instrucciones
            confusas, requisitos que cambian, miedo a equivocarse, miedo a preguntar. La mayoría termina
            posponiendo trámites que les corresponden — o pagando a alguien que les cobra de más por hacer
            algo que deberían poder hacer solos.
          </p>
          <p>
            Creamos HazloAsíYa para cambiar eso. No somos una organización de caridad ni una startup de Silicon
            Valley. Somos un equipo local, basado en Houston y Katy, Texas, que construyó esta plataforma con
            una sola pregunta en mente:{' '}
            <strong className="text-navy">
              ¿cómo le explicarías esto a un familiar que acaba de llegar?
            </strong>
          </p>
        </section>

        {/* Qué hacemos */}
        <section className="rounded-2xl bg-white border border-cream p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-navy mb-5">Lo que hacemos — y lo que no hacemos</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-green mb-3">Sí hacemos</div>
              <ul className="space-y-2 text-sm">
                {[
                  'Guías paso a paso en español para trámites reales',
                  'Formularios oficiales pre-llenados con tus datos',
                  'Instrucciones exactas: qué llevar, qué decir, qué evitar',
                  'Contenido verificado contra fuentes del gobierno de EE.UU.',
                  'Ayudarte a conectar con recursos locales en Houston',
                ].map(t => (
                  <li key={t} className="flex gap-2 items-start">
                    <span className="text-green font-bold mt-0.5 shrink-0">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">No hacemos</div>
              <ul className="space-y-2 text-sm text-gray-500">
                {[
                  'No somos abogados ni damos asesoría legal',
                  'No representamos al gobierno ni a ninguna agencia',
                  'No compartimos tu información con ICE ni autoridades',
                  'No vendemos tu información a terceros',
                  'No prometemos resultados — la agencia decide',
                ].map(t => (
                  <li key={t} className="flex gap-2 items-start">
                    <span className="text-red-400 font-bold mt-0.5 shrink-0">✗</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Privacidad */}
        <section className="rounded-2xl border border-green/25 bg-emerald-50/80 px-6 py-5">
          <h2 className="font-serif text-xl text-navy mb-3">🔒 Tu información es tuya</h2>
          <p className="text-sm leading-relaxed">
            Solo usamos tus respuestas para preparar tu formulario y mejorar tu experiencia en la plataforma.
            Nunca vendemos tu información. No compartimos tus datos con agencias de inmigración ni con ninguna
            entidad gubernamental. Puedes leer nuestra{' '}
            <Link href="/privacy/" className="text-green font-semibold hover:underline">
              política de privacidad completa
            </Link>
            {' '}o solicitar la eliminación de tus datos en{' '}
            <Link href="/mis-datos/" className="text-green font-semibold hover:underline">
              Mis datos
            </Link>.
          </p>
        </section>

        {/* Metodología */}
        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Cómo verificamos la información</h2>
          <p className="mb-4 text-sm">
            Cada guía se verifica contra fuentes oficiales antes de publicarse y se actualiza cuando las
            regulaciones cambian. No inventamos requisitos ni fechas — todo viene de la fuente.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              ['https://www.fns.usda.gov/', 'USDA Food and Nutrition Service', 'SNAP, WIC'],
              ['https://www.irs.gov/', 'IRS.gov', 'ITIN, W-7, declaración de impuestos'],
              ['https://www.hhs.texas.gov/', 'Texas HHSC', 'Medicaid Texas, CHIP'],
              ['https://www.uscis.gov/', 'USCIS.gov', 'DACA, renovación, permisos de trabajo'],
              ['https://tea.texas.gov/', 'Texas Education Agency', 'Inscripción escolar, Pre-K, IEP'],
              ['https://www.twc.texas.gov/', 'Texas Workforce Commission', 'Desempleo TWC'],
            ].map(([href, name, scope]) => (
              <li key={name} className="flex gap-3 items-start">
                <span className="text-green mt-0.5 shrink-0">→</span>
                <span>
                  <ExtLink href={href}>{name}</ExtLink>
                  <span className="text-gray-400"> — {scope}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ubicación + contacto */}
        <section className="rounded-2xl bg-navy px-6 py-8 text-white">
          <div className="text-xs font-bold tracking-widest uppercase text-green/70 mb-3">Dónde estamos</div>
          <h2 className="font-serif text-2xl mb-3">📍 Houston / Katy, Texas</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Somos un equipo local. Conocemos los recursos del área, los consulados, los distritos escolares,
            las clínicas y las oficinas de beneficios de Greater Houston. Eso nos permite darte información
            que realmente aplica donde vives.
          </p>
          <p className="text-sm text-white/60">
            ¿Tienes preguntas sobre el sitio?{' '}
            <a href="mailto:hola@hazloasiya.com" className="text-green font-semibold underline">
              hola@hazloasiya.com
            </a>
          </p>
        </section>

        {/* CTA */}
        <div className="text-center pt-2 pb-6">
          <Link href="/" className="btn-primary px-8 py-3.5 text-base inline-block">
            Ver todos los trámites →
          </Link>
          <p className="text-xs text-gray-400 mt-3">Última revisión: abril 2026</p>
        </div>

      </div>
    </div>
  )
}
