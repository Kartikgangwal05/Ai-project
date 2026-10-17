import React, { useState } from 'react';
import { Journey, KPIItem } from '../types/journey';
import {
  BarChart3,
  Download,
  Filter,
  CheckCircle,
  HelpCircle,
  Plus,
  Edit2,
  TrendingUp,
  Target,
  Clock,
  Layers,
} from 'lucide-react';
import { exportKPIsToCSV } from '../utils/journeyStore';

interface KPIDashboardViewProps {
  journey: Journey;
  onUpdateJourney: (updated: Journey) => void;
  isDark?: boolean;
}

export const KPIDashboardView: React.FC<KPIDashboardViewProps> = ({
  journey,
  onUpdateJourney,
  isDark = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingKpi, setEditingKpi] = useState<KPIItem | null>(null);
  const [actualInput, setActualInput] = useState<string>('');
  const [targetInput, setTargetInput] = useState<string>('');

  // Collect all KPIs from all stages
  const allKPIs: KPIItem[] = journey.stages.flatMap((s) => s.kpis || []);

  const categories = Array.from(new Set(allKPIs.map((k) => k.category || 'General')));

  const filteredKPIs = selectedCategory === 'all'
    ? allKPIs
    : allKPIs.filter((k) => (k.category || 'General') === selectedCategory);

  const measuredCount = allKPIs.filter((k) => k.actual !== null && k.actual.trim() !== '').length;

  const handleOpenEdit = (kpi: KPIItem) => {
    setEditingKpi(kpi);
    setActualInput(kpi.actual || '');
    setTargetInput(kpi.target || '');
  };

  const handleSaveKpiEdit = () => {
    if (!editingKpi) return;

    const updatedStages = journey.stages.map((stage) => {
      const updatedKpis = (stage.kpis || []).map((k) => {
        if (k.id === editingKpi.id) {
          return {
            ...k,
            actual: actualInput.trim() ? actualInput.trim() : null,
            target: targetInput.trim() ? targetInput.trim() : k.target,
          };
        }
        return k;
      });
      return { ...stage, kpis: updatedKpis };
    });

    onUpdateJourney({
      ...journey,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });

    setEditingKpi(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>KPI & CX Performance Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400">
            Formulas, targets, and empirical tracking across customer stages with zero fabricated figures
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-slate-900 border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="all">All Categories ({allKPIs.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            onClick={() => exportKPIsToCSV(journey)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl glass-panel-interactive relative overflow-hidden text-white group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Tracked Metrics</span>
            <div className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold group-hover:text-purple-300 transition-colors">{allKPIs.length}</div>
          <span className="text-[11px] text-purple-400 font-medium">Standardized across {journey.stages.length} journey stages</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel-interactive relative overflow-hidden text-white group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Empirical Data Logged</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{measuredCount} / {allKPIs.length}</div>
          <span className="text-[11px] text-slate-300/80">
            {measuredCount === 0 ? 'No fake data generated; awaiting company telemetry' : 'Real metrics entered by operator'}
          </span>
        </div>

        <div className="p-5 rounded-3xl glass-panel-interactive relative overflow-hidden text-white group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Primary North Star Metric</span>
            <div className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-cyan-300 truncate">
            {allKPIs[0]?.name || 'Net Promoter Score'}
          </div>
          <span className="text-[11px] text-slate-400">
            Target Benchmark: <strong className="text-cyan-400">{allKPIs[0]?.target || '70%'}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKPIs.map((kpi) => {
          const hasActual = kpi.actual !== null && kpi.actual.trim() !== '';

          return (
            <div
              key={kpi.id}
              className="p-5 rounded-3xl glass-panel-interactive flex flex-col justify-between space-y-4 text-white group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                    {kpi.stageName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{kpi.trackingFrequency}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold tracking-tight mb-1 text-white">
                  {kpi.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {kpi.definition}
                </p>

                {/* Formula pill */}
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all mb-3">
                  <span className="text-slate-500 text-[10px] block font-sans uppercase">Formula:</span>
                  {kpi.formula}
                </div>

                {/* Target vs Actual Display */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30">
                    <span className="text-slate-400 block text-[11px]">Target Benchmark:</span>
                    <span className="text-base font-bold text-purple-300">{kpi.target}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${
                    hasActual
                      ? 'bg-emerald-950/20 border-emerald-900/40'
                      : 'bg-slate-800/40 border-slate-700/50'
                  }`}>
                    <span className="text-slate-400 block text-[11px]">Actual Performance:</span>
                    {hasActual ? (
                      <span className="text-base font-bold text-emerald-300">{kpi.actual}</span>
                    ) : (
                      <span className="text-xs italic text-slate-500">No data available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{kpi.category}</span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(kpi)}
                  className="px-2.5 py-1 rounded-lg text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-600 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{hasActual ? 'Edit Actual' : 'Log Actual Data'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Actual Data Modal */}
      {editingKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white space-y-4 shadow-2xl">
            <div>
              <span className="text-xs text-purple-400 font-semibold uppercase">{editingKpi.stageName}</span>
              <h3 className="text-lg font-bold">{editingKpi.name}</h3>
              <p className="text-xs text-slate-400">{editingKpi.definition}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Benchmark:</label>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Empirical Actual Value (Leave blank if unmeasured):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4.2% or 45 days or leave blank"
                  value={actualInput}
                  onChange={(e) => setActualInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  JourneyX strictly upholds the zero-fabricated-data policy.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingKpi(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveKpiEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
              >
                Save Metric
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
