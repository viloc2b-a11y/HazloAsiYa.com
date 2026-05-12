'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { PdfFormMeta } from '@/types/pdf'
import PdfWizard from '@/components/pdf/PdfWizard'
import DocChecklist from '@/components/pdf/DocChecklist'
import { pdfUnlockStorageKey } from '@/lib/pdf-access'
import { withTrailingSlash } from '@/lib/site'
import { PRICE_MAIN } from '@/lib/pricing'

const tierLabels: Record<number, string> = {
  1: 'Inmigración federal',
  2: 'Beneficios y empleo',
  3: 'Identidad, consulado y escuela',
}

function PdfFormInner({ formMeta }: { formMeta: PdfFormMeta }) {
  const sp = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [unlock, setUnlock] = useState(false)

  useEffect(() => {
    const k = `haya_pdf_session_${formMeta.id}`
    let s = sessionStorage.getItem(k)
    if (!s) {
      s = crypto.randomUUID()
      sessionStorage.setItem(k, s)
    }
    setSessionId(s)

    const paid = sp.get('paid')
    if (paid === '1' || paid === 'true') {
      try {
        sessionStorage.setItem(pdfUnlockStorageKey(formMeta.slug), '1')
      } catch {
        /* ignore */
      }
      setUnlock(true)
    } else {
      try {
        setUnlock(sessionStorage.getItem(pdfUnlockStorageKey(formMeta.slug)) === '1')
      } catch {
        setUnlock(false)
      }
    }
  }, [formMeta.id, formMeta.slug, sp])

  if (!sessionId) {
    return (
      <main className="min-h-[40vh] flex items-center justify-center bg-stone-50 text-stone-500 text-sm" aria-busy="true">
        Cargando asistente…
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={withTrailingSlash('/')} className="text-white font-black text-lg">
            Hazlo<span className="text-emerald-400">AsíYa</span>
          </Link>
          <Link href={withTrailingSlash('/pdf')} className="text-stone-400 hover:text-white text-sm transition-colors">
            ← Todos los formularios
          </Link>
        </div>
      </div>

      <div className="bg-stone-900 text-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold bg-white/10 border border-white/20 text-emerald-400 px-3 py-1 rounded-full">
              TIER {formMeta.tier} · {tierLabels[formMeta.tier]}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{formMeta.icon}</span>
            <div>
              <h1 className="text-2xl font-black leading-tight mb-1">{formMeta.title}</h1>
              <p className="text-stone-400 text-sm">{formMeta.subtitle}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-mono bg-white/10 text-white px-2 py-0.5 rounded">{formMeta.formCode}</span>
                <span className="text-xs text-stone-400">{formMeta.agency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {unlock && (
        <div className="bg-teal-700 text-white">
          <div className="max-w-2xl mx-auto px-6 py-2.5 text-sm">
            Pago o acceso detectado en esta sesión — ya puedes completar y descargar el PDF.
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PdfWizard form={formMeta} sessionId={sessionId} initialPaid={unlock} />
          </div>

          <aside className="space-y-5">
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-black text-stone-900 mb-2">¿Para quién es?</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">{formMeta.who}</p>
              <div className="flex flex-wrap gap-1.5">
                {formMeta.tags.map(tag => (
                  <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-black text-stone-900 mb-4">Documentos que suelen pedir</h3>
              <DocChecklist docs={formMeta.docs} />
            </div>

            <div className="bg-teal-600 text-white rounded-2xl p-5">
              <div className="text-xs font-mono font-bold text-teal-200 mb-1">PRECIO</div>
              <div className="text-3xl font-black mb-1">{PRICE_MAIN}</div>
              <div className="text-teal-200 text-sm mb-4">
                Llena gratis — paga solo al descargar tu formulario oficial pre-llenado.
              </div>
              <ul className="text-sm space-y-1.5 text-teal-100">
                <li>✓ Formulario oficial listo para entregar</li>
                <li>✓ Checklist de documentos requeridos</li>
                <li>✓ Instrucciones exactas de entrega</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-teal-500 text-xs text-teal-200">
                ¿Varios trámites?
                <Link href={withTrailingSlash('/precios')} className="text-white underline ml-1 font-bold">
                  Ver precios
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
              ⚖️ HazloAsíYa NO es una agencia gubernamental ni bufete de abogados. Este formulario es un borrador orientativo. Revisa todos los campos antes de firmar y enviar.
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default function PdfFormClient({ formMeta }: { formMeta: PdfFormMeta }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 text-sm" aria-busy="true">
          Cargando…
        </main>
      }
    >
      <PdfFormInner formMeta={formMeta} />
    </Suspense>
  )
}
