import { Ticket } from 'lucide-react'

export default function EmptyState({ icon: Icon = Ticket, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.03] text-slate-500">
        <Icon size={22}/>
      </div>
      <div className="mt-4 text-sm font-semibold text-slate-200">{title}</div>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{description}</p>
    </div>
  )
}