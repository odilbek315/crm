import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Network, Activity, Filter, ZoomIn, ZoomOut, Maximize, User, Building, Briefcase, FileText, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/Toast';
import { cn } from '../lib/utils';
import { TiltCard } from '../components/ui/TiltCard';

export function BusinessGraphPage() {
  const [activeToggles, setActiveToggles] = useState<string[]>(['Xaridorlar', 'Mijozlar', 'Bitimlar', 'Hisob-fakturalar', 'Mahsulotlar']);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const toggleEntity = (label: string) => {
    setActiveToggles(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const runPathAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Yo'l tahlili yakunlandi",
        description: "Eng yuqori xavfli bog'lanishlar va muammolar aniqlandi. Chap panelni ko'rib chiqing.",
        type: "success"
      });
    }, 2000);
  };

  const isVisible = (type: string) => activeToggles.includes(type);

  return (
    <div className="space-y-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Network className="size-8 text-indigo-400" /> Biznes Grafigi Tizimi
          </h1>
          <p className="text-white/60 mt-1 text-sm">Korxona munosabatlari va operatsion bog'liqliklarning interaktiv vizualizatsiyasi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white/70 hover:text-white bg-transparent" onClick={() => toast({ title: "Filtr", description: "Kengaytirilgan filtr oynasi ochildi." })}>
            <Filter className="size-4 mr-2" /> Obyektlarni filtrlash
          </Button>
          <Button 
            onClick={runPathAnalysis}
            disabled={isAnalyzing}
            className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 w-44"
          >
            {isAnalyzing ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Yo'l tahlilini ishga tushirish
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar Controls */}
         <div className="lg:col-span-1 space-y-4 flex flex-col">
            <Card className="glass-card border-white/10 flex-shrink-0">
               <CardHeader className="pb-3">
                 <CardTitle className="text-sm text-white">Obyektlarni boshqarish</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  {[
                    { label: 'Xaridorlar', icon: Building, color: 'text-sky-400', bg: 'bg-sky-500/10' }, // Customers (companies)
                    { label: 'Mijozlar', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10' }, // Leads (individuals)
                    { label: 'Bitimlar', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }, // Deals
                    { label: 'Hisob-fakturalar', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Mahsulotlar', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  ].map((entity, i) => {
                    const active = activeToggles.includes(entity.label);
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleEntity(entity.label)}
                        className="flex items-center justify-between p-2 rounded border border-white/5 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors"
                      >
                         <div className="flex items-center gap-2">
                           <div className={cn("p-1.5 rounded transition-all", active ? entity.bg : "bg-white/5")}>
                             <entity.icon className={cn("size-3.5 transition-all", active ? entity.color : "text-white/30")} />
                           </div>
                           <span className={cn("text-sm font-medium transition-all", active ? "text-white/80" : "text-white/40")}>{entity.label}</span>
                         </div>
                         <div className={cn("w-8 h-4 rounded-full relative transition-colors duration-300", active ? "bg-emerald-500" : "bg-white/10")}>
                           <div className={cn("size-3 bg-white rounded-full absolute top-0.5 transition-all duration-300", active ? "right-0.5" : "left-0.5")} />
                         </div>
                      </div>
                    )
                  })}
               </CardContent>
            </Card>

            <Card className="glass-card border-white/10 flex-1 overflow-y-auto custom-scrollbar">
               <CardHeader className="pb-3 top-0 sticky bg-black/40 backdrop-blur-md z-10 border-b border-white/5">
                 <CardTitle className="text-sm text-white">Muhim bog'liqliklar</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="p-3 border-l-2 border-red-500 bg-red-500/5 rounded-r hover:bg-red-500/10 transition-colors cursor-pointer" onClick={() => toast({ title: "Yuqori xavf haqida ma'lumot", description: "Batafsil ma'lumot yuklanmoqda...", type: "error" })}>
                    <p className="text-xs font-semibold text-red-400 mb-1">Yuqori xavfli bog'liqlik zanjiri</p>
                    <p className="text-[10px] text-white/60">Yetkazib beruvchi A → Mahsulot X → Asosiy Xaridor B (Yillik takrorlanuvchi daromadning 15% ni tashkil qiladi). Yetkazib beruvchi A to'lovlarni kechiktirmoqda.</p>
                  </div>
                  <div className="p-3 border-l-2 border-amber-500 bg-amber-500/5 rounded-r hover:bg-amber-500/10 transition-colors cursor-pointer" onClick={() => toast({ title: "Jarayon tiqilishi", description: "Yuridik bo'limga xabar yuborildi.", type: "warning" })}>
                    <p className="text-xs font-semibold text-amber-400 mb-1">Jarayon tiqilishi</p>
                    <p className="text-[10px] text-white/60">Yuridik bo'lim hozirda shartnoma tasdiqlanishini kutayotgan 12 ta yirik bitim uchun to'siq bo'lmoqda.</p>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Graph Canvas area */}
         <Card className="lg:col-span-3 glass-card border-white/10 relative overflow-hidden flex flex-col bg-[#050510]">
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-md">
               <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 text-white/60 hover:text-white"><ZoomIn className="size-4" /></Button>
               <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 text-white/60 hover:text-white"><ZoomOut className="size-4" /></Button>
               <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-8 w-8 text-white/60 hover:text-white"><Maximize className="size-4" /></Button>
            </div>
            
            <div 
               className={cn("flex-1 w-full h-full flex items-center justify-center relative cursor-move", isDragging ? "cursor-grabbing" : "cursor-grab")}
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
            >
               {/* Decorative background grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               
               {/* Simulated Nodes Structure */}
               <div 
                 className={cn("relative w-[600px] h-[400px]", isDragging ? "" : "transition-transform duration-300")}
                 style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
               >
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-indigo-500/20 border-2 border-indigo-500 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.2)] z-20 flex flex-col items-center">
                    <Briefcase className="size-6 text-indigo-400 mb-1" />
                    <span className="text-sm font-bold text-white whitespace-nowrap">Acme Korporatsiyasi (Global)</span>
                    <Badge className="mt-1 bg-white/10 text-white/60 text-[10px] h-4">Korporativ</Badge>
                  </div>

                  {/* Connected Nodes */}
                  <div className={cn("absolute top-[15%] left-[25%] -translate-x-1/2 -translate-y-1/2 p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-sky-500/20 transition-all", !isVisible('Mijozlar') && "opacity-20 pointer-events-none")}>
                    <User className="size-4 text-sky-400 mb-1" />
                    <span className="text-xs font-medium text-white">Jon Dou (Chempion)</span>
                  </div>

                  <div className={cn("absolute top-[80%] left-[15%] -translate-x-1/2 -translate-y-1/2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-amber-500/20 transition-all", !isVisible('Bitimlar') && "opacity-20 pointer-events-none")}>
                    <Briefcase className="size-4 text-amber-400 mb-1" />
                    <span className="text-xs font-medium text-white">Feniks Loyihasi Bitimi</span>
                  </div>

                  <div className={cn("absolute top-[35%] left-[85%] -translate-x-1/2 -translate-y-1/2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-red-500/20 transition-all", !isVisible('Hisob-fakturalar') && "opacity-20 pointer-events-none")}>
                    <FileText className="size-4 text-red-400 mb-1" />
                    <span className="text-xs font-medium text-white">INV-9092 (Muddati o'tgan)</span>
                  </div>

                  <div className={cn("absolute top-[85%] left-[75%] -translate-x-1/2 -translate-y-1/2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg z-20 flex flex-col items-center cursor-pointer hover:bg-purple-500/20 transition-all", !isVisible('Xaridorlar') && "opacity-20 pointer-events-none")}>
                    <Building className="size-4 text-purple-400 mb-1" />
                    <span className="text-xs font-medium text-white">Acme Yevropa Sho'ba Korxonasi</span>
                  </div>

                  {/* SVG Lines */}
                  <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                     <path d="M 150 60 Q 225 130 300 200" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" className={cn("transition-opacity", !isVisible('Mijozlar') && "opacity-0")} />
                     <path d="M 90 320 Q 195 260 300 200" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="2" className={cn("transition-opacity", !isVisible('Bitimlar') && "opacity-0")} />
                     <path d="M 510 140 Q 405 170 300 200" fill="transparent" stroke="rgba(255,0,0,0.5)" strokeWidth="2" className={cn("transition-opacity", !isVisible('Hisob-fakturalar') && "opacity-0")} />
                     <path d="M 450 340 Q 375 270 300 200" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="2" className={cn("transition-opacity", !isVisible('Xaridorlar') && "opacity-0")} />
                     
                     {/* Animated pulse on high risk during analysis */}
                     {isAnalyzing && (
                       <circle cx="510" cy="140" r="20" fill="none" stroke="rgba(255,0,0,0.5)" strokeWidth="2" className="animate-ping" />
                     )}
                  </svg>
               </div>
            </div>
            
            <div className="absolute bottom-4 left-4 z-20 flex gap-4 p-2 bg-black/40 rounded-lg border border-white/10 backdrop-blur-md">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-white/20"></div><span className="text-[10px] text-white/50">Standart bog'liqlik</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-red-500/50"></div><span className="text-[10px] text-white/50">Xavf/To'siq</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-0.5 bg-white/20 border-t border-dashed"></div><span className="text-[10px] text-white/50">Yashirin bog'liqlik</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}