import { Menu, Search, Bell, Plus, User } from 'lucide-react'
import Button from '../ui/Button'

// Format tanggal lokal
const shortDate = new Intl.DateTimeFormat('id-ID', { 
  day: '2-digit', 
  month: 'short', 
  year: 'numeric' 
}).format(new Date())

export default function Header({ page, setMobileOpen, query, setQuery, onCreate }) {
  const titles = { 
    dashboard: 'Dashboard Overview', 
    invitations: 'Manajemen Undangan', 
    scanner: 'Gatekeeper Scanner', 
    attendance: 'Rekap Kehadiran', 
    settings: 'Pengaturan' 
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-white/[.07] bg-[#101820]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden">
          <Menu size={19}/>
        </button>
        <div className="min-w-0">
          <div className="text-[9px] tracking-[.15em] text-slate-500">
            GOLDEN TICKET / <span className="text-[#C6A15B]">{page.toUpperCase()}</span>
          </div>
          <div className="mt-1 truncate text-sm font-semibold text-slate-100">
            {titles[page] || 'Pengaturan'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {page === 'invitations' && (
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Cari undangan..." 
              className="w-48 rounded-xl border border-white/[.08] bg-white/[.03] py-2.5 pl-9 pr-3 text-[10px] text-slate-200 outline-none focus:border-[#C6A15B]/40"
            />
          </div>
        )}
        <button title="Notifikasi demo" className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/[.08] text-slate-400 hover:bg-white/[.05]">
          <Bell size={16}/>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C6A15B]"/>
        </button>
        <div className="hidden h-8 w-px bg-white/10 sm:block"/>
        <div className="hidden text-right sm:block">
          <div className="text-[10px] font-semibold text-slate-200">Event Administrator</div>
          <div className="mt-0.5 text-[9px] text-slate-500">{shortDate}</div>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#C6A15B]/20 bg-[#C6A15B]/10 text-[10px] font-bold text-[#D9B96E]">
          <User />
        </div>
      </div>
    </header>
  )
}