/**
 * partner-tracking.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Captures partner referral attribution from URL params on first visit,
 * persists it in localStorage (30-day expiry) and a cookie (for SSR/CF),
 * and exposes helpers to read and clear the attribution.
 *
 * URL params captured:
 *   ?ref=iglesia-bethel-houston          → partner_slug
 *   ?org=iglesia                         → organization_type
 *   ?utm_source=whatsapp                 → referral_source
 *   ?city=houston                        → referral_city
 *   ?state=texas                         → referral_state
 *
 * Example partner link:
 *   hazloasiya.com/snap/texas/?ref=iglesia-bethel-houston&org=iglesia&utm_source=flyer
 *
 * Attribution window: 30 days (last-touch, can be overridden by new ?ref= visit)
 */

export interface PartnerAttribution {
  partner_slug: string | null
  organization_type: string | null
  referral_source: string | null
  referral_city: string | null
  referral_state: string | null
  captured_at: string // ISO timestamp
}

const STORAGE_KEY = 'haz_partner_attr'
const COOKIE_NAME = 'haz_ref'
const EXPIRY_DAYS = 30

// ── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(attr: PartnerAttribution): boolean {
  if (!attr.captured_at) return true
  const captured = new Date(attr.captured_at).getTime()
  const now = Date.now()
  return now - captured > EXPIRY_DAYS * 24 * 60 * 60 * 1000
}

function setCookie(slug: string) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(slug)}; expires=${expires}; path=/; SameSite=Lax`
}

function clearCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call once on page load (e.g. in _app.tsx or layout.tsx).
 * Reads URL params and, if a ?ref= is present, saves the attribution.
 * If no ?ref= is present, returns the previously stored attribution (if not expired).
 */
export function capturePartnerAttribution(): PartnerAttribution | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const slug = params.get('ref') || params.get('partner') || null

  if (slug) {
    // New visit with a partner link — save/overwrite attribution
    const attr: PartnerAttribution = {
      partner_slug: slug,
      organization_type: params.get('org') || params.get('organization_type') || null,
      referral_source: params.get('utm_source') || params.get('source') || null,
      referral_city: params.get('city') || null,
      referral_state: params.get('state') || null,
      captured_at: new Date().toISOString(),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attr))
    } catch { /* private browsing */ }
    setCookie(slug)
    return attr
  }

  // No ?ref= in URL — return stored attribution if still valid
  return getStoredAttribution()
}

/**
 * Returns the current stored attribution, or null if expired / not set.
 */
export function getStoredAttribution(): PartnerAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const attr = JSON.parse(raw) as PartnerAttribution
    if (isExpired(attr)) {
      localStorage.removeItem(STORAGE_KEY)
      clearCookie()
      return null
    }
    return attr
  } catch {
    return null
  }
}

/**
 * Clears the stored attribution (e.g. after a purchase is completed).
 */
export function clearPartnerAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
  clearCookie()
}

/**
 * Returns attribution as a flat object safe to pass to API calls.
 * All values are strings or null.
 */
export function getAttributionForApi(): Partial<PartnerAttribution> {
  const attr = getStoredAttribution()
  if (!attr) return {}
  return {
    partner_slug: attr.partner_slug,
    organization_type: attr.organization_type,
    referral_source: attr.referral_source,
    referral_city: attr.referral_city,
    referral_state: attr.referral_state,
  }
}
