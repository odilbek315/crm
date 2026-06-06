import React from 'react';
import { Outlet } from 'react-router-dom';
import { Network } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-black to-black z-0"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl rounded-full translate-x-1/2 z-0 pointer-events-none"></div>

      <div className="w-full flex-1 flex flex-col justify-center relative z-10 px-4 sm:px-6 lg:flex-none lg:w-[600px] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-12">
            <div className="size-8 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <Network className="size-5 text-sky-400" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Market ERP <span className="text-sky-400">OS</span>
            </span>
          </div>
          
          <Outlet />
          
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1 z-10">
        <div className="h-full w-full object-cover flex flex-col justify-center px-12 border-l border-white/10 glass-card">
           <h2 className="text-4xl font-display font-bold text-white mb-6">Korxona OS Arxitekturasi</h2>
           <p className="text-white/60 text-lg max-w-lg mb-8 leading-relaxed">
             Ko'p foydalanuvchili miqyoslilik, ilg'or RBAC xavfsizligi va voqealarga asoslangan avtomatlashtirish uchun qurilgan kengaytiriladigan SaaS asosi.
           </p>
           
           <div className="grid grid-cols-2 gap-6 max-w-lg">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
               <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Ko'p foydalanuvchili</h3>
               <p className="text-white/50 text-sm">Tashkilotlar va ish joylari bo'ylab ma'lumotlarning to'liq izolyatsiyasi.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
               <h3 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">Voqealar shinasi</h3>
               <p className="text-white/50 text-sm">Yuqori darajada ajratilgan tizim arxitekturasi uchun mahalliy Pub/Sub.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm">
               <h3 className="font-semibold text-white mb-2 uppercase tracking-wider">PostgreSQL Maqsadi</h3>
               <p className="text-white/50">Prisma uchun oldindan sozlagan Repository va Xizmat qatlami.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-sm">
               <h3 className="font-semibold text-white mb-2 uppercase tracking-wider">Aqlli kesh</h3>
               <p className="text-white/50">Optimallashtirilgan kirish qatlamlari va Virtual Jadvallar xotirasini boshqarish.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}