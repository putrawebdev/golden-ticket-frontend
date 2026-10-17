export default function SectionTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 text-[9px] font-bold tracking-[.22em] text-[#C6A15B]">{eyebrow}</div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#F7F5F0] sm:text-[27px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}