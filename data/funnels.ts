export type FunnelId =
  | 'snap' | 'medicaid' | 'id' | 'wic' | 'twc' | 'taxes'
  | 'escuela' | 'daca' | 'iep' | 'itin' | 'rent' | 'prek'
  | 'utilities' | 'jobs' | 'bank' | 'matricula';

export interface Step {
  id: string;
  title: string;
  desc: string;
}

export interface Affiliate {
  name: string;
  desc: string;
  icon: string;
  trust: string;
  primary?: boolean;
  url: string;
}

export interface Funnel {
  name: string;
  icon: string;
  color: string;
  bg: string;
  tagline: string;
  action: string;
  desc: string;
  steps: Step[];
  affiliates: Affiliate[];
  nextSteps: FunnelId[];
}

export const FUNNELS: Record<FunnelId, Funnel> = {
  snap: {
    name: 'SNAP / Cupones de Comida', icon: '🛒', color: '#059669', bg: '#ECFDF5',
    tagline: 'Recibe hasta $973/mes para comprar alimentos',
    action: 'Saber si calificas para SNAP y exactamente cómo presentar la solicitud sin que te la rechacen.',
    desc: 'El programa SNAP (food stamps) ayuda a familias de bajos ingresos. Te decimos si calificas, qué documentos necesitas exactamente y cómo presentar la solicitud correctamente.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Verifica qué tienes.' },
      { id: 'family', title: 'Tu hogar', desc: 'Personas en tu familia.' },
      { id: 'income', title: 'Ingresos y gastos', desc: 'Ingreso mensual del hogar.' },
      { id: 'ai', title: 'Evaluando', desc: 'Calculando elegibilidad.' },
      { id: 'review', title: 'Revisa', desc: 'Tu información.' },
      { id: 'download', title: 'Resultado', desc: 'Tu plan de acción.' },
    ],
    affiliates: [
      { name: 'Texas HHSC Online', desc: 'Aplica directamente en línea con el estado de Texas', icon: '🏛️', trust: 'Sitio oficial · En español', primary: true, url: 'https://yourtexasbenefits.com' },
      { name: 'Ayuda Comunitaria Houston', desc: 'Organizaciones locales que te acompañan en el proceso', icon: '🤝', trust: 'En español · Sin costo', url: '#local' },
    ],
    nextSteps: ['escuela', 'medicaid', 'utilities'],
  },
  medicaid: {
    name: 'Medicaid / CHIP', icon: '🏥', color: '#DC2626', bg: '#FEF2F2',
    tagline: 'Seguro médico gratuito o de bajo costo para tu familia',
    action: 'Determinar si calificas para Medicaid o CHIP y cómo completar la solicitud correctamente.',
    desc: 'Te decimos si calificas para Medicaid o CHIP, qué documentos necesitas llevar y cómo llenar la solicitud para que no te la devuelvan.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Ten estos documentos a la mano.' },
      { id: 'family', title: 'Tu familia', desc: 'Adultos y niños en el hogar.' },
      { id: 'income', title: 'Ingresos del hogar', desc: 'Esta información determina si calificas.' },
      { id: 'insurance', title: 'Seguro actual', desc: 'Tu situación de seguro médico.' },
      { id: 'ai', title: 'Evaluando', desc: 'Verificando elegibilidad.' },
      { id: 'review', title: 'Revisa', desc: 'Tu información.' },
      { id: 'download', title: 'Resultado', desc: 'Tus próximos pasos.' },
    ],
    affiliates: [
      { name: 'YourTexasBenefits.com', desc: 'Portal oficial para aplicar a Medicaid en Texas', icon: '🏛️', trust: 'Sitio oficial · Disponible en español', primary: true, url: 'https://yourtexasbenefits.com' },
      { name: 'Federally Qualified Health Center', desc: 'Clínicas comunitarias con atención sin importar el seguro', icon: '🏥', trust: 'Atención bilingüe · Precio por ingreso', url: '#fqhc' },
    ],
    nextSteps: ['snap', 'utilities', 'escuela'],
  },
  id: {
    name: 'Texas ID / Licencia', icon: '🪪', color: '#0369A1', bg: '#EFF6FF',
    tagline: 'Obtén tu ID o licencia de manejo en Texas',
    action: 'Saber qué documentos llevar al DPS, en qué orden y qué errores evitar para no perder tu cita.',
    desc: 'Te decimos exactamente qué documentos llevar al DPS, en qué orden presentarlos y qué errores cometen la mayoría para que tú no los cometas.',
    steps: [
      { id: 'docs', title: 'Documentos requeridos', desc: 'El DPS requiere documentos específicos.' },
      { id: 'type', title: 'Tipo de ID', desc: 'Qué identificación necesitas.' },
      { id: 'firsttime', title: 'Primera vez', desc: 'Si ya tienes ID de otro estado.' },
      { id: 'appointment', title: 'Cita DPS', desc: 'Cuándo puedes ir.' },
      { id: 'ai', title: 'Preparando', desc: 'Tu paquete de documentos.' },
      { id: 'download', title: 'Resultado', desc: 'Tu checklist para el DPS.' },
    ],
    affiliates: [
      { name: 'DPS Texas — Cita en línea', desc: 'Haz tu cita directamente en el sitio oficial del DPS', icon: '🏛️', trust: 'Sitio oficial del gobierno de Texas', primary: true, url: 'https://www.dps.texas.gov' },
      { name: 'Consulado de México Houston', desc: 'Matrícula consular para ciudadanos mexicanos', icon: '🇲🇽', trust: 'Documento de identidad válido en EE.UU.', url: '#consulado' },
    ],
    nextSteps: ['jobs', 'bank'],
  },
  wic: {
    name: 'WIC — Nutrición', icon: '🤱', color: '#BE185D', bg: '#FDF2F8',
    tagline: 'Beneficio de alimentos para embarazadas, madres y niños hasta 5 años',
    action: 'Saber si calificas para WIC y exactamente cómo solicitarlo en Texas.',
    desc: 'WIC da una tarjeta mensual para comprar alimentos específicos. Te decimos si calificas, qué documentos llevar y dónde ir en Houston.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Lo que debes llevar a tu cita WIC.' },
      { id: 'wicWho', title: '¿Quién aplica?', desc: 'WIC es para la mamá, el bebé o ambos.' },
      { id: 'income', title: 'Ingresos del hogar', desc: 'WIC tiene límites de ingreso.' },
      { id: 'address', title: 'Clínica más cercana', desc: 'Tu ZIP determina tu clínica WIC.' },
      { id: 'ai', title: 'Evaluando elegibilidad', desc: 'Verificando si calificas.' },
      { id: 'review', title: 'Revisa', desc: 'Confirma antes de ir.' },
      { id: 'download', title: 'Tu plan para la cita', desc: 'Exactamente qué hacer.' },
    ],
    affiliates: [
      { name: 'Texas WIC — Cita en línea', desc: 'Agenda tu cita directamente con WIC Texas', icon: '🏛️', trust: 'Programa oficial · Clínicas en Houston y Katy', primary: true, url: 'https://texaswic.org' },
      { name: 'Harris County WIC', desc: 'Múltiples clínicas con atención en español', icon: '🏥', trust: 'Sin costo · Sin importar estatus migratorio', url: '#harriswic' },
    ],
    nextSteps: ['snap', 'medicaid'],
  },
  twc: {
    name: 'Desempleo — TWC', icon: '💼', color: '#0369A1', bg: '#EFF6FF',
    tagline: 'Recibe hasta $563/semana si perdiste tu trabajo en Texas',
    action: 'Solicitar el beneficio de desempleo de Texas (TWC) — exactamente qué decir y cómo llenar la solicitud.',
    desc: 'Si perdiste tu trabajo, puedes recibir un cheque semanal del estado de Texas. Te decimos si calificas, cómo llenar la solicitud sin errores y qué hacer si te la niegan.',
    steps: [
      { id: 'docs', title: 'Información necesaria', desc: 'Ten estos datos a la mano.' },
      { id: 'personal', title: 'Tus datos', desc: 'Información básica.' },
      { id: 'employment', title: 'Tu último trabajo', desc: 'Datos de tu empleador.' },
      { id: 'reason', title: 'Por qué dejaste de trabajar', desc: 'La razón determina si calificas.' },
      { id: 'banking', title: 'Cómo recibir el pago', desc: 'Depósito o tarjeta TWC.' },
      { id: 'ai', title: 'Evaluando tu caso', desc: 'Calculando elegibilidad.' },
      { id: 'review', title: 'Revisa', desc: 'Verifica todo.' },
      { id: 'download', title: 'Solicitud lista', desc: 'Cómo presentarla al TWC.' },
    ],
    affiliates: [
      { name: 'TWC — Solicitud en Línea', desc: 'Presenta tu solicitud en Unemployment.Texas.gov', icon: '🏛️', trust: 'Sitio oficial Texas Workforce Commission', primary: true, url: 'https://unemployment.texas.gov' },
      { name: 'Workforce Solutions Houston', desc: 'Centros de empleo con ayuda en español', icon: '🤝', trust: 'Gratuito · Presencial en Houston y Katy', url: '#workforce' },
    ],
    nextSteps: ['snap', 'bank'],
  },
  taxes: {
    name: 'Taxes / Impuestos', icon: '💰', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'Declara correctamente y recibe tu reembolso',
    action: 'Completar tu declaración de taxes sin errores — te decimos exactamente qué llenar y cómo.',
    desc: 'No somos un explicador de impuestos. Te decimos exactamente qué formularios llenar, qué poner en cada campo, qué documentos llevar y qué errores evitar.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Lo que necesitas reunir.' },
      { id: 'income', title: 'Tus ingresos', desc: 'Tipo y cantidad de ingresos.' },
      { id: 'family', title: 'Tu familia', desc: 'Estado civil y dependientes.' },
      { id: 'pref', title: 'Tu preferencia', desc: 'DIY o asistido.' },
      { id: 'ai', title: 'Analizando', desc: 'Calculando tu situación.' },
      { id: 'review', title: 'Revisa', desc: 'Verifica tu información.' },
      { id: 'download', title: 'Resultado', desc: 'Tu plan de acción.' },
    ],
    affiliates: [
      { name: 'VITA (Gratis)', desc: 'Preparación gratuita de impuestos para tu comunidad', icon: '🤝', trust: 'Servicio comunitario · En español', primary: true, url: '#vita' },
      { name: 'TurboTax en Español', desc: 'Declaración guiada paso a paso desde tu casa', icon: '💻', trust: 'Versión gratuita disponible', url: 'https://turbotax.intuit.com' },
      { name: 'H&R Block', desc: 'Oficinas con especialistas bilingües cerca de ti', icon: '🏢', trust: 'Especialistas certificados en español', url: 'https://hrblock.com' },
    ],
    nextSteps: ['snap', 'bank'],
  },
  escuela: {
    name: 'Inscripción Escolar', icon: '🎓', color: '#0369A1', bg: '#EFF6FF',
    tagline: 'Inscribe a tu hijo en la escuela pública de Texas',
    action: 'Inscribir a tu hijo en la escuela pública de Texas — exactamente qué documentos llevar y qué hacer.',
    desc: 'No somos un explicador de trámites. Te decimos exactamente qué documentos llevar, cómo llenar el Home Language Survey y qué hacer si no tienes todos los papeles.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Verifica que los tienes.' },
      { id: 'child', title: 'Datos del estudiante', desc: 'Información de tu hijo.' },
      { id: 'parent', title: 'Padre o tutor', desc: 'Tus datos como responsable.' },
      { id: 'address', title: 'Domicilio y distrito', desc: 'Tu dirección determina la escuela.' },
      { id: 'language', title: 'Idioma y programa', desc: 'Home Language Survey.' },
      { id: 'health', title: 'Vacunas y salud', desc: 'Vacunación requerida por Texas.' },
      { id: 'ai', title: 'Preparando tu paquete', desc: 'Generando formularios.' },
      { id: 'review', title: 'Revisa y confirma', desc: 'Verifica antes de ir.' },
      { id: 'download', title: 'Descarga y ve a inscribir', desc: 'Documentos listos.' },
    ],
    affiliates: [
      { name: 'Katy ISD — Inscripción', desc: 'Inscribe a tu hijo en el portal oficial de Katy ISD', icon: '🏫', trust: 'Distrito oficial · Houston área · En español', primary: true, url: 'https://katyisd.org' },
      { name: 'Houston ISD (HISD)', desc: 'Portal de inscripción del distrito más grande de Texas', icon: '🏛️', trust: 'Sitio oficial · Soporte en español disponible', url: 'https://houstonisd.org' },
      { name: 'Clínicas de Vacunación Gratuitas', desc: 'Si te faltan vacunas — clínicas del condado Harris gratis', icon: '💉', trust: 'Condado Harris · Sin costo · Sin importar estatus', url: '#vaccines' },
    ],
    nextSteps: ['medicaid', 'snap'],
  },
  daca: {
    name: 'DACA — Renovación', icon: '📄', color: '#065F46', bg: '#ECFDF5',
    tagline: 'Renueva tu DACA antes de que venza — sin errores',
    action: 'Renovar tu DACA (I-821D e I-765) correctamente — exactamente qué formularios llenar y cómo evitar rechazos.',
    desc: 'DACA se renueva cada 2 años. Un error en los formularios puede costar meses de retraso. Te decimos exactamente qué formularios llenar, qué documentos adjuntar y cuándo enviarlos.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'USCIS requiere documentos específicos.' },
      { id: 'dacaStatus', title: 'Tu DACA actual', desc: 'Cuándo vence y situación actual.' },
      { id: 'personal', title: 'Tu información', desc: 'Datos para I-821D e I-765.' },
      { id: 'address', title: 'Dirección actual', desc: 'Donde USCIS enviará tu respuesta.' },
      { id: 'history', title: 'Historial desde tu DACA', desc: 'USCIS pregunta sobre actividades.' },
      { id: 'ai', title: 'Preparando formularios', desc: 'Generando I-821D e I-765.' },
      { id: 'review', title: 'Revisa con atención', desc: 'USCIS es estricto.' },
      { id: 'download', title: 'Paquete completo', desc: 'Formularios + instrucciones de envío.' },
    ],
    affiliates: [
      { name: 'Ayuda Legal DACA Houston', desc: 'Organizaciones locales que revisan tu paquete DACA sin costo', icon: '⚖️', trust: 'Gratis o bajo costo · En español · Houston', primary: true, url: '#dacahelp' },
      { name: 'USCIS — myUSCIS', desc: 'Portal oficial para pagar la tarifa y rastrear tu caso', icon: '🏛️', trust: 'Sitio oficial del gobierno · myuscis.gov', url: 'https://myuscis.gov' },
    ],
    nextSteps: ['id', 'bank'],
  },
  iep: {
    name: 'IEP — Educación Especial', icon: '📋', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'Plan de Educación Individualizado para tu hijo',
    action: 'Solicitar evaluación IEP para tu hijo — tus derechos y cómo hacerlo en Texas.',
    desc: 'Si tu hijo tiene dificultades de aprendizaje, autismo, TDAH u otras necesidades, tiene derecho a un IEP gratuito. Te decimos exactamente cómo solicitarlo y qué esperar.',
    steps: [
      { id: 'docs', title: 'Documentos y derechos', desc: 'Tus derechos bajo IDEA.' },
      { id: 'child', title: 'Información del estudiante', desc: 'Edad, grado y necesidad.' },
      { id: 'iepNeed', title: 'Tipo de apoyo', desc: 'Qué está pasando con tu hijo.' },
      { id: 'parent', title: 'Tus datos', desc: 'La escuela debe comunicarse en español.' },
      { id: 'ai', title: 'Preparando solicitud', desc: 'Generando carta formal.' },
      { id: 'review', title: 'Revisa', desc: 'Verifica antes de entregar.' },
      { id: 'download', title: 'Carta + guía de derechos', desc: 'Lista para la directora.' },
    ],
    affiliates: [
      { name: 'Disability Rights Texas', desc: 'Defiende los derechos de estudiantes con discapacidades — gratis', icon: '⚖️', trust: '1-800-252-9108 · En español · Gratuito', primary: true, url: 'https://disabilityrightstx.org' },
      { name: 'IDEA — Ley Federal', desc: 'El IEP es un derecho federal — toda escuela pública debe cumplirlo', icon: '🏛️', trust: 'Derecho garantizado sin excepción', url: 'https://sites.ed.gov/idea' },
    ],
    nextSteps: ['escuela', 'medicaid'],
  },
  itin: {
    name: 'ITIN — Número de Contribuyente', icon: '🔢', color: '#0369A1', bg: '#EFF6FF',
    tagline: 'Obtener tu ITIN para declarar impuestos, abrir cuenta y construir crédito',
    action: 'Solicitar tu ITIN (W-7) al IRS correctamente — qué documentos enviar y cómo hacerlo.',
    desc: 'El ITIN te permite declarar impuestos, abrir cuentas bancarias y recibir el crédito EITC (hasta $6,604/año). Sin ITIN el ecosistema financiero en EE.UU. está cerrado para ti.',
    steps: [
      { id: 'docs', title: 'Documentos del IRS', desc: 'El IRS es muy estricto.' },
      { id: 'itinReason', title: '¿Para qué necesitas el ITIN?', desc: 'La razón afecta el W-7.' },
      { id: 'personal', title: 'Tu información', desc: 'Datos para el W-7 del IRS.' },
      { id: 'address', title: 'Dónde recibirás tu ITIN', desc: 'El IRS manda por correo en 6-11 semanas.' },
      { id: 'ai', title: 'Llenando tu W-7', desc: 'Generando el formulario.' },
      { id: 'review', title: 'Revisa con mucho cuidado', desc: 'Un error retrasa 6+ semanas.' },
      { id: 'download', title: 'W-7 + instrucciones', desc: 'Cómo enviar al IRS.' },
    ],
    affiliates: [
      { name: 'VITA — Preparación Gratis', desc: 'Voluntarios certificados por el IRS — ayudan con ITIN y taxes gratis', icon: '🤝', trust: 'Gratuito · Certificado IRS · En español · Houston', primary: true, url: '#vita' },
      { name: 'IRS Acceptance Agents Houston', desc: 'Certifican documentos sin que los envíes por correo', icon: '🏢', trust: 'Certificados IRS · Evitan enviar originales', url: '#acceptance-agent' },
    ],
    nextSteps: ['taxes', 'bank'],
  },
  rent: {
    name: 'Vivienda / Renta', icon: '🏠', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'Saber si estás listo para rentar y qué necesitas',
    action: 'Evaluar tu perfil de arrendatario y saber exactamente qué te falta para que no te rechacen.',
    desc: 'Te evaluamos con tus ingresos, documentos e historial. Te decimos si estás listo para rentar y qué mejorar si no lo estás.',
    steps: [
      { id: 'income', title: 'Ingresos', desc: 'Cuánto ganas al mes.' },
      { id: 'family', title: 'Tu hogar', desc: 'Cuántas personas van a vivir.' },
      { id: 'employment', title: 'Empleo', desc: 'Tu situación laboral.' },
      { id: 'history', title: 'Historial', desc: 'Experiencia previa rentando.' },
      { id: 'ai', title: 'Evaluando tu perfil', desc: 'Tu perfil de arrendatario.' },
      { id: 'review', title: 'Revisa', desc: 'Tu información.' },
      { id: 'download', title: 'Resultado', desc: 'Tu perfil y consejos.' },
    ],
    affiliates: [
      { name: 'Asistencia de Renta HAR', desc: 'Ayuda de emergencia para renta en Houston', icon: '🆘', trust: 'Programa gubernamental · Gratuito', primary: true, url: '#har' },
      { name: 'Apartamentos Houston', desc: 'Búsqueda de apartamentos con servicios en español', icon: '🏢', trust: 'Miles de opciones en el área de Houston', url: '#apts' },
    ],
    nextSteps: ['utilities', 'bank'],
  },
  prek: {
    name: 'Pre-K Gratuito Texas', icon: '🧒', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'Programa gratuito de Pre-Kínder para niños de 3 y 4 años',
    action: 'Inscribir a tu hijo de 3 o 4 años en el programa Pre-K gratuito — quién califica y cómo aplicar.',
    desc: 'Texas ofrece Pre-Kínder gratuito para niños que califican. Te decimos si tu hijo califica, qué documentos necesitas y cómo inscribirlo.',
    steps: [
      { id: 'docs', title: 'Documentos necesarios', desc: 'Qué llevar a la inscripción.' },
      { id: 'child', title: 'Datos del niño', desc: 'Edad y elegibilidad para Pre-K.' },
      { id: 'eligibility', title: '¿Por qué califica?', desc: 'Pre-K tiene diferentes razones.' },
      { id: 'address', title: 'Domicilio y escuela', desc: 'Tu ZIP determina qué escuela.' },
      { id: 'language', title: 'Idioma en casa', desc: 'Afecta el programa bilingüe.' },
      { id: 'ai', title: 'Verificando elegibilidad', desc: 'Confirmando que califica.' },
      { id: 'review', title: 'Revisa', desc: 'Verifica antes de ir.' },
      { id: 'download', title: 'Plan de inscripción', desc: 'Qué hacer para asegurar el lugar.' },
    ],
    affiliates: [
      { name: 'Katy ISD — Pre-K', desc: 'Inscripción de Pre-K en Katy ISD', icon: '🏫', trust: 'Gratuito · Katy, TX · En español', primary: true, url: 'https://katyisd.org/prek' },
      { name: 'Houston ISD — Pre-K', desc: 'Mayor programa de Pre-K gratuito en Texas', icon: '🏛️', trust: 'Gratuito · Múltiples ubicaciones · Bilingüe', url: 'https://houstonisd.org/prek' },
    ],
    nextSteps: ['escuela', 'medicaid'],
  },
  utilities: {
    name: 'Servicios Públicos', icon: '💡', color: '#D97706', bg: '#FFFBEB',
    tagline: 'Conecta tu luz, internet y gas en Houston',
    action: 'Saber cuál proveedor elegir, cómo activar el servicio y qué pedir para no pagar depósito.',
    desc: 'Te mostramos qué proveedor conviene según tu situación, cómo hacer la llamada y qué decir para activar luz, gas e internet sin depósito grande.',
    steps: [
      { id: 'location', title: 'Tu ubicación', desc: 'ZIP code y tipo de vivienda.' },
      { id: 'services', title: 'Servicios', desc: 'Qué necesitas conectar.' },
      { id: 'timing', title: 'Cuándo', desc: 'Fecha de mudanza o inicio.' },
      { id: 'priority', title: 'Prioridad', desc: 'Qué es más importante para ti.' },
      { id: 'ai', title: 'Buscando opciones', desc: 'Encontrando las mejores opciones.' },
      { id: 'download', title: 'Resultado', desc: 'Tus opciones.' },
    ],
    affiliates: [
      { name: 'Reliant Energy', desc: 'Planes flexibles con soporte 24/7 en español en Houston', icon: '⚡', trust: 'Sin contrato obligatorio · En español', primary: true, url: 'https://reliant.com' },
      { name: 'TXU Energy', desc: 'El proveedor más grande de Texas con opciones para todos', icon: '🔌', trust: 'Planes desde $0 en depósito', url: 'https://txu.com' },
      { name: 'Xfinity / AT&T', desc: 'Internet de alta velocidad con programa ACP', icon: '📡', trust: 'Soporte en español · Programa de asistencia', url: '#internet' },
    ],
    nextSteps: ['bank', 'rent'],
  },
  jobs: {
    name: 'Empleo', icon: '💼', color: '#0284C7', bg: '#EFF6FF',
    tagline: 'Encuentra trabajo con o sin inglés fluido',
    action: 'Saber qué documentos necesitas para trabajar legalmente y cómo completar el I-9 y W-4 correctamente.',
    desc: 'Te decimos qué documentos necesitas para trabajar, cómo llenar el I-9 y el W-4 sin errores, y opciones de empleo locales bilingües.',
    steps: [
      { id: 'docs', title: 'Documentos para trabajar', desc: 'Lo que necesitas para el I-9.' },
      { id: 'skills', title: 'Tu experiencia', desc: 'Qué sabes hacer.' },
      { id: 'availability', title: 'Disponibilidad', desc: 'Horarios y tipo de trabajo.' },
      { id: 'ai', title: 'Buscando opciones', desc: 'Opciones para ti.' },
      { id: 'download', title: 'Resultado', desc: 'Tus opciones de empleo.' },
    ],
    affiliates: [
      { name: 'Workforce Solutions', desc: 'Centro de empleo del condado Harris · Servicio en español', icon: '🏢', trust: 'Gratuito · Presencial y en línea', primary: true, url: 'https://wrksolutions.com' },
      { name: 'Indeed en Español', desc: 'Miles de trabajos cerca de ti con filtros en español', icon: '💻', trust: 'El buscador de empleo más grande', url: 'https://indeed.com' },
    ],
    nextSteps: ['bank', 'id'],
  },
  bank: {
    name: 'Abrir Cuenta Bancaria', icon: '🏦', color: '#0891B2', bg: '#ECFEFF',
    tagline: 'Cuenta bancaria sin SSN, sin historial de crédito',
    action: 'Saber qué banco acepta tu ID, qué llevar y cómo abrir la cuenta sin que te la rechacen.',
    desc: 'Te decimos exactamente qué banco acepta tu identificación, qué documentos llevar y cómo hablar con el ejecutivo para abrir tu cuenta.',
    steps: [
      { id: 'docs', title: 'Documentos disponibles', desc: 'Qué ID tienes.' },
      { id: 'needs', title: 'Qué necesitas', desc: 'Tipo de cuenta y uso principal.' },
      { id: 'ssn', title: 'SSN / ITIN', desc: 'Tu situación de identificación.' },
      { id: 'pref', title: 'Preferencia', desc: 'Digital o banco físico.' },
      { id: 'ai', title: 'Buscando opciones', desc: 'Mejores opciones para ti.' },
      { id: 'download', title: 'Resultado', desc: 'Bancos recomendados.' },
    ],
    affiliates: [
      { name: 'Cooperativa de Crédito Local', desc: 'Cuentas sin SSN con matrícula consular en Houston', icon: '🤝', trust: 'Sin comisión mensual · En español', primary: true, url: '#credit-union' },
      { name: 'Chime (Digital)', desc: 'Cuenta digital sin comisiones ni depósito mínimo', icon: '📱', trust: 'Acepta ITIN · App en español', url: 'https://chime.com' },
      { name: 'Bank of America / Wells Fargo', desc: 'Bancos tradicionales con sucursales bilingües', icon: '🏦', trust: 'Amplia red de sucursales en Houston', url: '#traditional' },
    ],
    nextSteps: ['taxes', 'jobs'],
  },
  matricula: {
    name: 'Matrícula Consular Mexicana', icon: '🇲🇽', color: '#B91C1C', bg: '#FEF2F2',
    tagline: 'Obtén tu matrícula consular — ID válida en Houston y Texas',
    action: 'Sacar tu matrícula consular en el Consulado de México en Houston — exactamente qué documentos llevar.',
    desc: 'La matrícula consular es aceptada en muchos bancos, escuelas y agencias en Texas. Te decimos exactamente cómo obtenerla.',
    steps: [
      { id: 'docs', title: 'Documentos de México', desc: 'Lo que necesitas traer.' },
      { id: 'personal', title: 'Tu información', desc: 'Datos personales para tu matrícula.' },
      { id: 'address', title: 'Tu domicilio en EE.UU.', desc: 'El consulado registra tu dirección.' },
      { id: 'appointment', title: 'Cita en el Consulado', desc: 'Cómo agendar tu cita.' },
      { id: 'ai', title: 'Preparando tu checklist', desc: 'Lista exacta para el consulado.' },
      { id: 'review', title: 'Revisa antes de ir', desc: 'El consulado es estricto.' },
      { id: 'download', title: 'Tu guía para el consulado', desc: 'Todo para ese día.' },
    ],
    affiliates: [
      { name: 'Consulado de México — Houston', desc: 'Agenda tu cita oficial en el Consulado de México en Houston', icon: '🏛️', trust: 'Consulado oficial · 4507 San Jacinto St, Houston', primary: true, url: 'https://consulmex.sre.gob.mx/houston' },
      { name: 'Consulado Móvil', desc: 'El consulado visita diferentes ciudades de Texas', icon: '🚌', trust: 'Fechas variables · Más cercano a tu área', url: '#consulado-movil' },
    ],
    nextSteps: ['bank', 'id'],
  },
};

