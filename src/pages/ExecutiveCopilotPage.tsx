import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Sparkles, Bot, ArrowUpRight, ArrowDownRight, GitBranch, Target, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useI18n } from '../lib/i18n';
import { useCopilotChat, ChatMessage } from '../frontend/hooks/useAnalytics';

export function ExecutiveCopilotPage() {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState('');
  
  // Message history state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t('copilot.greeting') }
  ]);

  const chatMutation = useCopilotChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatMutation.isPending]);

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = { role: 'user', text: inputValue };
    const currentHistory = [...messages];
    
    // Optimistically push the user message
    setMessages(prev => [...prev, userMessage]);
    const prompt = inputValue;
    setInputValue('');

    // Trigger backend Gemini generation
    chatMutation.mutate({
      query: prompt,
      history: currentHistory
    }, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      },
      onError: (error) => {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: `Kechirasiz, virtual assistent javob berishda xatolikka duch keldi: ${error.message}. Tarmoq ulanishini yoki API kalitini tekshirib ko'ring.` 
        }]);
      }
    });
  };

  const handleSuggestionClick = (promptText: string) => {
    setInputValue(promptText);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Bot className="size-8 text-sky-400" /> {t('copilot.title')}
          </h1>
          <p className="text-white/60 mt-1 text-sm">{t('copilot.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Chat Interface / Co-pilot */}
        <Card className="lg:col-span-2 glass-card border-white/10 flex flex-col h-full">
          <CardHeader className="border-b border-white/5 pb-4 shrink-0">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Sparkles className="size-5 text-sky-400" /> {t('copilot.briefingTitle')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 min-h-[300px]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-white/10 border border-white/20' : 'bg-sky-500/20 border border-sky-500/30'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="size-4 text-white" /> : <Bot className="size-4 text-sky-400" />}
                </div>
                
                <div className={`space-y-3 flex-1 ${
                  msg.role === 'user' 
                    ? 'bg-white/5 p-4 rounded-xl border border-white/10 rounded-tr-none text-sm text-white/90 max-w-[80%]' 
                    : 'max-w-[90%]'
                }`}>
                  <div className={`text-sm text-white/90 leading-relaxed whitespace-pre-wrap`}>
                    {msg.text}
                  </div>
                  
                  {/* Append initial state briefing block for model's greeting message */}
                  {index === 0 && (
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 mt-4">
                      <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest">{t('copilot.stateTitle')}</h4>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>{t('copilot.revenue')}</strong> {t('copilot.revenueText')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowDownRight className="size-4 text-red-400 shrink-0 mt-0.5" />
                          <span><strong>{t('copilot.risk')}</strong> {t('copilot.riskText')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="size-4 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>{t('copilot.opportunity')}</strong> {t('copilot.opportunityText')}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* AI is thinking/loading state */}
            {chatMutation.isPending && (
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Bot className="size-4 text-sky-400" />
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 rounded-tl-none flex items-center gap-2 text-sm text-white/60">
                  <Loader2 className="size-4 animate-spin text-sky-400" />
                  Executive Copilot ma'lumotlarni tahlil qilmoqda...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </CardContent>

          {/* Input Box */}
          <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                disabled={chatMutation.isPending}
                placeholder={t('copilot.askPlaceholder')} 
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 pr-12 disabled:opacity-50" 
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={chatMutation.isPending || !inputValue.trim()}
                className="absolute right-1 top-1 bottom-1 h-auto w-10 bg-sky-500 hover:bg-sky-600 rounded-lg cursor-pointer disabled:opacity-40"
              >
                <ArrowUpRight className="size-4 text-white" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Autonomous Workflow Recommendations side panel */}
        <Card className="lg:col-span-1 glass-card border-white/10 flex flex-col h-full overflow-y-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <GitBranch className="size-5 text-emerald-400" /> {t('copilot.optimizationTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-white/50 mb-2">{t('copilot.optimizationSubtitle')}</p>
            
            <div className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-sky-500/30 transition-all">
              <h4 className="text-sm font-semibold text-white mb-1">{t('copilot.card1Title')}</h4>
              <p className="text-[10px] text-white/60 mb-3">{t('copilot.card1Text')}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleSuggestionClick("Kompaniyamizning moliyaviy holati qanday va qaysi mijozlar bilan ishlashni kuchaytirishimiz kerak?")}
                className="w-full text-[10px] h-7 bg-transparent border-white/20 text-white hover:bg-white/5 cursor-pointer"
              >
                Tahlil so'rash
              </Button>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-sky-500/30 transition-all">
              <h4 className="text-sm font-semibold text-white mb-1">{t('copilot.card2Title')}</h4>
              <p className="text-[10px] text-white/60 mb-3">{t('copilot.card2Text')}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleSuggestionClick("Mijozlarimiz aylanmasi va oxirgi faolliklar haqida umumiy hisobot berolasizmi?")}
                className="w-full text-[10px] h-7 bg-transparent border-white/20 text-white hover:bg-white/5 cursor-pointer"
              >
                Mavzuni ochish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default ExecutiveCopilotPage;
