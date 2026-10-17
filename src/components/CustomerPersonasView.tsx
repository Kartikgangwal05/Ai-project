import React, { useState } from 'react';
import { Journey, CustomerPersona } from '../types/journey';
import {
  User,
  Quote,
  Target,
  Sparkles,
  Zap,
  Frown,
  CheckCircle2,
  Edit2,
  Save,
  Radio,
  Layers,
} from 'lucide-react';

interface CustomerPersonasViewProps {
  journey: Journey;
  onUpdateJourney: (updated: Journey) => void;
  isDark?: boolean;
}

export const CustomerPersonasView: React.FC<CustomerPersonasViewProps> = ({
  journey,
  onUpdateJourney,
  isDark = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [persona, setPersona] = useState<CustomerPersona>({ ...journey.persona });

  const handleSave = () => {
    onUpdateJourney({
      ...journey,
      persona,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <span>Customer Persona Profile</span>
          </h2>
          <p className="text-xs text-slate-400">
            Psychographic drivers, decision triggers, and behavioral expectations for {journey.customerType}
          </p>
        </div>

        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-colors"
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Persona</span>
            </>
          )}
        </button>
      </div>

      {/* Main Persona Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar representation */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[3px] shadow-xl">
              <div className="w-full h-full rounded-[21px] bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-3xl">
                {persona.name.charAt(0)}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {persona.archetype}
            </span>
          </div>

          {/* Details & Quote */}
          <div className="flex-1 space-y-4">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={persona.name}
                  onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                  className="text-2xl font-bold bg-slate-800 px-3 py-1 rounded-xl text-white w-full max-w-sm mb-1"
                />
              ) : (
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1">
                  {persona.name}
                </h3>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={persona.tagline}
                  onChange={(e) => setPersona({ ...persona, tagline: e.target.value })}
                  className="text-xs text-purple-300 bg-slate-800 px-3 py-1 rounded-lg w-full max-w-md"
                />
              ) : (
                <p className="text-sm text-purple-300 font-medium">
                  {persona.tagline}
                </p>
              )}
            </div>

            {/* Verbatim Quote Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40 relative">
              <Quote className="w-6 h-6 text-purple-500/30 absolute top-3 left-3 -scale-x-100" />
              {isEditing ? (
                <textarea
                  rows={2}
                  value={persona.quote}
                  onChange={(e) => setPersona({ ...persona, quote: e.target.value })}
                  className="w-full bg-transparent text-sm italic text-purple-200 pl-6 focus:outline-none"
                />
              ) : (
                <blockquote className="text-sm italic text-purple-100 pl-6 leading-relaxed">
                  “{persona.quote.replace(/^"|"$/g, '')}”
                </blockquote>
              )}
            </div>

            {/* Demographics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl glass-card-subtle">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Age Range
                </span>
                <span className="font-bold text-white">
                  {persona.demographics?.ageGroup || '25-45'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-card-subtle">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Occupation / Role
                </span>
                <span className="font-bold text-white truncate block">
                  {persona.demographics?.roleOrOccupation || 'Professional'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-card-subtle">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Budget / Income
                </span>
                <span className="font-bold text-emerald-400 truncate block">
                  {persona.demographics?.budgetOrIncome || 'Standard Market'}
                </span>
              </div>

              <div className="p-3 rounded-2xl glass-card-subtle">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Tech Savviness
                </span>
                <span className="font-bold text-cyan-400">
                  {persona.demographics?.techSavviness || 'Moderate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Psychographic Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Motivations */}
        <div className="p-6 rounded-3xl glass-panel-interactive text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold">Core Motivations & Drivers</h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {persona.motivations?.map((m, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Goals */}
        <div className="p-6 rounded-3xl glass-panel-interactive text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold">Key Objectives & Success Criteria</h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {persona.keyGoals?.map((g, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <Target className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frustrations */}
        <div className="p-6 rounded-3xl glass-panel-interactive text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <Frown className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold">Frustrations & Pain Thresholds</h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {persona.frustrations?.map((f, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buying Triggers & Decision Factors */}
        <div className="p-6 rounded-3xl glass-panel-interactive text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold">Conversion & Buying Triggers</h4>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {persona.buyingTriggers?.map((b, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-950/25 border border-purple-800/30 text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
