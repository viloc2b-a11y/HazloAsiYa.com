import Link from 'next/link'

export type RelatedLinkItem = { href: string; label: string }

type RelatedLinksProps = {
  /** Visible heading; default "Trámites relacionados" */
  title?: string
  links: RelatedLinkItem[]
  /** Optional second line, e.g. state switcher ("Ver también: …") */
  geoLinks?: RelatedLinkItem[]
  geoIntro?: string
  className?: string
}

/**
 * Bloque interno ligero (listado de enlaces) para clusters SEO.
 * Sin tarjetas pesadas; pensado para colocarse bajo CTAs principales.
 */
export default function RelatedLinks({
  title = 'Trámites relacionados',
  links,
  geoLinks,
  geoIntro = 'Ver también:',
  className = '',
}: RelatedLinksProps) {
  return (
    <section
      className={`not-prose border-t border-cream pt-8 pb-2 text-sm ${className}`}
      aria-labelledby="related-links-heading"
    >
      <h2 id="related-links-heading" className="font-serif text-lg text-navy mb-3">
        {title}
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-gray-700 marker:text-green">
        {links.map((item) => (
          <li key={`${item.href}::${item.label}`}>
            <Link href={item.href} className="text-green font-medium hover:underline underline-offset-2">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {geoLinks && geoLinks.length > 0 ? (
        <p className="mt-5 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-navy">{geoIntro}</span>{' '}
          {geoLinks.map((g, i) => (
            <span key={g.href}>
              {i > 0 ? <span className="text-gray-400"> · </span> : null}
              <Link href={g.href} className="text-green font-medium hover:underline underline-offset-2">
                {g.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  )
}
