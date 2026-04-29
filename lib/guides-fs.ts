import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { guideSchema, type GuideFrontmatter } from '@/src/content/config'

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')

function listGuideFiles(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return []
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.md') && f !== '_template.md')
}

export function getPublishedGuideSlugs(): string[] {
  const slugs: string[] = []
  for (const file of listGuideFiles()) {
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8')
    const { data } = matter(raw)
    if (data.draft === true) continue
    slugs.push(file.replace(/\.md$/i, ''))
  }
  return slugs
}

export function getAllGuidesForIndex(): { slug: string; title: string; description: string; category: string }[] {
  const out: { slug: string; title: string; description: string; category: string }[] = []
  for (const file of listGuideFiles()) {
    const slug = file.replace(/\.md$/i, '')
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8')
    const { data } = matter(raw)
    if (data.draft === true) continue
    const parsed = guideSchema.safeParse(data)
    if (!parsed.success) continue
    out.push({
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
    })
  }
  return out.sort((a, b) => a.title.localeCompare(b.title, 'es'))
}

export function loadPublishedGuide(slug: string): { data: GuideFrontmatter; content: string } | null {
  const safe = slug.replace(/[^a-z0-9-]/gi, '')
  if (safe !== slug) return null
  const filePath = path.join(GUIDES_DIR, `${safe}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const parsed = guideSchema.safeParse(data)
  if (!parsed.success) return null
  if (parsed.data.draft) return null
  return { data: parsed.data, content }
}
