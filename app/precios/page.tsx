import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import PricingCard from '@/components/monetization/PricingCard'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'Planes y precios | HazloAsíYa — Desde $0',
  description:
    'Elige tu plan: cuestionario gratis, trámite único $14.99, o membresía completa $39/año. Cancelación fácil. Garantía 30 días.',
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
        <p className="text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Transparencia total: precios en USD, reembolso 30 días y cancelación sencilla. El cuestionario orientativo es
          siempre gratuito.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <PricingCard
            plan="Gratis"
            price="$0"
            features={[
              'Cuestionario de orientación para todos los trámites',
              'Resultado resumido y pasos generales',
              'Sin tarjeta requerida',
            ]}
            ctaText="Empezar gratis →"
            ctaHref="/snap/"
          />
          <PricingCard
            plan="Trámite único"
            price="$14.99"
            isPopular
            features={[
              'Guía completa para 1 trámite',
              'Revisión de completitud documental',
              'Plantillas y checklist descargables',
            ]}
            ctaText="Elegir trámite →"
            ctaHref="/snap/"
          />
          <PricingCard
            plan="Membresía anual"
            price="$39/año"
            features={[
              'Todos los trámites y plantillas',
              'Alertas de renovación (cuando aplique)',
              '1 revisión express al mes',
              'Sin contrato · cancela cuando quieras',
            ]}
            ctaText="Activar membresía →"
            ctaHref="/?auth=register"
          />
        </div>

        <section className="rounded-2xl border border-cream bg-white p-6 mb-10">
          <h2 className="font-serif text-2xl text-navy mb-4">Cursos estacionales (venta aparte)</h2>
          <p className="text-sm text-gray-600 mb-4">
            No incluidos en la membresía. Vigencia del contenido indicada en cada curso; si cambian reglas regulatorias,
            pausamos venta hasta actualizar.
          </p>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>
              <strong>ITIN 2026: W-7 paso a paso</strong> — $9.99 · temporada ene–abr
            </li>
            <li>
              <strong>Renovación SNAP / Medicaid</strong> — $9.99 · temporada ago–sep
            </li>
            <li>
              <strong>Inscripción escolar Texas</strong> — $9.99 · temporada mar–jun
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-cream bg-white p-6 mb-10">
          <h2 className="font-serif text-2xl text-navy mb-4">Bundles</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>
              <strong>Kit Familia Completa</strong> — $59 · membresía anual + 2 cursos estacionales a elegir
            </li>
            <li>
              <strong>Paquete Inmigración Básica</strong> — $24.99 · ITIN + escuela + cuentas bancarias (orientación)
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Los bundles y productos puntuales (revisión express, kits digitales) se cobran con <strong>Square</strong>{' '}
            en el checkout alojado cuando estén activos en tu cuenta.
          </p>
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
