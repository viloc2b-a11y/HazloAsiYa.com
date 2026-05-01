import type { FunnelId } from './funnels'
import { isValidFunnelId } from './funnels'

export type EmailCaptureFunnelCopy = {
  /** H3; puede incluir {tramite} */
  title: string
  /** Gancho emocional + contexto del trámite (único por funnel) */
  hook: string
  /** Por qué importa en este trámite (riesgos concretos) */
  stakes: string
  /** Antes del botón: beneficio inmediato + tranquilidad + micro-urgencia */
  closer: string
  /** Texto del botón en reposo; puede incluir {tramite} */
  button: string
  /** Mensaje tras envío exitoso; puede incluir {tramite} */
  success: string
}

const DEFAULT: EmailCaptureFunnelCopy = {
  title: 'Avisos si cambia algo en {tramite}',
  hook:
    'Los trámites oficiales cambian formularios y listas en .gov; si vas con lo de ayer, lo habitual es corrección, otra cita o solicitud devuelta.',
  stakes:
    'Un aviso antes de enviar o ir en persona te deja alinear documentos y fechas con la versión nueva y evitar vueltas innecesarias.',
  closer:
    'En menos de un minuto quedas registrado y ves la confirmación en verde en esta pantalla. No es boletín: un solo correo si publicamos un cambio que te toque. Sin spam—cancelas cuando quieras. Si vas a mover papeles pronto, mejor dejarlo activo hoy.',
  button: 'Guardar mi correo para avisos de {tramite}',
  success:
    '¡Listo! La confirmación es este mensaje en verde: tu correo quedó en la lista de avisos para {tramite}. El siguiente correo será uno solo cuando publiquemos en HazloAsíYa un cambio que toque documentos, montos, fechas o pasos de ese trámite.',
}

