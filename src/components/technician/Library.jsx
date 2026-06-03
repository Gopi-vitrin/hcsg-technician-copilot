import { useState } from 'react'
import { ArrowUp, Layers, ArrowUpDown, DoorOpen, Truck, ChevronDown, ChevronRight, FileText, AlertTriangle, ArrowLeft, Zap, BookOpen } from 'lucide-react'

const DOC_BADGE = {
  'Manual':           'bg-hcsg-blue/10 text-hcsg-blue',
  'Service Bulletin': 'bg-hcsg-orange/10 text-hcsg-orange',
  'Technical Doc':    'bg-slate-100 text-slate-500',
}

function getContent(doc) {
  if (doc.type === 'Service Bulletin') return [
    {
      heading: 'Subject',
      body: `${doc.title.split('—')[1]?.trim() ?? 'See bulletin details below'}. This bulletin supersedes all previous service information on this subject. File in your service manual.`,
    },
    {
      heading: 'Affected Equipment',
      body: `All ${doc.manufacturer} units manufactured between January 2019 and December 2023. Check the serial number plate on the unit nameplate for confirmation. Units outside this range are not affected.`,
    },
    {
      heading: 'Corrective Procedure',
      body: '1. De-energize and lock out the unit per ANSI/ASSP Z244.1.\n2. Remove the access cover (4 × M8 bolts).\n3. Inspect the component as described and replace if wear exceeds service limits.\n4. Reassemble, restore power, and perform a no-load operational check before returning to service.',
    },
    {
      heading: 'Parts Required',
      body: `Contact ${doc.manufacturer} parts at 1-800-GET-PART or your regional distributor. Reference this bulletin number when ordering.`,
    },
  ]

  if (doc.type === 'Technical Doc') return [
    {
      heading: 'Purpose',
      body: `This document provides technical reference information for ${doc.manufacturer} equipment. It is intended for use by qualified service technicians with appropriate training and certifications.`,
    },
    {
      heading: 'Specifications',
      body: 'Voltage: 460V / 3Ø / 60Hz (standard)\nDuty cycle: H3 (intermittent)\nAmbient temperature range: −10°C to +40°C\nProtection class: IP54\nInsulation class: F',
    },
    {
      heading: 'Service Intervals',
      body: 'Inspect brake air gap: every 250 operating hours or 3 months (whichever comes first)\nLubricate gearbox: every 2,000 operating hours\nInspect wire rope / chain: monthly and after any shock load event\nFull overhaul: every 10 years or per usage-based inspection program',
    },
    {
      heading: 'Notes',
      body: 'Always refer to the latest revision of the applicable O&M manual before performing service. This document does not replace the O&M manual — it supplements it.',
    },
  ]

  // Manual (default)
  return [
    {
      heading: 'Overview',
      body: `The ${doc.title.split('—')[0].trim()} is engineered for demanding industrial lifting applications. This manual covers installation, operation, inspection, maintenance, and troubleshooting. Read all sections before operating or servicing this equipment.`,
    },
    {
      heading: 'Safety Precautions',
      body: '⚠ DANGER — Lockout/tagout (LOTO) all energy sources before servicing.\n⚠ WARNING — Do not exceed the rated load capacity shown on the nameplate.\n⚠ CAUTION — Inspect the unit before each use. Remove from service if any defect is found.\n\nFollow ASME B30.16 (overhead hoists) or ASME B30.17 (overhead cranes) as applicable.',
    },
    {
      heading: 'Inspection Schedule',
      body: 'FREQUENT (before each use): hooks, limit switches, rope/chain, controls\nPERIODIC (monthly): brakes, gearbox oil level, structural members, electrical connections\nANNUAL: complete disassembly inspection by qualified hoist inspector per ASME B30',
    },
    {
      heading: 'Lubrication',
      body: `Gearbox: ISO VG 220 gear oil — check every 3 months, change annually\nWire rope: anti-corrosion lubricant, apply monthly or per site conditions\nHook latch pivot: light machine oil every 6 months\n\nOperating in extreme temperatures? Contact ${doc.manufacturer} for alternative lubricant recommendations.`,
    },
    {
      heading: 'Troubleshooting',
      body: 'Load drifts under load → Inspect brake disc air gap; adjust or replace if worn\nUnit will not lift → Check contactor coil, overload relay, and control fuse\nExcessive heat at motor → Verify duty cycle; check ventilation; inspect motor windings\nAbnormal noise → Inspect gearbox bearings and wire rope for damage',
    },
  ]
}

