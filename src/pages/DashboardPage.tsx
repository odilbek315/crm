import React, { useState } from 'react';
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
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/Toast';
import { TiltCard } from '../components/ui/TiltCard';

const cards = [
  {
    id: 'customers',
    title: 'Mijozlar',
    description: 'Mijozlar bazasini va ular bilan aloqalarni samarali boshqarish.',
    icon: Users,
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    stats: { label: 'Jami mijozlar soni', value: '1,248' },
    trend: null
  },
  {
    id: 'sales',
    title: 'Savdo',
    description: 'Savdo jarayonlari va bitimlarning holatini kuzatish.',
    icon: TrendingUp,
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    stats: { label: 'Oylik umumiy daromad', value: '$98,450' },
    trend: { type: 'chart' }
  },
  {
    id: 'leads',
    title: 'Leadlar',
    description: 'Yangi potensial mijozlar (leadlar) va ularning holatini boshqarish.',
    icon: Target,
    color: 'from-red-500/20 to-red-900/40',
    borderColor: 'border-red-500/50',
    iconColor: 'text-red-400',
    glowColor: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
    stats: { label: 'Yangi leadlar soni', value: '32', highlight: '+12' },
    subStats: { label: 'Jarayondagi leadlar soni', value: '78' }
  },
  {
    id: 'tasks',
    title: 'Vazifalar',
    description: 'Kundalik vazifalar va muhim eslatmalarni boshqarish.',
    icon: CheckSquare,
    color: 'from-sky-500/20 to-sky-500/5',
    borderColor: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    glowColor: 'shadow-[0_0_30px_rgba(14,165,233,0.15)]',
    stats: { label: 'Bugungi bajariladigan vazifalar', value: '14' },
    trend: { type: 'progress', value: 60 }
  },
  {
    id: 'analytics',
    title: 'Tahlillar',
    description: 'Biznes samaradorligi boʻyicha chuqur hisobotlar va tahlillar.',
    icon: PieChart,
    color: 'from-indigo-500/20 to-indigo-500/5',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    glowColor: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
    stats: { label: 'Umumiy oʻsish koʻrsatkichi', value: '+24.5%', valueColor: 'text-emerald-400' },
    trend: { type: 'bar' }
  }
];

const initialTasks = [
  { id: 1, title: 'Choraklik faoliyat koʻrsatkichlarini tahlil qilish', priority: 'Yuqori ustuvorlik', priorityColor: 'text-red-400', due: 'Bugungi muddat', completed: false },
  { id: 2, title: '3-chorak marketing byudjetini tasdiqlash', priority: 'Oʻrta ustuvorlik', priorityColor: 'text-amber-400', due: 'Ertangi muddat', completed: false },
  { id: 3, title: 'Acme Corp bilan mijozni tizimga kiritish boʻyicha suhbat', priority: 'Oddiy', priorityColor: 'text-white/60', due: '2 kun ichida muddat', completed: false },
  { id: 4, title: 'HR hujjatlarining muvofiqligini yangilash', priority: 'Past ustuvorlik', priorityColor: 'text-sky-400', due: 'Keyingi hafta', completed: false }
];

const initialApprovals = [
  { id: 1, title: '3-chorak marketing byudjeti', requester: 'Alex Thompson', status: 'Kutilmoqda', loading: false },
  { id: 2, title: 'Yangi xodim: Bosh muhandis', requester: 'Sarah Connor', status: 'Kutilmoqda', loading: false },
  { id: 3, title: 'Yetkazib beruvchi shartnomasi: Cloudflare', requester: 'IT boʻlimi', status: 'Kutilmoqda', loading: false }
];

