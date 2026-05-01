#!/usr/bin/env npx tsx
/**
 * Vigila vigencia de `src/data/program-limits.json` y, con --with-ai, pide a OpenAI
 * que extraiga cifras desde un extracto HTTP de sourceUrl y las compare con el JSON.
 *
 *   npx tsx scripts/monitor-regulations.ts
 *   npx tsx scripts/monitor-regulations.ts --with-ai
 *   npx tsx scripts/monitor-regulations.ts --with-ai --strict
 *
 * Requiere en .env o entorno: OPENAI_API_KEY (solo con --with-ai).
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'
import { programLimitsFileSchema } from '../src/schemas/limits.schema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LIMITS_PATH = path.join(ROOT, 'src', 'data', 'program-limits.json')

const extractionSchema = z.object({
  extractedValue: z.number().nullable(),
  confidence: z.enum(['high', 'medium', 'low']),
  note: z.string().optional(),
})

async function fetchTextExcerpt(url: string, maxChars: number): Promise<string> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'HazloAsiYa-reg-monitor/1.0 (+https://www.hazloasiya.com)' },
    signal: AbortSignal.timeout(25_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const html = await res.text()
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.slice(0, maxChars)
}

async function openAiExtractNumber(args: {
  programKey: string
  storedValue: number
  unit: string
  sourceUrl: string
  excerpt: string
  model: string
}): Promise<z.infer<typeof extractionSchema>> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY requerida con --with-ai')

  const system = `Eres un asistente que extrae UN solo número regulatorio de un extracto de página web.
Responde solo JSON: {"extractedValue": number | null, "confidence": "high"|"medium"|"low", "note": string opcional}.
Si no encuentras el valor aplicable al programa indicado, extractedValue null.
El valor debe estar en la misma unidad que indique el usuario (USD mensual anual o porcentaje FPL).`

  const user = JSON.stringify({
    programKey: args.programKey,
    storedValue: args.storedValue,
    unit: args.unit,
    sourceUrl: args.sourceUrl,
    excerpt: args.excerpt,
  })

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: args.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.1,
    }),
  })

  const data = (await r.json()) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } }
  if (!r.ok) throw new Error(data.error?.message || `OpenAI ${r.status}`)

  const text = data.choices?.[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(text) as unknown
  return extractionSchema.parse(parsed)
}

async function main() {
  const withAi = process.argv.includes('--with-ai')
  const strict = process.argv.includes('--strict')
  const model = process.env.OPENAI_MONITOR_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  const raw = fs.readFileSync(LIMITS_PATH, 'utf8')
  const limits = programLimitsFileSchema.parse(JSON.parse(raw))

  const now = Date.now()
  let exitCode = 0
  const soon: string[] = []

  for (const [key, entry] of Object.entries(limits)) {
    const until = Date.parse(entry.validUntil)
    if (Number.isNaN(until)) {
      console.error(`[limits] Fecha inválida validUntil: ${key}`)
      exitCode = 1
      continue
    }
    if (until < now) {
      console.warn(`[limits] EXPIRED ${key} validUntil=${entry.validUntil}`)
      exitCode = 1
    } else if (until - now < 14 * 24 * 60 * 60 * 1000) {
      soon.push(`${key} → ${entry.validUntil}`)
    }
  }

  if (soon.length) {
    console.log('[limits] Próximos a vencer (14 días):')
    soon.forEach(s => console.log('  -', s))
  }

  console.log('[limits] Zod OK. Entradas:', Object.keys(limits).length)

  if (!withAi) {
    process.exit(exitCode)
    return
  }

  let discrepancies = 0
  for (const [key, entry] of Object.entries(limits)) {
    if (entry.unit.includes('approx') || entry.unit.includes('reference')) {
      console.log(`[openai] skip (referencia): ${key}`)
      continue
    }
    try {
      const excerpt = await fetchTextExcerpt(entry.sourceUrl, 14_000)
      const result = await openAiExtractNumber({
        programKey: key,
        storedValue: entry.value,
        unit: entry.unit,
        sourceUrl: entry.sourceUrl,
        excerpt,
        model,
      })
      const ev = result.extractedValue
      if (ev == null) {
        console.warn(`[openai] ${key}: no extrajo valor (${result.confidence}) ${result.note ?? ''}`)
        continue
      }
      if (Math.abs(ev - entry.value) > 0.001 && Math.round(ev) !== Math.round(entry.value)) {
        console.warn(
          `[openai] DISCREPANCIA ${key}: JSON=${entry.value} modelo=${ev} (${result.confidence}) ${result.note ?? ''}`,
        )
        discrepancies++
      } else {
        console.log(`[openai] OK ${key}: ~${ev}`)
      }
    } catch (e) {
      console.warn(`[openai] ${key}: error`, e instanceof Error ? e.message : e)
      discrepancies++
    }
  }

  if (strict && discrepancies > 0) exitCode = 1
  process.exit(exitCode)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
