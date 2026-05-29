'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-[#f1f5f9]">
      <span className="text-[13px] font-semibold text-[#94a3b8] uppercase tracking-wide">{label}</span>
      <span className="text-[14px] font-semibold text-right max-w-[60%] text-[#0f172a]">{value}</span>
    </div>
  )
}

export default function ConfirmPage() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingSubmission')
    if (!raw) { router.replace('/'); return }
    setData(JSON.parse(raw))
  }, [router])

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const dsRes = await fetch('/api/docusign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const dsJson = await dsRes.json()
      console.log('DocuSign response:', dsJson)
      if (!dsRes.ok) {
        const e = dsJson.error
        throw new Error(typeof e === 'object' ? (e.message || 'DocuSign error') : (e || 'Failed to send'))
      }
      sessionStorage.removeItem('pendingSubmission')
      sessionStorage.setItem('lastEmail', data.clientEmail)
      sessionStorage.setItem('lastResult', JSON.stringify(dsJson))
      router.push('/success')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!data) return null

  const addonDetails = `${data.shortSides} short, ${data.longSides} long, ${data.stories} ${data.stories !== 1 ? 'stories' : 'story'}${data.roofPitch > 0 ? `, pitch ${data.roofPitch}` : ''}`

  return (
    <div className="flex flex-col flex-1 px-5 py-6 gap-5">
      <div>
        <button onClick={() => router.back()} className="text-[13px] font-semibold text-[#7c3aed] mb-4 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-[22px] font-bold text-[#0f172a]">Review Contract</h1>
        <p className="text-[14px] font-medium text-[#64748b] mt-1">Confirm before sending to client.</p>
      </div>

      {/* Price */}
      <div className="rounded-2xl px-5 py-5 text-center"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-purple-200 mb-1">Total with GST</p>
        <p className="text-[42px] font-bold text-white leading-none">${Number(data.priceWithGST).toFixed(2)}</p>
        <p className="text-[13px] font-medium text-purple-200 mt-1.5">Pre-GST ${Number(data.preGST).toFixed(2)}</p>
      </div>

      {/* Details */}
      <div className="rounded-2xl bg-white border border-[#e2e8f0] px-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Row label="Client" value={data.clientName} />
        <Row label="Email" value={data.clientEmail} />
        {data.clientPhone && <Row label="Phone" value={data.clientPhone} />}
        <Row label="Address" value={data.address + (data.city ? `, ${data.city}` : '')} />
        <Row label="Config" value={addonDetails} />
        <Row label="Rep" value={data.repName} />
        {data.comments && <Row label="Notes" value={data.comments} />}
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full rounded-2xl py-4 text-[16px] font-semibold text-white active:opacity-80 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', minHeight: 56, boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
        >
          {loading ? 'Sending…' : 'Confirm & Send DocuSign'}
        </button>
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="w-full rounded-2xl py-3.5 text-[15px] font-semibold text-[#475569] border border-[#e2e8f0] active:opacity-70 bg-white"
        >
          Back
        </button>
      </div>
    </div>
  )
}
