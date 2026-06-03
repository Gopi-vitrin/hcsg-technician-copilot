import { useState } from 'react'
import { CheckCircle, Clock, MapPin, Smartphone, X, Send } from 'lucide-react'
import { TECHNICIAN } from '../../data'

const BRANCHES = [
  'New Orleans, LA', 'Baton Rouge, LA', 'Houston, TX', 'Freeport, TX',
  'Sulphur, LA', 'Beaumont, TX', 'Lake Charles, LA', 'Dallas, TX',
]
const ROLES = ['Field Technician', 'Senior Field Tech', 'Field Tech — Fast Track', 'Lead Technician']

function InviteModal({ onClose, onInvited }) {
  const [form,  setForm]  = useState({ name: '', email: '', branch: '', role: 'Field Technician' })
  const [stage, setStage] = useState('form') // form | sending | done

  const valid = form.name.trim() && form.email.includes('@') && form.branch

  function handleSend() {
    setStage('sending')
    setTimeout(() => setStage('done'), 1400)
    setTimeout(() => {
      onInvited({
        name:   form.name,
        role:   form.role,
        branch: form.branch,
        avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        status: 'inactive',
        lastActive: 'Invited',
        queriesThisMonth: 0,
        woOpen: 0,
      })
    }, 2200)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hcsg-navy flex items-center justify-center">
              <Smartphone size={14} className="text-white" />
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">Invite Technician</p>
              <p className="text-slate-400 text-xs">They'll receive a Teams message with app access</p>
            </div>
          </div>
          {stage === 'form' && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          )}
        </div>

        <div className="px-6 py-5 space-y-4">

          {stage === 'form' && (
            <>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Michael Tran"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-hcsg-orange"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-1.5">Work Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="mtran@hoistcrane.com"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm focus:outline-none focus:border-hcsg-orange"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-1.5">Branch</label>
                  <select
                    value={form.branch}
                    onChange={e => set('branch', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm bg-white focus:outline-none focus:border-hcsg-orange"
                  >
                    <option value="">Select branch...</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={e => set('role', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm bg-white focus:outline-none focus:border-hcsg-orange"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#6264A7' }}>
                  <svg width="10" height="10" viewBox="0 0 18 18" fill="none">
                    <path d="M11.5 5.5C11.5 6.88 10.38 8 9 8C7.62 8 6.5 6.88 6.5 5.5C6.5 4.12 7.62 3 9 3C10.38 3 11.5 4.12 11.5 5.5Z" fill="white"/>
                    <path d="M4 9V13C4 13.55 4.45 14 5 14H11C11.55 14 12 13.55 12 13V9C12 8.45 11.55 8 11 8H5C4.45 8 4 8.45 4 9Z" fill="white"/>
                  </svg>
                </div>
                <p className="text-blue-600 text-xs leading-relaxed">
                  Invitation will be sent via Microsoft Teams and includes a one-tap setup link for the Technician Copilot app.
                </p>
              </div>
            </>
          )}

          {stage === 'sending' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-hcsg-orange/30 border-t-hcsg-orange animate-spin shrink-0" />
              <div>
                <p className="text-slate-700 text-sm font-medium">Sending Teams invitation...</p>
                <p className="text-slate-400 text-xs">{form.email}</p>
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-slate-700 text-sm font-semibold">Invitation sent to {form.name.split(' ')[0]}</p>
                <p className="text-slate-400 text-xs">They'll appear in the roster once they activate their account</p>
              </div>
            </div>
          )}
        </div>

        {stage === 'form' && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700">Cancel</button>
            <button
              onClick={handleSend}
              disabled={!valid}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                valid ? 'bg-hcsg-orange text-white hover:bg-hcsg-light-orange' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
              Send Invitation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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
  const [showInvite,  setShowInvite]  = useState(false)
  const [extraTechs,  setExtraTechs]  = useState([])
  const [successName, setSuccessName] = useState(null)

  function handleInvited(tech) {
    setShowInvite(false)
    setExtraTechs(prev => [...prev, tech])
    setSuccessName(tech.name.split(' ')[0])
    setTimeout(() => setSuccessName(null), 4000)
  }

  const allTechs    = [...TEAM, ...extraTechs]
  const activeCount = allTechs.filter(t => t.status === 'active').length

  return (
    <div className="p-8 max-w-5xl">

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={handleInvited} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-hcsg-navy text-2xl font-bold">Team</h1>
          <p className="text-slate-400 text-sm mt-1">Gulf Coast Region · {allTechs.length} technicians · {activeCount} active today</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-hcsg-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-hcsg-light-orange shadow-sm transition-colors"
        >
          <Smartphone size={15} />
          Invite Technician
        </button>
      </div>

      {successName && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-5">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <p className="text-green-700 text-sm font-medium">Invitation sent to {successName} — they'll appear below once they activate.</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total technicians',  value: allTechs.length },
          { label: 'Using AI this month', value: allTechs.filter(t => t.queriesThisMonth > 0).length },
          { label: 'Avg queries / tech', value: Math.round(allTechs.reduce((s, t) => s + t.queriesThisMonth, 0) / allTechs.length) || 0 },
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
          {allTechs.map((tech, i) => {
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
