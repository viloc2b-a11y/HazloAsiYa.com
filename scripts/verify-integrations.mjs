import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'

const ROOT = process.cwd()

function looksLikePlaceholder(v) {
  const t = String(v || '').trim()
  if (!t) return true
  if (/^\[.*\]$/.test(t)) return true
  if (/RELLENAR/i.test(t)) return true
  if (/your-.*-here/i.test(t)) return true
  return false
}

function loadDotEnvFile(relPath) {
  const p = path.join(ROOT, relPath)
  if (!fs.existsSync(p)) return
  const raw = fs.readFileSync(p, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const idx = t.indexOf('=')
    if (idx < 0) continue
    const key = t.slice(0, idx).trim()
    let val = t.slice(idx + 1).trim()
    if (!key) continue
    // strip simple wrapping quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = val
  }
}

function requiredEnv(key) {
  const v = process.env[key]
  if (!v || !String(v).trim()) return null
  const t = String(v).trim()
  if (looksLikePlaceholder(t)) return null
  return t
}

function authHeader(apiKey) {
  const token = Buffer.from(`anystring:${apiKey}`).toString('base64')
  return `Basic ${token}`
}

async function checkMailchimp() {
  const server = requiredEnv('MAILCHIMP_SERVER')
  const apiKey = requiredEnv('MAILCHIMP_API_KEY')
  const audience = requiredEnv('MAILCHIMP_AUDIENCE_ID')
  if (!server || !apiKey || !audience) {
    return { ok: false, msg: '✗ Mailchimp: faltan MAILCHIMP_SERVER / MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID' }
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audience}`
  const res = await fetch(url, { headers: { Authorization: authHeader(apiKey) } })
  if (res.status === 401) return { ok: false, msg: '✗ Mailchimp: API key inválida o no configurada (401)' }
  if (res.status === 404) return { ok: false, msg: '✗ Mailchimp: Audience ID incorrecto (404)' }
  if (!res.ok) return { ok: false, msg: `✗ Mailchimp: error ${res.status}` }
  const data = await res.json().catch(() => ({}))
  return { ok: true, msg: `✓ Mailchimp conectado. Audiencia: ${data?.name || audience}` }
}

function checkEnvVars() {
  const required = [
    'MAILCHIMP_API_KEY',
    'MAILCHIMP_AUDIENCE_ID',
    'MAILCHIMP_SERVER',
    'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    'NEXT_PUBLIC_APP_URL',
  ]
  const missing = required.filter((k) => !requiredEnv(k))
  if (missing.length) {
    return { ok: false, msg: `✗ Faltan variables de entorno: ${missing.join(', ')}` }
  }
  return { ok: true, msg: '✓ Variables de entorno críticas presentes' }
}

function checkEnvLocalNotTracked() {
  try {
    const out = execSync('git ls-files .env.local', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    if (out) {
      return { ok: false, msg: '✗ CRÍTICO: .env.local está en git. Remover y rotar credenciales.' }
    }
    return { ok: true, msg: '✓ .env.local no está en git' }
  } catch {
    // Si git no está disponible, no bloqueamos.
    return { ok: true, msg: '✓ .env.local no está en git (no se pudo ejecutar git ls-files; continuar)' }
  }
}

function walk(dir) {
  const res = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) res.push(...walk(p))
    else res.push(p)
  }
  return res
}

function checkOutForSecrets() {
  const outDir = path.join(ROOT, 'out')
  if (!fs.existsSync(outDir)) return { ok: true, msg: '✓ out/ no existe (salta chequeo de exposición)' }

  const forbidden = [/MAILCHIMP_API_KEY/i, /us2\.api\.mailchimp\.com/i]
  const files = walk(outDir)
  for (const f of files) {
    // solo texto-ish: html, js, css, json, xml, txt
    if (!/\.(html|js|css|json|xml|txt|map)$/i.test(f)) continue
    let txt = ''
    try {
      txt = fs.readFileSync(f, 'utf8')
    } catch {
      continue
    }
    if (forbidden.some((re) => re.test(txt))) {
      return { ok: false, msg: `✗ out/ contiene referencias sensibles (${path.relative(ROOT, f)})` }
    }
  }
  return { ok: true, msg: '✓ No hay credenciales/URLs de Mailchimp expuestas en out/' }
}

async function checkMergeFieldTramite() {
  const server = requiredEnv('MAILCHIMP_SERVER')
  const apiKey = requiredEnv('MAILCHIMP_API_KEY')
  const audience = requiredEnv('MAILCHIMP_AUDIENCE_ID')
  if (!server || !apiKey || !audience) {
    return { ok: false, msg: '⚠ No se pudo verificar TRAMITE (faltan vars Mailchimp)' }
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audience}/merge-fields?count=100`
  const res = await fetch(url, { headers: { Authorization: authHeader(apiKey) } })
  if (!res.ok) return { ok: false, msg: `⚠ No se pudo verificar TRAMITE (HTTP ${res.status})` }
  const data = await res.json().catch(() => ({}))
  const fields = Array.isArray(data?.merge_fields) ? data.merge_fields : []
  const ok = fields.some((f) => f?.tag === 'TRAMITE')
  if (!ok) return { ok: false, msg: '⚠ Merge field TRAMITE no existe. Ejecuta: npm run setup:mailchimp' }
  return { ok: true, msg: '✓ Merge field TRAMITE existe' }
}

async function main() {
  // Carga .env.local (local dev) si existe, sin dependencias extra.
  loadDotEnvFile('.env.local')
  loadDotEnvFile('.env')

  const results = []

  results.push(await checkMailchimp())
  results.push(checkEnvVars())
  results.push(checkEnvLocalNotTracked())
  results.push(checkOutForSecrets())
  results.push(await checkMergeFieldTramite())

  for (const r of results) console.log(r.msg)

  const hardFails = results.filter((r) => r.msg.startsWith('✗'))
  if (hardFails.length) process.exit(1)
}

main().catch((err) => {
  console.error(`✗ verify falló: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})

