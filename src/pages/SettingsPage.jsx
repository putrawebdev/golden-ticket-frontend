import { useState } from 'react'
import { Moon, Sun, WifiOff, Save } from 'lucide-react'

import SectionTitle from '../components/ui/SectionTitle'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'

const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

export default function SettingsPage({ dark, setDark, notify, token, eventInfo, setEventInfo }) {
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setEventInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ganti string fetch lama yang hardcode
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
      const res = await fetch(`${API_BASE_URL}/event-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventInfo)
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setEventInfo(json.data) // Update global state dengan data resmi dari server
        notify('Informasi acara berhasil diperbarui!')
      } else {
        notify(json.message || 'Gagal memperbarui data.')
      }
    } catch (err) {
      notify('Gagal terhubung ke server backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in">
      <SectionTitle eyebrow="PREFERENCES" title="Pengaturan" subtitle="Preferensi tampilan dan informasi dasar event."/>
      
      <div className="max-w-2xl space-y-4">
        {/* Preference Tampilan */}
        <section className="rounded-2xl border border-white/[.07] bg-[#17212A] p-5">
          <h2 className="text-sm font-semibold text-slate-100">Tampilan aplikasi</h2>
          <p className="mt-1 text-[10px] text-slate-500">Atur preferensi visual dashboard.</p>
          <div className="mt-5 flex items-center justify-between border-t border-white/[.06] pt-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.04] text-[#C6A15B]">
                {dark ? <Moon size={17}/> : <Sun size={17}/>}
              </div>
              <div>
                <div className="text-xs font-medium text-slate-200">{dark ? 'Mode gelap' : 'Mode terang'}</div>
                <div className="mt-1 text-[10px] text-slate-500">Pilihan tema antarmuka</div>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className={`h-6 w-11 rounded-full p-1 transition ${dark ? 'bg-[#C6A15B]' : 'bg-slate-600'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-5' : ''}`}/>
            </button>
          </div>
        </section>

        {/* Form Informasi Acara */}
        <section className="rounded-2xl border border-white/[.07] bg-[#17212A] p-5">
          <h2 className="text-sm font-semibold text-slate-100">Informasi acara</h2>
          <p className="mt-1 text-[10px] text-slate-500">Informasi dasar yang digunakan di tiket digital.</p>
          
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <Field label="Nama acara">
              <input 
                className={inputClass} 
                value={eventInfo.title || ''} 
                onChange={e => handleChange('title', e.target.value)}
                placeholder="Nama acara..."
              />
            </Field>

            <Field label="Tema acara">
              <input 
                className={inputClass} 
                value={eventInfo.theme || ''} 
                onChange={e => handleChange('theme', e.target.value)}
                placeholder="Tema acara..."
              />
            </Field>

            <Field label="Lokasi">
              <input 
                className={inputClass} 
                value={eventInfo.location || ''} 
                onChange={e => handleChange('location', e.target.value)}
                placeholder="Lokasi acara..."
              />
            </Field>

            <Field label="Tanggal acara">
              <input 
                type="date"
                className={inputClass} 
                value={eventInfo.event_date || ''} 
                onChange={e => handleChange('event_date', e.target.value)}
              />
            </Field>

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                <Save size={14} className="mr-1.5 inline" />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}