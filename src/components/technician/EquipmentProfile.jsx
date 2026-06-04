import { ArrowLeft, CheckCircle, FileText, RefreshCw, Tag } from 'lucide-react'

const EQUIPMENT = {
  manufacturer: 'Yale·Lift-Tech / Columbus McKinnon',
  model:        'Shaw-Box Series 800',
  capacity:     '2-Ton',
  serial:       'SB800-2T-4471',
  type:         'Wire Rope Electric Hoist',
  manual:       'Shaw-Box 800 Service Manual rev.4',
  manualPages:  312,
}

const SOURCE_LABELS = {
  qr:     { label: 'QR scan',      cls: 'text-green-700 bg-green-50 border-green-200' },
  photo:  { label: 'Tag photo',    cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  search: { label: 'Manual entry', cls: 'text-slate-600 bg-slate-50 border-slate-200' },
}

const FIELDS = [
  ['Capacity', EQUIPMENT.capacity],
  ['Type',     EQUIPMENT.type],
  ['Serial',   EQUIPMENT.serial],
]

export default function EquipmentProfile({ identifiedFrom, onBack, onConfirm }) {
  const src = SOURCE_LABELS[identifiedFrom] ?? SOURCE_LABELS.search

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      <div className="bg-white border-b border-slate-200 px-4 pt-4 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-hcsg-navy" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-hcsg-navy font-bold text-sm">Confirm equipment</p>
          <p className="text-slate-400 text-xs">Check the match before continuing</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${src.cls}`}>
          {src.label}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 pt-5 pb-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-hcsg-navy font-bold text-base text-balance">{EQUIPMENT.model}</p>
                <p className="text-slate-500 text-xs mt-0.5">{EQUIPMENT.manufacturer}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Tag size={18} className="text-slate-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {FIELDS.map(([label, value]) => (
                <div key={label}>
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-hcsg-navy text-sm font-semibold mt-0.5 tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-hcsg-navy/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-hcsg-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-hcsg-navy text-sm font-bold truncate">{EQUIPMENT.manual}</p>
            <p className="text-slate-400 text-xs mt-0.5">{EQUIPMENT.manualPages} pages · Indexed and ready</p>
          </div>
          <CheckCircle size={16} className="text-green-500 shrink-0" />
        </div>

        <p className="text-slate-500 text-sm text-center text-pretty px-4">
          Wrong match? Tap "Change equipment" below to rescan or enter the model manually.
        </p>

      </div>

      <div className="px-4 pb-6 pt-3 bg-white border-t border-slate-200 space-y-2.5">
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 bg-hcsg-orange text-white font-bold text-base py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-hcsg-orange/20"
        >
          <CheckCircle size={18} /> Confirm and continue
        </button>
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-slate-500 font-semibold text-sm py-3 rounded-2xl border border-slate-200 bg-white active:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} /> Change equipment
        </button>
      </div>

    </div>
  )
}
