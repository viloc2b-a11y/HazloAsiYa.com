'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FUNNEL_ORDER, FUNNELS } from '@/data/funnels'

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

export default function Topbar({ user }: { user?: { email: string; name?: string; plan?: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
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
            className="px-3 py-1.5 text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
          >
            Buscar
          </Link>
          {NAV_FUNNELS.map(id => (
            <Link
              key={id}
              href={`/${id}`}
              className="px-3 py-1.5 text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
            >
              {FUNNELS[id].name.split(' ')[0]}
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
            <Link href="/?auth=login" className="text-[13px] font-semibold text-white/70 hover:text-white px-3 py-1.5 transition-colors">
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
        <div className="lg:hidden border-t border-white/10 bg-navy px-4 py-3 grid grid-cols-2 gap-1">
          <Link
            href="/buscar/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-green font-semibold hover:bg-white/8 rounded-lg transition-colors col-span-2"
          >
            🔍 Buscar en el sitio
          </Link>
          {FUNNEL_ORDER.map(id => (
            <Link
              key={id}
              href={`/${id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
            >
              <span>{FUNNELS[id].icon}</span>
              <span>{FUNNELS[id].name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
