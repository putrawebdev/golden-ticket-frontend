import { useState } from 'react'
import { School, Crown, HeartHandshake, AlertTriangle, Plus } from 'lucide-react'
import Modal from '../ui/Modal'
import Field from '../ui/Field'
import Button from '../ui/Button'

// Variable styling input
const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

export default function InvitationForm({ initial, onSave, onClose }) {
  const [type, setType] = useState(initial?.type || 'school')
  const [form, setForm] = useState({
    school_name: initial?.school_name || '',
    teacher_names: initial?.teacher_names?.join(', ') || '',
    guest_name: initial?.guest_name || '',
    parent_1_name: initial?.parent_1_name || '',
    parent_2_name: initial?.parent_2_name || '',
    seat_area: initial?.seat_area || '',
    event_date: initial?.event_date || '', // <--- State tanggal khusus
  })
  const [error, setError] = useState('')
  const set = (key, value) => setForm(p => ({ ...p, [key]: value }))
  
  const maxScans = type === 'school' ? 10 : type === 'vip' ? 1 : (form.parent_2_name.trim() ? 2 : 1)

  const submit = e => {
    e.preventDefault()
    const valid = type === 'school' 
      ? form.school_name.trim() && form.teacher_names.trim() 
      : type === 'vip' 
      ? form.guest_name.trim() 
      : form.parent_1_name.trim()
    
    if (!valid || !form.seat_area.trim()) { 
      setError('Lengkapi data wajib dan area tempat duduk terlebih dahulu.'); 
      return 
    }

    const code = initial?.ticket_code || `GZ26-${type.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`

    onSave({
      ...(initial || {}),
      id: initial?.id || Date.now(),
      ticket_code: code,
      type,
      school_name: type === 'school' ? form.school_name.trim() : '',
      teacher_names: type === 'school' ? form.teacher_names.split(',').map(s => s.trim()).filter(Boolean) : [],
      guest_name: type === 'vip' ? form.guest_name.trim() : '',
      parent_1_name: type === 'parent' ? form.parent_1_name.trim() : '',
      parent_2_name: type === 'parent' ? form.parent_2_name.trim() : '',
      seat_area: form.seat_area.trim(),
      event_date: form.event_date ? form.event_date : null, // <--- BERLAKU UNTUK SEMUA KATEGORI
      scan_count: initial?.scan_count || 0,
      max_scans: maxScans,
      status: (initial?.scan_count || 0) >= maxScans ? 'Kuota penuh' : 'Aktif',
    })
  }

  return (
    <Modal title={initial ? 'Edit undangan' : 'Buat undangan baru'} subtitle="Isi detail sesuai kategori tiket" onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-5">
        {/* Pilihan Kategori */}
        <Field label="Kategori undangan" required>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'school', label: 'Sekolah', Icon: School },
              { id: 'vip', label: 'VIP', Icon: Crown },
              { id: 'parent', label: 'Orang tua', Icon: HeartHandshake }
            ].map(({ id, label, Icon }) => (
              <button 
                type="button" 
                key={id} 
                onClick={() => setType(id)} 
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-[10px] font-semibold transition ${type === id ? 'border-[#C6A15B]/60 bg-[#C6A15B]/10 text-[#E1C27B]' : 'border-white/10 bg-white/[.02] text-slate-400 hover:bg-white/[.05]'}`}
              >
                <Icon size={18}/>{label}
              </button>
            ))}
          </div>
        </Field>

        {/* Dynamic Fields Berdasarkan Kategori */}
        {type === 'school' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama sekolah" required>
              <input className={inputClass} value={form.school_name} onChange={e => set('school_name', e.target.value)} placeholder="Contoh: SMK Metland Cibitung"/>
            </Field>
            <Field label="Nama guru pendamping" required hint="Pisahkan beberapa nama dengan koma.">
              <input className={inputClass} value={form.teacher_names} onChange={e => set('teacher_names', e.target.value)} placeholder="Ibu Rina, Pak Budi"/>
            </Field>
          </div>
        )}

        {type === 'vip' && (
          <Field label="Nama tamu VIP" required>
            <input className={inputClass} value={form.guest_name} onChange={e => set('guest_name', e.target.value)} placeholder="Nama lengkap tamu VIP"/>
          </Field>
        )}

        {type === 'parent' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama orang tua/wali pertama" required>
              <input className={inputClass} value={form.parent_1_name} onChange={e => set('parent_1_name', e.target.value)} placeholder="Nama orang tua/wali"/>
            </Field>
            <Field label="Nama orang tua/wali kedua" hint="Kosongkan jika hanya satu orang.">
              <input className={inputClass} value={form.parent_2_name} onChange={e => set('parent_2_name', e.target.value)} placeholder="Opsional"/>
            </Field>
          </div>
        )}

        {/* Input Umum (Muncul untuk SEMUA Kategori: Sekolah, VIP, maupun Orang Tua) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Area / nomor tempat duduk" required>
            <input className={inputClass} value={form.seat_area} onChange={e => set('seat_area', e.target.value)} placeholder="Contoh: REG-A · A01"/>
          </Field>

          <Field label="Tanggal Acara Khusus (Opsional)" hint="Kosongkan untuk memakai tanggal default event">
            <input 
              type="date" 
              className={inputClass} 
              value={form.event_date} 
              onChange={e => set('event_date', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Batas pemindaian">
          <div className="flex h-[42px] items-center justify-between rounded-xl border border-white/10 bg-[#0F171E] px-3.5">
            <span className="text-xs text-slate-400">Kuota otomatis</span>
            <span className="text-sm font-semibold text-[#D9B96E]">{maxScans} orang</span>
          </div>
        </Field>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[.07] p-3 text-xs text-rose-300">
            <AlertTriangle size={14} className="mr-2 inline"/>{error}
          </div>
        )}

        <div className="flex flex-col-reverse justify-end gap-2 border-t border-white/[.07] pt-4 sm:flex-row">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit"><Plus size={14}/>{initial ? 'Simpan perubahan' : 'Buat tiket'}</Button>
        </div>
      </form>
    </Modal>
  )
}