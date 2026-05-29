'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice } from '@/lib/pricing'

function Counter({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-[15px] text-[#111]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-medium transition-opacity disabled:opacity-25 active:opacity-60"
          style={{ background: '#ebebeb' }}
        >
          −
        </button>
        <span className="text-[15px] font-semibold w-5 text-center tabular-nums text-[#111]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-medium active:opacity-70 text-white"
          style={{ background: '#6d28d9' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#aaa] mb-3">{children}</p>
)

const inputClass =
  'w-full bg-white border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-[15px] text-[#111] placeholder-[#bbb] outline-none focus:border-[#6d28d9] transition-colors'

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
      <div className="px-5 pt-6 pb-5 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#aaa] mb-1">Nuvo</p>
          <h1 className="text-2xl font-bold tracking-tight text-[#111]">Rodent Guard</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('repName')
            localStorage.removeItem('repEmail')
            router.push('/setup')
          }}
          className="flex flex-col items-end gap-0.5 active:opacity-60"
        >
          <span className="text-[13px] font-medium text-[#111] leading-tight">{repName}</span>
          <span className="text-[11px] text-[#aaa]">tap to change</span>
        </button>
      </div>

      <div className="h-px bg-[#ebebeb] mx-5" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-5 pt-7">

        {/* Property */}
        <div>
          <SectionLabel>Property</SectionLabel>
          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              className={inputClass}
              required
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={inputClass}
            />
          </div>
        </div>

        {/* Configuration */}
        <div>
          <SectionLabel>Configuration</SectionLabel>
          <div className="bg-white rounded-xl border border-[#e0e0e0] px-4 divide-y divide-[#ebebeb]">
            <Counter label="Short Sides" value={shortSides} onChange={setShortSides} min={0} />
            <Counter label="Long Sides" value={longSides} onChange={setLongSides} min={0} />
            <Counter label="Stories" value={stories} onChange={setStories} min={1} />
            <Counter label="Roof Pitch" value={roofPitch} onChange={setRoofPitch} min={0} />
          </div>
        </div>

        {/* Price */}
        <div>
          <SectionLabel>Estimate</SectionLabel>
          <div className="bg-white rounded-xl border border-[#e0e0e0] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#aaa] mb-1">Total with GST</p>
              <p className="text-[32px] font-bold tracking-tight leading-none" style={{ color: '#6d28d9' }}>
                ${pricing.priceWithGST.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#aaa] mb-1">Pre-GST</p>
              <p className="text-[18px] font-semibold text-[#555]">${pricing.preGST.toFixed(2)}</p>
              <p className="text-[11px] text-[#bbb] mt-1">
                Commission ${pricing.commission.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e0e0e0] px-5 py-3.5 flex items-center justify-between mt-2.5">
            <div>
              <p className="text-[11px] text-[#aaa] mb-0.5">Truck Roll</p>
              <p className="text-[11px] text-[#bbb]">+$300 if no local trucks</p>
            </div>
            <p className="text-[20px] font-semibold text-[#888]">${(pricing.priceWithGST + 300).toFixed(2)}</p>
          </div>
        </div>

        {/* Client */}
        <div>
          <SectionLabel>Client</SectionLabel>
          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
              required
            />
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Phone (optional)"
              className={inputClass}
            />
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email address"
              className={inputClass}
              required
            />
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional comments (optional)"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl py-4 text-[16px] font-semibold text-white active:opacity-80 transition-opacity"
          style={{ background: '#6d28d9', minHeight: 56 }}
        >
          Review &amp; Send Contract
        </button>

      </form>
    </div>
  )
}
