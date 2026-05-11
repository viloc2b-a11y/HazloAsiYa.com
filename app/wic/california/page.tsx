import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'WIC California 2026: clínicas, ingresos y cómo pedir cita',
  description:
    'WIC California 2026: ingresos, cita en cdph.ca.gov/WIC y documentos requeridos. Guía en español.',
  alternates: alternatesForPath('/wic/california/'),
  other: regulatoryMetadataOther('USDA FNS / CDPH California'),
  openGraph: {
    url: absoluteUrl('/wic/california/'),
    locale: 'es_US',
    title: 'WIC California — ingresos, cita y documentos',
    description: 'WIC en California: cómo pedir cita, qué llevar y qué alimentos cubre. Contenido educativo en español.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'WIC California' }],
  },
}

const faqItems = [
  {
    q: '¿Cómo pido cita para WIC en California?',
    a: 'Puedes encontrar tu clínica WIC más cercana en cdph.ca.gov/WIC o llamar al 1-888-942-9675. California tiene más de 80 agencias WIC locales con clínicas en todo el estado.',
  },
  {
    q: '¿Quién puede recibir WIC en California?',
    a: 'WIC en California cubre a mujeres embarazadas, madres lactantes (hasta 1 año postparto), madres no lactantes (hasta 6 meses postparto), bebés (hasta 1 año) y niños de 1 a 5 años. Deben tener ingresos dentro de los límites y un riesgo nutricional.',
  },
  {
    q: '¿Los inmigrantes sin documentos pueden recibir WIC?',
    a: 'Sí. WIC no requiere verificación de estatus migratorio. El programa es para todos los residentes de California que cumplan los requisitos de ingresos y necesidad nutricional.',
  },
  {
    q: '¿Qué alimentos cubre WIC en California?',
    a: 'WIC cubre leche, queso, huevos, cereales, jugos, legumbres, frutas y verduras, mantequilla de maní, y fórmula para bebés. En California, WIC también cubre alimentos de tiendas de comida étnica.',
  },
  {
    q: '¿Cuánto tiempo tarda la primera cita de WIC?',
    a: 'La primera cita suele durar 1–2 horas. Incluye una evaluación nutricional, medición de peso/talla, y orientación sobre los beneficios. Las citas de renovación son más cortas.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa WIC (California)',
  description: 'Información general sobre WIC en California. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/wic/california/'),
  areaServed: { '@type': 'State', name: 'California' },
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
    { '@type': 'ListItem', position: 2, name: 'WIC', item: absoluteUrl('/wic/') },
    { '@type': 'ListItem', position: 3, name: 'WIC California', item: absoluteUrl('/wic/california/') },
  ],
}

export default function WicCaliforniaPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Ruta de navegación">
          <Link href="/" className="hover:text-navy">Inicio</Link>
          {' › '}
          <Link href="/wic/form?state=california" className="hover:text-navy">WIC</Link>
          {' › '}
          <span className="text-navy font-medium">California</span>
        </nav>

        <VerifiedInfoBanner officialUrl="https://www.cdph.ca.gov/Programs/CFH/DWICSN" officialLinkText="WIC California (CDPH)" />

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mt-6 mb-4">
          WIC en California: cómo pedir cita y qué llevar en 2026
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contenido educativo · La elegibilidad exacta la determina tu clínica WIC local
        </p>

        {/* CTA */}
        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">🍎</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para WIC en California?</p>
            <p className="text-white/70 text-sm">Responde 5 preguntas y te decimos qué documentos necesitas.</p>
          </div>
          <Link href="/wic/form?state=california" className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors">
            Evalúate gratis →
          </Link>
        </div>

        <div className="space-y-8 text-gray-700">

          {/* Quién califica */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">¿Quién puede recibir WIC en California?</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: '🤰', title: 'Embarazadas', desc: 'Durante todo el embarazo' },
                { icon: '🤱', title: 'Madres lactantes', desc: 'Hasta 1 año después del parto' },
                { icon: '👩', title: 'Madres no lactantes', desc: 'Hasta 6 meses después del parto' },
                { icon: '👶', title: 'Bebés', desc: 'Desde el nacimiento hasta 1 año' },
                { icon: '🧒', title: 'Niños pequeños', desc: 'De 1 a 5 años de edad' },
              ].map((cat) => (
                <div key={cat.title} className="flex gap-3 p-3 rounded-lg bg-cream/50">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="font-semibold text-navy text-xs">{cat.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Límites de ingresos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Límites de ingresos WIC California 2026 (orientativos)</h2>
            <p className="text-sm text-gray-500 mb-4">WIC usa el 185% del FPL como límite de ingresos:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy/5">
                    <th className="text-left p-3 font-semibold text-navy">Personas en el hogar</th>
                    <th className="text-right p-3 font-semibold text-navy">Ingreso mensual (aprox.)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', '$2,248'],
                    ['2', '$3,052'],
                    ['3', '$3,856'],
                    ['4', '$4,660'],
                    ['5', '$5,464'],
                  ].map(([n, amt]) => (
                    <tr key={n} className="border-t border-gray-100">
                      <td className="p-3">{n} persona{n !== '1' ? 's' : ''}</td>
                      <td className="p-3 text-right font-mono">{amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Fuente orientativa: USDA FNS / CDPH. Tu clínica verifica el monto exacto.</p>
          </section>

          {/* Documentos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Qué llevar a tu primera cita WIC</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Identificación con foto (pasaporte, matrícula consular, ID estatal)',
                'Comprobante de domicilio en California',
                'Comprobante de ingresos (o declaración si no tienes)',
                'Para embarazadas: confirmación del embarazo (fecha estimada de parto)',
                'Para bebés y niños: acta de nacimiento o pasaporte',
                'Tarjeta de vacunas del niño (si la tienes)',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
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

          {/* Recursos */}
          <section className="rounded-xl border border-green/25 bg-emerald-50/60 p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Recursos relacionados</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wic/form?state=california" className="text-green font-semibold hover:underline">WIC general (cuestionario)</Link></li>
              <li><Link href="/wic/florida/" className="text-green font-semibold hover:underline">WIC en Florida</Link></li>
              <li><Link href="/wic/texas/" className="text-green font-semibold hover:underline">WIC en Texas</Link></li>
              <li><Link href="/snap/california/" className="text-green font-semibold hover:underline">CalFresh (SNAP) California</Link></li>
              <li><Link href="/medicaid/california/" className="text-green font-semibold hover:underline">Medi-Cal California</Link></li>
            </ul>
          </section>
        </div>

        <p className="text-sm text-gray-500 border-t border-cream pt-6 mt-8">
          HazloAsíYa no es el CDPH ni el USDA. No garantizamos aprobación de beneficios. Este contenido es educativo.
        </p>
      </article>
    </div>
  )
}
