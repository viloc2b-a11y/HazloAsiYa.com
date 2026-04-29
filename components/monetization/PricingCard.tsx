import Link from 'next/link'
import Disclosure from '@/components/legal/Disclosure'

export type PricingCardProps = {
  plan: string
  price: string
  priceNote?: string
  features: string[]
  isPopular?: boolean
  ctaText: string
  ctaHref: string
  hasAffiliate?: boolean
}

/**
 * Tarjeta de precio con divulgaciones FTC (reembolso, sin urgencia falsa).
 */
export default function PricingCard({
  plan,
  price,
  priceNote = 'Precio en USD. Impuestos aplicables según tu ubicación.',
  features,
  isPopular,
  ctaText,
  ctaHref,
  hasAffiliate,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border-2 p-6 flex flex-col h-full ${
        isPopular ? 'border-green bg-white shadow-lg' : 'border-cream bg-white'
      }`}
    >
      {isPopular && (
        <span className="text-xs font-bold uppercase tracking-wide text-green mb-2">Más popular</span>
      )}
      <h3 className="font-serif text-xl text-navy mb-1">{plan}</h3>
      <p className="text-3xl font-bold text-navy mb-1">{price}</p>
      <p className="text-xs text-gray-500 mb-4">{priceNote}</p>
      <p className="text-xs text-gray-600 mb-4">Pago procesado de forma segura con Square (checkout alojado).</p>
      <ul className="space-y-2 text-sm text-gray-700 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-green">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mb-3">
        Garantía de reembolso 30 días (sin preguntas). Membresía: cancelación en 1 clic, sin penalización.
      </p>
      {hasAffiliate && (
        <div className="mb-3">
          <Disclosure variant="affiliate" />
        </div>
      )}
      <div className="mb-3">
        <Disclosure variant="paid-service" />
      </div>
      <Link href={ctaHref} className="btn-primary w-full text-center py-3 block">
        {ctaText}
      </Link>
      <Link href="/terms/" className="text-xs text-green underline text-center mt-3 block">
        Términos y reembolsos
      </Link>
    </div>
  )
}
