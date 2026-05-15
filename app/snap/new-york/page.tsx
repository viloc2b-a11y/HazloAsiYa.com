import type { Metadata } from 'next'
import Link from 'next/link'
import RelatedLinks from '@/components/seo/RelatedLinks'
import { RELATED_SNAP_NEW_YORK, excludeGeoByHref, SNAP_STATE_GEO } from '@/data/related-link-clusters'
import { withTrailingSlash, absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'

export const metadata: Metadata = {
  title: 'SNAP Nueva York: cómo aplicar a los cupones de comida NY',
  description:
    'SNAP Nueva York: límites de ingreso, myBenefits.ny.gov y formulario LDSS-2921 en español.',
  alternates: alternatesForPath('/snap/new-york/'),
  openGraph: {
    title: 'SNAP Nueva York en español | HazloAsíYa',
    description:
      'Guía completa para aplicar a los cupones de comida SNAP en Nueva York. Formulario LDSS-2921 oficial pre-llenado en español.',
    url: absoluteUrl('/snap/new-york/'),
    siteName: 'HazloAsíYa',
    locale: 'es_US',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo aplicar a SNAP en Nueva York en español',
  description:
    'Guía paso a paso para aplicar a los cupones de comida SNAP en Nueva York. Límites de ingreso 2025, formulario LDSS-2921 y portal myBenefits.',
  url: absoluteUrl('/snap/new-york/'),
  author: { '@type': 'Organization', name: 'HazloAsíYa' },
  publisher: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  inLanguage: 'es',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'SNAP', item: absoluteUrl('/snap/') },
      { '@type': 'ListItem', position: 3, name: 'Nueva York', item: absoluteUrl('/snap/new-york/') },
    ],
  },
}

const incomeTable = [
  { size: '1 persona', monthly: '$2,311', annual: '$27,732' },
  { size: '2 personas', monthly: '$3,125', annual: '$37,500' },
  { size: '3 personas', monthly: '$3,938', annual: '$47,256' },
  { size: '4 personas', monthly: '$4,750', annual: '$57,000' },
  { size: '5 personas', monthly: '$5,563', annual: '$66,756' },
  { size: '6 personas', monthly: '$6,375', annual: '$76,500' },
]

const steps = [
  {
    num: '01',
    title: 'Verifica tu elegibilidad',
    desc: 'Responde nuestro cuestionario gratuito de 3 minutos. La IA analiza tu ingreso, tamaño de familia y estado migratorio para darte un diagnóstico personalizado.',
  },
  {
    num: '02',
    title: 'Recibe tu formulario LDSS-2921 pre-llenado',
    desc: 'Con tus datos del cuestionario, generamos el formulario oficial LDSS-2921 de Nueva York ya completado en español. Listo para imprimir o subir al portal.',
  },
  {
    num: '03',
    title: 'Entrega en tu oficina HRA o en myBenefits',
    desc: 'Lleva el formulario a tu oficina HRA local, súbelo en myBenefits.ny.gov, o llama al 1-800-342-3009. Recibirás respuesta en 30 días (7 días si es emergencia).',
  },
]

