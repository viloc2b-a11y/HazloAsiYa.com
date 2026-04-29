import type { Metadata } from 'next'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import MisDatosForm from './MisDatosForm'
import { absoluteUrl } from '@/lib/site'
import { alternatesForPath } from '@/lib/alternates'

export const metadata: Metadata = {
  title: 'Mis datos | HazloAsíYa',
  description:
    'Ejerce tus derechos de acceso, corrección, eliminación y portabilidad bajo TDPSA y GDPR. Solicitud a privacidad@hazloasiya.com.',
  alternates: alternatesForPath('/mis-datos/'),
  openGraph: {
    url: absoluteUrl('/mis-datos/'),
    locale: 'es_US',
    images: [{ url: '/images/og/default-og.jpg', width: 1200, height: 630, alt: 'Mis datos' }],
  },
}

export default function MisDatosPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="text-green hover:underline">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Mis datos</span>
        </nav>
        <h1 className="font-serif text-3xl text-navy mb-3">Ejercer mis derechos de datos</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Usa este formulario para enviar tu solicitud. Ley aplicable principal para residentes en Texas:{' '}
          <strong>TDPSA</strong>. Si accedes desde la UE, también aplican derechos del <strong>GDPR</strong>. No
          sustituye asesoría legal; revisaremos identidad cuando sea necesario.
        </p>
        <MisDatosForm />
        <p className="text-xs text-gray-500 mt-8">
          Alternativa: envía un correo directo a{' '}
          <a href="mailto:privacidad@hazloasiya.com" className="text-green underline">
            privacidad@hazloasiya.com
          </a>
          .
        </p>
      </main>
    </div>
  )
}
