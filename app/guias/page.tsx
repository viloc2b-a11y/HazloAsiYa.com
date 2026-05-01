import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { getAllGuidesForIndex } from '@/lib/guides-fs'
import { absoluteUrl } from '@/lib/site'

const CATEGORY_LABELS: Record<string, string> = {
  beneficios: 'Beneficios sociales',
  impuestos: 'Impuestos e ITIN',
  escuela: 'Educación',
  vivienda: 'Vivienda',
}

export default function GuiasIndexPage() {
  const guides = getAllGuidesForIndex()
  const byCat = (cat: string) => guides.filter((g) => g.category === cat)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guías de trámites en EE.UU. en español',
    description:
      'Explora guías paso a paso en español para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos, ITIN, renta y más, con fuentes oficiales.',
    url: absoluteUrl('/guias/'),
    inLanguage: 'es-US',
    isPartOf: { '@type': 'WebSite', name: 'HazloAsíYa', url: absoluteUrl('/') },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: absoluteUrl('/guias/') },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: guides.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.title,
        url: absoluteUrl(`/guias/${g.slug}/`),
      })),
    },
  }

  return (
    <div className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <Topbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Guías</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-6">Guías de trámites en EE.UU. en español</h1>

        <div className="space-y-4 text-gray-700 text-sm leading-relaxed mb-10">
          <p>
            Aquí reunimos artículos con <strong>pasos concretos</strong>, listas de <strong>documentos</strong> y{' '}
            <strong>requisitos</strong> que suelen pedir las agencias en EE.UU. Todo está en <strong>español</strong> y
            enlaza a fuentes oficiales (HHSC, USDA FNS, IRS, etc.).
          </p>
          <p>
            Sirven para familias que preparan un <strong>trámite</strong> real: SNAP, Medicaid, escuela pública, ITIN,
            ayuda con renta o servicios. Cada guía indica fecha de verificación; confirma siempre en el portal oficial el
            día que envíes tu solicitud.
          </p>
          <p>
            Si ya sabes qué necesitas, entra a tu categoría. Si no, usa el{' '}
            <Link href="/snap/" className="text-green font-semibold hover:underline">
              cuestionario orientativo de SNAP
            </Link>{' '}
            como primer paso gratuito (muchas familias empiezan por ahí).
          </p>
        </div>

        <section className="mb-12" aria-labelledby="guias-por-categoria">
          <h2 id="guias-por-categoria" className="font-serif text-2xl text-navy mb-4">
            Por categoría
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-navy mb-2">Beneficios sociales</h3>
              <p className="text-sm text-gray-600 mb-2">
                Páginas de trámite:{' '}
                <Link href="/snap/" className="text-green font-medium hover:underline">
                  SNAP
                </Link>
                {' · '}
                <Link href="/medicaid/" className="text-green font-medium hover:underline">
                  Medicaid
                </Link>
                {' · '}
                <Link href="/wic/" className="text-green font-medium hover:underline">
                  WIC
                </Link>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {byCat('beneficios').map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Impuestos e ITIN</h3>
              <p className="text-sm text-gray-600 mb-2">
                <Link href="/itin/" className="text-green font-medium hover:underline">
                  ITIN
                </Link>
                {' · '}
                <Link href="/taxes/" className="text-green font-medium hover:underline">
                  Impuestos
                </Link>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {byCat('impuestos').map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Educación</h3>
              <p className="text-sm text-gray-600 mb-2">
                <Link href="/escuela/" className="text-green font-medium hover:underline">
                  Inscripción escolar
                </Link>
                {' · '}
                <Link href="/iep/" className="text-green font-medium hover:underline">
                  IEP
                </Link>
                {' · '}
                <Link href="/prek/" className="text-green font-medium hover:underline">
                  Pre-K
                </Link>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {byCat('escuela').map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Vivienda</h3>
              <p className="text-sm text-gray-600 mb-2">
                <Link href="/rent/" className="text-green font-medium hover:underline">
                  Renta
                </Link>
                {' · '}
                <Link href="/utilities/" className="text-green font-medium hover:underline">
                  Servicios públicos
                </Link>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {byCat('vivienda').map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Trabajo y documentos</h3>
              <p className="text-sm text-gray-600 mb-2">
                <Link href="/id/texas/" className="text-green font-medium hover:underline">
                  Texas ID / licencia
                </Link>
                {' · '}
                <Link href="/jobs/" className="text-green font-medium hover:underline">
                  Empleo
                </Link>
                {' · '}
                <Link href="/bank/" className="text-green font-medium hover:underline">
                  Cuenta bancaria
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-navy/10 bg-white p-6" aria-labelledby="guias-por-estado">
          <h2 id="guias-por-estado" className="font-serif text-2xl text-navy mb-3">
            Por estado: Texas
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/snap/texas/" className="text-green font-semibold hover:underline">
                SNAP Texas — límites y cómo aplicar
              </Link>
            </li>
            <li>
              <Link href="/medicaid/texas/" className="text-green font-medium hover:underline">
                Medicaid y CHIP en Texas
              </Link>
            </li>
            <li>
              <Link href="/itin/houston/" className="text-green font-medium hover:underline">
                ITIN y recursos en Houston
              </Link>
            </li>
            <li>
              <Link href="/wic/texas/" className="text-green font-medium hover:underline">
                WIC en Texas — clínicas y cita
              </Link>
            </li>
            <li>
              <Link href="/escuela/houston/" className="text-green font-medium hover:underline">
                Inscripción escolar en Houston
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border-2 border-green/30 bg-emerald-50/60 p-6 mb-12" aria-labelledby="guias-empieza">
          <h2 id="guias-empieza" className="font-serif text-xl text-navy mb-2">
            Empieza aquí
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Si no sabes por dónde empezar, completa el cuestionario gratis: en minutos ordenas qué documentos buscar y
            qué sigue.
          </p>
          <Link href="/snap/" className="btn-primary inline-block px-6 py-3 text-sm">
            Ir al cuestionario de SNAP (gratis) →
          </Link>
        </section>

        <section aria-labelledby="guias-todas">
          <h2 id="guias-todas" className="font-serif text-xl text-navy mb-4">
            Todas las guías (A–Z)
          </h2>
          <ul className="space-y-4">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guias/${g.slug}/`}
                  className="block rounded-2xl border border-navy/10 bg-white p-5 shadow-sm hover:border-green/40 hover:shadow-md transition"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-green">
                    {CATEGORY_LABELS[g.category] ?? g.category}
                  </span>
                  <h2 className="font-serif text-xl text-navy mt-1">{g.title}</h2>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{g.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
