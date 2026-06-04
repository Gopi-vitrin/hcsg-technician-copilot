import { useEffect, useRef, useState } from 'react'
import { FileText, MessageSquare, Phone, Share2, Zap } from 'lucide-react'
import { LIVE_THREADS, TEAM_TODAY } from '../../data'

const TEAMS_PURPLE = '#6264A7'

const STATUS_PRIORITY = {
  'Manager review': 0,
  'Advisor active': 1,
  'With advisor':   1,
  'In field':       2,
  'Break':          3,
  'Inactive':       4,
  'Off today':      5,
}

const STATUS_STYLES = {
  'Manager review': 'text-red-600 bg-red-50 border-red-100',
  'Advisor active': 'text-blue-600 bg-blue-50 border-blue-100',
  'With advisor':   'text-blue-600 bg-blue-50 border-blue-100',
  'In field':       'text-green-700 bg-green-50 border-green-100',
  'Break':          'text-amber-600 bg-amber-50 border-amber-100',
  'Inactive':       'text-slate-400 bg-slate-50 border-slate-100',
  'Off today':      'text-slate-400 bg-slate-50 border-slate-100',
}

// Extra simulated techs to reflect a real team size
const EXTRA_TECHS = [
  { id: 'WO-2860', tech: 'Antoine Bergeron',  site: 'Shell Norco — Norco, LA',         equipment: 'Yale Y45 - 1-Ton',           issue: 'Load drift under power',       status: 'Advisor active', transcript: [{ who: 'Technician', text: 'Hook keeps drifting when I let go.' }, { who: 'Advisor', text: 'Likely overload clutch wear. Verify load is within rated capacity, then inspect clutch friction surfaces.' }] },
  { id: 'WO-2862', tech: 'Tammy Trosclair',   site: 'BASF — Geismar, LA',              equipment: 'Coffing JLM - 2-Ton',         issue: 'Chain jammed',                 status: 'In field',       transcript: [] },
  { id: 'WO-2865', tech: 'Ray Guidroz',        site: 'Huntsman — Port Neches, TX',      equipment: 'World Series - 10-Ton',       issue: 'Preventive maintenance',       status: 'In field',       transcript: [
    { who: 'Technician', text: 'Starting quarterly PM on the World Series 10-Ton at Huntsman. Where do you want me to start?' },
    { who: 'Advisor', text: 'Start with a full visual on the bridge girders, end trucks, and runway rails — look for cracks, loose clips, or deformation. Then move to the wire rope. On a 10-Ton World Series, discard criteria is 6 broken wires in any one rope lay.' },
    { who: 'Technician', text: 'Structural looks clean. Wire rope has some surface corrosion near the drum but no broken wires. Diameter measures 0.49" — nominal is 0.500".' },
    { who: 'Advisor', text: 'A 0.010" reduction is within tolerance — nominal allowable loss is 1/64" (0.016"). Clean the rope and apply lubricant. Note the corrosion location in your report and flag for re-inspection at next PM. Check brake air gap next — spec on this unit is 0.085–0.105".' },
    { who: 'Technician', text: 'Brake air gap at 0.098". Limit switches tested good both upper and lower. Any other checks before I sign off?' },
    { who: 'Advisor', text: 'Verify all electrical panel fasteners are tight, check contactor contact faces for pitting, and confirm the hook latch closes fully under load. If all clear, PM is complete — document wire rope lube and corrosion note, then sign the inspection record.' },
  ] },
  { id: 'WO-2867', tech: 'Sandra Meaux',       site: 'ExxonMobil — Baton Rouge, LA',   equipment: 'Shaw-Box 800 - 2-Ton',        issue: 'Annual PM inspection',         status: 'In field',       transcript: [] },
  { id: 'WO-2869', tech: 'Travis Fontenot',    site: 'Dow Chemical — Freeport, TX',    equipment: 'Yale Y80 - 3-Ton',            issue: 'Overload trip fault',          status: 'Advisor active', transcript: [{ who: 'Technician', text: 'Overload light came on. Load feels within limits.' }, { who: 'Advisor', text: 'Check the overload clutch adjustment — if set too tight it can trip under rated load. Also verify actual load weight before adjusting.' }] },
  { id: 'team-PB', tech: 'Paul Boudreaux',     site: 'Denka — LaPlace, LA',             equipment: '—', issue: 'Break',           status: 'Break',      transcript: [], teamOnly: true, online: true },
  { id: 'team-VT', tech: 'Veronica Tran',      site: 'Sasol — Lake Charles, LA',        equipment: '—', issue: 'Off today',       status: 'Off today',  transcript: [], teamOnly: true, online: false },
  { id: 'team-RD', tech: 'Robbie Dugas',       site: '—',                               equipment: '—', issue: 'Off today',       status: 'Off today',  transcript: [], teamOnly: true, online: false },
]

