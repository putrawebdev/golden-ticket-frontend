import { ArrowUpRight } from 'lucide-react'

export default function MetricCard({ title, value, note, trend, icon: Icon, tone = 'gold' }) {
  return (
    <div className="group rounded-2xl border border-white/[.075] bg-[#17212A] p-5 transition-all hover:-translate-y-0.5 hover:border-[#C6A15B]/25">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone === 'green' ? 'bg-emerald-400/10 text-emerald-300' : tone === 'blue' ? 'bg-sky-400/10 text-sky-300' : 'bg-[#C6A15B]/10 text-[#C6A15B]'}`}>
          {Icon && <Icon size={18}/>}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
            <ArrowUpRight size={13}/>{trend}
          </span>
        )}
      </div>
      <div className="mt-5 text-[11px] font-medium text-slate-400">{title}</div>
      <div className="mt-1.5 text-3xl font-semibold tracking-tight text-[#F7F5F0]">{value}</div>
      <div className="mt-2 text-[10px] text-slate-500">{note}</div>
    </div>
  )
}