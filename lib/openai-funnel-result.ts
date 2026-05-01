/**
 * Resultado del cuestionario vía OpenAI (ChatGPT).
 * `functions/api/generate-result.ts` usa la misma lógica para Pages.
 */
import type { FunnelId } from '@/data/funnels'
import type { GeneratedResult } from '@/types/ai'
import { generateFunnelResultFromAi } from '@/lib/ai-client'

export type { GeneratedResult }

export async function generateFunnelResult(
  funnelId: FunnelId,
  formData: Record<string, string>,
): Promise<GeneratedResult> {
  return generateFunnelResultFromAi(funnelId, formData)
}
