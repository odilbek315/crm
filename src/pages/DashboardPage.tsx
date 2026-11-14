
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Target, 
  CheckSquare, 
  PieChart,
  ArrowRight,
  Sparkles,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDashboardSummary } from '../frontend/hooks/useAnalytics';

const cards = [
  {
    id: 'customers',
    title: 'Mijozlar',
    description: 'Mijozlar bazasi va aloqalarni boshqarish',
    icon: Users,
    color: 'from-[#110f22] to-[#07060f]',
    borderColor: 'border-purple-500/20',
    activeBorderColor: 'border-purple-500/70',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    stats: { label: 'Jami mijozlar', value: '1,248' },
    trend: { type: 'chart', color: '#a855f7', points: '0,25 20,22 40,28 60,12 80,18 100,8' },
    buttonStyle: 'bg-[#1a122e] text-purple-300 border-purple-500/30 hover:bg-[#251a42]'
  },
  {
    id: 'sales',
    title: 'Savdo',
    description: 'Savdo jarayoni va bitimlarni kuzatish',
    icon: TrendingUp,
    color: 'from-[#0d162f] to-[#050914]',
    borderColor: 'border-blue-500/20',
    activeBorderColor: 'border-blue-500/70',
    iconColor: 'text-blue-400',
    glowColor: 'shadow-[0_0_35px_rgba(59,130,246,0.25)]',
    stats: { label: 'Oylik daromad', value: '$98,450' },
    trend: { type: 'chart', color: '#3b82f6', points: '0,25 20,15 40,20 60,5 80,10 100,0' },
    buttonStyle: 'bg-[#0c162f] text-blue-300 border-blue-500/30 hover:bg-[#122247]'
  },
  {
    id: 'leads',
    title: 'Leadlar',
    description: 'Yangi leadlar va ularning holatini boshqarish',
    icon: Target,
    color: 'from-[#221017] to-[#0f070a]',
    borderColor: 'border-red-500/30',
    activeBorderColor: 'border-red-500/85',
    iconColor: 'text-red-400',
    glowColor: 'shadow-[0_0_45px_rgba(239,68,68,0.35)]',
    stats: { label: 'Yangi leadlar', value: '32', highlight: '+12' },
    subStats: { label: 'Jarayondagi leadlar', value: '78' },
    trend: null,
    buttonStyle: 'bg-[#2d1217] text-red-300 border-red-500/30 hover:bg-[#3d181e]'
  },
  {
    id: 'tasks',
    title: 'Vazifalar',
    description: 'Vazifalar va eslatmalar boshqaruvi',
    icon: CheckSquare,
    color: 'from-[#0c1b2f] to-[#060c14]',
    borderColor: 'border-sky-500/20',
    activeBorderColor: 'border-sky-500/70',
    iconColor: 'text-sky-400',
    glowColor: 'shadow-[0_0_35px_rgba(14,165,233,0.25)]',
    stats: { label: 'Bugungi vazifalar', value: '14' },
    trend: { type: 'progress', value: 60 },
    buttonStyle: 'bg-[#0a1a2e] text-sky-300 border-sky-500/30 hover:bg-[#102745]'
  },
  {
    id: 'analytics',
    title: 'Tahlillar',
    description: 'Hisobotlar va biznes tahlillar',
    icon: PieChart,
    color: 'from-[#101335] to-[#070817]',
    borderColor: 'border-indigo-500/20',
    activeBorderColor: 'border-indigo-500/70',
    iconColor: 'text-indigo-400',
    glowColor: 'shadow-[0_0_35px_rgba(99,102,241,0.25)]',
    stats: { label: 'Umumiy o\'sish', value: '+24.5%', valueColor: 'text-emerald-400' },
    trend: { type: 'bar' },
    buttonStyle: 'bg-[#111233] text-indigo-300 border-indigo-500/30 hover:bg-[#181a4a]'
  }
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center on 'leads'
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const { data: summary, isLoading } = useDashboardSummary();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Spacing and size configurations based on responsive breakpoints
  const getSpacingConfig = () => {
    if (windowWidth >= 1280) {
      return {
        cardW: 245,
        cardH: 400,
        s1: 245,
        s2: 465,
        z1: -80,
        z2: -160,
        r1: -8,
        r2: -12
      };
    }
    if (windowWidth >= 1024) {
      return {
        cardW: 210,
        cardH: 340,
        s1: 210,
        s2: 400,
        z1: -70,
        z2: -140,
        r1: -7,
        r2: -10
      };
    }
    return {
      cardW: 180,
      cardH: 290,
      s1: 180,
      s2: 340,
      z1: -60,
      z2: -120,
      r1: -6,
      r2: -8
    };
  };

  const config = getSpacingConfig();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple-400" />
        <span className="ml-3 text-white/70">Panel ma'lumotlari yuklanmoqda...</span>
      </div>
    );
  }

  const dynamicCards = cards.map(card => {
    if (!summary) return card;
    const statsCopy = { ...card.stats };
    const subStatsCopy = card.subStats ? { ...card.subStats } : undefined;
    
    if (card.id === 'customers') {
      statsCopy.value = summary.totalCustomers.toLocaleString();
    } else if (card.id === 'sales') {
      statsCopy.value = '$' + summary.monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else if (card.id === 'leads') {
      statsCopy.value = String(summary.newLeadsCount);
      if (subStatsCopy) {
        subStatsCopy.value = String(summary.inProgressLeadsCount);
      }
    } else if (card.id === 'tasks') {
      statsCopy.value = String(summary.todayTasksCount);
    }
    
    return {
      ...card,
      stats: statsCopy,
      subStats: subStatsCopy
    };
  });

  return (
    <div className="h-full w-full flex flex-col relative overflow-y-auto custom-scrollbar">
      
      {/* Upper Section: 3D Carousel with Opaque Cards */}
      <div className="flex w-full shrink-0 min-h-[700px] relative">
        {/* Main 3D Carousel Area - Shifted left to balance with the AI card and match mockup */}
        <div className="flex-1 flex flex-col justify-center items-center relative perspective-[2000px] pr-0 lg:pr-[360px] mb-12 lg:mb-0">
          
          {/* Carousel Cards Container */}
          <div 
            className="relative w-full max-w-4xl flex justify-center items-center transform-style-3d"
            style={{ height: `${config.cardH + 120}px` }}
          >
            {dynamicCards.map((card, index) => {
              let diff = index - activeIndex;
              if (diff > 2) diff -= cards.length;
              if (diff < -2) diff += cards.length;

              const isCenter = diff === 0;
              const zIndex = 10 - Math.abs(diff);
              
              // 3D Carousel Spacing - Separated cards, no overlapping
              const getTranslateX = (d: number) => {
                if (d === 0) return 0;
                if (d === 1) return config.s1;
                if (d === -1) return -config.s1;
                if (d === 2) return config.s2;
                if (d === -2) return -config.s2;
                return d * config.s1;
              };
              
              const getScale = (d: number) => {
                if (d === 0) return 1.05;
                if (Math.abs(d) === 1) return 0.85;
                return 0.70;
              };
              
              const getTranslateZ = (d: number) => {
                if (d === 0) return 0;
                if (Math.abs(d) === 1) return config.z1;
                return config.z2;
              };
              
              const getRotateY = (d: number) => {
                if (d === 0) return 0;
                if (Math.abs(d) === 1) return d * config.r1;
                return d * config.r2;
              };

              const translateX = getTranslateX(diff);
              const translateZ = getTranslateZ(diff);
              const rotateY = getRotateY(diff);
              const scale = getScale(diff);
              const opacity = Math.abs(diff) > 2 ? 0 : isCenter ? 1 : 0.9;

              return (
                <div 
                  key={card.id}
                  className={cn(
                    "absolute top-1/2 left-1/2 rounded-3xl transition-all duration-700 ease-out cursor-pointer",
                    "bg-gradient-to-b border flex flex-col",
                    card.color,
                    isCenter ? cn(card.activeBorderColor, card.glowColor) : card.borderColor
                  )}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: isCenter ? 'brightness(1.1)' : 'brightness(0.9)',
                    width: `${config.cardW}px`,
                    height: `${config.cardH}px`,
                    marginLeft: `-${config.cardW / 2}px`,
                    marginTop: `-${config.cardH / 2}px`
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Card Content left-aligned to match requested screenshot */}
                  <div className="p-5 lg:p-7 flex flex-col h-full">
                    {/* Left-aligned Icon Wrapper */}
                    <div className="flex justify-start mb-4 pt-1">
                      <div className={cn("p-2.5 lg:p-3 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner", card.iconColor)}>
                        <card.icon className="size-8 lg:size-10 stroke-[1.5]" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-display font-bold text-white text-left mb-1.5 tracking-tight">{card.title}</h3>
                    <p className="text-[10px] lg:text-xs text-left text-white/50 mb-6 leading-relaxed">
                      {card.description}
                    </p>

                    <div className="mt-auto space-y-4 lg:space-y-5">
                      <div className="text-left">
                        <p className="text-[9px] lg:text-[10px] text-white/40 mb-1 uppercase tracking-wider">{card.stats.label}</p>
                        <div className="flex items-end justify-between">
                          <span className={cn("text-2xl lg:text-3xl font-light tracking-tight text-white", card.stats.valueColor)}>
                            {card.stats.value}
                          </span>
                          {card.stats.highlight && (
                            <span className="text-[9px] lg:text-xs font-semibold px-1.5 lg:px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              {card.stats.highlight}
                            </span>
                          )}
                        </div>
                      </div>

                      {card.subStats && (
                        <div className="pt-3 border-t border-white/10 text-left">
                           <p className="text-[9px] lg:text-[10px] text-white/40 mb-1 uppercase tracking-wider">{card.subStats.label}</p>
                           <span className="text-lg lg:text-xl font-light text-white">{card.subStats.value}</span>
                        </div>
                      )}

                      {/* Small line chart trend */}
                      {card.trend && card.trend.type === 'chart' && (
                         <div className="mt-3 pt-3 border-t border-white/10">
                           <svg viewBox="0 0 100 30" className="w-full h-7 lg:h-8 overflow-visible">
                             <polyline points={card.trend.points} fill="none" stroke={card.trend.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                             <polyline points={card.trend.points} fill="none" stroke={card.trend.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" filter="blur(2px)" />
                           </svg>
                         </div>
                      )}

                      {/* Circular progress meter */}
                      {card.trend && card.trend.type === 'progress' && (
                         <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                           <div className="relative size-10 lg:size-11 flex items-center justify-center">
                             <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeDasharray={`${card.trend.value}, 100`} strokeLinecap="round" />
                             </svg>
                             <span className="absolute text-[8px] lg:text-[10px] font-medium text-white/80">{card.trend.value}%</span>
                           </div>
                         </div>
                      )}

                      {/* Mini bar graph */}
                      {card.trend && card.trend.type === 'bar' && (
                         <div className="mt-3 pt-3 border-t border-white/10 flex items-end justify-between h-9 lg:h-11 gap-1 pb-0.5">
                           {[30, 55, 40, 75, 60, 95, 80].map((h, i) => (
                             <div key={i} className="w-full bg-indigo-500/40 rounded-sm hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }} />
                           ))}
                         </div>
                      )}

                      {isCenter && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (card.id === 'customers') navigate('/customers');
                            else if (card.id === 'sales') navigate('/sales');
                            else if (card.id === 'leads') navigate('/leads');
                            else if (card.id === 'tasks') navigate('/tasks');
                            else if (card.id === 'analytics') navigate('/analytics');
                          }}
                          className={cn("w-full mt-3 h-9 lg:h-10 rounded-xl transition-all group border flex justify-center items-center gap-2 text-xs lg:text-sm font-semibold cursor-pointer", card.buttonStyle)}
                        >
                          Ko'rish
                          <ArrowRight className="size-3.5 lg:size-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Page Indicator Dots (Centered above controls) */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/10 px-4 py-2 rounded-full border border-white/5">
            {dynamicCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "size-2 rounded-full transition-all duration-300 cursor-pointer",
                  i === activeIndex ? "bg-white w-4" : "bg-white/25 hover:bg-white/40"
                )}
              />
            ))}
          </div>

          {/* Bottom Controls Panel */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[11px] text-white/40 uppercase tracking-widest font-medium bg-black/20 px-8 py-3 rounded-full backdrop-blur-md border border-white/5 z-20">
             <div className="flex items-center gap-2">
               <MousePointer2 className="size-3.5" />
               <span>Kartalarni aylantirish</span>
             </div>
             <div className="flex gap-1.5 items-center">
               <Button variant="ghost" size="icon" onClick={prevCard} className="size-5 hover:bg-white/10 text-white/60 hover:text-white p-0 rounded-md">
                 <ChevronLeft className="size-3.5" />
               </Button>
               <Button variant="ghost" size="icon" onClick={nextCard} className="size-5 hover:bg-white/10 text-white/60 hover:text-white p-0 rounded-md">
                 <ChevronRight className="size-3.5" />
               </Button>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2">
               <span>Kartani ochish</span>
               <div className="size-4 rounded border border-white/30 flex items-center justify-center">
                  <div className="size-1.5 bg-white/50 rounded-full" />
               </div>
             </div>
          </div>

        </div>

        {/* Floating AI Assistant Widget (Placed Bottom-Right of the Carousel Space) */}
        <div className="absolute bottom-8 right-4 lg:right-8 w-72 bg-black/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-20 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white/80 border-b border-white/5 pb-2">
            <Sparkles className="size-4 text-purple-400" />
            <h2 className="font-semibold text-xs font-mono uppercase tracking-wider">AI Yordamchi</h2>
          </div>
          <p className="text-xs text-white/95 leading-relaxed">
            <span className="font-bold text-white">{summary?.newLeadsCount || 0} ta yangi lead</span> mavjud.
            <br />
            Ularni qayta ishlash tavsiya etiladi!
          </p>
          <Button onClick={() => navigate('/leads')} variant="ghost" className="w-full justify-between bg-[#241f33] hover:bg-[#322c47] text-purple-300 hover:text-purple-200 border border-purple-500/20 text-[11px] py-2 h-9 rounded-xl font-mono mt-1 cursor-pointer">
            Tafsilotlar
            <ArrowRight className="size-3" />
          </Button>
        </div>

      </div>
      
      {/* V2 Enterprise Dashboard Additions */}
      <div className="w-full space-y-6 pb-12 mt-6 px-6 lg:px-12">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex flex-col min-h-[300px]">
               <h3 className="text-lg font-semibold text-white mb-4">Revenue Forecast</h3>
               <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-white/30">
                  <span>[Revenue Projection Chart - Live]</span>
               </div>
            </div>
            <div className="glass-card p-6 flex flex-col min-h-[300px]">
               <h3 className="text-lg font-semibold text-white mb-4">Deal Forecast</h3>
               <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-white/30">
                  <span>[Pipeline Forecast Chart - Live]</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex flex-col lg:col-span-1">
               <h3 className="text-lg font-semibold text-white mb-4">Top Employees</h3>
               <div className="space-y-4">
                  {summary?.topEmployees?.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3">
                       <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                         {emp.name.substring(0, 2).toUpperCase()}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white truncate">{emp.name}</p>
                         <p className="text-xs text-white/50">{emp.role || emp.department || 'Employee'}</p>
                       </div>
                    </div>
                  ))}
                  {(!summary?.topEmployees || summary.topEmployees.length === 0) && (
                    <p className="text-xs text-white/40 italic">Xodimlar mavjud emas.</p>
                  )}
               </div>
            </div>

            <div className="glass-card p-6 flex flex-col lg:col-span-1">
               <h3 className="text-lg font-semibold text-white mb-4">Top Customers</h3>
               <div className="space-y-4">
                  {summary?.topCustomers?.map((cust) => (
                    <div key={cust.id} className="flex items-center gap-3">
                       <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                         {cust.name.substring(0, 2).toUpperCase()}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white truncate">{cust.name}</p>
                         <p className="text-xs text-white/50 font-mono">${(cust.value || 0).toLocaleString()}</p>
                       </div>
                    </div>
                  ))}
                  {(!summary?.topCustomers || summary.topCustomers.length === 0) && (
                    <p className="text-xs text-white/40 italic">Mijozlar mavjud emas.</p>
                  )}
               </div>
            </div>

            <div className="glass-card p-6 flex flex-col lg:col-span-2">
               <h3 className="text-lg font-semibold text-white mb-4">Sales Heatmap (Simulated)</h3>
               <div className="flex-1 grid grid-cols-7 gap-1">
                  {Array.from({length: 35}).map((_, i) => (
                    <div key={i} className={`rounded-sm bg-emerald-500/${(Math.floor(Math.random() * 8) + 1) * 10} flex items-center justify-center`}>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Activity Feed</h3>
               <div className="space-y-4 flex-1">
                  {summary?.activityFeed?.map((log) => (
                    <div key={log.id} className="flex gap-3 pb-3 border-b border-white/5">
                       <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                       <div className="min-w-0 flex-1">
                         <p className="text-sm text-white/80 truncate">{log.action.replace(/_/g, ' ')}</p>
                         <p className="text-[10px] text-white/40 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                       </div>
                    </div>
                  ))}
                  {(!summary?.activityFeed || summary.activityFeed.length === 0) && (
                    <p className="text-xs text-white/40 italic">Faolliklar mavjud emas.</p>
                  )}
               </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Approval Queue</h3>
               <div className="space-y-3 flex-1">
                  {summary?.approvalQueue?.map((app) => (
                    <div key={app.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                         <p className="text-sm font-medium text-white truncate pr-2">{app.title}</p>
                         <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] shrink-0">Pending</Badge>
                       </div>
                       <p className="text-xs text-white/50">${(app.amount || 0).toLocaleString()}</p>
                    </div>
                  ))}
                  {(!summary?.approvalQueue || summary.approvalQueue.length === 0) && (
                    <p className="text-xs text-white/40 italic">Tasdiqlashlar navbati bo'sh.</p>
                  )}
               </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
               <div className="space-y-3 flex-1">
                  {summary?.pendingTasks?.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                       <div className="size-4 rounded border border-white/20 mt-0.5 shrink-0" />
                       <div className="min-w-0 flex-1">
                         <p className="text-sm text-white leading-tight truncate">{task.title}</p>
                         <p className="text-xs text-white/40 mt-1 flex gap-2">
                            <span className="text-red-400">{task.priority}</span>
                            {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                         </p>
                       </div>
                    </div>
                  ))}
                  {(!summary?.pendingTasks || summary.pendingTasks.length === 0) && (
                    <p className="text-xs text-white/40 italic">Vazifalar mavjud emas.</p>
                  )}
               </div>
            </div>
         </div>
      </div>
      
    </div>
  );
}

export default DashboardPage;
