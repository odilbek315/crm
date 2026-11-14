import React, { useState } from 'react';
import { 
  Search, Plus, Filter, Loader2, X, Sparkles, 
  BrainCircuit, History, MessageSquare, DollarSign, Target, Briefcase 
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  useDealsKanban, 
  useUpdateDealStage, 
  useDealHistory 
} from '../frontend/hooks/useDeals';

const STAGES = ['Prospecting', 'Meeting Scheduled', 'Needs Analysis', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  
  // Drag and drop drop-target and notes modal state
  const [dropTarget, setDropTarget] = useState<{ id: string; stage: string } | null>(null);
  const [transitionNotes, setTransitionNotes] = useState('');
  
  // Fetch deals
  const { data: deals = [], isLoading, error } = useDealsKanban();
  
  // Fetch audit history for selected deal
  const { data: history = [], isLoading: isHistoryLoading } = useDealHistory(selectedDealId);
  
  // Update stage mutation
  const updateStageMutation = useUpdateDealStage();

  // Local state to store latest AI forecast after update
  const [latestAiForecast, setLatestAiForecast] = useState<{
    winProbability: number;
    recommendations: string[];
    dealId: string;
  } | null>(null);

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    const deal = deals.find(d => d.id === dealId);
    
    if (deal && deal.stage !== targetStage) {
      // Open modal to collect transition notes
      setDropTarget({ id: dealId, stage: targetStage });
      setTransitionNotes('');
    }
  };

  const handleTransitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropTarget) return;

    updateStageMutation.mutate({
      id: dropTarget.id,
      stage: dropTarget.stage,
      notes: transitionNotes
    }, {
      onSuccess: (data) => {
        // Store latest forecast result in local state
        setLatestAiForecast({
          winProbability: data.aiForecast.winProbability,
          recommendations: data.aiForecast.recommendations,
          dealId: dropTarget.id
        });
        
        // Auto open the copilot sidebar to showcase insights
        setSelectedDealId(dropTarget.id);
        setIsCopilotOpen(true);
        setDropTarget(null);
      }
    });
  };

  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deal.customer && deal.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardClick = (dealId: string) => {
    setSelectedDealId(dealId);
    setIsCopilotOpen(true);
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Sales Pipeline</h1>
          <p className="text-white/60 mt-1 text-sm">Track deals, opportunities, and AI-powered revenue forecasting.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <Input 
            placeholder="Search deals or companies..." 
            className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-hidden">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white/70 hover:text-white cursor-pointer">
            <Filter className="size-4 mr-2" /> All Stages
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 min-h-[500px]">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load deals from server</div>
        ) : (
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage);
              const totalValue = stageDeals.reduce((acc, curr) => acc + curr.value, 0);

              return (
                <div 
                  key={stage} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="glass-card w-80 flex flex-col gap-3 rounded-2xl p-4 shrink-0 hover:bg-black/20 transition-colors border-white/5"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col gap-1 px-2 mb-2 pb-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm tracking-wide text-white/90">{stage}</h3>
                      <span className="text-xs text-white/50">{stageDeals.length}</span>
                    </div>
                    <p className="font-mono text-emerald-400 text-sm font-medium">${totalValue.toLocaleString()}</p>
                  </div>
                  
                  {/* Cards Lane */}
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1 min-h-[400px]">
                    {stageDeals.map(deal => {
                      const hasForecast = latestAiForecast && latestAiForecast.dealId === deal.id;
                      return (
                        <div 
                          key={deal.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                          onClick={() => handleCardClick(deal.id)}
                          className="p-4 rounded-xl bg-black/40 border border-white/5 outline outline-1 outline-transparent hover:outline-indigo-500/30 hover:bg-black/60 transition-all cursor-pointer group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">
                              {deal.title}
                            </h4>
                          </div>
                          <p className="text-xs text-white/50 mb-2 truncate">
                            {deal.customer?.name || 'Noma\'lum mijoz'}
                          </p>
                          
                          {/* AI Mini Badge */}
                          {hasForecast ? (
                            <div className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full mb-3">
                              <Sparkles className="size-2.5" />
                              {latestAiForecast.winProbability}% Win Prob
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full mb-3">
                              <BrainCircuit className="size-2.5" />
                              AI Analyze Ready
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                            <div className="font-mono text-sm font-medium text-emerald-400/90">
                              ${deal.value.toLocaleString()}
                            </div>
                            <div className="size-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-white/70 border border-white/10">
                              D
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {stageDeals.length === 0 && (
                      <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl p-8 text-center text-white/20 text-xs">
                        Drop deals here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transition Notes Modal */}
      {dropTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0a0a0a] border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Stage Transition Note</h2>
              <Button variant="ghost" size="icon" onClick={() => setDropTarget(null)} className="size-8 text-white/50 hover:text-white rounded-full">
                <X className="size-4" />
              </Button>
            </div>
            <form onSubmit={handleTransitionSubmit} className="p-6 space-y-4">
              <p className="text-sm text-white/60">
                You are moving this deal to <strong>{dropTarget.stage}</strong>. Please provide an optional note explaining the transition.
              </p>
              <div>
                <label className="block text-xs text-white/70 mb-1 font-medium">Transition Notes</label>
                <textarea 
                  value={transitionNotes} 
                  onChange={e => setTransitionNotes(e.target.value)} 
                  placeholder="e.g. Sent formal pricing contract, awaiting signature..."
                  className="w-full h-24 p-3 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setDropTarget(null)} className="text-white hover:bg-white/5">Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={updateStageMutation.isPending} 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                >
                  {updateStageMutation.isPending ? 'Analyzing with AI...' : 'Move & Analyze'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* AI Deal Copilot Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 z-40 bg-[#0d0d11]/95 border-l border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isCopilotOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="size-5 text-indigo-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white font-display tracking-tight">AI Deal Copilot</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCopilotOpen(false)} className="size-8 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10">
            <X className="size-4" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {selectedDeal ? (
            <>
              {/* Deal Overview Card */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{selectedDeal.title}</h3>
                <p className="text-sm text-indigo-300">{selectedDeal.customer?.name || 'Noma\'lum mijoz'}</p>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/40 block uppercase tracking-wider font-semibold">Value</span>
                    <span className="text-base font-mono font-medium text-emerald-400">${selectedDeal.value.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/40 block uppercase tracking-wider font-semibold">Stage</span>
                    <span className="text-sm font-medium text-white block truncate">{selectedDeal.stage}</span>
                  </div>
                </div>
              </div>

              {/* Gemini Forecasting Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-indigo-400" />
                  <h4 className="text-sm font-semibold text-white">AI Sales Forecast</h4>
                </div>
                
                <Card className="glass-card border-indigo-500/20 bg-indigo-500/5 p-4 rounded-xl space-y-4">
                  {/* Win Probability gauge */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-white/70">Muvaffaqiyat ehtimoli (Win Prob)</span>
                      <span className="text-sm font-mono font-bold text-indigo-300">
                        {latestAiForecast && latestAiForecast.dealId === selectedDeal.id ? latestAiForecast.winProbability : 50}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000" 
                        style={{ width: `${latestAiForecast && latestAiForecast.dealId === selectedDeal.id ? latestAiForecast.winProbability : 50}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <span className="text-xs text-white/50 block font-medium">Tavsiyalar (Action Items):</span>
                    <ul className="space-y-2 text-xs text-white/80">
                      {(latestAiForecast && latestAiForecast.dealId === selectedDeal.id ? latestAiForecast.recommendations : [
                        "Mijozning ehtiyojlarini chuqurroq o'rganing va ularga moslashtirilgan yechim taklif qiling.",
                        "Keyingi uchrashuv sanasini aniqlashtiring va muzokaralarni rasmiylashtiring."
                      ]).map((rec, i) => (
                        <li key={i} className="flex gap-2 p-2 rounded-lg bg-black/30 border border-white/5">
                          <span className="text-indigo-400 font-bold font-mono">0{i+1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Transition History Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-white/70" />
                  <h4 className="text-sm font-semibold text-white">Stage Transition History</h4>
                </div>

                <div className="space-y-4 relative pl-4 border-l border-white/10 ml-2 pt-2">
                  {isHistoryLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-5 animate-spin text-white/30" />
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-white/40 italic">Tarixiy o'zgarishlar mavjud emas.</p>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="relative space-y-1">
                        {/* Timeline node */}
                        <div className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-white/20 border border-[#0d0d11]" />
                        
                        <div className="flex justify-between items-center text-[10px] text-white/40">
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          <span className="font-mono text-indigo-400/80">Owner</span>
                        </div>
                        
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge className="bg-white/5 text-white/50 text-[10px] shadow-none py-0 px-1.5">
                              {item.changes?.previousStage || 'Prospecting'}
                            </Badge>
                            <span className="text-white/40">→</span>
                            <Badge className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] py-0 px-1.5">
                              {item.changes?.newStage}
                            </Badge>
                          </div>
                          {item.changes?.notes && (
                            <div className="text-white/60 bg-black/20 p-2 rounded border border-white/5 flex gap-1.5 items-start mt-1">
                              <MessageSquare className="size-3 text-indigo-400 shrink-0 mt-0.5" />
                              <span className="italic">"{item.changes.notes}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-white/30 text-sm">
              Select a deal card to view AI forecasting and history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SalesPage;
