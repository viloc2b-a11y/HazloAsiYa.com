/** Contenido compartido: DOM en home + JSON-LD (FAQPage, Review). Mantener sincronizado. */

export type HomeFaqItem = { q: string; a: string }

export const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    q: '¿Qué es HazloAsíYa?',
    a: 'HazloAsíYa es una plataforma educativa en español que te orienta paso a paso en trámites en EE. UU. (por ejemplo SNAP, Medicaid, ITIN o escuela): qué documentos necesitas, cómo llenar formularios y qué errores evitar. No sustituye asesoría legal ni gubernamental.',
  },
  {
    q: '¿El cuestionario y la orientación inicial son gratis?',
    a: 'Sí. Puedes elegir un trámite, responder el cuestionario y ver orientación inicial sin costo. Los productos de pago (por ejemplo formulario pre-llenado o suscripción) se explican en Precios y antes de pagar.',
  },
  {
    q: '¿HazloAsíYa reemplaza a un abogado, notario o gestor?',
    a: 'No. Ofrecemos información educativa y herramientas para que completes trámites tú mismo. Para casos legales complejos o representación, consulta a un profesional autorizado.',
  },
  {
    q: '¿En qué idioma está el sitio?',
    a: 'El contenido orientado al usuario está en español (es-US), pensado para familias hispanas en Estados Unidos.',
  },
  {
    q: '¿Qué estados cubren los formularios y guías destacadas?',
    a: 'Publicamos rutas y formularios para varios estados (por ejemplo Texas, California, Florida y Nueva York) según lo indicado en cada página. Revisa siempre la fuente oficial del programa en tu estado.',
  },
]

export type HomeTestimonial = {
  nombre: string
  ciudad: string
  rol: string
  tramite: string
  emoji: string
  texto: string
}

export const HOME_TESTIMONIALS: readonly HomeTestimonial[] = [
  {
    nombre: 'Rosa M.',
    ciudad: 'Houston, TX',
    rol: 'Madre de familia',
    tramite: 'SNAP',
    emoji: '🛒',
    texto:
      'Tenía miedo de que mi estatus me impidiera aplicar. Aquí supe exactamente qué documentos llevar y cómo completar la solicitud. Me aprobaron en 10 días. Por fin puedo alimentar a mis hijos sin ese peso encima.',
  },
  {
    nombre: 'Miguel Á. T.',
    ciudad: 'San Antonio, TX',
    rol: 'Trabajador de construcción',
    tramite: 'Texas ID',
    emoji: '🪪',
    texto:
      'Necesitaba mi Texas ID para trabajar y no sabía ni por dónde empezar. La guía me dijo paso a paso qué llevar al DPS. Fui, me atendieron a la primera y salí con mi licencia. Sin vueltas, sin perder el día.',
  },
  {
    nombre: 'Carmen D.',
    ciudad: 'Dallas, TX',
    rol: 'Dueña de negocio',
    tramite: 'Taxes',
    emoji: '💰',
    texto:
      'Siempre pagaba preparador de taxes. Este año lo hice sola con HazloAsíYa: me explicó qué llenar, cómo y dónde enviar. Ahorré $200 y mi declaración salió sin un solo error. Se lo recomiendo a todos.',
  },
  {
    nombre: 'Jesús R.',
    ciudad: 'El Paso, TX',
    rol: 'Padre soltero',
    tramite: 'IEP Educación Especial',
    emoji: '📋',
    texto:
      'Mi hijo necesita servicios especiales en la escuela y el proceso IEP me parecía imposible de entender. La guía me explicó mis derechos y me dio el formato listo. La escuela lo aceptó sin problemas. Mi hijo por fin tiene el apoyo que merece.',
  },
  {
    nombre: 'Lucía H.',
    ciudad: 'McAllen, TX',
    rol: 'Estudiante universitaria',
    tramite: 'DACA',
    emoji: '📄',
    texto:
      'Renovar mi DACA me daba pánico — un error y todo se complica. HazloAsíYa me mostró los formularios I-821D e I-765 ya preparados y qué documentos adjuntar. Lo envié sin miedo y ya tengo mi aprobación.',
  },
  {
    nombre: 'Roberto S.',
    ciudad: 'Austin, TX',
    rol: 'Recién llegado a Texas',
    tramite: 'ITIN',
    emoji: '🔢',
    texto:
      'No hablo bien inglés y los trámites me parecían un laberinto. Aquí todo está en español, claro y directo. Saqué mi ITIN en dos semanas y ya pude abrir mi cuenta bancaria. No sabía que fuera tan posible.',
  },
  {
    nombre: 'Ana Patricia V.',
    ciudad: 'Corpus Christi, TX',
    rol: 'Madre trabajadora',
    tramite: 'WIC',
    emoji: '🤱',
    texto:
      'WIC siempre me pareció complicado — nunca sabía si calificaba ni qué llevar. Con HazloAsíYa supe todo eso en minutos. Me aprobaron y ya tengo ayuda para la leche y la comida de mi bebé.',
  },
  {
    nombre: 'Carlos J.',
    ciudad: 'Laredo, TX',
    rol: 'Buscando empleo',
    tramite: 'Desempleo TWC',
    emoji: '💼',
    texto:
      'Perdí mi trabajo y no tenía idea cómo aplicar al desempleo en Texas. La guía me dijo exactamente qué responder en la solicitud del TWC. Me aprobaron en la primera semana. Sin esto hubiera esperado meses sin saber qué hacer.',
  },
  {
    nombre: 'Fernando L.',
    ciudad: 'Lubbock, TX',
    rol: 'Trabajador independiente',
    tramite: 'Cuenta bancaria',
    emoji: '🏦',
    texto:
      'Me rechazaban en los bancos por no tener SSN. La guía me dijo qué bancos aceptan ITIN o matrícula consular y qué decir en la sucursal. Abrí mi cuenta en 20 minutos. Por fin tengo acceso a servicios que pensé que no eran para mí.',
  },
]
