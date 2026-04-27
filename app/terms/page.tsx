import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Términos de Uso | HazloAsíYa' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy px-4 h-14 flex items-center">
        <Link href="/" className="font-serif text-white">HazloAsí<span className="text-green">Ya</span></Link>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-navy mb-2">Términos de Uso</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: enero 2026</p>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">1. Descripción del Servicio</h2>
            <p className="leading-relaxed">HazloAsíYa.com es una plataforma de información y guía que ayuda a familias hispanas en los Estados Unidos a completar trámites de gobierno. El contenido se proporciona únicamente con fines informativos y educativos.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">2. No es Asesoría Legal</h2>
            <p className="leading-relaxed">HazloAsíYa no es un bufete de abogados y no proporciona asesoría legal. La información disponible en esta plataforma no constituye ni debe interpretarse como consejo legal, migratorio o fiscal. Para situaciones específicas, consulte con un profesional licenciado.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">3. Pagos y Reembolsos</h2>
            <p className="leading-relaxed">Los pagos se procesan de forma segura a través de Stripe. Ofrecemos una garantía de satisfacción de 30 días. Si no está satisfecho con el servicio, contáctenos en hola@hazloasiya.com para un reembolso completo.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">4. Exactitud de la Información</h2>
            <p className="leading-relaxed">Hacemos nuestro mejor esfuerzo para mantener la información actualizada. Sin embargo, los requisitos gubernamentales cambian frecuentemente. Siempre verifique los requisitos actuales en los sitios oficiales de las agencias correspondientes.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">5. Uso Aceptable</h2>
            <p className="leading-relaxed">Usted acepta usar este servicio únicamente para propósitos legales y personales. Queda prohibido el uso comercial del contenido sin autorización expresa por escrito.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">6. Contacto</h2>
            <p className="leading-relaxed">Para preguntas sobre estos términos: <a href="mailto:hola@hazloasiya.com" className="text-green">hola@hazloasiya.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
