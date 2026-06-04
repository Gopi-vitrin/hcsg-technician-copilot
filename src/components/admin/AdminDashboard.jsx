import { ArrowRight, UserPlus, Wrench } from 'lucide-react'
import { ANALYTICS, LIVE_THREADS } from '../../data'


export default function AdminDashboard({ onNavigate }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const stats = [
    { label: 'Needs manager review', value: '3',  icon: UserPlus, route: 'workorders', note: 'Escalations waiting' },
    { label: 'Resolved today',        value: '18', icon: Wrench,   route: 'workorders', note: 'Closed work orders'  },
  ]
  const needsReview = LIVE_THREADS.filter(t => t.status === 'Manager review')

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold text-balance">Service Overview</h1>
        <p className="text-slate-400 text-sm mt-1 tabular-nums">{today} - Gulf Coast Region - 32 branches</p>
      </div>

      <div className="flex gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <button
              key={s.label}
              onClick={() => onNavigate(s.route)}
              className="flex-1 bg-white rounded-2xl px-6 py-4 text-left shadow-sm hover:shadow-md border border-slate-100 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[box-shadow,border-color,transform] duration-150 active:scale-[0.99] flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-hcsg-surface flex items-center justify-center shrink-0">
                <Icon size={17} className="text-hcsg-orange" />
              </div>
              <div>
                <p className="text-hcsg-navy text-3xl font-bold tabular-nums leading-none">{s.value}</p>
                <p className="text-slate-500 text-sm font-medium mt-1">{s.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.note}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Needs attention — only escalations */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-hcsg-navy font-bold text-base">Needs Your Attention</h2>
              <p className="text-slate-400 text-xs mt-0.5">Escalations waiting for manager review.</p>
            </div>
            <button onClick={() => onNavigate('workorders')} className="min-h-10 text-hcsg-blue text-xs font-semibold flex items-center gap-1 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-hcsg-blue/20 transition-[background-color,color] duration-150 hover:bg-blue-50">
              All sessions <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {needsReview.length === 0 ? (
              <p className="px-5 py-6 text-slate-400 text-sm">No escalations right now.</p>
            ) : needsReview.map((item, i) => {
              const lastMsg = item.transcript[item.transcript.length - 1]
              return (
                <button key={i} onClick={() => onNavigate('workorders')} className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,box-shadow] duration-150">
                  <div className="w-10 h-10 rounded-full bg-hcsg-orange text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {item.tech.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-slate-800 text-sm font-semibold">{item.tech}</p>
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">Review</span>
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">{item.age}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{item.site} · {item.equipment}</p>
                    <p className="text-slate-400 text-xs mt-1">{lastMsg.who}: {lastMsg.text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">{item.risk}</span>
                  </div>
                </button>
              )
            })}
            {/* Remaining active (non-escalation) threads as a compact count */}
            {LIVE_THREADS.filter(t => t.status !== 'Manager review').map((item, i) => {
              const lastMsg = item.transcript[item.transcript.length - 1]
              return (
                <button key={i} onClick={() => onNavigate('workorders')} className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,box-shadow] duration-150">
                  <div className="w-10 h-10 rounded-full bg-hcsg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {item.tech.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-slate-800 text-sm font-semibold">{item.tech}</p>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">Active</span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{item.age}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{item.site} · {item.equipment}</p>
                    {lastMsg && <p className="text-slate-400 text-xs mt-1 truncate">{lastMsg.who}: {lastMsg.text}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">{item.issue}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-hcsg-navy font-bold text-base">Common Issues</h2>
            <button onClick={() => onNavigate('analytics')} className="min-h-10 text-hcsg-blue text-xs font-semibold flex items-center gap-1 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-hcsg-blue/20 transition-[background-color,color] duration-150 hover:bg-blue-50">
              Details <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {ANALYTICS.topQuestions.map((q, i) => {
              const max = ANALYTICS.topQuestions[0].count
              return (
                <div key={q.label} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 text-xs flex-1">{q.label}</span>
                    <span className="text-slate-500 text-xs font-semibold tabular-nums">{q.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-hcsg-orange" style={{ width: `${(q.count / max) * 100}%`, opacity: i === 0 ? 1 : 0.55 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>


    </div>
  )
}
