import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-center px-4">
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="font-serif text-4xl mb-3" style={{ color: 'var(--navy)' }}>
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Esta página no existe. Regresa al inicio para encontrar el trámite que necesitas.
        </p>
        <Link href="/" className="btn-primary px-8 py-3.5">
          Ir al inicio →
        </Link>
      </div>
    </div>
  )
}
