import { useState } from 'react'
import { ArrowRight, Camera, ChevronDown, CheckCircle, QrCode, ScanLine, Search } from 'lucide-react'
import { TECHNICIAN } from '../../data'

export default function EquipmentIdentification({ onIdentify }) {
  const [activeMethod, setActiveMethod] = useState('search')
  const [searchInput, setSearchInput] = useState('')
  const [qrDetected, setQrDetected] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoReady, setPhotoReady] = useState(false)
  const suggestions = [
    { id: 'SB800-2T-4471', title: 'Shaw-Box Series 800', meta: '2-Ton wire rope hoist' },
    { id: 'Y80-3T-8821', title: 'Yale Y80 Series', meta: '3-Ton wire rope hoist' },
    { id: 'WS3D-10T-2204', title: 'World Series Bridge Crane', meta: '10-Ton double girder' },
  ].filter(item => {
    const q = searchInput.trim().toLowerCase()
    if (!q) return false
    return item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q)
  })

  function handleQRTap() {
    setActiveMethod('qr')
    setQrDetected(false)
    setTimeout(() => {
      setQrDetected(true)
      setTimeout(() => onIdentify({ source: 'qr' }), 700)
    }, 1600)
  }

  function handlePhotoTap() {
    setActiveMethod('photo')
    setPhotoLoading(true)
    setTimeout(() => {
      setPhotoLoading(false)
      setPhotoReady(true)
      setTimeout(() => onIdentify({ source: 'photo' }), 650)
    }, 1400)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (searchInput.trim()) onIdentify({ source: 'search', value: searchInput.trim(), openAdvisor: true })
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-page overflow-y-auto">
      <div className="bg-white border-b border-slate-200 px-5 pt-5 pb-4">
        <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-6 mb-3" />
        <h1 className="text-hcsg-navy font-bold text-xl leading-snug text-balance">
          Identify equipment
        </h1>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={handleQRTap}
            className={`flex-1 h-32 p-4 rounded-2xl border text-left active:scale-[0.98] flex flex-col gap-2.5 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out ${
              activeMethod === 'qr' ? 'border-hcsg-orange bg-white shadow-md shadow-hcsg-orange/10' : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-hcsg-orange flex items-center justify-center">
              <QrCode size={20} className="text-white" />
            </div>
            <div>
              <p className="text-hcsg-navy text-sm font-bold">Scan QR</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-snug">Fastest path with a code.</p>
            </div>
          </button>

          <button
            onClick={handlePhotoTap}
            className={`flex-1 h-32 p-4 rounded-2xl border text-left active:scale-[0.98] flex flex-col gap-2.5 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out ${
              activeMethod === 'photo' ? 'border-hcsg-orange bg-white shadow-md shadow-hcsg-orange/10' : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-hcsg-navy flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <p className="text-hcsg-navy text-sm font-bold">Capture Tag</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-snug">Smart scan reads details.</p>
            </div>
          </button>
        </div>

        <button
          onClick={() => setActiveMethod('search')}
          className={`w-full p-4 rounded-2xl border text-left active:scale-[0.98] flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out ${
            activeMethod === 'search' ? 'border-hcsg-orange bg-white shadow-md shadow-hcsg-orange/10' : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            activeMethod === 'search' ? 'bg-hcsg-orange' : 'bg-slate-100'
          }`}>
            <Search size={17} className={activeMethod === 'search' ? 'text-white' : 'text-slate-500'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-hcsg-navy">Enter model or serial</p>
            <p className="text-slate-400 text-xs mt-0.5 text-pretty">Use when the tag is damaged or QR is missing</p>
          </div>
          {activeMethod === 'search' ? <CheckCircle size={16} className="text-hcsg-orange" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {activeMethod === 'search' && (
          <form onSubmit={handleSearchSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in shadow-sm">
            <p className="text-hcsg-navy text-sm font-semibold">Model or serial number</p>
            <input
              autoFocus
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="SB800-2T or SB800-2T-4471"
              className="w-full bg-hcsg-surface border border-slate-200 rounded-xl px-4 py-3 text-hcsg-navy text-sm outline-none placeholder:text-slate-400 focus:border-hcsg-orange focus:ring-2 focus:ring-hcsg-orange/15 transition-[border-color,box-shadow] duration-150"
            />
            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSearchInput(item.id)
                      onIdentify({ source: 'search', value: item.id, openAdvisor: true })
                    }}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-hcsg-surface px-3 py-2.5 text-left active:bg-slate-100 hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,border-color,box-shadow] duration-150"
                  >
                    <div className="min-w-0">
                      <p className="text-hcsg-navy text-sm font-semibold truncate">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5 tabular-nums">{item.id} - {item.meta}</p>
                    </div>
                    <ArrowRight size={14} className="text-hcsg-orange shrink-0" />
                  </button>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={!searchInput.trim()}
              className="w-full min-h-11 flex items-center justify-center gap-2 py-3 rounded-xl bg-hcsg-orange text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[transform,background-color,opacity,box-shadow] duration-150 shadow-sm shadow-hcsg-orange/20"
            >
              Find Equipment <ArrowRight size={16} />
            </button>
          </form>
        )}

        {activeMethod === 'qr' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-fade-in">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-hcsg-orange rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-hcsg-orange rounded-tr-sm" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-hcsg-orange rounded-bl-sm" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-hcsg-orange rounded-br-sm" />

              {!qrDetected ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute left-6 right-6 h-0.5 bg-hcsg-orange/70" style={{ animation: 'scanLine 1.8s ease-in-out infinite' }} />
                  <QrCode size={40} className="text-white/20" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-hcsg-orange/20 border border-hcsg-orange/40 flex items-center justify-center">
                    <ScanLine size={18} className="text-hcsg-orange" />
                  </div>
                  <p className="text-white text-sm font-semibold text-center px-4">Shaw-Box Series 800 - 2-Ton</p>
                  <p className="text-white/50 text-xs">Equipment detected</p>
                </div>
              )}
            </div>
            {!qrDetected && (
              <p className="text-slate-400 text-xs text-center mt-3">Point camera at QR tag on equipment</p>
            )}
          </div>
        )}

        {photoLoading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 border-2 border-hcsg-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-hcsg-navy text-sm font-semibold">Reading equipment tag...</p>
          </div>
        )}
      </div>
    </div>
  )
}
