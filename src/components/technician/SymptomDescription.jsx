import { useState } from 'react'
import { ArrowLeft, Camera, ChevronRight } from 'lucide-react'

const SYMPTOMS = [
  { key: 'noise',    label: 'Strange noise',   emoji: '🔊' },
  { key: 'no-lift',  label: "Won't lift",       emoji: '⬆️' },
  { key: 'no-op',    label: "Won't operate",    emoji: '🚫' },
  { key: 'drift',    label: 'Load drifts',      emoji: '⬇️' },
  { key: 'heat',     label: 'Overheating',      emoji: '🌡️' },
  { key: 'electric', label: 'Electrical fault', emoji: '⚡' },
]

export default function SymptomDescription({ onBack, onAnalyse }) {
  const [selected, setSelected] = useState(null)
  const [detail,   setDetail]   = useState('')
  const [hasPhoto, setHasPhoto] = useState(false)

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-4 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-hcsg-navy" />
        </button>
        <p className="text-hcsg-navy font-bold text-sm">Describe the issue</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

        {/* Symptom grid */}
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">What are you seeing?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {SYMPTOMS.map(({ key, label, emoji }) => {
              const isSelected = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.97] ${
                    isSelected ? 'border-hcsg-orange bg-white shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span className={`text-sm font-semibold leading-snug ${isSelected ? 'text-hcsg-navy' : 'text-slate-600'}`}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Optional detail */}
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Add more detail</p>
          <textarea
            value={detail}
            onChange={e => setDetail(e.target.value)}
            placeholder="Describe what's happening in your own words..."
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-hcsg-navy text-sm outline-none resize-none placeholder:text-slate-400"
          />
        </div>

        {/* Optional photo */}
        <button
          onClick={() => setHasPhoto(true)}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed transition-colors ${
            hasPhoto ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'
          }`}
        >
          <Camera size={16} className={hasPhoto ? 'text-green-500' : 'text-slate-400'} />
          <span className={`text-sm font-medium ${hasPhoto ? 'text-green-600' : 'text-slate-400'}`}>
            {hasPhoto ? 'Photo added' : 'Add a photo (optional)'}
          </span>
        </button>

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 bg-white border-t border-slate-200">
        <button
          onClick={() => selected && onAnalyse({ symptom: selected, detail })}
          disabled={!selected}
          className="w-full flex items-center justify-center gap-2 bg-hcsg-orange text-white font-bold text-base py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-hcsg-orange/20 disabled:opacity-40"
        >
          Ask Advisor <ChevronRight size={18} />
        </button>
      </div>

    </div>
  )
}
