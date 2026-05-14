import type { Metadata } from 'next'
import CityLandingPage from '@/components/CityLandingPage'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'SNAP, Medicaid y WIC en Miami en español | HazloAsíYa',
  description:
    'Prepara tu solicitud de SNAP, Medicaid o WIC en Miami, Florida completamente en español. Cuestionario gratuito, PDF oficial listo para presentar.',
  alternates: alternatesForPath('/ciudades/miami/'),
  keywords: ['SNAP Miami en español', 'Medicaid Miami hispanos', 'WIC Miami Florida', 'ACCESS Florida Miami', 'beneficios gobierno Miami'],
  openGraph: {
    title: 'SNAP, Medicaid y WIC en Miami | HazloAsíYa',
    description: 'Trámites de gobierno en español para familias hispanas en Miami, FL.',
    url: absoluteUrl('/ciudades/miami/'),
  },
}

export default function MiamiPage() {
  return (
    <CityLandingPage
      city="Miami"
      state="Florida"
      stateSlug="florida"
      stateAbbr="FL"
      hispanicPct="70%"
      hispanicNum="Más de 2.1 millones en el condado Miami-Dade"
      hispanicOrigin="cubana, venezolana, colombiana y dominicana"
      snapPortal="https://www.myflorida.com/accessflorida/"
      medicaidPortal="https://www.myfloridamedicaid.com"
      wicPortal="https://www.floridahealth.gov/programs-and-services/wic/index.html"
      snapPortalLabel="ACCESS Florida"
      medicaidPortalLabel="Florida Medicaid"
      wicPortalLabel="Florida Health WIC"
      seoKeyword="SNAP Miami en español"
      localNote="Miami-Dade es el condado con mayor porcentaje hispano de EE.UU. (70%). En Florida, SNAP se solicita a través del portal ACCESS Florida."
      programs={[
        {
          slug: 'snap',
          label: 'SNAP / Food Assistance',
          icon: '🛒',
          desc: 'Asistencia alimentaria de Florida para familias con ingresos bajos. Aplica en ACCESS Florida.',
          href: '/snap/form/?state=florida',
          formCode: 'CF-ES 2337',
        },
        {
          slug: 'medicaid',
          label: 'Medicaid Florida',
          icon: '🏥',
          desc: 'Seguro médico gratuito o de bajo costo de Florida para familias, niños y adultos.',
          href: '/medicaid/form/?state=florida',
          formCode: 'CF-ES 2337',
        },
        {
          slug: 'wic',
          label: 'WIC Florida',
          icon: '👶',
          desc: 'Alimentos, fórmula y apoyo de lactancia para mujeres embarazadas y niños menores de 5 años.',
          href: '/wic/form/?state=florida',
          formCode: 'WIC-1',
        },
      ]}
    />
  )
}
