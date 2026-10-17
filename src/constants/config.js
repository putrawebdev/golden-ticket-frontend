import { 
  LayoutDashboard, 
  Ticket, 
  ScanLine, 
  ChartNoAxesCombined 
} from 'lucide-react'

// 1. Theme & Styling Reusable
export const GOLD_COLOR = '#C6A15B'

export const INPUT_CLASS = 
  'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

// 2. Data Menu Sidebar
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'WORKSPACE' },
  { id: 'invitations', label: 'Manajemen Undangan', icon: Ticket, group: 'WORKSPACE' },
  { id: 'scanner', label: 'Gatekeeper Scanner', icon: ScanLine, group: 'OPERASIONAL' },
  { id: 'attendance', label: 'Rekap Kehadiran', icon: ChartNoAxesCombined, group: 'OPERASIONAL' },
]

// 3. Helper Formatter
export const moneyless = (n) => new Intl.NumberFormat('id-ID').format(n || 0)

export const shortDate = new Intl.DateTimeFormat('id-ID', { 
  day: '2-digit', 
  month: 'short', 
  year: 'numeric' 
}).format(new Date())