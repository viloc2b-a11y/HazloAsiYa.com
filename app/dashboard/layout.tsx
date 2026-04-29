import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'Dashboard | HazloAsíYa',
  description:
    'Tu cuenta HazloAsíYa: resumen de trámites y acceso a planes desbloqueados. Gestiona tu perfil desde un solo lugar.',
  alternates: alternatesForPath('/dashboard/'),
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
