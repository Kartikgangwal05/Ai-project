import React, { useState } from 'react';
import { Journey } from '../types/journey';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

interface CompareJourneysViewProps {
  journeys: Journey[];
  currentJourneyId: string;
  isDark?: boolean;
}

export const CompareJourneysView: React.FC<CompareJourneysViewProps> = ({
  journeys,
  currentJourneyId,
  isDark = true,
}) => {
  const [journeyAId, setJourneyAId] = useState<string>(currentJourneyId);
  const [journeyBId, setJourneyBId] = useState<string>(
    journeys.find((j) => j.id !== currentJourneyId)?.id || journeys[0]?.id || ''
  );

  const journeyA = journeys.find((j) => j.id === journeyAId);
  const journeyB = journeys.find((j) => j.id === journeyBId);

  if (!journeyA || !journeyB) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Please ensure at least two journeys are available to compare.
      </div>
    );
  }

  const getAvgScore = (j: Journey) => {
    if (!j.stages || j.stages.length === 0) return 0;
    return (
      j.stages.reduce((acc, s) => acc + (s.emotionalScore || 5), 0) / j.stages.length
    ).toFixed(1);
  };

  const getCriticalPains = (j: Journey) => {
    return j.stages.flatMap((s) => s.painPoints || []).filter((p) => p.impact === 'Critical')
      .length;
  };

  const getTotalTouchpoints = (j: Journey) => {
    return j.stages.flatMap((s) => s.touchpoints || []).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Compare Customer Journeys</span>
        </h2>
        <p className="text-xs text-slate-400">
          Side-by-side comparative analysis of journey stages, emotional trajectories, and critical friction points
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl glass-panel text-xs space-y-2 border border-purple-500/40">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Journey A (Baseline):
          </label>
          <select
            value={journeyAId}
            onChange={(e) => setJourneyAId(e.target.value)}
            className="w-full p-2.5 rounded-xl glass-card-subtle text-purple-300 font-bold focus:outline-none border border-white/[0.1]"
          >
            {journeys.map((j) => (
              <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                {j.title} ({j.industry})
              </option>
            ))}
          </select>
        </div>

        <div className="p-5 rounded-3xl glass-panel text-xs space-y-2 border border-cyan-500/40">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Journey B (Comparison):
          </label>
          <select
            value={journeyBId}
            onChange={(e) => setJourneyBId(e.target.value)}
            className="w-full p-2.5 rounded-xl glass-card-subtle text-cyan-300 font-bold focus:outline-none border border-white/[0.1]"
          >
            {journeys.map((j) => (
              <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                {j.title} ({j.industry})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High-level KPI Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl glass-panel-interactive space-y-2">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
            Stage Count
          </span>
          <div className="flex items-baseline justify-between text-lg font-bold">
            <span className="text-purple-400">{journeyA.stages.length}</span>
            <span className="text-slate-500 text-xs font-normal">vs</span>
            <span className="text-cyan-400">{journeyB.stages.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-interactive space-y-2">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
            Avg Emotion Score
          </span>
          <div className="flex items-baseline justify-between text-lg font-bold">
            <span className="text-purple-400">{getAvgScore(journeyA)}/10</span>
            <span className="text-slate-500 text-xs font-normal">vs</span>
            <span className="text-cyan-400">{getAvgScore(journeyB)}/10</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-interactive space-y-2">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
            Total Touchpoints
          </span>
          <div className="flex items-baseline justify-between text-lg font-bold">
            <span className="text-purple-400">{getTotalTouchpoints(journeyA)}</span>
            <span className="text-slate-500 text-xs font-normal">vs</span>
            <span className="text-cyan-400">{getTotalTouchpoints(journeyB)}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel-interactive space-y-2">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
            Critical Pain Points
          </span>
          <div className="flex items-baseline justify-between text-lg font-bold">
            <span className="text-rose-400">{getCriticalPains(journeyA)}</span>
            <span className="text-slate-500 text-xs font-normal">vs</span>
            <span className="text-rose-400">{getCriticalPains(journeyB)}</span>
          </div>
        </div>
      </div>

      {/* Side-by-side Persona Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journey A Card */}
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-purple-500/40 space-y-4 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Baseline Journey
              </span>
              <h3 className="text-base font-bold text-white">{journeyA.productName}</h3>
              <p className="text-slate-400">{journeyA.industry} • {journeyA.businessModel}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-600/25 border border-purple-500/30 text-purple-300 font-bold text-base flex items-center justify-center">
              A
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-purple-300">Target Persona:</span>
            <div className="p-3 rounded-xl glass-card-subtle">
              <span className="font-bold text-white block">{journeyA.persona?.name} ({journeyA.persona?.archetype})</span>
              <p className="italic text-slate-300 mt-1">"{journeyA.persona?.quote}"</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-300">Stage Sentiment Breakdown:</span>
            <div className="space-y-1.5">
              {journeyA.stages.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="font-bold text-purple-300">{s.emotionalScore}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey B Card */}
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-cyan-500/40 space-y-4 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Comparison Journey
              </span>
              <h3 className="text-base font-bold text-white">{journeyB.productName}</h3>
              <p className="text-slate-400">{journeyB.industry} • {journeyB.businessModel}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/25 border border-cyan-500/30 text-cyan-300 font-bold text-base flex items-center justify-center">
              B
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-cyan-300">Target Persona:</span>
            <div className="p-3 rounded-xl glass-card-subtle">
              <span className="font-bold text-white block">{journeyB.persona?.name} ({journeyB.persona?.archetype})</span>
              <p className="italic text-slate-300 mt-1">"{journeyB.persona?.quote}"</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-300">Stage Sentiment Breakdown:</span>
            <div className="space-y-1.5">
              {journeyB.stages.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="font-bold text-cyan-300">{s.emotionalScore}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
