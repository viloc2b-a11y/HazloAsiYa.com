#!/usr/bin/env node
/**
 * Guías en content/guides: si dataValidUntil < hoy, aviso en consola;
 * con --create-issue y GITHUB_TOKEN (p. ej. en GitHub Actions), crea un issue por guía vía API REST.
 *
 *   node scripts/content-expiry.mjs
 *   node scripts/content-expiry.mjs --create-issue
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const GUIDES_DIR = path.join(ROOT, 'content', 'guides')

async function createIssueApi(owner, repo, token, title, body, assignees) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title,
      body,
      assignees: assignees.filter(Boolean),
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub API ${res.status}: ${text}`)
  }
  return res.json()
}

async function main() {
  const createIssue = process.argv.includes('--create-issue')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const funnelPage = path.join(ROOT, 'app', '[funnel]', 'page.tsx')
  if (fs.existsSync(funnelPage)) {
    const fp = fs.readFileSync(funnelPage, 'utf8')
    if (!fp.includes('dataValidUntil')) {
      console.log(
        '[content-expiry] INFO: app/[funnel]/page.tsx aún sin dataValidUntil en metadata — vigencia principal en content/guides (Markdown).',
      )
    }
  }

  if (!fs.existsSync(GUIDES_DIR)) {
    console.warn(
      '[content-expiry] WARN: no existe content/guides — no hay fechas regulatorias en markdown.',
    )
    process.exit(0)
  }

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md') && f !== '_template.md')
  const expired = []

  for (const f of files) {
    const p = path.join(GUIDES_DIR, f)
    const md = fs.readFileSync(p, 'utf8')
    let data
    try {
      data = matter(md).data
    } catch {
      continue
    }
    const dv = data.dataValidUntil
    if (typeof dv !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dv)) continue
    const until = new Date(`${dv}T12:00:00`)
    if (until < today) {
      const guideTitle =
        typeof data.title === 'string' && data.title.trim() ? data.title.trim() : f.replace(/\.md$/i, '')
      expired.push({
        file: f,
        path: p,
        dataValidUntil: dv,
        lastVerified: data.lastVerified || null,
        guideTitle,
      })
    }
  }

  if (expired.length === 0) {
    console.log('[content-expiry] OK: ningún dataValidUntil vencido en guías.')
    process.exit(0)
  }

  for (const e of expired) {
    console.warn(
      `[content-expiry] Vencido: ${e.file} — dataValidUntil ${e.dataValidUntil} — ${e.guideTitle}`,
    )
  }

  if (!createIssue) {
    process.exit(0)
  }

  const token = process.env.GITHUB_TOKEN
  const repoFull = process.env.GITHUB_REPOSITORY
  const assignee = process.env.GITHUB_ASSIGNEE || ''

  if (!token || !repoFull) {
    console.warn('[content-expiry] WARN: GITHUB_TOKEN o GITHUB_REPOSITORY ausente — no se crearon issues.')
    process.exit(0)
  }

  const [owner, repo] = repoFull.split('/')
  if (!owner || !repo) {
    console.warn('[content-expiry] WARN: GITHUB_REPOSITORY inválido.')
    process.exit(0)
  }

  const assignees = assignee ? [assignee] : []

  for (const e of expired) {
    const title = `⚠️ Contenido expirado: ${e.guideTitle}`
    const body = [
      `La guía \`content/guides/${e.file}\` tiene **dataValidUntil** (${e.dataValidUntil}) anterior a hoy.`,
      '',
      `- lastVerified en frontmatter: ${e.lastVerified || 'n/a'}`,
      '',
      'Revisar fuentes regulatorias y actualizar fechas y contenido.',
      '',
      '_Generado por scripts/content-expiry.mjs_',
    ].join('\n')

    try {
      await createIssueApi(owner, repo, token, title, body, assignees)
      console.log(`[content-expiry] Issue creado: ${title}`)
    } catch (err) {
      if (assignees.length) {
        try {
          await createIssueApi(owner, repo, token, title, body, [])
          console.log(`[content-expiry] Issue creado (sin asignatario): ${title}`)
        } catch (err2) {
          console.error(`[content-expiry] Fallo API: ${err2.message || err2}`)
        }
      } else {
        console.error(`[content-expiry] Fallo API: ${err.message || err}`)
      }
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
