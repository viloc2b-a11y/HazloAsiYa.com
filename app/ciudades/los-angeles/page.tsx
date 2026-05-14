import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'CalFresh, Medi-Cal y WIC en Los Ángeles | HazloAsíYa',
  description:
    'CalFresh, Medi-Cal y WIC en Los Ángeles: documentos, pasos y recursos locales en español.',
  alternates: alternatesForPath('/ciudades/los-angeles/'),
  keywords: ['CalFresh Los Ángeles en español', 'Medi-Cal Los Ángeles hispanos', 'WIC Los Ángeles California', 'beneficios gobierno Los Ángeles'],
  openGraph: {
    title: 'CalFresh, Medi-Cal y WIC en Los Ángeles | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en Los Ángeles, CA.',
    url: absoluteUrl('/ciudades/los-angeles/'),
  },
}

export default function LosAngelesPage() {
  return (
    <CityLandingPage
      city="Los Ángeles"
      state="California"
      stateSlug="california"
      stateAbbr="CA"
      hispanicPct="47%"
      hispanicNum="Más de 1.8 millones en la ciudad; 4.8 millones en el condado"
      hispanicOrigin="mexicana y centroamericana"
      snapPortal="https://www.benefitscal.com"
      medicaidPortal="https://www.benefitscal.com"
      wicPortal="https://www.cdph.ca.gov/Programs/CFH/DWICSN/Pages/Program-Landing1.aspx"
      snapPortalLabel="BenefitsCal.com"
      medicaidPortalLabel="BenefitsCal.com"
      wicPortalLabel="CDPH WIC California"
      seoKeyword="CalFresh Los Ángeles en español"
      localNote="En California, SNAP se llama CalFresh y Medicaid se llama Medi-Cal. Los formularios son diferentes a los de Texas — HazloAsíYa ya los tiene configurados para California."
      programs={[
        {
          slug: 'snap',
          label: 'CalFresh (SNAP)',
          icon: '🛒',
          desc: 'Asistencia alimentaria de California para familias con ingresos bajos. Aplica en BenefitsCal.com.',
          href: '/snap/form/?state=california',
          formCode: 'CF 285',
        },
        {
          slug: 'medicaid',
          label: 'Medi-Cal (Medicaid)',
          icon: '🏥',
          desc: 'Seguro médico gratuito o de bajo costo de California para familias, niños y adultos.',
          href: '/medicaid/form/?state=california',
          formCode: 'MC 210',
        },
        {
          slug: 'wic',
          label: 'WIC California',
          icon: '👶',
          desc: 'Alimentos, fórmula y apoyo de lactancia para mujeres embarazadas y niños menores de 5 años.',
          href: '/wic/form/?state=california',
          formCode: 'WIC-1',
        },
      ]}
    />
  )
}
