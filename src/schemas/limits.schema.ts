import { z } from 'zod'

/** ISO-8601 (incl. offset Z) — validación práctica sin depender de `datetime()` en todos los runtimes. */
const iso8601DateTime = z.string().refine(s => !Number.isNaN(Date.parse(s)), {
  message: 'Debe ser fecha/hora ISO-8601 válida',
})

export const programLimitEntrySchema = z.object({
  value: z.number(),
  unit: z.string().min(1),
  lastVerified: iso8601DateTime,
  validUntil: iso8601DateTime,
  sourceUrl: z.string().url(),
})

export type ProgramLimitEntry = z.infer<typeof programLimitEntrySchema>

/** Clave = identificador estable del dato (p. ej. snap_texas_gross_monthly_1p). */
export const programLimitsFileSchema = z.record(z.string().min(1), programLimitEntrySchema)

export type ProgramLimitsFile = z.infer<typeof programLimitsFileSchema>
