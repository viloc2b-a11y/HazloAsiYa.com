import Link from 'next/link'

/**
 * Contenido editorial en /snap/ (HHSC / USDA FNS — referencia oct 2025–sep 2026).
 */
export default function SnapEditorialSection() {
  return (
    <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="snap-edu-que-es">
      <div>
        <h2 id="snap-edu-que-es" className="font-serif text-2xl text-navy mb-3">
          ¿Qué es SNAP y quién califica en Texas?
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          SNAP (cupones de comida) es un programa federal que en Texas administra HHSC. Ayuda a hogares con ingresos y
          recursos dentro de los límites vigentes a comprar alimentos. Si calificas depende del tamaño de tu hogar, ingresos
          deducibles y la documentación que presentes; la agencia revisa cada caso según las reglas del momento.
        </p>
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

      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Documentos que necesitas</h2>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          Texas suele pedir comprobantes según tu situación. Ten a mano lo que aplique a tu hogar; la lista exacta puede
          variar según HHSC y el canal en que aplicas (en línea, teléfono o oficina).
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>Identificación con foto o alternativas aceptadas por HHSC para miembros del hogar.</li>
          <li>Número de Seguro Social o documentación alternativa según las reglas vigentes.</li>
          <li>Comprobantes de ingresos (nóminas, declaración de impuestos, cartas de beneficios, etc.).</li>
          <li>Comprobante de domicilio en Texas (recibo de servicios, contrato de arrendamiento, etc.).</li>
          <li>Gastos deducibles permitidos (cuidado de dependientes, vivienda, médicos) cuando correspondan.</li>
        </ul>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Errores comunes que causan rechazos</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
          <li>No declarar a todos los miembros del hogar que comparten comida.</li>
          <li>Enviar ingresos incompletos o desactualizados (horas extra, segundo trabajo, efectivo informal).</li>
          <li>Documentos ilegibles, vencidos o que no coinciden con los nombres declarados.</li>
          <li>Omitir una entrevista o no responder a solicitudes de información dentro del plazo.</li>
          <li>Usar una dirección que no refleja dónde vive realmente el hogar.</li>
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
