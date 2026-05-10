import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { SITE_ORIGIN, withTrailingSlash } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SNAP, Medicaid y WIC en Nueva York en español | HazloAsíYa',
  description:
    'Prepara tu solicitud de SNAP, Medicaid o WIC en Nueva York completamente en español. Cuestionario gratuito, PDF oficial listo para presentar.',
  alternates: { canonical: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/nueva-york')}` },
  keywords: ['SNAP Nueva York en español', 'Medicaid Nueva York hispanos', 'WIC Nueva York', 'MyBenefits NY hispanos', 'beneficios gobierno Nueva York'],
  openGraph: {
    title: 'SNAP, Medicaid y WIC en Nueva York | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en Nueva York.',
    url: `${SITE_ORIGIN}${withTrailingSlash('/ciudades/nueva-york')}`,
  },
}

export default function NuevaYorkPage() {
  return (
    <CityLandingPage
      city="Nueva York"
      state="Nueva York"
      stateSlug="new-york"
      stateAbbr="NY"
      hispanicPct="28%"
      hispanicNum="Más de 2.4 millones en la ciudad"
      hispanicOrigin="puertorriqueña, dominicana, mexicana y centroamericana"
      snapPortal="https://www.mybenefits.ny.gov"
      medicaidPortal="https://www.health.ny.gov/health_care/medicaid/"
      wicPortal="https://www.health.ny.gov/prevention/nutrition/wic/"
      snapPortalLabel="MyBenefits NY"
      medicaidPortalLabel="NY Medicaid"
      wicPortalLabel="NY Health WIC"
      seoKeyword="SNAP Nueva York en español"
      localNote="El Bronx tiene 56% de población hispana — la más alta de los 5 boroughs. La comunidad hispana de NYC creció 12% entre 2000 y 2024, según CUNY."
      programs={[
        {
          slug: 'snap',
          label: 'SNAP / Food Stamps',
          icon: '🛒',
          desc: 'Asistencia alimentaria de Nueva York para familias con ingresos bajos. Aplica en MyBenefits.ny.gov.',
          href: '/snap/form/?state=new-york',
          formCode: 'LDSS-4826',
        },
        {
          slug: 'medicaid',
          label: 'Medicaid Nueva York',
          icon: '🏥',
          desc: 'Seguro médico gratuito o de bajo costo de Nueva York para familias, niños y adultos.',
          href: '/medicaid/form/?state=new-york',
          formCode: 'LDSS-2921',
        },
        {
          slug: 'wic',
          label: 'WIC Nueva York',
          icon: '👶',
          desc: 'Alimentos, fórmula y apoyo de lactancia para mujeres embarazadas y niños menores de 5 años.',
          href: '/wic/form/?state=new-york',
          formCode: 'WIC-1',
        },
      ]}
    />
  )
}
