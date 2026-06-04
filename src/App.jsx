import { useEffect, useState } from 'react'
import { MessageSquare, Monitor, ScanLine, Smartphone, UserCheck } from 'lucide-react'

import Login from './components/technician/Login'
import EquipmentIdentification from './components/technician/EquipmentIdentification'
import EquipmentProfile from './components/technician/EquipmentProfile'
import SymptomDescription from './components/technician/SymptomDescription'
import Chat from './components/technician/Chat'
import Profile from './components/technician/Profile'

import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import DocumentManagement from './components/admin/DocumentManagement'
import WorkOrderMonitoring from './components/admin/WorkOrderMonitoring'
import AIAnalytics from './components/admin/AIAnalytics'
import AdminTeam from './components/admin/AdminTeam'

import RoleSwitcher from './components/shared/RoleSwitcher'
import { ADMIN, TECHNICIAN, getWO } from './data'

function SwitchOverlay({ targetRole }) {
  const [ty, setTy] = useState('100%')
  const toAdmin = targetRole === 'admin'

  useEffect(() => {
    const t1 = setTimeout(() => setTy('0%'), 16)
    const t2 = setTimeout(() => setTy('-100%'), 1100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
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
        {toAdmin ? 'Switching to Manager View' : 'Switching to Field View'}
      </p>
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg" style={{ background: '#e65e25' }}>
          {toAdmin ? ADMIN.avatar : TECHNICIAN.avatar}
        </div>
        <div>
          <p className="font-bold text-base text-slate-800">{toAdmin ? ADMIN.name : TECHNICIAN.name}</p>
          <p className="text-sm mt-0.5 text-slate-500">{toAdmin ? ADMIN.role : TECHNICIAN.role}</p>
          <p className="text-xs mt-0.5 text-slate-400">{toAdmin ? `${ADMIN.branch} - 32 branches` : `${TECHNICIAN.branch} - My Work`}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        {toAdmin ? <><Monitor size={14} /><span className="text-xs">Manager dashboard</span></> : <><Smartphone size={14} /><span className="text-xs">Mobile field app</span></>}
      </div>
    </div>
  )
}

function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'identify', label: 'Scan', Icon: ScanLine },
    { key: 'chat', label: 'Advisor', Icon: MessageSquare },
    { key: 'profile', label: 'My Work', Icon: UserCheck },
  ]

  return (
    <div className="border-t border-slate-200 bg-white px-3 pt-2 shrink-0 shadow-[0_-10px_24px_rgba(15,23,42,0.08)]" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`min-h-12 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl relative focus:outline-none focus:ring-2 focus:ring-hcsg-orange/20 transition-[background-color,transform] duration-150 active:scale-[0.98] ${
                isActive ? 'bg-hcsg-orange/10' : 'bg-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-hcsg-orange rounded-full" />
              )}
              <Icon size={22} className={isActive ? 'text-hcsg-orange' : 'text-slate-500'} />
              <span className={`text-xs font-semibold ${isActive ? 'text-hcsg-orange' : 'text-slate-500'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

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

export default function App() {
  const [role, setRole] = useState('technician')
  const [techScreen, setTechScreen] = useState('login')
  const [adminScreen, setAdminScreen] = useState('admin-login')
  const [selectedWO, setSelectedWO] = useState(null)
  const [identifiedFrom, setIdentifiedFrom] = useState(null)
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [chatContext, setChatContext] = useState(null)
  const [switchingTo, setSwitchingTo] = useState(null)
  const [completedWOs, setCompletedWOs] = useState([])

  const goTech = (screen) => setTechScreen(screen)

  function handleNavTab(tab) {
    if (tab === 'chat') {
      setChatContext(null)
      setSelectedSymptom(null)
    }
    goTech(tab)
  }

  function handleIdentify(data) {
    setIdentifiedFrom(data.source)
    setSelectedWO('WO-2847')
    goTech('equipment-profile')
  }

  function handleConfirmEquipment() {
    setChatContext('WO-2847')
    setSelectedSymptom(null)
    goTech('chat')
  }

  function handleCompleteJob() {
    const wo = getWO(selectedWO)
    if (wo) {
      const now = new Date()
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setCompletedWOs(prev => [...prev, {
        id: selectedWO,
        customer: wo.customer,
        site: wo.site,
        equipment: wo.equipment.split('-')[0].trim(),
        jobType: wo.jobType,
        faultConfirmed: true,
        partsUsed: wo.parts,
        completedAt: `Today, ${time}`,
      }])
    }
    goTech('identify')
  }

  function handleRoleSwitch(newRole) {
    if (newRole === role || switchingTo) return
    setSwitchingTo(newRole)
    setTimeout(() => setRole(newRole), 700)
    setTimeout(() => setSwitchingTo(null), 1560)
  }

  return (
    <div>
      {role === 'technician' && (
        <PhoneFrame>
          {techScreen === 'login' && (
            <Login onLogin={() => goTech('identify')} />
          )}
          {techScreen === 'identify' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <EquipmentIdentification onIdentify={handleIdentify} />
              </div>
              <BottomNav active="identify" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'equipment-profile' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <EquipmentProfile identifiedFrom={identifiedFrom} onBack={() => goTech('identify')} onConfirm={handleConfirmEquipment} />
              </div>
              <BottomNav active="identify" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Chat contextWoId={chatContext} symptom={selectedSymptom} onBack={chatContext ? () => goTech('equipment-profile') : null} onCompleteJob={chatContext ? handleCompleteJob : null} />
              </div>
              <BottomNav active="chat" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'profile' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                <Profile onSignOut={() => goTech('login')} completedWOs={completedWOs} />
              </div>
              <BottomNav active="profile" onNavigate={handleNavTab} />
            </div>
          )}
        </PhoneFrame>
      )}

      {role === 'admin' && (
        <>
          {adminScreen === 'admin-login' && (
            <AdminLogin onLogin={() => setAdminScreen('dashboard')} />
          )}
          {adminScreen !== 'admin-login' && (
            <AdminLayout active={adminScreen} onNavigate={setAdminScreen}>
              {adminScreen === 'dashboard' && <AdminDashboard onNavigate={setAdminScreen} />}
              {adminScreen === 'workorders' && <WorkOrderMonitoring completedWOs={completedWOs} />}
              {adminScreen === 'analytics' && <AIAnalytics />}
              {adminScreen === 'documents' && <DocumentManagement />}
              {adminScreen === 'team' && <AdminTeam />}
            </AdminLayout>
          )}
        </>
      )}

      <RoleSwitcher role={role} onSwitch={handleRoleSwitch} disabled={techScreen === 'chat' && !!chatContext} />
      {switchingTo && <SwitchOverlay targetRole={switchingTo} />}
    </div>
  )
}
