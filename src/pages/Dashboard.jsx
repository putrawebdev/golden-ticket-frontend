import { 
  Ticket, 
  UsersRound, 
  TicketCheck, 
  ShieldCheck, 
  School, 
  Crown, 
  HeartHandshake, 
  Sparkles, 
  MapPin, 
  CalendarDays, 
  ArrowRight, 
  Eye, 
  ChartNoAxesCombined, 
  Plus, 
  Activity 
} from 'lucide-react'

// Import Komponen UI
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import MetricCard from '../components/ui/MetricCard'
import SectionTitle from '../components/ui/SectionTitle'

// Import Data & Helper
import { categoryLabel, getInvitee } from '../data'

// Formatter angka
const moneyless = (n) => new Intl.NumberFormat('id-ID').format(n || 0)

export default function Dashboard({ invitations, setPage, onCreate, onPreview, eventInfo }) {
  const total = invitations.length
  const used = invitations.reduce((s, i) => s + i.scan_count, 0)
  const capacity = invitations.reduce((s, i) => s + i.max_scans, 0)
  const full = invitations.filter(i => i.scan_count >= i.max_scans).length
  
  const byType = ['school', 'vip', 'parent'].map(type => {
    const items = invitations.filter(i => i.type === type)
    return { 
      type, 
      label: categoryLabel[type], 
      count: items.length, 
      used: items.reduce((s, i) => s + i.scan_count, 0), 
      cap: items.reduce((s, i) => s + i.max_scans, 0) 
    }
  })

  // Helper merapikan tampilan tanggal (contoh: 24 Oktober 2026)
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal acara belum dikonfigurasi'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="animate-in">
      <SectionTitle 
        eyebrow="OVERVIEW / EVENT MONITORING" 
        title="Selamat datang kembali." 
        subtitle="Pantau distribusi tiket dan arus kehadiran Gen Z Indonesia 2026 dari satu tempat." 
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage('attendance')}>
              <ChartNoAxesCombined size={14}/>Lihat laporan
            </Button>
            <Button onClick={onCreate}>
              <Plus size={14}/>Buat tiket
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#C6A15B]/15 bg-[#C6A15B]/[.05] px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#C6A15B]/10 text-[#C6A15B]">
          <Activity size={16}/>
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-slate-200">
            Event control center
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            Platinum Cineplex Milenial Hub Metland Cibitung
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Tiket" value={moneyless(total)} note="Tiket undangan terdaftar" icon={Ticket}/>
        <MetricCard title="Kehadiran Tercatat" value={moneyless(used)} note="Total pemindaian berhasil" icon={UsersRound} tone="green"/>
        <MetricCard title="Sisa Kuota" value={moneyless(Math.max(0, capacity-used))} note={`Dari ${moneyless(capacity)} kuota teralokasi`} icon={TicketCheck} tone="blue"/>
        <MetricCard title="Tiket Penuh" value={moneyless(full)} note="Tidak menerima akses tambahan" icon={ShieldCheck}/>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <section className="rounded-2xl border border-white/[.07] bg-[#17212A] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Ringkasan kehadiran</h2>
              <p className="mt-1 text-[10px] text-slate-500">Pemindaian berhasil berdasarkan kategori</p>
            </div>
            <Badge tone="gold">DATA</Badge>
          </div>
          <div className="mt-7 space-y-10">
            {byType.map((item, idx) => {
              const pct = item.cap ? Math.round(item.used/item.cap*100) : 0
              const Icon = idx === 0 ? School : idx === 1 ? Crown : HeartHandshake
              return (
                <div key={item.type}>
                  <div className="mb-2.5 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.04] text-[#C6A15B]">
                      <Icon size={16}/>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-slate-200">{item.label}</div>
                      <div className="mt-1 text-[9px] text-slate-500">{item.count} tiket · {item.used}/{item.cap} orang</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-200">{pct}%</div>
                      <div className="text-[9px] text-slate-500">terpakai</div>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                    <div className="h-full rounded-full bg-[#C6A15B] transition-all" style={{width: `${pct}%`}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-[#C6A15B]/20 bg-[#141F28] p-5 sm:p-6">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-[#C6A15B]/10"/>
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-[#C6A15B]/10"/>
          <div className="relative">
            <Badge tone="gold"><Sparkles size={11}/> EVENT IDENTITY</Badge>
            
            {/* Nama & Tema Acara Dinamis */}
            <h2 className="mt-5 text-2xl font-semibold leading-tight text-[#F7F5F0]">
              {eventInfo?.title || 'Gen Z Indonesia 2026'}<br/>
              <span className="text-[#C6A15B]">{eventInfo?.theme || 'The Nusantara Legends Go to the World'}</span>
            </h2>
            
            <p className="mt-3 max-w-xs text-[11px] leading-5 text-slate-400">
              Satu tiket digital. Satu pengalaman yang berkesan. Warisan Nusantara menuju panggung dunia.
            </p>
            
            <div className="mt-5 space-y-3 border-t border-white/[.08] pt-4">
              {/* Lokasi Acara Dinamis */}
              <div className="flex items-center gap-3 text-[10px] text-slate-300">
                <MapPin size={14} className="shrink-0 text-[#C6A15B]"/>
                {eventInfo?.location || 'Platinum Cineplex Milenial Hub Metland Cibitung'}
              </div>
              
              {/* Tanggal Acara Dinamis */}
              <div className="flex items-center gap-3 text-[10px] text-slate-300">
                <CalendarDays size={14} className="shrink-0 text-[#C6A15B]"/>
                {formatDate(eventInfo?.event_date)}
              </div>
            </div>

            <Button className="mt-5 w-full" onClick={() => setPage('invitations')}>
              Kelola undangan <ArrowRight size={14}/>
            </Button>
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/[.07] bg-[#17212A]">
        <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Undangan terbaru</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('invitations')}>
            Lihat semua <ArrowRight size={13}/>
          </Button>
        </div>
        <div className="divide-y divide-white/[.05]">
          {invitations.slice(0, 4).map(item => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#C6A15B]">
                {item.type === 'school' ? <School size={16}/> : item.type === 'vip' ? <Crown size={16}/> : <HeartHandshake size={16}/>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-slate-200">{getInvitee(item)}</div>
                <div className="mt-1 truncate text-[9px] text-slate-500">{item.ticket_code} · {item.seat_area}</div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-[10px] font-medium text-slate-300">{item.scan_count}/{item.max_scans} orang</div>
                <div className="mt-1 text-[9px] text-slate-500">Pemindaian</div>
              </div>
              <Badge tone={item.scan_count >= item.max_scans ? 'red' : 'green'}>
                {item.scan_count >= item.max_scans ? 'Penuh' : 'Aktif'}
              </Badge>
              <button title="Lihat tiket" onClick={() => onPreview(item)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-[#C6A15B]">
                <Eye size={15}/>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}