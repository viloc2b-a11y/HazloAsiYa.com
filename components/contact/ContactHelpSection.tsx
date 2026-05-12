'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

const WA_URL = 'https://wa.me/13468761439'

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconHandshake({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="M7 18h1c1.1 0 2.1-.6 2.7-1.5l3.3-5A2 2 0 0 0 15 9h3c1.7 0 3 1.3 3 3v2c0 1.1-.9 2-2 2h-2" />
      <path d="M15 18h2" />
      <path d="M12 22v-5" />
      <path d="M10 18h4" />
    </svg>
  )
}

type CardProps = {
  icon: ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

function ContactCard({ icon, title, children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-teal/20 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${className}`.trim()}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal mb-4">{icon}</div>
      <h3 className="font-semibold text-navy text-lg mb-2">{title}</h3>
      <div className="text-gray-600 text-[15px] leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * Bloque de confianza / contacto para la home y páginas públicas.
 */
export default function ContactHelpSection() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-gradient-to-b from-white via-cream to-cream-2 py-16 sm:py-20 px-4"
      aria-labelledby="contacto-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(18,164,147,0.08),transparent_55%)]" />
      <div className="relative max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-teal mb-3">Contacto</p>
          <h2 id="contacto-heading" className="font-serif text-3xl sm:text-4xl text-navy mb-4">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Estamos aquí para ayudarte paso a paso en español.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <ContactCard title="WhatsApp / Teléfono" icon={<IconWhatsApp className="h-6 w-6" />}>
            <p className="font-semibold text-navy text-xl tracking-tight mb-4">346-876-1439</p>
            <Link
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-xl bg-teal px-5 py-3.5 text-base font-bold text-white shadow-md shadow-teal/25 transition hover:bg-teal-light hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Escríbenos por WhatsApp
            </Link>
          </ContactCard>

          <ContactCard title="Correo de soporte" icon={<IconMail className="h-6 w-6" />}>
            <a
              href="mailto:soporte@hazloasiya.com"
              className="font-medium text-teal underline underline-offset-2 hover:text-navy break-all"
            >
              soporte@hazloasiya.com
            </a>
          </ContactCard>

          <ContactCard title="Ubicación" icon={<IconPin className="h-6 w-6" />}>
            Houston, Texas
          </ContactCard>

          <ContactCard title="Horario" icon={<IconClock className="h-6 w-6" />}>
            <p>Lunes a Viernes</p>
            <p className="font-semibold text-navy mt-1">9:00 AM – 6:00 PM CST</p>
          </ContactCard>
        </div>

        <div className="rounded-2xl border-2 border-teal/25 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgb(8,33,58,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal">
              <IconHandshake className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl sm:text-2xl text-navy mb-2">
                ¿Representas una iglesia o centro comunitario?
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
                Trabajamos con iglesias, escuelas y organizaciones comunitarias para ayudar a más familias hispanas.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                <a
                  href="mailto:alianza@hazloasiya.com"
                  className="text-teal font-semibold underline underline-offset-2 hover:text-navy break-all"
                >
                  alianza@hazloasiya.com
                </a>
                <Link
                  href="mailto:alianza@hazloasiya.com?subject=Alianza%20comunitaria%20%E2%80%94%20HazloAs%C3%ADYa"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-teal bg-white px-6 py-3.5 text-base font-bold text-teal transition hover:bg-teal hover:text-white shadow-sm"
                >
                  Hablar sobre alianzas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
