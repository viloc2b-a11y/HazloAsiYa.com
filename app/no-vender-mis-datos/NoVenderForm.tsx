'use client'

import { useState } from 'react'

const STORAGE_KEY = 'haya_opt_out_share'

export default function NoVenderForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ email, savedAt: new Date().toISOString(), optOut: true }),
      )
    } catch {
      /* ignore */
    }
    const subject = encodeURIComponent('[HazloAsíYa] Opt-out compartición de datos (CCPA/CPRA)')
    const body = encodeURIComponent(
      `Confirmo que no deseo que se compartan mis datos personales con terceros en el futuro.\n\nEmail: ${email}\n\n---\nPágina: no-vender-mis-datos`,
    )
    window.location.href = `mailto:privacidad@hazloasiya.com?subject=${subject}&body=${body}`
    setDone(true)
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-cream bg-white p-6">
      <p className="text-sm text-gray-700 leading-relaxed">
        HazloAsíYa <strong>no vende</strong> datos personales. Esta página documenta tu preferencia de no compartición
        futura con terceros (transparencia hacia residentes de California bajo CCPA/CPRA y buenas prácticas generales).
      </p>
      <div>
        <label className="block text-sm font-semibold text-navy mb-1">Correo electrónico</label>
        <input
          type="email"
          name="opt_out_email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5"
        />
      </div>
      <button type="submit" className="btn-primary w-full py-3">
        Confirmar mi preferencia de privacidad
      </button>
      {done && (
        <p className="text-sm text-green font-medium">
          Preferencia registrada localmente y borrador de correo abierto. Conserva el envío para tus registros.
        </p>
      )}
    </form>
  )
}
