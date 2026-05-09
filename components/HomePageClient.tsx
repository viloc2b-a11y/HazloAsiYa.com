'use client'
import { useEffect, useState } from 'react'
import Topbar from '@/components/Topbar'
import FunnelCard from '@/components/FunnelCard'
import { FUNNELS, FUNNEL_ORDER } from '@/data/funnels'
import Link from 'next/link'
import { getStoredUser } from '@/lib/static-backend'

const LogoMark = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="url(#hm)"/>
    <path d="M13 34 L24 14 L35 34" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M24 14 L24 36" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <defs>
      <linearGradient id="hm" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EC96A"/>
        <stop offset="100%" stopColor="#087A3F"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function HomePageClient() {
  const [userProfile, setUserProfile] = useState<{ email: string; name?: string; plan?: string } | null>(null)

  useEffect(() => {
    setUserProfile(getStoredUser())
  }, [])

  return (
    <div className="min-h-screen">
      <Topbar user={userProfile}/>

      {/* HERO */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,158,82,0.15),transparent_60%)]"/>
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">

          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"/>
            ✦ Hazlo así · Hazlo ya · Hazlo sin errores
          </div>

          <div className="flex justify-center mb-6">
            <LogoMark size={64}/>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Haz tu trámite bien desde la primera vez — sin miedo, sin errores, sin depender de nadie.
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-3 leading-relaxed">
            Formularios oficiales en español, listos para entregar. Sin abogados. Sin complicaciones. Sin que te rechacen.
          </p>
          <p className="text-green/80 text-sm font-semibold mb-10">
            ⚡ Completa tu trámite en menos de 15 minutos
          </p>

          {/* Proof pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              '✅ Qué tienes · ❌ Qué te falta · 📋 Cómo hacerlo',
              '📝 Instrucciones exactas + ejemplos',
              '🤝 Ayuda local en español',
              '⚡ Resultado en 5 minutos',
            ].map(p => (
              <span key={p} className="bg-white/8 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70">
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/snap" className="btn-primary text-base px-8 py-3.5">
              Empieza ahora →
            </Link>
            <Link href="#tramites" className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl px-8 py-3.5 transition-colors">
              Ver los 16 trámites
            </Link>
            <Link href="/pdf/" className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl px-8 py-3.5 transition-colors">
              Formularios PDF →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mt-14 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {[
              ['16', 'Trámites disponibles'],
              ['441K', 'Familias atendidas'],
              ['100%', 'En español'],
              ['$0', 'Para empezar'],
            ].map(([num, label]) => (
              <div key={label} className="py-5 px-4 text-center border-r border-white/10 last:border-0">
                <div className="font-serif text-3xl text-gold mb-1">{num}</div>
                <div className="text-xs text-white/40 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Trust band */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              ['🔒', 'Privado y seguro'],
              ['📍', 'Basados en Houston, TX'],
              ['🇺🇸', 'Formularios oficiales reales'],
              ['👨‍👩‍👧', 'No compartimos tu info'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center justify-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white/70">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING STRIP */}
      <div className="bg-cream-2 border-b border-cream py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green font-bold text-base">✓</span>
            <span><strong>Gratis siempre:</strong> cuestionario, elegibilidad, documentos</span>
          </div>
          <div className="w-px h-4 bg-gray-300 hidden sm:block"/>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gold font-bold text-base">$</span>
            <span><strong>$29 por trámite:</strong> formulario oficial pre-llenado + instrucciones</span>
          </div>
          <div className="w-px h-4 bg-gray-300 hidden sm:block"/>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gold font-bold text-base">★</span>
            <span><strong>$79/año:</strong> todos los trámites ilimitados</span>
          </div>
        </div>
      </div>

      {/* FUNNELS GRID */}
      <section id="tramites" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-widest uppercase text-green mb-2">Resuelve tu trámite</div>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy">¿Qué necesitas completar hoy?</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Elige tu trámite, responde 5 preguntas y recibe exactamente qué hacer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FUNNEL_ORDER.map(id => (
            <FunnelCard key={id} id={id} {...FUNNELS[id]}/>
          ))}
        </div>

        <section className="mt-16 max-w-4xl mx-auto text-left" aria-labelledby="home-preguntas-buscan">
          <h2 id="home-preguntas-buscan" className="font-serif text-2xl text-navy mb-4">
            Preguntas que la gente busca
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <Link href="/guias/documentos-para-snap/" className="text-green font-semibold hover:underline">
                ¿Qué documentos necesito para SNAP?
              </Link>
            </li>
            <li>
              <Link href="/itin/" className="text-green font-semibold hover:underline">
                ¿Cómo sacar ITIN por primera vez?
              </Link>
            </li>
            <li>
              <Link href="/medicaid/texas/" className="text-green font-semibold hover:underline">
                ¿Cómo aplicar a Medicaid en Texas?
              </Link>
            </li>
            <li>
              <Link href="/escuela/" className="text-green font-semibold hover:underline">
                ¿Qué piden para inscribir a un niño en la escuela pública?
              </Link>
            </li>
            <li>
              <Link href="/wic/" className="text-green font-semibold hover:underline">
                ¿Cómo saber si califico para WIC?
              </Link>
            </li>
            <li>
              <Link href="/daca/" className="text-green font-semibold hover:underline">
                ¿Qué es DACA y cómo aplico?
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="home-guias-recientes">
          <h2 id="home-guias-recientes" className="font-serif text-2xl text-navy mb-6 text-center">
            Guías recientes
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              ['Documentos para SNAP en Texas', '/guias/documentos-para-snap/'],
              ['Cómo solicitar Medicaid en Texas', '/medicaid/texas/'],
              ['Qué es ITIN y cómo sacarlo', '/itin/'],
              ['Inscripción escolar: documentos y pasos', '/escuela/'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block rounded-2xl border border-navy/10 bg-white p-5 shadow-sm hover:border-green/40 hover:shadow-md transition text-navy font-medium"
              >
                {label} →
              </Link>
            ))}
          </div>
          <p className="text-center mt-6">
            <Link href="/guias/" className="text-green font-semibold hover:underline">
              Ver todas las guías →
            </Link>
          </p>
        </section>

        <section
          className="mt-14 rounded-2xl border border-green/25 bg-emerald-50/80 px-6 py-8 max-w-4xl mx-auto"
          aria-labelledby="home-estados"
        >
          <h2 id="home-estados" className="font-serif text-xl text-navy mb-1">
            Disponible en 4 estados
          </h2>
          <p className="text-gray-600 text-sm mb-5">
            Formularios oficiales pre-llenados para SNAP, Medicaid y WIC — en tu estado.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { flag: '🤠', label: 'Texas',      snap: '/snap/texas/',      medicaid: '/medicaid/texas/',      wic: '/wic/texas/',      extra: '/itin/houston/', extraLabel: 'ITIN Houston' },
              { flag: '🌴', label: 'California', snap: '/snap/california/', medicaid: '/medicaid/california/', wic: '/wic/california/',  extra: null, extraLabel: null },
              { flag: '☀️', label: 'Florida',    snap: '/snap/florida/',    medicaid: '/medicaid/florida/',    wic: '/wic/florida/',    extra: null, extraLabel: null },
              { flag: '🗽', label: 'Nueva York', snap: '/snap/new-york/',   medicaid: '/medicaid/new-york/',   wic: '/wic/new-york/',   extra: null, extraLabel: null },
            ].map(st => (
              <div key={st.label} className="bg-white rounded-xl p-4 border border-green/15">
                <div className="font-semibold text-navy text-sm mb-2.5">{st.flag} {st.label}</div>
                <div className="flex flex-wrap gap-3">
                  <Link href={st.snap} className="text-xs font-semibold text-green hover:underline">🛒 SNAP</Link>
                  <Link href={st.medicaid} className="text-xs font-semibold text-green hover:underline">🏥 Medicaid</Link>
                  <Link href={st.wic} className="text-xs font-semibold text-green hover:underline">🤱 WIC</Link>
                  {st.extra && <Link href={st.extra} className="text-xs font-semibold text-green hover:underline">{st.extraLabel}</Link>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest uppercase text-green/70 mb-2">Cómo funciona</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">Hazlo así — paso a paso, sin errores</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['1','Elige el trámite — gratis','El cuestionario siempre es gratuito. Sin registro.'],
              ['2','Responde preguntas simples — gratis','Sin tecnicismos. En español. 5 minutos.'],
              ['3','Ve tu resultado — gratis','Qué tienes, qué te falta, los primeros pasos.'],
              ['4','Recibe tu formulario oficial pre-llenado — $29','El formulario oficial de tu estado ya completado con tus datos. Listo para imprimir o subir al portal de la agencia.'],
              ['5','O acceso anual familiar — $79','Todos los trámites ilimitados durante un año. Para toda la familia.'],
              ['6','Conectamos con ayuda local — gratis','Especialistas en tu área que hablan español.'],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-light to-green-dark flex items-center justify-center text-white font-bold text-lg mb-4">
                  {n}
                </div>
                <h4 className="text-white font-semibold mb-2">{t}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          {/* Differentiator */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <div className="font-serif text-xl text-white mb-1">No más información confusa</div>
              <div className="text-sm text-white/40">
                A diferencia de otros sitios, aquí no solo encuentras opciones. Te mostramos exactamente qué hacer, cómo hacerlo y qué evitar.
              </div>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="p-6 border-r border-white/10">
                <div className="text-[11px] font-bold tracking-widest uppercase text-white/25 mb-4">FindHelp · USAHello · BenefitsCheckUp</div>
                {['"Encuentra ayuda"','Lee más información','Te llevan a otra web','Sin instrucciones concretas'].map(t => (
                  <div key={t} className="flex items-center gap-3 text-sm text-white/35 mb-3">
                    <span className="text-red-400 font-bold shrink-0">✗</span>{t}
                  </div>
                ))}
              </div>
              <div className="p-6">
                <div className="text-[11px] font-bold tracking-widest uppercase text-green/70 mb-4">HazloAsíYa</div>
                {['"Hazlo así: haz esto ahora"','Instrucciones exactas paso a paso','Todo en un solo lugar','Pasos concretos + ejemplos llenados'].map(t => (
                  <div key={t} className="flex items-center gap-3 text-sm text-white/80 mb-3">
                    <span className="text-green font-bold shrink-0">✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-dark to-green px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-white font-semibold">Te decimos exactamente qué hacer y cómo hacerlo — sin errores</div>
              <Link href="/snap" className="bg-navy text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-navy-2 transition-colors">
                Resolver mi trámite →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-cream-2 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest uppercase text-green mb-2">Historias reales</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy">Familias que lo lograron</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Personas reales, trámites reales, resultados reales. Sin abogados. Sin vueltas. En español.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                nombre: 'Rosa M.',
                ciudad: 'Houston, TX',
                rol: 'Madre de familia',
                tramite: 'SNAP',
                emoji: '🛒',
                texto: 'Tenía miedo de que mi estatus me impidiera aplicar. Aquí supe exactamente qué documentos llevar y cómo completar la solicitud. Me aprobaron en 10 días. Por fin puedo alimentar a mis hijos sin ese peso encima.',
              },
              {
                nombre: 'Miguel Á. T.',
                ciudad: 'San Antonio, TX',
                rol: 'Trabajador de construcción',
                tramite: 'Texas ID',
                emoji: '🪪',
                texto: 'Necesitaba mi Texas ID para trabajar y no sabía ni por dónde empezar. La guía me dijo paso a paso qué llevar al DPS. Fui, me atendieron a la primera y salí con mi licencia. Sin vueltas, sin perder el día.',
              },
              {
                nombre: 'Carmen D.',
                ciudad: 'Dallas, TX',
                rol: 'Dueña de negocio',
                tramite: 'Taxes',
                emoji: '💰',
                texto: 'Siempre pagaba preparador de taxes. Este año lo hice sola con HazloAsíYa: me explicó qué llenar, cómo y dónde enviar. Ahorré $200 y mi declaración salió sin un solo error. Se lo recomiendo a todos.',
              },
              {
                nombre: 'Jesús R.',
                ciudad: 'El Paso, TX',
                rol: 'Padre soltero',
                tramite: 'IEP Educación Especial',
                emoji: '📋',
                texto: 'Mi hijo necesita servicios especiales en la escuela y el proceso IEP me parecía imposible de entender. La guía me explicó mis derechos y me dio el formato listo. La escuela lo aceptó sin problemas. Mi hijo por fin tiene el apoyo que merece.',
              },
              {
                nombre: 'Lucía H.',
                ciudad: 'McAllen, TX',
                rol: 'Estudiante universitaria',
                tramite: 'DACA',
                emoji: '📄',
                texto: 'Renovar mi DACA me daba pánico — un error y todo se complica. HazloAsíYa me mostró los formularios I-821D e I-765 ya preparados y qué documentos adjuntar. Lo envié sin miedo y ya tengo mi aprobación.',
              },
              {
                nombre: 'Roberto S.',
                ciudad: 'Austin, TX',
                rol: 'Recién llegado a Texas',
                tramite: 'ITIN',
                emoji: '🔢',
                texto: 'No hablo bien inglés y los trámites me parecían un laberinto. Aquí todo está en español, claro y directo. Saqué mi ITIN en dos semanas y ya pude abrir mi cuenta bancaria. No sabía que fuera tan posible.',
              },
              {
                nombre: 'Ana Patricia V.',
                ciudad: 'Corpus Christi, TX',
                rol: 'Madre trabajadora',
                tramite: 'WIC',
                emoji: '🤱',
                texto: 'WIC siempre me pareció complicado — nunca sabía si calificaba ni qué llevar. Con HazloAsíYa supe todo eso en minutos. Me aprobaron y ya tengo ayuda para la leche y la comida de mi bebé.',
              },
              {
                nombre: 'Carlos J.',
                ciudad: 'Laredo, TX',
                rol: 'Buscando empleo',
                tramite: 'Desempleo TWC',
                emoji: '💼',
                texto: 'Perdí mi trabajo y no tenía idea cómo aplicar al desempleo en Texas. La guía me dijo exactamente qué responder en la solicitud del TWC. Me aprobaron en la primera semana. Sin esto hubiera esperado meses sin saber qué hacer.',
              },
              {
                nombre: 'Fernando L.',
                ciudad: 'Lubbock, TX',
                rol: 'Trabajador independiente',
                tramite: 'Cuenta bancaria',
                emoji: '🏦',
                texto: 'Me rechazaban en los bancos por no tener SSN. La guía me dijo qué bancos aceptan ITIN o matrícula consular y qué decir en la sucursal. Abrí mi cuenta en 20 minutos. Por fin tengo acceso a servicios que pensé que no eran para mí.',
              },
            ].map(({ nombre, ciudad, rol, tramite, emoji, texto }) => (
              <div key={nombre} className="bg-white rounded-2xl border border-cream p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {nombre.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-navy text-sm">{nombre}</div>
                    <div className="text-xs text-gray-400">{ciudad} · {rol}</div>
                  </div>
                  <span className="ml-auto text-xl">{emoji}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">&quot;{texto}&quot;</p>
                <div className="text-xs font-semibold text-green border-t border-cream pt-3">
                  Trámite: {tramite}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Nombres abreviados para proteger la privacidad. Resultados individuales pueden variar según cada caso.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-serif text-xl text-white mb-2">HazloAsí<span className="text-green">Ya</span></div>
            <p className="text-white/40 text-sm leading-relaxed">
              Hazlo así: te guiamos exactamente en lo que necesitas hacer — paso a paso, sin errores, desde la primera vez.
            </p>
          </div>
          <div>
            <div className="text-white/50 text-xs font-bold tracking-widest uppercase mb-3">Trámites</div>
            <div className="grid grid-cols-2 gap-1">
              {FUNNEL_ORDER.slice(0,8).map(id => (
                <Link key={id} href={`/${id}`} className="text-white/40 hover:text-white text-sm transition-colors">
                  {FUNNELS[id].name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/50 text-xs font-bold tracking-widest uppercase mb-3">Cuenta</div>
            {[['Crear cuenta','/?auth=register'],['Iniciar sesión','/?auth=login'],['Dashboard','/dashboard']].map(([l,h]) => (
              <Link key={l} href={h} className="block text-white/40 hover:text-white text-sm transition-colors mb-1">{l}</Link>
            ))}
          </div>
          <div>
            <div className="text-white/50 text-xs font-bold tracking-widest uppercase mb-3">Legal</div>
            {[
              ['Guías','/guias/'],
              ['Formularios PDF','/pdf/'],
              ['Planes y precios','/precios/'],
              ['Quiénes somos','/sobre-nosotros'],
              ['Términos de Uso','/terms/'],
              ['Privacidad','/privacy/'],
              ['Mis datos','/mis-datos/'],
              ['No vender mis datos','/no-vender-mis-datos/'],
            ].map(([l,h]) => (
              <Link key={l} href={h} className="block text-white/40 hover:text-white text-sm transition-colors mb-1">{l}</Link>
            ))}
            <div className="text-white/40 text-sm mt-3">Houston, Texas</div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-white/25 text-xs">
          © 2026 HazloAsíYa.com · Haz tus trámites en EE.UU. sin errores · No es asesoría legal
        </div>
      </footer>
    </div>
  )
}
