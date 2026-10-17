import React, { useState } from 'react';
import {
  JourneyStage,
  TouchpointItem,
  PainPointItem,
  OpportunityItem,
  KPIItem,
  FrictionLevel,
  ImpactLevel,
  EffortLevel,
} from '../types/journey';
import {
  X,
  Sparkles,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
  Radio,
  BarChart3,
  Smile,
  Meh,
  Frown,
  Loader2,
  Check,
} from 'lucide-react';

interface StageDetailModalProps {
  stage: JourneyStage;
  journeyContext: { productName: string; industry: string; businessModel: string };
  onClose: () => void;
  onSave: (updatedStage: JourneyStage) => void;
  isDark?: boolean;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stage,
  journeyContext,
  onClose,
  onSave,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'touchpoints' | 'pains' | 'opps' | 'kpis'>('overview');
  const [editedStage, setEditedStage] = useState<JourneyStage>({ ...stage });

  // AI Regenerate input state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New item states
  const [newAction, setNewAction] = useState('');
  const [newThought, setNewThought] = useState('');

  const handleScoreChange = (score: number) => {
    setEditedStage((prev) => ({ ...prev, emotionalScore: score }));
  };

  const handleAddAction = () => {
    if (!newAction.trim()) return;
    setEditedStage((prev) => ({
      ...prev,
      customerActions: [...(prev.customerActions || []), newAction.trim()],
    }));
    setNewAction('');
  };

  const handleRemoveAction = (index: number) => {
    setEditedStage((prev) => ({
      ...prev,
      customerActions: prev.customerActions.filter((_, i) => i !== index),
    }));
  };

  const handleAddThought = () => {
    if (!newThought.trim()) return;
    setEditedStage((prev) => ({
      ...prev,
      customerThoughts: [...(prev.customerThoughts || []), newThought.trim()],
    }));
    setNewThought('');
  };

  const handleRemoveThought = (index: number) => {
    setEditedStage((prev) => ({
      ...prev,
      customerThoughts: prev.customerThoughts.filter((_, i) => i !== index),
    }));
  };

  // Add Touchpoint
  const handleAddTouchpoint = () => {
    const newTp: TouchpointItem = {
      id: `tp-${Date.now()}`,
      channel: 'Mobile App / Portal',
      customerAction: 'Interacts with new feature',
      expectation: 'Frictionless and fast response',
      friction: 'Low',
      recommendedKPI: 'Task Completion Rate',
    };
    setEditedStage((prev) => ({
      ...prev,
      touchpoints: [...(prev.touchpoints || []), newTp],
    }));
  };

  const handleUpdateTouchpoint = (idx: number, updates: Partial<TouchpointItem>) => {
    setEditedStage((prev) => {
      const updated = [...prev.touchpoints];
      updated[idx] = { ...updated[idx], ...updates };
      return { ...prev, touchpoints: updated };
    });
  };

  const handleRemoveTouchpoint = (idx: number) => {
    setEditedStage((prev) => ({
      ...prev,
      touchpoints: prev.touchpoints.filter((_, i) => i !== idx),
    }));
  };

  // Add Pain Point
  const handleAddPainPoint = () => {
    const newPp: PainPointItem = {
      id: `pp-${Date.now()}`,
      title: 'New Identified Friction',
      stageId: editedStage.id,
      stageName: editedStage.name,
      description: 'Customer experiences delays or ambiguity.',
      cause: 'Unclear UI or missing documentation.',
      impact: 'Medium',
      effort: 'Low',
      solution: 'Streamline interface and add explanatory tooltip.',
      status: 'Identified',
    };
    setEditedStage((prev) => ({
      ...prev,
      painPoints: [...(prev.painPoints || []), newPp],
    }));
  };

  const handleUpdatePainPoint = (idx: number, updates: Partial<PainPointItem>) => {
    setEditedStage((prev) => {
      const updated = [...prev.painPoints];
      updated[idx] = { ...updated[idx], ...updates };
      return { ...prev, painPoints: updated };
    });
  };

