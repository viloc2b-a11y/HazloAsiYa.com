import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFormBySlug, PDF_CATALOG } from '@/types/pdf'
import PdfFormClient from './PdfFormClient'
import { absoluteUrl, withTrailingSlash } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const dynamicParams = false

export function generateStaticParams() {
  return PDF_CATALOG.map(form => ({ form: form.slug }))
}

type PdfFormParams = Promise<{ form: string }>

export async function generateMetadata({ params }: { params: PdfFormParams }): Promise<Metadata> {
  const { form } = await params
  const formMeta = getFormBySlug(form)
  if (!formMeta) return { title: 'Formulario no encontrado | HazloAsíYa' }

  const path = withTrailingSlash(`/pdf/${formMeta.slug}`)

  return {
    title: `${formMeta.title} en español | HazloAsíYa`,
    description: `${formMeta.description} ${formMeta.who}. Asistente en español y PDF descargable.`,
    openGraph: {
      title: `${formMeta.title} | HazloAsíYa`,
      description: formMeta.description,
      url: absoluteUrl(path),
    },
    alternates: alternatesForPath(path),
  }
}

export default async function PdfFormPage({ params }: { params: PdfFormParams }) {
  const { form } = await params
  const formMeta = getFormBySlug(form)
  if (!formMeta) notFound()
  return <PdfFormClient formMeta={formMeta} />
}
