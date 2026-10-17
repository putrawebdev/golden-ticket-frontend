import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => { 
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn) 
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" 
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-[#141E27] shadow-2xl sm:rounded-3xl ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[.07] bg-[#141E27]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18}/>
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  )
}