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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
       console.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight glow-text">Xush kelibsiz</h2>
        <p className="mt-2 text-sm text-white/60">
          Tizimga kirish uchun elektron pochta va parolingizni kiriting.
        </p>
      </div>

      <div className="mt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Elektron Pochta</label>
              <div className="relative">
                <Input 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-white/20 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10 focus:bg-black/80 transition-all duration-300"
                  placeholder="alex@b2b-crm.uz"
                />
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Parol</label>
                <Link to="/auth/forgot-password" className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
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
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-white/20 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10 focus:bg-black/80 transition-all duration-300"
                  placeholder="••••••••"
                />
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/35 shadow-[0_0_20px_rgba(14,165,233,0.15)] flex justify-between items-center px-4 py-2.5 cursor-pointer rounded-xl transition-all duration-300 hover:scale-[1.01]"
            disabled={loading}
          >
            <span className="font-semibold">{loading ? 'Tizimga kirilmoqda...' : 'Tizimga kirish'}</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-white/50">
           Tashkilotingiz yo'qmi?{' '}
           <Link to="/auth/register" className="font-semibold text-white hover:text-sky-400 transition-colors">
             Ro'yxatdan o'tishni so'rash
           </Link>
        </div>
      </div>
    </>
  );
}
