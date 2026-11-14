import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8 relative">
        <Link to="/auth/login" className="absolute -top-10 -left-2 p-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Parolni tiklash</h2>
        <p className="mt-2 text-sm text-white/50">
          Parolni tiklash yo'riqnomasini olish uchun elektron pochtangizni kiriting.
        </p>
      </div>

      <div className="mt-8">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Elektron pochta manzili</label>
            <div className="relative">
              <Input 
                type="email" 
                required 
                className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/30"
                placeholder="admin@b2b-crm.uz"
              />
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
          </div>

          <Button 
            type="button" 
            className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 flex justify-center items-center px-4"
          >
            <RefreshCw className="size-4 mr-2" />
            <span className="font-medium">Tiklash havolasini yuborish</span>
          </Button>
        </form>
      </div>
    </>
  );
}
