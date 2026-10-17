import { Download, Users, Ticket, ChartNoAxesCombined, AlertTriangle } from 'lucide-react'

// Import Komponen UI
import Button from '../components/ui/Button'
import MetricCard from '../components/ui/MetricCard'
import SectionTitle from '../components/ui/SectionTitle'

// Import Helper & Data
import { categoryLabel } from '../data'

export default function AttendancePage({ invitations }) {
  const used = invitations.reduce((s, i) => s + i.scan_count, 0)
  const cap = invitations.reduce((s, i) => s + i.max_scans, 0)

  return (
    <div className="animate-in">
      <SectionTitle 
        eyebrow="ATTENDANCE ANALYTICS" 
        title="Rekap Kehadiran" 
        subtitle="Ringkasan pemindaian berhasil dan alokasi kuota berdasarkan kategori." 
        action={
          <Button variant="secondary" onClick={() => window.print()}>
            <Download size={14}/>Cetak halaman
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard title="Kehadiran tercatat" value={used} note="Jumlah scan sukses (data demo)" icon={Users} tone="green"/>
        <MetricCard title="Total alokasi kuota" value={cap} note="Gabungan kuota tiket" icon={Ticket}/>
        <MetricCard title="Persentase penggunaan" value={`${cap ? Math.round(used / cap * 100) : 0}%`} note="Kehadiran dibanding total kuota" icon={ChartNoAxesCombined} tone="blue"/>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[.07] bg-[#17212A]">
        <div className="border-b border-white/[.06] p-5">
          <h2 className="text-sm font-semibold text-slate-100">Ringkasan per kategori</h2>
          <p className="mt-1 text-[10px] text-slate-500">Data agregat dari tiket yang tersedia di preview</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead>
              <tr className="border-b border-white/[.06] text-[9px] tracking-wider text-slate-500">
                <th className="px-5 py-4">KATEGORI</th>
                <th className="px-5 py-4">JUMLAH TIKET</th>
                <th className="px-5 py-4">HADIR</th>
                <th className="px-5 py-4">KUOTA</th>
                <th className="px-5 py-4">PENGGUNAAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[.05]">
              {['school', 'vip', 'parent'].map(type => {
                const list = invitations.filter(i => i.type === type)
                const scans = list.reduce((s, i) => s + i.scan_count, 0)
                const max = list.reduce((s, i) => s + i.max_scans, 0)
                const pct = max ? Math.round(scans / max * 100) : 0
                return (
                  <tr key={type}>
                    <td className="px-5 py-4 text-xs text-slate-200">{categoryLabel[type]}</td>
                    <td className="px-5 py-4 text-xs text-slate-300">{list.length}</td>
                    <td className="px-5 py-4 text-xs text-slate-300">{scans}</td>
                    <td className="px-5 py-4 text-xs text-slate-300">{max}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full bg-[#C6A15B]" style={{ width: `${pct}%` }}/>
                        </div>
                        <span className="text-[10px] text-slate-400">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[.04] p-4 text-[10px] leading-5 text-amber-100/70">
        <AlertTriangle size={14} className="mr-2 inline text-amber-300"/> Laporan ini memakai data demo. Riwayat scan dengan waktu, petugas, dan hasil perlu disediakan backend melalui endpoint log khusus.
      </div>
    </div>
  )
}