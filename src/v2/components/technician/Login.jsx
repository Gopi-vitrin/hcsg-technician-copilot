import { useState } from 'react'
import { CheckCircle, ChevronRight } from 'lucide-react'

const TECH = { name: 'Jake Thibodaux', role: 'Field Technician — Fast Track', branch: 'New Orleans, LA', avatar: 'JT' }

export default function Login({ onLogin }) {
  const [state, setState] = useState('idle') // idle | loading | done

  function handleSignIn() {
    setState('loading')
    setTimeout(() => {
      setState('done')
      setTimeout(() => onLogin(), 1200)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-navy overflow-hidden">

      {/* TOP — Photo section with orange frame border (website signature) */}
      <div className="relative flex-none" style={{ height: 340 }}>
        <img
          src="/assets/crane-tech.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Orange frame border — hoistcrane.com signature treatment */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 6px #e65e25' }}
        />
        {/* Dark gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-hcsg-navy via-hcsg-navy/40 to-transparent" />

        {/* Logo positioned over photo */}
        <div className="absolute bottom-5 left-5 right-5">
          <img
            src="/assets/hcsg-logo.svg"
            alt="Hoist & Crane Service Group"
            className="h-8 brightness-0 invert"
          />
        </div>

        {/* Priority badge top-right */}
        <div className="absolute top-4 right-4 bg-hcsg-orange px-2.5 py-1">
          <span className="font-display font-700 text-white text-xs tracking-widest uppercase">
            24/7 SUPPORT
          </span>
        </div>
      </div>

      {/* BOTTOM — Content */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8">

        {/* Headline */}
        <div>
          {/* Triple chevron accent — website motif */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-hcsg-orange font-display font-800 text-lg tracking-tight leading-none">›››</span>
            <span className="font-display font-600 text-white/40 text-xs tracking-widest uppercase">
              Technician Copilot
            </span>
          </div>

          <h1
            className="font-display font-800 text-white leading-none mb-1"
            style={{ fontSize: 36, letterSpacing: '-0.5px' }}
          >
            DIAGNOSE FASTER.
          </h1>
          <h1
            className="font-display font-800 leading-none mb-4"
            style={{ fontSize: 36, letterSpacing: '-0.5px', color: '#e65e25' }}
          >
            FIX IT RIGHT.
          </h1>

          <p className="text-white/45 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>
            AI-powered diagnosis from your own equipment manuals.
            Every answer sourced. Every step safety-checked.
          </p>
        </div>

        {/* CTA area */}
        <div className="space-y-3">

          {state === 'idle' && (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-between bg-hcsg-orange active:bg-hcsg-light-orange text-white px-5 py-4 transition-all duration-150 active:scale-[0.98]"
              style={{ borderRadius: 4 }}
            >
              <div className="flex items-center gap-3">
                {/* Microsoft icon */}
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                <span
                  className="font-display font-700 tracking-widest uppercase text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Sign in with Microsoft
                </span>
              </div>
              <ChevronRight size={18} className="text-white/70" />
            </button>
          )}

          {state === 'loading' && (
            <div className="w-full flex items-center justify-center gap-3 bg-hcsg-orange/20 border border-hcsg-orange/30 px-5 py-4" style={{ borderRadius: 4 }}>
              {/* Orange scanning line animation */}
              <div className="w-5 h-5 relative">
                <div className="w-full h-0.5 bg-hcsg-orange" style={{ animation: 'v2-chevron-pulse 0.6s ease-in-out infinite' }} />
                <div className="w-full h-0.5 bg-hcsg-orange mt-1.5" style={{ animation: 'v2-chevron-pulse 0.6s ease-in-out infinite', animationDelay: '0.2s' }} />
                <div className="w-full h-0.5 bg-hcsg-orange mt-1.5" style={{ animation: 'v2-chevron-pulse 0.6s ease-in-out infinite', animationDelay: '0.4s' }} />
              </div>
              <span className="font-display font-600 text-hcsg-orange text-sm tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Authenticating...
              </span>
            </div>
          )}

          {state === 'done' && (
            <div className="w-full flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-5 py-4 v2-fade-up" style={{ borderRadius: 4 }}>
              <CheckCircle size={20} className="text-green-400 shrink-0" />
              <div>
                <p className="font-display font-700 text-white text-sm tracking-wide uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Welcome back, {TECH.name.split(' ')[0]}
                </p>
                <p className="text-white/40 text-xs mt-0.5">{TECH.branch}</p>
              </div>
            </div>
          )}

          {/* Security footer */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-white/20 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Secured by Microsoft Entra ID
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
              <span className="text-white/20 text-xs">Systems online</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
