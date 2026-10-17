export default function Badge({ children, tone = 'neutral' }) {
  const styles = {
    neutral: 'border-white/10 bg-white/[.05] text-slate-300',
    gold: 'border-[#C6A15B]/25 bg-[#C6A15B]/10 text-[#D9B96E]',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    red: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
    blue: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  }
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[tone]}`}>{children}</span>
}