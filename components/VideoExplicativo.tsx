'use client'

import Link from 'next/link'
import { useState } from 'react'

const YOUTUBE_ID = 'f6shoxF_334'
const THUMB_SRC = `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&color=white`

interface VideoExplicativoProps {
  /** Override the CTA button href. Defaults to "/" */
  ctaHref?: string
  /** Override the CTA button label */
  ctaLabel?: string
  /** Show the 3-step grid below the video. Default: true */
  showSteps?: boolean
  /** Background variant */
  variant?: 'cream' | 'navy' | 'white'
}

export default function VideoExplicativo({
  ctaHref = '/',
  ctaLabel = 'Comenzar mi trámite ahora',
  showSteps = true,
  variant = 'cream',
}: VideoExplicativoProps) {
  const [play, setPlay] = useState(false)

  const bgClass =
    variant === 'navy'
      ? 'bg-[#08213A]'
      : variant === 'white'
        ? 'bg-white'
        : 'bg-[#F5F0E8]'

  const titleClass = variant === 'navy' ? 'text-white' : 'text-[#0A2540]'

  const subtitleClass = variant === 'navy' ? 'text-white/70' : 'text-[#0A2540]/60'

  const stepBg = variant === 'navy' ? 'bg-white/10 text-white' : 'bg-white text-[#0A2540]'

  return (
    <section className={`${bgClass} py-16 px-4`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>¿Cómo funciona HazloAsíYa?</h2>
        <p className={`text-lg mb-10 max-w-2xl mx-auto ${subtitleClass}`}>
          En solo 3 pasos fáciles puedes completar tus trámites sin complicaciones y en español.
        </p>

        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-3xl">
          {play ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={EMBED_SRC}
              title="¿Cómo funciona HazloAsíYa? Trámites en español paso a paso"
              allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlay(true)}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EC96A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Reproducir vídeo: ¿Cómo funciona HazloAsíYa?"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static thumb from YouTube CDN; avoids image optimizer config */}
              <img
                src={THUMB_SRC}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
              <span
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#08213A] shadow-lg transition-transform group-hover:scale-110 group-active:scale-95"
                aria-hidden
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>

        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex min-h-[44px] items-center justify-center bg-[#0EC96A] px-8 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-[#0AB55E] rounded-xl"
          >
            {ctaLabel} →
          </Link>
        </div>

        {showSteps && (
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3 mx-auto">
            {[
              { num: '1', label: 'Elige tu trámite', desc: 'SNAP, Medicaid, WIC, ITIN, DACA y más' },
              { num: '2', label: 'Responde preguntas simples', desc: 'Te guiamos paso a paso en español' },
              { num: '3', label: 'Descarga tu formulario listo', desc: 'PDF oficial, listo para imprimir o enviar' },
            ].map((step) => (
              <div key={step.num} className={`rounded-xl p-6 text-center ${stepBg}`}>
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0EC96A] text-lg font-bold text-white">
                  {step.num}
                </div>
                <p className="mb-1 text-base font-semibold">{step.label}</p>
                <p className={`text-sm ${variant === 'navy' ? 'text-white/60' : 'text-[#0A2540]/50'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
