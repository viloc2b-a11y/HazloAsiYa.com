'use client'

import { useEffect, useRef, useState } from 'react'

type PagefindUiInstance = {
  destroy?: () => void
  triggerSearch?: (query: string) => void
}

/**
 * UI de búsqueda Pagefind. El índice se genera en post-build (`pagefind --site out`)
 * y queda en `/pagefind/`. En `next dev` no existe el bundle: se muestra aviso.
 */
export default function PagefindSearch() {
  const mounted = useRef(false)
  const instanceRef = useRef<PagefindUiInstance | null>(null)
  const [showDevHint, setShowDevHint] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    mounted.current = true
    let cancelled = false

    async function init() {
      if (process.env.NODE_ENV === 'development') {
        setShowDevHint(true)
        return
      }

      try {
        await import('@pagefind/default-ui/css/ui.css')
        const { PagefindUI } = await import('@pagefind/default-ui')
        if (cancelled || !mounted.current) return

        const ui = new PagefindUI({
          element: '#buscar-pagefind-root',
          bundlePath: '/pagefind/',
          showSubResults: true,
        }) as PagefindUiInstance

        instanceRef.current = ui

        const q = new URLSearchParams(window.location.search).get('q')
        if (q?.trim() && typeof ui.triggerSearch === 'function') {
          ui.triggerSearch(q.trim())
        }
      } catch {
        if (mounted.current) setLoadError(true)
      }
    }

    void init()

    return () => {
      cancelled = true
      mounted.current = false
      instanceRef.current?.destroy?.()
      instanceRef.current = null
    }
  }, [])

  return (
    <div className="space-y-4">
      {showDevHint && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 text-amber-950 text-sm p-4 leading-relaxed">
          En desarrollo (<code className="text-xs bg-white/80 px-1 rounded">npm run dev</code>) no está el índice
          Pagefind. Ejecuta <code className="text-xs bg-white/80 px-1 rounded">npm run build</code> y sirve{' '}
          <code className="text-xs bg-white/80 px-1 rounded">out/</code> para probar la búsqueda, o despliega en
          preview.
        </p>
      )}
      {loadError && (
        <p className="rounded-xl border border-red-200 bg-red-50 text-red-900 text-sm p-4">
          No se pudo cargar la búsqueda. Comprueba que el build incluyó{' '}
          <code className="text-xs">pagefind --site out</code> y que existe <code className="text-xs">/pagefind/</code>{' '}
          en el sitio publicado.
        </p>
      )}
      <div
        id="buscar-pagefind-root"
        className="pagefind-root min-h-[140px] [&_.pagefind-ui\_\_svelte]:max-w-none"
      />
    </div>
  )
}
