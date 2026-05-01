import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué es Section 8 o ayuda basada en voucher?',
    a: 'Son programas de HUD que ayudan a pagar parte de la renta en viviendas privadas; las listas de espera suelen ser largas y cada autoridad de vivienda (PHA) administra su propia lista.',
  },
  {
    q: '¿Dónde busco ayuda con renta en Texas?',
    a: 'HUD y las agencias locales publican recursos; también hay programas estatales o del condado según emergencias. Verifica sitios oficiales (.gov) y evita pagar por “acceso” a listas gratuitas.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación vivienda y renta',
  serviceType: 'Información sobre vivienda asequible',
  description: 'Contenido educativo sobre alquiler, HUD y recursos en Texas.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/rent/'),
  areaServed: { '@type': 'State', name: 'Texas' },
  availableLanguage: 'Spanish',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'Renta', item: absoluteUrl('/rent/') },
  ],
}

export default function RentEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="rent-edu">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <Link href="/guias/ayuda-para-pagar-renta-en-tu-ciudad/" className="text-green font-semibold hover:underline">
            Guía ayuda para renta
          </Link>
          {' · '}
          <a href="https://www.hud.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            HUD.gov
          </a>
          {' · '}
          <Link href="/snap/" className="text-green font-semibold hover:underline">
            SNAP (hogar)
          </Link>
          {' · '}
          <Link href="/medicaid/" className="text-green font-semibold hover:underline">
            Medicaid / CHIP
          </Link>
          {' · '}
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Más guías
          </Link>
        </p>

        {/* §3b */}
        <div>
          <h2 id="rent-edu" className="font-serif text-2xl text-navy mb-3">
            Alquiler y programas de vivienda (orientación)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Si tienes dificultad para pagar la renta, las opciones dependen de tu ciudad, ingresos y tamaño del hogar.
            HUD, autoridades de vivienda locales (<strong>PHA</strong>) y programas de emergencia estatales o del condado
            cambian cupos y requisitos cada año.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Muchas listas de espera duran meses o años; inscribirse temprano, responder cartas y mantener teléfono y correo
            actualizados evita perder el turno.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Section 8 / voucher:</strong> subsidio que paga parte de la renta en unidad aprobada; listas PHA
              propias.
            </li>
            <li>
              <strong>Emergencias:</strong> fondos puntuales vía ciudad o condado cuando hay desastre o cierre de
              programas; plazos cortos.
            </li>
            <li>
              <strong>Evicción:</strong> defensa legal o mediación en condados con servicios gratuitos; actúa al recibir
              aviso, no el día del desalojo.
            </li>
            <li>
              <strong>Estafas:</strong> nadie oficial cobra por “entrar primero” a listas HUD públicas.
            </li>
          </ul>
        </div>

        {/* §3c — ejemplos, plan B, problemas típicos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            PHA y programas de emergencia piden casi siempre <strong>lo mismo en distinto orden</strong>: quién vive ahí,
            cuánto entra y cuánto pides de renta. Si falta un papel, pide lista escrita en la ventanilla o por correo; no te
            vayas solo con “llámanos”.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y composición del hogar</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> actas de nacimiento de menores, licencias de adultos, tarjetas de
                  residencia si aplican; custodia si el menor no es hijo biológico del solicitante.
                </li>
                <li>
                  <strong>Si alguien no tiene ID válido:</strong> pregunta qué alternativa aceptan (pasaporte, matrícula +
                  comprobante); a veces dan plazo de 10 días.
                </li>
                <li>
                  <strong>Suele fallar:</strong> declarar 3 personas y traer pruebas de 2; hijo adulto que vive en casa no
                  listado.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> 4 talones recientes si hay trabajo por hora; carta de empleo en hoja con
                  teléfono del patrón; carta de SSI/SSDI; captura de depósitos si trabajas por cuenta propia.
                </li>
                <li>
                  <strong>Si cobras en efectivo:</strong> diario de horas firmado por el patrón, contrato verbal por
                  escrito, o declaración jurada según lo que acepte la agencia.
                </li>
                <li>
                  <strong>Suele fallar:</strong> ingreso del cónyuge no reportado; solo un talón cuando piden 30 días;
                  efectivo “sin respaldo”.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Arrendamiento</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> lease firmado, recibos de renta con fecha y monto, aviso de pago atrasado
                  del propietario o demanda de desalojo si pides ayuda legal o fondo de emergencia.
                </li>
                <li>
                  <strong>Si no tienes contrato escrito:</strong> recibos de Zelle/efectivo firmados, mensajes donde el
                  dueño confirma renta y dirección, o declaración del arrendador en formulario de la ciudad.
                </li>
                <li>
                  <strong>Suele fallar:</strong> dirección del lease que no coincide con donde vives; recibos sin nombre del
                  inquilino.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Crisis o desastre</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> fotos con fecha de inundación o incendio, corte de luz/gas, carta del
                  administrador con costo de reparación.
                </li>
                <li>
                  <strong>Si no tomaste fotos el día del daño:</strong> informe de bomberos, reporte de seguro o recibo de
                  motel de emergencia como respaldo indirecto.
                </li>
                <li>
                  <strong>Suele fallar:</strong> aplicar a fondo de desastre sin número de caso FEMA cuando era requisito;
                  pruebas sin fecha visible.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Pasos típicos para buscar ayuda</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            El trámite es de <strong>varias semanas o meses</strong>, no de una tarde: la lista de espera no se mueve hasta
            que completas cada paso. Reserva <strong>1–2 h</strong> la primera semana para preinscripción y carpeta; luego
            son mini-tareas cuando te escriben.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Ubica tu PHA (HUD.gov o sitio de la ciudad)</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes qué portal usar y qué programa manejan (Section 8, fondos locales, etc.).
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Preinscripción en línea o en oficina</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20–45 min</span>
              <span className="block mt-1 text-gray-600">
                Después: recibes número de confirmación o estás en lista; sin ese número, no puedes reclamar lugar después.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Arma carpeta: IDs, ingresos, lease, recibos de renta</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30–60 min</span>
              <span className="block mt-1 text-gray-600">
                Después: cuando te llaman a entrevista, solo llevas la carpeta — no corres a sacar talones ese mismo día.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Responde cartas y llamadas antes del plazo</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min cada aviso</span>
              <span className="block mt-1 text-gray-600">
                Después: el caso sigue “activo”; si cambias de número, actualiza en el portal para no perder el turno sin
                saberlo.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Aviso de desalojo: busca ayuda legal ese mismo mes</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~1 h primera llamada</span>
              <span className="block mt-1 text-gray-600">
                Después: tienes fecha de defensa o mediación; muchas líneas legales cierran si llamas tarde.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que te sacan de la lista — o te dejan sin defensa</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            En vivienda, el error no se arregla con “perdón”: <strong>años en lista de espera</strong> se pierden en una
            carta sin respuesta, y sin papeles no hay fondo de emergencia cuando el desalojo está encima.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Ignorar “actualice sus datos”.</strong> Muchas PHA te dan{' '}
              <strong>plazo corto</strong>; si no respondes, <strong>te borran de la lista</strong> y empiezas el trámite
              desde cero en una ciudad con espera de años.
            </li>
            <li>
              <strong className="text-navy">Pagar a alguien por “cupo garantizado”.</strong> Suele ser{' '}
              <strong>estafa</strong>: pierdes el dinero y sigues sin voucher; HUD no vende puestos.
            </li>
            <li>
              <strong className="text-navy">No reportar más ingreso o un nuevo adulto en el hogar.</strong> Si lo detectan
              en auditoría, el resultado puede ser <strong>terminación del subsidio</strong> y deuda de reembolso por
              meses mal calculados.
            </li>
            <li>
              <strong className="text-navy">Rentas en efectivo sin recibo firmado.</strong> Sin prueba, programas de
              emergencia o mediación pueden <strong>negarte ayuda</strong> justo cuando el dueño ya mandó desalojo.
            </li>
            <li>
              <strong className="text-navy">Mudanza sin avisar a la PHA.</strong> Incumplimiento de reglas puede significar{' '}
              <strong>pérdida del voucher</strong> o descalificación futura; no es solo un cambio de dirección.
            </li>
          </ul>
        </div>
        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5">
          <h2 className="font-serif text-xl text-navy mb-4">Preguntas frecuentes</h2>
          <dl className="space-y-4 text-sm">
            {faqItems.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-navy">{f.q}</dt>
                <dd className="text-gray-600 mt-1 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="text-xs text-gray-500">HazloAsíYa no es HUD ni tu arrendador.</p>
      </section>
    </>
  )
}
