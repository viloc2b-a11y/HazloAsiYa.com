import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { withTrailingSlash } from '@/lib/site'

export type CityProgram = {
  slug: string          // e.g. 'snap', 'medicaid', 'wic'
  label: string         // e.g. 'SNAP / Estampillas'
  icon: string
  desc: string
  href: string          // full path with ?state= param
  formCode: string
}

export type CityPageProps = {
  city: string                  // "Houston"
  state: string                 // "Texas"
  stateSlug: string             // "texas"
  stateAbbr: string             // "TX"
  hispanicPct: string           // "44%"
  hispanicNum: string           // "1.1 millones"
  hispanicOrigin: string        // "mexicana y centroamericana"
  snapPortal: string            // URL
  medicaidPortal: string        // URL
  wicPortal: string             // URL
  snapPortalLabel: string
  medicaidPortalLabel: string
  wicPortalLabel: string
  programs: CityProgram[]
  seoKeyword: string            // "SNAP Houston en español"
  localNote?: string            // optional city-specific note
}

export default function CityLandingPage({
  city,
  state,
  stateAbbr,
  hispanicPct,
  hispanicNum,
  hispanicOrigin,
  snapPortal,
  medicaidPortal,
  wicPortal,
  snapPortalLabel,
  medicaidPortalLabel,
  wicPortalLabel,
  programs,
  seoKeyword,
  localNote,
}: CityPageProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Topbar />

      {/* ── Hero ── */}
      <div className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-green tracking-widest uppercase mb-5">
            📍 {city.toUpperCase()}, {stateAbbr}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-4">
            Trámites de gobierno en español{' '}
            <span className="text-green">en {city}.</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mb-8">
            {hispanicNum} de residentes hispanos en {city} — {hispanicPct} de la población, mayoría de origen{' '}
            {hispanicOrigin}. HazloAsíYa te ayuda a preparar SNAP, Medicaid, WIC y más, completamente
            en español, desde tu teléfono o computadora.
          </p>
          {localNote && (
            <div className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white/75 mb-8 max-w-xl">
              💡 {localNote}
            </div>
          )}
          <div className="flex flex-wrap gap-6">
            {[
              { num: hispanicPct, label: `de ${city} es hispano` },
              { num: '3', label: 'programas disponibles' },
              { num: '$0', label: 'para empezar' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.num}</div>
                <div className="text-xs text-white/45">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Programs grid ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl text-[#0A2540] mb-2">
          Trámites disponibles en {city}
        </h2>
        <p className="text-[#0A2540]/55 text-sm mb-8">
          Selecciona el trámite que necesitas. El cuestionario ya viene configurado para {state}.
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {programs.map(p => (
            <Link
              key={p.slug}
              href={p.href}
              className="group bg-white border border-[#E8E2D8] hover:border-[#0EC96A] rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0EC96A]/10"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{p.icon}</span>
                <span className="text-xs font-mono font-bold bg-[#F5F0E8] text-[#0A2540]/50 px-2 py-1 rounded-full border border-[#E8E2D8]">
                  {p.formCode}
                </span>
              </div>
              <h3 className="font-black text-[#0A2540] text-base mb-1 group-hover:text-[#0A6640] transition-colors">
                {p.label}
              </h3>
              <p className="text-xs text-[#0A2540]/55 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE0]">
                <span className="text-xs text-[#0A2540]/35">Gratis para empezar</span>
                <span className="text-xs font-bold text-[#0EC96A] group-hover:translate-x-0.5 transition-transform">
                  Empezar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Official portals ── */}
      <div className="bg-[#0A2540] text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="font-serif text-xl text-white mb-2">
            Portales oficiales de {state}
          </h2>
          <p className="text-white/50 text-sm mb-8">
            HazloAsíYa prepara tu borrador. Estos son los portales donde presentas la solicitud final.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'SNAP', portal: snapPortal, name: snapPortalLabel, icon: '🛒' },
              { label: 'Medicaid', portal: medicaidPortal, name: medicaidPortalLabel, icon: '🏥' },
              { label: 'WIC', portal: wicPortal, name: wicPortalLabel, icon: '👶' },
            ].map(item => (
              <a
                key={item.label}
                href={item.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/8 border border-white/15 rounded-xl p-4 hover:bg-white/12 transition-colors"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-white text-sm">{item.label}</div>
                <div className="text-xs text-white/45 mt-0.5 mb-2">{item.name}</div>
                <div className="text-xs text-[#0EC96A]">Ver portal oficial →</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl text-[#0A2540] mb-8 text-center">
          ¿Cómo funciona?
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', icon: '📝', title: 'Responde el cuestionario', desc: `5–10 preguntas en español sobre tu situación en ${city}.` },
            { step: '2', icon: '⚙️', title: 'Generamos tu borrador', desc: `Tus datos se colocan automáticamente en el formulario oficial de ${state}.` },
            { step: '3', icon: '📄', title: 'Descarga y presenta', desc: 'PDF listo para firmar y entregar en la oficina correspondiente.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-xs font-bold text-[#0A2540]/35 uppercase tracking-widest mb-1">Paso {s.step}</div>
              <h3 className="font-black text-[#0A2540] text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-[#0A2540]/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#0A6640] text-white">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-white text-lg">¿Listo para empezar?</div>
            <div className="text-white/65 text-sm">Es gratis. Sin tarjeta de crédito. En español.</div>
          </div>
          <Link
            href={withTrailingSlash(`/${programs[0]?.slug || 'snap'}`) + `?state=${programs[0]?.href.split('state=')[1] || ''}`}
            className="shrink-0 bg-white text-[#0A6640] font-black px-7 py-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            Empezar ahora →
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#E8E2D8] bg-cream-2">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[#0A2540]/40 max-w-lg mx-auto leading-relaxed">
            HazloAsíYa.com es un servicio de preparación de documentos — no es una firma de abogados
            y no provee asesoría legal.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-[#0A2540]/40">
            <Link href={withTrailingSlash('/terms')} className="hover:text-[#0A2540]/70">Términos</Link>
            <Link href={withTrailingSlash('/privacy')} className="hover:text-[#0A2540]/70">Privacidad</Link>
            <Link href={withTrailingSlash('/sobre-nosotros')} className="hover:text-[#0A2540]/70">Sobre nosotros</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
