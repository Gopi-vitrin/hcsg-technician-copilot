import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, ChevronRight, X, Loader, CloudUpload, MoreHorizontal, RefreshCw, Clock, Pencil, Trash2, BookOpen, ChevronLeft } from 'lucide-react'
import { KNOWLEDGE_BASE } from '../../data'

const SOURCE_STYLES = {
  SharePoint:      'bg-blue-50 text-blue-600 border-blue-100',
  'Corporate Drive': 'bg-slate-50 text-slate-600 border-slate-200',
}

const PRIORITY_STYLES = {
  High:   'bg-red-50 text-red-600 border-red-100',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100',
}

// Simulated SharePoint files — each maps to a full table row on import
const SHAREPOINT_FILES = [
  { name: 'Elevator Hydraulic Systems Manual — Thyssen.pdf',    size: '8.2 MB',  type: 'Manual',    equipment: 'Industrial Elevators', pages: 68, source: 'SharePoint' },
  { name: 'HCSG Dock Equipment Service Bulletin Q1-2026.pdf',   size: '1.4 MB',  type: 'Bulletin',  equipment: 'Dock & Door Systems',  pages: 12, source: 'SharePoint' },
  { name: 'Overhead Crane Inspection Checklist ASME B30.2.pdf', size: '2.8 MB',  type: 'Checklist', equipment: 'Bridge Crane',         pages: 24, source: 'SharePoint' },
]

