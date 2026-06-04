import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { ADMIN } from '../../data'

export default function AdminLogin({ onLogin }) {
  const [state, setState] = useState('idle')

  function handleSignIn() {
    setState('success')
    setTimeout(() => onLogin(), 1400)
  }

  return (
    <div className="min-h-screen bg-hcsg-page flex items-center justify-center relative overflow-hidden">

      {/* Background image — very subtle on light bg */}
      <div className="absolute inset-0">
        <img src="/assets/corporate-projects.webp" alt="" className="w-full h-full object-cover opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-hcsg-page/80 via-hcsg-page/60 to-hcsg-page/90" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-10" />

          <div className="text-center">
            <h1 className="text-hcsg-navy text-2xl font-bold">Admin Console</h1>
            <p className="text-slate-400 text-sm mt-1">Service Manager · Knowledge Base · Analytics</p>
          </div>

          {state === 'idle' && (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-95 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-hcsg-orange/20"
            >
              <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-hcsg-navy font-semibold text-lg">Welcome, {ADMIN.name.split(' ')[0]}</p>
                <p className="text-slate-400 text-sm">{ADMIN.branch}</p>
              </div>
            </div>
          )}

          <p className="text-slate-400 text-xs text-center">
            Secured by Microsoft Entra ID · HCSG Internal Use Only
          </p>
        </div>
      </div>
    </div>
  )
}
