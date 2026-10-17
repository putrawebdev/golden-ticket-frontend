export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#C6A15B] text-[#101820] hover:bg-[#D8B66D] shadow-lg shadow-[#C6A15B]/10',
    secondary: 'border border-white/10 bg-white/[.04] text-slate-200 hover:bg-white/[.08]',
    ghost: 'text-slate-400 hover:bg-white/[.06] hover:text-white',
    danger: 'border border-rose-400/20 bg-rose-400/10 text-rose-300 hover:bg-rose-400/15',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>{children}</button>
}