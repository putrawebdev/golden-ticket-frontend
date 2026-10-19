import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

// Import Layout & Auth
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import LoginScreen from './components/auth/LoginScreen'

// Import Modals & Previews
import InvitationForm from './components/tickets/InvitationForm'
import TicketPreview from './components/tickets/TicketPreview'

// Import Halaman
import Dashboard from './pages/Dashboard'
import InvitationsPage from './pages/InvitationsPage'
import ScannerPage from './pages/ScannerPage'
import AttendancePage from './pages/AttendancePage'
import SettingsPage from './pages/SettingsPage'
import PublicTicketPage from './pages/PublicTicketPage'
// Import komponen PublicLandingPage yang akan kita buat
import PublicLandingPage from './pages/PublicLandingPage'

export default function App() {
  // Cek apakah halaman dibuka lewat path public /ticket/KODE_TIKET
  const path = window.location.pathname
  // 1. Jalur Halaman Tiket (+ QR Code)
  if (path.startsWith('/public/tickets/')) {
    const ticketCode = path.replace('/public/tickets/', '').trim()
    return <PublicTicketPage ticketCode={ticketCode} />
  }

  // 2. Jalur Halaman Home / Landing Informasi Sekolah & Event
  if (path.startsWith('/public/')) {
    const ticketCode = path.replace('/public/', '').trim()
    return <PublicLandingPage ticketCode={ticketCode} />
  }

  // 1. KUMPULAN SEMUA STATE (Wajib di Paling Atas)
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [page, setPage] = useState('dashboard')
  const [invitations, setInvitations] = useState([])
  const [dark, setDark] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState('')
  
  const [eventInfo, setEventInfo] = useState({
    title: 'Gen Z Indonesia 2026',
    theme: 'The Nusantara Legends Go to the World',
    location: 'Platinum Cineplex Milenial Hub Metland Cibitung',
    event_date: '',
  })

  // 2. HANDLER FUNCTIONS
  const handleLogout = async () => {
    try {
      if (token) {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
      }
    } catch (err) {
      console.error('Gagal logout di server:', err)
    } finally {
      setToken('')
      localStorage.removeItem('admin_token')
    }
  }

  // 3. KUMPULAN SEMUA EFFECTS (Wajib Sebelum Early Return)
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
        const res = await fetch(`${API_BASE_URL}/invitations`, {
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.status === 401) handleLogout()
        const json = await res.json()
        if (json.success) setInvitations(json.data)
      } catch (err) { 
        console.error(err) 
      }
    }
    
    if (token) fetchInvitations()
  }, [token])

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
        const res = await fetch(`${API_BASE_URL}/event-info`, {
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.success && json.data) setEventInfo(json.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchEventInfo();
  }, [token]);

  useEffect(() => { 
    document.documentElement.classList.toggle('light-preview', !dark) 
  }, [dark])

  useEffect(() => { 
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3000) 
    return () => clearTimeout(timer) 
  }, [toast])

  // 4. HELPER FUNCTIONS
  const notify = message => setToast(message)
  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = item => { setEditing(item); setFormOpen(true) }
  
  const saveInvitation = async (item) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
      const isEditing = !!editing;
      const url = isEditing 
        ? `${API_BASE_URL}/invitations/${item.id}`
        : `${API_BASE_URL}/invitations`;
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: item.type,
          school_name: item.school_name,
          teacher_names: item.teacher_names,
          guest_name: item.guest_name,
          parent_1_name: item.parent_1_name,
          parent_2_name: item.parent_2_name,
          seat_area: item.seat_area,
          event_date: item.event_date || null
        })
      });

      const json = await res.json();
      
      if (json.success) {
        setInvitations(prev => isEditing 
          ? prev.map(i => i.id === json.data.id ? json.data : i) 
          : [json.data, ...prev]
        );
        setFormOpen(false);
        setEditing(null);
        notify(isEditing ? 'Perubahan tersimpan di database.' : 'Tiket berhasil dibuat di database.');
      } else {
        notify('Gagal menyimpan tiket. Periksa form kamu.');
      }
    } catch (err) {
      console.error('Error:', err);
      notify('Terjadi kesalahan koneksi ke server.');
    }
  };

  // 5. EARLY RETURN (Auth Gate ditaruh setelah seluruh Hooks didaftarkan)
  if (!token) {
    return (
      <LoginScreen 
        onLogin={(newToken) => {
          localStorage.setItem('admin_token', newToken)
          setToken(newToken)
        }}
      />
    )
  }

  // 6. RENDER UTAMA APLIKASI
  return (
    <div className={`app-shell min-h-screen ${dark ? '' : 'light-mode'}`}>
      <Sidebar 
        page={page} 
        setPage={setPage} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        dark={dark} 
        setDark={setDark}
        onLogout={handleLogout}
      />

      <div className="min-h-screen lg:pl-[258px]">
        <Header 
          page={page} 
          setMobileOpen={setMobileOpen} 
          query={query} 
          setQuery={setQuery} 
          onCreate={openCreate}
        />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
          {page==='dashboard' && <Dashboard invitations={invitations} setPage={setPage} onCreate={openCreate} onPreview={setPreview} eventInfo={eventInfo} token={token} />}
          {page==='invitations' && <InvitationsPage invitations={invitations} setInvitations={setInvitations} query={query} setQuery={setQuery} onCreate={openCreate} onEdit={openEdit} onPreview={setPreview} notify={notify}/>}
          {page==='scanner' && <ScannerPage invitations={invitations} setInvitations={setInvitations} notify={notify} token={token} />}
          {page==='attendance' && <AttendancePage invitations={invitations}/>}
          {page==='settings' && <SettingsPage dark={dark} setDark={setDark} notify={notify} token={token} eventInfo={eventInfo} setEventInfo={setEventInfo} />}
        </main>

        <footer className="mx-auto flex max-w-[1600px] flex-col justify-between gap-2 border-t border-white/[.05] px-4 py-5 text-[9px] text-slate-600 sm:flex-row sm:px-7 lg:px-9">
          <span>© 2026 Golden Ticket · SMK Metland Cibitung</span>
          <span>Dibuat oleh @putrawebdev</span>
        </footer>
      </div>

      {formOpen && <InvitationForm initial={editing} onSave={saveInvitation} onClose={() => { setFormOpen(false); setEditing(null) }} />}
      {preview && <TicketPreview item={preview} onClose={() => setPreview(null)} />}
      
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#C6A15B]/25 bg-[#18232C] px-4 py-3 text-xs text-slate-100 shadow-2xl">
          <CheckCircle2 size={15} className="text-[#C6A15B]"/>{toast}
        </div>
      )}
    </div>
  )
}