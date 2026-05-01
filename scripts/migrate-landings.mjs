#!/usr/bin/env node
/**
 * Migración de landings a borradores Markdown (content/tramites/).
 *
 * Orden de fuente:
 * 1) legacy-landings/{slug}.html — HTML estático (Cheerio)
 * 2) data/funnels.ts — metadatos del funnel en App Router (sin ejecutar React)
 * 3) Nada encontrado — plantilla con TODOs
 *
 * Uso:
 *   node scripts/migrate-landings.mjs
 *   node scripts/migrate-landings.mjs --slug=snap
 *   node scripts/migrate-landings.mjs --dry-run
 *   node scripts/migrate-landings.mjs --force
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LEGACY = path.join(ROOT, 'legacy-landings')
const FUNNELS_TS = path.join(ROOT, 'data', 'funnels.ts')
const OUT_DIR = path.join(ROOT, 'content', 'tramites')

/** Categoría editorial por slug (resto → beneficios). */
const SLUG_CATEGORY = {
  snap: 'beneficios',
  medicaid: 'beneficios',
  wic: 'beneficios',
  utilities: 'beneficios',
  taxes: 'impuestos',
  itin: 'impuestos',
  escuela: 'escuela',
  rent: 'vivienda',
  prek: 'escuela',
  daca: 'inmigracion',
  iep: 'escuela',
  id: 'finanzas',
  twc: 'finanzas',
  jobs: 'finanzas',
  bank: 'finanzas',
  matricula: 'inmigracion',
}

function parseArgs() {
  const argv = process.argv.slice(2)
  const slugArg = argv.find((a) => a.startsWith('--slug='))?.split('=')[1]?.trim()
  return {
    slugOnly: slugArg || null,
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force'),
  }
}

function parseFunnelOrder(ts) {
  const m = ts.match(/export const FUNNEL_ORDER:\s*FunnelId\[\]\s*=\s*\[([\s\S]*?)\];/)
  if (!m) return []
  const ids = []
  const re = /'([a-z0-9_]+)'/gi
  let x
  while ((x = re.exec(m[1])) !== null) ids.push(x[1])
  return ids
}

function parseFunnelBlock(ts, id) {
  const re = new RegExp(`\\b${id}\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*steps:\\s*\\[`, 'm')
  const m = ts.match(re)
  if (!m) return null
  const block = m[1]
  const name = block.match(/name:\s*'([^']*)'/)?.[1]
  const action = block.match(/action:\s*'([^']*)'/)?.[1]
  const desc = block.match(/desc:\s*'([^']*)'/)?.[1]
  return { name, action, desc, block }
}

