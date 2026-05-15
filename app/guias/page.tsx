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

/** Guías de listas de documentos e identificación fiscal (orden estable, sin duplicar en “Beneficios”). */
const DOCUMENT_IDENTITY_SLUGS = [
  'documentos-para-snap',
  'documentos-para-medicaid',
  'documentos-para-inscribir-a-tu-hijo-en-la-escuela',
  'como-llenar-la-w7',
  'que-es-el-itin-y-para-que-sirve',
] as const

export default function GuiasIndexPage() {
  const guides = getAllGuidesForIndex()
  const byCat = (cat: string) => guides.filter((g) => g.category === cat)
  const bySlug = (slug: string) => guides.find((g) => g.slug === slug)
  const beneficiosProgramGuides = byCat('beneficios').filter((g) => g.slug === 'como-solicitar-medicaid-en-espanol')
  const documentIdentityGuides = [...DOCUMENT_IDENTITY_SLUGS]
    .map((slug) => bySlug(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guías para trámites en EE.UU. en español',
    description:
      'Listas de documentos, pasos, errores comunes y enlaces a fuentes oficiales para trámites en EE.UU. — en español.',
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
      <section className="bg-navy text-white px-4 py-16 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-green mb-3">GUÍAS</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-white max-w-2xl mx-auto mb-4">
          Guías para trámites en EE.UU. en español
        </h1>
        <p className="text-white/65 text-base max-w-xl mx-auto leading-relaxed">
          Listas de documentos, pasos concretos, errores que suelen devolver un caso y enlaces a portales oficiales —
          para aplicar con menos vueltas.
        </p>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="space-y-4 text-gray-700 text-sm leading-relaxed mb-10">
          <p>
            Aquí agrupamos artículos por tema: <strong>beneficios públicos</strong>,{' '}
            <strong>documentos e identidad</strong>, <strong>escuela y familia</strong>, <strong>impuestos y empleo</strong>{' '}
            y <strong>vivienda y servicios</strong>. Cada pieza enlaza a fuentes oficiales (HHSC, USDA FNS, IRS, HUD,
            etc.) y lleva fecha de verificación — confirma siempre en el portal el día que envíes tu solicitud.
          </p>
          <p>
            Si ya sabes qué trámite necesitas, abre la guía o la landing del trámite. Si no, puedes empezar por el{' '}
            <Link href="/snap/" className="text-green font-semibold hover:underline">
              cuestionario orientativo de SNAP
            </Link>{' '}
            (gratis) o por{' '}
            <Link href="/medicaid/" className="text-green font-semibold hover:underline">
              Medicaid y CHIP
            </Link>
            .
          </p>
        </div>

        <section className="mb-12" aria-labelledby="guias-por-tema">
          <h2 id="guias-por-tema" className="font-serif text-2xl text-navy mb-6">
            Explora por tema
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="font-serif text-lg text-navy mb-2">Beneficios públicos</h3>
              <p className="text-sm text-gray-600 mb-2">
                Landings:{' '}
                <Link href="/snap/" className="text-green font-medium hover:underline">
                  SNAP
                </Link>
                {' · '}
                <Link href="/medicaid/" className="text-green font-medium hover:underline">
                  Medicaid y CHIP
                </Link>
                {' · '}
                <Link href="/wic/" className="text-green font-medium hover:underline">
                  WIC
                </Link>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {beneficiosProgramGuides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg text-navy mb-2">Documentos e identidad</h3>
              <p className="text-sm text-gray-600 mb-2">
                Listas para carpeta y fiscalidad: SNAP, Medicaid, escuela, W-7 e ITIN. Identificación:{' '}
                <Link href="/id/texas/" className="text-green font-medium hover:underline">
                  Texas ID o licencia
                </Link>
                {' · '}
                <Link href="/matricula/" className="text-green font-medium hover:underline">
                  Matrícula consular
                </Link>
                {' · '}
                <Link href="/bank/" className="text-green font-medium hover:underline">
                  Cuenta bancaria
                </Link>
                .
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {documentIdentityGuides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guias/${g.slug}/`} className="text-green font-medium hover:underline">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg text-navy mb-2">Escuela y familia</h3>
              <p className="text-sm text-gray-600 mb-2">
                Inscripción y apoyos; la guía de documentos del colegio está arriba en “Documentos e identidad”.
              </p>
              <p className="text-sm text-gray-700">
                <Link href="/escuela/" className="text-green font-semibold hover:underline">
                  Inscripción escolar pública
                </Link>
                {' · '}
                <Link href="/iep/" className="text-green font-semibold hover:underline">
                  IEP y educación especial
                </Link>
                {' · '}
                <Link href="/prek/" className="text-green font-semibold hover:underline">
                  Pre-K
                </Link>
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg text-navy mb-2">Impuestos y empleo</h3>
              <p className="text-sm text-gray-600 mb-2">
                Guías del W-7 y del ITIN arriba; aquí los trámites tipo declaración y nómina.
              </p>
              <p className="text-sm text-gray-700">
                <Link href="/taxes/" className="text-green font-semibold hover:underline">
                  Declaración de impuestos (IRS)
                </Link>
                {' · '}
                <Link href="/jobs/" className="text-green font-semibold hover:underline">
                  Empleo (I-9, W-4)
                </Link>
                {' · '}
                <Link href="/itin/" className="text-green font-semibold hover:underline">
                  Solicitud de ITIN
                </Link>
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg text-navy mb-2">Vivienda y servicios</h3>
              <p className="text-sm text-gray-600 mb-2">
                Renta, luz y gas; enlaces a trámites de hogar en HazloAsíYa.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <Link href="/rent/" className="text-green font-medium hover:underline">
                  Ayuda para renta
                </Link>
                {' · '}
                <Link href="/utilities/" className="text-green font-medium hover:underline">
                  Servicios públicos (luz, gas)
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
                  <h3 className="font-serif text-xl text-navy mt-1">{g.title}</h3>
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
