import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

function requiredEnv(key) {
  const v = process.env[key]
  if (!v || !String(v).trim()) throw new Error(`Missing env: ${key}`)
  return String(v).trim()
}

function authHeader(apiKey) {
  const token = Buffer.from(`anystring:${apiKey}`).toString('base64')
  return `Basic ${token}`
}

async function mailchimpFetch(path, init) {
  const server = requiredEnv('MAILCHIMP_SERVER')
  const apiKey = requiredEnv('MAILCHIMP_API_KEY')
  const url = `https://${server}.api.mailchimp.com/3.0${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: authHeader(apiKey),
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const text = await res.text().catch(() => '')
  const json = text ? JSON.parse(text) : null
  return { res, json }
}

async function main() {
  const audience = requiredEnv('MAILCHIMP_AUDIENCE_ID')

  const { res: listRes, json: listJson } = await mailchimpFetch(`/lists/${audience}`, { method: 'GET' })
  if (!listRes.ok) {
    throw new Error(`Mailchimp list check failed: ${listRes.status} ${listJson?.title || ''} ${listJson?.detail || ''}`.trim())
  }
  console.log(`✓ Mailchimp conectado. Audiencia: ${listJson?.name || audience}`)

  const { res: mfRes, json: mfJson } = await mailchimpFetch(`/lists/${audience}/merge-fields?count=100`, {
    method: 'GET',
  })
  if (!mfRes.ok) {
    throw new Error(`Merge fields fetch failed: ${mfRes.status} ${mfJson?.title || ''} ${mfJson?.detail || ''}`.trim())
  }

  const fields = Array.isArray(mfJson?.merge_fields) ? mfJson.merge_fields : []
  const hasTramite = fields.some((f) => f?.tag === 'TRAMITE')
  if (hasTramite) {
    console.log('✓ Merge field TRAMITE ya existe')
    return
  }

  const { res: createRes, json: createJson } = await mailchimpFetch(`/lists/${audience}/merge-fields`, {
    method: 'POST',
    body: JSON.stringify({ tag: 'TRAMITE', name: 'Trámite de interés', type: 'text' }),
  })
  if (!createRes.ok) {
    throw new Error(`No se pudo crear TRAMITE: ${createRes.status} ${createJson?.title || ''} ${createJson?.detail || ''}`.trim())
  }
  console.log('✓ Merge field TRAMITE creado')
}

main().catch((err) => {
  console.error(`✗ setup:mailchimp falló: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})

