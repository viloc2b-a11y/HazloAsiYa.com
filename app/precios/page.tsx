import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import PricingCard from '@/components/monetization/PricingCard'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'
import checkoutPricesData from '@/data/checkout-prices.json'

const products = checkoutPricesData.products

function usdFromCents(cents: number, suffix = '') {
  const n = cents / 100
  const whole = Number.isInteger(n) ? String(n) : n.toFixed(2)
  return `$${whole}${suffix}`
}

const PRICE_MAIN = usdFromCents(products.main.priceCents)
const PRICE_ANNUAL = usdFromCents(products.annual.priceCents, '/año')
const PRICE_ASSISTED = usdFromCents(products.assisted.priceCents)
const PRICE_REVISION = usdFromCents(products.revisionExpress.priceCents)
const PRICE_KIT_SNAP = usdFromCents(products.kitSnap.priceCents)
const PRICE_KIT_ITIN = usdFromCents(products.kitItin.priceCents)

export const metadata: Metadata = {
  title: 'Planes y precios | HazloAsíYa — Desde $0',
  description: 'Elige tu plan: cuestionario gratis, guía por trámite desde $29, o acceso anual completo. Garantía de reembolso 30 días. Sin sorpresas.',
  alternates: alternatesForPath('/precios/'),
  openGraph: {
    url: absoluteUrl('/precios/'),
    locale: 'es_US',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Precios HazloAsíYa' }],
  },
}

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-2">Planes y precios</h1>
        {/* Dev: montos alineados con Square + data/checkout-prices.json */}
        <p className="text-gray-600 mb-10 max-w-2xl leading-relaxed">
          El cuestionario orientativo es gratuito. Los planes de pago desbloquean guías y materiales según el producto que
          elijas.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">
          <PricingCard
            plan="Gratis"
            price="$0"
            isFree
            features={[
              'Cuestionario de orientación para todos los trámites',
              'Resultado resumido y pasos generales',
              'Sin tarjeta requerida',
            ]}
            ctaText="Empezar gratis →"
            ctaHref="/snap/"
          />
          <PricingCard
            plan={products.main.label}
            price={PRICE_MAIN}
            isPopular
            features={[
              'Plan completo para 1 trámite (pasos, checklist, orientación educativa)',
              'Desbloqueo tras el resultado del cuestionario',
              'Pago único por este producto',
            ]}
            ctaText="Elegir trámite →"
            ctaHref="/snap/"
          />
          <PricingCard
            plan={products.annual.label}
            price={PRICE_ANNUAL}
            features={[
              'Acceso a los 16 trámites durante 12 meses',
              'Mismo flujo: cuestionario → resultado → pago',
              'Renovación según términos vigentes',
            ]}
            ctaText="Ver trámites →"
            ctaHref="/snap/"
          />
          <PricingCard
            plan={products.assisted.label}
            price={PRICE_ASSISTED}
            features={[
              'Revisión asistida orientada a completitud documental (educativa)',
              'No es asesoría legal ni garantía de la agencia',
              'Incluido en el catálogo de checkout como producto aparte',
            ]}
            ctaText="Empezar con un trámite →"
            ctaHref="/snap/"
          />
        </div>

        <section className="rounded-2xl border border-cream bg-white p-6 mb-10">
          <h2 className="font-serif text-2xl text-navy mb-4">Add-ons (después del resultado)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Estos productos aparecen en la página de resultado cuando aplica; el precio cobrado es el mismo que ves aquí.
          </p>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>
              <strong>{products.revisionExpress.label}</strong> — {PRICE_REVISION}
            </li>
            <li>
              <strong>{products.kitSnap.label}</strong> — {PRICE_KIT_SNAP}
            </li>
            <li>
              <strong>{products.kitItin.label}</strong> — {PRICE_KIT_ITIN}
            </li>
          </ul>
        </section>

        <p className="text-sm text-gray-500">
          <Link href="/terms/" className="text-green underline">
            Términos, reembolsos y limitaciones (UPL)
          </Link>{' '}
          ·{' '}
          <Link href="/privacy/" className="text-green underline">
            Privacidad
          </Link>
        </p>
      </main>
    </div>
  )
}
