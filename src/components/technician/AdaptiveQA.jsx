import { useState } from 'react'
import { ArrowLeft, CheckCircle, Zap, TrendingUp } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const CONFIDENCE_COLOR = (score) => {
  if (score >= 75) return { bar: 'bg-green-500', text: 'text-green-600' }
  if (score >= 50) return { bar: 'bg-hcsg-amber', text: 'text-hcsg-amber' }
  return              { bar: 'bg-slate-300',   text: 'text-slate-400'  }
}

const clamp = (val) => Math.min(99, Math.max(1, val))

export default function AdaptiveQA({ woId, onBack, onComplete }) {
  const wo        = WORK_ORDERS[woId]
  const questions = wo?.adaptiveQuestions ?? []

  const [currentQ,        setCurrentQ]        = useState(0)
  const [answers,         setAnswers]         = useState([])
  const [confidences,     setConfidences]     = useState(() => (wo?.predictions ?? []).map(p => p.confidence))
  const [prevConfidences, setPrevConfidences] = useState(null)
  const [done,            setDone]            = useState(false)

  if (!wo) return null

  function handleAnswer(option) {
    if (answers[currentQ] !== undefined) return
    const q      = questions[currentQ]
    const shifts = q.confidenceShift[option]
    const next   = confidences.map((c, i) => clamp(c + shifts[i]))
    setPrevConfidences(confidences)
    setConfidences(next)
    setAnswers(prev => { const u = [...prev]; u[currentQ] = option; return u })
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 900)
    } else {
      setTimeout(() => setDone(true), 900)
    }
  }

  const topPrediction = wo.predictions[0]
  const topConfidence = confidences[0]
  const topColors     = CONFIDENCE_COLOR(topConfidence)
  const topDelta      = prevConfidences ? topConfidence - prevConfidences[0] : 0

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-200">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors">
          <ArrowLeft size={18} className="text-hcsg-navy" />
        </button>
        <div className="flex-1">
          <p className="text-hcsg-navy font-semibold text-sm">Narrow the Diagnosis</p>
          <p className="text-slate-400 text-xs">{wo.equipment.split('—')[0].trim()}</p>
        </div>
        <span className="text-slate-400 text-xs bg-slate-100 px-2.5 py-1 rounded-full">
          {done ? 'Complete' : `Q${currentQ + 1} of ${questions.length}`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Live confidence card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Top prediction — live confidence</p>
          <p className="text-hcsg-navy font-semibold text-sm leading-snug mb-3">{topPrediction.fault}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ease-out ${topColors.bar}`} style={{ width: `${topConfidence}%` }} />
            </div>
            <div className="flex items-center gap-1.5 min-w-[72px] justify-end">
              <span className={`text-base font-bold transition-all duration-500 ${topColors.text}`}>{topConfidence}%</span>
              {topDelta !== 0 && (
                <span className={`text-xs font-semibold animate-fade-in ${topDelta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {topDelta > 0 ? `+${topDelta}` : topDelta}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            {wo.predictions.slice(1).map((p, i) => {
              const c   = confidences[i + 1]
              const col = CONFIDENCE_COLOR(c)
              return (
                <div key={p.rank} className="flex items-center gap-2">
                  <p className="text-slate-400 text-xs flex-1 truncate">{p.fault.split('—')[0].trim()}</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${col.bar}`} style={{ width: `${c}%` }} />
                  </div>
                  <span className={`text-xs font-semibold w-8 text-right ${col.text}`}>{c}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qIndex) => {
          if (qIndex > currentQ) return null
          const isAnswered = answers[qIndex] !== undefined
          const selected   = answers[qIndex]
          return (
            <div key={qIndex} className="animate-card-in space-y-3">
              <div className={`rounded-2xl p-4 border ${isAnswered ? 'border-slate-200 bg-white' : 'border-hcsg-orange/30 bg-white shadow-sm'}`}>
                <div className="flex items-start gap-2 mb-3">
                  <TrendingUp size={14} className="text-hcsg-orange mt-0.5 shrink-0" />
                  <p className={`text-sm font-semibold leading-snug ${isAnswered ? 'text-slate-400' : 'text-hcsg-navy'}`}>
                    {q.question}
                  </p>
                </div>
                <div className="space-y-2">
                  {q.options.map((option) => {
                    const isSelected = selected === option
                    return (
                      <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswered}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-hcsg-orange text-white shadow-sm'
                            : isAnswered
                            ? 'bg-slate-50 text-slate-300 border border-slate-100'
                            : 'bg-slate-50 text-hcsg-navy border border-slate-200 active:bg-slate-100 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isSelected && <CheckCircle size={16} className="text-white/80 shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
              {isAnswered && (
                <div className="flex items-start gap-2 px-4 py-3 bg-hcsg-surface border border-slate-200 rounded-xl animate-fade-in">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-slate-500 text-xs leading-relaxed">{q.impact[selected]}</p>
                </div>
              )}
            </div>
          )
        })}

        {done && (
          <div className="animate-card-in space-y-3 pt-2">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-hcsg-navy font-semibold text-sm">Diagnosis refined</p>
              <p className="text-slate-400 text-xs mt-1">
                {wo.predictions[0].fault.split('—')[0].trim()} confirmed at {confidences[0]}% confidence
              </p>
            </div>
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-200 bg-white">
        <button
          onClick={() => onComplete(confidences[0])}
          className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-2xl transition-all duration-300 ${
            done
              ? 'bg-hcsg-orange hover:bg-hcsg-light-orange text-white shadow-lg shadow-hcsg-orange/25 active:scale-[0.98]'
              : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}
        >
          <Zap size={18} fill={done ? 'currentColor' : 'none'} />
          View Resolution Guide
        </button>
      </div>

    </div>
  )
}
