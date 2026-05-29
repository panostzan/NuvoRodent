'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-3.5 text-[15px] text-[#111] placeholder-[#bbb] outline-none focus:border-[#6d28d9] transition-colors'

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
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#aaa] mb-3">Nuvo Rodent Guard</p>
        <h1 className="text-[28px] font-bold tracking-tight leading-tight mb-3 text-[#111]">
          Set up your<br />sales profile
        </h1>
        <p className="text-[#888] text-[15px] leading-relaxed">
          Your name and email are saved to this device. You won't be asked again.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-[#aaa]">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            autoFocus
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-[#aaa]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="mt-3 rounded-lg py-4 text-[15px] font-semibold text-white transition-opacity disabled:opacity-30 active:opacity-80"
          style={{ background: '#6d28d9', minHeight: 52 }}
        >
          Save &amp; Continue
        </button>
      </form>

    </div>
  )
}
