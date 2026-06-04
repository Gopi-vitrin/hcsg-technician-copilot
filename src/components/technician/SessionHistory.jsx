import { Clock, ChevronRight, CheckCircle } from 'lucide-react'

const SESSIONS = [
  {
    id:        'S1',
    woId:      'WO-2847',
    equipment: 'Shaw-Box Series 800 — 2-Ton',
    model:     'SB800-2T',
    symptom:   'Load drifts',
    topFault:  'Motor brake disc worn — air gap exceeds 0.200"',
    time:      '2 hours ago',
    status:    'Resolved',
  },
  {
    id:        'S2',
    woId:      'WO-2851',
    equipment: 'Yale Y80 Series — 3-Ton',
    model:     'Y80-3T',
    symptom:   "Won't raise",
    topFault:  'Contactor assembly binding or coil burned out',
    time:      'Yesterday',
    status:    'Resolved',
  },
  {
    id:        'S3',
    woId:      'WO-2853',
    equipment: 'World Series 10-Ton Bridge Crane',
    model:     'WS3D-10T',
    symptom:   'No control power',
    topFault:  'No control voltage — transformer fuse blown',
    time:      '3 days ago',
    status:    'Resolved',
  },
]

export default function SessionHistory({ onResumeSession }) {
  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-5 pb-4">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Recent</p>
        <h1 className="text-hcsg-navy font-bold text-xl">Sessions</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {SESSIONS.map(session => (
          <button
            key={session.id}
            onClick={() => onResumeSession(session)}
            className="w-full text-left bg-white border border-slate-200 rounded-2xl p-4 space-y-3 active:bg-slate-50 transition-colors"
          >
            {/* Equipment + time */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-hcsg-navy font-bold text-sm">{session.equipment}</p>
                <p className="text-slate-400 text-xs mt-0.5">{session.model}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <Clock size={11} />
                <span className="text-xs">{session.time}</span>
              </div>
            </div>

            {/* Symptom chip */}
            <div>
              <span className="text-xs text-slate-500 bg-hcsg-surface border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                {session.symptom}
              </span>
            </div>

            {/* Top diagnosis — AI advisor style */}
            <div className="bg-hcsg-page border border-slate-200 border-l-4 border-l-hcsg-orange rounded-xl px-3 py-2.5">
              <p className="text-slate-600 text-xs leading-snug">{session.topFault}</p>
            </div>

            {/* Status + action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-500" />
                <span className="text-green-600 text-xs font-semibold">{session.status}</span>
              </div>
              <div className="flex items-center gap-1 text-hcsg-orange">
                <span className="text-xs font-semibold">View diagnosis</span>
                <ChevronRight size={13} />
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}
