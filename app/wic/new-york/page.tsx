import type { Metadata } from 'next'
import Link from 'next/link'
import { withTrailingSlash } from '@/lib/site'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'

export const metadata: Metadata = {
  title: 'WIC Nueva York en español — Cómo aplicar al programa WIC NY',
  description:
    'Aplica al programa WIC en Nueva York. Límites de ingreso 2025, alimentos WIC, tarjeta eWIC, formulario pre-llenado en español. Llama al 1-800-522-5006.',
  alternates: { canonical: 'https://www.hazloasiya.com/wic/new-york/' },
  openGraph: {
    title: 'WIC Nueva York en español | HazloAsíYa',
    description:
      'Guía completa para aplicar al programa WIC en Nueva York. Formulario pre-llenado en español, límites de ingreso 2025.',
    url: 'https://www.hazloasiya.com/wic/new-york/',
    siteName: 'HazloAsíYa',
    locale: 'es_US',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo aplicar al programa WIC en Nueva York en español',
  description:
    'Guía paso a paso para aplicar al WIC en Nueva York. Límites de ingreso 2025, tarjeta eWIC y agencias locales.',
  url: 'https://www.hazloasiya.com/wic/new-york/',
  author: { '@type': 'Organization', name: 'HazloAsíYa' },
  publisher: { '@type': 'Organization', name: 'HazloAsíYa', url: 'https://www.hazloasiya.com' },
  inLanguage: 'es',
}

const incomeTable = [
  { size: '1 persona', monthly: '$2,248', annual: '$26,973' },
  { size: '2 personas', monthly: '$3,041', annual: '$36,482' },
  { size: '3 personas', monthly: '$3,834', annual: '$46,006' },
  { size: '4 personas', monthly: '$4,625', annual: '$55,500' },
  { size: '5 personas', monthly: '$5,418', annual: '$65,024' },
  { size: '6 personas', monthly: '$6,211', annual: '$74,532' },
]

const benefits = [
  { icon: '🥛', name: 'Leche', detail: 'Hasta 16 cuartos/mes' },
  { icon: '🧀', name: 'Queso', detail: 'Hasta 1 lb/mes' },
  { icon: '🥚', name: 'Huevos', detail: '1 docena/mes' },
  { icon: '🥜', name: 'Frijoles/Mantequilla de maní', detail: 'Hasta 36 oz/mes' },
  { icon: '🍎', name: 'Frutas y verduras', detail: '$25–$47/mes en efectivo WIC' },
  { icon: '🌾', name: 'Cereales integrales', detail: 'Hasta 36 oz/mes' },
  { icon: '🍼', name: 'Fórmula infantil', detail: 'Para bebés que no son amamantados' },
  { icon: '🐟', name: 'Atún o sardinas', detail: 'Hasta 30 oz/mes' },
]

const faqs = [
  {
    q: '¿Quién puede recibir WIC en Nueva York?',
    a: 'Mujeres embarazadas, madres en período de lactancia (hasta 1 año después del parto), madres en período posparto (hasta 6 meses), bebés y niños hasta 5 años. Deben vivir en Nueva York y cumplir los límites de ingreso (185% FPL).',
  },
  {
    q: '¿Puedo recibir WIC si soy inmigrante en Nueva York?',
    a: 'Sí. El estatus migratorio no afecta la elegibilidad para WIC. Tanto ciudadanos como residentes permanentes, DACA, TPS, visa de trabajo, o incluso indocumentados pueden aplicar. WIC es un programa federal que no cuenta como "carga pública".',
  },
  {
    q: '¿Cómo funciona la tarjeta eWIC en Nueva York?',
    a: 'Nueva York usa la tarjeta eWIC (Electronic Benefits Transfer). Funciona como una tarjeta de débito en supermercados participantes. Los beneficios se cargan mensualmente y puedes ver tu saldo en la app WIC2Go o llamando al número en la tarjeta.',
  },
  {
    q: '¿Dónde aplico a WIC en Nueva York?',
    a: 'Llama al 1-800-522-5006 para encontrar tu agencia WIC local. También puedes buscar en línea en health.ny.gov/wic o visitar directamente una clínica WIC en tu condado. En NYC, llama al 311 y di "WIC".',
  },
  {
    q: '¿Qué documentos necesito para la cita WIC en NY?',
    a: 'Identificación con foto (tuya y del niño si aplica), comprobante de domicilio en Nueva York, comprobante de ingresos del último mes, y el número de Medicaid si lo tienes (acelera el proceso de elegibilidad).',
  },
  {
    q: '¿Puedo recibir WIC y SNAP al mismo tiempo?',
    a: 'Sí. WIC y SNAP son programas independientes y puedes recibir ambos simultáneamente. De hecho, si recibes SNAP, Medicaid o Asistencia Temporal (TA), automáticamente calificas para WIC por ingresos.',
  },
]

export default function WicNewYorkPage() {
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
              <Link href={'/wic/form?state=nueva-york'} className="hover:text-white transition-colors">WIC</Link>
              <span>/</span>
              <span className="text-white">Nueva York</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🗽</span>
              <span className="text-xs font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400 px-3 py-1 rounded-full">
                WIC · NUEVA YORK · 2025
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Programa WIC<br />
              <span className="text-rose-400">Nueva York en español</span>
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-8">
              Aplica al WIC de Nueva York con tu formulario pre-llenado en español.
              Alimentos, fórmula y apoyo para embarazadas, madres y niños hasta 5 años.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={'/wic/form?state=nueva-york'}
                className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-black px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Verificar elegibilidad gratis →
              </Link>
              <Link
                href={withTrailingSlash('/pdf/wic-new-york')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm border border-white/20"
              >
                Formulario WIC NY pre-llenado
              </Link>
            </div>
          </div>
        </section>

        <VerifiedInfoBanner
          officialUrl="https://www.health.ny.gov/prevention/nutrition/wic/"
          
        />

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">

          {/* Stats */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '500K+', label: 'participantes WIC en NY' },
                { value: '185%', label: 'FPL límite de ingreso' },
                { value: '$47', label: 'bono frutas/verduras/mes' },
                { value: '0$', label: 'costo del programa' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-stone-900">{value}</div>
                  <div className="text-xs text-stone-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-5">
              Alimentos que cubre WIC en Nueva York
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {benefits.map((b) => (
                <div key={b.name} className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className="font-bold text-stone-900 text-sm">{b.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{b.detail}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Income table */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-2">
              Límites de ingreso WIC Nueva York 2025
            </h2>
            <p className="text-stone-600 text-sm mb-5">
              Basado en el 185% del nivel federal de pobreza (FPL). Año fiscal 2024–2025.
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
              * Si recibes SNAP, Medicaid o TA, calificas automáticamente para WIC por ingresos.
            </p>
          </section>

          {/* Delivery */}
          <section className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <h2 className="text-lg font-black text-stone-900 mb-4">
              Cómo encontrar tu agencia WIC en Nueva York
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <div className="text-xl mb-2">📞</div>
                <div className="font-bold text-stone-900 mb-1">Línea WIC NY</div>
                <p className="text-rose-700 font-mono text-xs">1-800-522-5006</p>
                <p className="text-stone-500 text-xs mt-1">Lun–Vie · Español disponible</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <div className="text-xl mb-2">🌐</div>
                <div className="font-bold text-stone-900 mb-1">En línea</div>
                <a href="https://www.health.ny.gov/prevention/nutrition/wic/" target="_blank" rel="noopener noreferrer"
                  className="text-rose-700 underline font-mono text-xs">
                  health.ny.gov/wic
                </a>
                <p className="text-stone-500 text-xs mt-1">Busca agencias por código postal</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <div className="text-xl mb-2">🏙️</div>
                <div className="font-bold text-stone-900 mb-1">En NYC</div>
                <p className="text-stone-600 text-xs">Llama al 311 y di &quot;WIC&quot;</p>
                <p className="text-stone-500 text-xs mt-1">Más de 100 clínicas en los 5 boroughs</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-black text-stone-900 mb-6">
              Preguntas frecuentes — WIC Nueva York
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
            <div className="text-3xl mb-3">🍎</div>
            <h2 className="text-2xl font-black mb-3">¿Listo para aplicar a WIC en Nueva York?</h2>
            <p className="text-stone-300 text-sm mb-6 max-w-md mx-auto">
              Responde el cuestionario gratis y recibe tu formulario WIC NY oficial ya completado con tus datos.
            </p>
            <Link
              href={'/wic/form?state=nueva-york'}
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-black px-8 py-3 rounded-xl transition-colors"
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
