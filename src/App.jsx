import { useState, useEffect } from 'react'

// Technician screens
import Login                  from './components/technician/Login'
import EquipmentIdentification from './components/technician/EquipmentIdentification'
import EquipmentProfile       from './components/technician/EquipmentProfile'
import SymptomDescription     from './components/technician/SymptomDescription'
import AIProcessing           from './components/technician/AIProcessing'
import PredictionsPanel       from './components/technician/PredictionsPanel'
import AdaptiveQA             from './components/technician/AdaptiveQA'
import ResolutionGuide        from './components/technician/ResolutionGuide'
import Library                from './components/technician/Library'
import Chat                   from './components/technician/Chat'
import Profile                from './components/technician/Profile'

// Admin screens
import AdminLogin       from './components/admin/AdminLogin'
import AdminLayout      from './components/admin/AdminLayout'
import AdminDashboard   from './components/admin/AdminDashboard'
import DocumentManagement from './components/admin/DocumentManagement'
import WorkOrderMonitoring from './components/admin/WorkOrderMonitoring'
import AIAnalytics      from './components/admin/AIAnalytics'
import AdminTeam        from './components/admin/AdminTeam'
import KnowledgeCoverage from './components/admin/KnowledgeCoverage'

// Shared
import RoleSwitcher from './components/shared/RoleSwitcher'

import { Home, BookOpen, MessageSquare, User, Monitor, Smartphone } from 'lucide-react'
import { TECHNICIAN, ADMIN, getWO } from './data'

