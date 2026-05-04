import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFormBySlug, PDF_CATALOG } from '@/types/pdf'
import PdfFormClient from './PdfFormClient'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export function generateStaticParams() {
  return PDF_CATALOG.map(form => ({ form: form.slug }))
}

export async function generateMetadata({ params }: { params: { form: string } }): Promise<Metadata> {
  const formMeta = getFormBySlug(params.form)
  if (!formMeta) return { title: 'Formulario no encontrado | HazloAsíYa' }

  const path = withTrailingSlash(`/pdf/${formMeta.slug}`)
  const canonical = `${SITE_ORIGIN}${path}`

  return {
    title: `${formMeta.title} en español | HazloAsíYa`,
    description: `${formMeta.description} ${formMeta.who}. Asistente en español y PDF descargable.`,
    openGraph: {
      title: `${formMeta.title} | HazloAsíYa`,
      description: formMeta.description,
      url: canonical,
    },
    alternates: { canonical },
  }
}

export default function PdfFormPage({ params }: { params: { form: string } }) {
  const formMeta = getFormBySlug(params.form)
  if (!formMeta) notFound()
  return <PdfFormClient formMeta={formMeta} />
}
