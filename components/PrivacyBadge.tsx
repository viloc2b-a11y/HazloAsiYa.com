/**
 * PrivacyBadge — visible en trámites sensibles (DACA, ITIN, Matrícula)
 * Confronta directamente el miedo a compartir información personal
 */
export default function PrivacyBadge() {
  return (
    <div className="rounded-xl border border-green/25 bg-emerald-50/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="text-2xl shrink-0">🔒</div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-navy">Tu información está protegida</p>
        <ul className="text-xs text-gray-600 space-y-0.5">
          <li>✓ No compartimos tu información con agencias de inmigración</li>
          <li>✓ Solo usamos tus datos para preparar tu formulario</li>
          <li>✓ Nunca vendemos tu información</li>
        </ul>
      </div>
    </div>
  )
}
