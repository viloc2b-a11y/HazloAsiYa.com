#!/usr/bin/env npx tsx
/**
 * Vigila vigencia de `src/data/program-limits.json` y, opcionalmente, compara con valores
 * extraídos por OpenAI (ChatGPT API) desde el HTML de `sourceUrl`:
 *
 *   --with-ai  → OpenAI Chat Completions (`OPENAI_API_KEY`)
 *
 *   npx tsx scripts/monitor-regulations.ts
 *   npx tsx scripts/monitor-regulations.ts --with-ai
 *   npx tsx scripts/monitor-regulations.ts --with-ai --strict
 *   (en --strict, «sin valor» de la API cuenta como fallo además de discrepancias/errores)
 *   npx tsx scripts/monitor-regulations.ts --report-json ./monitor-report.json
 *
 * Variables: OPENAI_API_KEY, OPENAI_MONITOR_MODEL, OPENAI_MODEL
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

export type MonitorReport = {
  generatedAt: string
  exitCode: number
  model?: string
  zod: {
    entryCount: number
    invalidDates: { key: string; validUntil: string }[]
    expired: { key: string; validUntil: string }[]
    soonExpiring: string[]
  }
  openai?: {
    skippedKeys: string[]
    fetchErrors: { key: string; error: string }[]
    missingExtract: { key: string; confidence: string; note?: string }[]
    discrepancies: { key: string; stored: number; extracted: number; confidence: string; note?: string }[]
    openaiErrors: { key: string; error: string }[]
    matchedKeys: string[]
  }
}

function parseReportJsonPath(argv: string[]): string | null {
  const i = argv.indexOf('--report-json')
  if (i === -1 || i + 1 >= argv.length) return null
  const p = argv[i + 1]
  if (!p || p.startsWith('-')) return null
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p)
}

function formatIssueMarkdown(
  report: MonitorReport,
  ctx: { workflowUrl?: string; commit?: string; ref?: string },
): string {
  const lines: string[] = []
  lines.push('El workflow **Monitor regulations** detectó un problema con `src/data/program-limits.json` o el cruce con OpenAI.')
  lines.push('')
  if (ctx.workflowUrl) lines.push(`- **Ejecución:** ${ctx.workflowUrl}`)
  if (ctx.ref) lines.push(`- **Ref:** ${ctx.ref}`)
  if (ctx.commit) lines.push(`- **Commit:** ${ctx.commit}`)
  lines.push(`- **Generado:** ${report.generatedAt}`)
  lines.push('')
  lines.push('### Resumen')
  lines.push('')
  lines.push(`| Métrica | Valor |`)
  lines.push(`| --- | --- |`)
  lines.push(`| Entradas JSON | ${report.zod.entryCount} |`)
  lines.push(`| Fechas inválidas | ${report.zod.invalidDates.length} |`)
  lines.push(`| Vigencia expirada | ${report.zod.expired.length} |`)
  lines.push(`| Próximos a vencer (14 días) | ${report.zod.soonExpiring.length} |`)
  if (report.openai) {
    lines.push(`| Fetch fuente fallido | ${report.openai.fetchErrors.length} |`)
    lines.push(`| Sin valor extraído (IA) | ${report.openai.missingExtract.length} |`)
    lines.push(`| Discrepancias número | ${report.openai.discrepancies.length} |`)
    lines.push(`| Errores OpenAI | ${report.openai.openaiErrors.length} |`)
    if (report.model) lines.push(`| Modelo | ${report.model} |`)
  }
  lines.push('')
  if (report.zod.invalidDates.length) {
    lines.push('### Fechas inválidas')
    report.zod.invalidDates.forEach(({ key, validUntil }) =>
      lines.push(`- \`${key}\`: \`${validUntil}\``),
    )
    lines.push('')
  }
  if (report.zod.expired.length) {
    lines.push('### Vigencia expirada')
    report.zod.expired.forEach(({ key, validUntil }) =>
      lines.push(`- \`${key}\` hasta \`${validUntil}\``),
    )
    lines.push('')
  }
  if (report.zod.soonExpiring.length) {
    lines.push('### Próximos a vencer (14 días)')
    report.zod.soonExpiring.forEach(l => lines.push(`- ${l}`))
    lines.push('')
  }
  if (report.openai?.fetchErrors.length) {
    lines.push('### Error al obtener la fuente')
    report.openai.fetchErrors.forEach(({ key, error }) =>
      lines.push(`- \`${key}\`: ${error}`),
    )
    lines.push('')
  }
  if (report.openai?.missingExtract.length) {
    lines.push('### IA: sin valor en el extracto')
    report.openai.missingExtract.forEach(({ key, confidence, note }) =>
      lines.push(`- \`${key}\` (${confidence})${note ? ` — ${note}` : ''}`),
    )
    lines.push('')
  }
  if (report.openai?.discrepancies.length) {
    lines.push('### Discrepancias (JSON vs modelo)')
    report.openai.discrepancies.forEach(
      ({ key, stored, extracted, confidence, note }) =>
        lines.push(
          `- \`${key}\`: JSON **${stored}** vs modelo **${extracted}** (${confidence})${note ? ` — ${note}` : ''}`,
        ),
    )
    lines.push('')
  }
  if (report.openai?.openaiErrors.length) {
    lines.push('### Errores de API / parsing')
    report.openai.openaiErrors.forEach(({ key, error }) =>
      lines.push(`- \`${key}\`: ${error}`),
    )
    lines.push('')
  }
  lines.push('---')
  lines.push('*Revisa las URLs oficiales en `sourceUrl` de cada entrada y actualiza el JSON con cifras verificadas.*')
  return lines.join('\n')
}

function writeReportFiles(report: MonitorReport, jsonPath: string) {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true })
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8')
  const mdPath = jsonPath.replace(/\.json$/i, '') + '.issue.md'
  if (report.exitCode === 0) {
    try {
      if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath)
    } catch {
      /* ignore */
    }
    return
  }
  const workflowUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined
  const md = formatIssueMarkdown(report, {
    workflowUrl,
    commit: process.env.GITHUB_SHA,
    ref: process.env.GITHUB_REF,
  })
  fs.writeFileSync(mdPath, md, 'utf8')
}

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
  const argv = process.argv.slice(2)
  const withAi = argv.includes('--with-ai')
  const strict = argv.includes('--strict')
  const reportJsonPath = parseReportJsonPath(argv)
  const model = process.env.OPENAI_MONITOR_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  const report: MonitorReport = {
    generatedAt: new Date().toISOString(),
    exitCode: 0,
    zod: {
      entryCount: 0,
      invalidDates: [],
      expired: [],
      soonExpiring: [],
    },
  }

  let limits: z.infer<typeof programLimitsFileSchema>
  try {
    const raw = fs.readFileSync(LIMITS_PATH, 'utf8')
    limits = programLimitsFileSchema.parse(JSON.parse(raw))
  } catch (e) {
    report.exitCode = 1
    if (reportJsonPath) {
      writeReportFiles(report, reportJsonPath)
    }
    console.error('[limits] Error leyendo o validando JSON:', e instanceof Error ? e.message : e)
    process.exit(1)
    return
  }

  const now = Date.now()
  let exitCode = 0
  const soon: string[] = []

  for (const [key, entry] of Object.entries(limits)) {
    const until = Date.parse(entry.validUntil)
    if (Number.isNaN(until)) {
      console.error(`[limits] Fecha inválida validUntil: ${key}`)
      report.zod.invalidDates.push({ key, validUntil: entry.validUntil })
      exitCode = 1
      continue
    }
    if (until < now) {
      console.warn(`[limits] EXPIRED ${key} validUntil=${entry.validUntil}`)
      report.zod.expired.push({ key, validUntil: entry.validUntil })
      exitCode = 1
    } else if (until - now < 14 * 24 * 60 * 60 * 1000) {
      soon.push(`${key} → ${entry.validUntil}`)
    }
  }

  report.zod.entryCount = Object.keys(limits).length
  report.zod.soonExpiring = soon

  if (soon.length) {
    console.log('[limits] Próximos a vencer (14 días):')
    soon.forEach(s => console.log('  -', s))
  }

  console.log('[limits] Zod OK. Entradas:', report.zod.entryCount)

  if (!withAi) {
    report.exitCode = exitCode
    if (reportJsonPath) writeReportFiles(report, reportJsonPath)
    process.exit(exitCode)
    return
  }

  report.model = model
  report.openai = {
    skippedKeys: [],
    fetchErrors: [],
    missingExtract: [],
    discrepancies: [],
    openaiErrors: [],
    matchedKeys: [],
  }

  let discrepancies = 0

  function scoreMismatch(entryValue: number, extracted: number): boolean {
    return Math.abs(extracted - entryValue) > 0.001 && Math.round(extracted) !== Math.round(entryValue)
  }

  for (const [key, entry] of Object.entries(limits)) {
    const skipAi =
      entry.unit.includes('approx') ||
      entry.unit.includes('reference') ||
      entry.unit.includes('regulatory_reference')

    if (skipAi) {
      console.log(`[monitor] skip (referencia): ${key}`)
      report.openai!.skippedKeys.push(key)
      continue
    }

    let excerpt: string
    try {
      excerpt = await fetchTextExcerpt(entry.sourceUrl, 14_000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`[monitor] ${key}: fetch fuente`, msg)
      report.openai!.fetchErrors.push({ key, error: msg })
      discrepancies++
      continue
    }

    try {
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
        console.warn(`[openai] ${key}: sin valor (${result.confidence}) ${result.note ?? ''}`)
        report.openai!.missingExtract.push({
          key,
          confidence: result.confidence,
          note: result.note,
        })
        if (strict) discrepancies++
      } else if (scoreMismatch(entry.value, ev)) {
        console.warn(
          `[openai] DISCREPANCIA ${key}: JSON=${entry.value} modelo=${ev} (${result.confidence}) ${result.note ?? ''}`,
        )
        report.openai!.discrepancies.push({
          key,
          stored: entry.value,
          extracted: ev,
          confidence: result.confidence,
          note: result.note,
        })
        discrepancies++
      } else {
        console.log(`[openai] OK ${key}: ~${ev}`)
        report.openai!.matchedKeys.push(key)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`[openai] ${key}:`, msg)
      report.openai!.openaiErrors.push({ key, error: msg })
      discrepancies++
    }
  }

  if (strict && discrepancies > 0) exitCode = 1
  report.exitCode = exitCode
  if (reportJsonPath) writeReportFiles(report, reportJsonPath)
  process.exit(exitCode)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