const LIBRARY = [
  {
    id: 'hoists', label: 'Hoists', Icon: ArrowUp, color: 'bg-hcsg-blue',
    docs: [
      { title: 'Yale Y80 Series — Wire Rope Hoist O&M Manual',        type: 'Manual',           pages: 186, year: 2022, manufacturer: 'Yale'      },
      { title: 'Shaw-Box 800 Series — Wire Rope Hoist Service Manual', type: 'Manual',           pages: 243, year: 2021, manufacturer: 'Shaw-Box'  },
      { title: 'CM Lodestar Series — Chain Hoist Maintenance Guide',   type: 'Manual',           pages: 128, year: 2023, manufacturer: 'CM'        },
      { title: 'Shaw-Box Heavy Duty — Brake Adjustment SB-2024-11',    type: 'Service Bulletin', pages: 4,   year: 2024, manufacturer: 'Shaw-Box'  },
      { title: 'CM Lodestar — Brake System Technical Note',            type: 'Technical Doc',    pages: 12,  year: 2023, manufacturer: 'CM'        },
    ],
  },
  {
    id: 'cranes', label: 'Cranes', Icon: Layers, color: 'bg-hcsg-navy',
    docs: [
      { title: 'World Series 3D — Bridge Crane O&M Manual',            type: 'Manual',           pages: 312, year: 2020, manufacturer: 'World'    },
      { title: 'Spanco — Jib Crane Installation & Maintenance',         type: 'Manual',           pages: 97,  year: 2022, manufacturer: 'Spanco'   },
      { title: 'Gorbel — Workstation Crane Technical Reference',        type: 'Technical Doc',    pages: 64,  year: 2021, manufacturer: 'Gorbel'   },
      { title: 'World Series — Runway Alignment Service Bulletin',      type: 'Service Bulletin', pages: 6,   year: 2024, manufacturer: 'World'    },
    ],
  },
  {
    id: 'elevators', label: 'Elevators', Icon: ArrowUpDown, color: 'bg-slate-300', docs: [],
  },
  {
    id: 'dock-doors', label: 'Dock & Doors', Icon: DoorOpen, color: 'bg-hcsg-amber',
    docs: [
      { title: 'Poweramp — Dock Leveler Service Manual',                type: 'Manual',           pages: 88,  year: 2022, manufacturer: 'Poweramp'  },
      { title: 'Kelley — Loading Dock Equipment O&M Guide',             type: 'Manual',           pages: 145, year: 2021, manufacturer: 'Kelley'    },
      { title: 'Rite-Hite — Safety Edge Installation & Adjustment',     type: 'Technical Doc',    pages: 23,  year: 2023, manufacturer: 'Rite-Hite' },
    ],
  },
  {
    id: 'power-move', label: 'Power Move', Icon: Truck, color: 'bg-hcsg-orange',
    docs: [
      { title: 'Power Move — Material Transfer System Manual',          type: 'Manual',           pages: 210, year: 2022, manufacturer: 'Power Move' },
      { title: 'Power Move — Maintenance Schedule & Parts Reference',   type: 'Technical Doc',    pages: 48,  year: 2023, manufacturer: 'Power Move' },
    ],
  },
]

const TOTAL_DOCS = LIBRARY.reduce((sum, c) => sum + c.docs.length, 0)

