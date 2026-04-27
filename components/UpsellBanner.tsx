'use client'
import { useState, useEffect } from 'react'

interface UpsellBannerProps {
  onUpgrade: () => void
  onDismiss: () => void
}

export default function UpsellBanner({ onUpgrade, onDismiss }: UpsellBannerProps) {
  const [seconds, setSeconds] = useState(15 * 60) // 15 minutes

  useEffect(() => {
    const int = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(int); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(int)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${mins}:${secs.toString().padStart(2,'0')}`
  const expired = seconds === 0

  const LogoMark = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="url(#up-lm)"/>
      <path d="M10 26 L18 10 L26 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M18 10 L18 27" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      <defs>
        <linearGradient id="up-lm" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EC96A"/>
          <stop offset="100%" stopColor="#087A3F"/>
        </linearGradient>
      </defs>
    </svg>
  )

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={e => e.target === e.currentTarget && onDismiss()}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-pop-in">

        {/* Timer bar */}
        {!expired && (
          <div className="h-1.5 transition-all duration-1000"
               style={{ background: 'var(--green)', width: `${(seconds / (15*60)) * 100}%` }}/>
        )}

        <div className="p-8">
          <div className="flex justify-center mb-4"><LogoMark/></div>

          <div className="text-center mb-6">
            {expired ? (
              <>
                <div className="text-2xl mb-2">⏰</div>
                <h3 className="font-serif text-2xl mb-2" style={{ color: 'var(--navy)' }}>
                  La oferta ha expirado
                </h3>
                <p className="text-gray-400 text-sm">El precio regular del acceso anual es $49/año.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{ background: 'rgba(192,122,12,.12)', color: 'var(--gold)' }}>
                  ⏰ Oferta especial — Solo hoy
                </div>
                <h3 className="font-serif text-3xl mb-2" style={{ color: 'var(--navy)' }}>
                  Por solo $30 más, accede a<br/>los 16 trámites durante un año
                </h3>
                <p className="text-gray-500 text-sm">
                  Acabas de comprar 1 guía por $19. Por $30 más tienes los 16 trámites ilimitados por 12 meses.
                </p>
              </>
            )}
          </div>

          {!expired && (
            <>
              {/* Countdown */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-6 py-3">
                  <span className="text-gray-400 text-sm font-medium">Oferta vence en:</span>
                  <span className="font-serif text-3xl tabular-nums" style={{ color: 'var(--navy)' }}>{timeStr}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="font-serif text-5xl" style={{ color: 'var(--navy)' }}>$49</span>
                  <span className="text-gray-400 text-sm line-through">$266 si compras por separado</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">16 trámites × 12 meses · Menos de $3.07/mes</div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
                {[
                  ['🛒','SNAP'],['🏥','Medicaid'],['🪪','ID Texas'],['🤱','WIC'],
                  ['💼','Desempleo TWC'],['💰','Taxes'],['🎓','Escuela'],['📄','DACA'],
                  ['📋','IEP'],['🔢','ITIN'],['🏠','Vivienda'],['🧒','Pre-K'],
                  ['💡','Servicios'],['💼','Empleo'],['🏦','Banco'],['🇲🇽','Matrícula'],
                ].map(([icon, name]) => (
                  <div key={name} className="flex items-center gap-2 text-gray-600">
                    <span className="text-xs font-bold" style={{ color: 'var(--green)' }}>✓</span>
                    <span>{icon}</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button onClick={onDismiss} className="flex-1 py-3 border-2 border-gray-100 text-gray-400 font-semibold rounded-xl hover:border-gray-200 transition-colors text-sm">
              {expired ? 'Cerrar' : 'No gracias'}
            </button>
            {!expired && (
              <button onClick={onUpgrade} className="flex-[2] btn-gold py-3 text-base">
                Sí, quiero el acceso anual por $49 →
              </button>
            )}
          </div>

          {!expired && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Pago único por un año · Sin renovación automática · Garantía 30 días
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
