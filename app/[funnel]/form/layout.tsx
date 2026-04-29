import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { FUNNELS, FunnelId } from '@/data/funnels'

type Props = { children: React.ReactNode; params: Promise<{ funnel: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { funnel } = await params
  const f = FUNNELS[funnel as FunnelId]
  const title = f ? `${f.name} — cuestionario | HazloAsíYa` : 'Cuestionario | HazloAsíYa'
  const description = f
    ? f.desc.slice(0, 155)
    : 'Cuestionario gratuito para preparar tu trámite con HazloAsíYa. Sin registro para empezar.'
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: alternatesForPath(`/${funnel}/form/`),
  }
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return children
}
