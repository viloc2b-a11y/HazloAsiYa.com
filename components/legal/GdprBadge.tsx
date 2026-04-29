import Link from 'next/link'
import { AVISO_GDPR } from '@/lib/legal-texts'

type Props = {
  show: boolean
  className?: string
}

export default function GdprBadge({ show, className = '' }: Props) {
  if (!show) return null
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm text-navy ${className}`}
      role="status"
    >
      <span className="text-lg leading-none" aria-hidden>
        🇪🇺
      </span>
      <div>
        <p className="font-semibold">Tus datos están protegidos bajo GDPR</p>
        <p className="text-gray-600 text-xs mt-1 leading-relaxed">{AVISO_GDPR}</p>
        <Link href="/privacy/" className="text-green text-xs font-semibold underline mt-2 inline-block">
          Política de privacidad →
        </Link>
      </div>
    </div>
  )
}