// ── Document viewer ─────────────────────────────────────────────────────────
function DocViewer({ doc, category, onClose }) {
  const sections = getContent(doc)
  const aiSummary = doc.type === 'Manual'
    ? `This manual covers installation, operation, and maintenance. Key fault indicators: brake air gap, contactor condition, and rope/chain wear. Most common field issue: load drift — check brake first.`
    : doc.type === 'Service Bulletin'
    ? `Critical update. Affects units from 2019–2023. Follow LOTO before starting. Part replacement required if inspection confirms wear beyond service limits.`
    : `Reference document — use alongside the full O&M manual. Specifications and service intervals apply to standard operating conditions.`

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      {/* Doc header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-5 pb-4 shrink-0">
        <button onClick={onClose} className="flex items-center gap-1.5 text-hcsg-blue text-sm font-medium mb-3">
          <ArrowLeft size={15} />
          <span>{category.label}</span>
        </button>
        <div className="flex items-start gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${DOC_BADGE[doc.type]}`}>
            {doc.type}
          </span>
        </div>
        <h1 className="text-hcsg-navy font-bold text-base leading-snug">{doc.title}</h1>
        <p className="text-slate-400 text-xs mt-1">{doc.manufacturer} · {doc.pages} pages · Rev. {doc.year}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* HCSG Advisor summary */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-hcsg-orange rounded-2xl px-4 py-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-hcsg-orange flex items-center justify-center shrink-0">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-hcsg-navy text-xs font-bold">HCSG Advisor — Document Summary</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">{aiSummary}</p>
        </div>

        {/* Content sections */}
        {sections.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-2 mb-2.5">
              <BookOpen size={13} className="text-hcsg-blue shrink-0" />
              <p className="text-hcsg-navy text-sm font-bold">{s.heading}</p>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}

        <p className="text-slate-400 text-xs text-center pb-2">
          {doc.manufacturer} · {doc.title.split('—')[0].trim()} · {doc.pages} pages
        </p>

      </div>
    </div>
  )
}

// ── Library list ─────────────────────────────────────────────────────────────
export default function Library() {
  const [expanded, setExpanded] = useState(null)
  const [openDoc,  setOpenDoc]  = useState(null)
  const [openCat,  setOpenCat]  = useState(null)

  if (openDoc) {
    return <DocViewer doc={openDoc} category={openCat} onClose={() => { setOpenDoc(null); setOpenCat(null) }} />
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-page">

      <div className="bg-white border-b border-slate-200 px-5 pt-5 pb-4 shrink-0">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Equipment</p>
        <h1 className="text-hcsg-navy font-bold text-xl">Library</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

        {LIBRARY.map(category => {
          const isOpen     = expanded === category.id
          const noCoverage = category.docs.length === 0
          const { Icon }   = category

          return (
            <div key={category.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

              <button
                onClick={() => setExpanded(isOpen ? null : category.id)}
                className="w-full flex items-center gap-3 px-4 py-4 active:bg-slate-50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${noCoverage ? 'bg-slate-100' : category.color}`}>
                  <Icon size={16} className={noCoverage ? 'text-slate-400' : 'text-white'} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className={`font-bold text-sm ${noCoverage ? 'text-slate-400' : 'text-hcsg-navy'}`}>
                    {category.label}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {noCoverage ? 'No documents indexed' : `${category.docs.length} document${category.docs.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                {noCoverage
                  ? <AlertTriangle size={14} className="text-red-400 shrink-0" />
                  : isOpen
                    ? <ChevronDown  size={16} className="text-slate-400 shrink-0" />
                    : <ChevronRight size={16} className="text-slate-400 shrink-0" />}
              </button>

              {isOpen && !noCoverage && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {category.docs.map((doc, i) => (
                    <button
                      key={i}
                      onClick={() => { setOpenDoc(doc); setOpenCat(category) }}
                      className="w-full flex items-start gap-3 px-4 py-3.5 active:bg-slate-50 transition-colors text-left"
                    >
                      <FileText size={14} className="text-slate-300 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 text-sm font-medium leading-snug">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOC_BADGE[doc.type]}`}>
                            {doc.type}
                          </span>
                          <span className="text-slate-400 text-xs">{doc.pages} pages · {doc.year}</span>
                        </div>
                      </div>
                      <ChevronRight size={13} className="text-slate-300 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}

              {isOpen && noCoverage && (
                <div className="border-t border-slate-100 px-5 py-4 text-center space-y-1">
                  <p className="text-slate-400 text-xs">No documents indexed for this category.</p>
                  <p className="text-slate-400 text-xs">Contact your admin to upload manuals.</p>
                </div>
              )}

            </div>
          )
        })}

        <p className="text-slate-400 text-xs text-center pb-2">
          {TOTAL_DOCS} documents indexed · Managed by HCSG admin
        </p>

      </div>
    </div>
  )
}
