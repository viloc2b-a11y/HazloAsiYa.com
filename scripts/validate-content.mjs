#!/usr/bin/env node
/**
 * SEO / content validation for HazloAsíYa (Next.js App Router).
 *
 *   node scripts/validate-content.mjs
 *   node scripts/validate-content.mjs --static-out=out
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, 'app')
const DATA_FUNNELS = path.join(ROOT, 'data', 'funnels.ts')
const GUIDES_DIR = path.join(ROOT, 'content', 'guides')

const TITLE_MAX = 60
const DESC_MAX = 155

const issues = []

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/')
}

function walkFiles(dir, pred) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...walkFiles(p, pred))
    else if (pred(p)) out.push(p)
  }
  return out
}

function walkAllFiles(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...walkAllFiles(p))
    else out.push(p)
  }
  return out
}

function extractMetaString(src, key) {
  const re = new RegExp(`${key}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1`, 'm')
  const m = src.match(re)
  if (!m) return null
  return m[2].replace(/\s+/g, ' ').trim()
}

function checkLength(file, line, field, value, max) {
  if (value == null) return
  if (value.length > max) {
    issues.push({
      file: rel(file),
      line,
      msg: `${field} length ${value.length} > ${max}: ${value.slice(0, 72)}…`,
    })
  }
}

function findLineForKey(src, key) {
  const lines = src.split('\n')
  const i = lines.findIndex((l) => new RegExp(`\\b${key}\\s*:`).test(l))
  return i >= 0 ? i + 1 : 1
}

function parseFunnelNames() {
  const src = fs.readFileSync(DATA_FUNNELS, 'utf8')
  /** Solo `name` de cada entrada en FUNNELS (4 espacios), no afiliados anidados. */
  const names = []
  const re = /^ {4}name:\s*'([^']*)'/gm
  let m
  while ((m = re.exec(src)) !== null) names.push(m[1])
  return names
}

function validateFunnelTitles() {
  const names = parseFunnelNames()
  const templates = [
    (n) => `${n} | HazloAsíYa`,
    (n) => `${n} — cuestionario | HazloAsíYa`,
    (n) => `${n} — resultado | HazloAsíYa`,
  ]
  for (const n of names) {
    for (const t of templates) {
      const title = t(n)
      if (title.length > TITLE_MAX) {
        issues.push({
          file: 'data/funnels.ts',
          line: '?',
          msg: `Funnel "${n}" → title length ${title.length} > ${TITLE_MAX}: ${title}`,
        })
      }
    }
  }
}

function validateConstMetadata(filePath, src) {
  const title = extractMetaString(src, 'title')
  const description = extractMetaString(src, 'description')
  if (!title) {
    issues.push({
      file: rel(filePath),
      line: findLineForKey(src, 'title'),
      msg: 'metadata: falta title (string literal)',
    })
  } else {
    checkLength(filePath, findLineForKey(src, 'title'), 'title', title, TITLE_MAX)
  }
  if (!description) {
    issues.push({
      file: rel(filePath),
      line: findLineForKey(src, 'description'),
      msg: 'metadata: falta description (string literal)',
    })
  } else {
    checkLength(
      filePath,
      findLineForKey(src, 'description'),
      'description',
      description,
      DESC_MAX,
    )
  }
}

function validateMetadataInSource(filePath, src) {
  const hasConst = /export\s+const\s+metadata/.test(src)
  const hasGen = /export\s+async\s+function\s+generateMetadata/.test(src)
  if (!hasConst && !hasGen) return

  if (hasConst) {
    validateConstMetadata(filePath, src)
  } else {
    /** Acepta `title:` o abreviado `title,` en el objeto retornado */
    if (!/\btitle(\s*[:,]|\s*:)/.test(src)) {
      issues.push({
        file: rel(filePath),
        line: 1,
        msg: 'generateMetadata sin propiedad title (title: o title,) en el archivo',
      })
    }
    if (!/\bdescription(\s*[:,]|\s*:)/.test(src)) {
      issues.push({
        file: rel(filePath),
        line: 1,
        msg: 'generateMetadata sin propiedad description (description: o description,) en el archivo',
      })
    }
  }
}

