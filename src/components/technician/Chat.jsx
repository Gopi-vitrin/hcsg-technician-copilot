import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle, Clock, LayoutList, Mic, MessageSquare, PhoneCall, Plus, Send, Wrench, X, Zap } from 'lucide-react'
import { ANALYTICS, MODEL_ISSUES, TECHNICIAN, TECHNICIAN_HISTORY, WORK_ORDERS } from '../../data'

const JOB_DEMO_PROMPTS = ANALYTICS.topQuestions.map(q => q.label)

const GENERAL_PROMPTS = [
  'Wire rope inspection',
  'LOTO reminder',
  'Hoist will not raise',
  'Contactor fault',
  'Find fuse box',
]

const DEMO_RESPONSES = {
  'diagnose load drift': {
    text: 'Based on this Shaw-Box 800 history, the likely cause is motor brake air gap drift. The last PM measured 0.120"; after 487 operating hours, the unit is in the range where the gap can reach the 0.200" adjustment limit.\n\nShow the tech: lock out power, remove the brake cover, measure the gap, then adjust back to 0.100" if confirmed.',
    confidence: 87,
    source: 'Shaw-Box 800 Manual, Motor Brake Adjustment, p.23',
  },
  'safety steps': {
    text: 'Before inspection: lock the main disconnect OFF, apply tagout, verify zero energy, and keep the hook path clear. Do not remove the brake or electrical cover until lockout is confirmed.',
    confidence: 98,
    source: 'OSHA 1910.147 and HCSG safety procedure',
  },
  'parts to bring': {
    text: 'Bring Friction Disc Kit 800-5005. Also bring the brake cover hardware kit if the cover fasteners are corroded. Do not replace parts until the air gap and disc thickness confirm the diagnosis.',
    confidence: 84,
    source: 'Shaw-Box 800 parts list and prior service history',
  },
  'wire rope inspection': {
    text: 'Inspect the full rope length for broken wires, kinks, crushing, corrosion, bird-caging, and diameter loss. Remove the hoist from service if rejection criteria are found.',
    confidence: 91,
    source: 'ASME B30.2 and Shaw-Box inspection criteria',
  },
  'loto reminder': {
    text: 'Lock the main disconnect OFF, apply the tag, verify zero energy, and confirm the work zone is clear before opening the hoist or electrical compartment.',
    confidence: 98,
    source: 'OSHA 1910.147',
  },
  'hoist will not raise': {
    text: 'If DOWN works but UP does not, check the UP contactor first. Listen for a click. No click points to coil or push-button circuit; click with no movement points to the power path or motor.',
    confidence: 82,
    source: 'Yale Y80 Manual, Section 6-4, p.19',
  },
}

const CANNED = {
  brake:      DEMO_RESPONSES['diagnose load drift'],
  loto:       DEMO_RESPONSES['loto reminder'],
  contactor:  DEMO_RESPONSES['hoist will not raise'],
  lift:       DEMO_RESPONSES['hoist will not raise'],
  fuse:       { text: 'No movement and no sound usually means control voltage is missing. Check the transformer fuse first, then inspect the transformer coil and push-button circuit for shorts.', confidence: 79, source: 'World Series Double Girder Manual, Section 6-1, p.22' },
  electrical: { text: 'Start at the control transformer fuse and work outward — transformer, contactor coils, push-button circuit, then motor leads. LOTO before opening any electrical panel. Check for burn marks or tripped overloads.', confidence: 81, source: 'Shaw-Box 800 Manual, Section 6-1, p.22' },
  'wire rope': DEMO_RESPONSES['wire rope inspection'],
}

