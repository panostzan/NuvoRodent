'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice } from '@/lib/pricing'

function Counter({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-[15px] font-medium text-[#0f172a]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base font-semibold transition-opacity disabled:opacity-20 active:opacity-50 text-[#475569]"
          style={{ background: '#e2e8f0' }}
        >
          −
        </button>
        <span className="text-[16px] font-bold w-6 text-center tabular-nums text-[#0f172a]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base font-semibold active:opacity-70 text-white"
          style={{ background: '#7c3aed' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8] mb-2.5">{children}</p>
)

const inputClass =
  'w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[15px] font-medium text-[#0f172a] placeholder-[#cbd5e1] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-all'

export default function FormPage() {
  const router = useRouter()
  const [repName, setRepName] = useState(null)
  const [repEmail, setRepEmail] = useState(null)

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [shortSides, setShortSides] = useState(1)
  const [longSides, setLongSides] = useState(1)
  const [stories, setStories] = useState(1)
  const [roofPitch, setRoofPitch] = useState(0)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [comments, setComments] = useState('')

  const pricing = calculatePrice(shortSides, longSides, stories)

  useEffect(() => {
    const savedName = localStorage.getItem('repName')
    const savedEmail = localStorage.getItem('repEmail')
    if (!savedName || !savedEmail) {
      router.replace('/setup')
    } else {
      setRepName(savedName)
      setRepEmail(savedEmail)
    }
  }, [router])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!address.trim() || !clientName.trim() || !clientEmail.trim()) return

      const data = {
        address: address.trim(),
        city: city.trim(),
        shortSides,
        longSides,
        stories,
        roofPitch,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        comments: comments.trim(),
        repEmail,
        preGST: pricing.preGST,
        priceWithGST: pricing.priceWithGST,
        commission: pricing.commission,
        repName,
      }

      sessionStorage.setItem('pendingSubmission', JSON.stringify(data))
      router.push('/confirm')
    },
    [address, city, shortSides, longSides, stories, roofPitch, clientName, clientPhone, clientEmail, comments, pricing, repName, router]
  )

  if (repName === null) return null

  return (
    <div className="flex flex-col flex-1 pb-10">

      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94a3b8] mb-0.5">Nuvo</p>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0f172a]">Rodent Guard</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('repName')
            localStorage.removeItem('repEmail')
            router.push('/setup')
          }}
          className="flex flex-col items-end active:opacity-50"
        >
          <span className="text-[13px] font-semibold text-[#0f172a]">{repName}</span>
          <span className="text-[11px] text-[#94a3b8]">tap to change</span>
        </button>
      </div>

      <div className="h-px bg-[#e2e8f0] mx-5 mb-6" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-5 pb-10">

        {/* Property */}
        <div>
          <SectionLabel>Property</SectionLabel>
          <div className="flex flex-col gap-2">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address" className={inputClass} required />
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="City" className={inputClass} />
          </div>
        </div>

        {/* Configuration */}
        <div>
          <SectionLabel>Configuration</SectionLabel>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] px-4 divide-y divide-[#f1f5f9]"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Counter label="Short Sides" value={shortSides} onChange={setShortSides} min={0} />
            <Counter label="Long Sides" value={longSides} onChange={setLongSides} min={0} />
            <Counter label="Stories" value={stories} onChange={setStories} min={1} />
            <Counter label="Roof Pitch" value={roofPitch} onChange={setRoofPitch} min={0} />
          </div>
        </div>

        {/* Price */}
        <div>
          <SectionLabel>Estimate</SectionLabel>
          <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="bg-white px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">With GST</p>
                <p className="text-[36px] font-bold tracking-tight leading-none" style={{ color: '#7c3aed' }}>
                  ${pricing.priceWithGST.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">Pre-GST</p>
                <p className="text-[20px] font-bold text-[#334155]">${pricing.preGST.toFixed(2)}</p>
                <p className="text-[12px] font-medium text-[#94a3b8] mt-0.5">
                  Commission ${pricing.commission.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-[#475569]">Truck Roll</p>
                <p className="text-[11px] text-[#94a3b8]">+$300 if no local trucks</p>
              </div>
              <p className="text-[18px] font-bold text-[#475569]">${(pricing.priceWithGST + 300).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Client */}
        <div>
          <SectionLabel>Client</SectionLabel>
          <div className="flex flex-col gap-2">
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
              placeholder="Full name" className={inputClass} required />
            <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Phone (optional)" className={inputClass} />
            <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email address" className={inputClass} required />
            <textarea value={comments} onChange={(e) => setComments(e.target.value)}
              placeholder="Additional comments (optional)" rows={3}
              className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-2xl py-4 text-[16px] font-semibold text-white active:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', minHeight: 56, boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
        >
          Review &amp; Send Contract
        </button>

      </form>
    </div>
  )
}
