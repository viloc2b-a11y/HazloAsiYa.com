import { z } from 'zod'

/** Categorías editoriales alineadas a hubs (/tramites/...). */
const categoryEnum = z.enum([
  'beneficios',
  'impuestos',
  'escuela',
  'vivienda',
  'inmigracion',
  'finanzas',
  'salud',
])

const schemaFAQ = z
  .array(
    z.object({
      question: z.string(),
      answer: z.string().min(50),
    }),
  )
  .min(3)
  .max(8)

/**
 * Colección `guides` — artículos /guias/{slug}/
 * (Listo para integrar con Astro Content Collections o un loader propio.)
 */
export const guideSchema = z.object({
  // SEO core — todos obligatorios salvo canonical
  title: z.string().max(60),
  description: z.string().max(155),
  h1: z.string(),
  canonical: z.string().url().optional(),
  ogImage: z.string().default('/images/og/default-og.jpg'),

  // Contenido
  tramiteSlug: z.string(),
  category: categoryEnum,
  relatedTramites: z.array(z.string()).default([]),
  hubUrl: z.string().optional(),

  // Vigencia regulatoria
  lastVerified: z.string().date(),
  dataValidUntil: z.string().date(),
  regulatorySource: z.array(z.string()).min(1),

  schemaFAQ,
  disclaimer: z.boolean().default(true),
  expertReviewed: z.boolean().default(false),

  // Publicación — coerce: frontmatter YAML suele entregar string de fecha
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
})

/**
 * Colección `tramites` — fichas de trámite (p. ej. /snap/, /medicaid/).
 * Misma base regulatoria/SEO que `guides`; `slug` identifica el trámite.
 */
export const tramiteSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  h1: z.string(),
  canonical: z.string().url().optional(),
  ogImage: z.string().default('/images/og/default-og.jpg'),

  slug: z.string(),
  category: categoryEnum,
  relatedGuides: z.array(z.string()).default([]),
  hubUrl: z.string().optional(),

  lastVerified: z.string().date(),
  dataValidUntil: z.string().date(),
  regulatorySource: z.array(z.string()).min(1),

  schemaFAQ,
  disclaimer: z.boolean().default(true),
  expertReviewed: z.boolean().default(false),

  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
})

export type GuideFrontmatter = z.infer<typeof guideSchema>
export type TramiteFrontmatter = z.infer<typeof tramiteSchema>