const faqs = [
  {
    q: '¿Cuánto tiempo tarda el proceso SNAP en Nueva York?',
    a: 'La mayoría de las solicitudes se procesan en 30 días. Si tu hogar tiene menos de $100 en efectivo o está en situación de emergencia, puedes calificar para procesamiento expedited en 7 días.',
  },
  {
    q: '¿Puedo aplicar a SNAP en NY si soy indocumentado?',
    a: 'Los adultos indocumentados no califican para SNAP federal. Sin embargo, los niños ciudadanos en hogares de estatus mixto sí califican. Además, Nueva York tiene el programa SNAP estatal (State SNAP) para ciertos residentes que no califican para el federal.',
  },
  {
    q: '¿Qué documentos necesito para aplicar a SNAP en Nueva York?',
    a: 'Identificación con foto, comprobante de domicilio en NY, comprobante de ingresos (talones de pago, carta de empleo o declaración de desempleo), y número de Seguro Social o ITIN para los miembros que aplican.',
  },
  {
    q: '¿Dónde entrego el formulario LDSS-2921?',
    a: 'Puedes entregarlo en tu oficina HRA (Human Resources Administration) local, subirlo en myBenefits.ny.gov, enviarlo por correo, o llevarlo a un Community Partner de OTDA.',
  },
  {
    q: '¿Puedo aplicar a SNAP y Medicaid al mismo tiempo en NY?',
    a: 'Sí. El formulario LDSS-2921 es una solicitud combinada que cubre SNAP, Medicaid, Asistencia Familiar (FA) y otros beneficios. Con una sola solicitud puedes aplicar a todos.',
  },
  {
    q: '¿Cuánto dinero recibo con SNAP en Nueva York?',
    a: 'El beneficio promedio en NY es de $187/mes por persona. Una familia de 4 puede recibir hasta $973/mes. El monto exacto depende de tus ingresos, gastos de vivienda y tamaño del hogar.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function SnapNewYorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-stone-50">
        {/* Hero */}
        <section className="bg-stone-900 text-white">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <nav className="text-xs text-stone-400 mb-6 flex items-center gap-1.5">
              <Link href={withTrailingSlash('/')} className="hover:text-white transition-colors">Inicio</Link>
              <span>/</span>
              <Link href={'/snap/form?state=nueva-york'} className="hover:text-white transition-colors">SNAP</Link>
              <span>/</span>
              <span className="text-white">Nueva York</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🗽</span>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full">
                SNAP · NUEVA YORK · 2025
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Cupones de comida SNAP<br />
              <span className="text-emerald-400">en Nueva York</span>
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-8">
              Aplica al programa SNAP de Nueva York con el formulario oficial LDSS-2921 ya completado en español.
              Diagnóstico gratis · Formulario pre-llenado · Instrucciones exactas de entrega.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={'/snap/form?state=nueva-york'}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-black px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Verificar elegibilidad gratis →
              </Link>
              <Link
                href={withTrailingSlash('/pdf/snap-new-york')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm border border-white/20"
              >
                Formulario LDSS-2921 pre-llenado
              </Link>
            </div>
          </div>
        </section>

        <VerifiedInfoBanner
          officialUrl="https://mybenefits.ny.gov"
          
        />

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">

          {/* Stats */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '3.8M', label: 'hispanos en NY' },
                { value: '2.8M', label: 'participantes SNAP en NY' },
                { value: '$187', label: 'beneficio promedio/mes' },
                { value: '30 días', label: 'tiempo de respuesta' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-stone-900">{value}</div>
                  <div className="text-xs text-stone-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Income table */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-2">
              Límites de ingreso SNAP Nueva York 2025
            </h2>
            <p className="text-stone-600 text-sm mb-5">
              Basado en el 130% del nivel federal de pobreza (FPL). Actualizado para el año fiscal 2024–2025.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Tamaño del hogar</th>
                    <th className="text-right px-4 py-3 font-bold">Ingreso bruto mensual</th>
                    <th className="text-right px-4 py-3 font-bold">Ingreso bruto anual</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeTable.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-4 py-3 font-medium text-stone-900">{row.size}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{row.monthly}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              * Límites para el año fiscal 2024–2025. Fuente: USDA FNS / OTDA Nueva York.
            </p>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-6">
              Cómo aplicar a SNAP en Nueva York con HazloAsíYa
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 bg-white border border-stone-200 rounded-2xl p-5">
                  <div className="text-2xl font-black text-emerald-500 font-mono shrink-0 w-10">{step.num}</div>
                  <div>
                    <h3 className="font-black text-stone-900 mb-1">{step.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery info */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h2 className="text-lg font-black text-stone-900 mb-4">
              Dónde entregar tu solicitud SNAP en Nueva York
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-xl mb-2">🌐</div>
                <div className="font-bold text-stone-900 mb-1">En línea</div>
                <a href="https://mybenefits.ny.gov" target="_blank" rel="noopener noreferrer"
                  className="text-emerald-700 underline font-mono text-xs">
                  myBenefits.ny.gov
                </a>
                <p className="text-stone-500 text-xs mt-1">Disponible 24/7</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-xl mb-2">📞</div>
                <div className="font-bold text-stone-900 mb-1">Por teléfono</div>
                <p className="text-emerald-700 font-mono text-xs">1-800-342-3009</p>
                <p className="text-stone-500 text-xs mt-1">Lun–Vie 8am–5pm · Español disponible</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <div className="text-xl mb-2">🏢</div>
                <div className="font-bold text-stone-900 mb-1">En persona</div>
                <p className="text-stone-600 text-xs">Oficina HRA local o Community Partner de OTDA</p>
                <a href="https://otda.ny.gov/workingfamilies/dss.asp" target="_blank" rel="noopener noreferrer"
                  className="text-emerald-700 underline font-mono text-xs mt-1 block">
                  Buscar oficina →
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-6">
              Preguntas frecuentes — SNAP Nueva York
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="bg-white border border-stone-200 rounded-2xl group">
                  <summary className="px-5 py-4 font-bold text-stone-900 cursor-pointer list-none flex items-center justify-between text-sm">
                    {faq.q}
                    <span className="text-stone-400 group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-stone-900 text-white rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🗽</div>
            <h2 className="text-2xl font-black mb-3">¿Listo para aplicar a SNAP en Nueva York?</h2>
            <p className="text-stone-300 text-sm mb-6 max-w-md mx-auto">
              Responde el cuestionario gratis y recibe tu formulario LDSS-2921 oficial ya completado con tus datos.
            </p>
            <Link
              href={'/snap/form?state=nueva-york'}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-black px-8 py-3 rounded-xl transition-colors"
            >
              Empezar cuestionario gratis →
            </Link>
            <p className="text-xs text-stone-500 mt-4">
              ⚖️ HazloAsíYa NO es una agencia gubernamental. Este servicio es educativo e informativo.
            </p>
          </section>

          <RelatedLinks
            links={RELATED_SNAP_NEW_YORK}
            geoLinks={excludeGeoByHref(SNAP_STATE_GEO, '/snap/new-york/')}
          />
        </div>
      </main>
    </>
  )
}
