import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../lib/core/auth/AuthContext';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
       setError('Notoʻgʻri elektron pochta yoki parol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Xush kelibsiz</h2>
        <p className="mt-2 text-sm text-white/50">
          Davom etish uchun korxona hisobingizga kiring.
        </p>
      </div>

      <div className="mt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Elektron pochta manzili</label>
              <div className="relative">
                <Input 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="admin@market-erp.local"
                />
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80">Parol</label>
                <Link to="/auth/forgot-password" className="text-sm font-medium text-sky-400 hover:text-sky-300">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="••••••••"
                />
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] flex justify-between items-center px-4"
            disabled={loading}
          >
            <span className="font-medium">{loading ? 'Tekshirilmoqda...' : 'Kirish'}</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50">
           Tashkilotga aʼzo emasmisiz?{' '}
           <Link to="/auth/register" className="font-medium text-white hover:text-sky-400 transition-colors">
             Taʼminot soʻrash
           </Link>
        </div>
      </div>
    </>
  );
}