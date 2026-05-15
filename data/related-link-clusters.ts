/**
 * Enlaces relacionados para clusters SEO (funnels, estados, guías).
 * Solo rutas que existen en el sitio estático.
 */

import type { FunnelId } from '@/data/funnels'

export type RelatedLinkItem = { href: string; label: string }

export type RelatedCluster = {
  links: RelatedLinkItem[]
  geoLinks?: RelatedLinkItem[]
}

/** SNAP hub /snap/ */
export const RELATED_SNAP_HUB: RelatedLinkItem[] = [
  { href: '/medicaid/', label: 'Cómo solicitar Medicaid y CHIP para tu familia' },
  { href: '/rent/', label: 'Ayuda para renta y vivienda en español' },
  { href: '/escuela/', label: 'Cómo preparar documentos para la escuela pública' },
  { href: '/guias/documentos-para-snap/', label: 'Lista de documentos para solicitar SNAP' },
]

/** Medicaid hub /medicaid/ */
export const RELATED_MEDICAID_HUB: RelatedLinkItem[] = [
  { href: '/snap/', label: 'SNAP (cupones de comida) para el hogar' },
  { href: '/guias/como-solicitar-medicaid-en-espanol/', label: 'Cómo solicitar Medicaid paso a paso en español' },
  { href: '/guias/documentos-para-medicaid/', label: 'Documentos para Medicaid y CHIP' },
  { href: '/id/texas/', label: 'Texas ID o licencia de conducir — requisitos DPS' },
  { href: '/escuela/', label: 'Inscripción escolar y seguro para estudiantes' },
]

/** ITIN hub /itin/ */
export const RELATED_ITIN_HUB: RelatedLinkItem[] = [
  { href: '/taxes/', label: 'Declaración de impuestos IRS en español' },
  { href: '/bank/', label: 'Abrir cuenta bancaria con ITIN o ID' },
  { href: '/jobs/', label: 'Empleo: I-9, W-4 y documentos laborales' },
  { href: '/guias/como-llenar-la-w7/', label: 'Cómo llenar el formulario W-7 (ITIN)' },
  { href: '/guias/que-es-el-itin-y-para-que-sirve/', label: 'Qué es el ITIN y para qué sirve' },
]

/** Escuela hub /escuela/ */
export const RELATED_ESCUELA_HUB: RelatedLinkItem[] = [
  {
    href: '/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/',
    label: 'Vacunas y documentos para inscribir a tu hijo en la escuela pública',
  },
  { href: '/medicaid/', label: 'Medicaid y CHIP para niños y familia' },
  { href: '/rent/', label: 'Ayuda con renta y vivienda (McKinney-Vento y más)' },
  { href: '/snap/', label: 'SNAP si el hogar necesita apoyo alimentario' },
  { href: '/iep/', label: 'Evaluación IEP y educación especial' },
]

/** Renta / vivienda hub /rent/ (no existe ruta /vivienda/) */
export const RELATED_RENT_HUB: RelatedLinkItem[] = [
  { href: '/guias/ayuda-para-pagar-renta-en-tu-ciudad/', label: 'Programas para pagar renta en tu ciudad' },
  { href: '/guias/ayuda-para-pagar-luz-y-gas/', label: 'Ayuda para pagar luz y gas (LIHEAP y recursos)' },
  { href: '/utilities/', label: 'Descuentos en servicios básicos del hogar' },
  { href: '/snap/', label: 'SNAP si la renta deja poco para alimentos' },
  { href: '/medicaid/', label: 'Medicaid por ingresos o situación del hogar' },
]

/** ID hub /id/ */
export const RELATED_ID_HUB: RelatedLinkItem[] = [
  { href: '/id/texas/', label: 'Texas ID y licencia: guía estatal detallada' },
  { href: '/jobs/', label: 'Buscar empleo con identificación en regla' },
  { href: '/bank/', label: 'Abrir cuenta bancaria con tu nueva identificación' },
  { href: '/matricula/', label: 'Matrícula consular y otros documentos de identidad' },
  { href: '/medicaid/texas/', label: 'Medicaid en Texas si necesitas cobertura médica' },
]

