/**
 * Fuente única de textos legales / disclaimers (español).
 * Revisar con abogado antes de producción.
 */

export const DISCLAIMER_GENERAL =
  'HazloAsíYa es una plataforma educativa privada. No somos una agencia gubernamental, bufete de abogados ni firma de preparación de impuestos licenciada. Esta información es orientativa y no sustituye asesoría profesional. Los requisitos pueden cambiar — verifica en la fuente oficial antes de enviar tu solicitud.'

export const DISCLAIMER_ITIN = `${DISCLAIMER_GENERAL} HazloAsíYa no es un Acceptance Agent del IRS ni un preparador de impuestos certificado (CPA/EA). Para preparar el formulario W-7 o declaraciones de impuestos, te recomendamos el programa VITA del IRS (gratuito, irs.gov/vita) o un profesional licenciado.`

export const DISCLAIMER_MEDICAID_TX = `${DISCLAIMER_GENERAL} Nota Texas: Texas no adoptó la expansión Medicaid del ACA. Los adultos sin hijos dependientes menores generalmente no califican para Medicaid en Texas. Esta guía describe los grupos que sí pueden calificar.`

export const DISCLAIMER_INMIGRACION = `${DISCLAIMER_GENERAL} Los trámites migratorios pueden afectar tu estatus legal. Te recomendamos consultar a un abogado de inmigración o una organización acreditada por el DOJ antes de enviar cualquier solicitud migratoria.`

export const DISCLAIMER_AFILIADO =
  '⚠ Aviso: Este artículo contiene enlaces de afiliados. Si contratas un servicio a través de estos enlaces, HazloAsíYa puede recibir una comisión sin costo adicional para ti. Esto no afecta nuestra evaluación — solo incluimos servicios que hemos revisado.'

export const DISCLAIMER_DATOS =
  'Los documentos que compartes con nosotros se usan exclusivamente para el servicio que solicitaste y se eliminan automáticamente a los 90 días. No vendemos ni compartimos tus documentos con terceros.'

export const DISCLAIMER_COPPA =
  'Este formulario es para padres o tutores adultos. Si eres menor de 18 años, pide a un adulto de tu familia que te ayude a completarlo.'

export const DISCLAIMER_MONETIZACION_CURSO =
  '📚 Contenido de pago: Este recurso requiere un plan activo de HazloAsíYa. El cuestionario de elegibilidad es siempre gratuito.'

/**
 * Disclaimer específico para formularios oficiales pre-llenados (UPL + FTC).
 * Mostrar SIEMPRE en la pantalla de descarga del formulario.
 */
export const DISCLAIMER_FORMULARIO_OFICIAL =
  'HazloAsíYa NO es una agencia gubernamental ni bufete de abogados. Este formulario es un borrador orientativo preparado con la información que proporcionaste. No garantizamos su aceptación por la agencia. Revisa todos los campos antes de firmar y enviar. Si tu caso es complejo (estatus migratorio, ingresos variables, discapacidad), consulta a un profesional calificado.'

/** Versión corta para la pantalla de descarga del formulario pre-llenado. */
export const DISCLAIMER_DESCARGA_FORMULARIO =
  '⚠️ Borrador orientativo: Revisa cada campo antes de firmar. HazloAsíYa no es agencia gubernamental ni asesor legal. No garantiza aprobación por la agencia.'

/** Disclaimer para la página de precios — posicionamiento correcto del producto. */
export const DISCLAIMER_PRICING =
  'HazloAsíYa prepara borradores de formularios con base en la información que el usuario proporciona. No somos agencia gubernamental, bufete de abogados ni representante autorizado ante ninguna agencia. El cuestionario de elegibilidad es siempre gratuito. Los precios aplican a la preparación del borrador del formulario y los materiales de orientación.'

/** Aviso de no-representación para usar en el footer y páginas de formularios. */
export const AVISO_NO_REPRESENTACION =
  'HazloAsíYa no te representa ante ninguna agencia. Completa y envía tu solicitud directamente a la agencia correspondiente. Siempre guarda una copia firmada para tus registros.'

export const AVISO_GDPR =
  'Si accedes desde la Unión Europea, tus datos se procesan según el Reglamento General de Protección de Datos (GDPR). Tienes derecho de acceso, rectificación, supresión, portabilidad, limitación y objeción. Contáctanos en privacidad@hazloasiya.com'

/** Texto UPL para términos (coincide con prompt consolidado). */
export const UPL_LIMITATION_BLOCK =
  'HazloAsíYa NO es una agencia gubernamental, bufete de abogados, ni firma de preparación de impuestos licenciada. No ofrecemos representación legal ni asesoría fiscal. El uso de nuestras guías y cuestionarios no crea una relación abogado-cliente ni de preparador de impuestos a contribuyente. HazloAsíYa verifica la completitud documental según los requisitos publicados por las agencias correspondientes, pero no determina elegibilidad oficial ni garantiza resultados.'
