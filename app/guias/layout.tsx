import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'Guías en español | HazloAsíYa',
  description:
    'Guías paso a paso para trámites en EE.UU.: SNAP, Medicaid, escuela, impuestos y más. Fechas de vigencia y fuentes oficiales.',
  alternates: alternatesForPath('/guias/'),
}

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return children
}
