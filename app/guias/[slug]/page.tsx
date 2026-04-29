import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import Topbar from '@/components/Topbar'
import VerifiedInfoBanner from '@/components/VerifiedInfoBanner'
import { getPublishedGuideSlugs, loadPublishedGuide } from '@/lib/guides-fs'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const dynamicParams = false

export async function generateStaticParams() {
  return getPublishedGuideSlugs().map((slug) => ({ slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const g = loadPublishedGuide(slug)
  if (!g) return {}
  const { data } = g
  const path = `/guias/${slug}/`
  const ogUrl = data.canonical ?? absoluteUrl(path)
  return {
    title: data.title,
    description: data.description,
    alternates: alternatesForPath(path),
    openGraph: {
      title: data.title,
      description: data.description,
      url: ogUrl,
      locale: 'es_US',
      type: 'article',
      images: [{ url: data.ogImage, width: 1200, height: 630, alt: data.h1 }],
    },
  }
}

function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params
  const loaded = loadPublishedGuide(slug)
  if (!loaded) notFound()
  const { data, content } = loaded
  const firstOfficial = data.regulatorySource[0]

  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/guias/" className="hover:text-green">
            Guías
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{data.title}</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-wide text-green mb-2">{data.category}</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-6 leading-tight">{data.h1}</h1>

        <VerifiedInfoBanner officialUrl={firstOfficial} displayPeriod={data.lastVerified} />

        <div className="prose prose-gray max-w-none space-y-6 text-gray-800 mt-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {data.relatedTramites.length > 0 && (
          <div className="mt-12 rounded-2xl border border-navy/10 bg-white p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-navy/50 mb-3">Trámites relacionados</div>
            <ul className="flex flex-wrap gap-2">
              {data.relatedTramites.map((id) => (
                <li key={id}>
                  <Link href={`/${id}/`} className="text-green font-medium hover:underline">
                    /{id}/
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-10">
          Última verificación: {data.lastVerified}. Válido como orientación hasta: {data.dataValidUntil}.
        </p>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(data.schemaFAQ)) }}
      />
    </div>
  )
}
