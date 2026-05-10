import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Alianza HazloAsíYa — Partners por la Comunidad | HazloAsíYa',
  description:
    'Únete gratis a la Alianza HazloAsíYa. Iglesias, consulados, clínicas y nonprofits reciben enlace personalizado, flyers, reportes de impacto e ingreso adicional opcional. Ayudamos a tu comunidad sin costo para ti.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}` },
  openGraph: {
    title: 'Alianza HazloAsíYa — Partners por la Comunidad',
    description: 'Únete gratis. Tú demuestras impacto real. Nosotros hacemos el trabajo.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}`,
  },
}

const ORG_TYPES = [
  { icon: '⛪', label: 'Iglesias y parroquias' },
  { icon: '🏛️', label: 'Consulados' },
  { icon: '🏥', label: 'Clínicas FQHC' },
  { icon: '🤝', label: 'Nonprofits' },
  { icon: '🏫', label: 'Escuelas y distritos' },
  { icon: '⚖️', label: 'Clínicas legales' },
  { icon: '🏘️', label: 'Centros comunitarios' },
  { icon: '🌐', label: 'Redes de inmigrantes' },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: '🤝',
    title: 'Te unes gratis',
    desc: 'Registra tu organización en minutos. Sin costo, sin contrato, sin tarjeta.',
  },
  {
    step: '2',
    icon: '🔗',
    title: 'Recibes tus materiales',
    desc: 'Enlace personalizado con tracking, flyers en PDF imprimibles, videos cortos y un widget para tu página web.',
  },
  {
    step: '3',
    icon: '👨‍👩‍👧',
    title: 'Tus familias tramitan',
    desc: 'Entran por tu enlace, completan el trámite en español y pagan individualmente ($29 o $79/año). Tú no cobras nada.',
  },
  {
    step: '4',
    icon: '📊',
    title: 'Recibes tu reporte de impacto',
    desc: 'Cada mes te enviamos cuántas familias atendiste, qué trámites hicieron, y el ahorro estimado para tu comunidad.',
  },
]

const BENEFITS = [
  { icon: '💸', title: 'Cero costo', desc: 'No afecta tu presupuesto. La alianza básica es 100% gratuita.' },
  { icon: '📈', title: 'Demuestra impacto', desc: 'Reportes listos para presentar a donantes, junta directiva y fundaciones.' },
  { icon: '🇪🇸', title: 'Todo en español', desc: 'Herramienta confiable que tus familias pueden usar solas, sin ayuda.' },
  { icon: '📋', title: 'Contenido listo', desc: 'Flyers, guiones para el púlpito, posts para redes. Todo diseñado para ti.' },
  { icon: '💰', title: 'Ingreso adicional (opcional)', desc: '10–20% del revenue generado por tus referencias. Muchos nonprofits lo aceptan como ingreso sin esfuerzo.' },
  { icon: '🏅', title: 'Reconocimiento público', desc: 'Tu logo en nuestra página de partners y mención en redes sociales.' },
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
    cta: 'Unirme gratis',
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
    cta: 'Solicitar acceso',
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
    cta: 'Hablar con nosotros',
    highlight: false,
  },
]

