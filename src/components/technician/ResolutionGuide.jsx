import { useState } from 'react'
import { ArrowLeft, CheckCircle, Circle, AlertTriangle, ShieldAlert, Package, BookOpen, ClipboardList } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

function StepCard({ step, completed, onToggle }) {
  const isLoto   = step.isLoto
  const isSafety = step.isSafety && !step.isLoto

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.98] ${
        isLoto
          ? completed ? 'border-red-200 bg-red-50/60' : 'border-red-300 bg-red-50'
          : isSafety
          ? completed ? 'border-slate-200 bg-white' : 'border-hcsg-orange/30 bg-orange-50/40'
          : completed ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className={`flex items-start gap-3 p-4 ${isSafety && !isLoto ? 'border-l-4 border-l-hcsg-orange' : ''} ${isLoto ? 'border-l-4 border-l-red-500' : ''}`}>

        {/* Step number + check */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
          <span className={`text-xs font-mono font-bold ${completed ? 'text-green-500' : isLoto ? 'text-red-500' : 'text-slate-300'}`}>
            {String(step.step).padStart(2, '0')}
          </span>
          {completed
            ? <CheckCircle size={20} className="text-green-500" />
            : <Circle size={20} className={isLoto ? 'text-red-400' : 'text-slate-300'} />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isLoto && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldAlert size={13} className="text-red-500 shrink-0" />
              <span className="text-red-600 text-xs font-bold uppercase tracking-wider">Lockout / Tagout Required</span>
            </div>
          )}
          {isSafety && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={13} className="text-hcsg-orange shrink-0" />
              <span className="text-hcsg-orange text-xs font-semibold uppercase tracking-wider">Safety Step</span>
            </div>
          )}
          <p className={`text-sm leading-relaxed ${
            completed
              ? 'text-slate-300 line-through'
              : isLoto
              ? 'text-hcsg-navy font-semibold'
              : 'text-slate-700'
          }`}>
            {step.text.replace(/^STEP \d+ — /, '')}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function ResolutionGuide({ woId, onBack, onComplete }) {
  const wo    = WORK_ORDERS[woId]
  const steps = wo.resolutionSteps
  const [completed, setCompleted] = useState(new Set())

  function toggleStep(stepNum) {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(stepNum) ? next.delete(stepNum) : next.add(stepNum)
      return next
    })
  }

  const completedCount = completed.size
  const totalSteps     = steps.length
  const progressPct    = Math.round((completedCount / totalSteps) * 100)
  const allDone        = completedCount === totalSteps

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-0 border-b border-slate-200">
        <div className="flex items-center gap-3 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-hcsg-navy" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-hcsg-navy font-semibold text-sm">Resolution Guide</p>
            <p className="text-slate-400 text-xs truncate">{wo.faultLabel}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            allDone ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-500'
          }`}>
            {completedCount}/{totalSteps}
          </span>
        </div>
        {/* Progress bar flush on border */}
        <div className="h-1 bg-slate-100 -mx-4">
          <div
            className={`h-full transition-all duration-500 ease-out ${allDone ? 'bg-green-500' : 'bg-hcsg-orange'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">

        {/* Source reference */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-hcsg-blue/20 rounded-xl mb-1">
          <BookOpen size={13} className="text-hcsg-blue shrink-0" />
          <p className="text-hcsg-blue text-xs">{wo.sourceRef}</p>
        </div>

        {steps.map(step => (
          <StepCard
            key={step.step}
            step={step}
            completed={completed.has(step.step)}
            onToggle={() => toggleStep(step.step)}
          />
        ))}

        {/* Parts needed */}
        <div className="flex items-start gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl mt-1">
          <Package size={16} className="text-hcsg-orange mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">Parts needed</p>
            <p className="text-hcsg-navy text-sm font-medium">{wo.parts}</p>
          </div>
        </div>

        {allDone && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl animate-fade-in">
            <CheckCircle size={18} className="text-green-500 shrink-0" />
            <p className="text-green-700 text-sm font-medium">All steps complete</p>
          </div>
        )}

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-200 bg-white">
        <button
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-2xl transition-all duration-150 bg-hcsg-orange hover:bg-hcsg-light-orange text-white shadow-lg shadow-hcsg-orange/25 active:scale-[0.98]"
        >
          <ClipboardList size={18} />
          Done
        </button>
        {!allDone && (
          <p className="text-slate-400 text-xs text-center mt-2">
            {totalSteps - completedCount} step{totalSteps - completedCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

    </div>
  )
}
