import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Shield, Key, Fingerprint, Activity, AlertTriangle, Monitor, Lock, Globe } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function SecurityCenterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text flex items-center gap-3">
            <Shield className="size-8 text-red-400" /> Enterprise Security
          </h1>
          <p className="text-white/60 mt-1 text-sm">MFA, Session Control, Audit Logs, and Threat Detection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-emerald-500">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Active Sessions</span>
           <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">1,204</p>
         </Card>
         
         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-amber-500">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">MFA Adoption</span>
           <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">92.4%</p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-red-500">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Blocked IPs (24h)</span>
           <p className="text-3xl font-display font-bold text-white tracking-tight mt-2">4,812</p>
         </Card>

         <Card className="glass-card border-white/10 p-6 flex flex-col justify-center gap-1 border-t-2 border-t-sky-500">
           <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Security Score</span>
           <p className="text-3xl font-display font-bold text-emerald-400 tracking-tight mt-2">A+</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Lock className="size-5 text-white/70" /> Access Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                <div>
                  <h4 className="font-semibold text-white/90">Multi-Factor Authentication (MFA)</h4>
                  <p className="text-xs text-white/50">Require MFA for all global administrators.</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <div className="size-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                <div>
                  <h4 className="font-semibold text-white/90">IP Allowlist Enforcement</h4>
                  <p className="text-xs text-white/50">Restrict admin access to corporate VPN IP blocks.</p>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <div className="size-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5">
                <div>
                  <h4 className="font-semibold text-white/90">Strict Session Expiry</h4>
                  <p className="text-xs text-white/50">Expire sessions after 4 hours of inactivity.</p>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full relative border border-white/20">
                  <div className="size-4 bg-white/50 rounded-full absolute left-0.5 top-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Monitor className="size-5 text-white/70" /> Active Global Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { ip: '192.168.1.42', location: 'London, UK', device: 'macOS / Chrome', current: true },
                { ip: '45.22.11.9', location: 'New York, US', device: 'iOS / Safari', current: false },
                { ip: '188.4.2.1', location: 'Frankfurt, DE', device: 'Windows / Edge', current: false },
              ].map((sess, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white/90 font-mono flex items-center gap-2">
                      {sess.ip} {sess.current && <Badge className="bg-sky-500/10 text-sky-400 text-[10px] px-1.5 py-0">Current</Badge>}
                    </span>
                    <span className="text-[10px] text-white/50">{sess.location} • {sess.device}</span>
                  </div>
                  {!sess.current && <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-7 text-xs">Revoke</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-red-500/20 bg-gradient-to-b from-red-900/10 to-black h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-400" /> Automated Threat Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
             {[
               { time: '10 mins ago', type: 'Brute Force Attempt', desc: '45 repeated failed login attempts from subnet 185.x.x.x targetting tenant: org-3', status: 'Blocked' },
               { time: '2 hours ago', type: 'Anomalous Export', desc: 'User "j.doe" triggered 4 full CSV exports of CRM Leads in 5 minutes.', status: 'Investigating' },
               { time: '5 hours ago', type: 'Impossible Travel', desc: 'Session established from VPN exit node in Singapore while another session is active in US.', status: 'Session Killed' },
             ].map((alert, i) => (
                <div key={i} className="p-4 border-l-2 border-red-500 bg-black/40 shadow-sm rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-white">{alert.type}</span>
                    <span className="text-[10px] text-white/40">{alert.time}</span>
                  </div>
                  <p className="text-xs text-white/60 mb-3">{alert.desc}</p>
                  <Badge className={`text-[10px] uppercase border-transparent ${alert.status === 'Blocked' || alert.status === 'Session Killed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    Action: {alert.status}
                  </Badge>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
