#!/usr/bin/env node
/**
 * Comprueba que las variables relevantes en .env.local tienen valor real (no placeholder).
 * No imprime valores secretos.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

function loadDotEnvFile(relPath) {
  const p = path.join(ROOT, relPath)
  if (!fs.existsSync(p)) return false
  const raw = fs.readFileSync(p, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const idx = t.indexOf('=')
    if (idx < 0) continue
    const key = t.slice(0, idx).trim()
    let val = t.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = val
  }
  return true
}

function looksLikePlaceholder(v) {
  const t = String(v || '').trim()
  if (!t) return true
  if (/^\[.*\]$/.test(t)) return true
  if (/RELLENAR/i.test(t)) return true
  if (/your-.*-here/i.test(t)) return true
  if (/^https:\/\/square\.link\/\.\.\./i.test(t)) return true
  if (t === 'G-XXXXXXXXXX') return true
  return false
}

/** Variables que Cloudflare Pages suele necesitar para producción (ver docs/cloudflare-env-setup.md). */
const PRODUCTION_KEYS = [
  ['NEXT_PUBLIC_APP_URL', 'requerido'],
  ['NEXT_PUBLIC_GA_MEASUREMENT_ID', 'requerido'],
  ['MAILCHIMP_API_KEY', 'requerido'],
  ['MAILCHIMP_AUDIENCE_ID', 'requerido'],
  ['MAILCHIMP_SERVER', 'opcional si la API key termina en -usXX'],
  ['SQUARE_ACCESS_TOKEN', 'requerido checkout'],
  ['SQUARE_LOCATION_ID', 'requerido checkout'],
  ['NEXT_PUBLIC_SQUARE_APP_ID', 'requerido cliente Square'],
  ['NEXT_PUBLIC_SQUARE_LINK_REVISION_EXPRESS', 'links de pago públicos'],
  ['NEXT_PUBLIC_SQUARE_LINK_KIT_SNAP', 'links de pago públicos'],
  ['NEXT_PUBLIC_SQUARE_LINK_KIT_ITIN', 'links de pago públicos'],
]

function statusFor(key) {
  const v = process.env[key]
  if (!v || !String(v).trim()) return 'vacío'
  if (looksLikePlaceholder(v)) return 'placeholder'
  return 'ok'
}

function main() {
  const hasLocal = loadDotEnvFile('.env.local')
  loadDotEnvFile('.env')

  if (!hasLocal && !fs.existsSync(path.join(ROOT, '.env'))) {
    console.log('No se encontró .env.local ni .env — no hay qué revisar en disco.')
    process.exit(1)
  }

  let bad = 0
  for (const [key, note] of PRODUCTION_KEYS) {
    const s = statusFor(key)
    const icon = s === 'ok' ? '✓' : '✗'
    if (s !== 'ok') bad++
    console.log(`${icon} ${key.padEnd(42)} ${s.padEnd(12)} (${note})`)
  }

  console.log('')
  if (bad === 0) {
    console.log('Resumen: todas las claves listadas tienen valor no-placeholder en .env.local / .env')
  } else {
    console.log(`Resumen: ${bad} clave(s) vacías o con placeholder — revisa antes de comparar con Cloudflare.`)
    process.exit(1)
  }
}

main()
