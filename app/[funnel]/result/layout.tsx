import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { FUNNELS, isValidFunnelId } from '@/data/funnels'

type Props = { children: React.ReactNode; params: Promise<{ funnel: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { funnel } = await params
  const f = isValidFunnelId(funnel) ? FUNNELS[funnel] : undefined
  const title = f ? `${f.name} — resultado | HazloAsíYa` : 'Resultado | HazloAsíYa'
  const description = f
    ? `Tu resumen y siguientes pasos para ${f.name.split('—')[0].trim()}. Desbloquea el plan completo si aplica.`.slice(
        0,
        155,
      )
    : 'Resultado de tu cuestionario HazloAsíYa. Revisa elegibilidad y próximos pasos.'
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: alternatesForPath(`/${funnel}/result/`),
  }
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children
}
