import Link from 'next/link'
import { funnelLandingPath, isValidFunnelId, type FunnelId } from '@/data/funnels'

interface FunnelCardProps {
  id: string
  name: string
  /** Título visible (p. ej. long-tail SEO en home). Si no se pasa, se usa `name`. */
  cardHeading?: string
  icon: string
  action: string
  color: string
  bg: string
}

export default function FunnelCard({ id, name, cardHeading, icon, action, color, bg }: FunnelCardProps) {
  const href = isValidFunnelId(id) ? funnelLandingPath(id as FunnelId) : `/${id}/`
  const title = cardHeading ?? name
  return (
    <Link
      href={href}
      className="group card p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: bg }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-navy text-[15px] leading-tight">{title}</h3>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{action}</div>
        </div>
      </div>
      <div
        className="text-sm font-bold flex items-center gap-1 mt-auto transition-all group-hover:gap-2"
        style={{ color }}
      >
        Hazlo así <span>→</span>
      </div>
    </Link>
  )
}
