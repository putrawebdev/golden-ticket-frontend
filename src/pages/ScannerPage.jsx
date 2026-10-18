import { useState, useRef, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  ScanLine, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  CircleHelp 
} from 'lucide-react'

// Import Komponen UI
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

// Import Helper Data
import { getInvitee, categoryLabel } from '../data'

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

export default function ScannerPage({ invitations, setInvitations, notify, token }) {
  const [running, setRunning] = useState(false)
  const [scannerState, setScannerState] = useState('idle')
  const [result, setResult] = useState(null)
  const [manualCode, setManualCode] = useState('')
  const [manualOpen, setManualOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  
  const scannerRef = useRef(null)
  const processingRef = useRef(false)
  const isRunningRef = useRef(false)

  const stopScanner = async () => {
    isRunningRef.current = false
    if (scannerRef.current) {
      try { if (scannerRef.current.isScanning) await scannerRef.current.stop() } catch {}
      try { await scannerRef.current.clear() } catch {}
      scannerRef.current = null
    }
    setRunning(false)
  }

  useEffect(() => () => { if (scannerRef.current) { try { scannerRef.current.stop() } catch {} } }, [])

  const validate = async (code) => {
    if (processingRef.current) return
    processingRef.current = true
    await stopScanner()

    try {
      // Ganti string fetch lama yang hardcode
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
      const response = await fetch(`${API_BASE_URL}/gatekeeper/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticket_code: code.trim() })
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        setInvitations(prev => prev.map(i => i.id === data.item.id ? data.item : i))
        setResult(data)
      } else {
        setResult({
          ok: false,
          reason: data.reason || 'Akses ditolak',
          detail: data.detail || 'Tiket tidak valid atau kuota penuh.',
          item: data.item || null,
          code
        })
      }
    } catch (error) {
      setResult({
        ok: false,
        reason: 'Gagal terhubung ke server',
        detail: 'Pastikan backend Laravel sedang berjalan.',
        item: null,
        code
      })
    }

    setScannerState('result')
    processingRef.current = false
  }

  const startScanner = async () => {
    setCameraError('')
    setResult(null)
    setScannerState('scanning')
    
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('golden-qr-reader', {
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        })
      }
      
      isRunningRef.current = true

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 220, height: 220 }
        },
        decodedText => {
          if (!isRunningRef.current || processingRef.current) return
          isRunningRef.current = false
          validate(decodedText)
        },
        errorMessage => {}
      )
      setRunning(true)
    } catch (err) {
      isRunningRef.current = false
      setRunning(false)
      setScannerState('idle')
      setCameraError(
        err?.message?.includes('Permission')
          ? 'Izin kamera ditolak. Aktifkan izin kamera di peramban.'
          : 'Kamera tidak dapat diaktifkan. Pastikan menggunakan localhost atau HTTPS.'
      )
    }
  }

  const continueScan = () => { 
    setResult(null)
    setScannerState('idle')
    setManualCode('')
    processingRef.current = false 
  }

  const selected = result?.item

  return (
    <div className="animate-in">
      <SectionTitle 
        eyebrow="ENTRY CONTROL / LIVE VALIDATION" 
        title="Gatekeeper Scanner" 
        subtitle="Pindai QR Code tamu untuk memvalidasi tiket dan mencatat kehadiran." 
        action={
          <Badge tone={running ? 'green' : 'neutral'}>
            <span className={`h-1.5 w-1.5 rounded-full ${running ? 'bg-emerald-300' : 'bg-slate-500'}`}/>
            {running ? 'Kamera aktif' : 'Kamera nonaktif'}
          </Badge>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#17212A]">
          <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-4">
            <div>
              <div className="text-xs font-semibold text-slate-100">QR Code reader</div>
              <div className="mt-1 text-[10px] text-slate-500">Arahkan kamera ke kode pada tiket tamu</div>
            </div>
            <Badge tone={running ? 'green' : 'neutral'}>{running ? 'Scanning' : 'Standby'}</Badge>
          </div>

          <div className="p-4 sm:p-6">
            <div className="relative mx-auto min-h-[300px] max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#080D12]">
              <div id="golden-qr-reader" className="qr-reader min-h-[300px] w-full overflow-hidden [&_video]:!rounded-xl [&_video]:!object-cover [&_img]:hidden [&_button]:rounded-lg [&_button]:bg-[#C6A15B] [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_button]:font-semibold [&_select]:rounded-lg [&_select]:bg-[#17212A] [&_select]:p-2 [&_select]:text-xs"/>
              {!running && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#080D12]/90 px-6 text-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-[#C6A15B]/25 bg-[#C6A15B]/[.06] text-[#C6A15B]">
                    <QrCode size={36} strokeWidth={1.2}/>
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#080D12] bg-slate-600"/>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-200">Siap untuk memindai</div>
                  <p className="mt-2 max-w-xs text-[10px] leading-5 text-slate-500">Kamera hanya aktif setelah petugas menekan tombol mulai dan memberikan izin browser.</p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="mt-3 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-3 text-[10px] leading-5 text-amber-200">
                <AlertTriangle size={15} className="mt-0.5 shrink-0"/>{cameraError}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {!running ? (
                <Button className="flex-1" onClick={startScanner}><Camera size={15}/>Mulai kamera</Button>
              ) : (
                <Button className="flex-1" variant="danger" onClick={async () => { await stopScanner(); setScannerState('idle') }}><CameraOff size={15}/>Hentikan kamera</Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setManualOpen(v => !v)}><QrCode size={15}/>Input kode manual</Button>
            </div>

            {manualOpen && (
              <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); if (manualCode.trim()) validate(manualCode) }}>
                <input value={manualCode} onChange={e => setManualCode(e.target.value)} className={`${inputClass} flex-1`} placeholder="Masukkan kode tiket..."/>
                <Button type="submit" disabled={!manualCode.trim()}>Validasi</Button>
              </form>
            )}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[.08] bg-[#17212A] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-100">Status pemeriksaan</h2>
              <Activity size={15} className="text-slate-500"/>
            </div>

            {!result ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/[.08] bg-white/[.025] text-slate-600">
                  <ScanLine size={24}/>
                </div>
                <div className="mt-4 text-xs font-medium text-slate-300">Belum ada hasil pemindaian</div>
                <p className="mx-auto mt-1.5 max-w-[220px] text-[10px] leading-5 text-slate-500">Hasil validasi akan muncul di sini setelah QR Code terdeteksi.</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className={`rounded-2xl border p-4 ${result.ok ? 'border-emerald-400/20 bg-emerald-400/[.06]' : 'border-rose-400/20 bg-rose-400/[.06]'}`}>
                  <div className="flex items-center gap-3">
                    {result.ok ? <CheckCircle2 size={25} className="text-emerald-300"/> : <XCircle size={25} className="text-rose-300"/>}
                    <div>
                      <div className={`text-sm font-semibold ${result.ok ? 'text-emerald-200' : 'text-rose-200'}`}>{result.reason}</div>
                      <p className="mt-1 text-[10px] leading-5 text-slate-400">{result.detail}</p>
                    </div>
                  </div>
                </div>

                {selected && (
                  <div className="mt-4 space-y-3 rounded-xl border border-white/[.06] bg-[#101820]/60 p-4">
                    <div>
                      <div className="text-[9px] text-slate-500">NAMA PENERIMA / SEKOLAH</div>
                      <div className="mt-1 text-xs font-semibold text-slate-100">{getInvitee(selected)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] text-slate-500">KATEGORI</div>
                        <div className="mt-1 text-[10px] text-slate-300">{categoryLabel[selected.type]}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">TEMPAT DUDUK</div>
                        <div className="mt-1 text-[10px] text-slate-300">{selected.seat_area}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">PEMINDAIAN</div>
                        <div className="mt-1 text-xs font-semibold text-slate-200">{selected.scan_count}/{selected.max_scans}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">SISA KUOTA</div>
                        <div className="mt-1 text-xs font-semibold text-[#D9B96E]">{Math.max(0, selected.max_scans - selected.scan_count)} orang</div>
                      </div>
                    </div>
                  </div>
                )}
                <Button className="mt-4 w-full" onClick={continueScan}><RefreshCw size={14}/>Lanjutkan pemindaian</Button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/[.08] bg-[#17212A] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-100">Panduan petugas</h2>
              <CircleHelp size={15} className="text-slate-500"/>
            </div>
            <div className="mt-4 space-y-4">
              {[
                { n: '01', title: 'Mulai kamera', desc: 'Izinkan akses kamera pada browser perangkat.' },
                { n: '02', title: 'Pindai tiket tamu', desc: 'Pastikan QR Code terlihat jelas di dalam bingkai.' },
                { n: '03', title: 'Periksa hasil', desc: 'Pastikan nama dan area duduk sesuai tiket.' },
                { n: '04', title: 'Konfirmasi lanjut', desc: 'Tekan tombol lanjut untuk memindai tamu berikutnya.' }
              ].map(item => (
                <div key={item.n} className="flex gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#C6A15B]/20 bg-[#C6A15B]/[.06] text-[9px] font-bold text-[#C6A15B]">{item.n}</div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-200">{item.title}</div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}