import React from 'react';
import { Journey } from '../types/journey';
import { SAMPLE_TEMPLATES_SUMMARY } from '../data/sampleJourneys';
import { EmotionCurveChart } from './EmotionCurveChart';
import { TimelineMap } from './TimelineMap';
import { AISearchBar } from './AISearchBar';
import {
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  Lightbulb,
  ShoppingBag,
  Car,
  Package,
  Utensils,
  CreditCard,
  GraduationCap,
  Store,
  Layers,
  ChevronRight,
  Clock,
  Trash2,
  Copy,
  Edit2,
  Compass,
} from 'lucide-react';

interface DashboardViewProps {
  activeJourney: Journey;
  allJourneys: Journey[];
  onSelectJourney: (id: string) => void;
  onCreateNew: () => void;
  onOpenStageModal: (stage: any) => void;
  onDeleteJourney: (id: string) => void;
  onDuplicateJourney: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onJourneyLoaded: (journey: Journey) => void;
  isDark?: boolean;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
  Car: <Car className="w-5 h-5 text-blue-400" />,
  Package: <Package className="w-5 h-5 text-amber-400" />,
  Utensils: <Utensils className="w-5 h-5 text-rose-400" />,
  CreditCard: <CreditCard className="w-5 h-5 text-purple-400" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-cyan-400" />,
  Store: <Store className="w-5 h-5 text-pink-400" />,
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeJourney,
  allJourneys,
  onSelectJourney,
  onCreateNew,
  onOpenStageModal,
  onDeleteJourney,
  onDuplicateJourney,
  onNavigateTab,
  onJourneyLoaded,
  isDark = true,
}) => {
  // Aggregate real-time statistics
  const totalJourneysCount = allJourneys.length;
  const totalTouchpointsCount = allJourneys.reduce(
    (acc, j) => acc + (j.stages || []).flatMap((s) => s.touchpoints || []).length,
    0
  );
  const totalPainPointsCount = allJourneys.reduce(
    (acc, j) => acc + (j.stages || []).flatMap((s) => s.painPoints || []).length,
    0
  );
  const totalOpportunitiesCount = allJourneys.reduce(
    (acc, j) => acc + (j.stages || []).flatMap((s) => s.opportunities || []).length,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Hero Welcome Banner with Instant AI Product Search */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#040818] via-[#09102c]/90 to-[#020512] border border-purple-500/35 shadow-2xl shadow-purple-950/40">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-cyan-500/18 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-3/4 w-[300px] h-[300px] bg-pink-500/12 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/[0.06] text-purple-300 border border-purple-400/40 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="bg-gradient-to-r from-purple-300 via-cyan-300 to-white bg-clip-text text-transparent">
                  Instant AI Search • Full End-to-End Journey Mapper
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Search Any Product. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Map Every Moment from Start to End.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl">
                Enter any brand, product, or service below. JourneyX will instantly formulate the complete customer lifecycle—from initial discovery, touchpoints, and emotions to friction points, opportunities, and ROI metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onCreateNew}
                className="px-5 py-3.5 rounded-2xl animated-gradient-active hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-600/35 border border-white/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Custom Map Builder</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('upload')}
                className="px-4 py-3.5 rounded-2xl glass-card-subtle hover:bg-white/[0.1] text-slate-200 border border-white/[0.14] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:border-cyan-400/50"
              >
                <span>Upload Document</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Prominent Instant AI Search Bar */}
          <div className="pt-2">
            <AISearchBar
              variant="hero"
              onJourneyLoaded={onJourneyLoaded}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards with Neon Highlights & Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Journeys */}
        <div className={`p-5 rounded-3xl glass-panel-interactive relative overflow-hidden transition-all group ${
          isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-transparent"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Journeys</span>
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
            {totalJourneysCount}
          </div>
          <p className="text-[11px] text-purple-400 mt-1 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Active in workspace
          </p>
        </div>

        {/* Total Touchpoints */}
        <div className={`p-5 rounded-3xl glass-panel-interactive relative overflow-hidden transition-all group ${
          isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Touchpoints Mapped</span>
            <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
            {totalTouchpointsCount}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Across {activeJourney.stages.length} live stages
          </p>
        </div>

        {/* Pain Points */}
        <div className={`p-5 rounded-3xl glass-panel-interactive relative overflow-hidden transition-all group ${
          isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-transparent"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pain Points Identified</span>
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 group-hover:text-rose-300 transition-colors">
            {totalPainPointsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Prioritized by impact & effort
          </p>
        </div>

        {/* Opportunities */}
        <div className={`p-5 rounded-3xl glass-panel-interactive relative overflow-hidden transition-all group ${
          isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Growth Opportunities</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {totalOpportunitiesCount}
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1 font-medium">
            Action plans formulated
          </p>
        </div>
      </div>

      {/* Active Journey Live Inspection Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ACTIVE MAP
              </span>
              <h2 className="text-xl font-bold text-white">
                {activeJourney.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <strong className="text-slate-200">{activeJourney.customerType}</strong> • {activeJourney.industry} ({activeJourney.businessModel})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('personas')}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              View Persona
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('matrix')}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Impact Matrix
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('kpis')}
              className="px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-900/20 hover:bg-purple-900/40 text-xs font-semibold text-purple-300 transition-colors"
            >
              KPI Dashboard
            </button>
          </div>
        </div>

        {/* Emotion Curve Chart Component */}
        <EmotionCurveChart
          stages={activeJourney.stages}
          onSelectStage={(s) => onOpenStageModal(s)}
          isDark={isDark}
        />

        {/* Timeline Horizontal Map */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Stage-by-Stage Journey Flow</span>
              <span className="text-xs text-slate-400 font-normal">
                ({activeJourney.stages.length} milestones)
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              Click any stage card to edit touchpoints or regenerate with AI
            </span>
          </div>

          <TimelineMap
            stages={activeJourney.stages}
            onSelectStage={(s) => onOpenStageModal(s)}
            onAddStage={() => {
              const newStage = {
                id: `stage-${Date.now()}`,
                name: 'New Custom Stage',
                description: 'Custom milestone interaction',
                customerActions: ['Performs stage milestone'],
                touchpoints: [],
                customerThoughts: ['"I wonder what comes next"'],
                customerExpectations: ['Fast resolution'],
                emotionalScore: 7,
                emotionalState: 'Curious',
                painPoints: [],
                opportunities: [],
                kpis: [],
              };
              onOpenStageModal(newStage);
            }}
            onDeleteStage={(stageId) => {
              // Delete stage
              const updated = {
                ...activeJourney,
                stages: activeJourney.stages.filter((s) => s.id !== stageId),
                updatedAt: new Date().toISOString(),
              };
              // Updated through parent
            }}
            onRegenerateStage={(s) => onOpenStageModal(s)}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Interactive Sample Industry Templates */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Interactive Industry Templates</span>
            </h3>
            <p className="text-xs text-slate-400">
              One-click exploration templates tailored for specific business models and consumer psychology
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SAMPLE_TEMPLATES_SUMMARY.map((tpl) => {
            const isActive = activeJourney.id === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => onSelectJourney(tpl.id)}
                className={`p-5 rounded-3xl glass-panel-interactive cursor-pointer group flex flex-col justify-between space-y-3 relative overflow-hidden transition-all ${
                  isActive
                    ? 'animated-gradient-border border-purple-500/80 bg-purple-950/30 ring-1 ring-purple-500/50 shadow-xl shadow-purple-600/20'
                    : 'hover:border-purple-500/40'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none"></div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {TEMPLATE_ICONS[tpl.icon] || <Layers className="w-5 h-5 text-purple-400" />}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                      {tpl.industry}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {tpl.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-cyan-400">{tpl.businessModel} Model</span>
                  <span className="font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Journeys Directory List */}
      <div className={`p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden transition-all ${
        isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>My Workspace Journeys ({allJourneys.length})</span>
          </h3>
          <button
            type="button"
            onClick={onCreateNew}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Map
          </button>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {allJourneys.map((j) => {
            const isActive = j.id === activeJourney.id;

            return (
              <div
                key={j.id}
                className={`py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all ${
                  isActive ? 'bg-purple-950/20 px-3 rounded-2xl border border-purple-500/20 my-1' : 'hover:bg-white/[0.02] px-2 rounded-xl'
                }`}
              >
                <div
                  className="space-y-0.5 cursor-pointer flex-1"
                  onClick={() => onSelectJourney(j.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm hover:text-cyan-300 transition-colors">
                      {j.title}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold animated-gradient-active text-white border border-white/20 shadow-sm">
                        Active
                      </span>
                    )}
                    {j.isSample && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/[0.06] text-slate-400 font-mono border border-white/[0.05]">
                        Preset
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {j.productName} • {j.industry} ({j.businessModel}) • {j.stages.length} stages • Target: <span className="text-slate-300">{j.customerType}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectJourney(j.id)}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-white/[0.06] hover:bg-purple-600 text-purple-300 hover:text-white border border-white/[0.08] hover:border-purple-500 transition-all shadow-sm"
                  >
                    Load Map
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateJourney(j.id)}
                    title="Duplicate Journey"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {allJourneys.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteJourney(j.id)}
                      title="Delete Journey"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
