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
          WIC
        </Link>
        {' · '}
        <Link href="/guias/" className="text-green font-semibold hover:underline">
          Índice de guías
        </Link>
      </p>

      {/* §3b — qué es / califica (SEO + fricción real) */}
      <div>
        <h2 id="snap-edu-que-es" className="font-serif text-2xl text-navy mb-3">
          ¿Qué es SNAP y quién puede calificar?
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          SNAP (cupones de comida) es un programa que ayuda a pagar alimentos en EE.UU. usando una tarjeta mensual.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Muchas personas no aplican porque creen que no califican o porque no saben qué documentos les van a pedir. En la
          práctica, el problema suele ser llegar con información incompleta o desactualizada.
        </p>
        <p className="text-gray-600 text-sm font-medium text-navy mb-2">Puedes calificar según:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed mb-3">
          <li>Ingresos del hogar (no solo salario, también gastos)</li>
          <li>Número de personas en casa</li>
          <li>Situación laboral o familiar</li>
          <li>Estado donde vives (reglas cambian por estado)</li>
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed">
          Cada estado tiene su propia agencia: HHSC en Texas, CDSS en California, DCF en Florida, y OTDA en Nueva York. Todos incluyen revisión de documentos y entrevista.
        </p>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Límites de ingresos SNAP 2026 (referencia federal)</h2>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Referencia federal <strong>bruta mensual</strong> para el periodo{' '}
          <strong>octubre 2025 – septiembre 2026</strong>. La agencia de tu estado aplica las reglas vigentes y puede pedir comprobantes.
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

      {/* §3c — documentos (versión optimizada) */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-3">Documentos que normalmente te van a pedir</h2>
        <p
          className="text-sm text-amber-900/95 bg-amber-50 border border-amber-200/90 rounded-xl px-4 py-3 mb-3 leading-relaxed"
          role="note"
        >
          Un documento incorrecto o incompleto suele significar que te regresen la solicitud o tengas que volver con otra
          cita.
        </p>
        <p className="text-sm text-navy/90 bg-emerald-50/80 border border-green/20 rounded-xl px-4 py-3 mb-5 leading-relaxed">
          Aquí tienes ejemplos reales de lo que sí aceptan, para que no adivines.
        </p>
        <div className="space-y-5 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-navy mb-2">Identidad</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>ID estatal o licencia de conducir de tu estado</li>
              <li>Pasaporte (aunque esté vencido en algunos casos)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Ingresos</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Talones de cheque recientes</li>
              <li>Carta del empleador</li>
              <li>W-2 o 1099</li>
            </ul>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Si no tienes talones: puedes usar carta firmada del trabajo o historial bancario.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Domicilio</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Recibo de luz, gas o agua a tu nombre</li>
              <li>Contrato de renta</li>
            </ul>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Si no tienes contrato: carta del dueño o de la persona con quien vives.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-navy mb-2">Errores comunes aquí</h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Nombres distintos en documentos</li>
              <li>Talones incompletos</li>
              <li>Dirección que no coincide</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-navy/90 font-medium mt-4 pt-4 border-t border-cream leading-relaxed">
          Empieza por identidad y domicilio: son los que suelen revisar primero en la agencia de tu estado.
        </p>
      </div>

      {/* §3d — paso a paso (versión final) */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-2">Cómo solicitar SNAP paso a paso</h2>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Puedes hacerlo en línea y guardar tu avance. El proceso toma <strong>~45–90 minutos</strong> de tu lado.
        </p>
        <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
          <li>
            <span className="font-medium text-navy">
              Crear cuenta en el portal de tu estado
            </span>{' '}
            <span className="text-gray-500 text-xs whitespace-nowrap">(~5–10 min)</span>
            <span className="block mt-1 text-gray-600">
              TX: YourTexasBenefits.com · CA: BenefitsCal.com · FL: AccessFlorida.com · NY: myBenefits.ny.gov
            </span>
          </li>
          <li>
            <span className="font-medium text-navy">Llenar la solicitud</span>{' '}
            <span className="text-gray-500 text-xs whitespace-nowrap">(~20–40 min)</span>
            <span className="block mt-1 text-gray-600">Después: el sistema calcula tu caso preliminar.</span>
          </li>
          <li>
            <span className="font-medium text-navy">Subir documentos</span>{' '}
            <span className="text-gray-500 text-xs whitespace-nowrap">(~10–25 min)</span>
            <span className="block mt-1 text-gray-600">Después: la agencia de tu estado revisa tu información.</span>
          </li>
          <li>
            <span className="font-medium text-navy">Esperar contacto o entrevista</span>{' '}
            <span className="text-gray-500 text-xs whitespace-nowrap">(días–semanas)</span>
            <span className="block mt-1 text-gray-600">Después: te pueden pedir aclaraciones.</span>
          </li>
          <li>
            <span className="font-medium text-navy">Recibir decisión</span>
            <span className="block mt-1 text-gray-600">Después: aprobación o solicitud de correcciones.</span>
          </li>
          <li>
            <span className="font-medium text-navy">Corregir si falta algo</span>{' '}
            <span className="text-gray-500 text-xs whitespace-nowrap">(~10–30 min)</span>
            <span className="block mt-1 text-gray-600">
              Después: si algo falta, el proceso puede reiniciarse y moverse semanas.
            </span>
          </li>
        </ol>
      </div>

      {/* §3e — errores (versión final) */}
      <div>
        <h2 className="font-serif text-2xl text-navy mb-2">Errores comunes que retrasan tu solicitud</h2>
        <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
          <li>
            <strong className="text-navy">Subir documentos incompletos</strong> → lo más común es que te regresen el caso
            y tengas que volver a empezar con semanas adicionales de espera.
          </li>
          <li>
            <strong className="text-navy">No revisar notificaciones de la agencia</strong> → puedes perder solicitudes de
            información y cerrar el caso.
          </li>
          <li>
            <strong className="text-navy">Dirección incorrecta</strong> → retrasos o rechazo por inconsistencia.
          </li>
          <li>
            <strong className="text-navy">No contestar entrevista</strong> → el proceso se detiene automáticamente.
          </li>
          <li>
            <strong className="text-navy">Usar documentos viejos</strong> → te piden volver a enviar todo actualizado.
          </li>
        </ul>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed border-t border-cream pt-6">
        Más detalle por estado:{' '}
        <Link href="/snap/texas/" className="text-green font-semibold underline">
          Texas
        </Link>
        {' · '}
        <Link href="/snap/california/" className="text-green font-semibold underline">
          California
        </Link>
        {' · '}
        <Link href="/snap/florida/" className="text-green font-semibold underline">
          Florida
        </Link>
        {' · '}
        <Link href="/snap/new-york/" className="text-green font-semibold underline">
          Nueva York
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
