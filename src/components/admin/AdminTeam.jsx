import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, X } from 'lucide-react'
import { TEAM_TODAY } from '../../data'

const DEMO_THREADS = {
  JT: [
    { from: 'them', text: 'On site, starting inspection now.' },
    { from: 'me',   text: 'Good. Let me know if you need a second opinion on the brake.' },
    { from: 'them', text: 'Will do, advisor already flagged the air gap.' },
  ],
  MG: [
    { from: 'me',   text: 'How are you getting on at Baton Rouge?' },
    { from: 'them', text: 'Contactor replaced, testing the lift cycle now.' },
  ],
  DB: [
    { from: 'them', text: 'I need a manager sign-off before I proceed.' },
    { from: 'me',   text: 'I can see the thread. Give me 2 minutes.' },
  ],
  LF: [],
  CT: [
    { from: 'them', text: 'Parts staged and ready. Waiting on customer access.' },
  ],
  RM: [],
}

export default function AdminTeam() {
  const online = TEAM_TODAY.filter(t => t.online)
  const offline = TEAM_TODAY.filter(t => !t.online)
  const [chatMember, setChatMember] = useState(null)
  const [threads, setThreads] = useState(DEMO_THREADS)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const messages = chatMember ? (threads[chatMember.avatar] ?? []) : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatMember])

  function send() {
    const text = input.trim()
    if (!text || !chatMember) return
    setThreads(prev => ({
      ...prev,
      [chatMember.avatar]: [...(prev[chatMember.avatar] ?? []), { from: 'me', text }],
    }))
    setInput('')
  }

  function MemberRow({ member }) {
    const unread = (threads[member.avatar] ?? []).filter(m => m.from === 'them').length
    return (
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${member.online ? 'bg-hcsg-navy text-white' : 'bg-slate-200 text-slate-500'}`}>
            {member.avatar}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${member.online ? 'bg-green-500' : 'bg-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${member.online ? 'text-slate-800' : 'text-slate-500'}`}>{member.name}</p>
          <p className="text-slate-400 text-xs truncate">{member.site ?? member.status}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {member.wo && <p className="text-hcsg-navy text-xs font-bold tabular-nums">{member.wo}</p>}
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            member.status === 'Manager review' ? 'text-red-600 bg-red-50 border border-red-100' :
            member.status === 'With advisor'   ? 'text-hcsg-blue bg-blue-50 border border-blue-100' :
            member.status === 'In field'        ? 'text-green-700 bg-green-50 border border-green-100' :
            'text-slate-400 bg-slate-50 border border-slate-100'
          }`}>{member.status}</span>
          <button
            onClick={() => { setChatMember(member); setInput('') }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-hcsg-surface hover:bg-hcsg-orange/10 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20"
          >
            <Send size={13} className="text-hcsg-orange" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold">My Team</h1>
        <p className="text-slate-400 text-sm mt-1">{online.length} online · {TEAM_TODAY.filter(t => t.wo).length} on active work orders today</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <p className="text-hcsg-navy text-sm font-bold">Online now</p>
            </div>
            <div className="divide-y divide-slate-50">
              {online.map((member, i) => <MemberRow key={i} member={member} />)}
            </div>
          </div>

          {offline.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden opacity-60">
              <div className="px-5 py-3 border-b border-slate-100">
                <p className="text-hcsg-navy text-sm font-bold">Off shift</p>
              </div>
              <div className="divide-y divide-slate-50">
                {offline.map((member, i) => <MemberRow key={i} member={member} />)}
              </div>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col" style={{ height: 520 }}>
          {!chatMember ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-hcsg-surface flex items-center justify-center">
                <Send size={20} className="text-hcsg-orange" />
              </div>
              <p className="text-hcsg-navy font-semibold text-sm">Message a technician</p>
              <p className="text-slate-400 text-xs">Select a team member to open their chat thread.</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-hcsg-navy text-white flex items-center justify-center text-xs font-bold">
                    {chatMember.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${chatMember.online ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-hcsg-navy text-sm font-bold truncate">{chatMember.name}</p>
                  <p className="text-slate-400 text-xs">{chatMember.online ? 'Online' : 'Off shift'}</p>
                </div>
                <button onClick={() => setChatMember(null)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors focus:outline-none">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-slate-400 text-xs text-center mt-6">No messages yet. Say something.</p>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'me'
                        ? 'bg-hcsg-orange text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="px-3 py-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={`Message ${chatMember.name.split(' ')[0]}…`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-hcsg-navy placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-hcsg-orange/20 min-w-0"
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-[background-color,opacity] duration-150 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 disabled:opacity-40 bg-hcsg-orange text-white"
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
