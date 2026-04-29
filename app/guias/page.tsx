import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { getAllGuidesForIndex } from '@/lib/guides-fs'

export default function GuiasIndexPage() {
  const guides = getAllGuidesForIndex()

  return (
    <div className="min-h-screen bg-cream">
      <Topbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-3">Guías</h1>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Artículos con fuentes oficiales y fechas de vigencia. Nada sustituye la normativa vigente el día que
          aplicas.
        </p>
        <ul className="space-y-4">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guias/${g.slug}/`}
                className="block rounded-2xl border border-navy/10 bg-white p-5 shadow-sm hover:border-green/40 hover:shadow-md transition"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-green">{g.category}</span>
                <h2 className="font-serif text-xl text-navy mt-1">{g.title}</h2>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
