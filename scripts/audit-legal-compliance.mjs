#!/usr/bin/env node
/**
 * Auditoría de cumplimiento legal (heurística — revisar falsos positivos).
 * FAIL → exit 1 · WARN → solo informe
 * Uso: node scripts/audit-legal-compliance.mjs [outDir]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, process.argv[2] || 'out')

const fails = []
const warns = []

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/')
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkFiles(p, acc)
    else if (/\.(tsx|ts|jsx|js|mdx|md)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

function read(p) {
  return fs.readFileSync(p, 'utf8')
}

const SOURCE_ROOTS = [path.join(ROOT, 'app'), path.join(ROOT, 'components'), path.join(ROOT, 'content')]
const IGNORE_PATH = (p) =>
  p.includes('node_modules') ||
  p.includes(`${path.sep}out${path.sep}`) ||
  rel(p).startsWith('scripts/audit-')

function scanUpl(files) {
  const badPhrases = [
    [/garantizamos\s+que\s+ser[aá]\s+aprobado/gi, 'garantizamos que será aprobado'],
    [/garantizamos\s+aprobaci[oó]n/gi, 'garantizamos aprobación'],
    [/te\s+representamos/gi, 'te representamos'],
  ]
  for (const file of files) {
    if (IGNORE_PATH(file)) continue
    const r = rel(file)
    if (r.includes('audit-legal') || r.includes('audit-data')) continue
    if (r === 'content/guides/_template.md') continue
    const txt = read(file)
    for (const [re, label] of badPhrases) {
      re.lastIndex = 0
      let m
      while ((m = re.exec(txt))) {
        const lineStart = txt.lastIndexOf('\n', m.index) + 1
        const lineEnd = txt.indexOf('\n', m.index)
        const line = txt.slice(lineStart, lineEnd === -1 ? txt.length : lineEnd)
        if (/no\s+garantizamos\s+aprobaci/i.test(line) || /no\s+garantizamos\s+que/i.test(line)) continue
        if (/te\s+representamos/i.test(label) && /no\s+representamos/i.test(line)) continue
        fails.push({ rule: 'UPL', level: 'FAIL', file: r, msg: `Posible lenguaje prohibido: ${label}` })
      }
    }
    const ases = /asesoría legal/gi
    let m
    while ((m = ases.exec(txt))) {
      const lineStart = txt.lastIndexOf('\n', m.index) + 1
      const lineEnd = txt.indexOf('\n', m.index)
      const line = txt.slice(lineStart, lineEnd === -1 ? txt.length : lineEnd).toLowerCase()
      const before = txt.slice(Math.max(0, m.index - 120), m.index).toLowerCase()
      const ok =
        /no\s+sustituye|no\s+es|no\s+somos|no\s+ofrecemos|no\s+constituye|prohibido|limitaci(o|ó)n|sin\s+sustituir|para\s+asesoría\s+legal|\bni\s+asesoría|¿/.test(
          before + line,
        )
      if (!ok) fails.push({ rule: 'UPL', level: 'FAIL', file: r, msg: '«asesoría legal» sin negación clara en contexto' })
    }
  }
}

function scanFtcFunnelPage() {
  const p = path.join(ROOT, 'app', '[funnel]', 'page.tsx')
  if (!fs.existsSync(p)) return
  const txt = read(p)
  if (!/Disclosure/.test(txt)) warns.push({ rule: 'FTC', level: 'WARN', file: rel(p), msg: 'Money page template sin componente Disclosure' })
}

function scanCircular230() {
  const paths = [
    path.join(ROOT, 'app', '[funnel]', 'page.tsx'),
    path.join(ROOT, 'app', 'itin', 'houston', 'page.tsx'),
  ]
  for (const p of paths) {
    if (!fs.existsSync(p)) continue
    const txt = read(p)
    const r = rel(p)
    if (r.includes('[funnel]')) {
      if (!/DISCLAIMER_ITIN/.test(txt))
        fails.push({ rule: 'Circ.230', level: 'FAIL', file: r, msg: 'Importar DISCLAIMER_ITIN en template de funnel' })
    } else if (r.includes('itin')) {
      if (!/DISCLAIMER_ITIN/.test(txt))
        fails.push({ rule: 'Circ.230', level: 'FAIL', file: r, msg: 'Página ITIN sin DISCLAIMER_ITIN' })
    }
  }
}

function scanCoppaGdprForm() {
  const p = path.join(ROOT, 'app', '[funnel]', 'form', 'page.tsx')
  if (!fs.existsSync(p)) return
  const txt = read(p)
  const r = rel(p)
  if (!/AgeGate/.test(txt)) warns.push({ rule: 'COPPA', level: 'WARN', file: r, msg: 'Formulario sin AgeGate' })
  if (!/GdprBadge/.test(txt)) warns.push({ rule: 'GDPR', level: 'WARN', file: r, msg: 'Formulario sin GdprBadge' })
}

function scanExternalLinks(files) {
  for (const file of files) {
    if (IGNORE_PATH(file)) continue
    const r = rel(file)
    if (!r.startsWith('app/') && !r.startsWith('components/')) continue
    const txt = read(file)
    if (targetBlankWithoutNoopener(txt))
      warns.push({ rule: 'LINKS', level: 'WARN', file: r, msg: 'target=_blank sin rel=noopener noreferrer (revisar)' })
  }
}

function targetBlankWithoutNoopener(txt) {
  const re = /target\s*=\s*["']_blank["'][^>]*>/gi
  let m
  while ((m = re.exec(txt))) {
    const chunk = m[0]
    if (!/rel\s*=\s*["'][^"']*noopener/.test(chunk)) {
      const start = Math.max(0, m.index - 120)
      const window = txt.slice(start, m.index + m[0].length)
      if (!/rel\s*=\s*["'][^"']*noopener/.test(window)) return true
    }
  }
  return false
}

function scanOut() {
  if (!fs.existsSync(OUT)) {
    warns.push({ rule: 'OUT', level: 'WARN', file: 'out/', msg: 'Directorio out/ no existe — omite chequeos estáticos' })
    return
  }
  const htmlFiles = walkFiles(OUT).filter((f) => f.endsWith('.html'))
  for (const f of htmlFiles) {
    const txt = read(f)
    if (/aggregateRating|"ratingValue"/.test(txt))
      fails.push({ rule: 'SCHEMA', level: 'FAIL', file: rel(f), msg: 'aggregateRating o ratingValue en HTML exportado' })
    if (/pages\.dev/.test(txt)) fails.push({ rule: 'DEPLOY', level: 'FAIL', file: rel(f), msg: 'Referencia a pages.dev' })
  }
  const robots = path.join(OUT, 'robots.txt')
  if (fs.existsSync(robots)) {
    const t = read(robots)
    if (t.includes('/*?*')) fails.push({ rule: 'ROBOTS', level: 'FAIL', file: rel(robots), msg: 'Disallow: /*?* prohibido' })
  }
}

function scanMonetization() {
  const p = path.join(ROOT, 'app', 'precios', 'page.tsx')
  if (!fs.existsSync(p)) return
  const txt = read(p)
  if (!/PricingCard|paid-service|Disclosure/.test(txt))
    warns.push({ rule: 'MONET', level: 'WARN', file: rel(p), msg: 'Página precios sin PricingCard/Disclosure evidente' })
}

function main() {
  const files = SOURCE_ROOTS.flatMap((d) => walkFiles(d))
  scanUpl(files)
  scanFtcFunnelPage()
  scanCircular230()
  scanCoppaGdprForm()
  scanExternalLinks(files)
  scanMonetization()
  scanOut()

  for (const w of warns) console.warn(`[WARN] ${w.rule} ${w.file}: ${w.msg}`)
  for (const f of fails) console.error(`[FAIL] ${f.rule} ${f.file}: ${f.msg}`)

  if (fails.length) {
    console.error(`\nlegal audit: ${fails.length} fallo(s), ${warns.length} advertencia(s)`)
    process.exit(1)
  }
  console.log(`legal audit: 0 fallos, ${warns.length} advertencia(s)`)
}

main()
