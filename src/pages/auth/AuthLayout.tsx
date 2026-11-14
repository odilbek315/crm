import React from 'react';
import { Outlet } from 'react-router-dom';
import { Network } from 'lucide-react';
// @ts-ignore
import futuristicBg from '../../assets/images/futuristic_login_bg.png';
// @ts-ignore
import japanStreetsBg from '../../assets/images/japan_streets.png';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Futuristic Background Image (Left Side) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src={futuristicBg} 
          alt="Futuristic Tech Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Abstract Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/90 to-sky-950/20 z-0"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl rounded-full translate-x-1/2 z-0 pointer-events-none"></div>

      <div className="w-full flex-1 flex flex-col justify-center relative z-10 px-4 sm:px-6 lg:flex-none lg:w-[600px] lg:px-20 xl:px-24">
        {/* Premium Glowing Glassmorphic Card Wrapper */}
        <div className="mx-auto w-full max-w-sm lg:w-[420px] bg-black/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.12)]">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <div className="size-9 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <Network className="size-5 text-sky-400" />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              B2B CRM <span className="text-sky-400">OS</span>
            </span>
          </div>
          
          <Outlet />
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1 z-10">
        {/* Japan Streets Background Image for Right Panel */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
          <img 
            src={japanStreetsBg} 
            alt="Japan Neon Streets at Night" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay to blend with the layout - softened to let image shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-0"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/5 to-transparent blur-3xl rounded-full z-0 pointer-events-none"></div>

        {/* Fully transparent window wrapper */}
        <div className="h-full w-full flex flex-col justify-center px-12 border-l border-white/10 bg-black/35 backdrop-blur-[6px] relative z-10">
            <h2 className="text-4xl font-display font-bold text-white mb-6 glow-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">B2B CRM Tizimi</h2>
            <p className="text-white/90 text-lg max-w-lg mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Biznesingizni samarali boshqarish, savdo jarayonlarini avtomatlashtirish va intellektual tahlillar orqali samaradorlikni oshirish uchun mukammal boshqaruv tizimi.
            </p>
            
            <div className="grid grid-cols-2 gap-6 max-w-lg">
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="font-semibold text-sky-400 mb-2 text-sm uppercase tracking-wider">Savdo va Bitimlar</h3>
                <p className="text-white/80 text-sm">Mijozlar bilan aloqalarni tizimlashtirish va bitimlar zanjirini to'liq nazorat qilish.</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="font-semibold text-sky-400 mb-2 text-sm uppercase tracking-wider">Avtomatlashtirish</h3>
                <p className="text-white/80 text-sm">Ish oqimlari va muntazam topshiriqlarni robotlashtirilgan tizim yordamida avtomatlashtirish.</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="font-semibold text-sky-400 mb-2 uppercase tracking-wider">Moliya va Invoicing</h3>
                <p className="text-white/80 text-sm">Hisob-fakturalarni tezkor rasmiylashtirish va moliyaviy oqimlarni nazorat qilish.</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="font-semibold text-sky-400 mb-2 uppercase tracking-wider">AI va Analitika</h3>
                <p className="text-white/80 text-sm">Sun'iy intellekt yordamida KPI ko'rsatkichlari, bashoratlar va aqlli tahlillarni olish.</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
