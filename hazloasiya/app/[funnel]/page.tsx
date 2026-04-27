import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FUNNELS, FUNNEL_ORDER, NEXT_STEP_MAP, FunnelId } from '@/data/funnels'
import Topbar from '@/components/Topbar'

interface Props { params: Promise<{ funnel: string }> }

export async function generateStaticParams() {
  return FUNNEL_ORDER.map(funnel => ({ funnel }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { funnel: id } = await params
  const f = FUNNELS[id as FunnelId]
  if (!f) return {}
  return {
    title: `Hazlo así: ${f.action} | HazloAsíYa`,
    description: f.desc.slice(0, 160),
  }
}

export default async function FunnelPage({ params }: Props) {
  const { funnel: id } = await params
  const f = FUNNELS[id as FunnelId]
  if (!f) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    userProfile = data
  }

  const nextSteps = NEXT_STEP_MAP[id as FunnelId] || []

  return (
    <div className="min-h-screen bg-cream">
      <Topbar user={userProfile}/>

      {/* Hero */}
      <section className="bg-navy">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <div className="text-5xl mb-4">{f.icon}</div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
            {f.action}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-8">{f.desc}</p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/${id}/form`} className="btn-primary text-base px-8 py-3.5">
              Hazlo ahora →
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
            {f.icon} Resolver mi trámite →
          </Link>
          <p className="text-xs text-gray-400 mt-3">Sin registro · Sin tarjeta · Sin redireccionamientos</p>
        </div>

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
