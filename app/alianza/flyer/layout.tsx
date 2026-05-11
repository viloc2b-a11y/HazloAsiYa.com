import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flyer de Alianza | HazloAsíYa',
  description: 'Flyer imprimible para partners de la Alianza HazloAsíYa.',
  robots: { index: false, follow: false },
}

export default function FlyerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
