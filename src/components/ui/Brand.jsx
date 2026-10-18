import { User } from 'lucide-react'
export default function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      {/* <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C6A15B]/45 bg-[#C6A15B]/10"> */}
        <img 
          src="/logo_mets.png" 
          alt="Logo SMK Metland" 
          className="h-9 w-9 object-contain" 
        />
        {/* <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#101820] bg-[#C6A15B]" /> */}
      {/* </div> */}

      {!compact && (
        <div>
          <div className="text-[15px] font-bold tracking-wide text-[#F7F5F0]">
            GOLDEN<span className="text-[#C6A15B]">TICKET</span>
          </div>
          <div className="text-xs text-slate-400">
            SMK Metland Cibitung
          </div>
        </div>
      )}
    </div>
  );
}