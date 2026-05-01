import type { FunnelId } from './funnels'

export type FunnelContextLink = { href: string; label: string }

/**
 * Enlaces internos por intención (hub / guía / geo / trámite hermano).
 * Colocación sugerida: tras el aviso de fuentes verificadas y antes del bloque “Qué vas a recibir”.
 */
export function getFunnelContextLinks(id: FunnelId): FunnelContextLink[] {
  const map: Partial<Record<FunnelId, FunnelContextLink[]>> = {
    snap: [
      { href: '/guias/documentos-para-snap/', label: 'Documentos para solicitar SNAP (guía detallada)' },
      { href: '/snap/texas/', label: 'SNAP en Texas: requisitos y datos locales' },
      { href: '/medicaid/', label: 'Medicaid y CHIP si necesitas seguro médico' },
      { href: '/wic/', label: 'WIC para embarazo y niños hasta 5 años' },
      { href: '/guias/', label: 'Índice de guías gratuitas en español' },
    ],
    medicaid: [
      { href: '/guias/como-solicitar-medicaid-en-espanol/', label: 'Cómo solicitar Medicaid en español' },
      { href: '/guias/documentos-para-medicaid/', label: 'Documentos para Medicaid y CHIP en Texas' },
      { href: '/medicaid/texas/', label: 'Medicaid en Texas: guía estatal' },
      { href: '/snap/', label: 'SNAP (cupones de comida) para el hogar' },
      { href: '/wic/', label: 'Programa WIC para madres y bebés' },
      { href: '/guias/', label: 'Todas las guías HazloAsíYa' },
    ],
    itin: [
      { href: '/guias/como-llenar-la-w7/', label: 'Cómo llenar el formulario W-7 paso a paso' },
      { href: '/guias/que-es-el-itin-y-para-que-sirve/', label: 'Qué es el ITIN y para qué sirve' },
      { href: '/itin/houston/', label: 'ITIN y recursos fiscales en Houston' },
      { href: '/taxes/', label: 'Declaración de impuestos IRS en español' },
      { href: '/bank/', label: 'Abrir cuenta bancaria con ITIN' },
      { href: '/guias/', label: 'Guías fiscales y de identificación' },
    ],
    wic: [
      { href: '/wic/texas/', label: 'WIC en Texas: citas y clínicas' },
      { href: '/snap/', label: 'SNAP si necesitas más ayuda alimentaria' },
      { href: '/medicaid/', label: 'Medicaid/CHIP para cobertura del menor' },
      { href: '/guias/', label: 'Guías para familias en Texas' },
    ],
    escuela: [
      {
        href: '/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/',
        label: 'Documentos para inscribir a tu hijo en la escuela pública',
      },
      { href: '/escuela/houston/', label: 'Inscripción escolar en Houston' },
      { href: '/medicaid/', label: 'Medicaid/CHIP para seguro del estudiante' },
      { href: '/snap/', label: 'SNAP para hogares con niños en edad escolar' },
      { href: '/iep/', label: 'IEP y educación especial en Texas' },
      { href: '/guias/', label: 'Más guías escolares y de familia' },
    ],
    daca: [
      { href: '/id/texas/', label: 'Identificación y licencia en Texas' },
      { href: '/bank/', label: 'Cuenta bancaria con documentos válidos' },
      { href: '/itin/', label: 'ITIN si declaras sin SSN elegible' },
      { href: '/taxes/', label: 'Preparar declaración federal' },
      { href: '/guias/', label: 'Guías y trámites en español' },
    ],
    taxes: [
      { href: '/itin/', label: 'Solicitar ITIN con el formulario W-7' },
      { href: '/guias/como-llenar-la-w7/', label: 'Guía del W-7 en español' },
      { href: '/bank/', label: 'Cuenta bancaria para reembolso por depósito directo' },
      { href: '/snap/', label: 'SNAP si el hogar necesita ayuda para comida' },
      { href: '/guias/', label: 'Índice de guías fiscales y sociales' },
    ],
    rent: [
      { href: '/guias/ayuda-para-pagar-renta-en-tu-ciudad/', label: 'Ayuda para pagar renta en tu ciudad' },
      { href: '/guias/ayuda-para-pagar-luz-y-gas/', label: 'Ayuda para luz y gas (LIHEAP y recursos)' },
      { href: '/utilities/', label: 'Descuentos en servicios básicos' },
      { href: '/snap/', label: 'SNAP si la renta deja poco para alimentos' },
      { href: '/guias/', label: 'Más guías de vivienda y beneficios' },
    ],
    id: [
      { href: '/id/texas/', label: 'Licencia e identificación oficial en Texas' },
      { href: '/bank/', label: 'Abrir cuenta bancaria con tu nueva identificación' },
      { href: '/jobs/', label: 'Buscar empleo y recursos laborales' },
      { href: '/matricula/', label: 'Matrícula consular y otros documentos' },
      { href: '/guias/', label: 'Guías de trámites en español' },
    ],
    twc: [
      { href: '/bank/', label: 'Cuenta bancaria para depósito de beneficios' },
      { href: '/snap/', label: 'SNAP mientras buscas trabajo estable' },
      { href: '/jobs/', label: 'Ofertas de empleo y próximos pasos laborales' },
      { href: '/rent/', label: 'Ayuda con renta si el ingreso bajó' },
      { href: '/utilities/', label: 'Descuentos en luz, gas y agua' },
      { href: '/guias/', label: 'Más recursos para hogares en Texas' },
    ],
    iep: [
      {
        href: '/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/',
        label: 'Documentos para inscripción escolar e IEP',
      },
      { href: '/escuela/houston/', label: 'Inscripción y escuela en Houston' },
      { href: '/medicaid/', label: 'Medicaid/CHIP para salud del estudiante' },
      { href: '/prek/', label: 'Pre-K y transición a kinder' },
      { href: '/guias/', label: 'Guías para familias y educación especial' },
    ],
    prek: [
      {
        href: '/guias/documentos-para-inscribir-a-tu-hijo-en-la-escuela/',
        label: 'Documentos para inscribir a tu hijo en la escuela pública',
      },
      { href: '/escuela/houston/', label: 'Pre-K y escuela en Houston' },
      { href: '/wic/', label: 'WIC para embarazo y niños pequeños' },
      { href: '/medicaid/', label: 'Medicaid/CHIP para la familia' },
      { href: '/iep/', label: 'IEP si tu hijo necesita apoyo educativo' },
      { href: '/guias/', label: 'Más guías para padres en Texas' },
    ],
    utilities: [
      { href: '/guias/ayuda-para-pagar-luz-y-gas/', label: 'Ayuda para pagar luz y gas (guía paso a paso)' },
      { href: '/rent/', label: 'Ayuda con renta y vivienda' },
      { href: '/guias/ayuda-para-pagar-renta-en-tu-ciudad/', label: 'Programas locales para pagar la renta' },
      { href: '/snap/', label: 'SNAP si los servicios dejan poco para comida' },
      { href: '/guias/', label: 'Índice de guías de hogar y beneficios' },
    ],
    jobs: [
      { href: '/id/texas/', label: 'Identificación o licencia de Texas para empleo' },
      { href: '/bank/', label: 'Cuenta bancaria para nómina directa' },
      { href: '/twc/', label: 'TWC: desempleo y recursos de workforce' },
      { href: '/matricula/', label: 'Matrícula consular y documentos de trabajo' },
      { href: '/guias/', label: 'Guías laborales y de trámites' },
    ],
    bank: [
      { href: '/taxes/', label: 'Declarar impuestos y reembolso IRS' },
      { href: '/itin/', label: 'ITIN si aún no tienes SSN elegible' },
      { href: '/guias/como-llenar-la-w7/', label: 'Formulario W-7 para solicitar ITIN' },
      { href: '/jobs/', label: 'Empleo y depósitos de nómina' },
      { href: '/snap/', label: 'SNAP si el hogar necesita apoyo alimentario' },
      { href: '/guias/', label: 'Guías fiscales y financieras en español' },
    ],
    matricula: [
      { href: '/bank/', label: 'Bancos que aceptan matrícula consular' },
      { href: '/taxes/', label: 'Declaración de impuestos con ITIN' },
      { href: '/guias/que-es-el-itin-y-para-que-sirve/', label: 'Qué es el ITIN y cómo usarlo' },
      { href: '/id/texas/', label: 'Identificación en Texas después de otros trámites' },
      { href: '/guias/', label: 'Más guías de identificación y finanzas' },
    ],
  }
  return map[id] ?? [{ href: '/guias/', label: 'Guías gratuitas en español' }]
}
