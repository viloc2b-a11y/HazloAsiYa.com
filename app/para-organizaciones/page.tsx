import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Para organizaciones y nonprofits | HazloAsíYa',
  description:
    'Ofrece HazloAsíYa a tu comunidad. Planes para iglesias, consulados, clínicas comunitarias y nonprofits que ayudan a familias hispanas con trámites de gobierno en español.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}` },
  openGraph: {
    title: 'Para organizaciones | HazloAsíYa',
    description: 'Planes institucionales para iglesias, consulados y nonprofits.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/para-organizaciones')}`,
  },
}

const ORG_TYPES = [
  { icon: '⛪', label: 'Iglesias y parroquias', desc: 'Ayuda a tus feligreses a acceder a beneficios que les corresponden.' },
  { icon: '🏛️', label: 'Consulados', desc: 'Apoya a tus connacionales con ITIN, DACA y trámites de empleo.' },
  { icon: '🏥', label: 'Clínicas comunitarias', desc: 'Conecta a tus pacientes con Medicaid y WIC antes de su primera cita.' },
  { icon: '🤝', label: 'Nonprofits y centros comunitarios', desc: 'Multiplica el impacto de tu equipo sin contratar más personal.' },
  { icon: '🏫', label: 'Distritos escolares', desc: 'Ayuda a familias a inscribir a sus hijos y acceder a apoyos de nutrición.' },
  { icon: '⚖️', label: 'Clínicas legales', desc: 'Prepara borradores de DACA, EAD e ITIN para tus clientes.' },
]

const PLANS = [
  {
    name: 'Básico',
    price: '$99',
    period: '/mes',
    users: 'Hasta 10 usuarios',
    features: [
      'Acceso a los 9 trámites',
      'PDF ilimitados por usuario',
      'Soporte por correo',
      'Panel de administrador',
    ],
    cta: 'Empezar gratis 14 días',
    highlight: false,
  },
  {
    name: 'Comunidad',
    price: '$249',
    period: '/mes',
    users: 'Hasta 50 usuarios',
    features: [
      'Todo lo del plan Básico',
      'Onboarding en vivo (Zoom)',
      'Materiales de difusión en español',
      'Reporte mensual de uso',
      'Soporte prioritario',
    ],
    cta: 'Solicitar demo',
    highlight: true,
  },
  {
    name: 'Institucional',
    price: 'A medida',
    period: '',
    users: 'Usuarios ilimitados',
    features: [
      'Todo lo del plan Comunidad',
      'Integración con tu CRM o base de datos',
      'Capacitación para tu equipo',
      'SLA y contrato formal',
      'Factura fiscal disponible',
    ],
    cta: 'Contactar ventas',
    highlight: false,
  },
]

const TESTIMONIALS = [
  {
    quote: 'Antes tardábamos 2 horas por familia explicando el proceso de SNAP. Con HazloAsíYa lo hacen solos en 15 minutos.',
    name: 'Coordinadora de servicios sociales',
    org: 'Centro comunitario, Houston TX',
  },
  {
    quote: 'Nuestros feligreses llegan con el formulario ya llenado. Solo necesitan firma y entrega.',
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
            🤝 PARA ORGANIZACIONES
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white leading-tight mb-5 max-w-3xl">
            Ayuda a más familias{' '}
            <span className="text-green">sin contratar más personal.</span>
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Ofrece HazloAsíYa a tu comunidad. Iglesias, consulados, clínicas y nonprofits usan nuestra
            plataforma para que sus familias preparen trámites de gobierno en español — solos, en minutos,
            desde cualquier dispositivo.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#planes"
              className="inline-flex items-center gap-2 bg-green text-white font-black px-7 py-3.5 rounded-xl hover:bg-green-dk transition-colors text-base"
            >
              Ver planes →
            </a>
            <a
              href="mailto:organizaciones@hazloasiya.com"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors text-base"
            >
              Hablar con ventas
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/15">
            {[
              { num: '68M', label: 'hispanos en EE.UU.' },
              { num: '9', label: 'trámites disponibles' },
              { num: '4', label: 'estados: TX · CA · FL · NY' },
              { num: '$0', label: 'para empezar el cuestionario' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white">{s.num}</div>
                <div className="text-xs text-white/45 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ¿Quién usa HazloAsíYa? ── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-2 text-center">
          ¿Qué tipo de organización eres?
        </h2>
        <p className="text-[#0A2540]/55 text-center mb-10 text-sm">
          HazloAsíYa se adapta a cualquier organización que sirve a familias hispanas.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORG_TYPES.map(o => (
            <div key={o.label} className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <div className="text-3xl mb-3">{o.icon}</div>
              <h3 className="font-black text-[#0A2540] text-base mb-1">{o.label}</h3>
              <p className="text-sm text-[#0A2540]/55 leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cómo funciona ── */}
      <div className="bg-[#0A2540] text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2 text-center">
            Cómo funciona para tu organización
          </h2>
          <p className="text-white/55 text-center mb-10 text-sm">
            Tres pasos para empezar a servir a tu comunidad.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '📋', title: 'Crea tu cuenta institucional', desc: 'Regístrate con el correo de tu organización. En 5 minutos tienes acceso al panel de administrador.' },
              { step: '2', icon: '👥', title: 'Invita a tus familias', desc: 'Comparte un enlace único o código QR. Cada familia crea su perfil y empieza su trámite de forma independiente.' },
              { step: '3', icon: '📊', title: 'Monitorea el progreso', desc: 'Ve cuántas familias completaron su trámite, cuáles necesitan ayuda, y descarga reportes de impacto.' },
            ].map(s => (
              <div key={s.step} className="bg-white/8 rounded-2xl p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs font-bold text-white/35 uppercase tracking-widest mb-1">Paso {s.step}</div>
                <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonios ── */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-10 text-center">
          Lo que dicen nuestros socios
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
              <p className="text-[#0A2540]/80 text-base leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="font-bold text-[#0A2540] text-sm">{t.name}</div>
                <div className="text-xs text-[#0A2540]/45">{t.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Planes ── */}
      <div id="planes" className="bg-cream-2">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0A2540] mb-2 text-center">
            Planes para organizaciones
          </h2>
          <p className="text-[#0A2540]/55 text-center mb-10 text-sm">
            Sin contrato a largo plazo. Cancela cuando quieras.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map(p => (
              <div
                key={p.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  p.highlight
                    ? 'bg-[#0A2540] text-white border-2 border-[#0EC96A]'
                    : 'bg-white border border-[#E8E2D8] text-[#0A2540]'
                }`}
              >
                {p.highlight && (
                  <div className="text-xs font-black text-[#0EC96A] uppercase tracking-widest mb-3">
                    ⭐ Más popular
                  </div>
                )}
                <div className="mb-4">
                  <div className={`text-sm font-bold mb-1 ${p.highlight ? 'text-white/60' : 'text-[#0A2540]/50'}`}>
                    {p.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black ${p.highlight ? 'text-white' : 'text-[#0A2540]'}`}>
                      {p.price}
                    </span>
                    {p.period && (
                      <span className={`text-sm mb-1 ${p.highlight ? 'text-white/50' : 'text-[#0A2540]/40'}`}>
                        {p.period}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-1 ${p.highlight ? 'text-white/50' : 'text-[#0A2540]/40'}`}>
                    {p.users}
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-[#0EC96A] mt-0.5 shrink-0">✓</span>
                      <span className={p.highlight ? 'text-white/80' : 'text-[#0A2540]/70'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:organizaciones@hazloasiya.com"
                  className={`block text-center font-black text-sm px-5 py-3 rounded-xl transition-colors ${
                    p.highlight
                      ? 'bg-[#0EC96A] text-[#0A2540] hover:bg-[#0EC96A]/90'
                      : 'bg-[#0A2540] text-white hover:bg-[#0D2A42]'
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#0A2540]/35 mt-6">
            ¿Necesitas factura fiscal o contrato formal? Escríbenos a{' '}
            <a href="mailto:organizaciones@hazloasiya.com" className="text-green underline">
              organizaciones@hazloasiya.com
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
              q: '¿Las familias necesitan crear una cuenta?',
              a: 'No es obligatorio. Pueden completar el cuestionario sin registrarse. Si quieren guardar su progreso o descargar el PDF, sí necesitan un correo electrónico.',
            },
            {
              q: '¿HazloAsíYa es una firma de abogados?',
              a: 'No. Somos un servicio de preparación de documentos. Ayudamos a llenar formularios oficiales, pero no damos asesoría legal. Para casos complejos, recomendamos consultar con un abogado de inmigración certificado.',
            },
            {
              q: '¿Puedo usar HazloAsíYa en mis eventos comunitarios?',
              a: 'Sí. Muchas organizaciones usan HazloAsíYa en ferias de salud, jornadas de beneficios y eventos parroquiales. Solo necesitas una tableta o computadora con internet.',
            },
            {
              q: '¿En qué estados está disponible?',
              a: 'Actualmente en Texas, California, Florida y Nueva York — los 4 estados con mayor población hispana en EE.UU. Estamos expandiendo a Illinois próximamente.',
            },
          ].map(item => (
            <div key={item.q} className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h3 className="font-black text-[#0A2540] text-sm mb-2">{item.q}</h3>
              <p className="text-sm text-[#0A2540]/60 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA final ── */}
      <div className="bg-[#0A6640] text-white">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">
            ¿Listo para servir a más familias?
          </h2>
          <p className="text-white/65 mb-8 text-sm leading-relaxed max-w-xl mx-auto">
            Escríbenos y en menos de 24 horas te contactamos para una demo personalizada sin costo.
          </p>
          <a
            href="mailto:organizaciones@hazloasiya.com"
            className="inline-flex items-center gap-2 bg-white text-[#0A6640] font-black px-8 py-4 rounded-xl hover:bg-green-50 transition-colors text-base"
          >
            Solicitar demo gratuita →
          </a>
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
