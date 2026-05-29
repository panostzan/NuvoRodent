'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[15px] font-medium text-[#0f172a] placeholder-[#cbd5e1] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-all'

export default function SetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    localStorage.setItem('repName', name.trim())
    localStorage.setItem('repEmail', email.trim())
    router.replace('/')
  }

  const ready = name.trim() && email.trim()

  return (
    <div className="flex flex-col justify-center flex-1 px-6">
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94a3b8] mb-3">Nuvo Rodent Guard</p>
        <h1 className="text-[28px] font-bold tracking-tight leading-tight mb-3 text-[#0f172a]">
          Set up your<br />sales profile
        </h1>
        <p className="text-[#64748b] font-medium text-[15px] leading-relaxed">
          Your name and email are saved to this device. You won't be asked again.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8]">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="John Smith" autoFocus className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8]">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com" className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={!ready}
          className="mt-2 rounded-2xl py-4 text-[15px] font-semibold text-white transition-opacity disabled:opacity-30 active:opacity-80"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', minHeight: 52, boxShadow: ready ? '0 4px 14px rgba(124,58,237,0.35)' : 'none' }}
        >
          Save &amp; Continue
        </button>
      </form>
    </div>
  )
}
