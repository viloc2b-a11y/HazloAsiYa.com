import { FUNNEL_ORDER } from '@/data/funnels'

export const dynamicParams = false

export async function generateStaticParams() {
  return FUNNEL_ORDER.map(funnel => ({ funnel }))
}

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return children
}