function buildInitialMessages(contextWoId, symptom) {
  const firstName = TECHNICIAN.name.split(' ')[0]
  const wo = WORK_ORDERS[contextWoId]

  if (!wo) {
    return [{
      role: 'bot',
      text: `Hi ${firstName}. Ask about a hoist, crane, fault, part, or procedure. I will keep it short and show the source when I have one.`,
    }]
  }

  const SYMPTOM_REPLIES = {
    'Load drifts':       { text: "On this unit at 487 hours, the motor brake air gap is the likely cause — it typically reaches the 0.200\" wear limit around this point.\n\nLOTO first, then pull the brake cover and measure the gap at three points. Spec is 0.100\". If you're at 0.180\" or more, back off the three adjustment nuts evenly and re-torque the jam nuts to 12 ft-lb. Check the friction disc while you're in there — glazing means part 800-5005.", confidence: 91, source: 'Shaw-Box 800 Manual §4-3 p.23 · SB800-2T-4471 history' },
    'Strange noise':     { text: 'A grinding or clicking noise on this unit usually means the motor brake is dragging or the load brake friction disc is worn. Lock out, remove the brake cover, and check both the air gap and disc thickness before anything else.', confidence: 82, source: 'Shaw-Box 800 Manual, Section 4-2, p.14' },
    "Won't lift":        { text: 'If the hoist responds to DOWN but not UP, check the UP contactor first — listen for a click. No click means the coil or push-button circuit; click with no movement points to the power path or motor. Check control fuses before pulling the contactor.', confidence: 84, source: 'Shaw-Box 800 Manual, Section 6-4, p.19' },
    "Won't operate":     { text: 'No response in any direction usually means control voltage is missing. Check the control transformer fuse first, then the transformer coil. If fuse is good, inspect the push-button circuit and emergency stop contacts.', confidence: 79, source: 'Shaw-Box 800 Manual, Section 6-1, p.22' },
    'Overheating':       { text: 'Overheating on this unit is typically caused by excessive duty cycle, a dragging brake, or a failing motor winding. Check the brake air gap first — a dragging brake generates significant heat. Verify the unit has not exceeded its rated duty cycle for the shift.', confidence: 76, source: 'Shaw-Box 800 Manual, Section 5-3, p.17' },
    'Electrical fault':  { text: 'Start at the control transformer fuse and work outward — transformer, contactor coils, push-button circuit, then motor leads. LOTO before opening any electrical panel. Check for burn marks or tripped overloads in the control enclosure.', confidence: 81, source: 'Shaw-Box 800 Manual, Section 6-1, p.22' },
  }

  if (!symptom) {
    return [{
      role: 'bot',
      text: `Hi ${firstName}. Manual and service history loaded for ${contextWoId}. What's the fault or symptom?`,
    }]
  }

  const msgs = []
  msgs.push({ role: 'user', text: symptom.replace('Matched model/serial ', 'model/serial ') })

  const primarySymptom = symptom.split(',')[0].trim()
  const reply = SYMPTOM_REPLIES[primarySymptom]

  msgs.push(reply
    ? { role: 'bot', ...reply }
    : {
        role: 'bot',
        text: 'I found the Shaw-Box Series 800 and loaded the matching manuals, service history, and similar repairs. Choose a quick action below or ask your own question.',
        confidence: 87,
        source: '4 manuals and 3 similar work orders',
      }
  )
  return msgs
}

function getBotReply(input, contextWoId) {
  const q = input.toLowerCase()
  const wo = WORK_ORDERS[contextWoId]

  if (DEMO_RESPONSES[q]) return DEMO_RESPONSES[q]

  if (wo) {
    if (q.includes('safety') || q.includes('loto') || q.includes('lock')) {
      return DEMO_RESPONSES['safety steps']
    }
    if (q.includes('part') || q.includes('bring') || q.includes('replace')) {
      return {
        text: wo.parts ? `Bring ${wo.parts}. Confirm the air gap and disc thickness before replacing parts.` : 'No replacement part is confirmed yet. Inspect and test before ordering.',
        confidence: wo.predictions[0].confidence,
        source: wo.sourceRef,
      }
    }
    if (q.includes('first') || q.includes('start') || q.includes('check')) {
      return {
        text: `Start here:\n1. Lock out and tag out power.\n2. Remove the brake cover.\n3. Measure the brake air gap before making any adjustment.\n\nIf the gap is at or past 0.200", adjust back to 0.100".`,
        confidence: wo.predictions[0].confidence,
        source: wo.sourceRef,
      }
    }
  }

  for (const [keyword, reply] of Object.entries(CANNED)) {
    if (q.includes(keyword)) return reply
  }

  return {
    text: 'Tell me the symptom, equipment model, or what changed when you pressed the control. I will narrow it down from there.',
  }
}

