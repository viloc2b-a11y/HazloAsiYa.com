'use client'
/**
 * PartnerTracker.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Invisible client component mounted in the root layout.
 * On every page load it:
 *   1. Reads ?ref= / ?org= / ?utm_source= / ?city= / ?state= from the URL
 *   2. Persists attribution in localStorage + cookie (30-day window)
 *   3. If a new ?ref= is detected, fires a "visit" event to /api/track-partner-event
 *
 * This component renders nothing — it only runs side effects.
 */

import { useEffect } from 'react'
import { capturePartnerAttribution } from '@/lib/partner-tracking'

async function fireVisitEvent(slug: string, meta: Record<string, string | null>) {
  try {
    await fetch('/api/track-partner-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        partner_slug: slug,
        event_type: 'visit',
        funnel_id: null,
        state_slug: meta.referral_state,
        organization_type: meta.organization_type,
        referral_source: meta.referral_source,
        referral_city: meta.referral_city,
        referral_state: meta.referral_state,
      }),
    })
  } catch {
    // Fire-and-forget — never block the user
  }
}

export default function PartnerTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasNewRef = Boolean(params.get('ref') || params.get('partner'))

    const attr = capturePartnerAttribution()
    const slug = attr?.partner_slug
    if (!hasNewRef || !slug) return

    const payload = {
      organization_type: attr.organization_type,
      referral_source: attr.referral_source,
      referral_city: attr.referral_city,
      referral_state: attr.referral_state,
    }

    const run = () => {
      fireVisitEvent(slug, payload)
    }

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(() => run(), { timeout: 4000 })
    } else {
      timeoutId = setTimeout(run, 0)
    }

    return () => {
      if (idleId !== undefined && typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  return null
}
