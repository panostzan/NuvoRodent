'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-[#d5d5d5]">
      <span className="text-sm font-semibold text-[#666]">{label}</span>
      <span className="text-sm font-bold text-right max-w-[60%] text-[#0a0a0a]">{value}</span>
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
    if (!raw) {
      router.replace('/')
      return
    }
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
    <div className="flex flex-col flex-1 px-5 py-6 gap-6">
      <div>
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-[#666] mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Review Contract</h1>
        <p className="text-sm font-medium text-[#666] mt-1">Confirm details before sending to client.</p>
      </div>

      {/* Price callout */}
      <div className="rounded-2xl p-5 text-center border border-[#c8c8c8] bg-white">
        <p className="text-sm font-bold text-[#888] mb-1">Total with GST</p>
        <p className="text-4xl font-bold" style={{ color: '#5b21b6' }}>
          ${Number(data.priceWithGST).toFixed(2)}
        </p>
        <p className="text-sm font-semibold text-[#888] mt-1">Pre-GST: ${Number(data.preGST).toFixed(2)}</p>
      </div>

      {/* Details */}
      <div className="rounded-2xl bg-white border border-[#c8c8c8] px-4">
        <Row label="Client" value={data.clientName} />
        <Row label="Email" value={data.clientEmail} />
        {data.clientPhone && <Row label="Phone" value={data.clientPhone} />}
        <Row label="Address" value={data.address + (data.city ? `, ${data.city}` : '')} />
        <Row label="Configuration" value={addonDetails} />
        <Row label="Rep" value={data.repName} />
        {data.comments && <Row label="Comments" value={data.comments} />}
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold bg-red-50 border border-red-300 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full rounded-2xl py-5 text-lg font-bold text-white active:opacity-80 disabled:opacity-50"
          style={{ background: '#5b21b6', minHeight: 64 }}
        >
          {loading ? 'Sending…' : 'Confirm & Send DocuSign'}
        </button>
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="w-full rounded-2xl py-4 text-base font-bold text-[#444] border border-[#c8c8c8] active:opacity-70 bg-white"
        >
          Back
        </button>
      </div>
    </div>
  )
}
