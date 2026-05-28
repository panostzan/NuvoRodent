'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('lastEmail')
    if (saved) {
      setEmail(saved)
      sessionStorage.removeItem('lastEmail')
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 text-center gap-6">
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
            DocuSign delivered to <span className="text-white font-medium">{email}</span>
          </p>
        ) : (
          <p className="text-[#555] text-[15px]">DocuSign delivered successfully.</p>
        )}
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full rounded-lg py-4 text-[15px] font-semibold text-white active:opacity-80 mt-2"
        style={{ background: '#6d28d9', minHeight: 52 }}
      >
        New Sale
      </button>
    </div>
  )
}
