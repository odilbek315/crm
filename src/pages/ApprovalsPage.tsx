import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { mockApprovals, mockUsers } from '../data/mockData';
import { CheckCircle, XCircle, FileText, Download, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Tasdiqlash navbati</h1>
          <p className="text-white/60 mt-1 text-sm">Ko'p bosqichli biznes tasdiqlashlari va so'rovlarini boshqaring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockApprovals.map(approval => {
          const requester = mockUsers.find(u => u.id === approval.requesterId);
          return (
            <Card key={approval.id} className="glass-card border-white/10 hover:bg-white/[0.02] transition-colors relative overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border ${
                    approval.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    approval.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    approval.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-white/5 text-white/50 border-white/10'
                  }`}>
                    {approval.status === 'Approved' ? 'Tasdiqlangan' :
                     approval.status === 'Rejected' ? 'Rad etilgan' :
                     approval.status === 'Pending' ? 'Kutilmoqda' :
                     approval.status}
                  </Badge>
                  <span className="text-xs text-white/40 font-mono">
                    {new Date(approval.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1 truncate">{approval.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-sm text-white/50">
                  <FileText className="size-4" />
                  <span>{approval.type}</span>
                  {approval.amount && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-white font-mono">${approval.amount.toLocaleString()}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/5 mb-6">
                  <div className="size-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-medium border border-indigo-500/30">
                    {requester?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate">{requester?.name}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider truncate">{requester?.role}</span>
                  </div>
                </div>

                {approval.status === 'Pending' && (
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30">
                      <CheckCircle className="size-4 mr-2" />
                      Tasdiqlash
                    </Button>
                    <Button variant="outline" className="flex-1 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300">
                      <XCircle className="size-4 mr-2" />
                      Rad etish
                    </Button>
                  </div>
                )}
                {approval.status !== 'Pending' && (
                  <Button variant="outline" className="w-full bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                    Batafsil ko'rish
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}