function SharePointModal({ onClose, onImport }) {
  const [selected, setSelected] = useState([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState([])

  function toggle(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  function handleImport() {
    setImporting(true)
    let done = []
    SHAREPOINT_FILES.filter(f => selected.includes(f.name)).forEach((f, i) => {
      setTimeout(() => {
        done = [...done, f.name]
        setImported([...done])
        if (done.length === selected.length) {
          setTimeout(() => {
          setImporting(false)
          onImport(SHAREPOINT_FILES.filter(f => selected.includes(f.name)))
        }, 600)
        }
      }, 800 + i * 600)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0078D4' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-6h2v6zm0-8h-2V6.5h2V8.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">Import from SharePoint</p>
              <p className="text-slate-400 text-xs">HCSG Corporate Library · Technical Documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* File list */}
        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Available documents</p>
          {SHAREPOINT_FILES.map(file => {
            const isSelected = selected.includes(file.name)
            const isImported = imported.includes(file.name)
            return (
              <button
                key={file.name}
                onClick={() => !importing && toggle(file.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-[background-color,border-color,box-shadow] duration-150 ${
                  isImported ? 'border-green-200 bg-green-50' :
                  isSelected ? 'border-hcsg-blue/30 bg-blue-50' :
                  'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isImported ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isImported
                    ? <CheckCircle size={16} className="text-green-600" />
                    : <FileText size={16} className="text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-medium truncate">{file.name}</p>
                  <p className="text-slate-400 text-xs">{file.type} · {file.size}</p>
                </div>
                {isImported
                  ? <span className="text-green-600 text-xs font-semibold shrink-0">Indexed</span>
                  : importing && isSelected
                  ? <Loader size={14} className="text-hcsg-blue animate-spin shrink-0" />
                  : isSelected
                  ? <CheckCircle size={16} className="text-hcsg-blue shrink-0" />
                  : null
                }
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-slate-400 text-xs">{selected.length} file{selected.length !== 1 ? 's' : ''} selected</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700">Cancel</button>
            <button
              onClick={handleImport}
              disabled={selected.length === 0 || importing}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-[background-color,color,opacity] duration-150 ${
                selected.length > 0 && !importing
                  ? 'bg-hcsg-orange text-white hover:bg-hcsg-light-orange'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {importing ? 'Indexing...' : 'Import & Index'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DOC_TYPES = ['Manual', 'Service Bulletin', 'Inspection Checklist', 'Parts Catalogue', 'Other']

const PARSED_FIELDS = [
  { key: 'title',        label: 'Document title' },
  { key: 'type',         label: 'Document type' },
  { key: 'equipment',    label: 'Equipment type' },
  { key: 'model',        label: 'Model number' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'revision',     label: 'Revision' },
]

function UploadModal({ onClose, onUploaded }) {
  const fileInputRef = useRef(null)
  const [file,       setFile]       = useState(null)
  const [docType,    setDocType]    = useState('Manual')
  const [stage,      setStage]      = useState('select') // select | uploading | parsing | reviewing | done
  const [progress,   setProgress]   = useState(0)
  const [dragOver,   setDragOver]   = useState(false)
  const [parsed,     setParsed]     = useState(null)   // AI-detected metadata

  function handleFile(f) {
    if (f && f.type === 'application/pdf') setFile(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  function runUpload() {
    setStage('uploading')
    setProgress(0)
    let p = 0
    const tick = setInterval(() => {
      p += Math.random() * 18 + 8
      if (p >= 100) {
        p = 100
        clearInterval(tick)
        setProgress(100)
        setTimeout(() => {
          setStage('parsing')
          setTimeout(() => {
            setParsed({
              title:        file.name.replace(/\.pdf$/i, ''),
              type:         docType,
              equipment:    'Wire Rope Hoist',
              model:        'Shaw-Box Series 800',
              manufacturer: 'Columbus McKinnon',
              revision:     'Rev 4',
              pages:        44,
              summary:      'Service manual covering motor brake adjustment, wire rope inspection, contactor replacement, and electrical fault diagnosis for the Shaw-Box 800 series.',
            })
            setStage('reviewing')
          }, 1400)
        }, 300)
      } else {
        setProgress(Math.round(p))
      }
    }, 120)
  }

  function confirmAndIndex() {
    setStage('done')
    setTimeout(() => {
      onUploaded({
        name:      parsed.title,
        type:      parsed.type,
        equipment: parsed.equipment,
        pages:     parsed.pages,
        status:    'Indexed',
        uploaded:  TODAY,
        source:    'Upload',
      })
    }, 700)
  }

  const canUpload = !!file

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hcsg-orange flex items-center justify-center">
              <Upload size={15} className="text-white" />
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">Upload Manual</p>
              <p className="text-slate-400 text-xs">PDF only - advisor classifies and indexes automatically</p>
            </div>
          </div>
          {stage === 'select' && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Stage: select */}
          {stage === 'select' && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-[background-color,border-color,box-shadow] duration-150 ${
                  dragOver
                    ? 'border-hcsg-orange bg-hcsg-orange/5'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-200 hover:border-hcsg-orange/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                {file ? (
                  <>
                    <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
                    <p className="text-slate-700 text-sm font-semibold truncate max-w-xs mx-auto">{file.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB · Click to change</p>
                  </>
                ) : (
                  <>
                    <CloudUpload size={28} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm font-medium">Drop PDF here or <span className="text-hcsg-orange">browse files</span></p>
                    <p className="text-slate-400 text-xs mt-1">PDF manuals, service bulletins, checklists</p>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-hcsg-orange/20 bg-hcsg-orange/5 px-4 py-3">
                <div className="flex items-start gap-2">
                  <Loader size={14} className="text-hcsg-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-hcsg-navy text-sm font-semibold">Advisor will classify this document</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Equipment type, model number, revision, procedures, and safety references are extracted automatically. You can review and edit everything before it goes live.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Stage: uploading */}
          {stage === 'uploading' && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hcsg-orange/10 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-hcsg-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-medium truncate">{file?.name}</p>
                  <p className="text-slate-400 text-xs">Uploading...</p>
                </div>
                <span className="text-hcsg-orange text-sm font-bold shrink-0">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-hcsg-orange rounded-full transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stage: parsing */}
          {stage === 'parsing' && (
            <div className="py-4 flex items-center gap-3">
              <Loader size={20} className="text-hcsg-orange animate-spin shrink-0" />
              <div>
                <p className="text-slate-700 text-sm font-medium">AI is reading the document…</p>
                <p className="text-slate-400 text-xs">Extracting equipment type, model, sections, and procedures</p>
              </div>
            </div>
          )}

          {/* Stage: reviewing — human-in-the-loop confirmation */}
          {stage === 'reviewing' && parsed && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 bg-hcsg-orange/5 border border-hcsg-orange/20 rounded-xl px-4 py-3">
                <CheckCircle size={14} className="text-hcsg-orange mt-0.5 shrink-0" />
                <div>
                  <p className="text-hcsg-navy text-sm font-semibold">AI parsed this document</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Review and edit before indexing. These values control how Advisor finds and uses this document.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PARSED_FIELDS.map(({ key, label }) => (
                  <div key={key} className={key === 'title' ? 'col-span-2' : ''}>
                    <label className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block mb-1">{label}</label>
                    <input
                      type="text"
                      value={parsed[key] ?? ''}
                      onChange={e => setParsed(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-hcsg-navy outline-none focus:ring-2 focus:ring-hcsg-orange/20 focus:border-hcsg-orange transition-[border-color,box-shadow] duration-150"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">AI summary</p>
                <p className="text-slate-500 text-xs leading-relaxed bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">{parsed.summary}</p>
              </div>
              <p className="text-slate-300 text-xs tabular-nums">{parsed.pages} pages detected</p>
            </div>
          )}

          {/* Stage: done */}
          {stage === 'done' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-slate-700 text-sm font-semibold">Indexed successfully</p>
                <p className="text-slate-400 text-xs">{parsed?.title ?? file?.name} is ready for Advisor questions</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {stage === 'select' && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700">Cancel</button>
            <button
              onClick={runUpload}
              disabled={!canUpload}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-[background-color,color,opacity] duration-150 ${
                canUpload
                  ? 'bg-hcsg-orange text-white hover:bg-hcsg-light-orange'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Upload & analyze
            </button>
          </div>
        )}
        {stage === 'reviewing' && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <p className="text-slate-400 text-xs">Edit any field above before indexing.</p>
            <button
              onClick={confirmAndIndex}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-hcsg-orange text-white hover:bg-hcsg-light-orange transition-colors"
            >
              <CheckCircle size={14} /> Confirm and index
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const DOC_FILTER_TYPES = ['All', 'Manual', 'Bulletin', 'Checklist', 'Parts Catalogue']

const DOC_STATUS_STYLES = {
  Indexed:      'text-green-600 bg-green-50 border-green-100',
  'Re-indexing':'text-amber-600 bg-amber-50 border-amber-100',
  'Needs review':'text-red-600 bg-red-50 border-red-100',
  Parsing:      'text-blue-600 bg-blue-50 border-blue-100',
}

const SETTINGS_TABS = ['Manuals', 'Notification Rules', 'Help']

const MANUAL_SECTIONS = [
  {
    title: 'Safety Precautions',
    content: `Before performing any maintenance or inspection, ensure all power sources are de-energised and locked out per LOTO procedures. Never work under a suspended load. Use appropriate PPE including safety glasses, gloves, and steel-toe boots at all times.\n\nVerify the working load limit (WLL) is clearly marked on the hoist and matches the application requirement. Do not exceed the rated capacity under any circumstances.`,
  },
  {
    title: 'Installation & Setup',
    content: `Mount the hoist to a structurally adequate support beam rated to at least 125% of the hoist's capacity. Confirm beam flange width is within the trolley specification range before hanging.\n\nConnect the pendant drop cord to the lower hook of the chain container. Route the chain so it hangs freely with no twists or kinks. Verify the bottom hook rotates freely and the latch closes correctly.`,
  },
  {
    title: 'Pre-Operation Inspection',
    content: `Inspect chain for wear, cracks, gouges, or stretched links. Replace chain if wear exceeds 5% of original link dimensions.\n\nCheck the brake: energise the unit and cycle the load chain. The brake must hold load without drift. Inspect brake discs for glazing or contamination.\n\nVerify limit switches: raise the hook to the upper limit — the hoist must stop automatically. Test lower limit similarly.`,
  },
  {
    title: 'Troubleshooting',
    content: `LOAD DRIFT: Likely causes — worn brake friction disc, oil contamination on brake surfaces, or incorrect air gap. Clean or replace friction disc; reset air gap to 0.2–0.4 mm.\n\nHOIST WON'T LIFT: Check power supply voltage (must be within ±10% of nameplate). Inspect contactor contacts for burning. Verify thermal overload has not tripped — allow motor to cool and reset.\n\nNOISY OPERATION: Inspect chain lubrication — apply approved chain lube every 200 operating hours. Check load sheave for wear or debris.`,
  },
  {
    title: 'Maintenance Schedule',
    content: `Daily: Visual inspection of chain, hooks, and controls. Check for unusual noises.\n\n250 hours / 3 months: Lubricate load chain, inspect brake, test limit switches, check wire connections for tightness.\n\n1,000 hours / 12 months: Full disassembly inspection of gear train, replace brake disc if worn beyond 50% of original thickness, inspect motor windings, test insulation resistance (min 1 MΩ).\n\nAll maintenance records must be logged in the equipment service history.`,
  },
  {
    title: 'Parts Reference',
    content: `Brake friction disc: Part No. SB800-BD-01\nLoad chain (3m): Part No. SB800-LC-3M\nBottom hook assembly: Part No. SB800-BH-02\nUpper limit switch: Part No. SB800-LS-UP\nLower limit switch: Part No. SB800-LS-LO\nContactor assembly: Part No. SB800-CA-01\nPendant cord (4m): Part No. SB800-PC-4M\n\nContact HCSG Parts at ext. 4400 or parts@hcsg.com for availability.`,
  },
]

function ManualViewerModal({ doc, onClose }) {
  const [activeSec, setActiveSec] = useState(0)
  const section = MANUAL_SECTIONS[activeSec]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden" style={{ height: '82vh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-hcsg-navy/10 flex items-center justify-center shrink-0">
            <BookOpen size={15} className="text-hcsg-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-hcsg-navy font-bold text-sm truncate">{doc.name}</p>
            <p className="text-slate-400 text-xs">{doc.type} · {doc.equipment} · {doc.pages} pages</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar TOC */}
          <div className="w-52 shrink-0 border-r border-slate-100 overflow-y-auto py-3">
            <p className="px-4 pb-2 text-slate-400 text-[11px] uppercase tracking-widest font-semibold">Contents</p>
            {MANUAL_SECTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveSec(i)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeSec === i
                    ? 'bg-hcsg-orange/10 text-hcsg-orange font-semibold border-r-2 border-hcsg-orange'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <h2 className="text-hcsg-navy font-bold text-lg mb-4">{section.title}</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</div>

            {/* Nav arrows */}
            <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveSec(v => Math.max(0, v - 1))}
                disabled={activeSec === 0}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-hcsg-navy disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="text-slate-300 text-xs self-center tabular-nums">{activeSec + 1} / {MANUAL_SECTIONS.length}</span>
              <button
                onClick={() => setActiveSec(v => Math.min(MANUAL_SECTIONS.length - 1, v + 1))}
                disabled={activeSec === MANUAL_SECTIONS.length - 1}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-hcsg-navy disabled:opacity-30 transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentManagement() {
  const [activeTab,      setActiveTab]      = useState('Manuals')
  const [showSharePoint, setShowSharePoint] = useState(false)
  const [showUpload,     setShowUpload]     = useState(false)
  const [importedDocs,   setImportedDocs]   = useState([])
  const [successBanner,  setSuccessBanner]  = useState(null)
  const [docFilter,      setDocFilter]      = useState('All')
  const [actionMenu,     setActionMenu]     = useState(null)
  const [docStatuses,    setDocStatuses]    = useState({})
  const [viewDoc,        setViewDoc]        = useState(null)

  function handleImport(files) {
    setShowSharePoint(false)
    setImportedDocs(prev => [
      ...prev,
      ...files.map(f => ({
        name:      f.name.replace('.pdf', ''),
        type:      f.type,
        equipment: f.equipment,
        pages:     f.pages,
        status:    'Indexed',
        uploaded:  TODAY,
        source:    f.source,
      }))
    ])
    setSuccessBanner('sharepoint')
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  function handleUploaded(doc) {
    setShowUpload(false)
    setImportedDocs(prev => [...prev, doc])
    setSuccessBanner('upload')
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  const allDocs     = [...KNOWLEDGE_BASE.documents, ...importedDocs]
  const totalDocs   = allDocs.length
  const filteredDocs = docFilter === 'All' ? allDocs : allDocs.filter(d => d.type === docFilter)

  function reIndex(i) {
    setDocStatuses(prev => ({ ...prev, [i]: 'Re-indexing' }))
    setActionMenu(null)
    setTimeout(() => setDocStatuses(prev => ({ ...prev, [i]: 'Indexed' })), 2200)
  }

  function deleteDoc(i) {
    setActionMenu(null)
    // remove from importedDocs if it's one of them; KB docs are read-only so just show a flash
    const kbLen = KNOWLEDGE_BASE.documents.length
    if (i >= kbLen) {
      setImportedDocs(prev => prev.filter((_, j) => j !== i - kbLen))
    }
  }
  return (
    <div className="max-w-7xl">

      {showSharePoint && <SharePointModal onClose={() => setShowSharePoint(false)} onImport={handleImport} />}
      {showUpload    && <UploadModal    onClose={() => setShowUpload(false)}    onUploaded={handleUploaded} />}
      {viewDoc       && <ManualViewerModal doc={viewDoc} onClose={() => setViewDoc(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage manuals, notification rules, and help.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
        {SETTINGS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-[color,border-color] duration-150 focus:outline-none ${
              activeTab === tab
                ? 'border-hcsg-orange text-hcsg-orange'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Manuals tab */}
      {activeTab === 'Manuals' && (<>

      {/* Upload actions */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setShowSharePoint(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" fill="#0078D4"/>
            <rect x="6" y="17" width="12" height="4" rx="1" fill="#005A9E"/>
            <path d="M9 8h6M9 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add from SharePoint
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-hcsg-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-hcsg-light-orange shadow-sm transition-colors"
        >
          <Upload size={15} />
          Upload Manual
        </button>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-5 animate-fade-in">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <p className="text-green-700 text-sm font-medium">
            {successBanner === 'upload'
              ? 'Manual uploaded and indexed successfully.'
              : `${importedDocs.length} document${importedDocs.length !== 1 ? 's' : ''} imported from SharePoint and indexed successfully.`
            }
          </p>
        </div>
      )}



      <div>
        {/* Document table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <h2 className="text-hcsg-navy font-semibold text-sm">Document Library</h2>
            <div className="flex items-center gap-1.5">
              {DOC_FILTER_TYPES.map(f => (
                <button
                  key={f}
                  onClick={() => setDocFilter(f)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-[background-color,border-color,color] duration-150 ${
                    docFilter === f
                      ? 'bg-hcsg-navy text-white border-hcsg-navy'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="text-slate-400 text-xs tabular-nums ml-2">{filteredDocs.length} of {totalDocs}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  {['Document', 'Type', 'Equipment', 'Pages', 'Source', 'Status', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDocs.map((doc, i) => {
                  const status = docStatuses[i] ?? doc.status ?? 'Indexed'
                  const statusStyle = DOC_STATUS_STYLES[status] ?? 'text-green-600 bg-green-50 border-green-100'
                  const menuOpen = actionMenu === i
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-[background-color] duration-150 relative">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <FileText size={14} className="text-hcsg-blue shrink-0" />
                          <div className="min-w-0">
                            <span className="block max-w-64 truncate text-slate-700 text-sm font-medium">{doc.name}</span>
                            <span className="text-slate-400 text-xs tabular-nums">{doc.uploaded}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-sm whitespace-nowrap">{doc.type}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-sm">{doc.equipment}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-sm tabular-nums">{doc.pages}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${SOURCE_STYLES[doc.source] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          {doc.source}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${statusStyle}`}>
                          {status === 'Re-indexing' && <RefreshCw size={10} className="inline mr-1 animate-spin" />}
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 relative">
                        <button
                          onClick={() => setActionMenu(menuOpen ? null : i)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        {menuOpen && (
                          <div className="absolute right-4 top-9 z-10 bg-white rounded-xl border border-slate-100 shadow-xl py-1 min-w-[148px] animate-fade-in">
                            {[
                              { label: 'View manual',   Icon: BookOpen,   action: () => { setViewDoc(doc); setActionMenu(null) } },
                              { label: 'Edit metadata', Icon: Pencil,     action: () => setActionMenu(null) },
                              { label: 'Re-index',      Icon: RefreshCw,  action: () => reIndex(i) },
                              { label: 'Delete',        Icon: Trash2,     action: () => deleteDoc(i), danger: true },
                            ].map(({ label, Icon, action, danger }) => (
                              <button
                                key={label}
                                onClick={action}
                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                                  danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <Icon size={13} />
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      </>)}

      {/* Notification Rules tab */}
      {activeTab === 'Notification Rules' && (
        <div className="max-w-2xl space-y-3">
          {[
            { label: 'Safety escalation',    detail: 'Notify manager after 5 minutes on LOTO or electrical risk.',          value: 'On · 5 min' },
            { label: 'Unresolved sessions',  detail: 'Alert manager if a technician AI session exceeds 20 minutes.',        value: 'On · 20 min' },
            { label: 'Manager review flag',  detail: 'Push notification when a technician requests manager review.',        value: 'On' },
            { label: 'New manual indexed',   detail: 'Notify team when a new manual is parsed and ready for advisor use.',  value: 'On' },
            { label: 'Failed parsing',       detail: 'Alert admin if a document fails AI classification.',                  value: 'On' },
            { label: 'Daily AI summary',     detail: 'Send a digest of technician AI sessions to all managers at 6pm.',    value: 'Off' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
              <div>
                <p className="text-slate-700 text-sm font-semibold">{item.label}</p>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed text-pretty">{item.detail}</p>
              </div>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                item.value.startsWith('On')
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-slate-400 bg-slate-50 border-slate-200'
              }`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Help tab */}
      {activeTab === 'Help' && (
        <div className="max-w-2xl space-y-3">
          {[
            { label: 'Getting started guide',       detail: 'How to upload manuals, set up the advisor, and onboard technicians.' },
            { label: 'Advisor troubleshooting',     detail: 'What to do when the advisor gives an unexpected or incomplete answer.' },
            { label: 'Document parsing guide',      detail: 'Best practices for PDFs: resolution, structure, and revision numbering.' },
            { label: 'Teams integration setup',     detail: 'How to connect the advisor with your Microsoft Teams workspace.' },
            { label: 'Contact HCSG support',        detail: 'Reach the HCSG product team for technical issues or feature requests.' },
          ].map(item => (
            <button key={item.label} className="w-full flex items-start justify-between gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm text-left hover:border-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[box-shadow,border-color] duration-150">
              <div>
                <p className="text-slate-700 text-sm font-semibold">{item.label}</p>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed text-pretty">{item.detail}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
