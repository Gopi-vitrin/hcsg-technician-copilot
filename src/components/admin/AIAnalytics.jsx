import { MessageSquare, PackageCheck, RefreshCw, TrendingUp } from 'lucide-react'
import { ANALYTICS } from '../../data'

export default function AIAnalytics() {
  const maxCount = Math.max(...ANALYTICS.topQuestions.map(q => q.count))
  const partsDemand = [
    { part: 'Friction Disc Kit 800-5005',    demand: 'High',   count: 6, stock: '2 days stock'   },
    { part: 'Control Transformer 800-671',   demand: 'Medium', count: 3, stock: '~1 week stock'  },
    { part: 'Wire Rope 800-145',             demand: 'Medium', count: 2, stock: 'In stock'        },
  ]

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold text-balance">AI Insights</h1>
        <p className="text-slate-400 text-sm mt-1 text-pretty">Top recurring issues across your branch — last 30 days.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Most common topic',    value: 'Brake adjustment',    icon: MessageSquare },
          { label: 'Training opportunity', value: 'Wire rope inspection', icon: TrendingUp    },
          { label: 'Repeat-visit driver',  value: 'Brake drift',         icon: RefreshCw     },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 transition-[box-shadow,border-color] duration-150 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-hcsg-surface">
                <Icon size={16} className="text-hcsg-orange" />
              </div>
              <div>
                <p className="text-hcsg-navy text-base font-bold leading-tight">{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-hcsg-navy font-semibold text-sm mb-5">Most Common Field Questions This Month</h2>
            <div className="space-y-4">
              {ANALYTICS.topQuestions.map((q, i) => (
                <div key={q.label} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-700 text-sm flex-1 text-pretty">{q.label}</span>
                    <span className="text-slate-500 text-sm font-semibold shrink-0 tabular-nums">{q.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-hcsg-orange transition-[width,opacity] duration-700"
                      style={{ width: `${(q.count / maxCount) * 100}%`, opacity: i === 0 ? 1 : 0.58 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <p className="text-slate-600 text-sm font-medium">First-visit resolution</p>
            <div className="text-right">
              <p className="text-hcsg-navy text-sm font-bold tabular-nums">73%</p>
              <p className="text-slate-400 text-xs mt-0.5">Jobs resolved without a return visit</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-hcsg-navy font-semibold text-sm mb-4">Manager Actions</h2>
          <div className="space-y-3">
            {[
              'Review wire rope inspection questions in the next safety huddle.',
              'Add a short brake-adjustment training note to onboarding.',
              'Upload work order history for repeated load-drift fixes.',
            ].map(item => (
              <button key={item} className="w-full rounded-xl border border-slate-100 bg-hcsg-surface px-4 py-3 text-left hover:border-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,border-color,box-shadow] duration-150">
                <p className="text-slate-600 text-sm leading-relaxed text-pretty">{item}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <PackageCheck size={16} className="text-hcsg-orange" />
            <h2 className="text-hcsg-navy font-semibold text-sm">Parts Demand</h2>
          </div>
          <div className="space-y-3">
            {partsDemand.map(item => (
              <div key={item.part} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-slate-700 text-xs font-semibold truncate">{item.part}</p>
                  <p className="text-slate-400 text-xs">{item.stock}</p>
                </div>
                <span className="rounded-full bg-hcsg-orange/10 px-2 py-1 text-xs font-bold text-hcsg-orange tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
