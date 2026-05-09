import type { Metadata } from 'next'
import Link from 'next/link'
import { withTrailingSlash } from '@/lib/site'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'

export const metadata: Metadata = {
  title: 'Medicaid Nueva York en español — Cómo aplicar al seguro médico gratuito NY',
  description:
    'Aplica a Medicaid en Nueva York (NY Medicaid / Essential Plan). Límites de ingreso 2025, formulario DOH-4220 pre-llenado en español, portal NY State of Health. Cobertura desde el día 1.',
  alternates: { canonical: 'https://www.hazloasiya.com/medicaid/new-york/' },
  openGraph: {
    title: 'Medicaid Nueva York en español | HazloAsíYa',
    description:
      'Guía completa para aplicar a Medicaid en Nueva York. Formulario DOH-4220 oficial pre-llenado en español.',
    url: 'https://www.hazloasiya.com/medicaid/new-york/',
    siteName: 'HazloAsíYa',
    locale: 'es_US',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo aplicar a Medicaid en Nueva York en español',
  description:
    'Guía paso a paso para aplicar a Medicaid en Nueva York. Límites de ingreso 2025, formulario DOH-4220 y portal NY State of Health.',
  url: 'https://www.hazloasiya.com/medicaid/new-york/',
  author: { '@type': 'Organization', name: 'HazloAsíYa' },
  publisher: { '@type': 'Organization', name: 'HazloAsíYa', url: 'https://www.hazloasiya.com' },
  inLanguage: 'es',
}

const programs = [
  {
    name: 'Medicaid',
    icon: '🏥',
    who: 'Ingresos bajos, embarazadas, niños, discapacitados',
    cost: 'Gratis',
    income: 'Hasta 138% FPL',
    portal: 'NY State of Health',
  },
  {
    name: 'Essential Plan',
    icon: '💊',
    who: 'Adultos 19–64 años, ingresos entre 138%–250% FPL',
    cost: '$0–$20/mes',
    income: 'Hasta 250% FPL',
    portal: 'NY State of Health',
  },
  {
    name: 'Child Health Plus',
    icon: '👶',
    who: 'Niños hasta 19 años',
    cost: '$0–$60/mes',
    income: 'Hasta 400% FPL',
    portal: 'NY State of Health',
  },
]

const incomeTable = [
  { size: '1 persona', medicaid: '$20,120', essential: '$36,450' },
  { size: '2 personas', medicaid: '$27,214', essential: '$49,300' },
  { size: '3 personas', medicaid: '$34,307', essential: '$62,150' },
  { size: '4 personas', medicaid: '$41,400', essential: '$75,000' },
  { size: '5 personas', medicaid: '$48,493', essential: '$87,850' },
]

const faqs = [
  {
    q: '¿Cuál es la diferencia entre Medicaid y el Essential Plan en Nueva York?',
    a: 'Medicaid es para personas con ingresos muy bajos (hasta 138% FPL) y es completamente gratis. El Essential Plan es para ingresos entre 138% y 250% FPL, con primas de $0 a $20/mes. Ambos cubren visitas médicas, hospitalizaciones, medicamentos y salud mental.',
  },
  {
    q: '¿Puedo aplicar a Medicaid en NY si soy inmigrante?',
    a: 'Sí. Nueva York tiene una de las políticas más inclusivas del país. Los residentes permanentes legales (green card) califican. Los inmigrantes con estatus DACA, TPS o visa de trabajo también pueden calificar para el Essential Plan. Los indocumentados pueden calificar para cobertura de emergencias y, en NYC, para el programa NYC Care.',
  },
  {
    q: '¿Cuánto tiempo tarda en activarse Medicaid en Nueva York?',
    a: 'La cobertura puede comenzar el primer día del mes en que aplicas, o incluso retroactivamente hasta 3 meses antes si tuviste gastos médicos. El proceso de aprobación tarda entre 30 y 45 días.',
  },
  {
    q: '¿Dónde aplico a Medicaid en Nueva York?',
    a: 'Puedes aplicar en línea en nystateofhealth.ny.gov, por teléfono al 1-855-355-5777, en persona en tu oficina del Departamento de Servicios Sociales (DSS) del condado, o a través de un Navegador certificado.',
  },
  {
    q: '¿Qué documentos necesito para aplicar a Medicaid en NY?',
    a: 'Identificación con foto, comprobante de residencia en Nueva York, comprobante de ingresos (talones de pago o carta del empleador), número de Seguro Social o ITIN, y documentos de inmigración si aplica.',
  },
]

export default function MedicaidNewYorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-stone-50">
        {/* Hero */}
        <section className="bg-stone-900 text-white">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <nav className="text-xs text-stone-400 mb-6 flex items-center gap-1.5">
              <Link href={withTrailingSlash('/')} className="hover:text-white transition-colors">Inicio</Link>
              <span>/</span>
              <Link href={withTrailingSlash('/medicaid')} className="hover:text-white transition-colors">Medicaid</Link>
              <span>/</span>
              <span className="text-white">Nueva York</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🗽</span>
              <span className="text-xs font-mono font-bold bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-full">
                MEDICAID · NUEVA YORK · 2025
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Medicaid Nueva York<br />
              <span className="text-blue-400">en español</span>
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-8">
              Aplica a Medicaid o al Essential Plan de Nueva York con el formulario oficial DOH-4220 ya completado en español.
              Diagnóstico gratis · Formulario pre-llenado · Cobertura desde el día 1.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={withTrailingSlash('/medicaid')}
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-black px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Verificar elegibilidad gratis →
              </Link>
              <Link
                href={withTrailingSlash('/pdf/medicaid-new-york')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm border border-white/20"
              >
                Formulario DOH-4220 pre-llenado
              </Link>
            </div>
          </div>
        </section>

        <VerifiedInfoBanner
          officialUrl="https://nystateofhealth.ny.gov"
          
        />

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">

          {/* Programs */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-5">
              Programas de salud disponibles en Nueva York
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {programs.map((p) => (
                <div key={p.name} className="bg-white border border-stone-200 rounded-2xl p-5">
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <h3 className="font-black text-stone-900 mb-1">{p.name}</h3>
                  <p className="text-xs text-stone-500 mb-3">{p.who}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Costo:</span>
                      <span className="font-bold text-emerald-700">{p.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Ingreso máx:</span>
                      <span className="font-bold text-stone-700">{p.income}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Portal:</span>
                      <span className="font-bold text-blue-700">{p.portal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Income table */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-2">
              Límites de ingreso Medicaid Nueva York 2025
            </h2>
            <p className="text-stone-600 text-sm mb-5">
              Ingreso bruto anual para calificar a Medicaid (138% FPL) y al Essential Plan (250% FPL).
            </p>
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Tamaño del hogar</th>
                    <th className="text-right px-4 py-3 font-bold">Medicaid (138% FPL)</th>
                    <th className="text-right px-4 py-3 font-bold">Essential Plan (250% FPL)</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeTable.map((row, i) => (
                    <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-4 py-3 font-medium text-stone-900">{row.size}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{row.medicaid}</td>
                      <td className="px-4 py-3 text-right text-stone-700">{row.essential}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              * Límites para el año fiscal 2024–2025. Fuente: NY State of Health / CMS.
            </p>
          </section>

          {/* Delivery */}
          <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-lg font-black text-stone-900 mb-4">
              Dónde aplicar a Medicaid en Nueva York
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-xl mb-2">🌐</div>
                <div className="font-bold text-stone-900 mb-1">En línea</div>
                <a href="https://nystateofhealth.ny.gov" target="_blank" rel="noopener noreferrer"
                  className="text-blue-700 underline font-mono text-xs">
                  nystateofhealth.ny.gov
                </a>
                <p className="text-stone-500 text-xs mt-1">Disponible 24/7</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-xl mb-2">📞</div>
                <div className="font-bold text-stone-900 mb-1">Por teléfono</div>
                <p className="text-blue-700 font-mono text-xs">1-855-355-5777</p>
                <p className="text-stone-500 text-xs mt-1">Lun–Vie 8am–8pm · Español disponible</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-xl mb-2">🏢</div>
                <div className="font-bold text-stone-900 mb-1">En persona</div>
                <p className="text-stone-600 text-xs">Oficina DSS del condado o Navegador certificado</p>
                <a href="https://nystateofhealth.ny.gov/agent/agentSearch" target="_blank" rel="noopener noreferrer"
                  className="text-blue-700 underline font-mono text-xs mt-1 block">
                  Buscar navegador →
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-6">
              Preguntas frecuentes — Medicaid Nueva York
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
            <div className="text-3xl mb-3">🏥</div>
            <h2 className="text-2xl font-black mb-3">¿Listo para aplicar a Medicaid en Nueva York?</h2>
            <p className="text-stone-300 text-sm mb-6 max-w-md mx-auto">
              Responde el cuestionario gratis y recibe tu formulario DOH-4220 oficial ya completado con tus datos.
            </p>
            <Link
              href={withTrailingSlash('/medicaid')}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-black px-8 py-3 rounded-xl transition-colors"
            >
              Empezar cuestionario gratis →
            </Link>
            <p className="text-xs text-stone-500 mt-4">
              ⚖️ HazloAsíYa NO es una agencia gubernamental. Este servicio es educativo e informativo.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
