import { useState } from 'react'
import Brand from '../ui/Brand'
import Field from '../ui/Field'
import Button from '../ui/Button'

// Variable styling input
const inputClass = 'w-full rounded-xl border border-white/10 bg-[#0F171E] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-[#C6A15B]/60 focus:ring-2 focus:ring-[#C6A15B]/10'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Ganti string fetch lama yang hardcode
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://golden-ticket-backend.wasmer.app/api';
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        onLogin(data.access_token)
      } else {
        setError(data.message || 'Login gagal.')
      }
    } catch (err) {
      setError('Gagal terhubung ke server.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101820] p-4 text-slate-200">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141E27] p-8 shadow-2xl">
        <div className="mb-8 flex justify-center"><Brand /></div>
        <h2 className="mb-6 text-center text-xl font-semibold text-white">Login Admin Event</h2>
        
        {error && <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-300">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Email Admin">
            <input 
              type="email" 
              required 
              className={inputClass} 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@goldenticket.com" 
            />
          </Field>
          <Field label="Password">
            <input 
              type="password" 
              required 
              className={inputClass} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </Field>
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  )
}