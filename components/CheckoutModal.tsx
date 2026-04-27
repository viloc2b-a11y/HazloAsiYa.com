'use client'
import { useState } from 'react'
import { checkoutStatic } from '@/lib/static-backend'

interface CheckoutModalProps {
  productId: 'main' | 'annual' | 'assisted'
  funnelId: string
  onSuccess: (productId: string) => void
  onClose: () => void
}

const PRODUCTS = {
  main: {
    price: 19,
    name: 'Guía Completa por Trámite',
    anchor: '$150–$400 con preparador',
    features: [
      '🔓 Todos los pasos desbloqueados',
      '📝 Formulario de ejemplo ya llenado',
      '⚠️ Errores comunes y cómo evitarlos',
      '📋 Instrucciones exactas de entrega',
      '📄 PDF profesional descargable',
    ],
  },
  annual: {
    price: 49,
    name: 'Acceso Anual — 16 Trámites',
    anchor: '$304 si compras por separado',
    features: [
      '🔓 Los 16 trámites desbloqueados',
      '🔔 Alertas cuando cambien requisitos',
      '📁 Historial de tus documentos',
      '💬 Soporte WhatsApp básico',
      '🔄 Actualizaciones por 12 meses',
    ],
  },
  assisted: {
    price: 89,
    name: 'Revisión Asistida por Especialista',
    anchor: '$200–$400 con preparador',
    features: [
      '🔓 Plan completo desbloqueado',
      '👤 Revisión humana de tu paquete',
      '💬 Orientación por WhatsApp',
      '✅ Garantía de paquete correcto',
      '📞 Llamada de orientación (15 min)',
    ],
  },
}

export default function CheckoutModal({ productId, funnelId, onSuccess, onClose }: CheckoutModalProps) {
  const product = PRODUCTS[productId]
  const [processing, setProcessing] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)

  const handlePay = async () => {
    setProcessing(true)
    setError('')

    try {
      const res = await checkoutStatic({ productId })
      if (!res.ok) throw new Error(res.error || 'Pago no disponible')
      setSuccess(true)
      setTimeout(() => onSuccess(productId), 900)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop-in relative overflow-hidden">

        {/* Header */}
        <div className="p-6 pb-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none">×</button>

          <div className="text-center mb-5">
            <div className="flex items-baseline justify-center gap-3 mb-1">
              <span className="font-serif text-5xl" style={{ color: 'var(--navy)' }}>${product.price}</span>
              {product.anchor && (
                <span className="text-gray-400 text-sm line-through">{product.anchor}</span>
              )}
            </div>
            <div className="text-gray-400 text-sm mb-1">Pago único · Sin suscripción · Garantía 30 días</div>
            <div className="font-bold" style={{ color: 'var(--navy)' }}>{product.name}</div>
          </div>

          {/* Features */}
          <div className="rounded-xl p-4 mb-5 space-y-2" style={{ background: 'var(--cream)' }}>
            {product.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span>{f.slice(0,2)}</span>
                <span>{f.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment form */}
        {success ? (
          <div className="px-6 pb-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-serif text-2xl mb-2" style={{ color: 'var(--navy)' }}>¡Pago exitoso!</h3>
            <p className="text-gray-500 text-sm">Tu acceso está activado. Revisa tu correo para la confirmación.</p>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-cream border border-cream-2 rounded-xl p-4 text-sm text-gray-600">
              Pagos deshabilitados en modo export estático. Esta pantalla simula el desbloqueo del plan.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={processing}
              className="btn-primary w-full py-4 text-base"
              style={{ opacity: processing ? 0.65 : 1 }}
            >
              {processing ? 'Procesando…' : `🔒 Pagar $${product.price}`}
            </button>

            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
              <span>🔒 SSL</span>
              <span>·</span>
              <span>VISA · MC · AMEX</span>
              <span>·</span>
              <span>Garantía 30 días</span>
            </div>

            {/* Upsell to annual from main */}
            {productId === 'main' && (
              <div className="border border-dashed rounded-xl p-4 text-center text-sm" style={{ borderColor: 'var(--gold)' }}>
                <div className="font-semibold mb-1" style={{ color: 'var(--gold)' }}>¿Necesitas más de un trámite?</div>
                <div className="text-gray-500 text-xs mb-2">Acceso anual por $49 — todos los trámites por 12 meses</div>
                <button
                  onClick={() => { onClose(); }}
                  className="text-xs font-bold underline"
                  style={{ color: 'var(--gold)' }}
                >
                  Ver acceso anual →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
