import Link from 'next/link'

const YOUTUBE_ID = 'f6shoxF_334'

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
  const bgClass =
    variant === 'navy'
      ? 'bg-[#08213A]'
      : variant === 'white'
      ? 'bg-white'
      : 'bg-[#F5F0E8]'

  const titleClass =
    variant === 'navy' ? 'text-white' : 'text-[#0A2540]'

  const subtitleClass =
    variant === 'navy' ? 'text-white/70' : 'text-[#0A2540]/60'

  const stepBg =
    variant === 'navy' ? 'bg-white/10 text-white' : 'bg-white text-[#0A2540]'

  return (
    <section className={`${bgClass} py-16 px-4`}>
      <div className="max-w-4xl mx-auto text-center">

        {/* Heading */}
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${titleClass}`}>
          ¿Cómo funciona HazloAsíYa?
        </h2>
        <p className={`text-lg mb-10 max-w-2xl mx-auto ${subtitleClass}`}>
          En solo 3 pasos fáciles puedes completar tus trámites sin complicaciones y en español.
        </p>

        {/* YouTube embed */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-3xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&color=white`}
            title="¿Cómo funciona HazloAsíYa? Trámites en español paso a paso"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* CTA button */}
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-block bg-[#0EC96A] hover:bg-[#0AB55E] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-md"
          >
            {ctaLabel} →
          </Link>
        </div>

        {/* 3-step grid */}
        {showSteps && (
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { num: '1', label: 'Elige tu trámite', desc: 'SNAP, Medicaid, WIC, ITIN, DACA y más' },
              { num: '2', label: 'Responde preguntas simples', desc: 'Te guiamos paso a paso en español' },
              { num: '3', label: 'Descarga tu formulario listo', desc: 'PDF oficial, listo para imprimir o enviar' },
            ].map((step) => (
              <div key={step.num} className={`rounded-xl p-6 text-center ${stepBg}`}>
                <div className="w-10 h-10 rounded-full bg-[#0EC96A] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step.num}
                </div>
                <p className="font-semibold text-base mb-1">{step.label}</p>
                <p className={`text-sm ${variant === 'navy' ? 'text-white/60' : 'text-[#0A2540]/50'}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
