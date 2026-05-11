import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'
import VideoExplicativo from '@/components/VideoExplicativo'

export const metadata: Metadata = {
  title: 'Alianza HazloAsíYa — Partners por la Comunidad | HazloAsíYa',
  description:
    'Únete gratis a la Alianza HazloAsíYa. Enlace personalizado, flyers y reportes de impacto para tu comunidad.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}` },
  openGraph: {
    title: 'Alianza HazloAsíYa — Partners por la Comunidad',
    description: 'Únete gratis. Tú demuestras impacto real. Nosotros hacemos el trabajo.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}`,
  },
}

const ORG_TYPES = [
  { icon: '⛪', label: 'Iglesias y parroquias', color: 'bg-amber-50 border-amber-200' },
  { icon: '🏥', label: 'Clínicas FQHC', color: 'bg-red-50 border-red-200' },
  { icon: '🤝', label: 'Nonprofits', color: 'bg-blue-50 border-blue-200' },
  { icon: '🏘️', label: 'Centros comunitarios', color: 'bg-green-50 border-green-200' },
  { icon: '🏫', label: 'Escuelas y distritos', color: 'bg-purple-50 border-purple-200' },
  { icon: '🏛️', label: 'Consulados', color: 'bg-indigo-50 border-indigo-200' },
  { icon: '⚖️', label: 'Clínicas legales', color: 'bg-orange-50 border-orange-200' },
  { icon: '🌐', label: 'Redes de inmigrantes', color: 'bg-teal-50 border-teal-200' },
]

const STEPS = [
  {
    num: '1',
    icon: '🔗',
    title: 'Compartes tu enlace',
    desc: 'Recibes un enlace único para tu organización. Compártelo por QR, WhatsApp, Facebook o flyers impresos.',
    channels: ['QR', 'WhatsApp', 'Facebook', 'Flyers'],
  },
  {
    num: '2',
    icon: '📋',
    title: 'Las familias usan HazloAsíYa',
    desc: 'Completan guías paso a paso, checklists y formularios oficiales en español — solos, en 15 minutos.',
    channels: ['Guías', 'Checklists', 'Formularios', 'PDF oficial'],
  },
  {
    num: '3',
    icon: '📊',
    title: 'Recibes reportes de impacto',
    desc: 'Cada mes te enviamos cuántas familias ayudaste, qué trámites hicieron y el ahorro estimado para tu comunidad.',
    channels: ['Familias', 'Trámites', 'Ahorro $', 'Comunidad'],
  },
]

const TESTIMONIALS = [
  {
    quote: 'Antes tardábamos 2 horas por familia explicando el proceso de SNAP. Con HazloAsíYa lo hacen solos en 15 minutos.',
    name: 'Coordinadora de servicios sociales',
    org: 'Centro comunitario, Houston TX',
  },
  {
    quote: 'Nuestros feligreses llegan con el formulario ya llenado. Solo necesitan firma y entrega. El reporte mensual nos ayuda a mostrar impacto a nuestros donantes.',
    name: 'Diácono',
    org: 'Parroquia San José, San Antonio TX',
  },
]

const TIERS = [
  {
    name: 'Alianza Básica',
    price: 'Gratis',
    period: '',
    badge: null,
    desc: 'Para empezar a servir a tu comunidad hoy.',
    features: [
      'Enlace personalizado con tracking',
      'Flyers en PDF imprimibles (español)',
      'Reporte mensual básico de impacto',
      'Widget para tu página web',
      'Videos cortos para compartir',
    ],
    cta: 'Unirse gratis',
    highlight: false,
  },
  {
    name: 'Alianza Impacto',
    price: '$49',
    period: '/mes',
    badge: '⭐ Más popular',
    desc: 'Para organizaciones que quieren demostrar impacto real.',
    features: [
      'Todo lo de Alianza Básica',
      'Reporte avanzado (por trámite, por zona)',
      'Branding de tu organización en los PDFs',
      'Soporte prioritario',
      'Webinars conjuntos con tu comunidad',
      'Revenue share 15%',
    ],
    cta: 'Solicitar enlace comunitario',
    highlight: true,
  },
  {
    name: 'Alianza Estratégica',
    price: 'Custom',
    period: '',
    badge: null,
    desc: 'Para redes grandes, consulados y organizaciones con presencia nacional.',
    features: [
      'Todo lo de Alianza Impacto',
      'Co-branding completo',
      'Integración API con tu CRM',
      'Eventos conjuntos y capacitaciones',
      'Revenue share 20%',
      'SLA y contrato formal',
    ],
    cta: 'Hablar con nuestro equipo',
    highlight: false,
  },
]

