import React, { useState } from 'react';
import { Settings, User, Building, Lock, Bell, Palette, Globe, Shield, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General Info');

  const tabs = [
    { label: 'General Info', icon: Building },
    { label: 'Security & Roles', icon: Shield },
    { label: 'User Management', icon: User },
    { label: 'Notifications', icon: Bell },
    { label: 'Appearance', icon: Palette },
    { label: 'Integrations', icon: Globe },
    { label: 'White-Label & Branding', icon: Palette },
    { label: 'Localization', icon: Globe },
    { label: 'Data Import/Export', icon: Settings },
  ];

  const roles = ['Administrator', 'Director', 'Sales Manager', 'HR Manager', 'Warehouse Manager', 'Accountant', 'Employee'];
  const permissions = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'];

  // Simulated permission logic (true if full admin, otherwise random for demo)
  const hasPermission = (role: string, perm: string) => {
    if (role === 'Administrator') return true;
    if (role === 'Director' && perm !== 'Delete') return true;
    if (role === 'Employee' && (perm === 'Delete' || perm === 'Export' || perm === 'Approve')) return false;
    return Math.random() > 0.3; // Default
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white glow-text">System Settings</h1>
        <p className="text-white/60 mt-1 text-sm">Manage configuration, users, and organization preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3 space-y-1">
           {tabs.map((tab, i) => (
             <button 
                key={i} 
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.label ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
             >
               <tab.icon className="size-4" />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="xl:col-span-9 space-y-6">
          {activeTab === 'General Info' && (
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Company Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                  <div className="size-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-white font-display text-2xl font-bold backdrop-blur-md">
                     ME
                  </div>
                  <div>
                     <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 mb-2">Upload Logo</Button>
                     <p className="text-xs text-white/50">Recommended size: 256x256px. PNG or JPG.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Company Name</label>
                    <Input defaultValue="Market ERP Inc." className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Support Email</label>
                    <Input defaultValue="support@market-erp.com" className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Primary Currency</label>
                    <Input defaultValue="USD ($)" disabled className="bg-black/20 border-white/5 text-white/50 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Timezone</label>
                    <Input defaultValue="UTC-05:00 (Eastern Time)" className="bg-black/40 border-white/10 text-white" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                   <Button className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30">
                     Save Changes
                   </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Security & Roles' && (
            <Card className="glass-card border-white/10 backdrop-blur-md flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">Role-Based Access Control (RBAC)</CardTitle>
                <CardDescription className="text-white/50">Configure granular permissions for organizational roles across all modules.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-left font-medium text-white/80 w-1/4">Roles</th>
                      {permissions.map((perm) => (
                        <th key={perm} className="p-4 font-medium text-white/60 tracking-wider">
                          <div className="writing-vertical-rl md:writing-horizontal-tb mx-auto -rotate-180 md:rotate-0 h-24 md:h-auto">
                            {perm}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {roles.map((role) => (
                      <tr key={role} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-left font-medium text-white">{role}</td>
                        {permissions.map((perm) => {
                          const granted = hasPermission(role, perm);
                          return (
                            <td key={perm} className="p-4">
                               <div className="flex justify-center">
                                 {granted ? (
                                   <div className="size-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                     <Check className="size-4" />
                                   </div>
                                 ) : (
                                   <div className="size-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500/50">
                                     <X className="size-3" />
                                   </div>
                                 )}
                               </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
                   <Button variant="outline" className="border-white/10 bg-transparent text-white/70 hover:text-white">Revert</Button>
                   <Button className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30">
                     Update Matrix
                   </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'White-Label & Branding' && (
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-white">White-Label Customization</CardTitle>
                <CardDescription className="text-white/60">Customize the platform appearance, logo, and domain.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                   <label className="text-sm font-medium text-white/50 mb-1 block">Custom Domain</label>
                   <div className="flex gap-2">
                     <Input className="bg-black/20 border-white/10 text-white flex-1" defaultValue="erp.acme-corp.com" />
                     <Button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">Verify</Button>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/50 mb-1 block">Primary Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded bg-emerald-500 border border-white/20"></div>
                      <Input className="bg-black/20 border-white/10 text-white w-24" defaultValue="#10b981" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/50 mb-1 block">Custom Logo URL</label>
                    <Input className="bg-black/20 border-white/10 text-white" placeholder="https://..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Localization' && (
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-white">Multi-Language Framework</CardTitle>
                <CardDescription className="text-white/60">Manage tenant language packs and default locales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-white font-medium">English (US)</span>
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Default</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-white font-medium">Russian (ru-RU)</span>
                    <span className="text-xs px-2 py-1 bg-white/5 text-white/40 border border-white/10 rounded cursor-pointer hover:bg-white/10">Set Default</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-white font-medium">Uzbek (uz-UZ)</span>
                    <span className="text-xs px-2 py-1 bg-white/5 text-white/40 border border-white/10 rounded cursor-pointer hover:bg-white/10">Set Default</span>
                 </div>
                 <Button variant="outline" className="w-full border-dashed border-white/20 text-white/60 hover:text-white bg-transparent">
                   + Import Language Pack
                 </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Data Import/Export' && (
             <Card className="glass-card border-white/10 backdrop-blur-md">
               <CardHeader>
                 <CardTitle className="text-xl text-white">Data Integration Center</CardTitle>
                 <CardDescription className="text-white/60">Bulk import/export CRM, ERP, and HR modules data.</CardDescription>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-6">
                 <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center gap-3">
                    <p className="text-sm font-semibold text-white">Import Data</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white text-xs h-7">CSV</Button>
                      <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white text-xs h-7">Excel (.xlsx)</Button>
                    </div>
                 </div>
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center gap-3">
                    <p className="text-sm font-semibold text-white">Export Data</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-7">CSV</Button>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-7">Excel</Button>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-7">PDF</Button>
                    </div>
                 </div>
               </CardContent>
             </Card>
          )}

          {activeTab !== 'General Info' && activeTab !== 'Security & Roles' && activeTab !== 'White-Label & Branding' && activeTab !== 'Localization' && activeTab !== 'Data Import/Export' && (
             <Card className="glass-card border-white/10 backdrop-blur-md p-12 flex flex-col items-center justify-center border-dashed">
                <Lock className="size-12 text-white/20 mb-4" />
                <p className="text-white/50 text-center">Settings for {activeTab} will appear here.</p>
             </Card>
          )}

        </div>
      </div>
    </div>
  );
}
