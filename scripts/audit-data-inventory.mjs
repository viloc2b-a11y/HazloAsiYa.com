#!/usr/bin/env node
/**
 * Inventario automático de campos de formulario (CCPA/TDPSA / GDPR data mapping).
 * Uso: node scripts/audit-data-inventory.mjs
 * Salida: docs/data-inventory-auto.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'docs', 'data-inventory-auto.json')
const SCAN_DIRS = ['app', 'components'].map((d) => path.join(ROOT, d))

const exts = new Set(['.tsx', '.jsx'])

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, acc)
    else if (exts.has(path.extname(ent.name))) acc.push(p)
  }
  return acc
}

/** Ruta lógica tipo /ruta/ desde ruta de archivo bajo app/ */
function routeFromAppFile(filePath) {
  const rel = path.relative(path.join(ROOT, 'app'), filePath).split(path.sep)
  const base = rel[rel.length - 1]
  if (rel[0] === '[funnel]' && rel[1] === 'form' && base === 'page.tsx') return '/[funnel]/form/'
  if (rel[0] === '[funnel]' && base === 'page.tsx' && rel.length === 2) return '/[funnel]/'
  const parts = rel.filter((s) => !s.startsWith('('))
  if (base === 'page.tsx') {
    const segs = parts.slice(0, -1).map((s) => (s.startsWith('[') ? `[${s.slice(1, -1)}]` : s))
    const r = '/' + segs.join('/') + '/'
    return r.replace(/\/+/g, '/')
  }
  /** Componentes colocados junto a page.tsx (p. ej. MisDatosForm.tsx) */
  if (parts.length >= 2 && parts[parts.length - 1].endsWith('.tsx')) {
    const dir = parts.slice(0, -1)
    const segs = dir.map((s) => (s.startsWith('[') ? `[${s.slice(1, -1)}]` : s))
    if (segs.length === 0) return null
    const r = '/' + segs.join('/') + '/'
    return r.replace(/\/+/g, '/')
  }
  return null
}

/** Nombres literales en name="x" o name={'x'} / name={"x"} — evita name={name} dinámico */
function extractFieldNames(source) {
  const fields = []
  const seen = new Set()
  const patterns = [
    /\bname\s*=\s*["']([a-zA-Z0-9_]+)["']/g,
    /\bname\s*=\s*\{["']([^'"]+)["']\}/g,
    /\bname\s*=\s*\{`([^`]+)`\}/g,
  ]
  for (const re of patterns) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(source))) {
      const name = m[1]
      if (!name || name === 'name') continue
      if (seen.has(name)) continue
      seen.add(name)
      fields.push({ name, type: 'unknown', required: false })
    }
  }
  return fields
}

function main() {
  const files = SCAN_DIRS.flatMap((d) => walk(d))
  const byRoute = new Map()

  for (const file of files) {
    if (!file.includes(`${path.sep}app${path.sep}`)) continue
    const route = routeFromAppFile(file)
    if (!route) continue
    const src = fs.readFileSync(file, 'utf8')
    const fields = extractFieldNames(src)
    if (fields.length === 0) continue
    const relFile = path.relative(ROOT, file).split(path.sep).join('/')
    if (!byRoute.has(route)) byRoute.set(route, { route, files: [], fields: [] })
    const entry = byRoute.get(route)
    entry.files.push(relFile)
    for (const f of fields) {
      if (!entry.fields.some((e) => e.name === f.name)) entry.fields.push(f)
    }
  }

  const inventory = [...byRoute.values()].sort((a, b) => a.route.localeCompare(b.route))
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), routes: inventory }, null, 2), 'utf8')
  console.log(`Wrote ${inventory.length} route(s) to ${path.relative(ROOT, OUT)}`)
}

main()