/** Comprueba que el segmento de URL sea un funnel conocido (evita `as FunnelId` inseguro). */
export function isValidFunnelId(slug: string): slug is FunnelId {
  return Object.prototype.hasOwnProperty.call(FUNNELS, slug)
}

export const FUNNEL_ORDER: FunnelId[] = [
  'snap', 'medicaid', 'id', 'wic', 'twc', 'taxes',
  'escuela', 'daca', 'iep', 'itin', 'rent', 'prek',
  'utilities', 'jobs', 'bank', 'matricula',
];

export const NEXT_STEP_MAP: Record<FunnelId, { id: FunnelId; name: string; icon: string; desc: string }[]> = {
  snap:      [{ id: 'medicaid', name: 'Medicaid', icon: '🏥', desc: 'Si calificas para SNAP probablemente para Medicaid también' }, { id: 'escuela', name: 'Escuela', icon: '🎓', desc: 'Si tienes hijos, inscríbelos en la escuela pública' }],
  medicaid:  [{ id: 'snap', name: 'SNAP', icon: '🛒', desc: 'Beneficio alimentario que acompaña a Medicaid' }, { id: 'utilities', name: 'Servicios', icon: '💡', desc: 'LIHEAP: descuento en servicios públicos' }],
  id:        [{ id: 'jobs', name: 'Empleo', icon: '💼', desc: 'Ya con ID puedes trabajar' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Abre tu cuenta con tu nueva ID' }],
  wic:       [{ id: 'snap', name: 'SNAP', icon: '🛒', desc: 'Si calificas para WIC, probablemente para SNAP también' }, { id: 'medicaid', name: 'Medicaid', icon: '🏥', desc: 'Cobertura médica para tu bebé y tú' }],
  twc:       [{ id: 'snap', name: 'SNAP', icon: '🛒', desc: 'Mientras buscas trabajo, SNAP puede ayudarte' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Necesitas cuenta para recibir el cheque TWC' }],
  taxes:     [{ id: 'snap', name: 'SNAP', icon: '🛒', desc: 'Podrías calificar para cupones de comida' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Necesitas cuenta para tu reembolso' }],
  escuela:   [{ id: 'medicaid', name: 'Medicaid', icon: '🏥', desc: 'Si tienes hijos, verifica elegibilidad para Medicaid' }, { id: 'snap', name: 'SNAP', icon: '🛒', desc: 'Beneficio alimentario para familias con hijos' }],
  daca:      [{ id: 'id', name: 'ID Texas', icon: '🪪', desc: 'Con DACA puedes sacar tu licencia de Texas' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Con DACA puedes abrir cuenta bancaria' }],
  iep:       [{ id: 'escuela', name: 'Escuela', icon: '🎓', desc: 'El IEP va de la mano con la inscripción escolar' }, { id: 'medicaid', name: 'Medicaid', icon: '🏥', desc: 'Niños con IEP frecuentemente califican para Medicaid' }],
  itin:      [{ id: 'taxes', name: 'Taxes', icon: '💰', desc: 'Con ITIN puedes declarar y recibir reembolso' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Tu ITIN te permite abrir cuenta bancaria' }],
  rent:      [{ id: 'utilities', name: 'Servicios', icon: '💡', desc: 'Conecta luz y agua en tu nuevo hogar' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Necesitas cuenta para pagar la renta' }],
  prek:      [{ id: 'escuela', name: 'Escuela', icon: '🎓', desc: 'El siguiente paso después del Pre-K' }, { id: 'wic', name: 'WIC', icon: '🤱', desc: 'Beneficio de alimentos para tu familia' }],
  utilities: [{ id: 'rent', name: 'Vivienda', icon: '🏠', desc: '¿Estás buscando dónde vivir?' }, { id: 'bank', name: 'Banco', icon: '🏦', desc: 'Paga tus servicios sin comisiones' }],
  jobs:      [{ id: 'bank', name: 'Banco', icon: '🏦', desc: 'Necesitas cuenta para recibir tu cheque' }, { id: 'id', name: 'ID Texas', icon: '🪪', desc: 'Algunos empleos requieren ID de Texas' }],
  bank:      [{ id: 'taxes', name: 'Taxes', icon: '💰', desc: 'Declara con cuenta bancaria establecida' }, { id: 'jobs', name: 'Empleo', icon: '💼', desc: 'Encuentra trabajo estable' }],
  matricula: [{ id: 'bank', name: 'Banco', icon: '🏦', desc: 'Muchos bancos aceptan la matrícula consular' }, { id: 'taxes', name: 'Taxes', icon: '💰', desc: 'Con matrícula y ITIN puedes declarar impuestos' }],
};
