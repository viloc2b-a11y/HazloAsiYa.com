export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
             style={{ background: 'rgba(10,158,82,.12)' }}>
          <div className="w-7 h-7 rounded-full" style={{ background: 'var(--green)' }}/>
        </div>
        <div className="font-serif text-xl" style={{ color: 'var(--navy)' }}>Cargando…</div>
      </div>
    </div>
  )
}
