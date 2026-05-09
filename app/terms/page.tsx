import Link from 'next/link'
import type { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'
import { absoluteUrl } from '@/lib/site'
import { UPL_LIMITATION_BLOCK } from '@/lib/legal-texts'
import Topbar from '@/components/Topbar'

export const metadata: Metadata = {
  title: 'Términos de uso | HazloAsíYa',
  description:
    'Condiciones del servicio: alcance educativo, UPL Texas, pagos y reembolsos, ley de Texas y resolución de disputas para usuarios en la UE.',
  alternates: alternatesForPath('/terms/'),
  openGraph: {
    url: absoluteUrl('/terms/'),
    locale: 'es_US',
    images: [{ url: '/images/og/terms-og.jpg', width: 1200, height: 630, alt: 'Términos de uso' }],
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <section className="bg-navy px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-white/40 mb-1.5">
            <Link href="/" className="text-green hover:underline">Inicio</Link> / Legal
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white">Términos de uso</h1>
          <p className="text-white/40 text-sm mt-1">Última actualización: abril 2026 · Houston, Texas</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">1. Quiénes somos y qué ofrecemos</h2>
            <p className="leading-relaxed">
              HazloAsíYa (hazloasiya.com) es una plataforma <strong>educativa</strong> en español que orienta a familias
              sobre trámites, beneficios e impuestos en EE. UU., con foco en Texas. Ofrecemos guías, cuestionarios
              orientativos y, cuando corresponde, revisión de <strong>completitud documental</strong> según requisitos
              publicados por las agencias.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">2. Limitación de alcance — práctica de ley y fiscal (UPL)</h2>
            <aside
              className="rounded-xl border-l-4 border-amber-600 bg-amber-50/90 px-4 py-3 text-sm text-navy leading-relaxed"
              role="note"
            >
              <p className="font-semibold text-amber-900 mb-2">Texto de limitación</p>
              <p>{UPL_LIMITATION_BLOCK}</p>
            </aside>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">3. Descripción del servicio</h2>
            <p className="leading-relaxed">
              El servicio incluye contenido gratuito (p. ej. cuestionarios de orientación) y opciones de pago (p. ej.
              guías ampliadas, membresía o cursos estacionales) descritas en{' '}
              <Link href="/precios/" className="text-green font-medium underline">
                /precios/
              </Link>
              . Nada de lo anterior constituye representación ante una agencia ni asesoría legal o fiscal personalizada.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">4. Precios, pagos y reembolsos</h2>
            <p className="leading-relaxed">
              Los precios se muestran en <strong>USD</strong> antes de impuestos aplicables. Los pagos se procesan de
              forma segura mediante el <strong>checkout alojado de Square</strong> (Square, Inc.). Al pagar, aplican los
              términos y la política de privacidad de Square en lo relativo al tratamiento de datos de pago.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Garantía de reembolso 30 días</strong> (sin preguntas) para productos elegibles según se anuncie
                en la página del producto.
              </li>
              <li>
                <strong>Membresía:</strong> cancelación sencilla (orientación: en un clic desde la cuenta cuando esté
                disponible; si no, por correo a hola@hazloasiya.com).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">5. Lo que puedes y no puedes hacer</h2>
            <p className="leading-relaxed">
              Debes usar el sitio de forma lícita. No está permitido el scraping agresivo, intentos de vulnerar la
              seguridad, uso que viole derechos de terceros ni presentarse como funcionario gubernamental. No puedes
              confiar en el sitio como sustituto de un profesional licenciado cuando tu situación lo requiera.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">6. Limitación de responsabilidad</h2>
            <p className="leading-relaxed">
              En la medida máxima permitida por la ley aplicable, HazloAsíYa no será responsable por daños indirectos,
              incidentales o consecuentes. El sitio y el contenido se ofrecen «tal cual»; las agencias pueden cambiar
              requisitos sin previo aviso — verifica siempre en la fuente oficial.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">7. Ley aplicable</h2>
            <p className="leading-relaxed">
              Salvo lo que disponga la ley imperativa de tu lugar de residencia, estos términos se rigen por las leyes del{' '}
              <strong>Estado de Texas, EE. UU.</strong>, sin tener en cuenta conflictos de principios legales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">8. Usuarios de la UE — resolución de disputas</h2>
            <p className="leading-relaxed">
              Si resides en el Espacio Económico Europeo o en el Reino Unido y el GDPR u otras normas de consumo te
              otorgan derechos imperativos, esos derechos prevalecen en lo que corresponda. Puedes presentar una reclamación
              ante la autoridad de protección de datos de tu país o, cuando proceda, acudir a los tribunales de tu lugar
              de residencia. Para ejercer derechos de datos:{' '}
              <Link href="/mis-datos/" className="text-green underline">
                /mis-datos/
              </Link>{' '}
              y{' '}
              <Link href="/privacy/" className="text-green underline">
                política de privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">9. Contacto</h2>
            <p className="leading-relaxed">
              Preguntas generales:{' '}
              <a href="mailto:hola@hazloasiya.com" className="text-green">
                hola@hazloasiya.com
              </a>
              <br />
              Privacidad y datos:{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green">
                privacidad@hazloasiya.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
