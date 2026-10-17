export default function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium text-slate-300">
        {label}{required && <span className="ml-1 text-[#C6A15B]">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[10px] leading-4 text-slate-500">{hint}</span>}
    </label>
  )
}   