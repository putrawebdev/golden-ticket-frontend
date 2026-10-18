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

export default function App() {
  // Cek apakah halaman dibuka lewat path public /ticket/KODE_TIKET
  const path = window.location.pathname
  if (path.startsWith('/ticket/')) {
    const ticketCode = path.replace('/ticket/', '').trim()
    return <PublicTicketPage ticketCode={ticketCode} />
  }

  // 1. State Token & Aplikasi
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

  // 2. Handler Logout
  const handleLogout = async () => {
    try {
      if (token) {
        // Ganti string fetch lama yang hardcode
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

  // 3. Effects
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Ganti string fetch lama yang hardcode
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
    document.documentElement.classList.toggle('light-preview', !dark) 
  }, [dark])

  useEffect(() => { 
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3000) 
    return () => clearTimeout(timer) 
  }, [toast])

  // 4. Helper Functions
  const notify = message => setToast(message)
  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = item => { setEditing(item); setFormOpen(true) }
  
  const saveInvitation = async (item) => {
    try {
      // Ganti string fetch lama yang hardcode
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
          event_date: item.event_date || null // <--- PENTING: Pastikan ini ikut dikirim ke Laravel!
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

  // 5. Early Return untuk Auth Gate
  if (!token) {
    return (
      <LoginScreen 
        onLogin={(newToken) => {
          setToken(newToken)
          localStorage.setItem('admin_token', newToken)
        }}
      />
    )
  }
// 1. Tambahkan state eventInfo utama di sini
  const [eventInfo, setEventInfo] = useState({
    title: 'Gen Z Indonesia 2026',
    theme: 'The Nusantara Legends Go to the World',
    location: 'Platinum Cineplex Milenial Hub Metland Cibitung',
    event_date: '',
  });

  // 2. Fetch event-info dari API saat pertama kali aplikasi dibuka
  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        // Ganti string fetch lama yang hardcode
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
    fetchEventInfo();
  }, [token]);
  // 6. Render Utama
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
          {/* Oper eventInfo ke Dashboard */}
          {page==='dashboard' && <Dashboard invitations={invitations} setPage={setPage} onCreate={openCreate} onPreview={setPreview} eventInfo={eventInfo} />}
          
          {page==='invitations' && <InvitationsPage invitations={invitations} setInvitations={setInvitations} query={query} setQuery={setQuery} onCreate={openCreate} onEdit={openEdit} onPreview={setPreview} notify={notify}/>}
          {page==='scanner' && <ScannerPage invitations={invitations} setInvitations={setInvitations} notify={notify} token={token} />}
          {page==='attendance' && <AttendancePage invitations={invitations}/>}
          
          {/* Oper eventInfo & setEventInfo ke SettingsPage */}
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