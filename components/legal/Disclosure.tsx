import {
  DISCLAIMER_AFILIADO,
  DISCLAIMER_FORMULARIO_OFICIAL,
  DISCLAIMER_GENERAL,
  DISCLAIMER_MONETIZACION_CURSO,
} from '@/lib/legal-texts'

export type DisclosureVariant = 'affiliate' | 'sponsored' | 'paid-service' | 'educational' | 'form-official'

type Props = {
  variant: DisclosureVariant
  sponsorName?: string
  className?: string
}

/**
 * Divulgación visible (FTC § 5) — antes del contenido comercial o patrocinado.
 * Usar 'form-official' en todas las pantallas de descarga de formularios pre-llenados.
 */
export default function Disclosure({ variant, sponsorName, className = '' }: Props) {
  let body: string
  switch (variant) {
    case 'affiliate':
      body = DISCLAIMER_AFILIADO
      break
    case 'sponsored':
      body = `Contenido patrocinado: creado con ${sponsorName ?? 'un patrocinador'}. HazloAsíYa mantiene control editorial.`
      break
    case 'paid-service':
      body = DISCLAIMER_MONETIZACION_CURSO
      break
    case 'form-official':
      body = DISCLAIMER_FORMULARIO_OFICIAL
      break
    default:
      body = DISCLAIMER_GENERAL
  }

  return (
    <aside
      className={`rounded-xl border-l-4 border-green bg-emerald-50/90 px-4 py-3 text-sm text-navy leading-relaxed ${className}`}
      role="note"
    >
      <span className="font-bold text-green">Aviso importante</span>
      <p className="mt-1.5">{body}</p>
    </aside>
  )
}
