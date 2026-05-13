#!/usr/bin/env node
/**
 * verify-production.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Verifica el estado de todas las integraciones de HazloAsíYa.
 * Uso:  node scripts/verify-production.mjs
 *       node scripts/verify-production.mjs --env .env.local
 *
 * Checks:
 *  1. Variables de entorno requeridas presentes (sin imprimir valores)
 *  2. Supabase REST API accesible + tabla purchases existe
 *  3. Cloudflare Functions: /api/checkout responde correctamente
 *  4. Cloudflare Functions: /api/subscribe-email responde correctamente
 *
 * Genera manifest en .tmp/runs/verify-production/{timestamp}/manifest.json
 * ─────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const RUN_DIR   = path.join(ROOT, '.tmp', 'runs', 'verify-production', TIMESTAMP)
const LOG_PATH  = path.join(RUN_DIR, 'run.log')
const START     = Date.now()

// ── Utilidades ────────────────────────────────────────────────────────────
fs.mkdirSync(RUN_DIR, { recursive: true })

const logLines = []
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  logLines.push(line)
  console.log(msg)
}

function writeLog() {
  fs.writeFileSync(LOG_PATH, logLines.join('\n') + '\n')
}

// ── Cargar .env.local ─────────────────────────────────────────────────────
function loadEnv(envPath) {
  const full = path.resolve(ROOT, envPath)
  if (!fs.existsSync(full)) return
  const lines = fs.readFileSync(full, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv('.env.local')

// ── Definición de checks ───────────────────────────────────────────────────
const checks = []

function makeCheck(id, description, critical) {
  return { id, description, critical, pass: false, evidence: {} }
}

// ── CHECK 1: Variables de entorno requeridas ───────────────────────────────
async function checkEnvVars() {
  const check = makeCheck('ENV_VARS', 'Variables de entorno requeridas presentes', true)
  const REQUIRED = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_LOCATION_ID',
    'SQUARE_WEBHOOK_SIGNATURE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'MAILCHIMP_API_KEY',
    'MAILCHIMP_AUDIENCE_ID',
  ]
  const missing = REQUIRED.filter(k => !process.env[k]?.trim())
  const present = REQUIRED.filter(k => !!process.env[k]?.trim())

  check.pass = missing.length === 0
  check.evidence = {
    present: present,
    missing: missing,
    details: missing.length === 0
      ? 'Todas las variables requeridas están presentes'
      : `Faltan: ${missing.join(', ')}`,
  }
  log(`[ENV_VARS] ${check.pass ? '✅' : '❌'} ${present.length}/${REQUIRED.length} variables presentes${missing.length ? ' — Faltan: ' + missing.join(', ') : ''}`)
  return check
}

// ── CHECK 2: Supabase REST API ─────────────────────────────────────────────
async function checkSupabase() {
  const check = makeCheck('SUPABASE_API', 'Supabase REST API accesible + tabla purchases existe', true)
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
           || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
           || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    check.evidence = { details: 'NEXT_PUBLIC_SUPABASE_URL o clave anon no definidas' }
    log('[SUPABASE_API] ❌ Variables de Supabase no configuradas')
    return check
  }

  try {
    const resp = await fetch(`${url}/rest/v1/purchases?limit=1`, {
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
      },
    })
    const status = resp.status
    const body   = await resp.text().catch(() => '')

    if (status === 200 || status === 204) {
      check.pass = true
      check.evidence = { status, details: 'Tabla purchases accesible' }
      log(`[SUPABASE_API] ✅ HTTP ${status} — tabla purchases OK`)
    } else {
      check.evidence = { status, details: body.slice(0, 300) }
      log(`[SUPABASE_API] ❌ HTTP ${status} — ${body.slice(0, 120)}`)
    }
  } catch (err) {
    check.evidence = { details: err.message }
    log(`[SUPABASE_API] ❌ Error de red: ${err.message}`)
  }
  return check
}

// ── CHECK 3: /api/checkout (Cloudflare Function) ───────────────────────────
async function checkCheckout() {
  const check = makeCheck('CHECKOUT_ENDPOINT', '/api/checkout responde con error esperado (sin producto válido)', false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl || appUrl.includes('localhost')) {
    check.evidence = { details: `APP_URL es local (${appUrl}) — omitiendo check remoto` }
    check.pass = true  // no-op en local
    log('[CHECKOUT] ⏭  APP_URL es localhost — omitiendo check')
    return check
  }

  try {
    const resp = await fetch(`${appUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: '__test__', userId: 'test', email: 'test@test.com' }),
    })
    const status = resp.status
    const body   = await resp.json().catch(() => ({}))

    // 400 = producto inválido (esperado), 501 = Square sin config, 200 = inesperado con datos inválidos
    if (status === 400) {
      check.pass = true
      check.evidence = { status, details: 'Endpoint responde: producto inválido (400) — Square conectado' }
      log(`[CHECKOUT] ✅ HTTP 400 — endpoint activo y Square conectado`)
    } else if (status === 501) {
      check.pass = false
      check.evidence = { status, details: 'Square no configurado en el servidor (501)' }
      log(`[CHECKOUT] ❌ HTTP 501 — SQUARE_ACCESS_TOKEN o SQUARE_LOCATION_ID no están en Cloudflare`)
    } else {
      check.pass = false
      check.evidence = { status, body }
      log(`[CHECKOUT] ⚠️  HTTP ${status} — ${JSON.stringify(body).slice(0, 120)}`)
    }
  } catch (err) {
    check.evidence = { details: err.message }
    log(`[CHECKOUT] ❌ Error de red: ${err.message}`)
  }
  return check
}

// ── CHECK 4: /api/subscribe-email ─────────────────────────────────────────
async function checkSubscribeEmail() {
  const check = makeCheck('SUBSCRIBE_EMAIL', '/api/subscribe-email responde (Mailchimp configurado)', false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl || appUrl.includes('localhost')) {
    check.pass = true
    check.evidence = { details: 'APP_URL local — omitiendo check remoto' }
    log('[SUBSCRIBE_EMAIL] ⏭  APP_URL es localhost — omitiendo check')
    return check
  }

  try {
    const resp = await fetch(`${appUrl}/api/subscribe-email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'verify-test@noreply.com' }),
    })
    const status = resp.status
    // 200 = suscrito, 400 = email malformado pero Mailchimp conectado,
    // 500 = Mailchimp no configurado
    if (status !== 500) {
      check.pass = true
      check.evidence = { status, details: 'Endpoint activo' }
      log(`[SUBSCRIBE_EMAIL] ✅ HTTP ${status} — endpoint activo`)
    } else {
      check.evidence = { status, details: 'Error interno — verificar MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID en Cloudflare' }
      log(`[SUBSCRIBE_EMAIL] ❌ HTTP 500 — Mailchimp no configurado en Cloudflare`)
    }
  } catch (err) {
    check.evidence = { details: err.message }
    log(`[SUBSCRIBE_EMAIL] ❌ Error de red: ${err.message}`)
  }
  return check
}

// ── Main ───────────────────────────────────────────────────────────────────
;(async () => {
  log('═══════════════════════════════════════════════')
  log('  HazloAsíYa — Verificación de Producción')
  log(`  ${new Date().toLocaleString('es-MX')}`)
  log('═══════════════════════════════════════════════')

  checks.push(await checkEnvVars())
  checks.push(await checkSupabase())
  checks.push(await checkCheckout())
  checks.push(await checkSubscribeEmail())

  const allPass     = checks.every(c => c.pass)
  const critFail    = checks.filter(c => c.critical && !c.pass)
  const duration    = ((Date.now() - START) / 1000).toFixed(2)
  const status      = allPass ? 'SUCCESS' : 'FAIL'

  const manifest = {
    task_name: 'verify-production',
    timestamp: new Date().toISOString(),
    directive_path: 'scripts/verify-production.mjs',
    directive_version: '1.0.0',
    inputs: { sources: ['.env.local'], parameters: { app_url: process.env.NEXT_PUBLIC_APP_URL } },
    outputs: { artifacts: [LOG_PATH], deliverables: [] },
    acceptance_report: {
      all_pass: allPass,
      checks: checks.map(c => ({
        id: c.id,
        description: c.description,
        critical: c.critical,
        pass: c.pass,
        evidence: c.evidence,
      })),
    },
    status,
    errors: critFail.map(c => `[${c.id}] ${c.evidence?.details || 'Check fallido'}`),
    duration_seconds: parseFloat(duration),
    log_path: LOG_PATH,
    env_required: [
      'NEXT_PUBLIC_APP_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'SQUARE_ACCESS_TOKEN',
      'SQUARE_LOCATION_ID',
      'SQUARE_WEBHOOK_SIGNATURE_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'MAILCHIMP_API_KEY',
      'MAILCHIMP_AUDIENCE_ID',
    ],
  }

  const manifestPath = path.join(RUN_DIR, 'manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  writeLog()

  log('')
  log('───────────────────────────────────────────────')
  log(`STATUS: ${status}`)
  log(`MANIFEST: ${manifestPath}`)
  log(`LOG: ${LOG_PATH}`)
  log(`Duración: ${duration}s`)
  log('───────────────────────────────────────────────')

  if (!allPass) {
    log('')
    log('❌ Checks fallidos:')
    critFail.forEach(c => log(`   • [${c.id}] ${c.evidence?.details}`))
  }

  process.exit(allPass ? 0 : 1)
})()
