import OpenAI from 'openai'
import type { PdfAssistRequest, PdfAssistResponse } from '@/types/pdf'
import { PDF_CATALOG } from '@/types/pdf'

export async function runPdfFieldAssist(
  req: PdfAssistRequest,
  args: { apiKey: string; model?: string },
): Promise<PdfAssistResponse> {
  const meta = PDF_CATALOG.find(f => f.id === req.formId)
  const client = new OpenAI({ apiKey: args.apiKey })
  const model = args.model?.trim() || 'gpt-4.1-mini'
  const lang = req.lang === 'en' ? 'English' : 'Spanish'

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: [
          `You help people fill U.S. government forms. Reply in clear ${lang}.`,
          'Do not provide legal advice. If the user may need a lawyer, say so briefly.',
          'Keep under 120 words. Prefer bullet steps when listing documents.',
        ].join(' '),
      },
      {
        role: 'user',
        content: [
          `Form: ${meta?.title ?? req.formId} (${meta?.agency ?? ''})`,
          `Field focus: ${req.fieldId}`,
          `Question: ${req.question}`,
          `Context (JSON, may be partial): ${JSON.stringify(req.context ?? {}).slice(0, 3500)}`,
        ].join('\n'),
      },
    ],
  })

  const answer = completion.choices[0]?.message?.content?.trim() || 'No response.'
  return { answer }
}
