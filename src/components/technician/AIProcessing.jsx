import { useEffect, useState } from 'react'
import { CheckCircle, FileText, Loader } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const STEP_TEMPLATES = [
  { id: 1, label: () => 'Matching equipment to knowledge base...',  duration: 400 },
  { id: 2, label: () => 'Loading manuals and service history...',    duration: 500 },
  { id: 3, label: () => 'Scanning for known fault patterns...',      duration: 400 },
  { id: 4, label: () => 'Ranking likely causes by confidence...',    duration: 300 },
  { id: 5, label: () => 'Ready.',                                    duration: 200 },
]

const TOTAL_DURATION = STEP_TEMPLATES.reduce((sum, s) => sum + s.duration, 0)

export default function AIProcessing({ woId, onComplete }) {
  const wo = WORK_ORDERS[woId] ?? WORK_ORDERS['WO-2847']
  const STEPS = STEP_TEMPLATES.map(t => ({ ...t, label: t.label(wo) }))
  const [activeStep,     setActiveStep]     = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [progress,       setProgress]       = useState(0)
  const [done,           setDone]           = useState(false)

  useEffect(() => {
    let elapsed = 0
    STEPS.forEach((step, index) => {
      const startTimer = setTimeout(() => setActiveStep(index), elapsed)
      elapsed += step.duration
      const endTimer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id])
        setProgress(Math.round(((index + 1) / STEPS.length) * 100))
      }, elapsed)
      return () => { clearTimeout(startTimer); clearTimeout(endTimer) }
    })
    const doneTimer = setTimeout(() => {
      setDone(true)
      setTimeout(() => onComplete(), 400)
    }, TOTAL_DURATION + 200)
    return () => clearTimeout(doneTimer)
  }, [])

  return (
    <div className="flex flex-col h-full bg-hcsg-page relative overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#011e41 1px, transparent 1px), linear-gradient(90deg, #011e41 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-80 h-80 rounded-full ${done ? 'opacity-5' : 'animate-glow-pulse'}`}
          style={{ background: 'radial-gradient(circle, #e65e25 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative flex justify-center pt-10 pb-2">
        <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-7 opacity-20" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-8 gap-8">

        <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-hcsg-orange/30 bg-hcsg-orange/8">
          {done ? (
            <CheckCircle size={36} className="text-green-500 animate-fade-in" />
          ) : (
            <div className="relative flex items-center justify-center">
              <svg className="animate-spin w-10 h-10" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="#011e41" strokeOpacity="0.1" strokeWidth="3" />
                <path d="M20 4 A16 16 0 0 1 36 20" stroke="#e65e25" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <FileText size={16} className="absolute text-hcsg-orange" />
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-hcsg-navy font-bold text-xl">
            {done ? 'Analysis Complete' : 'HCSG Advisor Analysing'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {done ? '3 predictions ready' : 'Shaw-Box Series 800'}
          </p>
        </div>

        <div className="w-full space-y-3">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.includes(step.id)
            const isActive   = activeStep === index && !isComplete
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  index > activeStep && !isComplete ? 'opacity-20' : 'opacity-100'
                }`}
              >
                <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                  {isComplete ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : isActive ? (
                    <Loader size={16} className="text-hcsg-orange animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                </div>
                <span className={`text-sm ${
                  isComplete ? 'text-slate-400' : isActive ? 'text-hcsg-navy font-medium' : 'text-slate-300'
                }`}>
                  {step.label}
                </span>
                {isActive && step.id === 2 && (
                  <div className="flex gap-1 ml-auto">
                    {[0, 1, 2, 3].map(i => (
                      <FileText key={i} size={12} className="text-hcsg-orange"
                        style={{ animationDelay: `${i * 150}ms`, animation: 'pulse 0.8s ease-in-out infinite' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative px-8 pb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">Scanning knowledge base</span>
          <span className="text-hcsg-orange text-xs font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-hcsg-orange rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {completedSteps.includes(2) && (
            <span className="text-slate-400 text-xs animate-slide-in">4 manuals</span>
          )}
          {completedSteps.includes(3) && (
            <><span className="text-slate-300 text-xs">·</span>
            <span className="text-slate-400 text-xs animate-slide-in">fault pattern library</span></>
          )}
          {completedSteps.includes(4) && (
            <><span className="text-slate-300 text-xs">·</span>
            <span className="text-slate-400 text-xs animate-slide-in">symptom history</span></>
          )}
        </div>
      </div>

    </div>
  )
}
