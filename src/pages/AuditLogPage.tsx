import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Shield, Search, Filter, Download, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/audit?limit=100');
      return res.data;
    }
  });

  const logs = data?.data || [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Audit Jurnallari</h1>
          <p className="text-white/60 mt-1 text-sm">Korxona xavfsizligi kuzatuvchisi va muvofiqlik tarixi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Download className="size-4 mr-2" />
            Jurnallarni eksport qilish
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden glass-card border-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02] shrink-0">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Foydalanuvchilar, harakatlar, ob'ektlarni qidirish..." 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto">
            <Filter className="size-4 mr-2 text-white/50" />
            Filtrlar
          </Button>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/50 uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Vaqt belgisi</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Foydalanuvchi</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Harakat</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Ob'ekt</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tafsilotlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                    <Loader2 className="size-6 animate-spin mx-auto mb-2 opacity-50" />
                    <p>Jurnallar yuklanmoqda...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                    Hech qanday audit yozuvi topilmadi.
                  </td>
                </tr>
              ) : (
                logs.filter((log: any) => 
                  log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  log.entityType.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((log: any) => {
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-white/50 font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white/40 font-mono text-[10px]">ID: {log.userId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider border font-medium ${
                          log.action === 'Created' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          log.action === 'Updated' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                          log.action === 'Deleted' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          'bg-white/10 border-white/20 text-white/70'
                        }`}>
                          {log.action === 'Created' ? 'Yaratildi' :
                           log.action === 'Updated' ? 'Yangilandi' :
                           log.action === 'Deleted' ? 'O\'chirildi' :
                           log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-white/80">{log.entityType}</span>
                          <span className="text-white/40 font-mono text-[10px]">ID: {log.entityId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {log.changes || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}