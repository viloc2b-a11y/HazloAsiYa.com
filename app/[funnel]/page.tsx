import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FUNNELS, NEXT_STEP_MAP, isValidFunnelId } from '@/data/funnels'
import { getFunnelHeroCopy, getFunnelSeoMeta } from '@/data/funnel-landing'
import Topbar from '@/components/Topbar'
import { absoluteUrl, isMoneyPageOgSlug } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { MONEY_PAGE_REGULATORY_SOURCE, regulatoryMetadataOther } from '@/lib/regulatory-meta'
import Disclosure from '@/components/legal/Disclosure'
import { DISCLAIMER_INMIGRACION, DISCLAIMER_ITIN, DISCLAIMER_MEDICAID_TX } from '@/lib/legal-texts'
import SeasonalCourseBanner from '@/components/monetization/SeasonalCourseBanner'
import AffiliateRecommendations from '@/components/monetization/AffiliateRecommendations'
import SnapEditorialSection from '@/components/funnels/SnapEditorialSection'
import MedicaidEditorialSection from '@/components/funnels/MedicaidEditorialSection'
import ItinEditorialSection from '@/components/funnels/ItinEditorialSection'
import WicEditorialSection from '@/components/funnels/WicEditorialSection'
import EscuelaEditorialSection from '@/components/funnels/EscuelaEditorialSection'
import DacaEditorialSection from '@/components/funnels/DacaEditorialSection'
import TaxesEditorialSection from '@/components/funnels/TaxesEditorialSection'
import RentEditorialSection from '@/components/funnels/RentEditorialSection'

interface Props { params: Promise<{ funnel: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { funnel: id } = await params
  if (!isValidFunnelId(id)) return {}
  const f = FUNNELS[id]
  const path = `/${id}/`
  const ogImage = isMoneyPageOgSlug(id)
    ? { url: `/images/og/${id}-og.jpg` as const, width: 1200, height: 630, alt: f.name }
    : { url: '/images/og/default-og.jpg' as const, width: 1200, height: 630, alt: f.name }

  const seo = getFunnelSeoMeta(id, f.name, f.desc)

