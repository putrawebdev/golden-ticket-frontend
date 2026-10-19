import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Copy, 
  Pencil, 
  Trash2 
} from 'lucide-react'

// Import Komponen UI
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SectionTitle from '../components/ui/SectionTitle'
import EmptyState from '../components/ui/EmptyState'

// Import Helper & Data
import { categoryLabel, getInvitee } from '../data'

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

export default function InvitationsPage({ invitations, setInvitations, query, setQuery, onCreate, onEdit, onPreview, notify, token }) {
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = invitations.filter(item => {
    const term = query.toLowerCase()
    const matches = !term || [getInvitee(item), item.ticket_code, item.school_name, item.seat_area, categoryLabel[item.type]].filter(Boolean).join(' ').toLowerCase().includes(term)
    return matches && (filter === 'all' || item.type === filter) && (status === 'all' || (status === 'active' ? item.scan_count < item.max_scans : item.scan_count >= item.max_scans))
  })

  const pageSize = 5
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [filter, status, query])

  // 1. Disesuaikan agar menyalin tautan /public/KODE_TIKET (Halaman Home/Landing)
  const copy = async item => { 
    try { 
      const publicUrl = `${window.location.origin}/public/${item.ticket_code}`
      await navigator.clipboard.writeText(publicUrl)
      notify('Tautan undangan publik disalin.') 
    } catch { 
      notify('Browser tidak mengizinkan salin otomatis.') 
    } 
  }

  // 2. Fungsi Hapus yang tersambung langsung ke API Backend PostgreSQL
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus tiket ini secara permanen dari database?')) return

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api'
      const res = await fetch(`${API_BASE_URL}/invitations/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setInvitations(prev => prev.filter(i => i.id !== id))
        notify('Tiket berhasil dihapus dari database.')
      } else {
        notify(json.message || 'Gagal menghapus tiket dari server.')
      }
    } catch (err) {
      console.error(err)
      notify('Terjadi kesalahan koneksi ke server.')
    }
  }

  return (
    <div className="animate-in">
      <SectionTitle 
        eyebrow="TICKET MANAGEMENT" 
        title="Manajemen Undangan" 
        subtitle="Kelola data penerima, alokasi tempat duduk, dan kuota tiket digital." 
        action={<Button onClick={onCreate}><Plus size={14}/>Buat undangan</Button>}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[.07] bg-[#17212A] p-4">
          <div className="text-[10px] text-slate-500">Semua tiket</div>
          <div className="mt-1 text-xl font-semibold text-white">{invitations.length}</div>
        </div>
        <div className="rounded-xl border border-white/[.07] bg-[#17212A] p-4">
          <div className="text-[10px] text-slate-500">Tiket aktif</div>
          <div className="mt-1 text-xl font-semibold text-emerald-300">{invitations.filter(i => i.scan_count < i.max_scans).length}</div>
        </div>
        <div className="rounded-xl border border-white/[.07] bg-[#17212A] p-4">
          <div className="text-[10px] text-slate-500">Kuota penuh</div>
          <div className="mt-1 text-xl font-semibold text-rose-300">{invitations.filter(i => i.scan_count >= i.max_scans).length}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#17212A]">
        <div className="flex flex-col gap-3 border-b border-white/[.06] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="relative md:hidden">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama, kode, sekolah..." className={`${inputClass} pl-9`}/>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['all', 'Semua'],
                ['school', 'Sekolah'],
                ['vip', 'VIP'],
                ['parent', 'Orang tua']
              ].map(([id, label]) => (
                <button key={id} onClick={() => setFilter(id)} className={`rounded-lg px-3 py-2 text-[10px] font-medium transition ${filter === id ? 'bg-[#C6A15B]/15 text-[#D9B96E]' : 'text-slate-400 hover:bg-white/[.04]'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-500"/>
              <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border border-white/10 bg-[#101820] px-3 py-2 text-[10px] text-slate-300 outline-none">
                <option value="all">Semua status</option>
                <option value="active">Aktif</option>
                <option value="full">Kuota penuh</option>
              </select>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Undangan tidak ditemukan" description="Coba ubah kata kunci atau filter yang digunakan."/>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-white/[.06] text-[9px] font-semibold tracking-[.08em] text-slate-500">
                    <th className="px-5 py-3.5">PENERIMA</th>
                    <th className="px-4 py-3.5">KATEGORI</th>
                    <th className="px-4 py-3.5">KODE TIKET</th>
                    <th className="px-4 py-3.5">TEMPAT DUDUK</th>
                    <th className="px-4 py-3.5">KUOTA</th>
                    <th className="px-4 py-3.5">STATUS</th>
                    <th className="px-5 py-3.5 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[.045]">
                  {rows.map(item => (
                    <tr key={item.id} className="transition hover:bg-white/[.018]">
                      <td className="px-5 py-4">
                        <div className="max-w-[180px] truncate text-[11px] font-medium text-slate-200">{getInvitee(item)}</div>
                        <div className="mt-1 text-[9px] text-slate-500">
                          {item.type === 'school' ? `${item.teacher_names?.length || 0} guru pendamping` : item.type === 'vip' ? 'Undangan individual' : 'Undangan keluarga'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={item.type === 'vip' ? 'gold' : 'neutral'}>{categoryLabel[item.type]}</Badge>
                      </td>
                      <td className="px-4 py-4 font-mono text-[10px] text-slate-400">{item.ticket_code}</td>
                      <td className="px-4 py-4 text-[10px] text-slate-300">{item.seat_area}</td>
                      <td className="px-4 py-4">
                        <div className="text-[10px] font-medium text-slate-200">{item.scan_count}<span className="text-slate-500">/{item.max_scans}</span></div>
                        <div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${item.scan_count >= item.max_scans ? 'bg-rose-400' : 'bg-[#C6A15B]'}`} style={{ width: `${Math.min(100, (item.scan_count / item.max_scans) * 100)}%` }}/>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={item.scan_count >= item.max_scans ? 'red' : 'green'}>
                          <span className={`h-1.5 w-1.5 rounded-full ${item.scan_count >= item.max_scans ? 'bg-rose-300' : 'bg-emerald-300'}`}/>
                          {item.scan_count >= item.max_scans ? 'Penuh' : 'Aktif'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button title="Pratinjau tiket" onClick={() => onPreview(item)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-[#C6A15B]"><Eye size={14}/></button>
                          <button title="Salin tautan" onClick={() => copy(item)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-[#C6A15B]"><Copy size={14}/></button>
                          <button title="Edit tiket" onClick={() => onEdit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-[#C6A15B]"><Pencil size={14}/></button>
                          <button 
                            title="Hapus tiket" 
                            onClick={() => handleDelete(item.id)} 
                            className="rounded-lg p-2 text-slate-600 hover:bg-rose-400/10 hover:text-rose-300"
                          >
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-white/[.06] px-5 py-4 sm:flex-row sm:items-center">
              <span className="text-[10px] text-slate-500">
                Menampilkan {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} dari {filtered.length} tiket
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="px-2.5 py-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14}/></Button>
                <span className="text-[10px] text-slate-400">Halaman {page} / {pages}</span>
                <Button variant="secondary" className="px-2.5 py-2" disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14}/></Button>
              </div>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-[10px] leading-5 text-slate-600">Terhubung secara live dengan REST API Backend Laravel & PostgreSQL.</p>
    </div>
  )
}