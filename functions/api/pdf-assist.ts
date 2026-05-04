import { runPdfFieldAssist } from '../../lib/pdf-field-assist'
import type { PdfAssistRequest, PdfAssistResponse } from '../../types/pdf'

type Env = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
}

type PagesFunction<E = unknown> = (context: { request: Request; env: E }) => Promise<Response>

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export const onRequestPost: PagesFunction<Env> = async context => {
  try {
    const apiKey = context.env.OPENAI_API_KEY
    if (!apiKey) return json({ answer: 'Falta configurar OPENAI_API_KEY en el servidor.' } satisfies PdfAssistResponse, 500)

    let body: PdfAssistRequest
    try {
      body = (await context.request.json()) as PdfAssistRequest
    } catch {
      return json({ answer: 'Solicitud inválida.' } satisfies PdfAssistResponse, 400)
    }

    if (!body.formId || !body.fieldId || !String(body.question || '').trim()) {
      return json({ answer: 'Faltan datos para responder.' } satisfies PdfAssistResponse, 400)
    }

    const question = String(body.question).trim().slice(0, 500)
    const result = await runPdfFieldAssist(
      { ...body, question },
      { apiKey, model: context.env.OPENAI_MODEL },
    )
    return json(result)
  } catch (e: unknown) {
    return json(
      { answer: e instanceof Error ? e.message : 'Error al consultar el asistente.' } satisfies PdfAssistResponse,
      500,
    )
  }
}
