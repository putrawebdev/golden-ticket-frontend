import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Ticket, MapPin, Calendar, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react'

export default function PublicTicketPage({ ticketCode }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api'
        // Memanggil API public ticket
        const res = await fetch(`${API_BASE_URL}/public/ticket/${ticketCode}`, {
          headers: { 'Accept': 'application/json' }
        })
        const json = await res.json()

        if (json.success && json.data) {
          setTicket(json.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching ticket:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (ticketCode) fetchTicket()
  }, [ticketCode])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F14] text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#C6A15B]" />
          <span className="text-xs font-medium tracking-wide">Memuat Tiket Digital...</span>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F14] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-rose-500/20 bg-[#17212A] p-8 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <Ticket size={28} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-100">Tiket Tidak Ditemukan</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Kode tiket <span className="font-mono text-rose-300">{ticketCode}</span> tidak valid.
          </p>
        </div>
      </div>
    )
  }

  const event = ticket.event || ticket.event_info || {}
  const guestName = ticket.guest_name || ticket.school_name || 'Tamu Undangan'

  return (
    <div className="min-h-screen bg-[#0A0F14] font-sans text-slate-100 selection:bg-[#C6A15B]/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101820]/80 px-5 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button 
            onClick={() => window.location.href = `/public/${ticketCode}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#C6A15B] transition"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </button>
          <span className="rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3 py-1 text-[10px] font-semibold text-[#C6A15B]">
            E-Ticket
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        {/* Kartu Tiket Utama */}
        <div className="relative overflow-hidden rounded-3xl border border-[#C6A15B]/30 bg-[#101820] shadow-2xl">
          
          {/* Decorative Header Banner */}
          <div className="border-b border-white/10 bg-gradient-to-r from-[#17212A] via-[#1F2C37] to-[#17212A] p-6 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C6A15B]">
              {event.title || 'Gen Z Indonesia 2026'}
            </div>
            <h1 className="mt-1 text-base font-extrabold text-white">
              {event.theme || 'The Nusantara Legends Go to the World'}
            </h1>
            <div className="mt-3 flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[#C6A15B]" />
                <span>{event.location || 'Platinum Cineplex Milenial Hub'}</span>
              </div>
              {event.event_date && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={13} />
                  <span>{event.event_date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Body Info Penerima */}
          <div className="p-6 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Invited Guest
            </div>
            <div className="mt-1 text-lg font-bold text-[#C6A15B]">
              {guestName}
            </div>

            <div className="mt-2 flex justify-center gap-2 text-[10px]">
              <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-semibold uppercase text-slate-300">
                {ticket.type} Pass
              </span>
              <span className="rounded-md border border-[#C6A15B]/20 bg-[#C6A15B]/10 px-2.5 py-1 font-semibold text-[#D9B96E]">
                Area: {ticket.seat_area}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="my-6 inline-block rounded-2xl border border-white/10 bg-white p-4 shadow-inner">
              <QRCodeSVG
                value={ticket.ticket_code}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#080D12"
                level="H"
                includeMargin={false}
              />
              <div className="mt-3 font-mono text-xs font-extrabold tracking-widest text-slate-900">
                {ticket.ticket_code}
              </div>
            </div>

            <p className="text-[10px] text-slate-500">
              Tunjukkan QR Code ini kepada petugas di pintu masuk acara.
            </p>

            {/* Kuota Information */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-[#17212A] p-3.5">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Sisa Kuota Entry
              </div>
              <div className="mt-0.5 text-xs font-bold text-[#D9B96E]">
                {ticket.remaining_scans ?? (ticket.max_scans - ticket.scan_count)} dari {ticket.max_scans} Orang
              </div>
            </div>
          </div>

        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Terverifikasi Sistem Gatekeeper SMK Metland Cibitung</span>
        </div>
      </main>
    </div>
  )
}