const BY_FUNNEL: Record<FunnelId, EmailCaptureFunnelCopy> = {
  snap: {
    title: 'Tu dinero de comida: avisos si cambian SNAP o la solicitud',
    hook:
      'El beneficio alimentario es efectivo en la tarjeta cuando la solicitud y los montos van con la regla vigente. Si Texas o el USDA actualizan requisitos o formularios y tú vas con la versión vieja, lo normal es demora o que te manden a corregir—y el dinero llega tarde.',
    stakes:
      'Un solo cambio en lista de documentos o en fechas puede retrasar la aprobación o la recarga. Enterarte antes de presentar te permite ajustar la carpeta y no perder meses por un trámite desactualizado.',
    closer:
      'Registro rápido: confirmación verde al instante y cero promesas de “newsletter”. Si cambia algo que afecte tu SNAP, un correo puntual te avisa antes de mandar papeles o ir a la oficina. No cuesta nada y puedes darte de baja en un clic—actívalo ahora si dependes de ese ingreso para comer.',
    button: 'Sí, avísame si cambia algo que afecte mi dinero SNAP',
    success:
      '¡Listo! Confirmación en pantalla: tu correo quedó en la lista de avisos para {tramite}. Te escribiremos un solo correo si publicamos un cambio que pueda afectar montos, recargas o tu solicitud de comida.',
  },
  medicaid: {
    title: 'Salud y cobertura: avisos si cambian Medicaid o CHIP',
    hook:
      'Aquí no es solo papeleo: es citas, recetas y quién paga la urgencia. Si el estado cambia documentación, categorías o plataformas y llegas desactualizado, el riesgo real es demora en la tarjeta, trámites de corrección o perder una ventana de inscripción.',
    stakes:
      'En salud, una lista mal presentada suele significar otra cita o semanas sin cobertura efectiva. Un aviso cuando actualicemos algo crítico te deja revisar antes de presentar o renovar.',
    closer:
      'Tarda menos de un minuto; tu correo no se vende. Te escribimos solo si publicamos un cambio que toque documentos, plazos o pasos de tu trámite de salud. Sin cadenas de correos—cancelas cuando quieras. Si tienes renovación o cita a la vista, conviene activarlo hoy y ver la confirmación aquí mismo.',
    button: 'Avísame si cambia algo de mi Medicaid o CHIP',
    success:
      '¡Listo! Tu correo quedó registrado para avisos de {tramite}. El próximo email será uno solo si actualizamos algo que pueda afectar cobertura, renovación, citas o documentos de salud.',
  },
  itin: {
    title: 'ITIN e IRS: avisos si cambian el W-7 o la declaración',
    hook:
      'El IRS actualiza instrucciones y formularios; con ITIN, mandar una versión vieja del W-7 o una lista incompleta suele devolver el trámite o retrasar el reembolso—son semanas de espera que se evitan revisando antes de enviar.',
    stakes:
      'Pequeños cambios en requisitos o anexos pueden hacer que rechacen el paquete o pidan enmienda. Un aviso cuando actualicemos la guía te da margen para alinear papeles con lo que el IRS pide hoy.',
    closer:
      'Confirmación en verde al momento; sin boletines genéricos. Un solo email si algo publicado en HazloAsíYa cambia lo que necesitas para ITIN o declaración. Puedes cancelar cuando quieras. Si piensas declarar o renovar pronto, activa el aviso ahora—mejor un minuto hoy que corregir después.',
    button: 'Guardar avisos para mi ITIN y declaración',
    success:
      '¡Listo! Lista guardada para {tramite}. Si cambia el W-7, la declaración o requisitos del IRS en nuestra guía, recibirás un solo correo antes de mandar o renovar papeles.',
  },
  wic: {
    title: 'WIC: avisos de citas, documentos y lo que pide la clínica',
    hook:
      'WIC gira en torno a citas y a traer la carpeta que la clínica o el estado piden hoy. Si cambian recetas, comprobantes o fechas y vas con lo de la vez pasada, lo típico es perder la cita o volver otro día con papeles nuevos.',
    stakes:
      'Para familias con niños pequeños, eso es tiempo de trabajo perdido y beneficios que no arrancan cuando los necesitas. Un aviso antes de la visita te deja actualizar la lista sin sorpresas en recepción.',
    closer:
      'Listo en segundos: verás la confirmación en verde y no abrimos “newsletter”. Te escribimos solo si cambia algo que afecte documentos o pasos WIC. Sin letra chica de spam—te das de baja en un clic. Si tienes cita o renovación pronto, déjalo activo hoy.',
    button: 'Avísame antes de mi próxima cita o renovación WIC',
    success:
      '¡Listo! Estás inscrito para avisos de {tramite}. Te escribimos un solo correo si cambia lo de citas, documentos o pasos antes de tu próxima visita a la clínica.',
  },
  escuela: {
    title: 'Escuela pública: avisos de fechas límite y documentos',
    hook:
      'La inscripción se gana o se complica por ventanas de fecha y por la lista exacta que el distrito exige hoy. Si las reglas o los formularios cambian y presentas la carpeta de año pasado, lo habitual es otra vuelta o quedar fuera de plazo.',
    stakes:
      'Un día de diferencia o un comprobante viejo puede significar empezar tarde o repetir filas. Enterarte cuando actualicemos requisitos o calendario te da tiempo de cerrar la carpeta bien.',
    closer:
      'Un minuto y confirmación instantánea en pantalla. No prometemos correos diarios: solo uno cuando un cambio publicado te afecte a inscripción o documentos. Cancelas cuando quieras. Si la fecha límite o el ciclo escolar se acerca, activa el aviso ahora—después suele ser tarde para corregir.',
    button: 'Guardar avisos para fechas y papeles de escuela',
    success:
      '¡Listo! Avisos activos para {tramite}. El siguiente email será uno solo si publicamos un cambio en fechas límite, calendario escolar o lista de documentos del distrito.',
  },
  daca: {
    title: 'DACA y trámites relacionados: avisos con cuidado',
    hook:
      'Aquí los cambios en reglas, formularios o exigencias no son un detalle administrativo: pueden afectar licencia, empleo o próximos pasos. Presentar con información desactualizada suele significar correcciones, nuevas citas o rechazos evitables si te enteras a tiempo.',
    stakes:
      'No sustituimos asesoría legal; sí te avisamos cuando actualicemos en HazloAsíYa algo que cambie documentos, fechas o pasos que publicamos para tu trámite—para que revises con calma antes de mover papeles sensibles.',
    closer:
      'Registro breve y confirmación verde aquí. Tu correo queda solo para avisos de cambios relevantes; no vendemos listas y cancelas cuando quieras. Si vas a renovar, sacar ID o presentar algo pronto, activar el aviso hoy reduce el riesgo de ir con una guía vieja—sin prometer resultado legal, solo información al día.',
    button: 'Quiero avisos si cambia lo publicado para mi trámite',
    success:
      '¡Listo! Tu correo quedó en avisos para {tramite} (solo cambios que publiquemos en HazloAsíYa). No es asesoría legal: un correo único si actualizamos documentos o pasos en la guía.',
  },
  taxes: {
    title: 'Impuestos: avisos si cambian plazos, formularios o reembolso',
    hook:
      'Cambios en formularios, límites o reglas pueden costar multa por presentación tardía, reembolso retrasado o tener que enmendar. El IRS no siempre avisa en español con tiempo; mucha gente se entera al recibir la carta o al ver el depósito tarde.',
    stakes:
      'Un error de versión o de documentación suele corregirse, pero con tiempo y a veces con intereses o menos reembolso. Un aviso cuando actualicemos algo crítico te da margen antes de enviar al IRS.',
    closer:
      'Confirmación al instante; sin suscripción a “tips” genéricos. Un correo si publicamos un cambio que toque lo que declaras o recuperas. Te das de baja en un clic. La temporada y los plazos no esperan—si vas a declarar pronto, deja el aviso activo hoy.',
    button: 'Avísame si cambia algo antes de declarar al IRS',
    success:
      '¡Listo! Registrado para avisos de {tramite}. Te escribimos un solo correo si publicamos un cambio que pueda afectar plazos, formularios, multas o tu reembolso ante el IRS.',
  },
  rent: {
    title: 'Renta y vivienda: avisos cuando el tiempo cuenta',
    hook:
      'Programas locales y reglas de ayuda cambian; en crisis de renta, presentar tarde o con lista vieja suele significar quedar fuera de una ronda o perder una ventana corta. Cada semana cuenta cuando hay desalojo o atraso grande.',
    stakes:
      'No somos abogados ni la oficina de vivienda; si actualizamos en el sitio requisitos, plazos o documentos que te aplican, un aviso te da chance de corregir antes de que cierre el plazo o cambie el formulario.',
    closer:
      'Menos de un minuto, confirmación verde y correo solo si hay cambio publicado que te toque. Sin ruido ni boletines. Si necesitas actuar ya con ayuda de renta o defensa de inquilino, activar el aviso hoy puede ser la diferencia entre entrar a tiempo o quedar fuera—sin prometer cupo ni resultado legal.',
    button: 'Sí, avísame si cambia plazo o requisitos de renta',
    success:
      '¡Listo! Lista de avisos para {tramite} activa. Un solo correo si actualizamos plazos, requisitos o programas de ayuda de vivienda que publiquemos en el sitio.',
  },
  id: {
    title: 'Identificación en Texas: avisos si cambian requisitos o formularios',
    hook:
      'En DPS, la cita se gana o se pierde por traer exactamente lo que piden hoy. Si cambian comprobantes, formatos o trámites en línea y vas con la lista de ayer, lo típico es volver otro día o reprogramar.',
    stakes:
      'Eso es tiempo, gas y a veces semanas sin licencia o ID. Un aviso cuando actualicemos documentos o pasos te permite ir una sola vez con la carpeta correcta.',
    closer:
      'Registro rápido, confirmación verde al instante. Un solo email si cambia algo que afecte tu trámite de identificación. Sin spam; cancelas cuando quieras. Si ya tienes cita o vas a sacar turno pronto, activa el aviso hoy.',
    button: 'Avísame antes de mi cita o visita a DPS',
    success:
      '¡Listo! Avisos para {tramite} guardados. El próximo email será uno solo si cambian en nuestra guía los requisitos o documentos para identificación o DPS antes de tu cita.',
  },
  twc: {
    title: 'TWC y beneficios: avisos si cambian pasos o documentación',
    hook:
      'Depósitos y solicitudes de desempleo dependen de reglas y formularios al día. Si mandas la versión vieja o faltan comprobantes nuevos, lo habitual es demora en el pago o solicitud devuelta—dinero que contabas para esa semana.',
    stakes:
      'Cada semana de corrección cuenta cuando el ingreso del hogar bajó. Un aviso cuando actualicemos requisitos o fechas te deja mandar bien a la primera.',
    closer:
      'Confirmación en pantalla al momento; no es lista de “empleo” genérica. Te escribimos solo si publicamos un cambio que toque tu trámite TWC. Cancelas cuando quieras. Si estás en solicitud o reclamo activo, conviene activarlo hoy.',
    button: 'Guardar avisos para mi trámite con TWC',
    success:
      '¡Listo! Tu correo quedó en la lista de avisos para {tramite}. Te avisamos un solo correo si publicamos un cambio que afecte solicitudes, pagos o documentación de workforce.',
  },
  iep: {
    title: 'IEP y educación especial: avisos de documentos y pasos',
    hook:
      'Evaluaciones, reuniones y planes pueden exigir pruebas o formatos que el distrito actualiza. Si llegas con papeles viejos o fechas mal interpretadas, lo típico es otra junta o retrasar el apoyo que tu hijo ya califica.',
    stakes:
      'Para el menor, el tiempo perdido es escuela sin acomodos adecuados. Un aviso cuando cambie algo en nuestra guía te ayuda a preparar la carpeta antes de la próxima reunión.',
    closer:
      'Un minuto, confirmación verde y sin boletines. Un correo si actualizamos algo que afecte pasos o documentos de IEP. Te das de baja en un clic. Si tienes ARD o evaluación pronto, activa el aviso ahora.',
    button: 'Avísame si cambia algo para el IEP de mi hijo',
    success:
      '¡Listo! Avisos para {tramite} activos. Recibirás un correo único si actualizamos algo que toque documentos o pasos de IEP antes de tu próxima reunión o evaluación.',
  },
  prek: {
    title: 'Pre-K y cupos: avisos de documentos y plazos',
    hook:
      'En muchos distritos las plazas y las fechas de inscripción se mueven rápido; si cambian la lista de comprobantes o el calendario y vas con lo del año pasado, puedes quedar fuera de ronda o repetir filas.',
    stakes:
      'Para niños pequeños, perder la ventana es empezar tarde o sin lugar. Un aviso cuando actualicemos requisitos o fechas te da tiempo de cerrar carpeta y turno.',
    closer:
      'Registro corto, confirmación instantánea. Solo un email si un cambio publicado te afecta a Pre-K o documentos. Sin spam; cancelas cuando quieras. Si la inscripción abre pronto, activa el aviso hoy.',
    button: 'Avísame si cambian fechas o papeles de Pre-K',
    success:
      '¡Listo! Lista guardada para {tramite}. Te escribimos un solo correo si cambian plazos, cupos o documentos de inscripción a Pre-K en nuestra guía.',
  },
  utilities: {
    title: 'Luz, gas y agua: avisos si cambian programas o requisitos',
    hook:
      'Ayudas como LIHEAP y descuentos cambian por temporada, condado o proveedor. Ir con formularios o comprobantes viejos suele retrasar el crédito en la factura o mandarte a empezar de nuevo.',
    stakes:
      'Cada mes de factura alta cuenta. Un aviso cuando actualicemos documentos o pasos te permite mandar el paquete correcto antes de que suba el recibo otra vez.',
    closer:
      'Confirmación verde al instante; no vendemos tu correo. Un solo email si publicamos un cambio que toque tu trámite de servicios. Cancelas en un clic. Si la factura aprieta, mejor tener el aviso activo antes del próximo ciclo.',
    button: 'Guardar avisos para ayuda con servicios',
    success:
      '¡Listo! Avisos para {tramite} registrados. Un solo correo si publicamos un cambio en ayudas de luz, gas o agua o en los requisitos que apliquen a tu caso.',
  },
  jobs: {
    title: 'Empleo: avisos si cambian requisitos o trámites relacionados',
    hook:
      'Identificación, workforce o contratación actualizan listas y portales; perder un detalle puede costarte una ronda de entrevistas o retrasar el primer cheque por papeles mal presentados.',
    stakes:
      'En trabajo, el tiempo es ingreso. Un aviso cuando cambie algo en nuestra guía te deja alinear documentos antes de la oferta o el primer día.',
    closer:
      'Menos de un minuto y confirmación en pantalla. Correo solo si hay cambio publicado que te toque. Sin cadenas de “tips”; te das de baja cuando quieras. Si estás en búsqueda activa, activa el aviso hoy.',
    button: 'Avísame si cambia algo para mi empleo o papeles',
    success:
      '¡Listo! Estás en la lista de avisos para {tramite}. El siguiente email será uno solo si cambia algo en nuestra guía que afecte empleo, identificación o papeles de contratación.',
  },
  bank: {
    title: 'Cuenta bancaria: avisos si cambian requisitos con ITIN o ID',
    hook:
      'Los bancos ajustan qué aceptan con ITIN, matrícula o identificación estatal. Llegar con la lista de ayer suele significar otra visita o negativa que se evita con los requisitos vigentes.',
    stakes:
      'Sin cuenta, nómina y pagos se complican. Un aviso cuando actualicemos pasos o documentos te permite abrir o actualizar sin vueltas innecesarias.',
    closer:
      'Confirmación verde al momento; un solo email si cambia algo relevante en nuestra guía. No spam; cancelas cuando quieras. Si vas a abrir cuenta o cambiar de banco pronto, activa el aviso hoy.',
    button: 'Guardar avisos para abrir o usar mi cuenta',
    success:
      '¡Listo! Confirmación en verde: avisos para {tramite}. Te avisamos un solo correo si actualizamos requisitos de banco, ITIN o identificación en la guía.',
  },
  matricula: {
    title: 'Matrícula consular e ITIN: avisos si cambian criterios',
    hook:
      'Lo que aceptan bancos o el IRS con matrícula e ITIN en la práctica va cambiando cuando actualizan guías y formularios; presentar con criterios viejos puede significar rechazo o volver con otro papel.',
    stakes:
      'Un aviso cuando actualicemos documentos o pasos te da margen antes de la cita o el envío—menos idas y menos sorpresas en ventanilla.',
    closer:
      'Registro breve, confirmación instantánea. Solo te escribimos si publicamos un cambio que te afecte. Sin boletines; baja en un clic. Si vas a usar matrícula o ITIN pronto, activa el aviso ahora.',
    button: 'Avísame si cambia algo para matrícula o ITIN',
    success:
      '¡Listo! Tu correo quedó en avisos para {tramite}. Un solo correo si cambia lo publicado sobre matrícula consular, ITIN o documentos relacionados en HazloAsíYa.',
  },
}

function interpolate(template: string, tramite: string): string {
  return template.replace(/\{tramite\}/g, tramite)
}

export function getEmailCaptureCopy(funnelId: string, tramiteLabel: string): EmailCaptureFunnelCopy {
  const base = isValidFunnelId(funnelId) ? BY_FUNNEL[funnelId] : DEFAULT
  return {
    title: interpolate(base.title, tramiteLabel),
    hook: interpolate(base.hook, tramiteLabel),
    stakes: interpolate(base.stakes, tramiteLabel),
    closer: interpolate(base.closer, tramiteLabel),
    button: interpolate(base.button, tramiteLabel),
    success: interpolate(base.success, tramiteLabel),
  }
}
