import type { Metadata } from 'next'
import Link from 'next/link'
import { PDF_CATALOG, getFormsByTier } from '@/types/pdf'
import type { PdfTier } from '@/types/pdf'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'
import Topbar from '@/components/Topbar'

export const metadata: Metadata = {
  title: 'Formularios y borradores en español | HazloAsíYa',
  description:
    'Asistente en español para preparar borradores (DACA, permiso de trabajo, ITIN, SNAP Texas, W-4, I-9, Texas ID, escuela y más) con PDF descargable.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/pdf')}` },
  openGraph: {
    title: 'Formularios en español | HazloAsíYa',
    description: 'Borradores orientativos con PDF listo para imprimir.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/pdf')}`,
  },
}

// Branding palette:
// Navy  #0A2540  — hero background, section headings
// Green #0EC96A  — CTAs, accents
// Cream #F5F0E8  — page background (warm, easy on the eyes)
// Card  #FFFFFF  — cards on cream background (white reads clearly against cream)
// Tier badge colors aligned to brand: navy/green/teal variants

const TIER_META: Record<PdfTier, { label: string; title: string; desc: string; badgeColor: string; badgeBg: string; badgeBorder: string; accentColor: string }> = {
  1: {
    label: 'TIER 1',
    title: 'Inmigración federal',
    desc: 'DACA · Permiso de trabajo · ITIN',
    badgeColor: 'text-[#0A2540]',
    badgeBg: 'bg-[#0A2540]/8',
    badgeBorder: 'border-[#0A2540]/20',
    accentColor: 'text-[#0A2540]',
  },
  2: {
    label: 'TIER 2',
    title: 'Beneficios y empleo',
    desc: 'SNAP / H1010 · W-4 · I-9',
    badgeColor: 'text-[#0A6640]',
    badgeBg: 'bg-[#0EC96A]/10',
    badgeBorder: 'border-[#0EC96A]/30',
    accentColor: 'text-[#0A6640]',
  },
  3: {
    label: 'TIER 3',
    title: 'Identidad, consulado y escuela',
    desc: 'Texas ID · Matrícula consular · Inscripción escolar',
    badgeColor: 'text-[#5A3E8A]',
    badgeBg: 'bg-[#5A3E8A]/8',
    badgeBorder: 'border-[#5A3E8A]/20',
    accentColor: 'text-[#5A3E8A]',
  },
}

export default function PdfHubPage() {
  const tiers: PdfTier[] = [1, 2, 3]

  return (
    // Cream background — warm off-white that contrasts with white cards
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <Topbar />

      {/* ── Hero: navy background ── */}
      <div className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-green tracking-widest uppercase mb-5">
            📄 {PDF_CATALOG.length} FORMULARIOS OFICIALES
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-4">
            Tu formulario oficial{' '}
            <span className="text-green">ya lleno, listo para firmar.</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mb-8">
            Responde un cuestionario breve en español. Con tus respuestas llenamos automáticamente el formulario oficial
            que pide la agencia — SNAP, Medicaid, WIC, ITIN y más. Al final descargas el PDF completo con tus datos,
            listo para firmar y presentar en la oficina correspondiente.
          </p>

          {/* Process steps */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {[
              { step: '1', icon: '📝', title: 'Responde el cuestionario', desc: '5–10 preguntas en español sobre tu situación' },
              { step: '2', icon: '⚙️', title: 'Llenamos el formulario', desc: 'Tus datos se colocan en los campos oficiales' },
              { step: '3', icon: '📄', title: 'Descarga y presenta', desc: 'PDF listo para firmar y entregar a la agencia' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 bg-white/8 rounded-xl px-4 py-3 flex-1">
                <div className="text-2xl mt-0.5">{s.icon}</div>
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-0.5">Paso {s.step}</div>
                  <div className="text-sm font-bold text-white">{s.title}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { num: String(PDF_CATALOG.length), label: 'formularios disponibles' },
              { num: '4', label: 'estados: TX · CA · FL · NY' },
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

      {/* ── Promo banner: green background ── */}
      <div className="bg-[#0A6640] text-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold">¿Necesitas varios trámites?</span>
            <span className="text-white/70 text-sm ml-2">Revisa planes y precios en una sola página.</span>
          </div>
          <Link
            href={withTrailingSlash('/precios')}
            className="shrink-0 bg-white text-[#0A6640] font-black text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition-colors"
          >
            Ver precios →
          </Link>
        </div>
      </div>

      {/* ── Catalog: cream background, white cards ── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {tiers.map(tier => {
          const t = TIER_META[tier]
          const forms = getFormsByTier(tier)

          return (
            <section key={tier}>
              {/* Tier header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`font-mono text-xs font-black px-3 py-1.5 rounded-full border ${t.badgeBg} ${t.badgeColor} ${t.badgeBorder}`}
                >
                  {t.label}
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0A2540]">{t.title}</h2>
                  <p className="text-sm text-[#0A2540]/50">{t.desc}</p>
                </div>
              </div>

              {/* Cards grid — white on cream = clear contrast */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.map(form => (
                  <Link
                    key={form.id}
                    href={withTrailingSlash(`/pdf/${form.slug}`)}
                    className="group bg-white border border-[#E8E2D8] hover:border-[#0EC96A] rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0EC96A]/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{form.icon}</span>
                      <span className="text-xs font-mono font-bold bg-[#F5F0E8] text-[#0A2540]/50 px-2 py-1 rounded-full border border-[#E8E2D8]">
                        {form.formCode}
                      </span>
                    </div>

                    <h3 className={`font-black text-[#0A2540] text-base leading-snug mb-1 group-hover:${t.accentColor} transition-colors`}>
                      {form.title}
                    </h3>
                    <p className="text-xs text-[#0A2540]/55 mb-3 leading-relaxed">{form.description}</p>

                    <p className="text-xs text-[#0A2540]/35 italic mb-4 leading-relaxed">{form.who}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {form.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-[#F5F0E8] text-[#0A2540]/60 px-2 py-0.5 rounded-full border border-[#E8E2D8]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE0]">
                      <div>
                        <span className="text-xs text-[#0A2540]/35">Gratis para empezar · </span>
                        <span className="text-sm font-black text-[#0A2540]">PDF al finalizar</span>
                      </div>
                      <span className="text-xs font-bold text-[#0EC96A] group-hover:translate-x-0.5 transition-transform">
                        Empezar →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Footer disclaimer ── */}
      <div className="border-t border-[#E8E2D8]" style={{ backgroundColor: '#EDE7DA' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[#0A2540]/40 max-w-lg mx-auto leading-relaxed">
            HazloAsíYa.com es un servicio de preparación de documentos — no es una firma de abogados y no provee asesoría
            legal. Si tienes preguntas sobre tu caso, consulta con un profesional certificado.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-[#0A2540]/40">
            <Link href={withTrailingSlash('/terms')} className="hover:text-[#0A2540]/70">
              Términos
            </Link>
            <Link href={withTrailingSlash('/privacy')} className="hover:text-[#0A2540]/70">
              Privacidad
            </Link>
            <Link href={withTrailingSlash('/sobre-nosotros')} className="hover:text-[#0A2540]/70">
              Sobre nosotros
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
