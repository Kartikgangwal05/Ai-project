import React, { useState } from 'react';
import { Journey, BusinessModel } from '../types/journey';
import {
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Loader2,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface CreateJourneyViewProps {
  onJourneyCreated: (journey: Journey) => void;
  isDark?: boolean;
}

const INDUSTRIES = [
  'E-commerce',
  'Automobile',
  'FMCG',
  'Restaurants',
  'Banking',
  'Education',
  'Retail',
  'SaaS / Software',
  'Healthcare',
  'Travel & Hospitality',
  'Fintech',
];

export const CreateJourneyView: React.FC<CreateJourneyViewProps> = ({
  onJourneyCreated,
  isDark = true,
}) => {
  const [productName, setProductName] = useState('');
  const [industry, setIndustry] = useState('E-commerce');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2C');
  const [customerGoals, setCustomerGoals] = useState('');
  const [businessObjectives, setBusinessObjectives] = useState('');
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [businessChallenges, setBusinessChallenges] = useState('');
  const [mode, setMode] = useState<'quick' | 'advanced'>('advanced');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset filler for instant testing
  const handleLoadPreset = (presetType: 'dtc' | 'b2b' | 'edtech') => {
    if (presetType === 'dtc') {
      setProductName('AuraSmart Sleep Mask');
      setIndustry('E-commerce');
      setCustomerType('Burned-out Tech Executive & Poor Sleeper');
      setBusinessModel('D2C');
      setCustomerGoals('Achieve deep REM sleep without grogginess or prescription pills');
      setBusinessObjectives('Achieve 4.2% direct conversion rate and under 8% product returns');
      setCustomerFeedback('Users love the blackout seal, but find the companion mobile Bluetooth pairing slightly glitchy on Android');
      setBusinessChallenges('High initial ad customer acquisition costs on Meta and sizing hesitation');
    } else if (presetType === 'b2b') {
      setProductName('DataPulse Enterprise Observability');
      setIndustry('SaaS / Software');
      setCustomerType('VP of Infrastructure & DevOps Lead');
      setBusinessModel('B2B');
      setCustomerGoals('Detect cloud microservice latency bottlenecks before customer SLA breaches');
      setBusinessObjectives('Convert 25% of free self-hosted POC trials into $50k+ annual enterprise contracts');
      setCustomerFeedback('Engineers love the eBPF auto-instrumentation, but procurement legal review takes 60 days');
      setBusinessChallenges('Complex SOC2 enterprise security sign-off and pricing tier sticker shock');
    } else {
      setProductName('ApexCoders AI Apprenticeship');
      setIndustry('Education');
      setCustomerType('Self-taught Programmer & Career Switcher');
      setBusinessModel('B2C');
      setCustomerGoals('Build a production portfolio to land a $120k junior developer position');
      setBusinessObjectives('Maintain 90%+ cohort completion and 85% placement within 9 months');
      setCustomerFeedback('Students want more 1-on-1 code reviews on capstone projects');
      setBusinessChallenges('Mid-curriculum motivation drop and imposter syndrome');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !customerType.trim()) {
      setErrorMsg('Please specify product name and target customer type.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const finalIndustry = industry === 'Other' && customIndustry.trim() ? customIndustry.trim() : industry;

    try {
      const res = await fetch('/api/generate-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          industry: finalIndustry,
          customerType: customerType.trim(),
          businessModel,
          customerGoals: customerGoals.trim(),
          businessObjectives: businessObjectives.trim(),
          customerFeedback: customerFeedback.trim(),
          businessChallenges: businessChallenges.trim(),
          mode,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate journey map.');
      }

      const generatedJourney: Journey = await res.json();
      onJourneyCreated(generatedJourney);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Error generating journey with Gemini AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI-Powered CX Engine • Gemini 3.8 Flash</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create New Customer Journey
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Enter your product and customer profile. JourneyX will analyze buyer psychology, map stage touchpoints, calculate emotion curves, and generate KPI targets.
        </p>

        {/* Quick Presets for Demo */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-[11px] text-slate-500 font-semibold">Quick Demo Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('dtc')}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-white transition-colors"
          >
            ⚡ D2C Smart Sleep Mask
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('b2b')}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-white transition-colors"
          >
            ⚡ B2B Cloud Observability
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('edtech')}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-white transition-colors"
          >
            ⚡ EdTech AI Bootcamp
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <form onSubmit={handleGenerate} className="relative z-10 space-y-6">
          {/* Row 1: Product Name & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Product or Service Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. EcoStyle Organic Apparel, VoltDrive EV"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-3 rounded-2xl glass-card-subtle border border-white/[0.1] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Industry Sector <span className="text-rose-400">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-3 rounded-2xl glass-card-subtle border border-white/[0.1] text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-slate-900 text-white">
                    {ind}
                  </option>
                ))}
                <option value="Other" className="bg-slate-900 text-white">Other / Custom Industry</option>
              </select>

              {industry === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify custom industry..."
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full mt-2 p-2.5 rounded-xl glass-card-subtle border border-white/[0.1] text-xs text-white"
                />
              )}
            </div>
          </div>

          {/* Row 2: Customer Type & Business Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Target Customer Type / Segment <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Eco-conscious Urban Professional, Seed Startup Founder"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Business Model <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['B2C', 'B2B', 'D2C'] as BusinessModel[]).map((bm) => (
                  <button
                    key={bm}
                    type="button"
                    onClick={() => setBusinessModel(bm)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                      businessModel === bm
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Customer Goals & Business Objectives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Core Customer Goals & Desires
              </label>
              <textarea
                rows={2}
                placeholder="What is the customer trying to accomplish or avoid?"
                value={customerGoals}
                onChange={(e) => setCustomerGoals(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Business Objectives & Targets
              </label>
              <textarea
                rows={2}
                placeholder="Key conversion, retention, or CAC targets for the brand"
                value={businessObjectives}
                onChange={(e) => setBusinessObjectives(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Row 4: Optional Feedback & Challenges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Customer Feedback / Known Complaints (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any existing quotes, survey feedback, or reviews..."
                value={customerFeedback}
                onChange={(e) => setCustomerFeedback(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Operational / Business Challenges (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Cart abandonment drop-offs, shipping delays, support volume..."
                value={businessChallenges}
                onChange={(e) => setBusinessChallenges(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Mode Selector: Quick vs Advanced */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Journey Scope Depth:</span>
              <span className="text-slate-400 text-[11px]">
                {mode === 'quick'
                  ? 'Quick Map: 4-5 focused high-level stages'
                  : 'Advanced Map: 6-7 comprehensive stages with full touchpoint friction analysis'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('quick')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  mode === 'quick' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Quick Map
              </button>
              <button
                type="button"
                onClick={() => setMode('advanced')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  mode === 'advanced' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Advanced Map
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl animated-gradient-active hover:brightness-110 text-white font-extrabold text-base shadow-2xl shadow-purple-600/40 border border-white/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Complete Journey with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Generate Journey with AI</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
