import { useState } from 'react'
import { ArrowLeft, CheckCircle, MapPin, Wrench, AlertTriangle, ChevronDown } from 'lucide-react'

const JOB_TYPES   = ['Routine PM', 'Corrective Repair', 'Emergency Repair', 'Annual Inspection']
const PRIORITIES  = ['High', 'Medium']

let woCounter = 2900

export default function NewWorkOrder({ onBack, onCreate }) {
  const [customer,    setCustomer]    = useState('')
  const [site,        setSite]        = useState('')
  const [equipment,   setEquipment]   = useState('')
  const [serialNo,    setSerialNo]    = useState('')
  const [hours,       setHours]       = useState('')
  const [complaint,   setComplaint]   = useState('')
  const [jobType,     setJobType]     = useState('Corrective Repair')
  const [priority,    setPriority]    = useState('Medium')

  const canSubmit = customer.trim() && site.trim() && equipment.trim() && complaint.trim()

  function handleCreate() {
    if (!canSubmit) return
    const id = `WO-${++woCounter}`
    const wo = {
      id,
      status:        'In Progress',
      priority,
      customer:      customer.trim(),
      site:          site.trim(),
      equipment:     equipment.trim(),
      serialNumber:  serialNo.trim() || 'N/A',
      complaint:     complaint.trim(),
      jobType,
      scheduledDate: 'Today',
      lastService:   'Unknown',
      hoursOnUnit:   Number(hours) || 0,
      aiReady:       false,
      predictions:   [],
      equipmentHistory: [],
      adaptiveQuestions: [],
      resolutionSteps:   [],
      parts:         '',
      defaultNote:   '',
      jobTime:       null,
    }
    onCreate(wo)
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 active:bg-white/15 transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <p className="text-white font-semibold text-sm">New Work Order</p>
          <p className="text-white/40 text-xs">Manually created job</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

        {/* Priority */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Priority</p>
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  priority === p
                    ? p === 'High'
                      ? 'bg-hcsg-dark-red/25 border border-hcsg-dark-red/50 text-red-300'
                      : 'bg-hcsg-amber/20 border border-hcsg-amber/40 text-hcsg-amber'
                    : 'bg-white/5 border border-white/10 text-white/40'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Job type */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Job Type</p>
          <div className="grid grid-cols-2 gap-2">
            {JOB_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setJobType(t)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                  jobType === t
                    ? 'bg-hcsg-orange/20 border border-hcsg-orange/40 text-hcsg-orange'
                    : 'bg-white/5 border border-white/10 text-white/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Customer */}
        <Field
          label="Customer *"
          icon={<MapPin size={14} className="text-hcsg-orange" />}
          value={customer}
          onChange={setCustomer}
          placeholder="e.g. Shell Chemical"
        />

        {/* Site */}
        <Field
          label="Site / Location *"
          icon={<MapPin size={14} className="text-white/30" />}
          value={site}
          onChange={setSite}
          placeholder="e.g. Geismar, LA"
        />

        {/* Equipment */}
        <Field
          label="Equipment *"
          icon={<Wrench size={14} className="text-hcsg-orange" />}
          value={equipment}
          onChange={setEquipment}
          placeholder="e.g. Shaw-Box 800 — 2-Ton Wire Rope Hoist"
        />

        {/* Serial number + hours row */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Serial No."
            value={serialNo}
            onChange={setSerialNo}
            placeholder="S/N (optional)"
            small
          />
          <Field
            label="Hours on Unit"
            value={hours}
            onChange={setHours}
            placeholder="e.g. 312"
            type="number"
            small
          />
        </div>

        {/* Complaint */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Reported Fault *</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <textarea
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              rows={3}
              placeholder="Describe the fault or job requirement..."
              className="w-full bg-transparent text-white text-sm leading-relaxed outline-none resize-none placeholder:text-white/25"
            />
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-white/3 border border-white/8 rounded-xl">
          <AlertTriangle size={12} className="text-white/20 mt-0.5 shrink-0" />
          <p className="text-white/25 text-xs leading-relaxed">
            AI Diagnosis is not available for manually created work orders. Use the AI Assistant for guidance.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10">
        <button
          onClick={handleCreate}
          disabled={!canSubmit}
          className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-2xl transition-all duration-150 ${
            canSubmit
              ? 'bg-hcsg-orange text-white shadow-lg shadow-hcsg-orange/25 active:scale-[0.98]'
              : 'bg-white/8 text-white/25 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={18} />
          Create Work Order
        </button>
      </div>

    </div>
  )
}

function Field({ label, icon, value, onChange, placeholder, type = 'text', small = false }) {
  return (
    <div>
      {label && <p className="text-white/50 text-xs uppercase tracking-widest mb-2">{label}</p>}
      <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        {icon}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-white outline-none placeholder:text-white/25 ${small ? 'text-xs' : 'text-sm'}`}
        />
      </div>
    </div>
  )
}
