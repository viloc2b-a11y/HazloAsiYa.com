import Link from 'next/link'
import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'
import { GDPR_LEGAL_BASIS } from '@/lib/gdpr-legal-basis'
import { AVISO_GDPR } from '@/lib/legal-texts'
import Topbar from '@/components/Topbar'

export const metadata: Metadata = {
  title: 'Política de privacidad | HazloAsíYa',
  description:
    'Cómo recopilamos y usamos tus datos (TDPSA Texas), derechos, proveedores, cookies y sección GDPR para usuarios en la UE.',
  alternates: alternatesForPath('/privacy/'),
  robots: { index: true, follow: true },
  openGraph: {
    url: absoluteUrl('/privacy/'),
    locale: 'es_US',
    images: [{ url: '/images/og/privacy-og.jpg', width: 1200, height: 630, alt: 'Privacidad' }],
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <section className="bg-navy px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-white/40 mb-1.5">
            <Link href="/" className="text-green hover:underline">Inicio</Link> / Legal
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white">Política de privacidad</h1>
          <p className="text-white/40 text-sm mt-1">Última actualización: abril 2026 · Houston, Texas</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">1. Quiénes somos y cómo contactarnos</h2>
            <p>
              <strong>HazloAsíYa</strong> (hazloasiya.com) es una plataforma educativa con base en{' '}
              <strong>Houston, Texas, EE. UU.</strong> Para preguntas de privacidad y derechos de datos:{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green font-medium underline">
                privacidad@hazloasiya.com
              </a>
              . Para ejercer derechos puedes usar el formulario en{' '}
              <Link href="/mis-datos/" className="text-green font-medium underline">
                /mis-datos/
              </Link>
              .
            </p>
            <p className="mt-2 text-xs text-gray-500 border-l-4 border-green/50 pl-3">{AVISO_GDPR}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">2. Qué datos recopilamos y por qué (minimización)</h2>
            <p>Recopilamos solo lo necesario para el servicio que solicitas:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Correo electrónico y nombre</strong> — cuenta, comunicaciones transaccionales y respuesta a
                solicitudes.
              </li>
              <li>
                <strong>Código postal u otra ubicación aproximada</strong> — orientar recursos locales cuando aplica.
              </li>
              <li>
                <strong>Respuestas al cuestionario</strong> — generar orientación educativa y listas de documentos; no
                constituyen determinación oficial de elegibilidad.
              </li>
              <li>
                <strong>Dirección IP y registros de acceso</strong> — seguridad, diagnóstico y prevención de abuso
                (p. ej. a través de Cloudflare y registros del alojamiento).
              </li>
              <li>
                <strong>Documentos que subas</strong> — solo si ofrecemos una función de revisión de completitud que lo
                requiera; ver sección 8.
              </li>
              <li>
                <strong>Cookies y tecnologías similares</strong> — según tu consentimiento y jurisdicción; ver sección 9.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">3. Cómo usamos tus datos</h2>
            <p>
              Usamos los datos para operar el sitio, personalizar guías educativas, procesar pagos cuando corresponda,
              enviar confirmaciones del servicio, mejorar la seguridad y cumplir obligaciones legales. No vendemos tus
              datos personales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">4. Con quién los compartimos</h2>
            <p>Podemos compartir datos con proveedores que procesan información en nuestro nombre, por ejemplo:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Cloudflare</strong> — CDN, seguridad, DNS y alojamiento estático (Pages); puede procesar IPs y
                tráfico.
              </li>
              <li>
                <strong>Google Analytics (si lo activas con consentimiento)</strong> — estadísticas de uso; no
                inicializamos analytics hasta obtener el consentimiento aplicable.
              </li>
              <li>
                <strong>Meta Pixel u otros píxeles (si los activas con consentimiento)</strong> — solo tras consentimiento
                de marketing donde corresponda.
              </li>
              <li>
                <strong>Procesador de pagos</strong> — <strong>Square, Inc.</strong> (checkout alojado). Square
                procesa datos de pago según sus políticas y el estándar PCI; nosotros no almacenamos el número completo
                de tu tarjeta.
              </li>
              <li>
                <strong>Supabase u otro backend</strong> — si almacenamos cuentas o respuestas en base de datos
                gestionada.
              </li>
              <li>
                <strong>Proveedor de correo (alertas)</strong> — si solicitas alertas por email, usamos un servicio
                como ConvertKit o Brevo para gestionar la lista, siempre con tu consentimiento y bajo sus políticas.
              </li>
            </ul>
            <p className="mt-2">
              Actualizaremos esta lista si incorporamos nuevos subencargados relevantes. Puedes solicitar más detalle en{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green underline">
                privacidad@hazloasiya.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">5. Tus derechos bajo la ley de Texas (TDPSA)</h2>
            <p>
              Para consumidores sujetos al <strong>Texas Data Privacy and Security Act (TDPSA)</strong>, puedes solicitar
              acceso, corrección, eliminación, portabilidad y, cuando corresponda, optar por no participar en ciertas
              ventas o cierto intercambio de datos personales. Responderemos según los plazos aplicables (orientación:
              hasta <strong>45 días</strong> salvo extensión permitida por ley).
            </p>
            <p className="mt-2">
              <Link href="/mis-datos/" className="text-green font-medium underline">
                Formulario de derechos
              </Link>
              {' · '}
              <Link href="/no-vender-mis-datos/" className="text-green font-medium underline">
                No vender ni compartir mis datos
              </Link>{' '}
              (transparencia adicional, incl. California).
            </p>
            <p className="mt-2 text-xs text-gray-600">
              <strong>Nota:</strong> La ley aplicable principal para residentes de Texas es la TDPSA. El CCPA/CPRA de
              California puede aplicar a residentes de California según umbrales y definiciones legales; ofrecemos
              mecanismos de transparencia y opt-out sin perjuicio de tu lugar de residencia.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">6. Usuarios de la Unión Europea (GDPR)</h2>
            <p>
              Si accedes desde el Espacio Económico Europeo o Reino Unido (según el marco aplicable), el tratamiento puede
              estar sujeto al <strong>GDPR</strong> y normas locales. Tienes derechos de acceso, rectificación,
              supresión, portabilidad, <strong>limitación</strong> y <strong>objeción</strong> cuando proceda.
            </p>
            <p className="mt-3 font-semibold text-navy">Base legal por finalidad (resumen)</p>
            <div className="mt-2 overflow-x-auto rounded-xl border border-cream bg-white">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-cream bg-cream/50 text-left">
                    <th className="p-2 font-semibold">Dato</th>
                    <th className="p-2 font-semibold">Finalidad</th>
                    <th className="p-2 font-semibold">Base legal</th>
                    <th className="p-2 font-semibold">Retención</th>
                  </tr>
                </thead>
                <tbody>
                  {GDPR_LEGAL_BASIS.map((row) => (
                    <tr key={row.dato} className="border-b border-cream/80">
                      <td className="p-2 align-top">{row.dato}</td>
                      <td className="p-2 align-top">{row.finalidad}</td>
                      <td className="p-2 align-top">{row.baseLegal}</td>
                      <td className="p-2 align-top">{row.retencion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-semibold text-navy">Transferencias internacionales</p>
            <p className="mt-1">
              Algunos proveedores están en <strong>EE. UU.</strong> u otros países fuera del EEE. Cuando transferimos
              datos personales desde el EEE, nos apoyamos en mecanismos reconocidos, como las{' '}
              <strong>cláusulas contractuales tipo (SCC)</strong> del apropiado regulador europeo, y los acuerdos de
              tratamiento de datos (DPA) de los proveedores. Por ejemplo: <strong>Google</strong> publica DPA y medidas
              complementarias; <strong>Cloudflare</strong> ofrece DPA y SCCs. Puedes solicitar copia de las garantías
              relevantes en{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green underline">
                privacidad@hazloasiya.com
              </a>
              .
            </p>
            <p className="mt-2">
              Plazo orientativo de respuesta para solicitudes GDPR: <strong>hasta 30 días</strong> salvo lo que permita la
              ley.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">7. Datos de menores (COPPA + TDPSA)</h2>
            <p>
              Nuestros formularios sensibles están pensados para que los complete un <strong>padre, madre o tutor</strong>.
              No recopilamos a sabiendas datos de menores de 13 años sin el consentimiento verificable de los padres cuando
              la ley lo exija. Si crees que un menor nos envió datos sin autorización, escribe a{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green underline">
                privacidad@hazloasiya.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">8. Documentos subidos</h2>
            <p>
              Los documentos que compartas para una revisión solicitada se usan solo para ese fin. Se eliminan de forma
              automática a más tardar a los <strong>90 días</strong>, salvo que una obligación legal exija conservación
              por más tiempo (caso excepcional).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">9. Cookies y tecnologías de rastreo</h2>
            <p>
              Usamos cookies necesarias para el funcionamiento del sitio. Las cookies de <strong>analítica</strong> y{' '}
              <strong>marketing</strong> solo se activan con el consentimiento que corresponda según tu región (banner en
              el sitio). Puedes revocar o ajustar preferencias en cualquier momento desde el mismo banner o borrando las
              claves locales indicadas en la configuración del navegador.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">10. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política. Para cambios materiales, procuraremos notificarte con antelación razonable,
              por ejemplo por correo electrónico con al menos <strong>30 días</strong> de aviso cuando tengamos tu email y
              la ley lo permita o exija.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">11. Cómo ejercer tus derechos</h2>
            <p>
              Usa{' '}
              <Link href="/mis-datos/" className="text-green font-semibold underline">
                /mis-datos/
              </Link>{' '}
              o escribe a{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green font-semibold underline">
                privacidad@hazloasiya.com
              </a>
              . Este contenido es informativo y no sustituye asesoría legal.
            </p>
          </section>

          <section id="no-vender">
            <h2 className="font-serif text-2xl text-navy mb-3">12. No vender ni compartir mis datos personales</h2>
            <p>
              HazloAsíYa <strong>no vende</strong> datos personales. Esta sección documenta tu preferencia de
              no compartición futura con terceros (transparencia hacia residentes de California bajo{' '}
              <strong>CCPA/CPRA</strong> y buenas prácticas generales).
            </p>
            <p className="mt-2">
              Para registrar formalmente tu preferencia de opt-out, envía un correo a{' '}
              <a href="mailto:privacidad@hazloasiya.com?subject=%5BHazloAs%C3%ADYa%5D%20Opt-out%20compartici%C3%B3n%20de%20datos%20(CCPA%2FCPRA)" className="text-green font-semibold underline">
                privacidad@hazloasiya.com
              </a>{' '}
              indicando tu correo electrónico y la solicitud de no compartir tus datos. Responderemos en un plazo
              de <strong>15 días hábiles</strong>.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              También puedes usar el formulario en{' '}
              <Link href="/mis-datos/" className="text-green underline">/mis-datos/</Link>{' '}
              para ejercer cualquier otro derecho sobre tus datos.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
