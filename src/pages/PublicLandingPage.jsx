import { useState, useEffect } from 'react'
import { 
  Ticket, 
  School, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ShieldCheck,
  User,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react'

export default function PublicLandingPage({ ticketCode }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api'
        const res = await fetch(`${API_BASE_URL}/public/ticket/${ticketCode}`, {
          headers: { 'Accept': 'application/json' }
        })
        const json = await res.json()

        if (json.success && json.data) {
          setData(json.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (ticketCode) fetchPublicData()
  }, [ticketCode])

  // Function untuk update RSVP
  const handleRSVP = async (status) => {
    try {
      setSubmitting(true)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api'
      const res = await fetch(`${API_BASE_URL}/public/ticket/${ticketCode}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      const json = await res.json()
      if (json.success) {
        setData(prev => ({ ...prev, rsvp_status: status }))
      }
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan konfirmasi. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenTicket = () => {
    window.location.href = `/public/tickets/${ticketCode}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F14] text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#C6A15B]" />
          <span className="text-xs font-medium tracking-wide">Memuat Informasi Undangan...</span>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F14] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-rose-500/20 bg-[#17212A] p-8 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <Ticket size={28} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-100">Undangan Tidak Ditemukan</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">Kode tiket tidak valid.</p>
        </div>
      </div>
    )
  }

  const { event } = data
  const rsvp_status = data.rsvp_status || 'pending'
  const guestName = data.guest_name || data.school_name || 'Tamu Undangan Terhormat'

  return (
    <div className="min-h-screen bg-[#0A0F14] font-sans text-slate-100 selection:bg-[#C6A15B]/30">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101820]/80 px-5 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_mets.png" alt="SMK Metland" className="h-8 w-8 object-contain" />
            <div>
              <div className="text-xs font-bold tracking-wider text-white">
                GOLDEN<span className="text-[#C6A15B]">TICKET</span>
              </div>
              <div className="text-[10px] text-slate-400">SMK Metland Cibitung</div>
            </div>
          </div>
          <span className="rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3 py-1 text-[10px] font-semibold text-[#C6A15B]">
            Official Invitation
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <div className="space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-4 py-1.5 text-xs font-semibold text-[#C6A15B]">
            <Sparkles size={14} />
            <span>{event?.title || 'Gen Z Indonesia 2026'}</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Selamat Datang di Acara <br />
            <span className="bg-gradient-to-r from-[#F7F5F0] via-[#C6A15B] to-[#D9B96E] bg-clip-text text-transparent">
              SMK Metland Cibitung
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            {event?.theme}
          </p>

          {/* Sapaan Nama Tamu */}
          <div className="mt-6 inline-block w-full max-w-md rounded-2xl border border-white/10 bg-[#17212A] p-5 text-left shadow-2xl">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              <User size={13} className="text-[#C6A15B]" />
              <span>Undangan Ditujukan Kepada:</span>
            </div>
            <div className="mt-1 text-base font-bold text-[#C6A15B] sm:text-lg">
              {guestName}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300">
                {data.type} Pass
              </span>
              <span>• Area Duduk: <strong className="text-slate-200">{data.seat_area}</strong></span>
            </div>
          </div>

          {/* SECTION KONFIRMASI KEHADIRAN (RSVP) */}
          <div className="mx-auto max-w-md rounded-2xl border border-[#C6A15B]/20 bg-[#101820] p-6 text-center shadow-xl">
            <h3 className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <HelpCircle size={15} className="text-[#C6A15B]" />
              Konfirmasi Kehadiran Tamu
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Mohon konfirmasikan kehadiran Anda untuk keperluan alokasi tempat duduk dan konsumsi acara.
            </p>

            {/* Pilihan Tombol / Status */}
            {rsvp_status === 'pending' && (
              <div className="mt-5 flex gap-3">
                <button
                  disabled={submitting}
                  onClick={() => handleRSVP('attending')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition active:scale-95"
                >
                  <CheckCircle size={16} />
                  <span>Bisa Hadir</span>
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleRSVP('declined')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/40 px-4 py-3 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition active:scale-95"
                >
                  <XCircle size={16} />
                  <span>Tidak Bisa Hadir</span>
                </button>
              </div>
            )}

            {rsvp_status === 'attending' && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                <span>Terima kasih! Anda telah mengonfirmasi <strong>HADIR</strong>.</span>
              </div>
            )}

            {rsvp_status === 'declined' && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center justify-center gap-2">
                <XCircle size={16} />
                <span>Anda mengonfirmasi <strong>TIDAK BISA HADIR</strong>.</span>
              </div>
            )}

            {/* Tombol ke Tiket Hanya Muncul jika 'attending' */}
            {rsvp_status === 'attending' && (
              <div className="mt-5 pt-3 border-t border-white/10">
                <button
                  onClick={handleOpenTicket}
                  className="group w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#C6A15B] to-[#D9B96E] px-6 py-3.5 text-xs font-bold text-[#080D12] shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Ticket size={18} />
                  <span>Lihat Tiket & QR Code Saya</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {rsvp_status === 'declined' && (
              <p className="mt-3 text-[10px] italic text-slate-500">
                Tiket tidak dapat diakses karena Anda menandai tidak hadir. Terima kasih atas konfirmasinya.
              </p>
            )}
          </div>

        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#17212A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A15B]">
              <Calendar size={16} />
              <span>Jadwal & Lokasi</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-medium text-slate-200">
                <MapPin size={14} className="shrink-0 text-slate-400" />
                <span>{event?.location}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#17212A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A15B]">
              <School size={16} />
              <span>Penyelenggara</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Dikelola oleh pengurus **OSIS SMK Metland Cibitung**.
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
          <ShieldCheck size={15} className="text-emerald-400" />
          <span>Sistem E-Ticket Resmi dengan Gatekeeper Verification</span>
        </div>
      </main>
    </div>
  )
}