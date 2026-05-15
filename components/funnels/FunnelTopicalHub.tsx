import Link from 'next/link'
import type { FunnelId } from '@/data/funnels'

const hubBox = 'rounded-2xl border border-navy/10 bg-white p-6 sm:p-7 space-y-8 text-sm text-gray-700 leading-relaxed'

/**
 * Bloques editoriales breves para landings /snap/, /medicaid/, /itin/ como hubs temáticos.
 * Sin duplicar el contenido de las páginas estatales ni del hero.
 */
export default function FunnelTopicalHub({ id }: { id: FunnelId }) {
  if (id === 'snap') {
    return (
      <div className={hubBox} aria-label="Hub temático SNAP">
        <section aria-labelledby="hub-snap-que">
          <h2 id="hub-snap-que" className="font-serif text-xl text-navy mb-2">
            Qué es SNAP
          </h2>
          <p>
            SNAP son los <strong>cupones de comida</strong> (a veces llamados EBT): un programa federal para ayudar a
            comprar alimentos. Cada estado administra solicitudes, plazos y portal; el monto depende del hogar y las
            reglas vigentes.
          </p>
        </section>
        <section aria-labelledby="hub-snap-docs">
          <h2 id="hub-snap-docs" className="font-serif text-xl text-navy mb-2">
            Documentos que suelen pedir
          </h2>
          <p className="mb-2">
            Identidad, miembros del hogar, ingresos y gastos deducibles son lo más habitual. La lista exacta la confirma
            la agencia de tu estado el día que aplicas.
          </p>
          <p>
            <Link href="/guias/documentos-para-snap/" className="text-green font-semibold hover:underline">
              Cómo preparar documentos para SNAP (guía con checklist)
            </Link>
          </p>
        </section>
        <section aria-labelledby="hub-snap-estados">
          <h2 id="hub-snap-estados" className="font-serif text-xl text-navy mb-3">
            SNAP por estado
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/snap/texas/" className="text-green font-semibold hover:underline">
                SNAP en Texas — requisitos y pasos
              </Link>
            </li>
            <li>
              <Link href="/snap/california/" className="text-green font-semibold hover:underline">
                SNAP en California (CalFresh)
              </Link>
            </li>
            <li>
              <Link href="/snap/florida/" className="text-green font-semibold hover:underline">
                SNAP en Florida
              </Link>
            </li>
            <li>
              <Link href="/snap/new-york/" className="text-green font-semibold hover:underline">
                SNAP en Nueva York
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="hub-snap-tramites">
          <h2 id="hub-snap-tramites" className="font-serif text-xl text-navy mb-3">
            Trámites que suelen ir en paralelo
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/medicaid/" className="text-green font-semibold hover:underline">
                Medicaid y CHIP para cobertura médica
              </Link>
            </li>
            <li>
              <Link href="/wic/" className="text-green font-semibold hover:underline">
                WIC para embarazo y niños pequeños
              </Link>
            </li>
            <li>
              <Link href="/rent/" className="text-green font-semibold hover:underline">
                Ayuda para renta y vivienda
              </Link>
            </li>
            <li>
              <Link href="/escuela/" className="text-green font-semibold hover:underline">
                Inscripción escolar y documentos del distrito
              </Link>
            </li>
          </ul>
        </section>
      </div>
    )
  }

  if (id === 'medicaid') {
    return (
      <div className={hubBox} aria-label="Hub temático Medicaid y CHIP">
        <section aria-labelledby="hub-mc-que">
          <h2 id="hub-mc-que" className="font-serif text-xl text-navy mb-2">
            Qué son Medicaid y CHIP
          </h2>
          <p>
            <strong>Medicaid</strong> es el seguro médico público por ingresos o situación familiar. <strong>CHIP</strong>{' '}
            cubre a muchos niños cuando el ingreso está por encima del límite de Medicaid pero sigue siendo bajo. Cada
            estado tiene su portal y reglas.
          </p>
        </section>
        <section aria-labelledby="hub-mc-docs">
          <h2 id="hub-mc-docs" className="font-serif text-xl text-navy mb-2">
            Documentos que suelen pedir
          </h2>
          <p className="mb-2">
            Identidad, composición del hogar, ingresos y residencia son lo más frecuente. Revisa siempre el portal de tu
            estado antes de enviar.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/guias/documentos-para-medicaid/" className="text-green font-semibold hover:underline">
                Lista de documentos para Medicaid y CHIP
              </Link>
            </li>
            <li>
              <Link href="/guias/como-solicitar-medicaid-en-espanol/" className="text-green font-semibold hover:underline">
                Cómo solicitar Medicaid en español (pasos generales)
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="hub-mc-estados">
          <h2 id="hub-mc-estados" className="font-serif text-xl text-navy mb-3">
            Medicaid por estado
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/medicaid/texas/" className="text-green font-semibold hover:underline">
                Medicaid y CHIP en Texas
              </Link>
            </li>
            <li>
              <Link href="/medicaid/california/" className="text-green font-semibold hover:underline">
                Medicaid en California (Medi-Cal)
              </Link>
            </li>
            <li>
              <Link href="/medicaid/florida/" className="text-green font-semibold hover:underline">
                Medicaid en Florida
              </Link>
            </li>
            <li>
              <Link href="/medicaid/new-york/" className="text-green font-semibold hover:underline">
                Medicaid en Nueva York
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="hub-mc-tramites">
          <h2 id="hub-mc-tramites" className="font-serif text-xl text-navy mb-3">
            Programas que suelen ir junto con Medicaid
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/snap/" className="text-green font-semibold hover:underline">
                SNAP (alimentación del hogar)
              </Link>
            </li>
            <li>
              <Link href="/wic/" className="text-green font-semibold hover:underline">
                WIC para nutrición de embarazo e infancia
              </Link>
            </li>
            <li>
              <Link href="/escuela/" className="text-green font-semibold hover:underline">
                Inscripción escolar pública
              </Link>
            </li>
            <li>
              <Link href="/id/texas/" className="text-green font-semibold hover:underline">
                Texas ID o licencia (identificación oficial)
              </Link>
            </li>
          </ul>
        </section>
      </div>
    )
  }

  if (id === 'itin') {
    return (
      <div className={hubBox} aria-label="Hub temático ITIN">
        <section aria-labelledby="hub-itin-que">
          <h2 id="hub-itin-que" className="font-serif text-xl text-navy mb-2">
            Qué es el ITIN
          </h2>
          <p>
            El <strong>ITIN</strong> (Individual Taxpayer Identification Number) es un número del <strong>IRS</strong>{' '}
            para declarar impuestos u otras obligaciones fiscales cuando no calificas para Seguro Social.{' '}
            <strong>No es permiso de trabajo.</strong>
          </p>
        </section>
        <section aria-labelledby="hub-itin-docs">
          <h2 id="hub-itin-docs" className="font-serif text-xl text-navy mb-2">
            Documentos que suelen pedir
          </h2>
          <p className="mb-2">
            Identificación original o certificada según las instrucciones del IRS, formulario fiscal si aplica, y el
            sobre o cita con Acceptance Agent si eliges esa vía.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/guias/como-llenar-la-w7/" className="text-green font-semibold hover:underline">
                Cómo llenar el formulario W-7 paso a paso
              </Link>
            </li>
            <li>
              <Link href="/guias/que-es-el-itin-y-para-que-sirve/" className="text-green font-semibold hover:underline">
                Qué es el ITIN y para qué sirve (guía breve)
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="hub-itin-irs">
          <h2 id="hub-itin-irs" className="font-serif text-xl text-navy mb-2">
            IRS y formulario W-7
          </h2>
          <p>
            Las reglas y anexos cambian; la fuente oficial es el IRS. Consulta las instrucciones vigentes del{' '}
            <a
              href="https://www.irs.gov/forms-pubs/about-form-w-7"
              className="text-green font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              formulario W-7 en irs.gov
            </a>{' '}
            antes de enviar tu paquete.
          </p>
        </section>
        <section aria-labelledby="hub-itin-tramites">
          <h2 id="hub-itin-tramites" className="font-serif text-xl text-navy mb-3">
            Trámites útiles si necesitas ITIN
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-green">
            <li>
              <Link href="/taxes/" className="text-green font-semibold hover:underline">
                Declaración de impuestos (IRS)
              </Link>
            </li>
            <li>
              <Link href="/bank/" className="text-green font-semibold hover:underline">
                Abrir cuenta bancaria con ITIN o ID
              </Link>
            </li>
            <li>
              <Link href="/jobs/" className="text-green font-semibold hover:underline">
                Empleo: I-9 y documentos laborales
              </Link>
            </li>
            <li>
              <Link href="/daca/" className="text-green font-semibold hover:underline">
                DACA — renovación y formularios USCIS
              </Link>
            </li>
          </ul>
        </section>
      </div>
    )
  }

  return null
}
