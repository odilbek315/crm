import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { useAuditLogs } from '../frontend/hooks/useAuditLogs';
import { Shield, Search, Filter, Download, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch logs
  const { data: auditLogs = [], isLoading, error } = useAuditLogs();

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Audit Logs</h1>
          <p className="text-white/60 mt-1 text-sm">Enterprise security tracker and compliance history.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert("Audit loglari muvaffaqiyatli eksport qilindi.")} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer">
            <Download className="size-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden glass-card border-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02] shrink-0">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Search users, actions, entities..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-white/50" />
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">Failed to load audit logs from server</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">User ID</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Entity</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map(log => {
                  const detailsText = log.changes ? (typeof log.changes === 'object' ? JSON.stringify(log.changes) : String(log.changes)) : '';
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-white/50 font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-white font-medium text-xs font-mono">
                        {log.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider border font-medium ${
                          log.action.includes('CREATE') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          log.action.includes('UPDATE') ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                          log.action.includes('DELETE') ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          'bg-white/10 border-white/20 text-white/70'
                        }`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-white/80">{log.entityType}</span>
                          <span className="text-white/40 font-mono text-[10px]">ID: {log.entityId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 font-mono text-xs max-w-xs truncate">
                        {detailsText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!isLoading && filteredLogs.length === 0 && (
            <div className="p-12 text-center text-white/50">
              Audit loglari topilmadi.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AuditLogPage;
