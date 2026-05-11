import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar a tu cuenta | HazloAsíYa',
  description: 'Inicia sesión o crea tu cuenta en HazloAsíYa para acceder a tus trámites.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
