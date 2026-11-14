import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../lib/core/auth/AuthContext';
import { ArrowRight, Mail, Building, User, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [orgName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, orgName);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Create Organization</h2>
        <p className="mt-2 text-sm text-white/50">
          Provision a new tenant and administrator account.
        </p>
      </div>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Organization Name</label>
              <div className="relative">
                <Input 
                  required 
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="Acme Corp"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                />
                <Building className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Admin Full Name</label>
              <div className="relative">
                <Input 
                  required 
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Work Email address</label>
              <div className="relative">
                <Input 
                  type="email" 
                  required 
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="jane@acme.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Input 
                  type="password" 
                  required 
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                />
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 flex justify-between items-center px-4"
          >
            <span className="font-medium">{loading ? 'Provisioning...' : 'Request Provisioning'}</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50">
           Already have an account?{' '}
           <Link to="/auth/login" className="font-medium text-white hover:text-sky-400 transition-colors">
             Sign in here
           </Link>
        </div>
      </div>
    </>
  );
}
