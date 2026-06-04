import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { TECHNICIAN } from '../../data'

export default function Login({ onLogin }) {
  const [state, setState] = useState('idle')

  function handleSignIn() {
    setState('success')
    setTimeout(() => onLogin(), 1400)
  }

  return (
    <div className="relative flex flex-col h-full bg-hcsg-page overflow-hidden">

      {/* Background industrial photo — subtle on light bg */}
      <div className="absolute inset-0">
        <img
          src="/assets/crane-tech.webp"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hcsg-page/35 via-hcsg-page/70 to-hcsg-page/95" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-hcsg-page to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 items-center justify-between px-8 pt-10 pb-10">

        {/* Top — Logo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/hcsg-logo.svg"
            alt="Hoist and Crane Service Group"
            className="h-12 w-auto"
          />
          <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">
            HCSG Advisor
          </p>
        </div>

        {/* Middle — Hero text */}
        <div className="text-center">
          <h1 className="text-hcsg-navy text-3xl font-bold leading-tight">
            Diagnose faster.<br />
            <span className="text-hcsg-orange">Fix right the first time.</span>
          </h1>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-xs">
            AI-powered field diagnostics, sourced directly from your equipment manuals.
          </p>
        </div>

        {/* Bottom — Sign-in CTA */}
        <div className="w-full flex flex-col items-center gap-4">

          {state === 'idle' && (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-95 text-white font-semibold text-base py-4 rounded-xl transition-all duration-150 shadow-lg shadow-hcsg-orange/20"
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
            <div className="w-full flex flex-col items-center gap-3 animate-fade-in">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border-2 border-green-400">
                <CheckCircle className="text-green-500" size={28} />
              </div>
              <div className="text-center">
                <p className="text-hcsg-navy font-semibold text-lg">
                  Welcome back, {TECHNICIAN.name.split(' ')[0]}
                </p>
                <p className="text-slate-400 text-sm">{TECHNICIAN.branch}</p>
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
