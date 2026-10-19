import { useState, useEffect } from 'react'
import { Ticket, School, Sparkles, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react'

export default function PublicLandingPage({ ticketCode }) {
  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch nama tamu berdasarkan ticketCode (Opsional: agar menyapa nama tamu)
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api'
        const res = await fetch(`${API_BASE_URL}/public/ticket/${ticketCode}`)
        const json = await res.json()
        if (json.success) setGuest(json.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (ticketCode) fetchGuest()
  }, [ticketCode])

  const handleOpenTicket = () => {
    // Pindah URL ke halaman tiket tanpa perlu reload total
    window.location.href = `/public/tickets/${ticketCode}`
  }

  return (
    <div className="min-h-screen bg-[#0A0F14] text-slate-100 font-sans selection:bg-[#C6A15B]/30">
      {/* Top Bar / Header Branding */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101820]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo_mets.png" alt="SMK Metland" className="h-8 w-8 object-contain" />
          <div>
            <div className="text-xs font-bold tracking-wider text-white">GOLDEN<span className="text-[#C6A15B]">TICKET</span></div>
            <div className="text-[10px] text-slate-400">SMK Metland Cibitung</div>
          </div>
        </div>
        <span className="rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3 py-1 text-[10px] font-semibold text-[#C6A15B]">
          Official Invitation
        </span>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-4 py-1.5 text-xs text-[#C6A15B]">
            <Sparkles size={14} />
            <span>Gen Z Indonesia 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang di <br />
            <span className="bg-gradient-to-r from-[#F7F5F0] via-[#C6A15B] to-[#D9B96E] bg-clip-text text-transparent">
              SMK Metland Cibitung
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed">
            Penyelenggara Resmi Event Kebudayaan & Prestasi Siswa. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam perayaan istimewa ini.
          </p>

          {/* Sapaan Nama Tamu */}
          {guest && (
            <div className="mt-6 inline-block rounded-2xl border border-white/10 bg-[#17212A] p-4 text-left shadow-2xl">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Undangan Khusus Ditujukan Kepada:</div>
              <div className="text-base font-bold text-[#C6A15B] mt-0.5">
                {guest.guest_name || guest.school_name || 'Tamu Undangan Terhormat'}
              </div>
            </div>
          )}

          {/* Call to Action Button */}
          <div className="pt-6">
            <button
              onClick={handleOpenTicket}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#C6A15B] to-[#D9B96E] px-8 py-4 text-sm font-bold text-[#080D12] shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[#C6A15B]/20 active:scale-[0.98]"
            >
              <Ticket size={20} className="transition-transform group-hover:rotate-12" />
              <span>Lihat Tiket Saya</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {/* Card Event Info */}
          <div className="rounded-2xl border border-white/10 bg-[#17212A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-semibold">
              <Calendar size={16} />
              <span>Jadwal & Lokasi Acara</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white">Platinum Cineplex Milenial Hub</div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <MapPin size={13} /> Metland Cibitung, Bekasi
              </div>
            </div>
          </div>

          {/* Card Organization Info */}
          <div className="rounded-2xl border border-white/10 bg-[#17212A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-semibold">
              <School size={16} />
              <span>Penyelenggara (OSIS)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dikelola oleh pengurus OSIS & Ekstrakurikuler SMK Metland Cibitung dengan sistem verifikasi gatekeeper digital.
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-12 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Sistem E-Ticket Resmi Berbasis QR Code Terverifikasi</span>
        </div>
      </main>
    </div>
  )
}