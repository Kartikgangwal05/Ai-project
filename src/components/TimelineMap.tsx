import React from 'react';
import { JourneyStage, FrictionLevel } from '../types/journey';
import {
  Sparkles,
  ArrowRight,
  Plus,
  AlertTriangle,
  Lightbulb,
  Radio,
  BarChart3,
  Edit3,
  Trash2,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Flag,
} from 'lucide-react';

interface TimelineMapProps {
  stages: JourneyStage[];
  onSelectStage: (stage: JourneyStage) => void;
  onAddStage: () => void;
  onDeleteStage: (stageId: string) => void;
  onRegenerateStage: (stage: JourneyStage) => void;
  isDark?: boolean;
}

export const TimelineMap: React.FC<TimelineMapProps> = ({
  stages,
  onSelectStage,
  onAddStage,
  onDeleteStage,
  onRegenerateStage,
  isDark = true,
}) => {
  const getFrictionBadge = (friction: FrictionLevel) => {
    switch (friction) {
      case 'High':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getEmotionDetails = (score: number) => {
    if (score >= 8) {
      return {
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        icon: <Smile className="w-3.5 h-3.5 text-emerald-400" />,
      };
    }
    if (score >= 5) {
      return {
        bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        icon: <Meh className="w-3.5 h-3.5 text-purple-400" />,
      };
    }
    return {
      bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: <Frown className="w-3.5 h-3.5 text-rose-400" />,
    };
  };

  return (
    <div className="w-full space-y-4">
      {/* Journey Full Flow Guide Indicator */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>End-to-End Customer Life Cycle:</span>
          <span className="text-cyan-400 font-mono">Stage 1 (Initial Awareness)</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <span className="text-purple-400 font-mono">Stage {stages.length} (Advocacy & Retention)</span>
        </div>
        <span className="text-slate-400 hidden sm:inline text-[11px]">
          Hover or click any stage card for granular touchpoint inspection
        </span>
      </div>

      {/* Stage Cards Horizontal Scroll / Grid */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 overflow-x-auto pb-5 pt-1">
        {stages.map((stage, idx) => {
          const emotion = getEmotionDetails(stage.emotionalScore);
          const hasCriticalPain = stage.painPoints?.some((p) => p.impact === 'Critical');
          const isFirstStage = idx === 0;
          const isLastStage = idx === stages.length - 1;

          return (
            <div
              key={stage.id || idx}
              className={`flex-1 min-w-[280px] lg:min-w-[270px] max-w-full lg:max-w-[320px] rounded-3xl glass-panel-interactive transition-all duration-300 group relative flex flex-col justify-between overflow-hidden ${
                isFirstStage
                  ? 'border-cyan-500/50 shadow-cyan-950/40 shadow-xl'
                  : isLastStage
                  ? 'border-purple-500/50 shadow-purple-950/40 shadow-xl'
                  : 'hover:border-purple-500/50'
              }`}
            >
              {/* Top Neon Accent Line */}
              <div
                className={`h-1.5 w-full ${
                  isFirstStage
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    : isLastStage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-cyan-500/60'
                }`}
              ></div>

              {/* Card Header */}
              <div className="p-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full font-bold uppercase bg-white/[0.08] text-purple-300 border border-white/[0.12]">
                      Stage 0{idx + 1}
                    </span>
                    {isFirstStage && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1">
                        <Flag className="w-2.5 h-2.5" /> Start
                      </span>
                    )}
                    {isLastStage && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Destination
                      </span>
                    )}
                  </div>

                  {/* Emotional state badge */}
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-semibold backdrop-blur-md shadow-sm ${emotion.bg}`}
                  >
                    {emotion.icon}
                    <span className="font-bold">{stage.emotionalScore}/10</span>
                  </span>
                </div>

                <h4 className="text-base font-bold tracking-tight mb-1 text-white group-hover:text-cyan-300 transition-colors">
                  {stage.name}
                </h4>
                <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Card Body Metrics & Highlights */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {/* Customer Actions summary */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400" />
                    Key Actions ({stage.customerActions?.length || 0})
                  </span>
                  <div className="text-xs text-slate-300 space-y-1">
                    {stage.customerActions?.slice(0, 2).map((action, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
                        <span className="line-clamp-1">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Touchpoints Preview */}
                {stage.touchpoints && stage.touchpoints.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Top Channels
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stage.touchpoints.slice(0, 2).map((tp, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border truncate max-w-[130px] font-medium ${getFrictionBadge(
                            tp.friction
                          )}`}
                          title={`${tp.channel} (${tp.friction} friction)`}
                        >
                          {tp.channel}
                        </span>
                      ))}
                      {stage.touchpoints.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white/[0.08] text-slate-300 border border-white/[0.1]">
                          +{stage.touchpoints.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pain Points & Opportunities Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.08] text-xs">
                  <div
                    className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                      hasCriticalPain
                        ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 ${hasCriticalPain ? 'text-rose-400' : 'text-amber-400'}`} />
                    <div className="leading-tight">
                      <div className="font-bold text-white">{stage.painPoints?.length || 0}</div>
                      <div className="text-[10px] text-slate-400">Pains</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl border bg-white/[0.04] border-white/[0.08] text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                    <div className="leading-tight">
                      <div className="font-bold text-white">{stage.opportunities?.length || 0}</div>
                      <div className="text-[10px] text-slate-400">Opps</div>
                    </div>
                  </div>
                </div>

                {/* Primary Stage KPI */}
                {stage.kpis && stage.kpis.length > 0 && (
                  <div className="p-2 rounded-xl text-[11px] border bg-purple-950/20 border-purple-800/30 text-purple-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <BarChart3 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{stage.kpis[0].name}</span>
                    </div>
                    <span className="font-semibold text-cyan-300 ml-1 flex-shrink-0">
                      {stage.kpis[0].target}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-black/25 border-t border-white/[0.08] flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectStage(stage)}
                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold animated-gradient-active text-white border border-white/20 shadow-sm flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRegenerateStage(stage)}
                  title="Regenerate stage with AI"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                {stages.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onDeleteStage(stage.id)}
                    title="Delete stage"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Flow Connector Arrow between stages on desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#081028] border border-cyan-400/40 items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Stage Card */}
        <div className="min-w-[200px] flex items-center justify-center">
          <button
            type="button"
            onClick={onAddStage}
            className="w-full h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/[0.15] hover:border-purple-500/60 bg-white/[0.02] hover:bg-purple-950/20 text-slate-400 hover:text-purple-300 flex flex-col items-center justify-center gap-2 p-6 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Add Custom Stage
            </span>
            <span className="text-xs text-slate-400 text-center max-w-[140px]">
              Insert milestone or generate with Gemini AI
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
