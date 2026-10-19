import { useState, useEffect } from 'react'
import { XCircle, MapPin, CalendarDays, ShieldCheck } from 'lucide-react'

// Import komponen UI & data yang ada
import Brand from '../components/ui/Brand'
import Badge from '../components/ui/Badge'
import { categoryLabel } from '../data'

// Komponen QRArt
function QRArt({ value = 'GZ26-GOLDEN-TICKET', size = 160 }) {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm" style={{ maxWidth: size }}>
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(value)}`} 
        alt={`QR Code ${value}`}
        className="aspect-square w-full object-contain"
      />
    </div>
  )
}

// Helper pemformat tanggal Indonesia (contoh: 24 Oktober 2026)
const formatDate = (dateString) => {
  if (!dateString) return 'Tanggal belum dikonfigurasi'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default function PublicTicketPage({ ticketCode }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPublicTicket = async () => {
      try {
        // Ganti string fetch lama yang hardcode
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
        const res = await fetch(`${API_BASE_URL}/public/tickets/${ticketCode}`, {
          headers: { 'Accept': 'application/json' }
        })
        const json = await res.json()
        
        if (res.ok && json.success) {
          setTicket(json.data)
        } else {
          setError('Undangan / Kode Tiket tidak ditemukan.')
        }
      } catch (err) {
        setError('Gagal terhubung ke server. Periksa koneksi internet Anda.')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicTicket()
  }, [ticketCode])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101820] text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C6A15B] border-t-transparent"/>
          <p className="text-xs">Memuat Tiket Digital...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#101820] p-4 text-center text-slate-300">
        <div className="max-w-md rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6">
          <XCircle size={36} className="mx-auto mb-3 text-rose-400" />
          <h2 className="text-lg font-semibold text-white">Tiket Tidak Ditemukan</h2>
          <p className="mt-2 text-xs text-slate-400">{error || 'Kode tiket tidak valid.'}</p>
        </div>
      </div>
    )
  }

  const invitee = ticket.type === 'school' 
    ? ticket.school_name 
    : ticket.type === 'vip' 
    ? ticket.guest_name 
    : [ticket.parent_1_name, ticket.parent_2_name].filter(Boolean).join(' & ')

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101820] p-4 sm:p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] border border-[#C6A15B]/30 bg-[#101820] shadow-2xl">
        {/* Header Tiket */}
        <div className="pattern relative overflow-hidden border-b border-[#C6A15B]/20 px-6 pb-5 pt-6">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#C6A15B]/20"/>
          <div className="relative flex items-center justify-between">
            <Brand compact />
            <Badge tone="gold">DIGITAL PASS</Badge>
          </div>
          <div className="relative mt-7 text-[9px] font-semibold tracking-[.25em] text-[#C6A15B]">
            {ticket.event_info?.title || 'Gen Z Indonesia 2026'}
          </div>
          <h3 className="relative mt-2 text-xl font-bold leading-tight text-[#F7F5F0]">
            {ticket.event_info?.theme || 'The Nusantara Legends Go to the World'}
          </h3>

          {/* Lokasi & Tanggal Acara */}
          <div className="relative mt-4 space-y-1.5 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="shrink-0 text-[#C6A15B]"/> 
              {ticket.event_info?.location || 'Platinum Cineplex Milenial Hub Metland Cibitung'}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={13} className="shrink-0 text-[#C6A15B]"/> 
              {formatDate(ticket.event_info?.event_date)}
            </div>
          </div>
        </div>

        {/* Detail Penerima */}
        <div className="px-6 py-5">
          <div className="text-[9px] tracking-[.2em] text-slate-500">INVITED GUEST</div>
          <div className="mt-1 text-lg font-semibold text-white">{invitee}</div>
          
          <div className="mt-3 flex items-center justify-between">
            <Badge tone="gold">{categoryLabel[ticket.type]}</Badge>
            <span className="text-[11px] font-semibold text-[#D9B96E]">{ticket.seat_area}</span>
          </div>

          {/* Display Barcode / QR */}
          <div className="my-5 flex flex-col items-center rounded-2xl bg-white p-4 text-center">
            <QRArt value={ticket.ticket_code} size={180}/>
            <div className="mt-3 text-xs font-mono font-bold tracking-widest text-[#101820]">
              {ticket.ticket_code}
            </div>
            <div className="mt-1 text-[9px] text-slate-500">
              Tunjukkan barcode ini kepada petugas di pintu masuk
            </div>
          </div>
          <div className="flex items-center justify-center border-t border-dashed border-white/15 pt-4">
            <button 
              onClick={() => window.location.href = `/public/${ticketCode}`}
              className="mb-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#C6A15B] transition"
            >
              ← Kembali ke Beranda Informasi
            </button>
          </div>
          {/* Sisa Kuota Scan */}
          <div className="flex items-center justify-between border-t border-dashed border-white/15 pt-4">
            <div>
              <div className="text-[9px] text-slate-500">SISA KUOTA ENTRY</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {ticket.remaining_scans} <span className="text-[10px] font-normal text-slate-500">dari {ticket.max_scans} orang</span>
              </div>
            </div>
            <ShieldCheck className="text-[#C6A15B]" size={24}/>
          </div>
        </div>
      </div>
    </div>
  )
}