export const SNAP_STATE_GEO: RelatedLinkItem[] = [
  { href: '/snap/texas/', label: 'SNAP en Texas' },
  { href: '/snap/california/', label: 'SNAP en California (CalFresh)' },
  { href: '/snap/florida/', label: 'SNAP en Florida' },
  { href: '/snap/new-york/', label: 'SNAP en Nueva York' },
]

export const MEDICAID_STATE_GEO: RelatedLinkItem[] = [
  { href: '/medicaid/texas/', label: 'Medicaid en Texas' },
  { href: '/medicaid/california/', label: 'Medicaid en California' },
  { href: '/medicaid/florida/', label: 'Medicaid en Florida' },
  { href: '/medicaid/new-york/', label: 'Medicaid en Nueva York' },
]

export function excludeGeoByHref(all: RelatedLinkItem[], hrefToOmit: string): RelatedLinkItem[] {
  return all.filter((x) => x.href !== hrefToOmit)
}

/** Páginas estatales SNAP: enlaces temáticos + geo sin la página actual */
export const RELATED_SNAP_TEXAS: RelatedLinkItem[] = [
  { href: '/medicaid/texas/', label: 'Cómo solicitar Medicaid en Texas' },
  { href: '/wic/texas/', label: 'WIC en Texas para embarazo y niños pequeños' },
  { href: '/rent/', label: 'Ayuda para renta y vivienda' },
  { href: '/escuela/', label: 'Documentos para inscripción escolar en Texas' },
  { href: '/guias/documentos-para-snap/', label: 'Documentos para solicitar SNAP (guía)' },
  { href: '/snap/', label: 'SNAP en todos los estados (hub principal)' },
]

export const RELATED_SNAP_CALIFORNIA: RelatedLinkItem[] = [
  { href: '/medicaid/california/', label: 'Medi-Cal (Medicaid) en California' },
  { href: '/wic/california/', label: 'WIC en California' },
  { href: '/rent/', label: 'Ayuda para renta y vivienda' },
  { href: '/escuela/', label: 'Inscripción escolar y documentos en español' },
  { href: '/guias/documentos-para-snap/', label: 'Documentos para SNAP / CalFresh' },
  { href: '/snap/', label: 'SNAP — hub y otros estados' },
]

export const RELATED_SNAP_FLORIDA: RelatedLinkItem[] = [
  { href: '/medicaid/florida/', label: 'Medicaid en Florida para familias' },
  { href: '/wic/florida/', label: 'WIC en Florida' },
  { href: '/rent/', label: 'Ayuda para renta y vivienda' },
  { href: '/escuela/', label: 'Documentos para la escuela pública' },
  { href: '/guias/documentos-para-snap/', label: 'Documentos para solicitar SNAP' },
  { href: '/snap/', label: 'SNAP — hub principal' },
]

export const RELATED_SNAP_NEW_YORK: RelatedLinkItem[] = [
  { href: '/medicaid/new-york/', label: 'Medicaid en Nueva York' },
  { href: '/wic/new-york/', label: 'WIC en Nueva York' },
  { href: '/rent/', label: 'Ayuda para renta y vivienda' },
  { href: '/escuela/', label: 'Inscripción escolar y papeles del distrito' },
  { href: '/guias/documentos-para-snap/', label: 'Documentos para SNAP en Nueva York' },
  { href: '/snap/', label: 'SNAP — hub y otros estados' },
]

/** Landings principales con bloque "Trámites relacionados" al pie. */
export function getRelatedClusterForFunnel(id: FunnelId): RelatedCluster | null {
  switch (id) {
    case 'snap':
      return { links: RELATED_SNAP_HUB, geoLinks: SNAP_STATE_GEO }
    case 'medicaid':
      return { links: RELATED_MEDICAID_HUB, geoLinks: MEDICAID_STATE_GEO }
    case 'itin':
      return { links: RELATED_ITIN_HUB }
    case 'escuela':
      return { links: RELATED_ESCUELA_HUB }
    case 'rent':
      return { links: RELATED_RENT_HUB }
    case 'id':
      return { links: RELATED_ID_HUB }
    default:
      return null
  }
}