const LIVE_IDS = new Set(LIVE_THREADS.map(t => t.tech))

const ALL_TECHS = [
  ...LIVE_THREADS,
  ...EXTRA_TECHS.filter(t => !LIVE_IDS.has(t.tech)),
  ...TEAM_TODAY
    .filter(m => !LIVE_IDS.has(m.name) && !EXTRA_TECHS.find(e => e.tech === m.name))
    .map(m => ({
      id: m.wo ?? `t-${m.avatar}`,
      tech: m.name,
      site: m.site ?? '—',
      equipment: '—',
      issue: m.status,
      status: m.status,
      transcript: [],
      teamOnly: true,
      online: m.online,
    })),
].sort((a, b) => (STATUS_PRIORITY[a.status] ?? 3) - (STATUS_PRIORITY[b.status] ?? 3))

function TeamsIcon({ size = 12, color = TEAMS_PURPLE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.19 8.77a4 4 0 1 0-4.38-4.38A4 4 0 0 0 19.19 8.77zM18 10h-1a5 5 0 0 0-5 5v1h7v-1a5 5 0 0 0-1-3zM8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20v-1a5 5 0 0 1 10 0v1z"/>
    </svg>
  )
}

export default function WorkOrderMonitoring() {
  const [selected, setSelected]       = useState(ALL_TECHS[0])
  const [transcripts, setTranscripts] = useState(() => {
    const init = Object.fromEntries(LIVE_THREADS.map(t => [t.id, [...t.transcript]]))
    EXTRA_TECHS.forEach(t => { if (t.transcript?.length) init[t.id] = [...t.transcript] })
    return init
  })
  const [aiQuery,  setAiQuery]  = useState('')
  const [aiAnswer, setAiAnswer] = useState(null)
  const [asking,   setAsking]   = useState(false)
  const transcriptRef = useRef(null)

  useEffect(() => {
    setAiAnswer(null)
    setAiQuery('')
  }, [selected])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcripts, selected])

  function askAI(preset) {
    const q = preset || aiQuery.trim()
    if (!q || asking) return
    setAiQuery('')
    setAsking(true)
    const firstName = selected.tech.split(' ')[0]
    const t = transcripts[selected.id] ?? []
    setTimeout(() => {
      setAiAnswer(
        q.toLowerCase().includes('next')
          ? `Based on the session, ${firstName} should check whether the contactor produces a click sound. Silence = coil or push-button issue. Click with no movement = power path or motor.`
          : q.toLowerCase().includes('safe') || q.toLowerCase().includes('proceed')
          ? 'LOTO was acknowledged in the session. Removing the brake cover is safe once zero-energy state is verified at the lockout point.'
          : `${firstName} is on ${selected.equipment ?? 'unassigned equipment'} at ${selected.site}. Issue: "${selected.issue}". ${t.length} exchange${t.length !== 1 ? 's' : ''} logged. No resolution confirmed yet.`
      )
      setAsking(false)
    }, 950)
  }

  const transcript = transcripts[selected.id] ?? selected.transcript ?? []
  const hasSession = !selected.teamOnly && transcript.length > 0
  const firstName  = selected.tech.split(' ')[0]
  const initials   = selected.tech.split(' ').map(n => n[0]).join('').slice(0, 2)
  const isLiveSession = !selected.teamOnly

  return (
    <div className="max-w-7xl">

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-hcsg-navy text-2xl font-bold">Field AI Activity</h1>
          <p className="text-slate-400 text-sm mt-1">Select a technician to see their full AI session history.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-700 text-xs font-semibold tabular-nums">{LIVE_THREADS.length + EXTRA_TECHS.filter(t => t.status === 'Advisor active').length} active sessions</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4" style={{ height: 'calc(100vh - 196px)' }}>

        {/* Left: tech list */}
        <div className={`${hasSession ? 'col-span-3' : 'col-span-4'} bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all duration-300`}>
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <p className="text-hcsg-navy text-sm font-bold">All Technicians</p>
            <p className="text-slate-400 text-xs mt-0.5 tabular-nums">
              {ALL_TECHS.filter(t => !t.teamOnly).length} AI sessions · {TEAM_TODAY.filter(t => t.online).length} online
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50" style={{ direction: 'rtl' }}>
            {ALL_TECHS.filter(t => t.status !== 'Off today').map(tech => {
              const isSelected = selected.id === tech.id
              const isActive   = !tech.teamOnly
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelected(tech)}
                  className={`w-full px-4 py-3 text-left focus:outline-none transition-[background-color] duration-150 relative ${
                    isSelected ? 'bg-hcsg-orange/10' : 'hover:bg-slate-50'
                  }`}
                  style={isSelected ? { direction: 'ltr', borderLeft: '3px solid #e65e25' } : { direction: 'ltr' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive ? 'bg-hcsg-navy text-white' : tech.online !== false ? 'bg-slate-300 text-slate-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {tech.tech.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-semibold truncate">{tech.tech}</p>
                      {isActive && (
                        <p className="text-xs truncate mt-0.5 font-medium text-hcsg-navy">
                          {tech.issue}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: full session view */}
        <div className={`${hasSession ? 'col-span-9' : 'col-span-8'} bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 border ${hasSession ? 'border-hcsg-orange/30' : 'border-slate-100'}`}>

          {/* Compact header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isLiveSession ? 'bg-hcsg-navy text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-hcsg-navy font-bold text-sm">{selected.tech}</p>
                  {!['In field', 'Break'].includes(selected.status) && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[selected.status] ?? STATUS_STYLES['Inactive']}`}>
                      {selected.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-4 w-px bg-slate-200" />
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white active:scale-[0.97] focus:outline-none transition-[opacity,transform] duration-150 hover:opacity-90"
                style={{ background: TEAMS_PURPLE }}
              >
                <TeamsIcon size={13} color="white" /> Teams
              </button>
              {[
                { label: 'Chat',  Icon: MessageSquare },
                { label: 'Call',  Icon: Phone },
                { label: 'Share', Icon: Share2 },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold active:scale-[0.97] focus:outline-none transition-[opacity,transform] duration-150 hover:opacity-80"
                  style={{ background: TEAMS_PURPLE + '15', color: TEAMS_PURPLE }}
                >
                  <Icon size={10} /> {label}
                </button>
              ))}
            </div>
          </div>

          {hasSession ? (
            <>
              {/* Bridge label */}
              <div className="px-5 py-2 bg-hcsg-orange/5 border-b border-hcsg-orange/10 shrink-0 flex items-center gap-2">
                <FileText size={11} className="text-hcsg-orange shrink-0" />
                <p className="text-[11px] text-hcsg-orange font-semibold">AI session — {selected.equipment !== '—' ? selected.equipment : selected.id}</p>
                <span className="ml-auto text-[10px] text-hcsg-orange/60 font-medium tabular-nums">{transcript.length} message{transcript.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Transcript — main real estate */}
              <div ref={transcriptRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {transcript.map((msg, i) => (
                  <div key={i} className={`flex ${msg.who === 'Technician' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-pretty ${
                      msg.who === 'Technician'
                        ? 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                        : msg.who === 'Manager'
                        ? 'bg-hcsg-orange text-white rounded-br-sm'
                        : 'bg-hcsg-navy text-white rounded-br-sm'
                    }`}>
                      <p className={`text-[10px] font-bold mb-1 ${msg.who === 'Technician' ? 'text-slate-400' : 'text-white/60'}`}>{msg.who}</p>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-slate-100">

                {/* Ask AI chips row */}
                <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={11} className="text-hcsg-orange shrink-0" fill="currentColor" />
                    <p className="text-[11px] font-semibold text-slate-500">Ask Advisor about this session</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[`What should ${firstName} try next?`, `Safe to proceed?`].map(q => (
                      <button
                        key={q}
                        onClick={() => askAI(q)}
                        className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full hover:border-hcsg-orange/40 hover:text-hcsg-navy transition-[border-color,color] duration-150 whitespace-nowrap"
                      >
                        {q}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={e => setAiQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && askAI()}
                      placeholder="Ask AI…"
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-hcsg-navy placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-hcsg-orange/20 min-w-0"
                    />
                    <button
                      onClick={() => askAI()}
                      disabled={!aiQuery.trim() || asking}
                      className="px-2.5 py-1 rounded-lg bg-hcsg-orange text-white text-[11px] font-semibold disabled:opacity-40 transition-opacity shrink-0"
                    >
                      {asking ? '…' : 'Ask'}
                    </button>
                  </div>
                  {aiAnswer && (
                    <div className="mt-2 bg-white border border-hcsg-orange/20 rounded-xl px-3 py-2 text-xs text-slate-700 leading-relaxed animate-fade-in">
                      <span className="flex items-center gap-1 text-hcsg-orange text-[10px] font-bold mb-0.5"><Zap size={8} fill="currentColor" /> Advisor</span>
                      {aiAnswer}
                    </div>
                  )}
                </div>

                {/* Summarise — prominent full-width bar */}
                <div className="px-5 py-3">
                  <button
                    onClick={() => askAI('Summarize this session')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-hcsg-orange text-white font-bold text-sm hover:bg-hcsg-orange/90 active:scale-[0.99] transition-[background-color,transform] duration-150 shadow-sm shadow-hcsg-orange/20"
                  >
                    <Zap size={14} fill="currentColor" /> Summarise session
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-8 gap-6">
              {/* Tech identity */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold ${
                  selected.online !== false ? 'bg-hcsg-navy text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {initials}
                </div>
                <div>
                  <p className="text-hcsg-navy font-bold text-sm">{selected.tech}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{selected.site !== '—' ? selected.site : '—'}</p>
                </div>
              </div>

              {/* Teams card */}
              <div className="w-full max-w-sm rounded-2xl border-2 overflow-hidden shadow-lg" style={{ borderColor: TEAMS_PURPLE }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ background: TEAMS_PURPLE }}>
                  <TeamsIcon size={22} color="white" />
                  <div>
                    <p className="text-white font-bold text-sm">Microsoft Teams</p>
                    <p className="text-white/70 text-xs">Reach {firstName} directly</p>
                  </div>
                </div>
                <div className="bg-white px-5 py-4 space-y-2.5">
                  {[
                    { label: `Chat with ${firstName}`,         Icon: MessageSquare, primary: true  },
                    { label: `Call ${firstName}`,              Icon: Phone,         primary: false },
                    { label: `Share session notes`,            Icon: Share2,        primary: false },
                  ].map(({ label, Icon, primary }) => (
                    <button
                      key={label}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-[opacity,transform] duration-150 active:scale-[0.98] hover:opacity-90 ${primary ? 'text-white' : 'border-2'}`}
                      style={primary
                        ? { background: TEAMS_PURPLE }
                        : { borderColor: TEAMS_PURPLE, color: TEAMS_PURPLE, background: TEAMS_PURPLE + '0D' }
                      }
                    >
                      <Icon size={16} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
