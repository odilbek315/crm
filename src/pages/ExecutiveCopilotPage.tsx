import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Sparkles, Bot, ArrowUpRight, ArrowDownRight, GitBranch, MessageSquare, Target, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { TiltCard } from '../components/ui/TiltCard';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export function ExecutiveCopilotPage() {
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Xayrli tong. 24-oktabr holatiga ko'ra avtomatlashtirilgan haftalik tahliliy hisobot quyidagicha:\n\n* **Daromad:** Kvartal rejasi 104% bajarilgan. Eng yirik bitim: TechFlow Inc ($140k).\n* **Xavf:** 'Muhandislik' bo'limi vazifalarni bajarish tezligi o'tgan oyga nisbatan 22% ga pasaygan.\n* **Imkoniyat:** Yevropa hududida tashlab ketilgan 12 ta xarid savatlari taxminan $42k yo'qotilgan daromadni anglatadi.\n\nMuhokamani qaysi masaladan boshlashimizni xohlaysiz?",
      timestamp: '9:00 AM'
    },
    {
      id: '2',
      role: 'user',
      text: "Muhandislik bo'limidagi sekinlashuv sabablarini tahlil qilib bering.",
      timestamp: '9:01 AM'
    },
    {
      id: '3',
      role: 'model',
      text: "Ish jarayonlari tahlil qilindi. Eng katta to'siq (bottleneck) **Kod Xavfsizligi Tekshiruvi** bosqichida ekanligi aniqlandi.\n\n* **O'rtacha tekshirish muddati:** 4.2 kun (Me'yordan yuqori)\n* **Kutilayotgan vazifalar:** 34 ta\n\nXavfsizlik tekshiruvini soddalashtirish maqsadida yangi avtomatlashtirilgan qoidalarni simulyatsiya qilish imkoniyati mavjud.",
      timestamp: '9:01 AM'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([
    { id: '1', title: 'Ortiqcha tasdiqlash zanjiri', desc: "Moliya direktori $50 dan kam xarajatlarni tasdiqlamoqda. Tarixiy ma'lumotlarga ko'ra, ularning 99.8% tasdiqlangan. Chegarani oshirishni ko'rib chiqish tavsiya etiladi.", active: false, actionText: 'Ish jarayonini avtomatik qayta tuzish' },
    { id: '2', title: 'Shartnomalar jarayonida turg\'unlik', desc: "'Muzokaralar' bosqichidagi bitimlar 8 kundan ortiq vaqt davomida harakatsiz qolmoqda. Avtomatlashtirilgan kuzatuv elektron pochta xabarini yuborish mexanizmini joriy etish tavsiya etiladi.", active: false, actionText: 'Mexanizmni joriy etish' }
  ]);
  const [loadingRecId, setLoadingRecId] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history for the API
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text
      }));

      const res = await api.post('/copilot/chat', {
        message: userMsg.text,
        history
      });

      const modelMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'model',
        text: res.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      toast({
        title: "Xatolik yuz berdi",
        description: "AI Kopilot bilan aloqa o'rnatishda muammo yuz berdi.",
        type: "error"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyRec = (id: string, title: string) => {
    setLoadingRecId(id);
    setTimeout(() => {
      setRecommendations(prev => prev.filter(r => r.id !== id));
      setLoadingRecId(null);
      toast({
        title: "Optimallashtirish tatbiq etildi",
        description: `"${title}" qoidasi muvaffaqiyatli tatbiq etildi.`,
        type: "success"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Bot className="size-8 text-sky-400" /> Ijrochi Kopilot
          </h1>
          <p className="text-white/60 mt-1 text-sm">Ish jarayonlaridagi to'siqlarni aniqlovchi va operatsion holatni umumlashtiruvchi sun'iy intellektga asoslangan strategik yordamchingiz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         {/* Chat Interface / Co-pilot */}
         <Card className="lg:col-span-2 glass-card border-white/10 flex flex-col h-[550px] lg:h-full">
            <CardHeader className="border-b border-white/5 pb-4 shrink-0">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Sparkles className="size-5 text-sky-400" /> Strategik brifing (Haftalik)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border ${
                    m.role === 'user' 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-sky-500/20 border-sky-500/30 text-sky-400'
                  }`}>
                    {m.role === 'user' ? <Bot className="size-4 text-white" /> : <Bot className="size-4" />}
                  </div>
                  <div className={`space-y-1 max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl border text-sm text-white/90 leading-relaxed whitespace-pre-line ${
                      m.role === 'user' 
                        ? 'bg-white/5 border-white/10 rounded-tr-none text-left' 
                        : 'bg-black/20 border-white/5 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[10px] text-white/30 px-1">{m.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="size-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-sky-400 animate-pulse" />
                  </div>
                  <div className="bg-black/20 border border-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-white/50 flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-sky-400" />
                    AI yordamchi fikrlamoqda...
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </CardContent>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/20 shrink-0">
               <div className="relative flex gap-2">
                 <input 
                   type="text" 
                   value={inputText}
                   onChange={e => setInputText(e.target.value)}
                   placeholder="Kopilotga savol yo'llang..." 
                   className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 pr-12" 
                 />
                 <Button 
                   type="submit" 
                   size="icon" 
                   disabled={!inputText.trim() || isTyping}
                   className="absolute right-1 top-1 bottom-1 h-auto w-10 bg-sky-500 hover:bg-sky-600 rounded-lg"
                 >
                   <Send className="size-4 text-white" />
                 </Button>
               </div>
            </form>
         </Card>

         {/* Autonomous Workflow Recommendations side panel */}
         <Card className="lg:col-span-1 glass-card border-white/10 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <CardHeader className="pb-4">
               <CardTitle className="text-lg text-white flex items-center gap-2">
                 <GitBranch className="size-5 text-emerald-400" /> Ish jarayonlarini optimallashtirish
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-xs text-white/50 mb-2">Operatsion evristika asosida avtomatlashtirilgan tarkibiy tavsiyalar.</p>
               
               {recommendations.length === 0 ? (
                 <div className="p-6 text-center text-white/40 text-xs">
                   Barcha tavsiyalar muvaffaqiyatli tatbiq etildi.
                 </div>
               ) : (
                 recommendations.map((rec) => (
                   <div key={rec.id} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">{rec.title}</h4>
                        <p className="text-[10px] text-white/60 leading-relaxed">{rec.desc}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleApplyRec(rec.id, rec.title)}
                        disabled={loadingRecId !== null}
                        className="w-full text-xs h-7 bg-transparent border-white/20 text-white hover:bg-white/5 flex items-center justify-center gap-1.5"
                      >
                        {loadingRecId === rec.id && <Loader2 className="size-3 animate-spin" />}
                        {rec.actionText}
                      </Button>
                   </div>
                 ))
               )}

               <div className="p-3 bg-black/40 border border-white/5 rounded-lg opacity-60">
                  <h4 className="text-sm font-semibold text-white mb-1">CRM ma'lumotlari eskirgan</h4>
                  <p className="text-[10px] text-white/60 mb-3">Ko'pgina aloqa raqamlarida mamlakat kodi mavjud emas. Mavjud yozuvlarni E.164 standartiga muvofiq formatlash uchun fon jarayonini joriy etish tavsiya etiladi.</p>
                  <Button size="sm" variant="outline" disabled className="w-full text-xs h-7 bg-transparent border-white/20 text-white/40">Jarayonda...</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}