/** UUID v4 (Supabase `users.id`). */
export function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
}

export function pdfUnlockStorageKey(slug: string): string {
  return `haya_pdf_unlock_${slug}`
}

export async function checkPdfPurchase(email: string, funnel: string): Promise<boolean> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  const path = `/api/check-purchase?email=${encodeURIComponent(email)}&funnel=${encodeURIComponent(funnel)}`
  const url = base ? `${base}${path}` : path
  try {
    const r = await fetch(url)
    if (!r.ok) return false
    const j = (await r.json()) as { paid?: boolean }
    return !!j.paid
  } catch {
    return false
  }
}

export function isPdfPaywallDisabled(): boolean {
  return process.env.NEXT_PUBLIC_PDF_SKIP_PAYWALL === 'true' || process.env.NEXT_PUBLIC_PDF_SKIP_PAYWALL === '1'
}
