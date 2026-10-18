import { MapPin, ShieldCheck, AlertTriangle } from 'lucide-react'

// Import Komponen UI
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Brand from '../ui/Brand'
import Button from '../ui/Button'
import QRArt from './QRArt'

// Import Data/Helper
import { categoryLabel, getInvitee } from '../../data'
export default function TicketPreview({ item, onClose }) {
  const invitee = getInvitee(item)
  return <Modal title="Pratinjau Golden Ticket" subtitle="Tampilan tiket digital untuk penerima undangan" onClose={onClose} wide>
    <div className="mx-auto max-w-sm overflow-hidden rounded-[28px] border border-[#C6A15B]/30 bg-[#101820] shadow-xl">
      <div className="pattern relative overflow-hidden border-b border-[#C6A15B]/20 px-6 pb-5 pt-6">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#C6A15B]/20"/><div className="absolute -right-7 -top-7 h-24 w-24 rounded-full border border-[#C6A15B]/20"/>
        <div className="relative flex items-center justify-between"><Brand compact/><Badge tone="gold">DIGITAL PASS</Badge></div>
        <div className="relative mt-7 text-[9px] font-semibold tracking-[.25em] text-[#C6A15B]">GEN Z INDONESIA 2026</div>
        <h3 className="relative mt-2 text-2xl font-bold leading-tight tracking-tight text-[#F7F5F0]">The Nusantara<br/><span className="text-[#C6A15B]">Legends Go to the World</span></h3>
        <div className="relative mt-4 flex items-center gap-2 text-[10px] text-slate-400"><MapPin size={13} className="text-[#C6A15B]"/> Platinum Cineplex Milenial Hub Metland Cibitung</div>
      </div>
      <div className="px-6 py-5">
        <div className="text-[9px] tracking-[.2em] text-slate-500">INVITED GUEST</div><div className="mt-1 text-lg font-semibold text-white">{invitee || 'Nama penerima undangan'}</div>
        <div className="mt-3 flex items-center justify-between"><Badge tone="gold">{categoryLabel[item.type]}</Badge><span className="text-[10px] text-slate-400">{item.seat_area}</span></div>
        <div className="my-5 flex flex-col items-center rounded-2xl bg-white p-4">
          <QRArt value={item.ticket_code} size={174}/>
          <div className="mt-3 text-[10px] font-semibold tracking-[.14em] text-[#101820]">{item.ticket_code}</div>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-white/15 pt-4"><div><div className="text-[9px] text-slate-500">SISA KUOTA</div><div className="mt-1 text-sm font-semibold text-white">{Math.max(0, item.max_scans - item.scan_count)} <span className="text-[10px] font-normal text-slate-500">dari {item.max_scans} orang</span></div></div><ShieldCheck className="text-[#C6A15B]" size={22}/></div>
      </div>
    </div>
    <div className="mt-4 flex justify-end"><Button variant="secondary" onClick={onClose}>Tutup pratinjau</Button></div>
  </Modal>
}