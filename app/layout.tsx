import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HazloAsíYa — Haz tus trámites en Estados Unidos sin errores',
  description: 'Te decimos exactamente qué hacer, qué documentos necesitas y cómo completar tus trámites en EE.UU. desde la primera vez. En español.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hazloasiya.com'),
  openGraph: {
    title: 'HazloAsíYa — Haz tus trámites en EE.UU. sin errores',
    description: 'Guías paso a paso en español para SNAP, Medicaid, DACA, taxes, escuela y más.',
    type: 'website',
    locale: 'es_US',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-cream text-gray-800 antialiased">
        {children}
      </body>
    </html>
  )
}
