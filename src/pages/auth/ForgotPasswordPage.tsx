import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Agar akkaunt mavjud bo\'lsa, tiklash havolasi yuborildi.');
    } catch {
      setError('Tiklash so\'rovi muvaffaqiyatsiz tugadi. Iltimos, emailingizni tekshiring va qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 relative">
        <Link to="/auth/login" className="absolute -top-10 -left-2 p-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Parolni tiklash</h2>
        <p className="mt-2 text-sm text-white/50">
          Tiklash bo'yicha ko'rsatmalarni olish uchun administrator emailingizni kiriting.
        </p>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <div className="text-sm text-emerald-400">{message}</div>}
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Elektron pochta manzili</label>
            <div className="relative">
              <Input 
                type="email" 
                required 
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                placeholder="admin@market-erp.local"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 flex justify-center items-center px-4"
          >
            <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">{loading ? 'Yuborilmoqda...' : 'Tiklash havolasini yuborish'}</span>
          </Button>
        </form>
      </div>
    </>
  );
}