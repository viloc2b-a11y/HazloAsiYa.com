import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'
import PrivacyBadge from '@/components/PrivacyBadge'
    a: 'El ITIN (Individual Taxpayer Identification Number) es un número de identificación fiscal de 9 dígitos que emite el IRS para personas que deben declarar impuestos en EE.UU. pero no califican para un Social Security Number (SSN). El formato suele mostrarse como 9XX-XX-XXXX (el primer dígito es 9). Más información: irs.gov/itin.',
  },
  {
    q: '¿El ITIN autoriza trabajar legalmente en EE.UU.?',
    a: 'No. El ITIN sirve para obligaciones y trámites fiscales; no autoriza empleo por sí solo y no reemplaza al SSN para trabajo en relación de dependencia. No “arregla” el estatus migratorio.',
  },
  {
    q: '¿Dónde puedo tramitar el W-7 en Houston con ayuda gratuita o bajo costo?',
    a: 'El IRS coordina el programa VITA (Volunteer Income Tax Assistance), gratuito para hogares con ingresos por debajo del umbral que publique el IRS cada año (históricamente alrededor de $67,000). Busca sitios en irs.gov/vita. En Houston también hay organizaciones comunitarias que en temporada fiscal ayudan con preparación; confirma horarios y si atienden W-7 antes de ir.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación ITIN y formulario W-7',
  serviceType: 'Orientación para obtención de ITIN',
  description:
    'Contenido educativo en español sobre el ITIN, usos permitidos, formulario W-7 y recursos locales. No sustituye asesoría de un Acceptance Agent ni preparador certificado.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/itin/'),
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
    { '@type': 'ListItem', position: 2, name: 'ITIN', item: absoluteUrl('/itin/') },
  ],
}

/**
 * Contenido editorial en /itin/ (IRS — referencia abril 2026).
 */
