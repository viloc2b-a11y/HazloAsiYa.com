import type { Metadata } from 'next'
import Link from 'next/link'
import { PDF_CATALOG, getFormsByTier } from '@/types/pdf'
import type { PdfTier } from '@/types/pdf'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

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

const TIER_META: Record<PdfTier, { label: string; title: string; desc: string; color: string; border: string; bg: string }> = {
  1: {
    label: 'TIER 1',
    title: 'Inmigración federal',
    desc: 'DACA · Permiso de trabajo · ITIN',
    color: 'text-blue-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  2: {
    label: 'TIER 2',
    title: 'Beneficios y empleo',
    desc: 'SNAP / H1010 · W-4 · I-9',
    color: 'text-teal-700',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
  },
  3: {
    label: 'TIER 3',
    title: 'Identidad, consulado y escuela',
    desc: 'Texas ID · Matrícula consular · Inscripción escolar',
    color: 'text-indigo-700',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
  },
}

export default function PdfHubPage() {
  const tiers: PdfTier[] = [1, 2, 3]

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-mono font-bold text-emerald-400 mb-5">
            📄 {PDF_CATALOG.length} FORMULARIOS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Borradores oficiales
            <br />
            <span className="text-emerald-400">en español.</span>
          </h1>
          <p className="text-stone-300 text-base leading-relaxed max-w-xl mb-8">
            Asistente paso a paso y PDF para imprimir. Gratis para empezar; la descarga completa usa el checkout seguro del
            sitio (Square).
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { num: String(PDF_CATALOG.length), label: 'formularios' },
              { num: 'GPT', label: 'ayuda en campos' },
              { num: 'PDF', label: 'descarga local' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="text-xs text-stone-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold">¿Necesitas varios trámites?</span>
            <span className="text-teal-200 text-sm ml-2">Revisa planes y precios en una sola página.</span>
          </div>
          <Link
            href={withTrailingSlash('/precios')}
            className="shrink-0 bg-white text-teal-700 font-black text-sm px-5 py-2 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Ver precios →
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {tiers.map(tier => {
          const t = TIER_META[tier]
          const forms = getFormsByTier(tier)

          return (
            <section key={tier}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`font-mono text-xs font-black px-3 py-1.5 rounded-full border ${t.bg} ${t.color} ${t.border}`}>
                  {t.label}
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900">{t.title}</h2>
                  <p className="text-sm text-stone-500">{t.desc}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.map(form => (
                  <Link
                    key={form.id}
                    href={withTrailingSlash(`/pdf/${form.slug}`)}
                    className="group bg-white border-2 border-stone-200 hover:border-teal-500 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{form.icon}</span>
                      <span className="text-xs font-mono font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-full">
                        {form.formCode}
                      </span>
                    </div>

                    <h3 className="font-black text-stone-900 text-base leading-snug mb-1 group-hover:text-teal-700 transition-colors">
                      {form.title}
                    </h3>
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">{form.description}</p>

                    <p className="text-xs text-stone-400 italic mb-4 leading-relaxed">{form.who}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {form.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div>
                        <span className="text-xs text-stone-400">Gratis para empezar · </span>
                        <span className="text-sm font-black text-stone-900">PDF al finalizar</span>
                      </div>
                      <span className="text-xs font-bold text-teal-600 group-hover:translate-x-0.5 transition-transform">
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

      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
            HazloAsíYa.com es un servicio de preparación de documentos — no es una firma de abogados y no provee asesoría
            legal. Si tienes preguntas sobre tu caso, consulta con un profesional certificado.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-stone-400">
            <Link href={withTrailingSlash('/terms')} className="hover:text-stone-600">
              Términos
            </Link>
            <Link href={withTrailingSlash('/privacy')} className="hover:text-stone-600">
              Privacidad
            </Link>
            <Link href={withTrailingSlash('/sobre-nosotros')} className="hover:text-stone-600">
              Sobre nosotros
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
