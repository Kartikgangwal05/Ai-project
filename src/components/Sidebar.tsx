import React from 'react';
import { Journey } from '../types/journey';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  User,
  Radio,
  AlertTriangle,
  BarChart3,
  UploadCloud,
  Sparkles,
  GitCompare,
  Printer,
  Settings,
  ChevronRight,
  Sun,
  Moon,
  X,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeJourney: Journey;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeJourney,
  isOpenMobile,
  onCloseMobile,
  isDark,
  onToggleTheme,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-journeys', label: 'My Journeys', icon: Layers },
    { id: 'create', label: 'Create Journey', icon: PlusCircle, isHighlight: true },
    { id: 'personas', label: 'Customer Personas', icon: User },
    { id: 'touchpoints', label: 'Touchpoints', icon: Radio },
    { id: 'matrix', label: 'Pain Points & Opps', icon: AlertTriangle },
    { id: 'kpis', label: 'KPI Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Upload & Ask AI', icon: UploadCloud },
    { id: 'copilot', label: 'Journey Copilot', icon: Sparkles },
    { id: 'compare', label: 'Compare Journeys', icon: GitCompare },
    { id: 'presentation', label: 'Presentation & Print', icon: Printer },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between border-r transition-all duration-300 no-print ${
          isDark
            ? 'bg-[#050816]/92 backdrop-blur-2xl border-white/[0.08] text-white shadow-2xl shadow-black/80'
            : 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-900 shadow-sm'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Brand Header */}
        <div className="p-6 border-b border-white/[0.08] bg-gradient-to-b from-purple-950/20 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-600/40 relative">
                <div className="w-full h-full rounded-[14px] bg-[#050816] flex items-center justify-center text-cyan-300">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                  JourneyX
                </span>
                <span className="block text-[10px] text-cyan-400 font-mono tracking-wider font-semibold">
                  CX MAPPER SAAS
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-[11px] text-slate-400 leading-tight italic">
            “Every Customer Has a Story. Map Every Moment.”
          </p>
        </div>

        {/* Navigation Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'animated-gradient-active text-white font-bold shadow-lg shadow-purple-600/35 border border-white/20'
                    : item.isHighlight
                    ? 'text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.06] border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isHighlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/90" />}
              </button>
            );
          })}
        </div>

        {/* Active Journey Widget in Sidebar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#030612]/70 backdrop-blur-md space-y-3">
          <div className="p-3 rounded-2xl glass-card-subtle border border-purple-500/30 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Map
              </span>
              <span className="font-mono text-cyan-300 font-semibold">{activeJourney.stages.length} Stages</span>
            </div>
            <div className="font-bold text-xs text-white truncate" title={activeJourney.title}>
              {activeJourney.productName}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {activeJourney.customerType}
            </div>
          </div>

          {/* Theme & Status toggle */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="text-[11px]">Interface Theme</span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
              title="Toggle Light/Dark Theme"
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px]">Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
