import React, { useState } from 'react';
import { Journey, TouchpointItem, FrictionLevel } from '../types/journey';
import {
  Radio,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Download,
  BarChart3,
  Check,
  X,
} from 'lucide-react';
import { exportTouchpointsToCSV } from '../utils/journeyStore';

interface TouchpointsViewProps {
  journey: Journey;
  onUpdateJourney: (updated: Journey) => void;
  isDark?: boolean;
}

export const TouchpointsView: React.FC<TouchpointsViewProps> = ({
  journey,
  onUpdateJourney,
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [frictionFilter, setFrictionFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Modal / inline add state
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetStageId, setTargetStageId] = useState<string>(journey.stages[0]?.id || '');
  const [newChannel, setNewChannel] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newExpectation, setNewExpectation] = useState('');
  const [newFriction, setNewFriction] = useState<FrictionLevel>('Low');
  const [newKPI, setNewKPI] = useState('');

  // Collect all touchpoints with stage reference
  const allTouchpoints = journey.stages.flatMap((stage) =>
    (stage.touchpoints || []).map((tp) => ({
      ...tp,
      stageId: stage.id,
      stageName: stage.name,
    }))
  );

  const filtered = allTouchpoints.filter((tp) => {
    if (stageFilter !== 'all' && tp.stageName !== stageFilter) return false;
    if (frictionFilter !== 'all' && tp.friction !== frictionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tp.channel.toLowerCase().includes(q) ||
        tp.customerAction.toLowerCase().includes(q) ||
        tp.expectation.toLowerCase().includes(q) ||
        tp.recommendedKPI.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDeleteTouchpoint = (stageId: string, tpId: string) => {
    const updatedStages = journey.stages.map((stage) => {
      if (stage.id === stageId) {
        return {
          ...stage,
          touchpoints: stage.touchpoints.filter((t) => t.id !== tpId),
        };
      }
      return stage;
    });

    onUpdateJourney({
      ...journey,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.trim() || !newAction.trim()) return;

    const newTp: TouchpointItem = {
      id: `tp-${Date.now()}`,
      channel: newChannel.trim(),
      customerAction: newAction.trim(),
      expectation: newExpectation.trim() || 'Prompt service',
      friction: newFriction,
      recommendedKPI: newKPI.trim() || 'Customer Effort Score',
    };

    const updatedStages = journey.stages.map((stage) => {
      if (stage.id === targetStageId) {
        return {
          ...stage,
          touchpoints: [...(stage.touchpoints || []), newTp],
        };
      }
      return stage;
    });

    onUpdateJourney({
      ...journey,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });

    setShowAddModal(false);
    setNewChannel('');
    setNewAction('');
    setNewExpectation('');
    setNewKPI('');
  };

  const getFrictionStyle = (f: FrictionLevel) => {
    if (f === 'High') return 'bg-rose-950/60 border-rose-800 text-rose-300';
    if (f === 'Medium') return 'bg-amber-950/60 border-amber-800 text-amber-300';
    return 'bg-emerald-950/60 border-emerald-800 text-emerald-300';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span>Omnichannel Touchpoints Directory</span>
          </h2>
          <p className="text-xs text-slate-400">
            Catalog of customer interaction points, channels, expectations, and friction levels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl animated-gradient-active text-white font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 border border-white/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Touchpoint</span>
          </button>

          <button
            type="button"
            onClick={() => exportTouchpointsToCSV(journey)}
            className="px-3.5 py-2.5 rounded-xl glass-card-subtle hover:bg-white/[0.08] text-slate-200 border border-white/[0.12] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px] flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-panel text-xs">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search channels, customer actions, or metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-panel text-xs">
          <span className="text-slate-400 font-medium">Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="all">All Stages ({allTouchpoints.length})</option>
            {journey.stages.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Friction Filter */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-panel text-xs">
          <span className="text-slate-400 font-medium">Friction:</span>
          <select
            value={frictionFilter}
            onChange={(e) => setFrictionFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="all">All Friction Levels</option>
            <option value="Low">Low Friction</option>
            <option value="Medium">Medium Friction</option>
            <option value="High">High Friction</option>
          </select>
        </div>
      </div>

      {/* Touchpoints Table / Cards */}
      <div className="rounded-3xl glass-panel overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Stage</th>
                <th className="py-3 px-4 font-semibold">Channel Medium</th>
                <th className="py-3 px-4 font-semibold">Customer Action</th>
                <th className="py-3 px-4 font-semibold">Customer Expectation</th>
                <th className="py-3 px-4 font-semibold">Friction</th>
                <th className="py-3 px-4 font-semibold">Recommended KPI</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tp) => (
                <tr key={tp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-purple-300 whitespace-nowrap">
                    {tp.stageName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                    {tp.channel}
                  </td>
                  <td className="py-3 px-4 text-slate-300 min-w-[200px]">
                    {tp.customerAction}
                  </td>
                  <td className="py-3 px-4 text-slate-400 min-w-[200px]">
                    {tp.expectation}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getFrictionStyle(tp.friction)}`}>
                      {tp.friction}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 whitespace-nowrap">
                    {tp.recommendedKPI}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDeleteTouchpoint(tp.stageId, tp.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Touchpoint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs italic">
                    No touchpoints found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Touchpoint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Add New Customer Touchpoint</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Journey Stage:</label>
                <select
                  value={targetStageId}
                  onChange={(e) => setTargetStageId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                >
                  {journey.stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Channel Medium:</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Push Notification, Physical Store Counter, Email Drip"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Customer Action:</label>
                <input
                  type="text"
                  placeholder="What does the customer do here?"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Customer Expectation:</label>
                <input
                  type="text"
                  placeholder="What is the customer expecting?"
                  value={newExpectation}
                  onChange={(e) => setNewExpectation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Friction Level:</label>
                  <select
                    value={newFriction}
                    onChange={(e) => setNewFriction(e.target.value as FrictionLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Recommended KPI:</label>
                  <input
                    type="text"
                    placeholder="e.g. Click-to-Open Rate"
                    value={newKPI}
                    onChange={(e) => setNewKPI(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/30"
                >
                  Add Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
