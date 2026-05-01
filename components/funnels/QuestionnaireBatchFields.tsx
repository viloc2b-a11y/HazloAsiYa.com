'use client'

import type { QuestionnaireField } from '@/types/ai'

type Props = {
  fields: QuestionnaireField[]
  formData: Record<string, string>
  onUpdate: (key: string, value: string) => void
}

function parseMulti(raw: string | undefined): string[] {
  if (!raw) return []
  try {
    const p = JSON.parse(raw) as unknown
    return Array.isArray(p) ? p.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export default function QuestionnaireBatchFields({ fields, formData, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      {fields.map(field => (
        <div key={field.id}>
          <label className="label">
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
          </label>
          {field.hint ? <p className="text-gray-500 text-xs mb-2">{field.hint}</p> : null}

          {field.type === 'text' && (
            <input
              className="input"
              type="text"
              value={formData[field.id] || ''}
              onChange={e => onUpdate(field.id, e.target.value)}
              autoComplete="off"
            />
          )}

          {(field.type === 'number' || field.type === 'currency') && (
            <div className="relative">
              {field.type === 'currency' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              )}
              <input
                className={`input ${field.type === 'currency' ? 'pl-7' : ''}`}
                type="text"
                inputMode="decimal"
                placeholder={field.type === 'currency' ? '0' : ''}
                value={formData[field.id] || ''}
                onChange={e => onUpdate(field.id, e.target.value.replace(/[^\d.,]/g, ''))}
              />
            </div>
          )}

          {field.type === 'date' && (
            <input
              className="input"
              type="date"
              value={formData[field.id] || ''}
              onChange={e => onUpdate(field.id, e.target.value)}
            />
          )}

          {field.type === 'boolean' && (
            <div className="space-y-2">
              {(
                [
                  ['yes', 'Sí'],
                  ['no', 'No'],
                ] as const
              ).map(([val, label]) => (
                <label
                  key={val}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData[field.id] === val ? 'border-green bg-green/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={field.id}
                    checked={formData[field.id] === val}
                    onChange={() => onUpdate(field.id, val)}
                    className="mt-0.5 accent-green shrink-0"
                  />
                  <span className="font-semibold text-navy text-sm">{label}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === 'enum' && field.options && (
            <div className="space-y-2">
              {field.options.map(opt => (
                <label
                  key={opt}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData[field.id] === opt ? 'border-green bg-green/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={field.id}
                    checked={formData[field.id] === opt}
                    onChange={() => onUpdate(field.id, opt)}
                    className="mt-0.5 accent-green shrink-0"
                  />
                  <span className="font-semibold text-navy text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === 'multiselect' && field.options && (
            <div className="space-y-2 bg-cream-2 border border-cream rounded-xl p-4">
              {field.options.map(opt => {
                const selected = parseMulti(formData[field.id])
                const checked = selected.includes(opt)
                return (
                  <label
                    key={opt}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      checked ? 'border-green bg-green/5' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked ? selected.filter(x => x !== opt) : [...selected, opt]
                        onUpdate(field.id, JSON.stringify(next))
                      }}
                      className="mt-0.5 accent-green shrink-0"
                    />
                    <span className="text-navy text-sm">{opt}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function isQuestionnaireBatchComplete(fields: QuestionnaireField[], formData: Record<string, string>): boolean {
  for (const f of fields) {
    if (!f.required) continue
    const raw = formData[f.id]
    if (raw === undefined || String(raw).trim() === '') return false
    if (f.type === 'multiselect') {
      const arr = parseMulti(raw)
      if (arr.length === 0) return false
    }
  }
  return true
}

export function formatQuestionnaireValue(field: QuestionnaireField, raw: string): string {
  if (field.type === 'multiselect') {
    const arr = parseMulti(raw)
    return arr.length ? arr.join(', ') : '—'
  }
  if (field.type === 'boolean') {
    if (raw === 'yes') return 'Sí'
    if (raw === 'no') return 'No'
  }
  return raw && raw.trim() !== '' ? raw : '—'
}