export default function ItinEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="itin-edu-que-es">
        <PrivacyBadge />
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <strong>En la misma línea:</strong>{' '}
          <Link href="/itin/houston/" className="text-green font-semibold hover:underline">
            ITIN en Houston
          </Link>
          {' · '}
          <Link href="/taxes/" className="text-green font-semibold hover:underline">
            Declarar impuestos
          </Link>
          {' · '}
          <Link href="/bank/" className="text-green font-semibold hover:underline">
            Cuenta bancaria
          </Link>
          {' · '}
          <Link href="/guias/como-llenar-la-w7/" className="text-green font-semibold hover:underline">
            Guía W-7
          </Link>
          {' · '}
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Índice de guías
          </Link>
        </p>

        {/* §3b */}
        <div>
          <h2 id="itin-edu-que-es" className="font-serif text-2xl text-navy mb-3">
            ¿Qué es el ITIN y quién lo necesita?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Es un número de <strong>9 dígitos</strong> que el <strong>IRS</strong> asigna cuando debes identificarte ante
            el fisco federal y <strong>no calificas para un SSN</strong>. Formato habitual <strong>9XX-XX-XXXX</strong>. No
            autoriza empleo ni arregla estatus migratorio. Fuente:{' '}
            <a href="https://www.irs.gov/itin" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              irs.gov/itin
            </a>
            .
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            El trámite oficial va con el formulario <strong>W-7</strong> y documentos de identidad aceptados; versiones y
            listas cambian, descarga siempre la revisión vigente.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Personas con ingresos sujetos a declaración federal sin SSN elegible.</li>
            <li>Cónyuge o dependiente cuando la declaración conjunta o créditos lo requieren.</li>
            <li>Propietarios de negocio o contratistas que deben reportar ingresos con ID fiscal.</li>
            <li>Quien necesita ITIN para otro trámite IRS explícito en las instrucciones del W-7.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">¿Para qué sirve el ITIN?</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-green/25 bg-emerald-50/40 p-4">
              <p className="font-semibold text-navy mb-2">Sí suele servir para</p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li>Declarar impuestos federales y, cuando aplica, estatales</li>
                <li>Abrir cuentas bancarias en algunas instituciones</li>
                <li>Recibir pagos como contratista independiente (reporte fiscal)</li>
                <li>Algunos programas locales o becas que piden identificación fiscal</li>
              </ul>
            </div>
            <div className="rounded-xl border border-cream bg-white p-4">
              <p className="font-semibold text-navy mb-2">No sirve para</p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li>Autorizar empleo en relación de dependencia en EE.UU.</li>
                <li>Cambiar o “arreglar” el estatus migratorio</li>
                <li>Sustituir al SSN donde la ley exige SSN para empleo formal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3c — documentos IRS: ejemplos, plan B, problemas típicos */}
        <div>
          <p
            className="text-sm text-amber-900/95 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-3 mb-3 leading-relaxed"
            role="note"
          >
            Un solo documento incorrecto o incompleto suele significar que te regresen la solicitud o te pidan volver con
            otra cita.
          </p>
          <p className="text-sm text-navy/90 bg-emerald-50/80 border border-green/20 rounded-xl px-4 py-3 mb-4 leading-relaxed">
            Aquí tienes ejemplos reales de lo que sí aceptan, para que no adivines.
          </p>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que el IRS suele exigir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            La tabla de documentos aceptados cambia por país y año. Antes de enviar, abre el <strong>W-7 y sus
            instrucciones</strong> del mes en curso. Si no tienes el “documento ideal”, revisa el anexo: a veces hay
            combinación de dos IDs; mejor eso que mandar solo la matrícula consular porque “es lo único que tengo”.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y estado migratorio (si aplica)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> pasaporte mexicano o de otro país vigente (mucha gente lo usa como
                  documento principal); combinación pasaporte + ID nacional según tabla del IRS para tu país.
                </li>
                <li>
                  <strong>Si no tienes pasaporte vigente:</strong> tramítalo primero o revisa si el IRS acepta otra
                  combinación listada; un Acceptance Agent a veces te orienta sin cobrar consulta inicial.
                </li>
                <li>
                  <strong>Suele fallar:</strong> matrícula consular sola cuando ya no basta; copia donde no se lee fecha de
                  nacimiento o número de documento; documento vencido.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Razón fiscal (tax return u excepción)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> declaración 1040 firmada adjunta cuando las instrucciones lo exigen;
                  excepción para dependiente o treaty si tu categoría lo permite (revisa el apartado correspondiente).
                </li>
                <li>
                  <strong>Si aún no declaras:</strong> no inventes números; prepara la declaración con preparador o VITA y
                  adjunta según el flujo que aplique a tu primera solicitud de ITIN.
                </li>
                <li>
                  <strong>Suele fallar:</strong> enviar W-7 sin la declaración cuando iban juntos; firmar con nombre distinto
                  al del ID.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Si usas Acceptance Agent</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Qué ganas:</strong> el agente certifica copias y a menudo evitas mandar pasaporte original por
                  correo.
                </li>
                <li>
                  <strong>Si no hay agente cerca:</strong> envío por correo certificado al IRS con copias según instrucción
                  (a veces sí piden original del pasaporte — léelo dos veces antes de sellar el sobre).
                </li>
                <li>
                  <strong>Suele fallar:</strong> mezclar paquete de Acceptance Agent con dirección de envío del contribuyente
                  sin revisar la guía del año.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Traducciones y calidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> traducción certificada al inglés del acta si el IRS la pide; escaneos
                  300 dpi, todas las esquinas visibles.
                </li>
                <li>
                  <strong>Si solo tienes foto del celular:</strong> vuelve a escanear en copistería o app de escaneo; el IRS
                  devuelve por ilegible.
                </li>
                <li>
                  <strong>Suele fallar:</strong> traducción hecha en casa sin certificado cuando la instrucción pide
                  certificación; cortar bordes del pasaporte en la copia.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
            Empieza por tu identificación y el formulario W-7: son la base del paquete.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Formulario W-7 — cómo solicitarlo</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            El trámite oficial del ITIN va con el <strong>formulario W-7</strong> y la documentación de identidad que el
            IRS acepte para tu categoría. Puedes enviar el paquete por correo, usar un{' '}
            <strong>Acceptance Agent</strong> autorizado o seguir las instrucciones vigentes en irs.gov. Revisa siempre la
            versión actual del formulario y las listas de documentos aceptados.
          </p>
          <p className="text-sm">
            <Link href="/guias/como-llenar-la-w7/" className="text-green font-bold underline">
              Ver guía completa del W-7 →
            </Link>
          </p>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Pasos típicos para el paquete W-7</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Hacerlo bien una vez suele tomar <strong>1–3 h</strong> repartidas (descargar, llenar, copiar, enviar). La
            respuesta del IRS suele ser <strong>semanas o meses</strong>, no días — por eso conviene tracking de correo y
            copia de todo.
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Descarga W-7 + instrucciones del mes en curso (irs.gov)</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min</span>
              <span className="block mt-1 text-gray-600">
                Después: trabajas siempre con la misma versión; evitas que rechacen por formulario viejo.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Elige vía: correo, Acceptance Agent o centro autorizado</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min leer</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes si debes enviar originales, citas con agente o sobre certificado; menos sorpresas en el
                buzón.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Llena a mano o en PDF sin tachaduras; firma</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20–40 min</span>
              <span className="block mt-1 text-gray-600">
                Después: el formulario está listo para adjuntar ID; si dudas en una casilla, revisa instrucciones antes de
                sellar el sobre.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Adjunta ID aceptada + declaración o excepción si aplica</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min</span>
              <span className="block mt-1 text-gray-600">
                Después: el paquete está completo según el checklist del año; haz una copia escaneada antes de enviar.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Envía a la dirección correcta; guarda tracking</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min en oficina postal</span>
              <span className="block mt-1 text-gray-600">
                Después: puedes rastrear entrega; cuando aparece “entregado”, empieza la espera del IRS con menos ansiedad.
                Más adelante recibes confirmación o te piden correcciones; si falta algo, el proceso puede reiniciarse.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Espera carta CP565 u otra respuesta</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">suele semanas+</span>
              <span className="block mt-1 text-gray-600">
                Después: o tienes ITIN asignado o carta de rechazo con motivo — en ambos casos ya sabes el siguiente
                movimiento; renueva antes de vencer si declaras cada año.
              </span>
            </li>
          </ol>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Dónde tramitarlo en Houston</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <strong>VITA (IRS):</strong> asistencia gratuita para quienes califican por ingresos; busca el sitio más
              cercano en{' '}
              <a href="https://www.irs.gov/vita" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
                irs.gov/vita
              </a>
              . El umbral de ingresos lo actualiza el IRS (a menudo citado alrededor de <strong>$67,000</strong> — confirma
              el año fiscal en curso).
            </li>
            <li>
              <strong>BakerRipley (Houston):</strong> dirección de referencia{' '}
              <strong>6500 Rookin St, Houston, TX 77074</strong>. Los servicios y citas cambian —{' '}
              <strong>verifica disponibilidad y si procesan W-7</strong> antes de visitar.
            </li>
            <li>
              <strong>Goodwill Houston:</strong> en temporada fiscal (enero–abril principalmente) algunas ubicaciones
              ofrecen preparación; revisa horarios en{' '}
              <a
                href="https://www.goodwillhouston.org"
                className="text-green font-semibold underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                goodwillhouston.org
              </a>
              .
            </li>
          </ul>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que devuelven el sobre y congelan tu declaración</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Cada devolución del IRS suele ser <strong>+2 a 4 meses</strong> sin ITIN: sin número no declaras bien, no
            cobras créditos y a veces no abres cuenta. Mejor frenar un día y revisar que el paquete esté completo.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Subir documentos incompletos.</strong> Lo más común es que te regresen el caso y
              tengas que volver a empezar con semanas adicionales de espera.
            </li>
            <li>
              <strong className="text-navy">ID que ya no califica sola (p. ej. matrícula consular mal aplicada).</strong> El
              IRS <strong>rechaza el lote</strong>; vuelves al final de la cola con el mismo problema si no cambias
              documento.
            </li>
            <li>
              <strong className="text-navy">Copia ilegible o recortada.</strong> No te llaman a aclarar: mandan carta de
              rechazo y <strong>pierdes el tiempo desde el envío hasta la respuesta</strong> sin ITIN en mano.
            </li>
            <li>
              <strong className="text-navy">Mandar W-7 sin la declaración o excepción cuando iban juntos.</strong> Paquete
              incompleto = <strong>devolución total</strong>; el reloj del año fiscal sigue y puedes perder ventana de
              reembolso.
            </li>
            <li>
              <strong className="text-navy">Firma distinta al ID o formulario vencido.</strong> Motivo automático de{' '}
              <strong>rechazo administrativo</strong>; algunos esperan meses solo para leer esa línea en la carta.
            </li>
            <li>
              <strong className="text-navy">Sin traducción certificada cuando la tabla la exige.</strong> El IRS no “traduce
              por ti”: <strong>rechazo</strong> y vuelves a pagar envío y tiempo perdido.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-navy/15 bg-white p-4">
          <h2 className="font-serif text-2xl text-navy mb-3">ITIN y carga pública</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Declarar impuestos con ITIN es en esencia una <strong>obligación fiscal</strong>, no un beneficio público de
            salud o nutrición. En muchos enfoques de política pública, <strong>no se trata como factor negativo de “carga
            pública”</strong> por el solo hecho de tener ITIN o declarar; igualmente, tu caso migratorio puede tener
            matices. <strong>Consulta con un profesional de inmigración</strong> para tu situación concreta.
          </p>
        </div>

        <section className="rounded-xl border border-green/25 bg-emerald-50/50 p-5" aria-labelledby="itin-faq">
          <h2 id="itin-faq" className="font-serif text-xl text-navy mb-4">
            Preguntas frecuentes
          </h2>
          <dl className="space-y-4 text-sm">
            {faqItems.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-navy">{f.q}</dt>
                <dd className="text-gray-600 mt-1 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </>
  )
}