function validateMarkdownGuides() {
  if (!fs.existsSync(GUIDES_DIR)) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const oldestVerified = new Date(today)
  oldestVerified.setDate(oldestVerified.getDate() - 90)

  const files = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.md') && f !== '_template.md')

  for (const file of files) {
    const fp = path.join(GUIDES_DIR, file)
    const base = rel(fp)
    let data
    try {
      data = matter(fs.readFileSync(fp, 'utf8')).data
    } catch (e) {
      issues.push({
        file: base,
        line: 1,
        msg: `no se pudo parsear frontmatter: ${e?.message || e}`,
      })
      continue
    }

    if (data.draft === true) continue

    if (typeof data.title !== 'string' || !data.title.trim()) {
      issues.push({ file: base, line: 1, msg: 'frontmatter: falta title' })
    } else if (data.title.length > TITLE_MAX) {
      issues.push({
        file: base,
        line: 1,
        msg: `title length ${data.title.length} > ${TITLE_MAX}`,
      })
    }

    if (typeof data.description !== 'string' || !data.description.trim()) {
      issues.push({ file: base, line: 1, msg: 'frontmatter: falta description' })
    } else if (data.description.length > DESC_MAX) {
      issues.push({
        file: base,
        line: 1,
        msg: `description length ${data.description.length} > ${DESC_MAX}`,
      })
    }

    const faq = data.schemaFAQ
    if (!Array.isArray(faq) || faq.length < 3) {
      issues.push({ file: base, line: 1, msg: 'schemaFAQ: se requieren al menos 3 ítems' })
    } else {
      faq.forEach((item, i) => {
        const a = item?.answer
        if (typeof a !== 'string' || a.length < 50) {
          issues.push({
            file: base,
            line: 1,
            msg: `schemaFAQ[${i}].answer debe ser string ≥50 caracteres`,
          })
        }
      })
    }

    if (data.disclaimer !== true) {
      issues.push({
        file: base,
        line: 1,
        msg: 'disclaimer debe ser true (obligatorio para publicar)',
      })
    }

    const lvStr = data.lastVerified
    if (typeof lvStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(lvStr)) {
      issues.push({ file: base, line: 1, msg: 'lastVerified debe ser fecha ISO YYYY-MM-DD' })
    } else {
      const lv = new Date(`${lvStr}T12:00:00`)
      if (lv < oldestVerified) {
        issues.push({
          file: base,
          line: 1,
          msg: `lastVerified (${lvStr}) supera 90 días sin revisión`,
        })
      }
    }

    const dvStr = data.dataValidUntil
    if (typeof dvStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dvStr)) {
      issues.push({ file: base, line: 1, msg: 'dataValidUntil debe ser fecha ISO YYYY-MM-DD' })
    } else {
      const until = new Date(`${dvStr}T12:00:00`)
      if (until < today) {
        issues.push({
          file: base,
          line: 1,
          msg: `dataValidUntil (${dvStr}) está en el pasado`,
        })
      }
    }

    const src = data.regulatorySource
    if (!Array.isArray(src) || src.length < 1) {
      issues.push({
        file: base,
        line: 1,
        msg: 'regulatorySource debe tener al menos 1 URL o referencia',
      })
    }
  }
}

function validateAppPages() {
  validateFunnelTitles()

  const tsxUnderApp = walkFiles(APP, (p) => p.endsWith('.tsx'))
  for (const f of tsxUnderApp) {
    const base = path.basename(f)
    if (base !== 'page.tsx' && base !== 'layout.tsx') continue
    const src = fs.readFileSync(f, 'utf8')
    validateMetadataInSource(f, src)
  }

  const pages = walkFiles(APP, (p) => path.basename(p) === 'page.tsx')
  for (const f of pages) {
    const src = fs.readFileSync(f, 'utf8')
    if (!/^\s*['"]use client['"]/m.test(src)) continue
    if (/export\s+const\s+metadata|generateMetadata/.test(src)) continue
    const dir = path.dirname(f)
    const localLayout = path.join(dir, 'layout.tsx')
    if (!fs.existsSync(localLayout)) {
      issues.push({
        file: rel(f),
        line: 1,
        msg: "'use client' en page sin layout.tsx hermano con metadata",
      })
      continue
    }
    const lsrc = fs.readFileSync(localLayout, 'utf8')
    if (!/export\s+const\s+metadata|generateMetadata/.test(lsrc)) {
      issues.push({
        file: rel(f),
        line: 1,
        msg: `layout ${rel(localLayout)} sin metadata para page cliente`,
      })
    }
  }
}

function scanOutDir(outDir) {
  const abs = path.isAbsolute(outDir) ? outDir : path.join(ROOT, outDir)
  if (!fs.existsSync(abs)) {
    issues.push({
      file: outDir,
      line: 0,
      msg: 'directorio out no existe (ejecuta npm run build antes)',
    })
    return
  }

  for (const f of walkAllFiles(abs)) {
    const low = f.toLowerCase()
    if (low.endsWith('.png') || low.endsWith('.jpg') || low.endsWith('.webp')) continue
    let text
    try {
      text = fs.readFileSync(f, 'utf8')
    } catch {
      continue
    }
    const rf = rel(f)
    if (text.includes('hazloasiya.pages.dev')) {
      const line = text.split('\n').findIndex((l) => l.includes('hazloasiya.pages.dev')) + 1
      issues.push({
        file: rf,
        line: line || '?',
        msg: 'URL de desarrollo hazloasiya.pages.dev en artefacto estático',
      })
    }
    if (/ratingValue|aggregateRating/i.test(text)) {
      const line =
        text.split('\n').findIndex((l) => /ratingValue|aggregateRating/i.test(l)) + 1
      issues.push({
        file: rf,
        line: line || '?',
        msg: 'schema de reseñas prohibido (ratingValue / aggregateRating)',
      })
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  const outIdx = args.indexOf('--static-out')
  const outDir = outIdx >= 0 ? args[outIdx + 1] || 'out' : null

  validateMarkdownGuides()
  validateAppPages()

  if (outDir) scanOutDir(outDir)

  if (issues.length) {
    console.error('\nvalidate-content: FAILED\n')
    for (const i of issues) {
      console.error(`${i.file}:${i.line} — ${i.msg}`)
    }
    console.error(`\nTotal: ${issues.length}\n`)
    process.exit(1)
  }
  console.log('validate-content: OK')
}

main()
