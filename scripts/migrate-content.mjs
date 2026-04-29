#!/usr/bin/env node
/**
 * Auditoría de rutas FUNNEL_ORDER vs app/ y out/ (Next.js App Router + export).
 *
 * - Fuente primaria: app/{slug}/page.tsx o app/[funnel]/page.tsx + data/funnels.ts
 * - Verificación secundaria: out/{slug}/index.html (si existe directorio out/)
 *
 * Salida: scripts/migrate-report.json
 *
 *   node scripts/migrate-content.mjs
 *   npm run migrate:audit
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, 'app')
const OUT = path.join(ROOT, 'out')
const FUNNELS_TS = path.join(ROOT, 'data', 'funnels.ts')
const REPORT_PATH = path.join(__dirname, 'migrate-report.json')

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
  const desc = block.match(/desc:\s*'([^']*)'/)?.[1]
  return { name, desc }
}

function resolvePageSource(slug) {
  const direct = path.join(APP, slug, 'page.tsx')
  if (fs.existsSync(direct)) return { kind: 'direct', file: direct }

  const funnelDyn = path.join(APP, '[funnel]', 'page.tsx')
  if (fs.existsSync(funnelDyn)) return { kind: 'dynamic-funnel', file: funnelDyn }

  return null
}

function pageDeclaresMetadata(src) {
  const hasConst = /export\s+const\s+metadata\s*(?::\s*Metadata)?\s*=/.test(src)
  const hasGen = /export\s+async\s+function\s+generateMetadata\s*\(/.test(src)
  return { hasConst, hasGen, ok: hasConst || hasGen }
}

function outHasIndex(slug) {
  const p = path.join(OUT, slug, 'index.html')
  return fs.existsSync(p)
}

function main() {
  if (!fs.existsSync(FUNNELS_TS)) {
    console.error('migrate-content: falta data/funnels.ts')
    process.exit(1)
  }
  const ts = fs.readFileSync(FUNNELS_TS, 'utf8')
  const order = parseFunnelOrder(ts)

  const ok = []
  const incomplete = []
  const missing = []

  const details = {}

  for (const slug of order) {
    const src = resolvePageSource(slug)
    const metaBlock = parseFunnelBlock(ts, slug)
    const inFunnels = metaBlock != null
    const outOk = fs.existsSync(OUT) ? outHasIndex(slug) : null

    if (!inFunnels || !src) {
      missing.push(slug)
      details[slug] = {
        reason: !inFunnels ? 'no en FUNNELS' : 'sin page.tsx (ni [funnel])',
        outIndexHtml: outOk,
      }
      continue
    }

    const pageSrc = fs.readFileSync(src.file, 'utf8')
    const decl = pageDeclaresMetadata(pageSrc)
    const titleFromData = metaBlock?.name ? `${metaBlock.name} | HazloAsíYa` : null
    const descFromData = metaBlock?.desc ? metaBlock.desc.slice(0, 155) : null

    let hasTitle = Boolean(titleFromData)
    let hasDesc = Boolean(descFromData)

    if (decl.hasConst) {
      const t = pageSrc.match(/title:\s*['"`]([^'"`]+)['"`]/)
      const d = pageSrc.match(/description:\s*['"`]([^'"`]+)['"`]/)
      if (t?.[1]) hasTitle = true
      if (d?.[1]) hasDesc = true
    }

    if (decl.hasGen && src.kind === 'dynamic-funnel') {
      if (pageSrc.includes('f.name') && pageSrc.includes('| HazloAsíYa')) hasTitle = true
      if (pageSrc.includes('f.desc')) hasDesc = true
    }

    const complete = decl.ok && hasTitle && hasDesc

    details[slug] = {
      pageSource: src.kind,
      pageFile: path.relative(ROOT, src.file).split(path.sep).join('/'),
      metadataExport: decl.hasConst ? 'metadata' : decl.hasGen ? 'generateMetadata' : 'none',
      derivedTitle: titleFromData,
      derivedDescriptionSample: descFromData ? `${descFromData.slice(0, 72)}…` : null,
      outIndexHtml: outOk,
    }

    if (!decl.ok) {
      incomplete.push(slug)
    } else if (!complete) {
      incomplete.push(slug)
    } else {
      ok.push(slug)
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    total: order.length,
    ok,
    incomplete,
    missing,
    details,
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8')
  console.log(`migrate-content: reporte → ${path.relative(ROOT, REPORT_PATH)}`)
  console.log(`  ok: ${ok.length} · incomplete: ${incomplete.length} · missing: ${missing.length}`)
  if (missing.length) console.log('  missing:', missing.join(', '))
  if (incomplete.length) console.log('  incomplete:', incomplete.join(', '))
}

main()