function clip(s, n) {
  if (!s) return ''
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`
}

function detectSource(slug) {
  const legacyFile = path.join(LEGACY, `${slug}.html`)
  if (fs.existsSync(legacyFile)) return { type: 'legacy-html', path: legacyFile }
  if (fs.existsSync(FUNNELS_TS)) {
    const ts = fs.readFileSync(FUNNELS_TS, 'utf8')
    if (parseFunnelBlock(ts, slug)) return { type: 'funnels-ts', path: FUNNELS_TS }
  }
  return { type: 'none', path: null }
}

function extractLegacyHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8')
  const $ = cheerio.load(html)
  const h1 = $('h1').first().text().trim()
  const title = h1 || $('title').first().text().trim() || ''
  const description = $('meta[name="description"]').attr('content')?.trim() || ''
  return { title, h1: h1 || title, description }
}

function buildFrontmatter({ slug, title, description, h1, sourceNote, category }) {
  const safeTitle = clip(title || slug, 60) || slug
  const safeDesc =
    clip(description || 'TODO: meta description orientativa para SEO (≤155 caracteres).', 155) ||
    'TODO: meta description.'
  const safeH1 = h1 || safeTitle
  const today = new Date().toISOString().slice(0, 10)
  const cat = category || SLUG_CATEGORY[slug] || 'beneficios'
  const og = `/images/og/default-og.jpg`

  return `---
draft: true
title: ${JSON.stringify(safeTitle)}
description: ${JSON.stringify(safeDesc)}
h1: ${JSON.stringify(safeH1)}
canonical: "https://hazloasiya.com/${slug}/"
ogImage: "${og}"
slug: "${slug}"
category: "${cat}"
relatedGuides: []
hubUrl: "/tramites/${cat}/"
lastVerified: "${today}"
dataValidUntil: "2026-12-31"
regulatorySource:
  - "TODO: URL oficial (agencia federal o estatal)"
schemaFAQ:
  - question: "¿Qué es este trámite y quién lo administra?"
    answer: "TODO: Respuesta de al menos cincuenta caracteres con la fuente oficial. Migración automática: ${sourceNote}"
  - question: "¿Qué documentos o datos piden primero?"
    answer: "TODO: Lista orientativa; verificar siempre el portal oficial el día de la solicitud. Este borrador fue generado por scripts/migrate-landings.mjs."
  - question: "¿Dónde se presenta la solicitud y cuánto tarda?"
    answer: "TODO: Enlace al portal o oficina oficial y tiempos típicos según la agencia. Completar antes de publicar (mínimo 50 caracteres en cada respuesta)."
disclaimer: true
expertReviewed: false
pubDate: ${today}
updatedDate: ${today}
---

## Contenido migrado

${sourceNote}

### TODO editorial

- Completar \`regulatorySource\` con URLs vigentes.
- Sustituir respuestas \`schemaFAQ\` por texto final (≥50 caracteres cada una).
- Redactar cuerpo del trámite y enlazar guías en \`relatedGuides\`.
`
}

function main() {
  const { slugOnly, dryRun, force } = parseArgs()
  if (!fs.existsSync(FUNNELS_TS)) {
    console.error('migrate-landings: falta data/funnels.ts')
    process.exit(1)
  }
  const ts = fs.readFileSync(FUNNELS_TS, 'utf8')
  let slugs = parseFunnelOrder(ts)
  if (slugOnly) {
    if (!slugs.includes(slugOnly)) {
      console.warn(`migrate-landings: "${slugOnly}" no está en FUNNEL_ORDER — se procesa igual.`)
    }
    slugs = [slugOnly]
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const slug of slugs) {
    const outFile = path.join(OUT_DIR, `migrated-${slug}.md`)
    if (fs.existsSync(outFile) && !force) {
      console.log(`[skip] ${path.relative(ROOT, outFile)} (existe; usa --force)`)
      continue
    }

    const src = detectSource(slug)
    let title
    let description
    let h1
    let sourceNote

    if (src.type === 'legacy-html') {
      const ex = extractLegacyHtml(src.path)
      title = ex.title
      description = ex.description
      h1 = ex.h1
      sourceNote = `Fuente: \`legacy-landings/${slug}.html\` (HTML estático).`
    } else if (src.type === 'funnels-ts') {
      const meta = parseFunnelBlock(ts, slug)
      title = meta?.name || slug
      description = meta?.desc || ''
      h1 = meta?.action || meta?.name || slug
      sourceNote = `Fuente: metadatos de \`data/funnels.ts\` (landing Next.js /${slug}/). No ejecuta React — revisar copy en la app.`
    } else {
      title = slug
      description = ''
      h1 = slug
      sourceNote =
        'Fuente: no se encontró HTML en legacy-landings ni entrada en funnels.ts — rellenar todo manualmente.'
    }

    const body = buildFrontmatter({
      slug,
      title,
      description,
      h1,
      sourceNote,
      category: SLUG_CATEGORY[slug] || 'beneficios',
    })

    if (dryRun) {
      console.log(`\n--- ${slug} → ${path.relative(ROOT, outFile)} ---\n${body.slice(0, 800)}…\n`)
    } else {
      fs.writeFileSync(outFile, body, 'utf8')
      console.log(`[write] ${path.relative(ROOT, outFile)} (${src.type})`)
    }
  }
}

main()
