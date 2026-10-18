import { 
  LayoutDashboard, 
  Ticket, 
  ScanLine, 
  ChartNoAxesCombined, 
  X, 
  Sun, 
  Moon, 
  Settings, 
  ChevronRight, 
  LogOut ,
  User
} from 'lucide-react'
import Brand from '../ui/Brand'

// Definisi menu navigasi
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'WORKSPACE' },
  { id: 'invitations', label: 'Manajemen Undangan', icon: Ticket, group: 'WORKSPACE' },
  { id: 'scanner', label: 'Gatekeeper Scanner', icon: ScanLine, group: 'OPERASIONAL' },
  { id: 'attendance', label: 'Rekap Kehadiran', icon: ChartNoAxesCombined, group: 'OPERASIONAL' },
]

export default function Sidebar({ page, setPage, mobileOpen, setMobileOpen, dark, setDark, onLogout }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-white/[.07] bg-[#111A22] transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-white/[.06] px-6">
          <Brand />
          <button className="text-slate-500 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <div className="mx-4 mt-5 rounded-2xl border border-[#C6A15B]/15 bg-gradient-to-br from-[#C6A15B]/10 to-transparent p-3.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-semibold tracking-[.16em] text-[#D9B96E]">EVENT CONTROL CENTER</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            The Nusantara Legends<br />Go to the World
          </p>
        </div>

        <nav className="scrollbar-hide mt-7 flex-1 overflow-y-auto px-3">
          {['WORKSPACE', 'OPERASIONAL'].map(group => (
            <div key={group} className="mb-5">
              <div className="mb-2 px-3 text-[9px] font-bold tracking-[.18em] text-slate-600">{group}</div>
              {navItems.filter(n => n.group === group).map(item => {
                const Icon = item.icon
                const active = page === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => { setPage(item.id); setMobileOpen(false) }}
                    className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-medium transition ${active ? 'border border-[#C6A15B]/15 bg-[#C6A15B]/10 text-[#E0C37F]' : 'text-slate-400 hover:bg-white/[.04] hover:text-slate-200'}`}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'scanner' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    {active && <ChevronRight size={14} />}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="mb-5">
            <div className="mb-2 px-3 text-[9px] font-bold tracking-[.18em] text-slate-600">PREFERENSI</div>
            <button
              onClick={() => setDark(!dark)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] text-slate-400 hover:bg-white/[.04] hover:text-white"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
              <span className="flex-1">{dark ? 'Mode terang' : 'Mode gelap'}</span>
              <span className={`h-4 w-7 rounded-full p-0.5 ${dark ? 'bg-[#C6A15B]' : 'bg-slate-700'}`}>
                <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${dark ? 'translate-x-3' : ''}`} />
              </span>
            </button>

            <button
              onClick={() => setPage('settings')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] ${page === 'settings' ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/[.04] hover:text-white'}`}
            >
              <Settings size={17} />
              Pengaturan
            </button>
          </div>
        </nav>

        <div className="border-t border-white/[.06] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[.03] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#C6A15B]/15 text-xs font-bold text-[#D9B96E]">
              <User />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-slate-200">Event Administrator</div>
              <div className="mt-0.5 text-[9px] text-slate-500">Admin account</div>
            </div>
            <button
              title="Logout"
              onClick={onLogout}
              className="text-slate-600 hover:text-rose-400 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}