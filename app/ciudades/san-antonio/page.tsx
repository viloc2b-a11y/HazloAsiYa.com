import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SNAP, Medicaid y WIC en San Antonio en español | HazloAsíYa',
  description:
    'Prepara tu solicitud de SNAP, Medicaid o WIC en San Antonio, Texas completamente en español. Cuestionario gratuito, PDF oficial listo para presentar.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/san-antonio')}` },
  keywords: ['SNAP San Antonio en español', 'Medicaid San Antonio hispanos', 'WIC San Antonio Texas', 'beneficios gobierno San Antonio'],
  openGraph: {
    title: 'SNAP, Medicaid y WIC en San Antonio | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en San Antonio, TX.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/san-antonio')}`,
  },
}

export default function SanAntonioPage() {
  return (
    <CityLandingPage
      city="San Antonio"
      state="Texas"
      stateSlug="texas"
      stateAbbr="TX"
      hispanicPct="63%"
      hispanicNum="Más de 916,000"
      hispanicOrigin="mexicana y tejana"
      snapPortal="https://yourtexasbenefits.com"
      medicaidPortal="https://yourtexasbenefits.com"
      wicPortal="https://texaswic.org/apply"
      snapPortalLabel="YourTexasBenefits.com"
      medicaidPortalLabel="YourTexasBenefits.com"
      wicPortalLabel="TexasWIC.org"
      seoKeyword="SNAP San Antonio en español"
      localNote="San Antonio es la ciudad grande con mayor porcentaje hispano en EE.UU. — 63% de la población es de origen hispano."
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
