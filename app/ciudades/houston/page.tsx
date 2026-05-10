import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SNAP, Medicaid y WIC en Houston en español | HazloAsíYa',
  description:
    'Prepara tu solicitud de SNAP, Medicaid o WIC en Houston, Texas completamente en español. Cuestionario gratuito, PDF oficial listo para presentar.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/houston')}` },
  keywords: ['SNAP Houston en español', 'Medicaid Houston hispanos', 'WIC Houston Texas', 'beneficios gobierno Houston'],
  openGraph: {
    title: 'SNAP, Medicaid y WIC en Houston | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en Houston, TX.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/houston')}`,
  },
}

export default function HoustonPage() {
  return (
    <CityLandingPage
      city="Houston"
      state="Texas"
      stateSlug="texas"
      stateAbbr="TX"
      hispanicPct="44%"
      hispanicNum="Más de 1.1 millones"
      hispanicOrigin="mexicana y centroamericana"
      snapPortal="https://yourtexasbenefits.com"
      medicaidPortal="https://yourtexasbenefits.com"
      wicPortal="https://texaswic.org/apply"
      snapPortalLabel="YourTexasBenefits.com"
      medicaidPortalLabel="YourTexasBenefits.com"
      wicPortalLabel="TexasWIC.org"
      seoKeyword="SNAP Houston en español"
      localNote="Houston es la ciudad que más residentes hispanos agregó en todo EE.UU. en 2023, según el Census Bureau."
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
