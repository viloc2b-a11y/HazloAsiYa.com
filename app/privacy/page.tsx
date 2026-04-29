import Link from 'next/link'
import { Metadata } from 'next'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'Política de Privacidad | HazloAsíYa',
  description:
    'Cómo recopilamos y usamos tu información en HazloAsíYa, pagos con Square y tus derechos. Sin vender datos a terceros.',
  alternates: alternatesForPath('/privacy/'),
  openGraph: {
    images: [{ url: '/images/og/privacy-og.jpg', width: 1200, height: 630, alt: 'Privacidad' }],
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy px-4 h-14 flex items-center">
        <Link href="/" className="font-serif text-white">HazloAsí<span className="text-green">Ya</span></Link>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-navy mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: enero 2026</p>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Información que recopilamos</h2>
            <p className="leading-relaxed">Recopilamos información que usted nos proporciona directamente: nombre, correo electrónico, respuestas a cuestionarios. No recopilamos información sin su consentimiento explícito.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Cómo usamos su información</h2>
            <ul className="list-disc list-inside space-y-1 leading-relaxed">
              <li>Para personalizar los resultados y guías de cada trámite</li>
              <li>Para procesar pagos de forma segura a través de Square</li>
              <li>Para enviar confirmaciones de compra y actualizaciones del servicio</li>
              <li>Para conectarle con recursos locales en su área</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">No vendemos su información</h2>
            <p className="leading-relaxed">HazloAsíYa nunca vende, renta ni comparte su información personal con terceros con fines comerciales o publicitarios.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Seguridad</h2>
            <p className="leading-relaxed">Utilizamos encriptación SSL para todas las comunicaciones. Los pagos se procesan por Square — nunca almacenamos información de tarjetas de crédito. Los datos se almacenan en Supabase con encriptación en reposo.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Sus derechos (CCPA)</h2>
            <p className="leading-relaxed">Como residente de California o Texas, tiene derecho a solicitar copia de sus datos, corregirlos o eliminarlos. Envíe su solicitud a: <a href="mailto:privacidad@hazloasiya.com" className="text-green">privacidad@hazloasiya.com</a></p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">Contacto</h2>
            <p className="leading-relaxed">Preguntas sobre privacidad: <a href="mailto:privacidad@hazloasiya.com" className="text-green">privacidad@hazloasiya.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
