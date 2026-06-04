import { useState, useEffect } from 'react'
import { ArrowLeft, AlertTriangle, Package, Zap, FileText } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const SEVERITY_STYLES = {
  HIGH:   'bg-red-50 text-red-600 border border-red-100',
  MEDIUM: 'bg-amber-50 text-amber-600 border border-amber-100',
  LOW:    'bg-slate-100 text-slate-400 border border-slate-200',
}

const CONFIDENCE_COLOR = (score) => {
  if (score >= 75) return { bar: 'bg-green-500', text: 'text-green-600' }
  if (score >= 50) return { bar: 'bg-hcsg-amber', text: 'text-hcsg-amber' }
  return              { bar: 'bg-slate-300',   text: 'text-slate-400'  }
}

function parseSource(source) {
  const parts = source.split(',').map(s => s.trim())
  const name    = parts[0].replace(' Manual', '').replace(' Series Wire Rope Hoist', '').replace(' Wire Rope Hoist', '').trim()
  const section = parts[1] || ''
  const page    = parts[2] || ''
  return `${name} · ${section} · ${page}`
}

function PredictionCard({ prediction, rank, isTop, animDelay }) {
  const [citationOpen, setCitationOpen] = useState(isTop)
  const [warningOpen,  setWarningOpen]  = useState(isTop)
  const [barWidth,     setBarWidth]     = useState(0)
  const colors = CONFIDENCE_COLOR(prediction.confidence)

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(prediction.confidence), animDelay + 120)
    return () => clearTimeout(t)
  }, [prediction.confidence, animDelay])

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all animate-card-in bg-white ${
        isTop ? 'border-hcsg-orange/40 border-l-4 border-l-hcsg-orange' : 'border-slate-200'
      }`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Card header */}
      <div className="p-4 pb-3">

        {/* Rank + severity + confidence */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isTop ? 'bg-hcsg-orange text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {rank}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_STYLES[prediction.severity]}`}>
              {prediction.severity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${colors.text}`}>{prediction.confidence}% confident</span>
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fault name */}
        <p className={`font-semibold text-sm leading-snug ${isTop ? 'text-hcsg-navy' : 'text-slate-700'}`}>
          {prediction.fault}
        </p>

        {/* Part */}
        {prediction.part && (
          <div className="flex items-start gap-2 mt-2">
            <Package size={13} className="text-hcsg-orange mt-0.5 shrink-0" />
            <p className="text-slate-500 text-xs leading-snug">{prediction.part}</p>
          </div>
        )}
      </div>

      {/* Citation chip */}
      <div className="border-t border-slate-100 px-4 py-2.5">
        <button
          onClick={() => setCitationOpen(v => !v)}
          className="flex items-center gap-2 bg-hcsg-surface border border-slate-200 rounded-full px-3 py-1.5 active:bg-slate-200 transition-colors"
        >
          <FileText size={11} className="text-hcsg-blue shrink-0" />
          <span className="text-hcsg-blue text-xs font-medium truncate max-w-[240px]">
            {parseSource(prediction.source)}
          </span>
        </button>
        {citationOpen && (
          <p className="text-slate-500 text-xs leading-relaxed italic border-l-2 border-hcsg-blue/30 pl-3 mt-2.5 animate-fade-in">
            {prediction.citation}
          </p>
        )}
      </div>

      {/* Safety warning */}
      {prediction.safetyWarning && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setWarningOpen(v => !v)}
            className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
              warningOpen ? 'bg-red-50' : 'active:bg-slate-50'
            }`}
          >
            <AlertTriangle size={13} className="text-red-500 shrink-0" />
            <span className="text-red-500 text-xs font-semibold">Safety Warning</span>
          </button>
          {warningOpen && (
            <div className="px-4 pb-3 bg-red-50 animate-fade-in">
              <p className="text-red-600 text-xs leading-relaxed">{prediction.safetyWarning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PredictionsPanel({ woId, onBack, onStartTroubleshooting, onAskQuestion }) {
  const wo = WORK_ORDERS[woId]
  const topConfidence = wo.predictions[0].confidence

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={18} className="text-hcsg-navy" />
        </button>
        <div className="flex-1">
          <p className="text-hcsg-navy font-semibold text-sm">HCSG Advisor — Diagnosis</p>
          <p className="text-slate-400 text-xs">{wo.equipment.split('—')[0].trim()}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full animate-badge-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-green-600 text-xs font-semibold">{topConfidence}% match</span>
        </div>
      </div>

      {/* Scrollable predictions */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* HCSG Advisor persona intro */}
        <div className="bg-white border border-hcsg-orange/25 border-l-4 border-l-hcsg-orange rounded-2xl px-4 py-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0">
              <Zap size={11} className="text-white" fill="currentColor" />
            </div>
            <span className="text-hcsg-orange text-xs font-bold uppercase tracking-wide">HCSG Advisor</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Based on: {wo.equipment.split('—')[0].trim()} · {wo.complaint.split('.')[0]} · 4 manuals searched
          </p>
        </div>

        <p className="text-slate-600 text-sm font-medium px-1">
          Here's what I think is happening, and why:
        </p>

        {/* AI context */}
        {wo.aiContext && (
          <div className="flex items-start gap-2.5 bg-white border border-hcsg-orange/20 border-l-4 border-l-hcsg-orange rounded-xl px-3 py-2.5">
            <Zap size={12} className="text-hcsg-orange mt-0.5 shrink-0" fill="currentColor" />
            <p className="text-slate-600 text-xs leading-relaxed">{wo.aiContext}</p>
          </div>
        )}

        {/* Prediction cards */}
        {wo.predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.rank}
            prediction={prediction}
            rank={prediction.rank}
            isTop={index === 0}
            animDelay={index * 120}
          />
        ))}
      </div>

      {/* CTAs */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-200 bg-white space-y-3">
        <button
          onClick={onStartTroubleshooting}
          className="w-full flex items-center justify-center gap-2 bg-hcsg-orange active:bg-hcsg-light-orange active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-hcsg-orange/25"
        >
          <Zap size={18} fill="currentColor" />
          Start Troubleshooting
        </button>
        <button
          onClick={onAskQuestion}
          className="w-full text-hcsg-blue text-sm font-medium py-2 active:opacity-70 transition-opacity"
        >
          Ask HCSG Advisor a question
        </button>
      </div>

    </div>
  )
}
