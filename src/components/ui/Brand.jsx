import { Sparkles } from 'lucide-react'
export default function Brand({ compact = false }) {
  return <div className="flex items-center gap-3">
    <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#C6A15B]/45 bg-[#C6A15B]/10 text-[#C6A15B]">
      <Sparkles size={21} strokeWidth={1.6} />
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#101820] bg-[#C6A15B]" />
    </div>
    {!compact && <div><div className="text-[15px] font-bold tracking-wide text-[#F7F5F0]">GOLDEN<span className="text-[#C6A15B]">TICKET</span></div><div className="mt-0.5 text-[9px] font-medium tracking-[.23em] text-slate-500">GEN Z INDONESIA 2026</div></div>}
  </div>
}