  const base: Metadata = {
    title: seo.title,
    description: seo.description,
    alternates: alternatesForPath(path),
    openGraph: {
      url: absoluteUrl(path),
      locale: 'es_US',
      images: [ogImage],
      ...(seo.ogTitle
        ? {
            title: seo.ogTitle,
            description: seo.description,
          }
        : {}),
    },
  }
  if (isMoneyPageOgSlug(id)) {
    base.other = regulatoryMetadataOther(MONEY_PAGE_REGULATORY_SOURCE[id])
  }
  return base
}

export default async function FunnelPage({ params }: Props) {
  const { funnel: id } = await params
  if (!isValidFunnelId(id)) notFound()
  const f = FUNNELS[id]
  const nextSteps = NEXT_STEP_MAP[id] || []
  const hero = getFunnelHeroCopy(id, { action: f.action, desc: f.desc, icon: f.icon })

  return (
    <div className="min-h-screen bg-cream">
      <Topbar />

      {/* Hero: H1 → intro → aviso → CTA (Disclosure después del primer párrafo) */}
      <section className="bg-navy">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <div className="text-5xl mb-4">{f.icon}</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">{hero.headline}</h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-6">{hero.subhead}</p>

          <div className="max-w-2xl mb-8 space-y-4">
            {id === 'medicaid' && (
              <aside
                className="rounded-xl border-l-4 border-green bg-emerald-50/90 px-4 py-3 text-sm text-navy leading-relaxed"
                role="note"
              >
                <span className="font-bold text-green">Aviso importante</span>
                <p className="mt-1.5">{DISCLAIMER_MEDICAID_TX}</p>
              </aside>
            )}
            {(id === 'itin' || id === 'taxes') && (
              <aside
                className="rounded-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-navy leading-relaxed"
                role="note"
              >
                <span className="font-bold text-amber-800">Aviso fiscal (Circular 230 / IRS)</span>
                <p className="mt-1.5">{DISCLAIMER_ITIN}</p>
              </aside>
            )}
            {id === 'daca' && (
              <aside
                className="rounded-xl border-l-4 border-green bg-emerald-50/90 px-4 py-3 text-sm text-navy leading-relaxed"
                role="note"
              >
                <span className="font-bold text-green">Aviso migratorio</span>
                <p className="mt-1.5">{DISCLAIMER_INMIGRACION}</p>
              </aside>
            )}
            {id !== 'medicaid' && id !== 'itin' && id !== 'taxes' && id !== 'daca' && (
              <Disclosure variant="educational" />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/${id}/form`} className="btn-primary text-base px-8 py-3.5">
              {hero.ctaHero}
            </Link>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span>⏱ 5 minutos</span>
              <span>🔒 Sin registro</span>
              <span>$0 para empezar</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {isMoneyPageOgSlug(id) && (
          <VerifiedInfoBanner
            officialUrl={
              id === 'daca'
                ? 'https://www.uscis.gov/humanitarian/consideration-deferred-action-childhood-arrivals-daca'
                : id === 'snap' || id === 'medicaid' || id === 'wic'
                  ? 'https://www.hhs.texas.gov/'
                  : id === 'itin' || id === 'taxes'
                    ? 'https://www.irs.gov/'
                    : id === 'escuela'
                      ? 'https://tea.texas.gov/'
                      : id === 'rent'
                        ? 'https://www.hud.gov/'
                        : 'https://www.acf.hhs.gov/ocs/programs/liheap'
            }
          />
        )}

        {/* What you get */}
        <div className="bg-navy rounded-2xl p-6 text-white">
          <div className="text-xs font-bold tracking-widest uppercase text-green/70 mb-4">Qué vas a recibir exactamente</div>
          <div className="font-serif text-xl mb-5">No información — instrucciones que te resuelven el trámite</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['✅','Lo que ya tienes','Lista exacta — sin suposiciones.'],
              ['❌','Lo que te falta','Documentos específicos a conseguir.'],
              ['📋','Pasos en orden','Qué hacer, en qué orden, qué decir.'],
              ['📝','Ejemplo llenado','El formulario ya completado correctamente.'],
              ['🤝','Contacto local','Alguien en tu área, en español, primero.'],
            ].map(([ico,t,d]) => (
              <div key={t} className="bg-white/7 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{ico}</div>
                <div className="font-bold text-sm mb-1">{t}</div>
                <div className="text-white/40 text-xs leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="card p-6 border-2 border-green text-center">
          <div className="text-xs font-bold tracking-widest uppercase text-green mb-2">Empieza ahora</div>
          <h3 className="font-serif text-2xl text-navy mb-2">Responde 5 preguntas — recibe tu plan exacto</h3>
          <p className="text-gray-500 mb-6">En 5 minutos sabes exactamente qué tienes, qué te falta y cómo completar este trámite.</p>
          <Link href={`/${id}/form`} className="btn-primary px-10 py-3.5 text-base inline-block">
            {hero.ctaCard}
          </Link>
          <p className="text-xs text-gray-400 mt-3">Sin registro · Sin tarjeta · Sin redireccionamientos</p>
        </div>

        {id === 'snap' && <SnapEditorialSection />}
        {id === 'medicaid' && <MedicaidEditorialSection />}
        {id === 'itin' && <ItinEditorialSection />}
        {id === 'wic' && <WicEditorialSection />}
        {id === 'escuela' && <EscuelaEditorialSection />}
        {id === 'daca' && <DacaEditorialSection />}
        {id === 'taxes' && <TaxesEditorialSection />}
        {id === 'rent' && <RentEditorialSection />}

        <SeasonalCourseBanner funnelId={id} />

        {/* Affiliates */}
        {f.affiliates.length > 0 && (
          <div className="card p-6">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Recursos locales</div>
            <div className="space-y-3">
              {f.affiliates.map(a => (
                <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-start gap-4 p-4 rounded-xl hover:bg-cream transition-colors group">
                  <div className="text-2xl shrink-0">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy text-sm flex items-center gap-2">
                      {a.name}
                      {a.primary && <span className="badge-green">Recomendado</span>}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">{a.desc}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.trust}</div>
                  </div>
                  <span className="text-gray-300 group-hover:text-green transition-colors text-lg">→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <AffiliateRecommendations />

        {/* Next steps */}
        {nextSteps.length > 0 && (
          <div className="bg-cream-2 rounded-2xl p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Al terminar, también puedes hacer:</div>
            <div className="flex flex-wrap gap-3">
              {nextSteps.map(ns => (
                <Link key={ns.id} href={`/${ns.id}`}
                      className="flex items-center gap-2 bg-white border border-cream rounded-xl px-4 py-2.5 hover:border-green hover:text-green transition-colors text-sm font-medium text-navy">
                  <span>{ns.icon}</span>
                  <span>{ns.name}</span>
                  <span className="text-gray-300">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
