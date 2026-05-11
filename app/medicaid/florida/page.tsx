import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { regulatoryMetadataOther } from '@/lib/regulatory-meta'

export const metadata: Metadata = {
  title: 'Medicaid Florida 2026: quién califica, CHIP y cómo aplicar',
  description:
    'Medicaid Florida 2026: elegibilidad, CHIP, ACCESS Florida y documentos. Guía en español.',
  alternates: alternatesForPath('/medicaid/florida/'),
  other: regulatoryMetadataOther('Florida AHCA / CMS'),
  openGraph: {
    url: absoluteUrl('/medicaid/florida/'),
    locale: 'es_US',
    title: 'Medicaid Florida — quién califica y cómo aplicar',
    description: 'Medicaid en Florida: elegibilidad, CHIP y pasos para aplicar. Contenido educativo en español.',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Medicaid Florida' }],
  },
}

const faqItems = [
  {
    q: '¿Quién puede calificar para Medicaid en Florida?',
    a: 'En Florida, Medicaid cubre principalmente a niños, embarazadas, adultos mayores, personas con discapacidades, y algunos adultos con ingresos muy bajos. Florida no expandió Medicaid bajo el ACA, por lo que los adultos sin hijos tienen opciones más limitadas.',
  },
  {
    q: '¿Qué es el CHIP en Florida?',
    a: 'El CHIP en Florida se llama KidCare y cubre a niños de 0 a 18 años con ingresos familiares de hasta el 200% del FPL. Tiene primas muy bajas o gratuitas según el ingreso.',
  },
  {
    q: '¿Cómo aplico a Medicaid en Florida?',
    a: 'Puedes aplicar en myflorida.com/accessflorida (en línea, en español), llamar al 1-866-762-2237, o ir a tu oficina del DCF local.',
  },
  {
    q: '¿Medicaid en Florida cubre a inmigrantes?',
    a: 'Florida ofrece Medicaid de emergencia a personas sin importar su estatus migratorio. Para cobertura completa, generalmente se requiere estatus legal (residente permanente, refugiado, etc.) y 5 años de residencia en EE.UU. Los niños y embarazadas tienen más opciones.',
  },
  {
    q: '¿Qué cubre Medicaid en Florida?',
    a: 'Medicaid en Florida cubre visitas médicas, hospitalización, medicamentos, salud mental, servicios de maternidad, y más. La cobertura exacta depende del plan administrado de tu área.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guía educativa Medicaid y CHIP (Florida)',
  description: 'Información general sobre Medicaid y CHIP en Florida. Contenido educativo.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/medicaid/florida/'),
  areaServed: { '@type': 'State', name: 'Florida' },
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
    { '@type': 'ListItem', position: 2, name: 'Medicaid', item: absoluteUrl('/medicaid/') },
    { '@type': 'ListItem', position: 3, name: 'Medicaid Florida', item: absoluteUrl('/medicaid/florida/') },
  ],
}

export default function MedicaidFloridaPage() {
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
          <Link href="/medicaid/form?state=florida" className="hover:text-navy">Medicaid</Link>
          {' › '}
          <span className="text-navy font-medium">Florida</span>
        </nav>

        <VerifiedInfoBanner officialUrl="https://www.myflorida.com/accessflorida" officialLinkText="Medicaid Florida (DCF)" />

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mt-6 mb-4">
          Medicaid y CHIP en Florida: quién califica y cómo aplicar en 2026
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contenido educativo · La elegibilidad exacta la determina el DCF según tu situación y documentación
        </p>

        {/* CTA */}
        <div className="rounded-2xl bg-navy text-white p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl">🏥</div>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-1">¿Calificas para Medicaid en Florida?</p>
            <p className="text-white/70 text-sm">Responde 5 preguntas y te decimos qué documentos necesitas.</p>
          </div>
          <Link href="/medicaid/form?state=florida" className="bg-green hover:bg-green/90 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-colors">
            Evalúate gratis →
          </Link>
        </div>

        <div className="space-y-8 text-gray-700">

          {/* Quién califica */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">¿Quién califica para Medicaid en Florida?</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: '👶', title: 'Niños (0–18)', desc: 'Hasta el 200% del FPL — programa KidCare / CHIP' },
                { icon: '🤰', title: 'Embarazadas', desc: 'Hasta el 196% del FPL — cobertura prenatal y parto' },
                { icon: '👴', title: 'Adultos mayores (+65)', desc: 'Con ingresos y recursos limitados' },
                { icon: '♿', title: 'Personas con discapacidad', desc: 'Con SSI o discapacidad certificada' },
                { icon: '🏠', title: 'Adultos con hijos', desc: 'Ingresos muy bajos — Florida no expandió ACA' },
                { icon: '🚨', title: 'Emergencias médicas', desc: 'Cualquier persona, sin importar estatus migratorio' },
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

          {/* Documentos */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Documentos que suelen pedir</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Identificación con foto (pasaporte, ID de Florida, matrícula consular)',
                'Número de Seguro Social (o documentos de estatus migratorio)',
                'Comprobante de domicilio en Florida',
                'Comprobante de ingresos del hogar',
                'Para niños: acta de nacimiento',
                'Para embarazadas: confirmación de embarazo del médico',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cómo aplicar */}
          <section className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Cómo aplicar a Medicaid en Florida</h2>
            <ol className="space-y-3 text-sm">
              {[
                { n: '1', t: 'En línea', d: 'myflorida.com/accessflorida — disponible en español. Crea una cuenta y llena la solicitud.' },
                { n: '2', t: 'Por teléfono', d: 'Llama al 1-866-762-2237 (ACCESS Florida). Tienen operadores en español.' },
                { n: '3', t: 'En persona', d: 'Ve a tu oficina del DCF local con todos los documentos.' },
                { n: '4', t: 'Entrevista', d: 'El DCF puede solicitar una entrevista telefónica. Responde en el plazo indicado.' },
                { n: '5', t: 'Tarjeta de beneficios', d: 'Si te aprueban, recibirás información sobre tu plan de Medicaid administrado.' },
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

          {/* Recursos */}
          <section className="rounded-xl border border-green/25 bg-emerald-50/60 p-5">
            <h2 className="font-serif text-xl text-navy mb-3">Recursos relacionados</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/medicaid/form?state=florida" className="text-green font-semibold hover:underline">Medicaid general (cuestionario)</Link></li>
              <li><Link href="/medicaid/california/" className="text-green font-semibold hover:underline">Medi-Cal California</Link></li>
              <li><Link href="/medicaid/texas/" className="text-green font-semibold hover:underline">Medicaid Texas</Link></li>
              <li><Link href="/snap/florida/" className="text-green font-semibold hover:underline">SNAP Florida</Link></li>
              <li><Link href="/wic/florida/" className="text-green font-semibold hover:underline">WIC en Florida</Link></li>
            </ul>
          </section>
        </div>

        <p className="text-sm text-gray-500 border-t border-cream pt-6 mt-8">
          HazloAsíYa no es el DCF ni la AHCA. No garantizamos aprobación de beneficios. Este contenido es educativo.
        </p>
      </article>
    </div>
  )
}
