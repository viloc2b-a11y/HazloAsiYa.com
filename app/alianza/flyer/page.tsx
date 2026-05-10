'use client'
/**
 * /alianza/flyer/ — Print-ready partner flyer
 * ─────────────────────────────────────────────────────────────────────────────
 * Opens in a new tab from the link generator. Designed to be saved as PDF
 * via browser print (Ctrl+P / Cmd+P → Save as PDF).
 *
 * URL params:
 *   partner      partner slug
 *   name         partner display name
 *   funnel       funnel id (snap, medicaid, wic, itin, daca)
 *   state        state slug (texas, california, etc.) — optional
 *   link         full tracking URL
 *   funnelLabel  human-readable funnel name
 *   stateLabel   human-readable state name — optional
 */

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const FUNNEL_ICONS: Record<string, string> = {
  snap: '🛒',
  medicaid: '🏥',
  wic: '🍼',
  itin: '📋',
  daca: '🛡️',
}

const FUNNEL_DESCRIPTIONS: Record<string, string> = {
  snap:     'Solicita beneficios de alimentos para tu familia. Gratis para empezar.',
  medicaid: 'Obtén seguro médico gratuito o de bajo costo para tu familia.',
  wic:      'Apoyo de nutrición para madres embarazadas y niños menores de 5 años.',
  itin:     'Obtén tu número fiscal (ITIN) para declarar impuestos sin Social Security.',
  daca:     'Solicita o renueva tu permiso de trabajo y protección DACA.',
}

function FlyerContent() {
  const params = useSearchParams()
  const partnerName = params.get('name') ?? 'Tu organización'
  const funnelId    = params.get('funnel') ?? 'snap'
  const stateLabel  = params.get('stateLabel') ?? ''
  const link        = params.get('link') ?? 'https://hazloasiya.com'
  const funnelLabel = params.get('funnelLabel') ?? 'SNAP'
  const icon        = FUNNEL_ICONS[funnelId] ?? '📋'
  const description = FUNNEL_DESCRIPTIONS[funnelId] ?? ''

  return (
    <>
      {/* Print styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #F5F0E8;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 32px 16px;
        }

        .flyer {
          width: 480px;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(10,37,64,0.15);
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }
          .flyer {
            width: 100%;
            box-shadow: none;
            border-radius: 0;
          }
          .no-print { display: none !important; }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      {/* Print button — hidden when printing */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => window.print()}
          style={{
            background: '#0A2540',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🖨️ Guardar como PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            background: '#F5F0E8',
            color: '#0A2540',
            fontWeight: 700,
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid #E8E2D8',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Flyer */}
      <div className="flyer">

        {/* Header — navy */}
        <div style={{ background: '#0A2540', padding: '32px 40px 28px', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.5px',
            marginBottom: '4px',
          }}>
            HazloAsí<span style={{ color: '#0EC96A' }}>Ya</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', letterSpacing: '0.05em' }}>
            hazloasiya.com
          </div>
        </div>

        {/* Green accent bar */}
        <div style={{ background: '#0EC96A', height: '4px' }} />

        {/* Body — cream */}
        <div style={{ background: '#F5F0E8', padding: '36px 40px' }}>

          {/* Funnel label */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icon}</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#0A2540',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}>
              {funnelLabel}
              {stateLabel && <span style={{ color: '#0EC96A' }}> · {stateLabel}</span>}
            </div>
            <div style={{ color: 'rgba(10,37,64,0.55)', fontSize: '13px', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto' }}>
              {description}
            </div>
          </div>

          {/* QR code */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{
              background: 'white',
              border: '2px solid #E8E2D8',
              borderRadius: '16px',
              padding: '20px',
              display: 'inline-block',
            }}>
              <QRCodeSVG
                value={link}
                size={160}
                bgColor="#ffffff"
                fgColor="#0A2540"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Scan instruction */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'white',
              border: '1px solid #E8E2D8',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '12px',
              color: 'rgba(10,37,64,0.6)',
              fontWeight: 600,
            }}>
              📱 Escanea con tu teléfono para empezar
            </div>
          </div>

          {/* URL */}
          <div style={{
            background: 'white',
            border: '1px solid #E8E2D8',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '9px', color: 'rgba(10,37,64,0.35)', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {link}
            </div>
          </div>

          {/* Value props */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '28px',
          }}>
            {[
              { icon: '🆓', text: 'Gratis para empezar' },
              { icon: '🇲🇽', text: 'Todo en español' },
              { icon: '📱', text: 'Desde tu teléfono' },
              { icon: '⏱️', text: 'En minutos' },
            ].map(item => (
              <div key={item.text} style={{
                background: 'white',
                border: '1px solid #E8E2D8',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0A2540' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — dark navy */}
        <div style={{ background: '#08213A', padding: '18px 40px', textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '4px' }}>
            Presentado por
          </div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
            {partnerName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', marginTop: '8px' }}>
            Alianza HazloAsíYa · hazloasiya.com/para-organizaciones
          </div>
        </div>
      </div>
    </>
  )
}

export default function FlyerPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#0A2540' }}>Cargando flyer…</div>}>
      <FlyerContent />
    </Suspense>
  )
}
