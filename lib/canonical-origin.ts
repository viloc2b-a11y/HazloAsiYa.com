/** Origen único de producción para HazloAsíYa (apex `hazloasiya.com` + `https`; `www` redirige al apex). */
export const HAZLO_CANONICAL_ORIGIN = 'https://hazloasiya.com' as const

/**
 * Unifica `hazloasiya.com` y `www.hazloasiya.com` (y `http`) en `https://hazloasiya.com`.
 * No altera localhost, previews `*.pages.dev` ni otros hosts.
 */
export function normalizeHazloOrigin(raw: string): string {
  const t = raw.replace(/\/+$/, '')
  if (!t) return HAZLO_CANONICAL_ORIGIN
  try {
    const u = new URL(t)
    if (u.hostname === 'hazloasiya.com' || u.hostname === 'www.hazloasiya.com') {
      u.protocol = 'https:'
      u.hostname = 'hazloasiya.com'
      return u.origin
    }
    return t
  } catch {
    return HAZLO_CANONICAL_ORIGIN
  }
}
