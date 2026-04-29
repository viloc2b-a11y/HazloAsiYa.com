#!/usr/bin/env node
/**
 * Post-build checks: sitemap ↔ HTML, robots, _redirects, canonical en páginas críticas.
 * Uso: node scripts/audit-static-export.mjs [outDir]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, process.argv[2] || 'out')

const issues = []
const warnings = []

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/')
}

function mustExist(file, label) {
  if (!fs.existsSync(file)) {
    issues.push({ file: rel(file), msg: `falta ${label}` })
    return false
  }
  return true
}

function locsFromSitemap(xml) {
  const locs = []
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g
  let m
  while ((m = re.exec(xml)) !== null) locs.push(m[1].trim())
  return locs
}

function urlToIndexHtml(outRoot, absoluteUrl) {
  let u
  try {
    u = new URL(absoluteUrl)
  } catch {
    issues.push({ file: 'sitemap.xml', msg: `URL inválida: ${absoluteUrl}` })
    return null
  }
  let pathname = u.pathname
  if (pathname.endsWith('/')) pathname = pathname.slice(0, -1)
  if (pathname === '' || pathname === '/') return path.join(outRoot, 'index.html')
  const segments = pathname.split('/').filter(Boolean)
  return path.join(outRoot, ...segments, 'index.html')
}

function assertCanonical(htmlPath, expectedPathSuffixes, forbiddenSubstrings) {
  if (!fs.existsSync(htmlPath)) return
  const html = fs.readFileSync(htmlPath, 'utf8')
  const canonRe = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  const m = html.match(canonRe)
  if (!m) {
    issues.push({
      file: rel(htmlPath),
      msg: 'no se encontró <link rel="canonical" …>',
    })
    return
  }
  const href = m[1]
  const ok = expectedPathSuffixes.some((s) => href.includes(s))
  if (!ok) {
    issues.push({
      file: rel(htmlPath),
      msg: `canonical href inesperado: ${href} (esperaba path que contenga ${expectedPathSuffixes.join(' o ')})`,
    })
  }
  for (const bad of forbiddenSubstrings) {
    if (href.includes(bad)) {
      issues.push({
        file: rel(htmlPath),
        msg: `canonical apunta a entorno prohibido (${bad}): ${href}`,
      })
    }
  }
}

function collectIndexHtmlFiles(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...collectIndexHtmlFiles(p))
    else if (name === 'index.html') out.push(p)
  }
  return out
}

function walkLdJsonNodes(obj, visit) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    for (const x of obj) walkLdJsonNodes(x, visit)
    return
  }
  const g = obj['@graph']
  if (Array.isArray(g)) {
    for (const x of g) walkLdJsonNodes(x, visit)
  }
  if (obj['@type']) visit(obj)
}

function auditHtmlSemantics(htmlPath, html) {
  const rf = rel(htmlPath)
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) {
    issues.push({ file: rf, msg: 'no se encontró <link rel="canonical" …>' })
  }
  if (/AggregateRating/i.test(html) || /\bratingValue\b/i.test(html)) {
    issues.push({ file: rf, msg: 'prohibido: AggregateRating / ratingValue en HTML' })
  }

  const scriptRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = scriptRe.exec(html)) !== null) {
    const raw = m[1].trim()
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      continue
    }
    walkLdJsonNodes(data, (node) => {
      const types = node['@type']
      const tlist = Array.isArray(types) ? types : [types]
      if (tlist.includes('FAQPage')) {
        const me = node.mainEntity
        const ok =
          Array.isArray(me) ? me.length > 0 : me != null && typeof me === 'object'
        if (!ok) {
          issues.push({ file: rf, msg: 'FAQPage sin mainEntity válido' })
        }
      }
      if (tlist.includes('SearchAction')) {
        const s = JSON.stringify(node)
        if (!s.includes('search_term_string') || !s.includes('/buscar')) {
          warnings.push(
            `${rf}: SearchAction debería incluir plantilla hacia /buscar/ con search_term_string (Pagefind)`,
          )
        }
      }
    })
  }
}

function main() {
  if (!mustExist(OUT, 'directorio out')) {
    console.error(issues.map((i) => `${i.file} — ${i.msg}`).join('\n'))
    process.exit(1)
  }

  const sitemapPath = path.join(OUT, 'sitemap.xml')
  const robotsPath = path.join(OUT, 'robots.txt')
  const redirectsPath = path.join(OUT, '_redirects')

  mustExist(sitemapPath, 'out/sitemap.xml')
  mustExist(robotsPath, 'out/robots.txt')
  mustExist(redirectsPath, 'out/_redirects')
  mustExist(path.join(OUT, 'pagefind', 'pagefind.js'), 'out/pagefind/pagefind.js (ejecutar pagefind tras next build)')

  if (issues.length) {
    console.error(issues.map((i) => `${i.file} — ${i.msg}`).join('\n'))
    process.exit(1)
  }

  const robots = fs.readFileSync(robotsPath, 'utf8')
  if (robots.includes('/*?*')) {
    issues.push({
      file: rel(robotsPath),
      msg: 'robots.txt no debe contener Disallow: /*?* (rompe UTM)',
    })
  }

  const redir = fs.readFileSync(redirectsPath, 'utf8')
  const need = [
    'https://hazloasiya.pages.dev/*  https://www.hazloasiya.com/:splat  301!',
    'https://hazloasiya.com/*  https://www.hazloasiya.com/:splat  301!',
  ]
  for (const line of need) {
    if (!redir.includes(line)) {
      issues.push({
        file: rel(redirectsPath),
        msg: `falta regla 301 exacta: ${line}`,
      })
    }
  }

  const xml = fs.readFileSync(sitemapPath, 'utf8')
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    issues.push({
      file: rel(sitemapPath),
      msg: 'sitemap: verificar xmlns http:// (no https) para sitemap/0.9',
    })
  }

  const locs = locsFromSitemap(xml)
  const forbiddenSitemapPaths = ['/form/', '/result/', '/api/']
  for (const loc of locs) {
    if (forbiddenSitemapPaths.some((p) => loc.includes(p))) {
      issues.push({
        file: rel(sitemapPath),
        msg: `URL no debe aparecer en sitemap: ${loc}`,
      })
    }
    const htmlFile = urlToIndexHtml(OUT, loc)
    if (!htmlFile || !fs.existsSync(htmlFile)) {
      issues.push({
        file: rel(sitemapPath),
        msg: `URL en sitemap sin HTML: ${loc} → esperado ${htmlFile ? rel(htmlFile) : '?'}`,
      })
    }
  }

  const forbidden = ['pages.dev', 'localhost']

  assertCanonical(path.join(OUT, 'index.html'), ['hazloasiya.com/'], forbidden)
  assertCanonical(path.join(OUT, 'snap', 'index.html'), ['/snap/'], forbidden)
  assertCanonical(
    path.join(OUT, 'sobre-nosotros', 'index.html'),
    ['/sobre-nosotros/'],
    forbidden,
  )
  assertCanonical(path.join(OUT, 'snap', 'texas', 'index.html'), ['/snap/texas/'], forbidden)

  for (const htmlPath of collectIndexHtmlFiles(OUT)) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    auditHtmlSemantics(htmlPath, html)
  }

  if (warnings.length) {
    console.warn('\naudit-static-export: advertencias (no bloquean)\n')
    for (const w of warnings) console.warn(w)
    console.warn('')
  }

  if (issues.length) {
    console.error('\naudit-static-export: FAILED\n')
    for (const i of issues) console.error(`${i.file} — ${i.msg}`)
    console.error(`\nTotal: ${issues.length}\n`)
    process.exit(1)
  }
  console.log('audit-static-export: OK')
}

main()
