import Link from 'next/link'
import { absoluteUrl } from '@/lib/site'

const faqItems = [
  {
    q: '¿Necesito ITIN o SSN para declarar impuestos?',
    a: 'Si no tienes SSN elegible pero debes declarar, el IRS usa el ITIN. El formulario W-7 solicita el ITIN; muchas personas declaran con ITIN y reciben créditos si califican según las reglas del año fiscal.',
  },
  {
    q: '¿Dónde preparo la declaración gratis?',
    a: 'El programa VITA del IRS ofrece preparación gratuita para quienes califican por ingresos. Busca sitios en irs.gov/vita. HazloAsíYa no sustituye a un preparador certificado.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Orientación declaración de impuestos',
  serviceType: 'Información fiscal educativa',
  description: 'Contenido educativo en español sobre declaración federal, ITIN y VITA.',
  provider: { '@type': 'Organization', name: 'HazloAsíYa', url: absoluteUrl('/') },
  url: absoluteUrl('/taxes/'),
  areaServed: { '@type': 'Country', name: 'United States' },
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
    { '@type': 'ListItem', position: 2, name: 'Impuestos', item: absoluteUrl('/taxes/') },
  ],
}

export default function TaxesEditorialSection() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="card p-6 border border-cream space-y-8 text-navy" aria-labelledby="taxes-edu">
        <p className="text-sm text-gray-700 leading-relaxed rounded-xl border border-green/20 bg-white px-4 py-3">
          <Link href="/itin/" className="text-green font-semibold hover:underline">
            ITIN / W-7
          </Link>
          {' · '}
          <Link href="/bank/" className="text-green font-semibold hover:underline">
            Cuenta bancaria
          </Link>
          {' · '}
          <Link href="/guias/" className="text-green font-semibold hover:underline">
            Guías
          </Link>
          {' · '}
          <a href="https://www.irs.gov/vita" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
            VITA (IRS)
          </a>
        </p>

        {/* §3b */}
        <div>
          <h2 id="taxes-edu" className="font-serif text-2xl text-navy mb-3">
            Declaración federal en español (orientación)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            La temporada fiscal suele concentrarse entre enero y abril. Reúne comprobantes de ingresos (W-2, 1099-NEC,
            1099-INT), gastos deducibles si aplica, y datos de dependientes (SSN o ITIN según reglas del año).
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            HazloAsíYa no prepara la declaración ni representa ante el IRS; usa{' '}
            <a href="https://www.irs.gov" className="text-green font-semibold underline" target="_blank" rel="noopener noreferrer">
              irs.gov
            </a>{' '}
            y, si calificas, VITA o preparador certificado.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Con SSN:</strong> empleo por cuenta ajena (W-2) y otros ingresos reportados en 1099.
            </li>
            <li>
              <strong>Con ITIN:</strong> declaras según obligación; algunos créditos tienen reglas adicionales — ver
              publicación federal del año.
            </li>
            <li>
              <strong>Dependientes:</strong> custodia y prueba de residencia del niño cuando el crédito lo exige.
            </li>
            <li>
              <strong>Plazos:</strong> 15 de abril o extensión válida; multas por no declarar cuando hay obligación.
            </li>
          </ul>
        </div>

        {/* §3c — ejemplos, plan B, problemas típicos */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-3">Documentos que conviene reunir (con ejemplos)</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Lleva <strong>originales o PDF oficiales</strong> a VITA o al preparador; si declaras tú sola en casa, una
            carpeta con todo nombrado por tipo (W-2, 1099, recibos) te ahorra volver a buscar en abril.
          </p>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-navy mb-2">Ingresos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> W-2 de cada patrón (caja con “Copy B”); 1099-NEC si te pagaron como
                  contratista; 1099-INT/1099-DIV de bancos; 1099-G si hubo desempleo.
                </li>
                <li>
                  <strong>Si tu patrón no te dio W-2 a tiempo:</strong> reclama copia, usa último talón para estimar y
                  enmienda si llega tarde; no inventes cajas.
                </li>
                <li>
                  <strong>Suele fallar:</strong> declarar un solo trabajo cuando hubo dos; olvidar el 1099 de app de
                  delivery; cifras del W-2 mal tecleadas.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Identificación fiscal</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> tarjeta del Seguro Social; carta CP565 o ITIN vigente; número correcto
                  para cónyuge y dependientes que vayan en la declaración.
                </li>
                <li>
                  <strong>Si el ITIN está por vencer y declaras cada año:</strong> renueva a tiempo; sin número válido se
                  congela el crédito y el reembolso.
                </li>
                <li>
                  <strong>Suele fallar:</strong> un dígito mal en el SSN del hijo; dos padres reclamando al mismo dependiente.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Gastos deducibles o créditos</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> recibo de guardería con nombre del centro y EIN; 1098-T de universidad;
                  facturas médicas que sumen por encima del piso; registro de millas solo si aplica y con respaldo.
                </li>
                <li>
                  <strong>Si pagas cuidado en efectivo:</strong> recibo firmado, contrato simple o captura de Zelle con
                  nota “childcare”; mejor poco papel que nada.
                </li>
                <li>
                  <strong>Suele fallar:</strong> EIN incorrecto del proveedor de cuidado; gastos del año equivocado;
                  mezclar gastos del negocio personal con el empleo W-2 sin Schedule C real.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Cuenta bancaria para reembolso</h3>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  <strong>Ejemplos reales:</strong> número de ruta (9 dígitos) y cuenta del mismo titular que declara;
                  captura del cheque en blanco si tu banco la usa para verificar.
                </li>
                <li>
                  <strong>Si no tienes cuenta:</strong> abre una cuenta básica antes de declarar o pide cheque por correo
                  (tarda más); evita cuenta cerrada.
                </li>
                <li>
                  <strong>Suele fallar:</strong> invertir ruta y cuenta; usar cuenta del primo “para recibir más rápido” —
                  el IRS rechaza y retrasa meses.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* §3d — pasos con tiempo y “qué sigue” */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Pasos típicos antes de declarar</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Junta papeles primero: suele ser <strong>30–60 min</strong> en una mesa. La cita VITA o con preparador suele
            ser <strong>1–2 h</strong>; si declaras sola con software, cuenta <strong>1–3 h</strong> según complejidad.
            Reembolso por depósito directo: a menudo <strong>2–3 semanas</strong> después de aceptada la declaración (puede
            variar).
          </p>
          <ol className="list-decimal list-outside space-y-4 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <span className="font-medium text-navy">Reúne todos los W-2 y 1099</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20–40 min</span>
              <span className="block mt-1 text-gray-600">
                Después: si falta uno, pides duplicado al patrón; no empiezas números “aproximados”.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Elige: software en casa, VITA gratis o preparador</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~10 min decidir</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes si necesitas cita, qué llevar y si alguien más firma contigo.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">¿Declaración conjunta o separada? Una decisión por año</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15 min</span>
              <span className="block mt-1 text-gray-600">
                Después: evitas enmendar solo por haber marcado el casillero equivocado de estado civil.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Créditos y deducciones: revisa tablas del año fiscal</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~20 min</span>
              <span className="block mt-1 text-gray-600">
                Después: sabes si reclamas hijo, cuidado, educación, etc., con respaldo en recibos.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Presenta e-file o correo; guarda acuse o certificado</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~15–30 min</span>
              <span className="block mt-1 text-gray-600">
                Después: recibes confirmación de recibido; el reloj del reembolso o del saldo adeudado empieza oficialmente.
              </span>
            </li>
            <li>
              <span className="font-medium text-navy">Si encuentras un error después: enmienda</span>{' '}
              <span className="text-gray-500 text-xs whitespace-nowrap">~30 min otro día</span>
              <span className="block mt-1 text-gray-600">
                Después: el IRS corrige el registro; mejor enmendar que ignorar un 1099 que olvidaste.
              </span>
            </li>
          </ol>
        </div>

        {/* §3e — 5 errores con consecuencia clara */}
        <div>
          <h2 className="font-serif text-2xl text-navy mb-2">Errores que cuestan dinero, tiempo o una carta del IRS</h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            No es teoría: el IRS cobra <strong>intereses y multas</strong> retroactivas, congela <strong>reembolsos
            meses</strong> o abre <strong>correspondencia de examen</strong>. Mejor corregir antes de firmar.
          </p>
          <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong className="text-navy">Poner ingresos en cero con 1099 o depósitos visibles.</strong> El IRS cruza
              sistemas: puedes recibir <strong>aviso de ajuste con multa</strong> y debes pagar impuesto más intereses
              desde la fecha original.
            </li>
            <li>
              <strong className="text-navy">Dos padres reclamando al mismo hijo.</strong> El segundo en procesarse pierde el
              crédito; ambos pueden recibir <strong>cartas de verificación</strong> y retraso del reembolso de quien
              declaró mal.
            </li>
            <li>
              <strong className="text-navy">ITIN vencido o SSN mal tecleado.</strong> Créditos como CTC/ACTC pueden{' '}
              <strong>quedar en hold</strong> meses; sin número válido no hay depósito directo del reembolso.
            </li>
            <li>
              <strong className="text-navy">Usar tablas o formularios del año equivocado.</strong> Declaración procesada con
              error puede generar <strong>enmienda obligatoria</strong> y saldo debido que no esperabas.
            </li>
            <li>
              <strong className="text-navy">Ignorar pagos estimados como contratista.</strong> Al final del año debes
              impuesto más <strong>interés diario</strong> desde los trimestres que faltaron; el fisco no “olvida”, suma.
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
        <p className="text-xs text-gray-500">HazloAsíYa no es el IRS ni preparador certificado.</p>
      </section>
    </>
  )
}
