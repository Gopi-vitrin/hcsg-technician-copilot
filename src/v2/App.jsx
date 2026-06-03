import { useState } from 'react'
import Login from './components/technician/Login'
import Home  from './components/technician/Home'

function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8 overflow-y-auto">
      {/* Industrial grid background */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#e65e25 1px, transparent 1px), linear-gradient(90deg, #e65e25 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="relative bg-hcsg-navy overflow-hidden shadow-2xl"
        style={{ width: 390, minHeight: 844, borderRadius: 32 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-950 rounded-b-2xl z-50" />
        <div className="flex flex-col" style={{ paddingTop: 24, height: 844 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen,     setScreen]     = useState('login')
  const [selectedWO, setSelectedWO] = useState(null)
  const [activeTab,  setActiveTab]  = useState('home')

  function handleNavTab(tab) {
    setActiveTab(tab)
    if (tab === 'home') setScreen('home')
  }

  function handleSelectWO(woId) {
    setSelectedWO(woId)
    setScreen('wo-hub')
    setActiveTab('active')
  }

  return (
    <PhoneFrame>
      {screen === 'login' && (
        <Login onLogin={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <Home
          onSelectWO={handleSelectWO}
          onNavigate={handleNavTab}
          activeTab={activeTab}
        />
      )}
      {screen === 'wo-hub' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-8">
            <p className="font-display font-800 text-hcsg-orange text-lg tracking-widest uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              ›› WO HUB
            </p>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {selectedWO} — Building next
            </p>
          </div>
        </div>
      )}
    </PhoneFrame>
  )
}