function MessageMeta({ msg }) {
  const [open, setOpen] = useState(false)
  if (!msg.confidence) return null

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors duration-150 focus:outline-none"
      >
        <Zap size={10} fill="currentColor" className="text-green-500" />
        {msg.confidence}% confident
        <span className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && msg.source && (
        <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 animate-fade-in">
          <BookOpen size={11} className="inline mr-1 text-hcsg-blue" />{msg.source}
        </div>
      )}
    </div>
  )
}

export default function Chat({ contextWoId, symptom, onBack, onCompleteJob }) {
  const [messages, setMessages] = useState(() => buildInitialMessages(contextWoId, symptom))
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [streamingIdx, setStreamingIdx] = useState(-1)
  const [streamedChars, setStreamedChars] = useState(0)
  const [userHasSent, setUserHasSent] = useState(false)
  const [showCommonIssues, setShowCommonIssues] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [historySession, setHistorySession] = useState(null)
  const bottomRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    const msgs = buildInitialMessages(contextWoId, symptom)
    setMessages(msgs)
    setUserHasSent(false)
    const botIdx = msgs.findIndex(m => m.role === 'bot')
    if (botIdx >= 0) {
      setStreamingIdx(botIdx)
      setStreamedChars(0)
    }
  }, [contextWoId, symptom])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const suggestions = useMemo(() => {
    return contextWoId ? JOB_DEMO_PROMPTS : GENERAL_PROMPTS
  }, [contextWoId])

  useEffect(() => {
    if (streamingIdx < 0) return
    const msg = messages[streamingIdx]
    if (!msg) return
    if (streamedChars >= msg.text.length) { setStreamingIdx(-1); return }
    // advance to end of next word (or whitespace run) — GPT-style word chunks
    const remaining = msg.text.slice(streamedChars)
    const wordMatch = remaining.match(/^(\S+\s*)/)
    const chunk = wordMatch ? wordMatch[0].length : 1
    const delay = remaining[0] === '\n' ? 60 : 42
    streamRef.current = setTimeout(() => setStreamedChars(c => c + chunk), delay)
    return () => clearTimeout(streamRef.current)
  }, [streamingIdx, streamedChars, messages])

  function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || thinking) return

    setUserHasSent(true)
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setThinking(true)

    setTimeout(() => {
      setThinking(false)
      setMessages(prev => {
        const next = [...prev, { role: 'bot', ...getBotReply(userMsg, contextWoId) }]
        setStreamingIdx(next.length - 1)
        setStreamedChars(0)
        return next
      })
    }, 650)
  }

  return (
    <div className="relative flex flex-col h-full bg-hcsg-page">
      <div className="bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft size={18} className="text-hcsg-navy" />
            </button>
          )}
          <button
            onClick={() => setShowSidebar(true)}
            className="w-8 h-8 rounded-xl bg-hcsg-orange flex items-center justify-center shrink-0 active:scale-[0.95] focus:outline-none transition-transform duration-150"
            aria-label="Recent sessions"
          >
            <Zap size={15} className="text-white" fill="currentColor" />
          </button>
          <div className="min-w-0">
            <p className="text-hcsg-navy font-bold text-sm">HCSG Advisor</p>
            <p className="text-slate-400 text-xs truncate">{contextWoId ? `${contextWoId} ready` : 'General — no job loaded'}</p>
          </div>
        </div>
        {contextWoId && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <Wrench size={12} className="text-slate-400 shrink-0" />
            <p className="text-slate-500 text-xs font-medium truncate">
              Shaw-Box Series 800 · 2-Ton · SB800-2T-4471
            </p>
            <span className="ml-auto shrink-0 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Manual loaded
            </span>
          </div>
        )}
      </div>

      {historySession && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-amber-700 text-xs font-semibold truncate">{historySession.customer} · {historySession.id}</p>
            <p className="text-amber-500 text-[11px] truncate">{historySession.date} · {historySession.jobType}</p>
          </div>
          <button
            onClick={() => { setHistorySession(null); setMessages(buildInitialMessages(contextWoId, symptom)); setUserHasSent(false) }}
            className="text-amber-500 text-[11px] font-semibold shrink-0 hover:text-amber-700 transition-colors"
          >
            Back to current
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {voiceOn && (
          <div className="flex items-center gap-2 bg-hcsg-navy text-white rounded-2xl px-4 py-3 animate-fade-in">
            <PhoneCall size={14} className="shrink-0" />
            <p className="text-xs leading-relaxed">Voice mode on. Spoken questions are transcribed into this chat.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex animate-msg-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className={`w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0 mr-2 mt-0.5 transition-opacity duration-300 ${i === streamingIdx ? 'opacity-70' : 'opacity-100'}`}>
                <Zap size={12} className="text-white" fill="currentColor" />
              </div>
            )}
            <div className={`max-w-[84%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line text-pretty ${
                msg.role === 'user'
                  ? 'bg-hcsg-orange text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
              }`}>
                {msg.role === 'bot' && i === streamingIdx
                  ? msg.text.slice(0, streamedChars)
                  : msg.text}
                {msg.role === 'bot' && i === streamingIdx && streamedChars < msg.text.length && (
                  <span className="inline-block w-[2px] h-[14px] bg-hcsg-orange ml-0.5 cursor-blink align-middle rounded-full" />
                )}
              </div>
              {msg.role === 'bot' && (i !== streamingIdx || streamedChars >= msg.text.length) && <MessageMeta msg={msg} />}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-2 animate-msg-in">
            <div className="w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0">
              <Zap size={12} className="text-white" fill="currentColor" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-hcsg-orange dot-wave"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Sessions sidebar */}
      {showSidebar && (
        <div className="absolute inset-0 z-50 flex overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSidebar(false)}
          />
          <div className="relative w-72 max-w-[85%] bg-hcsg-navy flex flex-col h-full shadow-2xl animate-slide-in-left">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-hcsg-orange flex items-center justify-center">
                  <Zap size={13} className="text-white" fill="currentColor" />
                </div>
                <p className="text-white font-bold text-sm">HCSG Advisor</p>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* New session button */}
            <div className="px-3 pt-3 pb-2">
              <button
                onClick={() => {
                  setHistorySession(null)
                  setMessages(buildInitialMessages(contextWoId, symptom))
                  setUserHasSent(false)
                  setStreamingIdx(-1)
                  setShowSidebar(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/15 text-white/80 hover:bg-white/10 hover:text-white active:bg-white/15 transition-colors text-sm font-medium focus:outline-none"
              >
                <Plus size={15} /> New session
              </button>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              {/* Active session if WO loaded */}
              {contextWoId && (
                <>
                  <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-1 mb-1 mt-2">Active</p>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-left mb-1"
                  >
                    <MessageSquare size={14} className="text-hcsg-orange shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{contextWoId}</p>
                      <p className="text-white/50 text-[11px] truncate mt-0.5">Shaw-Box Series 800 · In progress</p>
                    </div>
                  </button>
                </>
              )}

              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-1 mb-1 mt-3">Previous Sessions</p>
              <div className="space-y-0.5">
                {TECHNICIAN_HISTORY.map((wo) => (
                  <button
                    key={wo.id}
                    onClick={() => {
                      if (wo.messages) {
                        const mapped = wo.messages.map(m => ({ role: m.role === 'ai' ? 'bot' : m.role, text: m.text }))
                        setMessages(mapped)
                        setStreamingIdx(-1)
                        setHistorySession(wo)
                        setUserHasSent(false)
                      }
                      setShowSidebar(false)
                    }}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/8 active:bg-white/12 transition-colors group focus:outline-none"
                  >
                    <MessageSquare size={14} className="text-white/30 group-hover:text-white/50 shrink-0 mt-0.5 transition-colors" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">{wo.customer}</p>
                      <p className="text-white/35 text-[11px] truncate mt-0.5">{wo.equipment.split('—')[0].trim()}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={9} className="text-white/25 shrink-0" />
                        <p className="text-white/25 text-[10px] tabular-nums">{wo.date}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-white/10">
              <p className="text-white/25 text-[10px] text-center">{TECHNICIAN.name} · {TECHNICIAN.branch}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common issues bottom sheet */}
      {showCommonIssues && (() => {
        const wo = WORK_ORDERS[contextWoId]
        const modelKey = wo ? Object.keys(MODEL_ISSUES).find(k => wo.equipment.includes(k)) : null
        const issues = contextWoId
          ? (modelKey ? MODEL_ISSUES[modelKey] : ANALYTICS.topQuestions)
          : GENERAL_PROMPTS.map(label => ({ label, count: null }))
        const maxCount = Math.max(...issues.map(q => q.count ?? 0))
        return (
          <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden rounded-[inherit]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowCommonIssues(false)} />
            <div className="relative bg-white rounded-t-2xl shadow-xl animate-fade-in max-h-[70%] flex flex-col">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
                <div>
                  <p className="text-hcsg-navy font-bold text-sm">Common Issues</p>
                  <p className="text-slate-400 text-xs mt-0.5">{modelKey ?? 'This model'} · tap to ask</p>
                </div>
                <button
                  onClick={() => setShowCommonIssues(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors"
                >
                  <X size={15} className="text-slate-500" />
                </button>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-50 pb-4">
                {issues.map((q, i) => {
                  const pct = maxCount > 0 ? Math.round((q.count / maxCount) * 100) : null
                  return (
                    <button
                      key={q.label}
                      onClick={() => { sendMessage(q.label); setShowCommonIssues(false) }}
                      className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 focus:outline-none transition-colors duration-150"
                    >
                      <span className="w-5 h-5 rounded-full bg-hcsg-orange/10 flex items-center justify-center text-[10px] font-bold text-hcsg-orange shrink-0 mt-0.5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 text-sm font-medium leading-snug">{q.label}</p>
                        {q.note && <p className="text-slate-400 text-xs mt-0.5 leading-snug">{q.note}</p>}
                        {pct !== null && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-hcsg-orange"
                                style={{ width: `${pct}%`, opacity: i === 0 ? 1 : 0.55 + (0.45 * pct / 100) }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tabular-nums shrink-0">{q.count} cases</span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {contextWoId && (
        <div className="px-4 pb-2 pt-1">
          <button
            onClick={() => setShowCommonIssues(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-hcsg-navy active:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,border-color,box-shadow] duration-150"
          >
            <LayoutList size={13} className="text-hcsg-orange" /> Common issues
          </button>
        </div>
      )}

      {onCompleteJob && userHasSent && (
        <div className="px-4 pt-2 pb-1 bg-white border-t border-slate-200">
          <button
            onClick={onCompleteJob}
            className="w-full min-h-11 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-2.5 text-sm font-semibold text-green-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-[transform,background-color,box-shadow] duration-150"
          >
            <CheckCircle size={15} /> Mark resolved
          </button>
        </div>
      )}
      <div className="px-4 pb-6 pt-2 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2 bg-hcsg-surface border border-slate-200 rounded-xl px-3 py-2.5">
          <button
            onClick={() => setVoiceOn(v => !v)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.96] ${
              voiceOn ? 'bg-hcsg-orange text-white' : 'bg-white text-slate-400 border border-slate-200'
            }`}
            aria-label="Voice input"
          >
            <Mic size={14} />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask what to check next..."
            className="flex-1 bg-transparent text-hcsg-navy text-sm outline-none placeholder:text-slate-400 min-w-0"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || thinking}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[transform,background-color,color,opacity] duration-150 active:scale-[0.96] ${
              input.trim() && !thinking ? 'bg-hcsg-orange text-white' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
