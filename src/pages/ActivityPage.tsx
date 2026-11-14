import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useAuditLogs } from '../frontend/hooks/useAuditLogs';
import { Activity as ActivityIcon, Mail, Phone, Calendar, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch audit logs
  const { data: auditLogs = [], isLoading, error } = useAuditLogs();

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (action: string) => {
    if (action.includes('CREATE')) return <PlusIcon className="size-4" />;
    if (action.includes('UPDATE')) return <RefreshCw className="size-4" />;
    if (action.includes('DELETE')) return <TrashIcon className="size-4" />;
    return <FileText className="size-4" />;
  };

  const getColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('UPDATE')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (action.includes('DELETE')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Activity Center</h1>
          <p className="text-white/60 mt-1 text-sm">Centralized feed of all user and system actions.</p>
        </div>
      </div>

      <Card className="glass-card shadow-2xl border-white/10 flex flex-col min-h-[600px] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <Input 
            placeholder="Search activities..." 
            className="max-w-md bg-black/40 border-white/10 text-white placeholder:text-white/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load activity logs from server</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredLogs.map(log => {
                const detailsText = log.changes ? (typeof log.changes === 'object' ? JSON.stringify(log.changes) : String(log.changes)) : '';
                return (
                  <div key={log.id} className="p-6 hover:bg-white/[0.02] transition-colors flex gap-4">
                    <div className={`mt-1 size-10 shrink-0 rounded-full flex items-center justify-center border ${getColor(log.action)}`}>
                      {getIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{log.userId}</span>
                          <span className="text-white/50 text-sm">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-xs text-white/40 font-mono flex items-center gap-1.5 shrink-0">
                          <ActivityIcon className="size-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2 leading-relaxed font-mono text-xs truncate max-w-xl">{detailsText}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-white/5 border-white/10 text-white/60">
                          {log.entityType}
                        </Badge>
                        <span className="text-xs font-mono text-white/30 truncate max-w-[200px]">ID: {log.entityId}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!isLoading && filteredLogs.length === 0 && (
            <div className="p-12 text-center text-white/50">
              Faolliklar topilmadi.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export default ActivityPage;
