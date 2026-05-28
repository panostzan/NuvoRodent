'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('lastEmail')
    const res = sessionStorage.getItem('lastResult')
    if (saved) {
      setEmail(saved)
      sessionStorage.removeItem('lastEmail')
    }
    if (res) {
      setResult(JSON.parse(res))
      sessionStorage.removeItem('lastResult')
    }
  }, [])

  const statusColor = result?.status === 'sent' ? '#4ade80' : '#f87171'

  return (
    <div className="flex flex-col flex-1 px-5 py-8 gap-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(109,40,217,0.15)', border: '1.5px solid #6d28d9' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18L15 25L28 12" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Contract sent</h1>
          {email ? (
            <p className="text-[#555] text-[15px]">
              Sent to <span className="text-white font-medium">{email}</span>
            </p>
          ) : (
            <p className="text-[#555] text-[15px]">DocuSign delivered successfully.</p>
          )}
        </div>
      </div>

      {result && (
        <div className="rounded-xl bg-[#0e0e0e] border border-[#1e1e1e] px-4 py-4 flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#555]">DocuSign Debug</p>

          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#888]">Envelope status</span>
            <span className="text-[13px] font-semibold" style={{ color: statusColor }}>
              {result.status ?? 'unknown'}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] text-[#888]">Envelope ID</span>
            <span className="text-[12px] font-mono text-[#555] break-all">{result.envelopeId}</span>
          </div>

          {result.recipients?.length > 0 && (
            <div className="flex flex-col gap-2 pt-1 border-t border-[#1e1e1e]">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#555]">Recipients</span>
              {result.recipients.map((r, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#aaa]">#{r.routingOrder} {r.name}</span>
                    <span className="text-[12px] text-[#666]">{r.status}</span>
                  </div>
                  <span className="text-[12px] text-[#555]">{r.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="w-full rounded-lg py-4 text-[15px] font-semibold text-white active:opacity-80 mt-auto"
        style={{ background: '#6d28d9', minHeight: 52 }}
      >
        New Sale
      </button>
    </div>
  )
}
