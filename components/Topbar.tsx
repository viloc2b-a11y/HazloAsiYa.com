'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FUNNEL_ORDER, FUNNELS, funnelLandingPath } from '@/data/funnels'

const LogoMark = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="9" fill="url(#lm)"/>
    <path d="M10 26 L18 10 L26 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M18 10 L18 27" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <defs>
      <linearGradient id="lm" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EC96A"/>
        <stop offset="100%" stopColor="#087A3F"/>
      </linearGradient>
    </defs>
  </svg>
)

const NAV_FUNNELS = ['snap','medicaid','id','wic','taxes','escuela','daca','itin','iep'] as const

const STATES_NAV = [
  { flag: '🤠', label: 'Texas',      snap: '/snap/texas/',      medicaid: '/medicaid/texas/',      wic: '/wic/texas/' },
  { flag: '🌴', label: 'California', snap: '/snap/california/', medicaid: '/medicaid/california/', wic: '/wic/california/' },
  { flag: '☀️', label: 'Florida',    snap: '/snap/florida/',    medicaid: '/medicaid/florida/',    wic: '/wic/florida/' },
  { flag: '🗽', label: 'Nueva York', snap: '/snap/new-york/',   medicaid: '/medicaid/new-york/',   wic: '/wic/new-york/' },
]

export default function Topbar({ user }: { user?: { email: string; name?: string; plan?: string } | null }) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [statesOpen, setStatesOpen] = useState(false)
  const [localUser, setLocalUser] = useState<{ email: string; name?: string; plan?: string } | null>(user ?? null)

  useEffect(() => {
    // If a parent didn't pass a user (static export pages), use localStorage.
    if (user !== undefined) { setLocalUser(user); return }
    try {
      const raw = localStorage.getItem('haya_user')
      setLocalUser(raw ? JSON.parse(raw) : null)
    } catch {
      setLocalUser(null)
    }
  }, [user])

  // Close states dropdown when clicking outside
  useEffect(() => {
    if (!statesOpen) return
    const handler = () => setStatesOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [statesOpen])

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark size={32}/>
          <span className="font-serif text-[18px] text-white leading-none">
            HazloAsí<span className="text-green">Ya</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          <Link
            href="/buscar/"
            className="px-3 py-1.5 text-[13px] font-semibold text-white/55 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
          >
            Buscar
          </Link>
          <Link
            href="/pdf/"
            className="px-3 py-1.5 text-[13px] font-bold text-white/90 hover:text-white hover:bg-white/8 rounded-lg transition-colors whitespace-nowrap"
          >
            Formularios PDF
          </Link>

          {/* States dropdown */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setStatesOpen(!statesOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold text-white/90 hover:text-white hover:bg-white/8 rounded-lg transition-colors whitespace-nowrap"
            >
              📍 Por estado
              <svg className={`w-3 h-3 transition-transform ${statesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </button>
            {statesOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-navy border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-white/30">
                  Disponible en 4 estados
                </div>
                {STATES_NAV.map(st => (
                  <div key={st.label} className="px-3 py-2 border-b border-white/8 last:border-0">
                    <div className="text-[11px] font-bold text-white/50 mb-1.5">{st.flag} {st.label}</div>
                    <div className="flex gap-2">
                      <Link href={st.snap} onClick={() => setStatesOpen(false)}
                            className="flex-1 text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1 transition-colors">
                        🛒 SNAP
                      </Link>
                      <Link href={st.medicaid} onClick={() => setStatesOpen(false)}
                            className="flex-1 text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1 transition-colors">
                        🏥 Medicaid
                      </Link>
                      <Link href={st.wic} onClick={() => setStatesOpen(false)}
                            className="flex-1 text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1 transition-colors">
                        🤱 WIC
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {NAV_FUNNELS.map((navId) => (
            <Link
              key={navId}
              href={funnelLandingPath(navId)}
              className="px-3 py-1.5 text-[13px] font-semibold text-white/75 hover:text-white hover:bg-white/8 rounded-lg transition-colors whitespace-nowrap"
            >
              {navId === 'id' ? 'Texas ID' : FUNNELS[navId].name.split(' ')[0]}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {localUser ? (
            <Link href="/dashboard" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors">
              <div className="w-6 h-6 rounded-full bg-green flex items-center justify-center text-white text-xs font-bold">
                {(localUser.name || localUser.email)[0].toUpperCase()}
              </div>
              <span className="text-white/80 text-[13px] font-medium hidden sm:block">Mi cuenta</span>
            </Link>
          ) : (
            <Link href="/?auth=login" className="text-[13px] font-semibold text-white/55 hover:text-white px-3 py-1.5 transition-colors">
              Entrar
            </Link>
          )}
          <Link href="/snap" className="btn-primary py-1.5 px-4 text-[13px] hidden sm:block">
            Empezar →
          </Link>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen
                ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-navy px-4 py-3">
          {/* Search + PDF */}
          <div className="grid grid-cols-2 gap-1 mb-3">
            <Link
              href="/buscar/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-green font-semibold hover:bg-white/8 rounded-lg transition-colors col-span-2"
            >
              🔍 Buscar en el sitio
            </Link>
            <Link
              href="/pdf/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-green font-semibold hover:bg-white/8 rounded-lg transition-colors col-span-2"
            >
              📄 Formularios PDF (borradores)
            </Link>
          </div>

          {/* States section */}
          <div className="mb-3 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-white/5 text-[10px] font-bold tracking-widest uppercase text-green">
              📍 Por estado — TX · CA · FL · NY
            </div>
            {STATES_NAV.map(st => (
              <div key={st.label} className="px-3 py-2 border-t border-white/8">
                <div className="text-[11px] font-bold text-white/50 mb-1.5">{st.flag} {st.label}</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <Link href={st.snap} onClick={() => setMenuOpen(false)}
                        className="text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1.5 transition-colors">
                    🛒 SNAP
                  </Link>
                  <Link href={st.medicaid} onClick={() => setMenuOpen(false)}
                        className="text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1.5 transition-colors">
                    🏥 Medicaid
                  </Link>
                  <Link href={st.wic} onClick={() => setMenuOpen(false)}
                        className="text-center text-[11px] font-semibold text-white/70 hover:text-white bg-white/6 hover:bg-white/12 rounded-md py-1.5 transition-colors">
                    🤱 WIC
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* All funnels */}
          <div className="grid grid-cols-2 gap-1">
            {FUNNEL_ORDER.map((fid) => (
              <Link
                key={fid}
                href={funnelLandingPath(fid)}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
              >
                <span>{FUNNELS[fid].icon}</span>
                <span>{fid === 'id' ? 'Texas ID' : FUNNELS[fid].name.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
