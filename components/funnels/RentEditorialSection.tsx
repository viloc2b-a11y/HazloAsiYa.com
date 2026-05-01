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

        {/* §3c */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que suelen pedir (con ejemplos)</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Identidad y composición del hogar</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Actas o IDs de adultos; custodia si declaras menores que no son hijos biológicos tuyos.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Talones de los últimos 30–60 días, carta de empleo o beneficios (SSI, desempleo) con monto.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Arrendamiento</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Contrato firmado, recibos de pago o aviso de mora si pides ayuda de emergencia.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Crisis o desastre</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Fotos de daños, corte de servicios o carta del propietario cuando programas federales o locales lo exigen.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos para buscar ayuda</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Identifica tu PHA en HUD.gov o el portal de tu ciudad.</li>
            <li>Abre o renueva preinscripción en línea; guarda número de confirmación.</li>
            <li>Junta ingresos, IDs y contrato antes de la cita o entrevista.</li>
            <li>Responde cartas o llamadas en plazo; si cambias de teléfono, actualiza datos.</li>
            <li>Si hay riesgo de desalojo, busca asistencia legal el mismo mes del aviso.</li>
          </ol>
        </div>

        {/* §3e */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Errores que te quitan la plaza o el dinero</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Ignorar una carta de “actualizar datos” y perder el lugar en lista sin saberlo.</li>
            <li>Pagar a un tercero por “acelerar Section 8” — suele ser fraude.</li>
            <li>No reportar que subiste ingresos o integrantes del hogar: puede anular el subsidio después.</li>
            <li>Firmar pagos en efectivo sin recibo al propietario: no pruebas para programas de emergencia.</li>
            <li>Mudarte sin notificar a la PHA dentro del plazo que indiquen las reglas locales.</li>
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