const IMPACT_STATS = [
  { num: '68M', label: 'hispanos en EE.UU.' },
  { num: '1 de 3', label: 'no sabe que califica para beneficios' },
  { num: '$18,450', label: 'ahorro promedio por comunidad al mes' },
  { num: '15 min', label: 'para completar un trámite con HazloAsíYa' },
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

export default function ParaOrganizacionesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Topbar />

      {/* ── Hero ── */}
      <div className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-green tracking-widest uppercase mb-5">
            🤝 ALIANZA HAZLOASÍYA
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white leading-tight mb-4 max-w-3xl">
            Ayudamos a tu comunidad{' '}
            <span className="text-green">sin costo para ti.</span>
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-4">
            Tú demuestras impacto real. Nosotros hacemos el trabajo.
          </p>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mb-10">
            Únete gratis a la red de iglesias, consulados, clínicas y nonprofits que ya usan
            HazloAsíYa para que sus familias preparen trámites de gobierno en español — solos,
            en minutos, desde cualquier dispositivo.
          </p>
          <div className="flex flex-wrap gap-4 mb-14">
            <a
              href="mailto:alianza@hazloasiya.com"
              className="inline-flex items-center gap-2 bg-green text-white font-black px-7 py-3.5 rounded-xl hover:bg-[#0A9E52] transition-colors text-base"
            >
              Unirme gratis →
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors text-base"
            >
              Ver cómo funciona
            </a>
          </div>

          {/* Impact stats */}
          <div className="flex flex-wrap gap-10 pt-10 border-t border-white/15">
            {IMPACT_STATS.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="text-xs text-white/40 mt-0.5 max-w-[120px] leading-snug">{s.label}</div>
              </div>
            ))}
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
            <div key={o.label} className="bg-white border border-[#E8E2D8] rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{o.icon}</div>
              <div className="text-xs font-bold text-[#0A2540]/70">{o.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div id="como-funciona" className="bg-[#0A2540] text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2 text-center">
            Cómo funciona la Alianza
          </h2>
          <p className="text-white/50 text-center text-sm mb-10">
            Cuatro pasos. Sin complicaciones.
          </p>
          <div className="grid sm:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(s => (
              <div key={s.step} className="bg-white/8 rounded-2xl p-5">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Paso {s.step}</div>
                <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Materials preview */}
          <div className="mt-10 bg-white/6 border border-white/12 rounded-2xl p-6">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
              📦 Lo que recibes al unirte
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '🔗', label: 'Enlace personalizado', desc: 'ej. hazloasiya.com/ref/iglesia-bethel-houston — con tracking de familias atendidas' },
                { icon: '📄', label: 'Flyers imprimibles', desc: 'PDFs en español listos para imprimir y distribuir en tu comunidad' },
                { icon: '📱', label: 'Videos cortos', desc: 'Para compartir en WhatsApp, Instagram y anunciar desde el púlpito' },
                { icon: '🖥️', label: 'Widget para tu web', desc: 'Botón o banner que puedes poner en tu página web en 2 minutos' },
              ].map(m => (
                <div key={m.label} className="flex gap-3">
                  <span className="text-xl shrink-0">{m.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{m.label}</div>
                    <div className="text-xs text-white/45 leading-relaxed">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Benefits ── */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-2 text-center">
          ¿Por qué unirse a la Alianza?
        </h2>
        <p className="text-[#0A2540]/50 text-center text-sm mb-10">
          Beneficios reales para tu organización y para las familias que sirves.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-black text-[#0A2540] text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-[#0A2540]/55 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Impact report preview ── */}
      <div className="bg-cream-2 border-y border-[#E8E2D8]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-bold text-[#0EC96A] uppercase tracking-widest mb-3">
                📊 REPORTE MENSUAL DE IMPACTO
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-4 leading-tight">
                Datos reales para tus donantes y junta directiva.
              </h2>
              <p className="text-[#0A2540]/60 text-sm leading-relaxed mb-6">
                Cada mes recibes un reporte con el impacto concreto de tu organización: familias
                atendidas, trámites completados, y el ahorro estimado en honorarios de abogados y
                gestores para tu comunidad.
              </p>
              <a
                href="mailto:alianza@hazloasiya.com"
                className="inline-flex items-center gap-2 bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0D2A42] transition-colors text-sm"
              >
                Ver ejemplo de reporte →
              </a>
            </div>
            {/* Report mockup */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-bold text-[#0A2540]/40 uppercase tracking-widest">Reporte de impacto</div>
                  <div className="font-black text-[#0A2540] text-sm mt-0.5">Parroquia San José · Abril 2026</div>
                </div>
                <div className="text-2xl">📊</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { num: '47', label: 'Familias atendidas' },
                  { num: '63', label: 'Trámites completados' },
                  { num: '$8,460', label: 'Ahorro estimado' },
                  { num: '94%', label: 'Completaron solos' },
                ].map(s => (
                  <div key={s.label} className="bg-cream rounded-xl p-3">
                    <div className="text-xl font-black text-[#0A2540]">{s.num}</div>
                    <div className="text-[10px] text-[#0A2540]/45 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-[#0A2540]/30 text-center">
                Trámites más solicitados: SNAP (41%) · Medicaid (28%) · WIC (19%) · ITIN (12%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
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

      {/* ── Tiers ── */}
      <div id="niveles" className="bg-cream-2 border-t border-[#E8E2D8]">
        <div className="max-w-5xl mx-auto px-6 py-16">
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
                <div className="mb-1">
                  <div className={`text-sm font-bold ${t.highlight ? 'text-white/55' : 'text-[#0A2540]/45'}`}>
                    {t.name}
                  </div>
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
      </div>

      {/* ── FAQ ── */}
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
            Unirme a la Alianza gratis →
          </a>
          <p className="text-white/35 text-xs mt-4">
            alianza@hazloasiya.com · Respuesta en menos de 24 horas
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#E8E2D8] bg-cream-2">
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
