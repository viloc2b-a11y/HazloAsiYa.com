'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FUNNELS, FUNNEL_ORDER } from '@/data/funnels'
import { authStatic } from '@/lib/static-backend'

interface Document {
  id: string; funnel: string; created_at: string; result: { eligible: boolean; headline: string }
}

const STATES_AVAILABLE = [
  { id: 'texas',      label: 'Texas',        flag: '🤠', funnels: ['snap','medicaid','wic'] as const, paths: { snap: '/snap/texas/', medicaid: '/medicaid/texas/', wic: '/wic/texas/' } },
  { id: 'california', label: 'California',   flag: '🌴', funnels: ['snap','medicaid','wic'] as const, paths: { snap: '/snap/california/', medicaid: '/medicaid/california/', wic: '/wic/california/' } },
  { id: 'florida',    label: 'Florida',      flag: '☀️', funnels: ['snap','medicaid','wic'] as const, paths: { snap: '/snap/florida/', medicaid: '/medicaid/florida/', wic: '/wic/florida/' } },
  { id: 'new-york',   label: 'Nueva York',   flag: '🗽', funnels: ['snap','medicaid','wic'] as const, paths: { snap: '/snap/new-york/', medicaid: '/medicaid/new-york/', wic: '/wic/new-york/' } },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user,  setUser]  = useState<{ email: string; name?: string; plan?: string } | null>(null)
  const [docs,  setDocs]  = useState<Document[]>([])
  const [tab,   setTab]   = useState<'overview'|'history'|'plan'|'profile'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('haya_user')
    if (!stored) { router.push('/'); return }
    setUser(JSON.parse(stored))
    setLoading(false)
    // In production: fetch from Supabase
  }, [router])

  const handleLogout = async () => {
    await authStatic({ action: 'logout' })
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="text-gray-400">Cargando…</div></div>
  if (!user)   return null

  const planLabel: Record<string, string> = { free: 'Gratis', paid_guide: 'Básico', annual: 'Anual', assisted: 'Asistido' }
  const plan = user.plan || 'free'

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-white">HazloAsí<span className="text-green">Ya</span></Link>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm hidden sm:block">{user.email}</span>
          <button onClick={handleLogout} className="text-white/50 hover:text-white text-sm transition-colors">Salir</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green flex items-center justify-center text-white font-bold text-xl">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div>
            <div className="font-serif text-2xl text-navy">{user.name || user.email.split('@')[0]}</div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${
              plan === 'free' ? 'bg-gray-100 text-gray-500' : 'bg-green/10 text-green'
            }`}>
              {planLabel[plan] || 'Gratis'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-cream-2 rounded-xl p-1 mb-6">
          {([['overview','Resumen'],['history','Mis trámites'],['plan','Mi plan'],['profile','Perfil']] as const).map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      tab === t ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy'
                    }`}>
              {l}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                ['📋','Trámites completados', docs.length.toString()],
                ['⭐','Plan activo', planLabel[plan]],
                ['🎯','Trámites disponibles', plan === 'annual' || plan === 'assisted' ? '16' : '1'],
              ].map(([ico,label,val]) => (
                <div key={label} className="card p-5 text-center">
                  <div className="text-3xl mb-2">{ico}</div>
                  <div className="font-serif text-2xl text-navy">{val}</div>
                  <div className="text-gray-400 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            {plan === 'free' && (
              <div className="bg-navy rounded-2xl p-6 text-center">
                <div className="font-serif text-xl text-white mb-2">
                  Formulario oficial por $29 · O acceso anual por $79
                </div>
                <p className="text-white/50 text-sm mb-4">Disponible en Texas, California, Florida y Nueva York.</p>
                <Link href="/precios" className="btn-primary inline-block">Ver opciones →</Link>
              </div>
            )}

            {/* Trámites por estado */}
            <div className="card p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                Trámites disponibles por estado
              </div>
              <div className="space-y-4">
                {STATES_AVAILABLE.map(st => (
                  <div key={st.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{st.flag}</span>
                      <span className="font-semibold text-sm text-navy">{st.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Link href={st.paths.snap}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-100 hover:bg-cream hover:border-green/30 transition-colors text-xs font-medium text-navy">
                        🛒 SNAP
                      </Link>
                      <Link href={st.paths.medicaid}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-100 hover:bg-cream hover:border-green/30 transition-colors text-xs font-medium text-navy">
                        🏥 Medicaid
                      </Link>
                      <Link href={st.paths.wic}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-100 hover:bg-cream hover:border-green/30 transition-colors text-xs font-medium text-navy">
                        🤱 WIC
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesos rápidos — otros trámites */}
            <div className="card p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Otros trámites</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FUNNEL_ORDER.filter(id => !['snap','medicaid','wic'].includes(id)).slice(0, 8).map(id => (
                  <Link key={id} href={`/${id}`}
                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-cream border border-gray-100 transition-colors text-sm">
                    <span>{FUNNELS[id].icon}</span>
                    <span className="text-navy font-medium">{FUNNELS[id].name.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="card p-5">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Historial de trámites</div>
            {docs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-400">Aún no has completado ningún trámite.</p>
                <Link href="/" className="btn-primary inline-block mt-4 py-2.5 px-6">Empezar ahora →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:bg-cream transition-colors">
                    <div className="text-2xl">{FUNNELS[doc.funnel as keyof typeof FUNNELS]?.icon || '📋'}</div>
                    <div className="flex-1">
                      <div className="font-medium text-navy text-sm">{doc.result.headline}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(doc.created_at).toLocaleDateString('es-US')}</div>
                    </div>
                    <Link href={`/${doc.funnel}/result`} className="text-green font-semibold text-sm hover:underline">Ver →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plan */}
        {tab === 'plan' && (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Tu plan actual</div>
              <div className="font-serif text-2xl text-navy mb-1">{planLabel[plan]}</div>
              <div className="space-y-2 mt-4">
                {(plan === 'free' ? [
                  ['✅','Cuestionario completo'],
                  ['✅','Elegibilidad evaluada'],
                  ['✅','Primeros 3 pasos'],
                  ['🔒','Formulario oficial pre-llenado ($29)'],
                  ['🔒','Instrucciones exactas de entrega ($29)'],
                ] : plan === 'annual' || plan === 'assisted' ? [
                  ['✅','16 trámites ilimitados'],
                  ['✅','Planes completos con ejemplos'],
                  ['✅','PDF profesional'],
                  ['✅','Alertas de cambios'],
                  plan === 'assisted' ? ['✅','Revisión humana de documentos'] : ['💬','Soporte WhatsApp básico'],
                ] : [
                  ['✅','Plan completo desbloqueado'],
                  ['✅','PDF profesional'],
                  ['🔒','Acceso anual ($79/año)'],
                ]).map(([ico, label]) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span>{ico}</span>
                    <span className={ico === '🔒' ? 'text-gray-400' : 'text-gray-700'}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {plan === 'free' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card p-5 border-2 border-gold">
                  <div className="font-serif text-2xl text-navy mb-1">$29</div>
                  <div className="font-bold text-sm mb-3">Guía por Trámite</div>
                  <Link href="/precios" className="btn-gold block text-center py-2.5 text-sm">Comprar →</Link>
                </div>
                <div className="card p-5 border-2 border-navy">
                  <div className="font-serif text-2xl text-navy mb-1">$79<span className="text-sm text-gray-400">/año</span></div>
                  <div className="font-bold text-sm mb-3">Acceso Anual — 16 Trámites</div>
                  <Link href="/precios" className="btn-navy block text-center py-2.5 text-sm">Comprar →</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div className="card p-6 space-y-4">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Mi perfil</div>
            <div>
              <label className="label">Nombre</label>
              <input className="input" defaultValue={user.name || ''} placeholder="Tu nombre"/>
            </div>
            <div>
              <label className="label">Correo electrónico</label>
              <input className="input bg-gray-50 text-gray-400 cursor-not-allowed" defaultValue={user.email} disabled/>
            </div>
            <div>
              <label className="label">Idioma preferido</label>
              <select className="input"><option>Español</option><option>English</option></select>
            </div>
            <button className="btn-primary py-2.5 px-6">Guardar cambios</button>
          </div>
        )}
      </div>
    </div>
  )
}
