'use client'

import { useState } from 'react'
import type { DocRequirement } from '@/types/pdf'

interface DocChecklistProps {
  docs: DocRequirement[]
  onChange?: (checked: Record<string, boolean>) => void
}

const CATEGORY_LABELS: Record<DocRequirement['category'], { label: string; color: string }> = {
  identity: { label: 'Identidad', color: 'bg-blue-100 text-blue-800' },
  address: { label: 'Domicilio', color: 'bg-green-100 text-green-800' },
  income: { label: 'Ingresos', color: 'bg-yellow-100 text-yellow-800' },
  nationality: { label: 'Nacionalidad', color: 'bg-red-100 text-red-800' },
  health: { label: 'Salud', color: 'bg-purple-100 text-purple-800' },
  other: { label: 'Otro', color: 'bg-stone-100 text-stone-700' },
}

export default function DocChecklist({ docs, onChange }: DocChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const required = docs.filter(d => d.required)
  const optional = docs.filter(d => !d.required)
  const allRequiredChecked = required.every(d => checked[d.id])
  const checkedCount = Object.values(checked).filter(Boolean).length

  function toggle(id: string) {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    onChange?.(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
        <div className="text-sm font-semibold text-stone-700">
          {checkedCount} de {docs.length} documentos marcados
        </div>
        {allRequiredChecked ? (
          <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded-full">✓ Requeridos listos</span>
        ) : (
          <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-full">
            {required.filter(d => !checked[d.id]).length} requeridos pendientes
          </span>
        )}
      </div>

      {required.length > 0 && (
        <div>
          <div className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wide mb-2">Documentos requeridos</div>
          <div className="space-y-2">
            {required.map(doc => (
              <DocItem key={doc.id} doc={doc} checked={!!checked[doc.id]} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}

      {optional.length > 0 && (
        <div>
          <div className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wide mb-2">
            Documentos opcionales / alternativos
          </div>
          <div className="space-y-2">
            {optional.map(doc => (
              <DocItem key={doc.id} doc={doc} checked={!!checked[doc.id]} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
        💡 Lleva los documentos <strong>originales</strong> cuando la agencia lo exija. Si falta alguno, pregunta en la oficina por alternativas aceptadas.
      </div>
    </div>
  )
}

function DocItem({
  doc,
  checked,
  onToggle,
}: {
  doc: DocRequirement
  checked: boolean
  onToggle: (id: string) => void
}) {
  const cat = CATEGORY_LABELS[doc.category]

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
        checked ? 'border-teal-400 bg-teal-50' : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
      onClick={() => onToggle(doc.id)}
    >
      <div
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'border-teal-500 bg-teal-500' : 'border-stone-300 bg-white'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${checked ? 'text-teal-900 line-through decoration-teal-400' : 'text-stone-800'}`}
          >
            {doc.label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
          {doc.required && (
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Requerido</span>
          )}
        </div>
        {doc.note && <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{doc.note}</p>}
      </div>
    </div>
  )
}
