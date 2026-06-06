import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/core/auth/AuthContext';
import { useTenant } from '../../lib/core/tenant/TenantContext';
import { 
  Home,
  Users, 
  Briefcase, 
  CheckSquare, 
  BarChart2,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Star,
  ChevronDown,
  Moon,
  Target,
  FileText,
  PieChart,
  Box,
  Wallet,
  LogOut,
  User as UserIcon,
  Activity,
  GitBranch,
  Shield,
  CheckCircle,
  Command,
  Plus,
  Building,
  Sparkles,
  Presentation,
  HeartPulse,
  BookOpen,
  Store,
  Code,
  Blocks,
  BarChart3,
  Server,
  Network,
  Lightbulb,
  Bot,
  Heart,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { mockNotifications } from '../../data/mockData';

const navGroups = [
  {
    title: 'O\'z-o\'zidan rivojlanuvchi platforma',
    items: [
      { icon: Search, label: 'Jarayonlarni tahlil qilish', href: '/process-mining' },
      { icon: Globe, label: 'Raqamli egizak', href: '/digital-twin' },
      { icon: HeartPulse, label: 'Tashkilot salomatligi indeksi', href: '/org-health' },
      { icon: PieChart, label: 'Qabul qilish tahlili', href: '/adoption' },
    ]
  },
  {
    title: 'Avtonom OS',
    items: [
      { icon: Bot, label: 'Ijrochi yordamchi', href: '/copilot' },
      { icon: Lightbulb, label: 'Qaror qabul qilish mexanizmi', href: '/decisions' },
      { icon: Network, label: 'Biznes grafigi', href: '/graph' },
      { icon: Heart, label: 'Mijozlar muvaffaqiyati', href: '/success' },
    ]
  },
  {
    title: 'Ijrochi',
    items: [
      { icon: Home, label: 'Boshqaruv paneli', href: '/' },
      { icon: Presentation, label: 'Operativ shtab', href: '/war-room' },
      { icon: BarChart3, label: 'BI Tahlili', href: '/analytics' },
    ]
  },
  {
    title: 'Intellekt va Operatsiyalar',
    items: [
      { icon: Sparkles, label: 'AI Markazi', href: '/intelligence' },
      { icon: BookOpen, label: 'Bilimlar bazasi', href: '/knowledge' },
      { icon: HeartPulse, label: 'Tizim salomatligi', href: '/system-health' },
      { icon: Activity, label: 'Faoliyat', href: '/activity' },
      { icon: CheckCircle, label: 'Tasdiqlashlar', href: '/approvals' },
    ]
  },
  {
    title: 'Asosiy modullar',
    items: [
      { icon: Target, label: 'Mijozlar', href: '/leads' },
      { icon: Users, label: 'Mijozlar', href: '/customers' },
      { icon: Briefcase, label: 'Savdo/CRM', href: '/sales' },
      { icon: CheckSquare, label: 'Vazifalar', href: '/tasks' },
      { icon: Users, label: 'HR', href: '/hr' },
      { icon: Box, label: 'Ombor', href: '/warehouse' },
      { icon: Wallet, label: 'Moliya', href: '/finance' },
      { icon: FileText, label: 'Hujjatlar', href: '/documents' },
    ]
  },
  {
    title: 'Ekosistema va Platforma',
    items: [
      { icon: Store, label: 'Bozor', href: '/marketplace' },
      { icon: Code, label: 'Dasturchi SDK', href: '/developer' },
      { icon: Blocks, label: 'Ilova yaratuvchi', href: '/builder' },
      { icon: GitBranch, label: 'Ish oqimlari', href: '/workflows' },
      { icon: Settings, label: 'Sozlamalar', href: '/settings' },
    ]
  },
  {
    title: 'Korxona infratuzilmasi',
    items: [
      { icon: Server, label: 'DevOps va Infra', href: '/observability' },
      { icon: Shield, label: 'Xavfsizlik markazi', href: '/security' },
      { icon: Shield, label: 'Audit jurnali', href: '/audit' },
    ]
  }
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { currentTenant, availableTenants, setCurrentTenant } = useTenant();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const performSearch = () => {
    return [];
  };

  const results = performSearch();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-foreground bg-transparent relative">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center px-6 gap-4 z-50 glass-header">
        <div className="flex items-center gap-3 w-64 shrink-0">
          <div className="size-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
            <Target className="size-4 text-white" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm leading-tight text-white tracking-wide">Market-ERP</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Korxona</p>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-xl mx-auto">
          <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input 
              placeholder="Qidirish yoki buyruq kiritish..." 
              className="pl-9 bg-black/20 border-white/10 rounded-full text-sm text-white placeholder:text-white/30 h-9 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] focus-visible:ring-1 focus-visible:ring-white/20"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/50">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            {/* Global Search Center Dropdown */}
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
                {!searchQuery && (
                   <div className="p-3 border-b border-white/10">
                     <p className="text-[10px] flex gap-2 font-medium text-white/40 uppercase tracking-widest px-2 mb-2">Tezkor amallar</p>
                     <div className="grid grid-cols-2 gap-1.5">
                       <Button variant="ghost" className="justify-start h-8 text-xs text-white/70 hover:bg-white/10" onClick={() => navigate('/customers')}>
                         <Users className="size-3.5 mr-2" /> Yangi mijoz
                       </Button>
                       <Button variant="ghost" className="justify-start h-8 text-xs text-white/70 hover:bg-white/10" onClick={() => navigate('/sales')}>
                         <Briefcase className="size-3.5 mr-2" /> Yangi bitim
                       </Button>
                       <Button variant="ghost" className="justify-start h-8 text-xs text-white/70 hover:bg-white/10" onClick={() => navigate('/leads')}>
                         <Target className="size-3.5 mr-2" /> Mijoz qo'shish
                       </Button>
                       <Button variant="ghost" className="justify-start h-8 text-xs text-white/70 hover:bg-white/10" onClick={() => navigate('/tasks')}>
                         <CheckSquare className="size-3.5 mr-2" /> Vazifa yaratish
                       </Button>
                     </div>
                   </div>
                )}
                
                <div className="overflow-y-auto custom-scrollbar p-2 flex-1 relative">
                   {searchQuery && results.length === 0 && (
                     <div className="p-6 text-center text-white/50 text-sm">
                       Natija topilmadi.
                     </div>
                   )}

                   {results.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest px-2 pt-2 pb-1">Natijalar</p>
                        {results.map(res => (
                          <button
                            key={res.id + res.type}
                            className="w-full text-left px-3 py-2 flex flex-col rounded-xl hover:bg-white/10 transition-colors group"
                            onClick={() => {
                              setShowSearch(false);
                              navigate(res.url);
                            }}
                          >
                             <div className="flex justify-between items-center w-full">
                               <span className="text-sm font-medium text-white group-hover:text-sky-400 transition-colors">{res.title}</span>
                               <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-white/50">{res.type}</span>
                             </div>
                          </button>
                        ))}
                      </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
            <Star className="size-4.5" />
          </Button>

          <div className="relative" ref={bellRef}>
            <Button onClick={() => setShowNotifications(!showNotifications)} variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 relative">
              <Bell className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50">
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <span className="font-semibold text-white text-sm">Bildirishnomalar</span>
                  <button className="text-[10px] text-white/50 hover:text-white transition-colors uppercase tracking-wider font-semibold">Barchasini o'qilgan deb belgilash</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                   {mockNotifications.map(n => (
                     <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${n.read ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-sm font-medium text-white tracking-wide">{n.title}</span>
                          {!n.read && <span className="size-2 bg-sky-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />}
                        </div>
                        <p className="text-xs text-white/60 mb-3 leading-relaxed">{n.description}</p>
                        <div className="flex justify-between items-center text-[10px] text-white/40 font-medium tracking-wide">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{n.type}</span>
                          <span>{n.timestamp}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-3 border-t border-white/10 text-center">
                  <button className="text-xs text-sky-400 font-medium hover:text-sky-300 transition-colors">Barcha bildirishnomalarni ko'rish</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative flex items-center pl-2 sm:pl-4 sm:border-l border-white/10" ref={profileRef}>
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 hover:bg-white/5 p-1 rounded-full transition-colors group">
              <div className="size-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-medium border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left mr-1">
                <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
                <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">{currentTenant?.name}</p>
              </div>
              <ChevronDown className="size-4 text-white/40 hidden sm:block group-hover:text-white/80 transition-colors" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/50 mt-1">{user?.email}</p>
                  <div className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded inline-block px-1.5 py-0.5">
                    {user?.role}
                  </div>
                </div>

                {/* Simulated Tenant Switcher */}
                <div className="px-3 py-2 border-b border-white/10 bg-black/40">
                   <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-1">Tashkilot doirasi</p>
                   {availableTenants.map((t: any) => (
                      <button 
                         key={t.id} 
                         onClick={() => { setCurrentTenant(t); setShowProfile(false); }}
                         className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm ${currentTenant?.id === t.id ? 'bg-sky-500/10 text-sky-400' : 'text-white/60 hover:bg-white/5'}`}
                      >
                         <span className="flex items-center gap-2">
                           <Building className="size-3.5" />
                           <span className="truncate">{t.name}</span>
                         </span>
                         {currentTenant?.id === t.id && <CheckCircle className="size-3 text-sky-400" />}
                      </button>
                   ))}
                </div>

                <div className="p-1.5 border-b border-white/10">
                  <NavLink onClick={() => setShowProfile(false)} to="/settings" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <UserIcon className="size-4" /> Profil
                  </NavLink>
                  <NavLink onClick={() => setShowProfile(false)} to="/settings" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="size-4" /> Hisob sozlamalari
                  </NavLink>
                </div>
                <div className="p-1.5">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut className="size-4" /> Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex w-full h-full pt-16 z-10 relative">
        {/* Sidebar */}
        <aside
          className={cn(
            "glass-panel flex flex-col transition-all duration-300 ease-in-out shrink-0 relative overflow-visible",
            sidebarOpen ? "w-56" : "w-16"
          )}
        >
          {/* Kanji Decoration */}
          <div className="absolute top-6 left-4 text-white/10 writing-vertical-rl text-xs tracking-[0.5em] font-serif select-none pointer-events-none z-0">
            改善
          </div>

          <nav className="relative z-10 flex-1 overflow-y-auto pt-24 pb-4 px-4 flex flex-col gap-2 custom-scrollbar">
            {navGroups.map((group, i) => (
              <div key={i} className="mb-2">
                <p className={cn("text-[10px] uppercase font-semibold text-white/30 tracking-wider mb-2 px-3", !sidebarOpen && "hidden")}>
                  {group.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-sm font-medium relative group",
                        isActive 
                          ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10" 
                          : "text-white/50 hover:bg-white/5 hover:text-white/90"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                          )}
                          <item.icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-white" : "text-white/50 group-hover:text-white/80")} />
                          <span className={cn("truncate transition-all", !sidebarOpen && "hidden")}>
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 relative z-10">
            <Button variant="ghost" className="w-full justify-start text-white/50 hover:text-white hover:bg-white/5 rounded-xl border border-transparent">
              <Moon className="size-4 mr-3 shrink-0" />
              <span className={cn("truncate transition-all", !sidebarOpen && "hidden")}>Tungi rejim</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 relative custom-scrollbar">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}