  const handleRemovePainPoint = (idx: number) => {
    setEditedStage((prev) => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== idx),
    }));
  };

  // Add Opportunity
  const handleAddOpportunity = () => {
    const newOpp: OpportunityItem = {
      id: `opp-${Date.now()}`,
      title: 'Proactive Customer Engagement',
      stageId: editedStage.id,
      stageName: editedStage.name,
      description: 'Provide anticipatory assistance before friction occurs.',
      expectedImpact: '+15% CSAT lift',
      actionableSteps: ['Configure behavioral trigger', 'Test with pilot cohort'],
    };
    setEditedStage((prev) => ({
      ...prev,
      opportunities: [...(prev.opportunities || []), newOpp],
    }));
  };

  const handleRemoveOpportunity = (idx: number) => {
    setEditedStage((prev) => ({
      ...prev,
      opportunities: prev.opportunities.filter((_, i) => i !== idx),
    }));
  };

  // Add KPI
  const handleAddKPI = () => {
    const newKpi: KPIItem = {
      id: `kpi-${Date.now()}`,
      name: 'Stage Conversion Rate',
      stageName: editedStage.name,
      category: 'Conversion',
      formula: '(Advancing Users / Total Stage Users) * 100',
      definition: 'Percentage of users who complete stage actions and advance.',
      target: '> 60%',
      actual: null,
      trackingFrequency: 'Weekly',
      unit: '%',
    };
    setEditedStage((prev) => ({
      ...prev,
      kpis: [...(prev.kpis || []), newKpi],
    }));
  };

  const handleUpdateKPI = (idx: number, updates: Partial<KPIItem>) => {
    setEditedStage((prev) => {
      const updated = [...prev.kpis];
      updated[idx] = { ...updated[idx], ...updates };
      return { ...prev, kpis: updated };
    });
  };

  const handleRemoveKPI = (idx: number) => {
    setEditedStage((prev) => ({
      ...prev,
      kpis: prev.kpis.filter((_, i) => i !== idx),
    }));
  };

  // AI REGENERATE STAGE
  const handleRegenerateWithAI = async () => {
    setIsRegenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/regenerate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyContext,
          stage: editedStage,
          userModification: aiPrompt.trim() || 'Deepen psychological insights, realistic friction, and actionable touchpoints.',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to regenerate stage.');
      }

      const updated = await res.json();
      setEditedStage(updated);
      setAiPrompt('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e: any) {
      console.error(e);
      setAiError(e.message || 'Error communicating with Gemini AI.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    onSave(editedStage);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border shadow-2xl overflow-hidden ${
          isDark
            ? 'border-white/[0.12] text-white shadow-black/90'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 to-transparent">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-purple-600/25 text-cyan-300 border border-purple-500/40 flex items-center justify-center font-bold text-sm shadow-inner">
              #{stage.id.replace('stage-', '')}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedStage.name}
                  onChange={(e) => setEditedStage({ ...editedStage, name: e.target.value })}
                  className="text-xl font-bold bg-transparent border-b border-transparent hover:border-purple-500/50 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-slate-400">
                {journeyContext.productName} • {journeyContext.industry}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold animated-gradient-active text-white shadow-lg shadow-purple-600/30 border border-white/20 flex items-center gap-1.5 transition-all"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Quick Enhancer Banner */}
        <div className="px-6 py-3 bg-purple-950/30 border-b border-purple-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-300 w-full sm:w-auto">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <input
              type="text"
              placeholder="Prompt Gemini: e.g. 'Add mobile checkout friction and realistic return concerns'..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 sm:w-96 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-purple-800/60 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            disabled={isRegenerating}
            onClick={handleRegenerateWithAI}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Regenerating with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Stage with AI</span>
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div className="px-6 py-2 bg-rose-950/40 text-rose-300 text-xs border-b border-rose-900/50">
            {aiError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800/80 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Emotion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('touchpoints')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'touchpoints'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Touchpoints</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {editedStage.touchpoints?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pains')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'pains'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Pain Points</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[10px]">
              {editedStage.painPoints?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('opps')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'opps'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Opportunities</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {editedStage.opportunities?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kpis')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'kpis'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Stage KPIs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {editedStage.kpis?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & EMOTION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stage Narrative & Description
                </label>
                <textarea
                  rows={2}
                  value={editedStage.description}
                  onChange={(e) => setEditedStage({ ...editedStage, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Emotional Score Slider & State */}
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <span>Emotional Sentiment Score</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400">
                        {editedStage.emotionalScore} / 10
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Scale from 1 (Frustrated/Abandonment Risk) to 10 (Delighted/Advocate)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedStage.emotionalState}
                      onChange={(e) => setEditedStage({ ...editedStage, emotionalState: e.target.value })}
                      placeholder="e.g. Curious & Cautious"
                      className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-purple-300 font-medium focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={editedStage.emotionalScore}
                    onChange={(e) => handleScoreChange(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span className="text-rose-400 flex items-center gap-1"><Frown className="w-3.5 h-3.5" /> 1-3 Frustration</span>
                    <span className="text-amber-400 flex items-center gap-1"><Meh className="w-3.5 h-3.5" /> 4-6 Neutral</span>
                    <span className="text-emerald-400 flex items-center gap-1"><Smile className="w-3.5 h-3.5" /> 7-10 Delight</span>
                  </div>
                </div>
              </div>

              {/* Customer Actions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    Customer Actions at this Stage
                  </label>
                </div>

                <div className="space-y-2">
                  {editedStage.customerActions?.map((act, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                      <input
                        type="text"
                        value={act}
                        onChange={(e) => {
                          const updated = [...editedStage.customerActions];
                          updated[i] = e.target.value;
                          setEditedStage({ ...editedStage, customerActions: updated });
                        }}
                        className="flex-1 bg-transparent border-none focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(i)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add customer action..."
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                      className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Thoughts & Self-Talk */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Internal Customer Self-Talk / Direct Quotes
                </label>

                <div className="space-y-2">
                  {editedStage.customerThoughts?.map((th, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs italic text-purple-200">
                      <span>“</span>
                      <input
                        type="text"
                        value={th.replace(/^"|"$/g, '')}
                        onChange={(e) => {
                          const updated = [...editedStage.customerThoughts];
                          updated[i] = `"${e.target.value}"`;
                          setEditedStage({ ...editedStage, customerThoughts: updated });
                        }}
                        className="flex-1 bg-transparent border-none focus:outline-none not-italic font-medium"
                      />
                      <span>”</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveThought(i)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add verbatim internal quote..."
                      value={newThought}
                      onChange={(e) => setNewThought(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
                      className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-xs focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddThought}
                      className="px-3 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOUCHPOINTS */}
          {activeTab === 'touchpoints' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Touchpoints & Channels</h4>
                  <p className="text-xs text-slate-400">Customer contact moments, channel medium, and expectations</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTouchpoint}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Touchpoint
                </button>
              </div>

              <div className="space-y-3">
                {editedStage.touchpoints?.map((tp, idx) => (
                  <div key={tp.id || idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Channel:</span>
                        <input
                          type="text"
                          value={tp.channel}
                          onChange={(e) => handleUpdateTouchpoint(idx, { channel: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Friction:</span>
                        <select
                          value={tp.friction}
                          onChange={(e) => handleUpdateTouchpoint(idx, { friction: e.target.value as FrictionLevel })}
                          className={`text-xs px-2 py-1 rounded-lg border font-semibold focus:outline-none ${
                            tp.friction === 'High'
                              ? 'bg-rose-950 border-rose-800 text-rose-300'
                              : tp.friction === 'Medium'
                              ? 'bg-amber-950 border-amber-800 text-amber-300'
                              : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                          }`}
                        >
                          <option value="Low">Low Friction</option>
                          <option value="Medium">Medium Friction</option>
                          <option value="High">High Friction</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveTouchpoint(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Customer Action:</span>
                        <input
                          type="text"
                          value={tp.customerAction}
                          onChange={(e) => handleUpdateTouchpoint(idx, { customerAction: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Customer Expectation:</span>
                        <input
                          type="text"
                          value={tp.expectation}
                          onChange={(e) => handleUpdateTouchpoint(idx, { expectation: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs text-slate-400">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Recommended KPI:</span>
                      <input
                        type="text"
                        value={tp.recommendedKPI}
                        onChange={(e) => handleUpdateTouchpoint(idx, { recommendedKPI: e.target.value })}
                        className="flex-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAIN POINTS */}
          {activeTab === 'pains' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Stage Pain Points & Obstacles</h4>
                  <p className="text-xs text-slate-400">Root causes, impact levels, and recommended solutions</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPainPoint}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Pain Point
                </button>
              </div>

              <div className="space-y-4">
                {editedStage.painPoints?.map((pp, idx) => (
                  <div key={pp.id || idx} className="p-4 rounded-2xl bg-rose-950/15 border border-rose-900/30 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={pp.title}
                          onChange={(e) => handleUpdatePainPoint(idx, { title: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-rose-200 focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={pp.impact}
                          onChange={(e) => handleUpdatePainPoint(idx, { impact: e.target.value as ImpactLevel })}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 font-semibold text-rose-300"
                        >
                          <option value="Critical">Critical Impact</option>
                          <option value="High">High Impact</option>
                          <option value="Medium">Medium Impact</option>
                          <option value="Low">Low Impact</option>
                        </select>

                        <select
                          value={pp.effort}
                          onChange={(e) => handleUpdatePainPoint(idx, { effort: e.target.value as EffortLevel })}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 font-semibold text-slate-300"
                        >
                          <option value="Low">Low Effort</option>
                          <option value="Medium">Medium Effort</option>
                          <option value="High">High Effort</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemovePainPoint(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400">Description:</span>
                        <textarea
                          rows={2}
                          value={pp.description}
                          onChange={(e) => handleUpdatePainPoint(idx, { description: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-slate-400">Possible Cause:</span>
                          <input
                            type="text"
                            value={pp.cause}
                            onChange={(e) => handleUpdatePainPoint(idx, { cause: e.target.value })}
                            className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-400"
                          />
                        </div>
                        <div>
                          <span className="text-emerald-400 font-medium">Proposed Solution:</span>
                          <input
                            type="text"
                            value={pp.solution}
                            onChange={(e) => handleUpdatePainPoint(idx, { solution: e.target.value })}
                            className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-200 focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OPPORTUNITIES */}
          {activeTab === 'opps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Improvement Opportunities</h4>
                  <p className="text-xs text-slate-400">Value creation, expected ROI, and tactical implementation</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOpportunity}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Opportunity
                </button>
              </div>

              <div className="space-y-3">
                {editedStage.opportunities?.map((opp, idx) => (
                  <div key={opp.id || idx} className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={opp.title}
                          onChange={(e) => {
                            const updated = [...editedStage.opportunities];
                            updated[idx] = { ...opp, title: e.target.value };
                            setEditedStage({ ...editedStage, opportunities: updated });
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-purple-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                          {opp.expectedImpact}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOpportunity(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs space-y-2">
                      <textarea
                        rows={2}
                        value={opp.description}
                        onChange={(e) => {
                          const updated = [...editedStage.opportunities];
                          updated[idx] = { ...opp, description: e.target.value };
                          setEditedStage({ ...editedStage, opportunities: updated });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-purple-400"
                      />

                      {opp.actionableSteps && opp.actionableSteps.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-slate-400 text-[11px] font-semibold uppercase">Actionable Steps:</span>
                          {opp.actionableSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Stage KPIs & Performance Metrics</h4>
                  <p className="text-xs text-slate-400">Measurement formulas, target benchmarks, and tracking frequencies</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddKPI}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Metric
                </button>
              </div>

              <div className="space-y-3">
                {editedStage.kpis?.map((kpi, idx) => (
                  <div key={kpi.id || idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={kpi.name}
                          onChange={(e) => handleUpdateKPI(idx, { name: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Target:</span>
                        <input
                          type="text"
                          value={kpi.target}
                          onChange={(e) => handleUpdateKPI(idx, { target: e.target.value })}
                          className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-purple-300 font-bold text-center focus:outline-none focus:border-purple-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveKPI(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400">Formula:</span>
                        <input
                          type="text"
                          value={kpi.formula}
                          onChange={(e) => handleUpdateKPI(idx, { formula: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400">Definition:</span>
                        <input
                          type="text"
                          value={kpi.definition}
                          onChange={(e) => handleUpdateKPI(idx, { definition: e.target.value })}
                          className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>Actual Performance:</span>
                        <input
                          type="text"
                          placeholder="No data available"
                          value={kpi.actual || ''}
                          onChange={(e) => handleUpdateKPI(idx, { actual: e.target.value || null })}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span>Frequency:</span>
                        <select
                          value={kpi.trackingFrequency}
                          onChange={(e) => handleUpdateKPI(idx, { trackingFrequency: e.target.value as any })}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>All edits are automatically saved to your active journey.</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-md shadow-purple-600/30"
            >
              Save Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
