import { CheckCircle, Clock, MapPin, Smartphone } from 'lucide-react'
import { TECHNICIAN } from '../../data'

const TEAM = [
  { name: 'Jake Thibodaux',    role: 'Field Tech — Fast Track', branch: 'New Orleans, LA',  avatar: 'JT', status: 'active',   lastActive: 'Now',         queriesThisMonth: 12, woOpen: 3 },
  { name: 'Raymond Fontenot',  role: 'Senior Field Tech',        branch: 'New Orleans, LA',  avatar: 'RF', status: 'active',   lastActive: '2h ago',      queriesThisMonth: 8,  woOpen: 2 },
  { name: 'Daryl Broussard',   role: 'Field Technician',         branch: 'Baton Rouge, LA',  avatar: 'DB', status: 'active',   lastActive: '4h ago',      queriesThisMonth: 5,  woOpen: 1 },
  { name: 'Marcus Guidry',     role: 'Senior Field Tech',        branch: 'Houston, TX',      avatar: 'MG', status: 'active',   lastActive: 'Yesterday',   queriesThisMonth: 19, woOpen: 1 },
  { name: 'Terrence Williams', role: 'Field Technician',         branch: 'Freeport, TX',     avatar: 'TW', status: 'inactive', lastActive: '3 days ago',  queriesThisMonth: 0,  woOpen: 0 },
]

const STATUS_COLORS = {
  active:   { dot: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  inactive: { dot: 'bg-slate-300', text: 'text-slate-400', bg: 'bg-slate-50 border-slate-100' },
}

export default function AdminTeam() {
  const activeCount = TEAM.filter(t => t.status === 'active').length

  return (
    <div className="p-8 max-w-5xl">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-hcsg-navy text-2xl font-bold">Team</h1>
          <p className="text-slate-400 text-sm mt-1">Gulf Coast Region · {TEAM.length} technicians · {activeCount} active today</p>
        </div>
        <button className="flex items-center gap-2 bg-hcsg-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-hcsg-light-orange shadow-sm transition-colors">
          <Smartphone size={15} />
          Invite Technician
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total technicians', value: TEAM.length },
          { label: 'Using AI this month', value: TEAM.filter(t => t.queriesThisMonth > 0).length },
          { label: 'Avg queries / tech', value: Math.round(TEAM.reduce((s, t) => s + t.queriesThisMonth, 0) / TEAM.length) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-hcsg-navy text-2xl font-bold">{s.value}</p>
            <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-hcsg-navy font-semibold text-sm">Technician Roster</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {TEAM.map((tech, i) => {
            const sc = STATUS_COLORS[tech.status]
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-hcsg-navy flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {tech.avatar}
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-semibold">{tech.name}</p>
                  <p className="text-slate-400 text-xs">{tech.role}</p>
                </div>

                {/* Branch */}
                <div className="flex items-center gap-1 text-slate-400 text-xs w-36 shrink-0">
                  <MapPin size={11} />
                  {tech.branch}
                </div>

                {/* Last active */}
                <div className="flex items-center gap-1 text-slate-400 text-xs w-24 shrink-0">
                  <Clock size={11} />
                  {tech.lastActive}
                </div>

                {/* AI queries */}
                <div className="text-center w-20 shrink-0">
                  <p className="text-slate-700 text-sm font-semibold">{tech.queriesThisMonth}</p>
                  <p className="text-slate-400 text-xs">AI queries</p>
                </div>

                {/* Open WOs */}
                <div className="text-center w-16 shrink-0">
                  <p className="text-slate-700 text-sm font-semibold">{tech.woOpen}</p>
                  <p className="text-slate-400 text-xs">open WOs</p>
                </div>

                {/* Status */}
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {tech.status === 'active' ? 'Active' : 'Offline'}
                </span>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-slate-400 text-xs">Showing Gulf Coast Region · 375 technicians total across 32 branches · <span className="text-hcsg-blue cursor-pointer hover:underline">View all regions</span></p>
        </div>
      </div>
    </div>
  )
}
