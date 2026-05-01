import Link from 'next/link'

/**
 * Contenido editorial en /snap/ (HHSC / USDA FNS — referencia oct 2025–sep 2026).
 * §3b–§3e y §5 — docs/seo-bloques-y-prompts.md
 */
export default function SnapEditorialSection() {
  return (
    <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="snap-edu-que-es">
      <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
        <strong>También te puede interesar:</strong>{' '}
        <Link href="/snap/texas/" className="text-green font-semibold hover:underline">
          SNAP en Texas (datos locales)
        </Link>
        {' · '}
        <Link href="/guias/documentos-para-snap/" className="text-green font-semibold hover:underline">
          Documentos para SNAP (guía detallada)
        </Link>
        {' · '}
        <Link href="/medicaid/" className="text-green font-semibold hover:underline">
          Medicaid y CHIP
        </Link>
        {' · '}
        <Link href="/wic/" className="text-green font-semibold hover:underline">
          WIC en Texas
        </Link>
        {' · '}
        <Link href="/guias/" className="text-green font-semibold hover:underline">
          Índice de guías
        </Link>
      </p>

      {/* §3b — qué es / califica: 2 párrafos + 4 viñetas */}
      <div>
        <h2 id="snap-edu-que-es" className="font-serif text-2xl text-navy mb-3">
          ¿Qué es SNAP y quién califica en Texas?
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          SNAP (cupones de comida) es un programa federal que en Texas administra HHSC. Ayuda a hogares con ingresos y
          recursos dentro de los límites vigentes a comprar alimentos en tiendas autorizadas; no cubre alcohol, tabaco ni
          comida caliente para llevar.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Si calificas depende del tamaño de tu hogar, ingresos brutos y deducciones permitidas, ciudadanía o categoría
          migratoria aceptada, y la documentación que presentes. HHSC revisa cada caso; una entrevista o más pruebas son
          normales si algo no cuadra.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>
            <strong>Hogar:</strong> quienes compran y preparan comida juntos suelen contarse juntos; no omitas miembros
            por miedo.
          </li>
          <li>
            <strong>Ingresos:</strong> salario, trabajo por cuenta propia, beneficios y a veces ayuda de familia cuentan;
            revisa el límite bruto de tu tamaño de hogar.
          </li>
          <li>
            <strong>Recursos:</strong> límites en efectivo y cuentas (excepciones para ciertos hogares); HHSC puede pedir
            estados de cuenta.
          </li>
          <li>
            <strong>Trabajo o reglas de empleo y capacitación:</strong> algunos solicitantes deben cumplir requisitos de registro de
            empleo o exenciones; pregunta en tu aviso si te aplican.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Límites de ingresos SNAP Texas 2026</h2>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Referencia federal <strong>bruta mensual</strong> para el periodo{' '}
          <strong>octubre 2025 – septiembre 2026</strong>. HHSC aplica las reglas vigentes y puede pedir comprobantes.
        </p>
        <div className="overflow-x-auto rounded-xl border border-cream bg-white">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-cream bg-cream-2">
                <th className="p-3 font-semibold text-navy">Personas en el hogar</th>
                <th className="p-3 font-semibold text-navy">Límite bruto mensual (aprox.)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cream">
                <td className="p-3">1</td>
                <td className="p-3">$1,580</td>
              </tr>
              <tr className="border-b border-cream">
                <td className="p-3">2</td>
                <td className="p-3">$2,137</td>
              </tr>
              <tr className="border-b border-cream">
                <td className="p-3">3</td>
                <td className="p-3">$2,694</td>
              </tr>
              <tr className="border-b border-cream">
                <td className="p-3">4</td>
                <td className="p-3">$3,250</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Fuente:{' '}
          <a
            href="https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program"
            className="text-green underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            USDA FNS
          </a>
          , vigente oct. 2025–sep. 2026.
        </p>
      </div>

      {/* §3c — documentos por categorías con ejemplos concretos */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Documentos que necesitas (con ejemplos)</h2>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          La lista exacta depende de tu hogar y del canal (en línea, teléfono u oficina). Evita fotos borrosas y nombres
          que no coincidan con la solicitud.
        </p>
        <div className="space-y-5 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-navy mb-2">Identidad y autorización</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Licencia de Texas o matrícula consular + comprobante alterno si HHSC lo acepta en tu caso.</li>
              <li>Actas o prueba de parentesco si declaras niños o cónyuge en el hogar.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Ingresos (últimos 30–60 días o más si te lo piden)</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Últimos talones de cheque o carta de salario con horas y tarifa.</li>
              <li>Estado de cuenta de depósito si cobras por transferencia o efectivo informal documentado.</li>
              <li>Carta de desempleo, manutención o pensión con monto y periodo.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Domicilio en Texas</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Recibo de luz, gas o agua a tu nombre; o contrato de arrendamiento firmado.</li>
              <li>Carta del dueño con fecha si vives con familia y no hay recibo a tu nombre (según lo que acepte HHSC).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Gastos que pueden descontarse</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Pago de renta o hipoteca, recibos de cuidado infantil elegible, gastos médicos altos con factura.</li>
              <li>Pagos de manutención legalmente ordenados cuando apliquen.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* §3d — pasos ≤ 6 */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Pasos típicos para aplicar</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>Reúne identificación, ingresos y domicilio antes de abrir la solicitud.</li>
          <li>
            Entra a{' '}
            <a
              href="https://yourtexasbenefits.com"
              className="text-green font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YourTexasBenefits.com
            </a>{' '}
            o usa el canal que prefieras (app, teléfono u oficina local).
          </li>
          <li>Declara a todos los miembros del hogar que comparten comida y sus ingresos sin redondear “a ojo”.</li>
          <li>Sube o entrega documentos claros; guarda capturas o números de confirmación.</li>
          <li>Atiende la entrevista si te la programan y responde avisos antes del plazo.</li>
          <li>Revisa la carta de elegibilidad: fecha de inicio, monto y qué reportar si cambia tu situación.</li>
        </ol>
      </div>

      {/* §3e — exactamente 5 errores, urgencia real */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Errores comunes que retrasan o niegan el caso</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>No listar a un adulto o niño que vive y come en el hogar: HHSC puede cruzar datos y cerrar el caso.</li>
          <li>Mandar solo un talón de cheque cuando cobras semanal o tienes dos trabajos: falta de prueba = más demoras.</li>
          <li>Documentos ilegibles, cortados o con nombres distintos al de la solicitud.</li>
          <li>Ignorar la entrevista o el sobre amarillo: sin respuesta, suelen denegar o cerrar por abandono.</li>
          <li>Usar una dirección postal donde nadie del hogar vive: puede contarse como fraude o error grave.</li>
        </ul>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed border-t border-cream pt-6">
        Más detalle local:{' '}
        <Link href="/snap/texas/" className="text-green font-semibold underline">
          SNAP en Texas (guía ampliada)
        </Link>
        . Lista documental paso a paso:{' '}
        <Link href="/guias/documentos-para-snap/" className="text-green font-semibold underline">
          documentos para SNAP
        </Link>
        .
      </p>
    </section>
  )
}
