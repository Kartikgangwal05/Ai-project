import React, { useState } from 'react';
import { Journey, PainPointItem, ActionPlanMilestone } from '../types/journey';
import {
  AlertTriangle,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Loader2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { exportPainPointsToCSV } from '../utils/journeyStore';

interface PainPointsMatrixViewProps {
  journey: Journey;
  onUpdateJourney: (updated: Journey) => void;
  isDark?: boolean;
}

export const PainPointsMatrixView: React.FC<PainPointsMatrixViewProps> = ({
  journey,
  onUpdateJourney,
  isDark = true,
}) => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointItem | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Collect all pain points across all stages
  const allPainPoints: PainPointItem[] = journey.stages.flatMap((s) => s.painPoints || []);

  const filteredPainPoints = allPainPoints.filter((pp) => {
    if (stageFilter !== 'all' && pp.stageName !== stageFilter) return false;
    if (statusFilter !== 'all' && pp.status !== statusFilter) return false;
    return true;
  });

  // Calculate coordinates for 2x2 matrix
  // X: Effort (Low = 25%, Medium = 50%, High = 75%)
  // Y: Impact (Low = 75%, Medium = 50%, High = 25%, Critical = 15%)
  const getMatrixCoords = (pp: PainPointItem, index: number) => {
    let baseX = 50;
    if (pp.effort === 'Low') baseX = 26;
    else if (pp.effort === 'Medium') baseX = 52;
    else if (pp.effort === 'High') baseX = 78;

    let baseY = 50;
    if (pp.impact === 'Critical') baseY = 16;
    else if (pp.impact === 'High') baseY = 28;
    else if (pp.impact === 'Medium') baseY = 56;
    else if (pp.impact === 'Low') baseY = 78;

    // Small jitter based on index to prevent total overlap
    const jitterX = ((index % 5) - 2) * 3;
    const jitterY = ((index % 3) - 1) * 3;

    return { x: Math.max(8, Math.min(92, baseX + jitterX)), y: Math.max(8, Math.min(92, baseY + jitterY)) };
  };

  const getQuadrant = (pp: PainPointItem) => {
    const isHighImpact = pp.impact === 'High' || pp.impact === 'Critical';
    const isLowEffort = pp.effort === 'Low' || pp.effort === 'Medium';

    if (isHighImpact && isLowEffort) return 'Quick Win';
    if (isHighImpact && !isLowEffort) return 'Strategic Project';
    if (!isHighImpact && isLowEffort) return 'Incremental Gain';
    return 'Deprioritized';
  };

  const handleUpdateStatus = (ppId: string, newStatus: 'Identified' | 'In Progress' | 'Resolved') => {
    const updatedStages = journey.stages.map((stage) => {
      const updatedPps = (stage.painPoints || []).map((p) => {
        if (p.id === ppId) {
          return { ...p, status: newStatus };
        }
        return p;
      });
      return { ...stage, painPoints: updatedPps };
    });

    const updatedJourney = { ...journey, stages: updatedStages, updatedAt: new Date().toISOString() };
    onUpdateJourney(updatedJourney);

    if (selectedPainPoint && selectedPainPoint.id === ppId) {
      setSelectedPainPoint({ ...selectedPainPoint, status: newStatus });
    }
  };

  // Generate Phased Action Plan with Gemini
  const handleGenerateActionPlan = async () => {
    setIsGeneratingPlan(true);
    setPlanError(null);
    try {
      const res = await fetch('/api/generate-action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey,
          painPoints: allPainPoints,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate action plan.');
      }

      const plan: ActionPlanMilestone[] = await res.json();
      const updatedJourney = {
        ...journey,
        actionPlan: plan,
        updatedAt: new Date().toISOString(),
      };
      onUpdateJourney(updatedJourney);
    } catch (e: any) {
      console.error(e);
      setPlanError(e.message || 'Error communicating with Gemini.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Pain Points & Impact vs. Effort Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">
            Prioritize customer friction points, map root causes, and deploy targeted AI action plans
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-slate-900 border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="all">All Stages ({allPainPoints.length})</option>
              {journey.stages.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.painPoints?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-slate-900 border-slate-700">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Identified">Identified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            onClick={() => exportPainPointsToCSV(journey)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Generate Action Plan */}
          <button
            type="button"
            disabled={isGeneratingPlan}
            onClick={handleGenerateActionPlan}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Generate AI Action Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {planError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
          {planError}
        </div>
      )}

      {/* 2x2 Impact vs Effort Interactive Matrix */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Prioritization Matrix (Impact vs. Implementation Effort)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Hover or click any node to review root causes and test proposed remedies
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Quick Wins
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span> Strategic
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span> Incremental
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-500"></span> Deprioritized
            </span>
          </div>
        </div>

        {/* Matrix Canvas Box */}
        <div className="relative w-full h-[380px] rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden select-none">
          {/* Axis Dividers */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-800/80"></div>
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-800/80"></div>

          {/* Quadrant Background Labels */}
          {/* Top-Left: Quick Wins */}
          <div className="absolute top-3 left-4 pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/60 flex items-center gap-1">
              ★ Quick Wins (High Impact, Low Effort)
            </span>
            <span className="text-[10px] text-slate-500 block">Immediate priority initiatives</span>
          </div>

          {/* Top-Right: Strategic Projects */}
          <div className="absolute top-3 right-4 text-right pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400/60">
              Strategic Projects (High Impact, High Effort)
            </span>
            <span className="text-[10px] text-slate-500 block">Transformational long-term bets</span>
          </div>

          {/* Bottom-Left: Fill-Ins */}
          <div className="absolute bottom-3 left-4 pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400/60">
              Fill-Ins / Easy Gains (Low Impact, Low Effort)
            </span>
            <span className="text-[10px] text-slate-500 block">Low cost incremental tweaks</span>
          </div>

          {/* Bottom-Right: Deprioritized */}
          <div className="absolute bottom-3 right-4 text-right pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Deprioritize (Low Impact, High Effort)
            </span>
            <span className="text-[10px] text-slate-600 block">Avoid or postpone</span>
          </div>

          {/* Axis Labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Implementation Effort →
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Customer Impact →
          </div>

          {/* Nodes for each filtered pain point */}
          {filteredPainPoints.map((pp, idx) => {
            const coords = getMatrixCoords(pp, idx);
            const quadrant = getQuadrant(pp);
            const isSelected = selectedPainPoint?.id === pp.id;

            let nodeColor = 'bg-slate-400';
            let haloColor = 'border-slate-500';
            if (quadrant === 'Quick Win') {
              nodeColor = 'bg-emerald-400';
              haloColor = 'border-emerald-400';
            } else if (quadrant === 'Strategic Project') {
              nodeColor = 'bg-purple-400';
              haloColor = 'border-purple-400';
            } else if (quadrant === 'Incremental Gain') {
              nodeColor = 'bg-cyan-400';
              haloColor = 'border-cyan-400';
            }

            return (
              <div
                key={pp.id || idx}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                onClick={() => setSelectedPainPoint(pp)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div className={`relative flex items-center justify-center transition-transform duration-200 group-hover:scale-125 ${
                  isSelected ? 'scale-125' : ''
                }`}>
                  {/* Outer pulse if critical */}
                  {pp.impact === 'Critical' && (
                    <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping"></span>
                  )}

                  {/* Node dot */}
                  <div className={`w-4 h-4 rounded-full border-2 ${haloColor} ${nodeColor} shadow-lg shadow-black/50`}></div>

                  {/* Status dot if resolved */}
                  {pp.status === 'Resolved' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900"></span>
                  )}
                </div>

                {/* Hover label */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-30 whitespace-nowrap">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-semibold text-white shadow-xl flex items-center gap-1.5">
                    <span>{pp.title}</span>
                    <span className="text-[10px] text-purple-300">({pp.stageName})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pain Point Detail Card */}
        {selectedPainPoint ? (
          <div className="mt-4 p-4 rounded-2xl bg-slate-800/40 border border-purple-500/40 animate-in fade-in space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedPainPoint.stageName}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {selectedPainPoint.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Status:</span>
                <select
                  value={selectedPainPoint.status}
                  onChange={(e) => handleUpdateStatus(selectedPainPoint.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-purple-300"
                >
                  <option value="Identified">Identified</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {selectedPainPoint.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Root Cause:</span>
                <span className="text-slate-200">{selectedPainPoint.cause}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <span className="text-emerald-400 font-semibold block mb-0.5">Proposed Solution:</span>
                <span className="text-emerald-200">{selectedPainPoint.solution}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-center text-xs text-slate-500 italic">
            Click on any circle in the matrix above to view root cause analysis and resolution status
          </div>
        )}
      </div>

      {/* AI Action Plan Roadmap */}
      {journey.actionPlan && journey.actionPlan.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>AI-Generated Implementation Action Plan</span>
              </h3>
              <p className="text-xs text-slate-400">
                Sequenced execution phases targeting highest ROI pain points
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              3 Phases Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {journey.actionPlan.map((milestone, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel-interactive flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                      {milestone.priority} Priority
                    </span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {milestone.phase}
                  </h4>
                  <p className="text-xs font-semibold text-purple-300 mb-3">
                    {milestone.title}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    {milestone.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Expected Result:</span>
                    <p className="text-emerald-300 font-semibold">{milestone.expectedOutcome}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">KPI to Watch:</span>
                    <p className="text-purple-300 font-semibold">{milestone.kpiToWatch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points Detailed List */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">
            All Documented Pain Points ({filteredPainPoints.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filteredPainPoints.map((pp) => (
            <div key={pp.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{pp.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {pp.stageName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pp.impact === 'Critical'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                      : pp.impact === 'High'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {pp.impact} Impact
                  </span>
                </div>
                <p className="text-slate-400">{pp.description}</p>
                <p className="text-emerald-300 font-medium">Fix: {pp.solution}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Effort: {pp.effort}</span>
                <select
                  value={pp.status}
                  onChange={(e) => handleUpdateStatus(pp.id, e.target.value as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    pp.status === 'Resolved'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                      : pp.status === 'In Progress'
                      ? 'bg-purple-950/40 text-purple-300 border-purple-800'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="Identified">Identified</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
