import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'SNAP California 2026: CalFresh, ingresos y cómo aplicar',
  description:
    'CalFresh California 2026: ingresos, documentos y cómo aplicar sin errores. Guía en español.',
  alternates: alternatesForPath('/snap/california/'),
  other: regulatoryMetadataOther('USDA FNS / CDSS California'),
  openGraph: {
    url: absoluteUrl('/snap/california/'),
    locale: 'es_US',
    title: 'SNAP CalFresh California — requisitos y cómo aplicar',
    description:
      'CalFresh en California: límites de ingresos, documentos y pasos para aplicar. Contenido educativo en español.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'SNAP CalFresh California' }],
  },
}

const faqItems = [
  {
    q: '¿Cómo se llama SNAP en California?',
    a: 'En California, SNAP se llama CalFresh. Es el mismo programa federal de cupones de comida, administrado por el Departamento de Servicios Sociales de California (CDSS).',
  },
  {
    q: '¿Cuáles son los límites de ingresos para CalFresh en 2026?',
    a: 'Los límites se basan en el tamaño del hogar y el 200% del FPL (California usa límites expandidos). Para un hogar de 3 personas, el ingreso bruto mensual orientativo es aproximadamente $3,000–$3,500. Tu trabajador social confirma el monto exacto.',
  },
  {
    q: '¿Puedo aplicar a CalFresh en línea?',
    a: 'Sí. Puedes aplicar en BenefitsCal.com (portal oficial de California) en español. También puedes ir a tu condado o llamar al 1-877-847-3663.',
  },
  {
    q: '¿Los inmigrantes califican para CalFresh en California?',
    a: 'California tiene reglas más amplias que otros estados. Algunos inmigrantes con estatus legal y residentes permanentes pueden calificar. Verifica tu situación específica con un trabajador social o una organización de ayuda legal.',
  },
  {
    q: '¿Cuánto tiempo tarda la aprobación de CalFresh?',
    a: 'El condado tiene 30 días para procesar tu solicitud. Si tienes urgencia, puedes calificar para beneficios de emergencia (Expedited SNAP) en 3 días hábiles.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa CalFresh / SNAP (California)',
  description: 'Información general sobre CalFresh (SNAP) en California. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/snap/california/'),
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
    { '@type': 'ListItem', position: 2, name: 'SNAP', item: absoluteUrl('/snap/') },
    { '@type': 'ListItem', position: 3, name: 'SNAP en California', item: absoluteUrl('/snap/california/') },
  ],
}