// ── Role-switch overlay ────────────────────────────────────────────────────
function SwitchOverlay({ targetRole }) {
  const [ty, setTy] = useState('100%')
  const toAdmin = targetRole === 'admin'

  useEffect(() => {
    const t1 = setTimeout(() => setTy('0%'),    16)
    const t2 = setTimeout(() => setTy('-100%'), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 select-none"
      style={{
        background: toAdmin ? '#f8fafc' : '#F7F4F0',
        transform: `translateY(${ty})`,
        transition: ty === '-100%'
          ? 'transform 420ms cubic-bezier(0.4, 0, 1, 1)'
          : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {toAdmin ? 'Switching to Admin Console' : 'Switching to Field View'}
      </p>
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg" style={{ background: '#e65e25' }}>
          {toAdmin ? ADMIN.avatar : TECHNICIAN.avatar}
        </div>
        <div>
          <p className="font-bold text-base text-slate-800">{toAdmin ? ADMIN.name : TECHNICIAN.name}</p>
          <p className="text-sm mt-0.5 text-slate-500">{toAdmin ? ADMIN.role : TECHNICIAN.role}</p>
          <p className="text-xs mt-0.5 text-slate-400">{toAdmin ? `${ADMIN.branch} · 32 branches` : `${TECHNICIAN.branch} · Fast Track`}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        {toAdmin ? <><Monitor size={14} /><span className="text-xs">Web dashboard</span></> : <><Smartphone size={14} /><span className="text-xs">Mobile field app</span></>}
      </div>
    </div>
  )
}

// ── Bottom nav ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'identify',  label: 'Home',    Icon: Home          },
    { key: 'sessions',  label: 'Library',  Icon: BookOpen     },
    { key: 'chat',      label: 'Advisor', Icon: MessageSquare  },
    { key: 'profile',   label: 'Profile', Icon: User           },
  ]
  return (
    <div className="border-t border-slate-200 bg-white px-2 pb-5 pt-1 shrink-0">
      <div className="flex items-center justify-around">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex flex-col items-center gap-1 px-4 py-1.5 relative transition-colors"
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-hcsg-orange rounded-full" />
              )}
              <Icon size={22} className={isActive ? 'text-hcsg-orange' : 'text-slate-300'} />
              <span className={`text-xs font-medium ${isActive ? 'text-hcsg-orange' : 'text-slate-300'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Phone frame ────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8 overflow-y-auto">
      <div className="relative bg-hcsg-page overflow-hidden shadow-2xl" style={{ width: 390, minHeight: 844, borderRadius: 44 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-50" />
        <div className="flex flex-col" style={{ paddingTop: 28, height: 844 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Nav tab → screen mapping ───────────────────────────────────────────────
const NAV_MAP = {
  identify: 'identify',
  sessions: 'sessions',
  chat:     'chat',
  profile:  'profile',
}

export default function App() {
  const [role,           setRole]           = useState('technician')
  const [techScreen,     setTechScreen]     = useState('login')
  const [adminScreen,    setAdminScreen]    = useState('admin-login')
  const [selectedWO,     setSelectedWO]     = useState(null)
  const [identifiedFrom, setIdentifiedFrom] = useState(null)
  const [selectedSymptom,setSelectedSymptom]= useState(null)
  const [chatContext,    setChatContext]    = useState(null)
  const [activeTab,      setActiveTab]     = useState('identify')
  const [switchingTo,    setSwitchingTo]   = useState(null)
  const [completedWOs,   setCompletedWOs]  = useState([])

  const goTech = (s) => setTechScreen(s)

  function handleNavTab(tab) {
    setActiveTab(tab)
    if (NAV_MAP[tab]) goTech(NAV_MAP[tab])
  }

  function handleIdentify(data) {
    setIdentifiedFrom(data.source)
    setSelectedWO('WO-2847')
    goTech('equipment-profile')
  }

  function handleDescribeIssue() {
    goTech('symptoms')
  }

  function handleAnalyse(data) {
    setSelectedSymptom(data?.symptom ?? null)
    goTech('ai-processing')
  }

  function handleAskQuestion() {
    setChatContext(selectedWO)
    goTech('chat')
  }

  function handleResumeSession(session) {
    setSelectedWO(session.woId)
    goTech('predictions')
  }

  function handleSelectSession(session) {
    setSelectedWO(session.woId ?? 'WO-2847')
    goTech('predictions')
  }

  function handleRoleSwitch(newRole) {
    if (newRole === role || switchingTo) return
    setSwitchingTo(newRole)
    setTimeout(() => setRole(newRole), 700)
    setTimeout(() => setSwitchingTo(null), 1560)
  }

  const showBottomNav = ['identify', 'sessions', 'chat', 'profile'].includes(techScreen)

  return (
    <div>
      {/* TECHNICIAN VIEW */}
      {role === 'technician' && (
        <PhoneFrame>
          {techScreen === 'login' && (
            <Login onLogin={() => goTech('identify')} />
          )}

          {techScreen === 'identify' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <EquipmentIdentification onIdentify={handleIdentify} onSelectSession={handleSelectSession} />
              </div>
              <BottomNav active="identify" onNavigate={handleNavTab} />
            </div>
          )}

          {techScreen === 'equipment-profile' && (
            <EquipmentProfile
              identifiedFrom={identifiedFrom}
              onBack={() => goTech('identify')}
              onDescribeIssue={handleDescribeIssue}
            />
          )}

          {techScreen === 'symptoms' && (
            <SymptomDescription
              onBack={() => goTech('equipment-profile')}
              onAnalyse={handleAnalyse}
            />
          )}

          {techScreen === 'ai-processing' && (
            <AIProcessing woId={selectedWO} onComplete={() => goTech('predictions')} />
          )}

          {techScreen === 'predictions' && (
            <PredictionsPanel
              woId={selectedWO}
              onBack={() => goTech('identify')}
              onStartTroubleshooting={() => goTech('adaptive-qa')}
              onAskQuestion={handleAskQuestion}
            />
          )}

          {techScreen === 'adaptive-qa' && (
            <AdaptiveQA
              woId={selectedWO}
              onBack={() => goTech('predictions')}
              onComplete={() => goTech('resolution')}
            />
          )}

          {techScreen === 'resolution' && (
            <ResolutionGuide
              woId={selectedWO}
              onBack={() => goTech('adaptive-qa')}
              onComplete={() => {
                const wo = getWO(selectedWO)
                if (wo) {
                  const now  = new Date()
                  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  setCompletedWOs(prev => [...prev, {
                    id:             selectedWO,
                    customer:       wo.customer,
                    site:           wo.site,
                    equipment:      wo.equipment.split('—')[0].trim(),
                    jobType:        wo.jobType,
                    faultConfirmed: true,
                    partsUsed:      wo.parts,
                    completedAt:    `Today, ${time}`,
                  }])
                }
                goTech('identify')
                setActiveTab('identify')
              }}
            />
          )}

          {techScreen === 'sessions' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Library />
              </div>
              <BottomNav active="sessions" onNavigate={handleNavTab} />
            </div>
          )}

          {techScreen === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Chat
                  contextWoId={chatContext}
                  onBack={chatContext ? () => goTech('predictions') : null}
                />
              </div>
              <BottomNav active="chat" onNavigate={handleNavTab} />
            </div>
          )}

          {techScreen === 'profile' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                <Profile onSignOut={() => { goTech('login'); setActiveTab('identify') }} completedWOs={completedWOs} />
              </div>
              <BottomNav active="profile" onNavigate={handleNavTab} />
            </div>
          )}
        </PhoneFrame>
      )}

      {/* ADMIN VIEW */}
      {role === 'admin' && (
        <>
          {adminScreen === 'admin-login' && (
            <AdminLogin onLogin={() => setAdminScreen('dashboard')} />
          )}
          {adminScreen !== 'admin-login' && (
            <AdminLayout active={adminScreen} onNavigate={setAdminScreen}>
              {adminScreen === 'dashboard'  && <AdminDashboard onNavigate={setAdminScreen} />}
              {adminScreen === 'documents'  && <DocumentManagement />}
              {adminScreen === 'workorders' && <WorkOrderMonitoring completedWOs={completedWOs} />}
              {adminScreen === 'analytics'  && <AIAnalytics />}
              {adminScreen === 'coverage'   && <KnowledgeCoverage />}
              {adminScreen === 'team'       && <AdminTeam />}
            </AdminLayout>
          )}
        </>
      )}

      <RoleSwitcher
        role={role}
        onSwitch={handleRoleSwitch}
        disabled={techScreen === 'chat' && !!chatContext}
      />

      {switchingTo && <SwitchOverlay targetRole={switchingTo} />}
    </div>
  )
}
