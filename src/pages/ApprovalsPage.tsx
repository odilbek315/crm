import React from 'react';
import { Card } from '../components/ui/card';
import { CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useApprovals, useUpdateApprovalStatus } from '../frontend/hooks/useApprovals';

export function ApprovalsPage() {
  const { data: approvals = [], isLoading, error } = useApprovals();
  const updateStatusMutation = useUpdateApprovalStatus();

  const handleStatusUpdate = (id: string, status: 'Approved' | 'Rejected') => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Approval Queue</h1>
          <p className="text-white/60 mt-1 text-sm">Manage multi-stage business approvals and requests.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-white/50" />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-400">Tasdiqlash so'rovlarini yuklab bo'lmadi</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvals.map(approval => {
            const requester = approval.requester;
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
                      {approval.status}
                    </Badge>
                    <span className="text-xs text-white/40 font-mono">
                      {approval.createdAt ? new Date(approval.createdAt).toLocaleDateString() : ''}
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
                      {requester?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-white truncate">{requester?.name || 'Foydalanuvchi'}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider truncate">{requester?.role || 'Xodim'}</span>
                    </div>
                  </div>

                  {approval.status === 'Pending' && (
                    <div className="flex gap-3">
                      <Button 
                        disabled={updateStatusMutation.isPending}
                        onClick={() => approval.id && handleStatusUpdate(approval.id, 'Approved')}
                        className="flex-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        disabled={updateStatusMutation.isPending}
                        onClick={() => approval.id && handleStatusUpdate(approval.id, 'Rejected')}
                        className="flex-1 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="size-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {approval.status !== 'Pending' && (
                    <Button 
                      variant="outline" 
                      onClick={() => alert(`Batafsil ko'rish: ${approval.title}`)}
                      className="w-full bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
          {approvals.length === 0 && (
            <div className="col-span-full p-12 text-center text-white/40 italic">
              Tasdiqlash so'rovlari mavjud emas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
