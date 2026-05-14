import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SNAP, Medicaid y WIC en Dallas en español | HazloAsíYa',
  description:
    'Prepara tu solicitud de SNAP, Medicaid o WIC en Dallas, Texas completamente en español. Cuestionario gratuito, PDF oficial listo para presentar.',
  alternates: alternatesForPath('/ciudades/dallas/'),
  keywords: ['SNAP Dallas en español', 'Medicaid Dallas hispanos', 'WIC Dallas Texas', 'beneficios gobierno Dallas'],
  openGraph: {
    title: 'SNAP, Medicaid y WIC en Dallas | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en Dallas, TX.',
    url: absoluteUrl('/ciudades/dallas/'),
  },
}

export default function DallasPage() {
  return (
    <CityLandingPage
      city="Dallas"
      state="Texas"
      stateSlug="texas"
      stateAbbr="TX"
      hispanicPct="42%"
      hispanicNum="Más de 500,000"
      hispanicOrigin="mexicana y centroamericana"
      snapPortal="https://yourtexasbenefits.com"
      medicaidPortal="https://yourtexasbenefits.com"
      wicPortal="https://texaswic.org/apply"
      snapPortalLabel="YourTexasBenefits.com"
      medicaidPortalLabel="YourTexasBenefits.com"
      wicPortalLabel="TexasWIC.org"
      seoKeyword="SNAP Dallas en español"
      localNote="El área metropolitana de Dallas-Fort Worth tiene más de 1.3 millones de residentes hispanos."
      programs={[
        {
          slug: 'snap',
          label: 'SNAP / Estampillas',
          icon: '🛒',
          desc: 'Asistencia alimentaria para familias con ingresos bajos en Texas. Aplica en línea en YourTexasBenefits.com.',
          href: '/snap/form/?state=texas',
          formCode: 'H1010',
        },
        {
          slug: 'medicaid',
          label: 'Medicaid Texas',
          icon: '🏥',
          desc: 'Seguro médico gratuito o de bajo costo para familias, niños, embarazadas y personas con discapacidad.',
          href: '/medicaid/form/?state=texas',
          formCode: 'Form 1',
        },
        {
          slug: 'wic',
          label: 'WIC Texas',
          icon: '👶',
          desc: 'Alimentos, fórmula y apoyo de lactancia para mujeres embarazadas, madres y niños menores de 5 años.',
          href: '/wic/form/?state=texas',
          formCode: 'WIC-1',
        },
      ]}
    />
  )
}
