import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Server, Database, Activity, HardDrive, Network, Inbox, Gauge, Container, Archive } from 'lucide-react';
import { JobQueueManager } from '../lib/infrastructure/QueueSystem';
import { StorageSystem } from '../lib/infrastructure/StorageSystem';
import { RealTimeEngine } from '../lib/infrastructure/RealtimeEngine';
import { InfrastructureArchitecture } from '../lib/infrastructure/DevOpsConfig';

export function ObservabilityPage() {
  const qMetrics = JobQueueManager.getMetrics();
  const sMetrics = StorageSystem.getMetrics();
  const rMetrics = RealTimeEngine.getMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Server className="size-8 text-sky-400" /> DevOps & Infrastructure
          </h1>
          <p className="text-white/60 mt-1 text-sm">Global Observability, Deployment Architecture, and Scalability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Queue */}
         <Card className="glass-card border-white/10 p-5 flex flex-col">
           <div className="flex items-center gap-2 text-white/50 mb-3">
             <Inbox className="size-4" /> <span className="text-xs uppercase tracking-wider font-semibold">Job Queues (BullMQ)</span>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Throughput</span><span className="text-sm font-mono text-emerald-400">{qMetrics.processingThroughput}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Pending</span><span className="text-sm font-mono text-white/90">{qMetrics.mainCount}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Dead Letter</span><span className="text-sm font-mono text-red-400">{qMetrics.deadLetterCount}</span></div>
           </div>
         </Card>

         {/* Storage */}
         <Card className="glass-card border-white/10 p-5 flex flex-col">
           <div className="flex items-center gap-2 text-white/50 mb-3">
             <HardDrive className="size-4" /> <span className="text-xs uppercase tracking-wider font-semibold">Object Storage</span>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Total Size</span><span className="text-sm font-mono text-sky-400">{sMetrics.totalSize}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Objects</span><span className="text-sm font-mono text-white/90">{sMetrics.objectCount.toLocaleString()}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">CDN Hit Rate</span><span className="text-sm font-mono text-emerald-400">{sMetrics.cacheHitRate}</span></div>
           </div>
         </Card>

         {/* Realtime */}
         <Card className="glass-card border-white/10 p-5 flex flex-col">
           <div className="flex items-center gap-2 text-white/50 mb-3">
             <Network className="size-4" /> <span className="text-xs uppercase tracking-wider font-semibold">WebSocket Engine</span>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Active Conn</span><span className="text-sm font-mono text-purple-400">{rMetrics.activeConnections.toLocaleString()}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Msg/sec</span><span className="text-sm font-mono text-white/90">{rMetrics.messagesPerSecond}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-white/40">Backing</span><span className="text-xs font-mono text-white/50 truncate w-24 text-right">Redis P/S</span></div>
           </div>
         </Card>

         {/* Targets */}
         <Card className="glass-card border-white/10 p-5 flex flex-col bg-emerald-900/10 border-t-2 border-t-emerald-500">
           <div className="flex items-center gap-2 text-emerald-400 mb-3">
             <Gauge className="size-4" /> <span className="text-xs uppercase tracking-wider font-semibold">Scale Limits</span>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between items-end"><span className="text-xs text-emerald-400/60">Tenants</span><span className="text-sm font-mono text-emerald-400">{InfrastructureArchitecture.ScalingLimits.TargetTenants}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-emerald-400/60">Concurrent</span><span className="text-sm font-mono text-emerald-400">{InfrastructureArchitecture.ScalingLimits.MaxConnections}</span></div>
             <div className="flex justify-between items-end"><span className="text-xs text-emerald-400/60">Throughput</span><span className="text-sm font-mono text-emerald-400">{InfrastructureArchitecture.ScalingLimits.DataThroughput}</span></div>
           </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Card className="glass-card border-white/10 flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Container className="size-5 text-sky-400" /> Kubernetes & CI/CD Config
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="flex-1 bg-[#0d1117] rounded-lg border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-semibold">docker-compose.yml</p>
                <pre className="text-[10px] font-mono text-emerald-300">
                  {InfrastructureArchitecture.DockerCompose}
                </pre>
             </div>
             <div className="flex-1 bg-[#0d1117] rounded-lg border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-semibold">deployment.yaml (K8s)</p>
                <pre className="text-[10px] font-mono text-sky-300">
                  {InfrastructureArchitecture.Kubernetes}
                </pre>
             </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Archive className="size-5 text-amber-400" /> Disaster Recovery & Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
             
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Database className="size-16" /></div>
                <h3 className="font-semibold text-white mb-1">PostgreSQL WAL Archiving</h3>
                <p className="text-xs text-white/50 mb-3">Continuous write-ahead log (WAL) archiving to S3 for Point-in-Time Recovery (PITR).</p>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/10 pt-2 text-white/40">
                  <span>Last check: 2s ago</span>
                  <span className="text-emerald-400">RPO: ≤ 5 mins</span>
                </div>
             </div>

             <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><HardDrive className="size-16" /></div>
                <h3 className="font-semibold text-white mb-1">S3 Versioning & Lifecycle</h3>
                <p className="text-xs text-white/50 mb-3">Object versioning enabled on main buckets. Infrequent access transition after 90 days. Glacier archive after 365 days.</p>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/10 pt-2 text-white/40">
                  <span>Retention: 7 Years (Compliance)</span>
                </div>
             </div>

             <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Server className="size-16" /></div>
                <h3 className="font-semibold text-white mb-1">Multi-Region Replication</h3>
                <p className="text-xs text-white/50 mb-3">Read-replicas spanning eu-west-1 and us-east-1 for global low latency and automated failover.</p>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/10 pt-2 text-white/40">
                  <span>Status: Active</span>
                  <span className="text-emerald-400">RTO: ≤ 30 mins</span>
                </div>
             </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
