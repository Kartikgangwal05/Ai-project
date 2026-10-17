import React, { useState } from 'react';
import { Journey } from '../types/journey';
import {
  Menu,
  Sparkles,
  Download,
  Plus,
  ChevronDown,
  FileJson,
  FileSpreadsheet,
  Printer,
  Compass,
} from 'lucide-react';
import {
  exportJourneyToJSON,
  exportTouchpointsToCSV,
  exportPainPointsToCSV,
  exportKPIsToCSV,
} from '../utils/journeyStore';
import { AISearchBar } from './AISearchBar';

interface HeaderProps {
  activeTab: string;
  activeJourney: Journey;
  allJourneys: Journey[];
  onSelectJourney: (id: string) => void;
  onCreateNew: () => void;
  onOpenMobileSidebar: () => void;
  onToggleCopilot: () => void;
  onNavigateTab: (tab: string) => void;
  onJourneyLoaded: (journey: Journey) => void;
  isDark?: boolean;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Executive Dashboard',
  'my-journeys': 'My Journey Maps',
  create: 'Create Customer Journey',
  personas: 'Customer Personas',
  touchpoints: 'Omnichannel Touchpoints',
  matrix: 'Impact vs. Effort Matrix',
  kpis: 'KPI Performance Center',
  upload: 'Upload & Ask AI',
  copilot: 'Journey Copilot',
  compare: 'Compare Journeys',
  presentation: 'Presentation & Print Report',
  settings: 'Workspace Settings',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeJourney,
  allJourneys,
  onSelectJourney,
  onCreateNew,
  onOpenMobileSidebar,
  onToggleCopilot,
  onNavigateTab,
  onJourneyLoaded,
  isDark = true,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showJourneyDropdown, setShowJourneyDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-6 py-4 border-b bg-[#050816]/85 backdrop-blur-2xl border-white/[0.08] flex items-center justify-between gap-4 no-print shadow-xl shadow-black/40">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-purple-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              JourneyX
            </span>
            <span>/</span>
            <span className="text-slate-200 font-medium">
              {TAB_TITLES[activeTab] || 'Dashboard'}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Center: Quick AI Product Search Bar */}
      <AISearchBar
        variant="header"
        onJourneyLoaded={onJourneyLoaded}
        isDark={isDark}
      />

      {/* Right: Journey Switcher & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Journey Dropdown Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowJourneyDropdown(!showJourneyDropdown)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] hover:border-purple-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2.5 transition-all max-w-[180px] sm:max-w-[240px] shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse"></span>
            <span className="truncate">{activeJourney.productName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-auto" />
          </button>

          {showJourneyDropdown && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-2 z-50 text-xs space-y-1 animate-in fade-in border border-white/[0.12]"
              onMouseLeave={() => setShowJourneyDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Active Journey
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {allJourneys.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      onSelectJourney(j.id);
                      setShowJourneyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      j.id === activeJourney.id
                        ? 'animated-gradient-active text-white font-bold'
                        : 'text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate">{j.productName}</div>
                      <div className="text-[10px] opacity-75">{j.industry}</div>
                    </div>
                    {j.id === activeJourney.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowJourneyDropdown(false);
                    onCreateNew();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-purple-400 hover:bg-purple-950/40 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Journey Map</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] hover:border-slate-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-1.5 z-50 text-xs space-y-1 animate-in fade-in border border-white/[0.12]"
              onMouseLeave={() => setShowExportMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  exportJourneyToJSON(activeJourney);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FileJson className="w-4 h-4 text-purple-400" />
                <span>Export as JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exportTouchpointsToCSV(activeJourney);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>Export Touchpoints (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exportPainPointsToCSV(activeJourney);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-rose-400" />
                <span>Export Pain Points (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exportKPIsToCSV(activeJourney);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-white/[0.06] flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export KPIs (CSV)</span>
              </button>

              <div className="pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onNavigateTab('presentation');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-purple-300 hover:bg-purple-950/40 font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-purple-400" />
                  <span>Print Presentation View</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Journey Copilot Toggle Button with Animated Shifting Glow */}
        <button
          type="button"
          onClick={onToggleCopilot}
          className="p-2 sm:px-3.5 sm:py-1.5 rounded-xl animated-gradient-active hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/35 border border-white/20 flex items-center gap-1.5 transition-all"
          title="Toggle AI Journey Copilot"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span className="hidden sm:inline">Copilot</span>
        </button>
      </div>
    </header>
  );
};
