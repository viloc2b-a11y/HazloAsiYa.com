import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Alianza | HazloAsíYa',
  description: 'Panel de impacto para partners de la Alianza HazloAsíYa.',
  robots: { index: false, follow: false },
}

export default function AlianzaDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