export default function ParaOrganizacionesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Topbar />

      {/* ── Hero ── */}
      <div className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-green tracking-widest uppercase mb-6">
            🤝 ALIANZA HAZLOASÍYA · PROGRAMA COMUNITARIO
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-white leading-tight mb-5 max-w-3xl">
            Ayuda a más familias hispanas{' '}
            <span className="text-green">sin aumentar la carga de tu equipo.</span>
          </h1>

          {/* Value props — scannable list */}
          <ul className="space-y-2 mb-10">
            {[
              '✅  Gratis para organizaciones comunitarias',
              '✅  Todo en español — las familias lo hacen solas',
              '✅  Sin instalación ni capacitación técnica',
              '✅  Sin manejar casos legales ni responsabilidad',
              '✅  Reportes de impacto mensuales incluidos',
            ].map(item => (
              <li key={item} className="text-white/75 text-sm sm:text-base font-medium">
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:alianza@hazloasiya.com"
              className="inline-flex items-center gap-2 bg-green text-white font-black px-7 py-3.5 rounded-xl hover:bg-[#0A9E52] transition-colors text-base"
            >
              Solicitar enlace comunitario →
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors text-base"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </div>

      {/* ── Org types ── */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-2 text-center">
          ¿Tu organización sirve a familias hispanas?
        </h2>
        <p className="text-[#0A2540]/50 text-center text-sm mb-8">
          La Alianza está abierta a cualquier organización sin fines de lucro o de servicio comunitario.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ORG_TYPES.map(o => (
            <div
              key={o.label}
              className={`border rounded-2xl p-4 text-center ${o.color}`}
            >
              <div className="text-3xl mb-2">{o.icon}</div>
              <div className="text-xs font-bold text-[#0A2540]/75 leading-snug">{o.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works — 3 steps ── */}
      <div id="como-funciona" className="bg-[#0A2540] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2 text-center">
            Cómo funciona
          </h2>
          <p className="text-white/45 text-center text-sm mb-12">
            Tres pasos. Sin complicaciones.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-full w-full h-px bg-white/15 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 bg-white/8 border border-white/12 rounded-2xl p-6">
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green text-white text-sm font-black flex items-center justify-center shrink-0">
                      {s.num}
                    </div>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                  <p className="text-xs text-white/55 leading-relaxed mb-4">{s.desc}</p>
                  {/* Channel tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {s.channels.map(c => (
                      <span key={c} className="text-[10px] font-bold text-green bg-green/10 border border-green/20 rounded-md px-2 py-0.5">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Impact Report Preview ── */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold text-[#0EC96A] uppercase tracking-widest mb-3">
              📊 REPORTE MENSUAL DE IMPACTO
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-4 leading-tight">
              Datos reales para tus donantes y junta directiva.
            </h2>
            <p className="text-[#0A2540]/60 text-sm leading-relaxed mb-6">
              Cada mes recibes un reporte con el impacto concreto de tu organización:
              familias atendidas, trámites completados, y el ahorro estimado en honorarios
              de abogados y gestores para tu comunidad.
            </p>
            <a
              href="mailto:alianza@hazloasiya.com"
              className="inline-flex items-center gap-2 bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0D2A42] transition-colors text-sm"
            >
              Solicitar enlace comunitario →
            </a>
          </div>

          {/* Report mockup */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-bold text-[#0A2540]/35 uppercase tracking-widest">Reporte de impacto</div>
                <div className="font-black text-[#0A2540] text-sm mt-0.5">Centro Comunitario Esperanza · Abril 2026</div>
                <div className="text-[10px] text-[#0A2540]/40 mt-0.5">Houston, TX</div>
              </div>
              <div className="text-2xl">📊</div>
            </div>

            {/* Big stat */}
            <div className="bg-[#0A2540] rounded-xl p-4 mb-4 text-center">
              <div className="text-4xl font-black text-white">184</div>
              <div className="text-xs text-white/50 mt-1">familias ayudadas este mes</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { num: '247', label: 'Trámites completados' },
                { num: '$44,160', label: 'Ahorro estimado' },
                { num: '96%', label: 'Lo hicieron solos' },
              ].map(s => (
                <div key={s.label} className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-base font-black text-[#0A2540]">{s.num}</div>
                  <div className="text-[9px] text-[#0A2540]/45 mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trámites breakdown */}
            <div className="space-y-1.5">
              {[
                { label: 'SNAP / Estampillas', pct: 42, color: 'bg-green' },
                { label: 'Medicaid', pct: 27, color: 'bg-blue-500' },
                { label: 'WIC', pct: 18, color: 'bg-amber-400' },
                { label: 'ITIN / Taxes', pct: 13, color: 'bg-purple-400' },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="text-[10px] text-[#0A2540]/55 w-28 shrink-0">{t.label}</div>
                  <div className="flex-1 bg-[#E8E2D8] rounded-full h-1.5">
                    <div className={`${t.color} h-1.5 rounded-full`} style={{ width: `${t.pct}%` }} />
                  </div>
                  <div className="text-[10px] font-bold text-[#0A2540]/55 w-7 text-right">{t.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="bg-[#EDE7DA] border-y border-[#E8E2D8]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-serif text-2xl text-[#0A2540] mb-8 text-center">
            Lo que dicen nuestros partners
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
                <p className="text-[#0A2540]/75 text-base leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-[#0A2540] text-sm">{t.name}</div>
                  <div className="text-xs text-[#0A2540]/40">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tiers ── */}
      <div id="niveles" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-2 text-center">
          Niveles de la Alianza
        </h2>
        <p className="text-[#0A2540]/50 text-center text-sm mb-10">
          Empieza gratis. Escala cuando quieras.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {TIERS.map(t => (
            <div
              key={t.name}
              className={`rounded-2xl p-6 flex flex-col ${
                t.highlight
                  ? 'bg-[#0A2540] text-white border-2 border-[#0EC96A]'
                  : 'bg-white border border-[#E8E2D8] text-[#0A2540]'
              }`}
            >
              {t.badge && (
                <div className="text-xs font-black text-[#0EC96A] uppercase tracking-widest mb-3">
                  {t.badge}
                </div>
              )}
              <div className={`text-sm font-bold mb-1 ${t.highlight ? 'text-white/55' : 'text-[#0A2540]/45'}`}>
                {t.name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className={`text-4xl font-black ${t.highlight ? 'text-white' : 'text-[#0A2540]'}`}>
                  {t.price}
                </span>
                {t.period && (
                  <span className={`text-sm mb-1 ${t.highlight ? 'text-white/45' : 'text-[#0A2540]/35'}`}>
                    {t.period}
                  </span>
                )}
              </div>
              <p className={`text-xs mb-5 leading-relaxed ${t.highlight ? 'text-white/50' : 'text-[#0A2540]/45'}`}>
                {t.desc}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-[#0EC96A] mt-0.5 shrink-0">✓</span>
                    <span className={t.highlight ? 'text-white/75' : 'text-[#0A2540]/65'}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:alianza@hazloasiya.com"
                className={`block text-center font-black text-sm px-5 py-3 rounded-xl transition-colors ${
                  t.highlight
                    ? 'bg-[#0EC96A] text-[#0A2540] hover:bg-[#0EC96A]/90'
                    : 'bg-[#0A2540] text-white hover:bg-[#0D2A42]'
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#0A2540]/35 mt-6">
          ¿Tienes preguntas? Escríbenos a{' '}
          <a href="mailto:alianza@hazloasiya.com" className="text-[#0EC96A] underline">
            alianza@hazloasiya.com
          </a>
        </p>
      </div>

      {/* ── Video Explicativo ── */}
      <VideoExplicativo
        ctaHref="mailto:alianza@hazloasiya.com"
        ctaLabel="Solicitar enlace comunitario →"
        showSteps={false}
        variant="white"
      />

      {/* ── FAQ ── */}
      <div className="bg-[#EDE7DA] border-t border-[#E8E2D8]">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="font-serif text-2xl text-[#0A2540] mb-8 text-center">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Cuánto cuesta unirse a la Alianza?',
                a: 'La Alianza Básica es completamente gratuita. Recibes enlace personalizado, flyers, videos y reporte mensual sin pagar nada. Los niveles Impacto y Estratégica tienen costo mensual y ofrecen más herramientas y revenue share más alto.',
              },
              {
                q: '¿Cómo funciona el revenue share?',
                a: 'Cuando una familia entra a HazloAsíYa a través de tu enlace personalizado y paga por un trámite ($29 o $79/año), tu organización recibe entre el 10% y el 20% del pago. Es ingreso adicional sin ningún esfuerzo extra de tu parte.',
              },
              {
                q: '¿Las familias necesitan crear una cuenta?',
                a: 'No es obligatorio. Pueden completar el cuestionario sin registrarse. Si quieren guardar su progreso o descargar el PDF, sí necesitan un correo electrónico.',
              },
              {
                q: '¿HazloAsíYa es una firma de abogados?',
                a: 'No. Somos un servicio de preparación de documentos. Ayudamos a llenar formularios oficiales, pero no damos asesoría legal. Para casos complejos, recomendamos consultar con un abogado certificado.',
              },
              {
                q: '¿Puedo usar HazloAsíYa en eventos comunitarios?',
                a: 'Sí. Muchas organizaciones usan HazloAsíYa en ferias de salud, jornadas de beneficios y eventos parroquiales. Solo necesitas una tableta o computadora con internet.',
              },
            ].map(item => (
              <div key={item.q} className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
                <h3 className="font-black text-[#0A2540] text-sm mb-2">{item.q}</h3>
                <p className="text-sm text-[#0A2540]/55 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="bg-[#0A6640] text-white">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">
            ¿Lista tu organización para unirse?
          </h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed max-w-xl mx-auto">
            En menos de 24 horas te enviamos tu enlace personalizado y todos los materiales.
            Sin costo. Sin contrato. Sin complicaciones.
          </p>
          <a
            href="mailto:alianza@hazloasiya.com"
            className="inline-flex items-center gap-2 bg-white text-[#0A6640] font-black px-8 py-4 rounded-xl hover:bg-green-50 transition-colors text-base"
          >
            Unirse gratis →
          </a>
          <p className="text-white/35 text-xs mt-4">
            alianza@hazloasiya.com · Respuesta en menos de 24 horas
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#E8E2D8] bg-[#EDE7DA]">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[#0A2540]/40 max-w-lg mx-auto leading-relaxed">
            HazloAsíYa.com es un servicio de preparación de documentos — no es una firma de abogados
            y no provee asesoría legal.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-[#0A2540]/40">
            <Link href={withTrailingSlash('/terms')} className="hover:text-[#0A2540]/70">Términos</Link>
            <Link href={withTrailingSlash('/privacy')} className="hover:text-[#0A2540]/70">Privacidad</Link>
            <Link href={withTrailingSlash('/precios')} className="hover:text-[#0A2540]/70">Precios individuales</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
