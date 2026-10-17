import React from 'react';
import { Journey } from '../types/journey';
import { Printer, ArrowLeft, Download, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { exportJourneyToJSON } from '../utils/journeyStore';

interface PresentationPrintViewProps {
  journey: Journey;
  onBack: () => void;
}

export const PresentationPrintView: React.FC<PresentationPrintViewProps> = ({
  journey,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action toolbar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl glass-panel border border-white/[0.1] shadow-xl">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Interactive Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportJourneyToJSON(journey)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl animated-gradient-active text-xs font-bold text-white shadow-xl shadow-purple-600/35 flex items-center gap-2 transition-all hover:scale-[1.02] border border-white/20"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-200" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Presentation Document */}
      <div className="card-print p-8 sm:p-12 rounded-3xl bg-white text-slate-900 shadow-xl space-y-8 font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-widest uppercase bg-purple-600 text-white px-2.5 py-1 rounded">
                JOURNEYX STRATEGY BRIEF
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {journey.industry} • {journey.businessModel}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {journey.title}
            </h1>
            <p className="text-sm font-semibold text-purple-700 mt-1">
              Product: {journey.productName} • Target: {journey.customerType}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <div>Document Date: {new Date(journey.updatedAt).toLocaleDateString()}</div>
            <div>Generated via JourneyX AI Engine</div>
            <div className="font-semibold text-slate-800">Status: Verified Working Map</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b pb-1">
            1. Executive CX Briefing
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {journey.strategicInsights?.executiveSummary || 'Comprehensive customer journey analysis synthesized from market signals and user friction analysis.'}
          </p>
        </div>

        {/* Persona Briefing */}
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b pb-1">
            2. Primary Customer Archetype ({journey.persona?.name})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Archetype & Quote</span>
              <div className="font-bold text-slate-900">{journey.persona?.archetype}</div>
              <p className="italic text-slate-600">"{journey.persona?.quote}"</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Motivations</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {journey.persona?.motivations?.slice(0, 3).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Key Frustrations</span>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                {journey.persona?.frustrations?.slice(0, 3).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stage Timeline Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b pb-1">
            3. End-to-End Customer Journey Stages & Friction Map
          </h2>

          <div className="space-y-4">
            {journey.stages.map((stage, idx) => (
              <div
                key={stage.id || idx}
                className="p-4 rounded-xl border border-slate-300 bg-white space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">0{idx + 1}.</span>
                    <span className="font-bold text-base text-slate-900">{stage.name}</span>
                    <span className="text-slate-500 italic">({stage.emotionalState})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-bold text-xs bg-purple-100 text-purple-900 border border-purple-200">
                    Sentiment: {stage.emotionalScore}/10
                  </span>
                </div>

                <p className="text-slate-600">{stage.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Actions & Channels */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] block">Channels & Touchpoints:</span>
                    <div className="space-y-0.5 text-slate-600">
                      {stage.touchpoints?.map((tp, i) => (
                        <div key={i}>• {tp.channel} ({tp.friction} friction)</div>
                      ))}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="space-y-1">
                    <span className="font-bold text-rose-700 text-[11px] block">Identified Friction:</span>
                    <div className="space-y-0.5 text-slate-600">
                      {stage.painPoints?.map((pp, i) => (
                        <div key={i}>• {pp.title} ({pp.impact} impact)</div>
                      ))}
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-1">
                    <span className="font-bold text-purple-800 text-[11px] block">Key Metrics:</span>
                    <div className="space-y-0.5 text-slate-600">
                      {stage.kpis?.map((k, i) => (
                        <div key={i}>• {k.name}: Target {k.target}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Strategic Assumptions & Verification Disclaimer */}
        <div className="pt-6 border-t border-slate-300 text-[11px] text-slate-500 space-y-1">
          <span className="font-bold uppercase tracking-wider text-slate-700 block">
            Methodology & Empirical Verification Standard:
          </span>
          <p>
            JourneyX generates strategic journey hypotheses and psychological friction models using Google Gemini AI.
            All performance baseline fields are left unpopulated until measured by the business. Actual metrics must be confirmed with enterprise analytics telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
