import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Qué es el ITIN y quién lo emite?',
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

        {/* §3c — documentos IRS con ejemplos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que el IRS suele exigir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            La lista aceptada depende de tu país y categoría en el W-7. Los ejemplos orientan; confirma la tabla vigente en
            irs.gov.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y estado migratorio (si aplica)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Pasaporte válido suele ser documento destacado; matrícula consular solo si las instrucciones lo permiten.</li>
                <li>Combinaciones de ID + prueba adicional según el país emisor (ver anexo del W-7).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Razón fiscal (tax return u excepción)</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Declaración federal adjunta cuando las instrucciones lo exigen, o carta de excepción permitida (dependiente, etc.).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Si usas Acceptance Agent</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Copias certificadas que el agente revise en persona; no envías originales al IRS salvo regla contraria.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Traducciones y calidad</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Traducción certificada si el documento no está en inglés y el IRS la pide; fotos nítidas, sin recortes.</li>
              </ul>
            </div>
          </div>
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

        {/* §3d — ≤ 6 pasos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos para el paquete W-7</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Descarga W-7 e instrucciones del año en curso en irs.gov.</li>
            <li>Elige vía: correo al IRS, Acceptance Agent o centro de asistencia autorizado según tu caso.</li>
            <li>Completa datos sin tachaduras; firma donde indique el formulario.</li>
            <li>Adjunta identidad aceptada y declaración u hoja de excepción si aplica.</li>
            <li>Usa la dirección de envío vigente en las instrucciones; guarda tracking del correo.</li>
            <li>Espera la carta CP565 o resolución; renueva antes de vencer si declaras cada año.</li>
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

        {/* §3e — 5 errores */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que devuelven el W-7 o retrasan meses</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Enviar matrícula consular cuando el IRS ya no la acepta como documento independiente en tu categoría.</li>
            <li>Mandar copias ilegibles o cortadas donde no se lee fecha de nacimiento o número de documento.</li>
            <li>Olvidar la declaración o la excepción cuando las instrucciones las exigen en el mismo envío.</li>
            <li>Firmar con nombre distinto al del ID o usar formulario W-7 vencido.</li>
            <li>No incluir traducción certificada cuando el documento está en otro idioma y la tabla lo pide.</li>
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
