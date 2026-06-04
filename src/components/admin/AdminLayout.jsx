import { useEffect, useRef, useState } from 'react'
import { BarChart2, ChevronDown, LayoutDashboard, LogOut, MessageSquare, Settings } from 'lucide-react'
import { ADMIN } from '../../data'

const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Service Overview', icon: LayoutDashboard },
  { key: 'workorders', label: 'Field AI Activity', icon: MessageSquare },
  { key: 'analytics',  label: 'AI Insights',       icon: BarChart2 },
  { key: 'documents',  label: 'Settings',           icon: Settings },
]

export default function AdminLayout({ active, onNavigate, children }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [active])

  function handleSignOut() {
    setProfileOpen(false)
    onNavigate('admin-login')
  }

  return (
    <div className="flex h-screen bg-hcsg-page overflow-hidden">
      <div className="w-56 bg-hcsg-navy flex flex-col shrink-0 shadow-xl h-full">
        <div className="h-1 w-full bg-hcsg-orange" />

        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-7 brightness-0 invert" />
          <p className="text-white/30 text-xs mt-2 tracking-widest uppercase">Manager View</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full min-h-11 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] ${
                active === key
                  ? 'bg-hcsg-orange text-white shadow-md'
                  : 'text-white/55 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="relative px-3 py-4 border-t border-white/10">
          {profileOpen && (
            <div className="absolute bottom-[76px] left-3 right-3 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl animate-fade-in">
              <button
                onClick={handleSignOut}
                className="w-full min-h-10 flex items-center gap-2 rounded-xl px-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-[background-color,box-shadow] duration-150"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="w-full min-h-12 flex items-center gap-2.5 rounded-2xl px-2 py-2 text-left hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-hcsg-orange/30 transition-[background-color,box-shadow] duration-150"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
              {ADMIN.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{ADMIN.name}</p>
              <p className="text-white/40 text-xs truncate">{ADMIN.branch}</p>
            </div>
            <ChevronDown size={14} className={`text-white/40 transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto bg-hcsg-page">
        <div className="py-8 px-8">
          {children}
        </div>
      </div>
    </div>
  )
}