export function DashboardPage() {
  const [activeIndex, setActiveIndex] = useState(2); // Center on 'leads'
  const { toast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleOpenCard = (title: string) => {
    toast({
      title: "Bo'lim yuklanmoqda",
      description: `Siz ${title} bo'limiga yo'naltirilmoqdasiz.`,
      type: "info"
    });
  };

  const handleAiDetails = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      toast({
         title: "AI Yordamchi: Tahlil natijasi",
         description: "Hozirda 3 ta lead yuqori faollik koʻrsatmoqda. Ular bilan bogʻlanish ehtimollikni 40% ga oshiradi.",
         type: "success"
      });
    }, 1500);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast({
        title: "Vazifa bajarildi",
        description: `"${task.title}" muvaffaqiyatli yakunlandi.`,
        type: "success"
      });
    }
  };

  const approveItem = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, loading: true } : a));
    setTimeout(() => {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, loading: false, status: 'Tasdiqlangan' } : a));
      toast({
        title: "Tasdiqlandi",
        description: "Hujjat muvaffaqiyatli tasdiqlandi.",
        type: "success"
      });
    }, 1000);
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-y-auto custom-scrollbar">
      
      {/* Upper Section: 3D Carousel + AI Sidebar */}
      <div className="flex w-full shrink-0 min-h-[700px] relative">
        {/* Main 3D Carousel Area */}
        <div className="flex-1 flex flex-col justify-center items-center relative perspective-[2000px] mb-12 lg:mb-0">
          
          {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-12 z-20 pointer-events-none">
          <Button variant="ghost" size="icon" onClick={prevCard} className="size-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 pointer-events-auto text-white">
            <ChevronLeft className="size-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextCard} className="size-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 pointer-events-auto text-white">
            <ChevronRight className="size-6" />
          </Button>
        </div>

        {/* Carousel Cards */}
        <div className="relative w-full max-w-4xl h-[500px] flex justify-center items-center transform-style-3d">
          {cards.map((card, index) => {
            let diff = index - activeIndex;
            if (diff > 2) diff -= cards.length;
            if (diff < -2) diff += cards.length;

            const isCenter = diff === 0;
            const zIndex = 10 - Math.abs(diff);
            
            const translateX = diff * 220; 
            const translateZ = -Math.abs(diff) * 150; 
            const rotateY = diff * -15; 
            
            const scale = isCenter ? 1 : 0.85;
            const opacity = Math.abs(diff) > 2 ? 0 : isCenter ? 1 : 0.6;

            return (
              <div 
                key={card.id}
                className={cn(
                  "absolute top-1/2 left-1/2 -ml-[160px] -mt-[250px] w-[320px] h-[500px] rounded-3xl transition-all duration-700 ease-out cursor-pointer",
                  "bg-gradient-to-b border backdrop-blur-xl flex flex-col",
                  card.color,
                  card.borderColor,
                  isCenter ? card.glowColor : ""
                )}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: isCenter ? 'brightness(1.1)' : 'brightness(0.6)'
                }}
                onClick={() => setActiveIndex(index)}
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-center mb-8 pt-4">
                    <div className={cn("p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10", card.iconColor)}>
                      <card.icon className="size-12 stroke-[1.5]" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-medium text-white text-center mb-2">{card.title}</h3>
                  <p className="text-sm text-center text-white/50 mb-8 whitespace-pre-line leading-relaxed">
                    {card.description}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div>
                      <p className="text-xs text-white/40 mb-1">{card.stats.label}</p>
                      <div className="flex items-end justify-between">
                        <span className={cn("text-3xl font-light tracking-tight text-white", card.stats.valueColor)}>
                          {card.stats.value}
                        </span>
                        {card.stats.highlight && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
                            {card.stats.highlight}
                          </span>
                        )}
                      </div>
                    </div>

                    {card.subStats && (
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-xs text-white/40 mb-1">{card.subStats.label}</p>
                         <span className="text-xl font-light text-white">{card.subStats.value}</span>
                      </div>
                    )}

                    {card.trend && card.trend.type === 'chart' && (
                       <div className="mt-4 pt-4 border-t border-white/10">
                         <svg viewBox="0 0 100 30" className="w-full h-8 overflow-visible">
                           <polyline points="0,25 20,15 40,20 60,5 80,10 100,0" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           <polyline points="0,25 20,15 40,20 60,5 80,10 100,0" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" filter="blur(2px)" />
                         </svg>
                       </div>
                    )}

                    {card.trend && card.trend.type === 'progress' && (
                       <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                         <div className="relative size-12 flex items-center justify-center">
                           <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                             <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                             <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray={`${card.trend.value}, 100`} />
                           </svg>
                           <span className="absolute text-[10px] text-white/80">{card.trend.value}%</span>
                         </div>
                       </div>
                    )}

                    {card.trend && card.trend.type === 'bar' && (
                       <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between h-12 gap-1 pb-1">
                         {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                           <div key={i} className="w-full bg-indigo-500/40 rounded-sm hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }} />
                         ))}
                       </div>
                    )}

                    {isCenter && (
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleOpenCard(card.title); }}
                        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-xl transition-all group"
                      >
                        Batafsil koʻrish
                        <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Controls / Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[11px] text-white/40 uppercase tracking-widest font-medium bg-black/20 px-8 py-3 rounded-full backdrop-blur-md border border-white/5">
           <div className="flex items-center gap-2">
             <MousePointer2 className="size-3.5" />
             <span>Kartalarni aylantiring</span>
           </div>
           <div className="flex gap-1 opacity-70">
             <ChevronLeft className="size-3.5" />
             <ChevronRight className="size-3.5" />
           </div>
           <div className="flex items-center gap-2">
             <span>Kartani oching</span>
             <div className="size-4 rounded-sm border border-white/30 flex items-center justify-center">
                <div className="size-1.5 bg-white/50 rounded-sm" />
             </div>
           </div>
        </div>

      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-80 border-l border-white/5 shrink-0 bg-black/20 backdrop-blur-sm relative z-20 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-8 text-white/80">
          <Sparkles className="size-4 text-purple-400" />
          <h2 className="font-medium text-sm">AI Yordamchi</h2>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
          <p className="text-sm text-white/90 leading-relaxed mb-4">
            <span className="font-semibold text-white">3 ta potensial mijoz</span> yuqori ehtimollikka ega.
            <br /><br />
            Ular bilan bogʻlanish vaqti keldi!
          </p>
          <Button 
            disabled={isAiLoading}
            onClick={handleAiDetails}
            variant="ghost" 
            className="w-full justify-between bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 border-t-transparent text-xs py-2 h-auto rounded-xl"
          >
            {isAiLoading ? <Loader2 className="size-3 animate-spin" /> : "Tafsilotlar"}
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
      </div>
      
      {/* V2 Enterprise Dashboard Additions */}
      <div className="w-full space-y-6 pb-12 mt-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TiltCard className="glass-card border-white/10 p-6 flex flex-col min-h-[300px]">
               <h3 className="text-lg font-semibold text-white mb-4">Daromad prognozi</h3>
               <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-white/30 relative overflow-hidden group hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="group-hover:text-emerald-400 transition-colors">[Daromad prognozi grafigi]</span>
               </div>
            </TiltCard>
            <TiltCard className="glass-card border-white/10 p-6 flex flex-col min-h-[300px]">
               <h3 className="text-lg font-semibold text-white mb-4">Bitimlar prognozi</h3>
               <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-white/30 relative overflow-hidden group hover:border-sky-500/50 transition-colors cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="group-hover:text-sky-400 transition-colors">[Bitimlar oqimi prognozi grafigi]</span>
               </div>
            </TiltCard>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <TiltCard className="glass-card border-white/10 p-6 flex flex-col lg:col-span-1">
               <h3 className="text-lg font-semibold text-white mb-4">Eng yaxshi xodimlar</h3>
               <div className="space-y-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                         E{i}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white truncate group-hover:text-indigo-100">Xodim {i}</p>
                         <p className="text-xs text-white/50">Ball: {95 - i}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </TiltCard>

            <TiltCard className="glass-card border-white/10 p-6 flex flex-col lg:col-span-1">
               <h3 className="text-lg font-semibold text-white mb-4">Eng yaxshi mijozlar</h3>
               <div className="space-y-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                         C{i}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white truncate group-hover:text-purple-100">Global Korporatsiya {i}</p>
                         <p className="text-xs text-white/50 font-mono">${(120000 - i*15000).toLocaleString()}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </TiltCard>

            <TiltCard className="glass-card border-white/10 p-6 flex flex-col lg:col-span-2">
               <h3 className="text-lg font-semibold text-white mb-4">Savdo faolligi xaritasi (simulyatsiya)</h3>
               <div className="flex-1 grid grid-cols-7 gap-1">
                  {Array.from({length: 35}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm bg-emerald-500/${(Math.floor(Math.random() * 8) + 1) * 10} flex items-center justify-center hover:bg-emerald-400 transition-colors cursor-pointer`}
                      title={`Savdo maʼlumot nuqtasi ${i + 1}`}
                    >
                    </div>
                  ))}
               </div>
            </TiltCard>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="glass-card border-white/10 p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Faoliyat lentasi</h3>
               <div className="space-y-4 flex-1">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors -mx-2 px-2 rounded cursor-pointer">
                       <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                       <div>
                         <p className="text-sm text-white/80">Tizim "Enterprise Cloud" bitimining bosqichini yangiladi</p>
                         <p className="text-[10px] text-white/40 mt-1">{i * 2} soat oldin</p>
                       </div>
                    </div>
                  ))}
               </div>
            </TiltCard>

            <TiltCard className="glass-card border-white/10 p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Tasdiqlash navbati</h3>
               <div className="space-y-3 flex-1">
                  {approvals.map((approval) => (
                    <div key={approval.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                         <p className="text-sm font-medium text-white truncate pr-2">{approval.title}</p>
                         <Badge 
                           className={cn(
                             "text-[10px] shrink-0 border",
                             approval.status === 'Kutilmoqda' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                           )}
                         >
                           {approval.status}
                         </Badge>
                       </div>
                       <div className="flex justify-between items-center">
                         <p className="text-xs text-white/50">Soʻrovchi: {approval.requester}</p>
                         {approval.status === 'Kutilmoqda' && (
                           <Button 
                             size="sm" 
                             variant="ghost" 
                             className="h-6 text-[10px] px-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10"
                             onClick={() => approveItem(approval.id)}
                             disabled={approval.loading}
                           >
                             {approval.loading ? <Loader2 className="size-3 animate-spin" /> : "Tasdiqlash"}
                           </Button>
                         )}
                       </div>
                    </div>
                  ))}
               </div>
            </TiltCard>

            <TiltCard className="glass-card border-white/10 p-6 flex flex-col">
               <h3 className="text-lg font-semibold text-white mb-4">Kutilayotgan vazifalar</h3>
               <div className="space-y-3 flex-1">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5 cursor-pointer transition-all hover:bg-white/5",
                        task.completed && "opacity-50"
                      )}
                    >
                       <div className={cn(
                         "size-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors",
                         task.completed ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                       )}>
                         {task.completed && <Check className="size-3 text-white" />}
                       </div>
                       <div>
                         <p className={cn("text-sm text-white leading-tight transition-all", task.completed && "line-through text-white/50")}>{task.title}</p>
                         <p className="text-xs text-white/40 mt-1 flex gap-2">
                            <span className={task.priorityColor}>{task.priority}</span>
                            <span>{task.due}</span>
                         </p>
                       </div>
                    </div>
                  ))}
               </div>
            </TiltCard>
         </div>
      </div>
    </div>
  );
}