export default function SnapCaliforniaPage() {
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
          <Link href="/snap/form?state=california" className="hover:text-navy">SNAP</Link>
          {' › '}
          <span className="text-navy font-medium">California</span>
        </nav>

        <VerifiedInfoBanner officialUrl="https://www.cdss.ca.gov/calfresh" officialLinkText="CalFresh oficial (CDSS)" />

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mt-6 mb-4">
          CalFresh (SNAP) en California: cómo aplicar en 2026
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contenido educativo · La elegibilidad exacta la determina el condado según tu situación y documentación
        </p>

        {/* CTA principal */}
        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">🛒</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para CalFresh?</p>
            <p className="text-white/70 text-sm">Responde 5 preguntas y te decimos qué documentos necesitas.</p>
          </div>
          <Link href="/snap/form?state=california" className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors">
            Evalúate gratis →
          </Link>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">

          {/* Qué es CalFresh */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">¿Qué es CalFresh?</h2>
            <p className="leading-relaxed mb-3">
              CalFresh es el nombre de SNAP en California. Es un programa federal administrado por el{' '}
              <strong>Departamento de Servicios Sociales de California (CDSS)</strong> que entrega una tarjeta EBT
              mensual para comprar alimentos en supermercados y tiendas participantes.
            </p>
            <p className="leading-relaxed">
              California tiene algunas de las reglas más favorables del país: usa límites de ingresos expandidos
              (hasta el 200% del FPL en lugar del 130% federal estándar) y tiene programas especiales para estudiantes
              universitarios y personas sin hogar.
            </p>
          </section>

          {/* Límites de ingresos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Límites de ingresos CalFresh 2026 (orientativos)</h2>
            <p className="text-sm text-gray-500 mb-4">
              California usa el 200% del FPL como límite de ingresos brutos. Estos valores son orientativos;
              el condado verifica el monto exacto con tus documentos.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy/5">
                    <th className="text-left p-3 font-semibold text-navy">Personas en el hogar</th>
                    <th className="text-right p-3 font-semibold text-navy">Ingreso bruto mensual (aprox.)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', '$2,510'],
                    ['2', '$3,408'],
                    ['3', '$4,311'],
                    ['4', '$5,209'],
                    ['5', '$6,107'],
                    ['6', '$7,005'],
                  ].map(([n, amt]) => (
                    <tr key={n} className="border-t border-gray-100">
                      <td className="p-3">{n} persona{n !== '1' ? 's' : ''}</td>
                      <td className="p-3 text-right font-mono">{amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Fuente orientativa: USDA FNS / CDSS. Verifica con tu condado antes de aplicar.
            </p>
          </section>

          {/* Documentos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Documentos que suelen pedir</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Identificación con foto (pasaporte, matrícula consular, ID estatal)',
                'Comprobante de domicilio (factura de servicios, contrato de renta)',
                'Comprobante de ingresos (talones de pago, carta del empleador)',
                'Número de Seguro Social (si aplica) o documentos de estatus migratorio',
                'Información de todos los miembros del hogar',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              Esta lista es orientativa. El condado puede pedir documentos adicionales según tu caso.
            </p>
          </section>

          {/* Cómo aplicar */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Cómo aplicar a CalFresh</h2>
            <ol className="space-y-3 text-sm">
              {[
                { n: '1', t: 'En línea', d: 'Entra a BenefitsCal.com — el portal oficial de California en español. Puedes empezar la solicitud en cualquier momento.' },
                { n: '2', t: 'Por teléfono', d: 'Llama al 1-877-847-3663 (gratuito). Tienen operadores en español.' },
                { n: '3', t: 'En persona', d: 'Ve a la oficina de servicios sociales de tu condado. Lleva todos los documentos originales y copias.' },
                { n: '4', t: 'Entrevista', d: 'El condado te contactará para una entrevista (puede ser por teléfono). Responde en el plazo indicado.' },
                { n: '5', t: 'Aprobación', d: 'Si apruebas, recibirás tu tarjeta EBT por correo en 7–10 días hábiles.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-green/15 text-green font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{step.n}</span>
                  <div>
                    <strong className="text-navy">{step.t}:</strong>{' '}
                    <span className="text-gray-600">{step.d}</span>
                  </div>
                </li>
              ))}
            </ol>
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

          {/* Recursos relacionados */}
          <section className="rounded-xl border border-green/25 bg-emerald-50/60 p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Recursos relacionados</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/snap/form?state=california" className="text-green font-semibold hover:underline">SNAP general (cuestionario de elegibilidad)</Link></li>
              <li><Link href="/snap/florida/" className="text-green font-semibold hover:underline">SNAP en Florida</Link></li>
              <li><Link href="/snap/texas/" className="text-green font-semibold hover:underline">SNAP en Texas</Link></li>
              <li><Link href="/medicaid/california/" className="text-green font-semibold hover:underline">Medicaid California (Medi-Cal)</Link></li>
              <li><Link href="/wic/california/" className="text-green font-semibold hover:underline">WIC en California</Link></li>
              <li><Link href="/guias/documentos-para-snap/" className="text-green font-semibold hover:underline">Documentos para SNAP (guía detallada)</Link></li>
            </ul>
          </section>
        </div>

        <p className="text-sm text-gray-500 border-t border-cream pt-6 mt-8">
          HazloAsíYa no es el CDSS ni el USDA. No garantizamos aprobación de beneficios. Este contenido es educativo.
        </p>
      </article>
    </div>
  )
}
