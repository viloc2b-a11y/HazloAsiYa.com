import { FUNNELS, type FunnelId } from '@/data/funnels'

export type EligibilityRequestBody = Record<string, unknown>

/**
 * Acepta:
 * - `{ funnelId, formData: Record<string, string> }` (igual que generate-result)
 * - `{ funnelId, ...campos }` (un solo objeto; útil con `JSON.stringify(formData)` si formData incluye funnelId)
 */
export function parseEligibilityBody(
  raw: EligibilityRequestBody | null | undefined,
): { funnelId: FunnelId; formData: Record<string, string> } | null {
  if (!raw || typeof raw !== 'object') return null

  if (typeof raw.funnelId === 'string' && raw.formData && typeof raw.formData === 'object' && !Array.isArray(raw.formData)) {
    const formData: Record<string, string> = {}
    for (const [k, v] of Object.entries(raw.formData as Record<string, unknown>)) {
      if (v !== undefined && v !== null) formData[k] = String(v)
    }
    const funnelId = raw.funnelId as FunnelId
    if (!FUNNELS[funnelId]) return null
    return { funnelId, formData }
  }

  if (typeof raw.funnelId === 'string') {
    const funnelId = raw.funnelId as FunnelId
    if (!FUNNELS[funnelId]) return null
    const formData: Record<string, string> = {}
    for (const [k, v] of Object.entries(raw)) {
      if (k === 'funnelId' || k === 'formData') continue
      if (v !== undefined && v !== null) formData[k] = String(v)
    }
    return { funnelId, formData }
  }

  return null
}
