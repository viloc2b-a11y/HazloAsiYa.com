import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generador de enlaces | Alianza HazloAsíYa',
  description: 'Genera enlaces de seguimiento personalizados para tu organización aliada.',
  robots: { index: false, follow: false },
}

export default function AlianzaLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
