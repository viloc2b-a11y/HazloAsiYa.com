#!/usr/bin/env node
/**
 * Genera JPG 1200×630 en public/images/og/ alineadas al sitemap (app/sitemap.ts).
 * Paleta: navy #082B49, badge teal #2CA58D (prompt marca).
 *
 *   npm run generate:og
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'og')
const FUNNELS_PATH = path.join(ROOT, 'data', 'funnels.ts')
const SITEMAP_PATH = path.join(ROOT, 'app', 'sitemap.ts')

const NAVY = '#082B49'
const TEAL = '#2CA58D'
const WHITE = '#FFFFFF'
const MUTED = 'rgba(255,255,255,0.55)'

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseFunnelOrder(funnelsSrc) {
  const m = funnelsSrc.match(/export const FUNNEL_ORDER:\s*FunnelId\[\]\s*=\s*\[([\s\S]*?)\]/)
  if (!m) throw new Error('No se encontró FUNNEL_ORDER en data/funnels.ts')
  return [...m[1].matchAll(/'([a-z0-9]+)'/gi)].map((x) => x[1])
}

function parseFunnelName(funnelsSrc, slug) {
  const re = new RegExp(`\\b${slug}:\\s*\\{[\\s\\S]*?\\bname:\\s*'([^']*)'`)
  const m = funnelsSrc.match(re)
  return m ? m[1] : slug
}

/** Rutas GEO como en app/sitemap.ts (sin depender de ejecutar TS). */
function parseGeoPaths(sitemapSrc) {
  const m = sitemapSrc.match(/GEO_PATHS\s*=\s*\[([\s\S]*?)\]\s*as const/)
  if (!m) return []
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1].replace(/^\//, '').replace(/\/$/, ''))
}

function titleFontSize(title) {
  const len = title.length
  if (len <= 28) return 56
  if (len <= 45) return 44
  if (len <= 65) return 34
  return 28
}

function wrapTitleLines(title, maxCharsPerLine = 18) {
  const words = title.split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length <= maxCharsPerLine) cur = next
    else {
      if (cur) lines.push(cur)
      cur = w.length > maxCharsPerLine ? w.slice(0, maxCharsPerLine - 1) + '…' : w
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 4)
}

function buildSvg(centerTitle) {
  const fsz = titleFontSize(centerTitle)
  const lines = wrapTitleLines(centerTitle, fsz >= 44 ? 16 : 20)
  const lineHeight = Math.round(fsz * 1.15)
  const startY = 310 - ((lines.length - 1) * lineHeight) / 2
  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="600" y="${startY + i * lineHeight}" text-anchor="middle">${escapeXml(line)}</tspan>`,
    )
    .join('')

  const badgeY = startY + lines.length * lineHeight + 36

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <text x="48" y="68" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="700" fill="${WHITE}">HazloAsíYa</text>
  <text font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${fsz}" font-weight="700" fill="${WHITE}">${tspans}</text>
  <rect x="420" y="${badgeY - 42}" width="360" height="56" rx="14" fill="${TEAL}"/>
  <text x="600" y="${badgeY - 8}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="${WHITE}">Evaluación gratis →</text>
  <text x="1152" y="598" text-anchor="end" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="${MUTED}">hazloasiya.com</text>
</svg>`
}

async function writeJpg(filename, title) {
  const svg = buildSvg(title)
  const out = path.join(OUT_DIR, filename)
  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(out)
  console.log('OK', filename)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const funnelsSrc = fs.readFileSync(FUNNELS_PATH, 'utf8')
  const sitemapSrc = fs.readFileSync(SITEMAP_PATH, 'utf8')
  const slugs = parseFunnelOrder(funnelsSrc)
  const geoRaw = parseGeoPaths(sitemapSrc)

  const jobs = []

  jobs.push(['default-og.jpg', 'Trámites en EE.UU. — sin errores'])
  jobs.push(['terms-og.jpg', 'Términos de uso'])
  jobs.push(['privacy-og.jpg', 'Privacidad'])
  jobs.push(['sobre-nosotros-og.jpg', 'Quiénes somos'])

  for (const id of slugs) {
    const name = parseFunnelName(funnelsSrc, id)
    jobs.push([`${id}-og.jpg`, name])
  }

  const geoTitles = {
    'snap/texas': 'SNAP en Texas',
    'medicaid/texas': 'Medicaid y CHIP en Texas',
    'itin/houston': 'ITIN en Houston',
  }
  for (const g of geoRaw) {
    const safe = g.replace(/\//g, '-')
    const title = geoTitles[g] || g.replace(/\//g, ' · ')
    jobs.push([`${safe}-og.jpg`, title])
  }

  for (const [file, title] of jobs) {
    await writeJpg(file, title)
  }

  console.log(`\nGeneradas ${jobs.length} imágenes en ${path.relative(ROOT, OUT_DIR)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
