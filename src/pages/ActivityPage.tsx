import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { mockActivities, mockUsers } from '../data/mockData';
import { Activity as ActivityIcon, Mail, Phone, Calendar, FileText, RefreshCw, User as UserIcon } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export function ActivityPage() {
  const getIcon = (action: string) => {
    if (action.includes('Email')) return <Mail className="size-4" />;
    if (action.includes('Call')) return <Phone className="size-4" />;
    if (action.includes('Meeting')) return <Calendar className="size-4" />;
    if (action.includes('Note')) return <FileText className="size-4" />;
    return <RefreshCw className="size-4" />;
  };

  const getColor = (action: string) => {
    if (action.includes('Email')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (action.includes('Call')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('Meeting')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (action.includes('Note')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">Faoliyat markazi</h1>
          <p className="text-white/60 mt-1 text-sm">Barcha foydalanuvchi va tizim harakatlarining markazlashtirilgan tasmasi.</p>
        </div>
      </div>

      <Card className="glass-card shadow-2xl border-white/10 flex flex-col min-h-[600px] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <Input 
            placeholder="Faoliyatlarni qidirish..." 
            className="max-w-md bg-black/40 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-white/5">
            {mockActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(activity => {
              const user = mockUsers.find(u => u.id === activity.userId);
              return (
                <div key={activity.id} className="p-6 hover:bg-white/[0.02] transition-colors flex gap-4">
                  <div className={`mt-1 size-10 shrink-0 rounded-full flex items-center justify-center border ${getColor(activity.action)}`}>
                    {getIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{user?.name || 'Tizim'}</span>
                        <span className="text-white/50 text-sm">{activity.action}</span>
                      </div>
                      <span className="text-xs text-white/40 font-mono flex items-center gap-1.5 shrink-0">
                        <ActivityIcon className="size-3" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2 leading-relaxed">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-white/5 border-white/10 text-white/60">
                        {activity.entityType}
                      </Badge>
                      <span className="text-xs font-mono text-white/30 truncate max-w-[200px]">ID: {activity.entityId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}