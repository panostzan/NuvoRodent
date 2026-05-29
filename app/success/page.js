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
    if (saved) { setEmail(saved); sessionStorage.removeItem('lastEmail') }
    if (res) { setResult(JSON.parse(res)); sessionStorage.removeItem('lastResult') }
  }, [])

  const statusColor = result?.status === 'sent' ? '#16a34a' : '#dc2626'

  return (
    <div className="flex flex-col flex-1 px-5 py-8 gap-6">
      <div className="flex flex-col items-center text-center gap-4 pt-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <path d="M8 18L15 25L28 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-1 text-[#0f172a]">Contract sent</h1>
          {email ? (
            <p className="text-[14px] font-medium text-[#64748b]">
              DocuSign sent to <span className="text-[#0f172a] font-semibold">{email}</span>
            </p>
          ) : (
            <p className="text-[14px] font-medium text-[#64748b]">DocuSign delivered successfully.</p>
          )}
        </div>
      </div>

      {result && (
        <div className="rounded-2xl bg-white border border-[#e2e8f0] px-4 py-4 flex flex-col gap-3"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#94a3b8]">DocuSign Debug</p>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-[#64748b]">Status</span>
            <span className="text-[13px] font-bold" style={{ color: statusColor }}>{result.status ?? 'unknown'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-[#64748b]">Envelope ID</span>
            <span className="text-[11px] font-mono text-[#94a3b8] break-all">{result.envelopeId}</span>
          </div>
          {result.recipients?.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#94a3b8]">Recipients</span>
              {result.recipients.map((r, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="text-[13px] font-semibold text-[#334155]">#{r.routingOrder} {r.name}</span>
                    <span className="text-[12px] font-medium text-[#64748b]">{r.status}</span>
                  </div>
                  <span className="text-[12px] text-[#94a3b8]">{r.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="w-full rounded-2xl py-4 text-[15px] font-semibold text-white active:opacity-80 mt-auto"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', minHeight: 52, boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
      >
        New Sale
      </button>
    </div>
  )
}
