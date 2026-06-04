import { useState } from 'react'
import { ArrowLeft, Bell, Briefcase, CheckCircle, ChevronDown, ChevronRight, Clock, HelpCircle, LogOut, MapPin, Package, Settings, Shield, AlertTriangle } from 'lucide-react'
import { TECHNICIAN, TECHNICIAN_HISTORY } from '../../data'

function SettingRow({ icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-slate-50 transition-colors ${danger ? 'text-red-500' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-50' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <span className={`flex-1 text-left text-sm font-medium ${danger ? 'text-red-500' : 'text-slate-700'}`}>{label}</span>
      {value && <span className="text-slate-400 text-xs">{value}</span>}
      {!danger && <ChevronRight size={15} className="text-slate-300 shrink-0" />}
    </button>
  )
}

function SettingsScreen({ onBack, onSignOut }) {
  return (
    <div className="flex flex-col h-full bg-hcsg-page overflow-y-auto">
      <div className="bg-white border-b border-slate-200 px-4 pt-4 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-hcsg-navy" />
        </button>
        <p className="text-hcsg-navy font-bold text-base">Settings</p>
      </div>

      <div className="mx-4 mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
        <SettingRow
          icon={<Bell size={15} className="text-slate-500" />}
          label="Notifications"
          value="On"
        />
        <SettingRow
          icon={<Shield size={15} className="text-slate-500" />}
          label="LOTO Reminders"
          value="On"
        />
        <SettingRow
          icon={<Briefcase size={15} className="text-slate-500" />}
          label="Branch"
          value={TECHNICIAN.branch}
        />
      </div>

      <div className="mx-4 mt-3 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
        <SettingRow
          icon={<HelpCircle size={15} className="text-slate-500" />}
          label="Help & Support"
        />
      </div>

      <div className="mx-4 mt-3 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <SettingRow
          icon={<LogOut size={15} className="text-red-400" />}
          label="Sign Out"
          onClick={onSignOut}
          danger
        />
      </div>

      <p className="text-center text-slate-300 text-xs mt-6">HCSG Field Advisor · v2.0</p>
    </div>
  )
}

const PREVIEW_COUNT = 2

function CompletedToday({ wos }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? wos : wos.slice(0, PREVIEW_COUNT)
  const hidden = wos.length - PREVIEW_COUNT

  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between mb-2.5 px-1 focus:outline-none"
      >
        <p className="text-slate-400 text-xs uppercase tracking-widest">Completed Today</p>
        <div className="flex items-center gap-1">
          {!expanded && hidden > 0 && (
            <span className="text-[11px] font-semibold text-slate-400 mr-0.5">+{hidden} more</span>
          )}
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div className="space-y-2">
        {visible.map((wo, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-hcsg-navy font-semibold text-sm">{wo.customer}</p>
                <p className="text-slate-400 text-xs mt-0.5 tabular-nums">{wo.id} · {wo.site}</p>
              </div>
              <div className={`flex items-center gap-1 shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                wo.faultConfirmed
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {wo.faultConfirmed ? <><CheckCircle size={10} /> Fixed</> : <><AlertTriangle size={10} /> Escalated</>}
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-1">{wo.equipment}</p>
            {wo.partsUsed && (
              <div className="flex items-center gap-1.5 mt-2">
                <Package size={11} className="text-hcsg-orange shrink-0" />
                <p className="text-slate-500 text-xs leading-snug">{wo.partsUsed}</p>
              </div>
            )}
            <p className="text-slate-300 text-xs mt-2 tabular-nums">{wo.completedAt}</p>
          </div>
        ))}
      </div>
      {expanded && wos.length > PREVIEW_COUNT && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full mt-2 py-2 text-xs font-semibold text-slate-400 hover:text-slate-500 transition-colors focus:outline-none"
        >
          Show less
        </button>
      )}
    </div>
  )
}

export default function Profile({ onSignOut, completedWOs = [] }) {
  const [showSettings, setShowSettings] = useState(false)

  if (showSettings) {
    return (
      <SettingsScreen
        onBack={() => setShowSettings(false)}
        onSignOut={onSignOut}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-page overflow-y-auto">

      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3 relative">
        <div className="w-12 h-12 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md shadow-hcsg-orange/20">
          {TECHNICIAN.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-hcsg-navy text-base font-bold leading-tight">{TECHNICIAN.name}</h1>
          <p className="text-hcsg-orange text-xs mt-0.5">{TECHNICIAN.role}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <p className="text-slate-400 text-xs">{TECHNICIAN.branch}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          <Settings size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Started today', value: String(TECHNICIAN.workOrders.length) },
          { label: 'Closed today',  value: String(completedWOs.length) },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl py-3 text-center">
            <p className="text-hcsg-navy font-bold text-lg tabular-nums">{s.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {completedWOs.length === 0 ? (
        <p className="text-slate-300 text-xs px-5 mb-4">No completed work orders yet today.</p>
      ) : (
        <CompletedToday wos={completedWOs} />
      )}

      <div className="mx-4 mb-4">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2.5 px-1">Previous Sessions</p>
        <div className="space-y-2">
          {TECHNICIAN_HISTORY.map(wo => (
            <div key={wo.id} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <p className="text-hcsg-navy font-semibold text-sm truncate">{wo.customer}</p>
                  <p className="text-slate-400 text-xs mt-0.5 tabular-nums">{wo.id} · {wo.site}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={9} /> Done
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-1.5">{wo.equipment.split('—')[0].trim()} · {wo.jobType}</p>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{wo.outcome}</p>
              {wo.partsUsed && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Package size={10} className="text-hcsg-orange shrink-0" />
                  <p className="text-slate-400 text-xs truncate">{wo.partsUsed.split('—')[0].trim()}</p>
                </div>
              )}
              <div className="flex items-center gap-1 mt-2">
                <Clock size={10} className="text-slate-300" />
                <p className="text-slate-300 text-xs tabular-nums">{wo.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6" />

    </div>
  )
}
