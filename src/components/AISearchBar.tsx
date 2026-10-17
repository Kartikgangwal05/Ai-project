import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Loader2,
  TrendingUp,
  Zap,
  CheckCircle2,
  Compass,
  Layers,
  ChevronRight,
  Cpu,
  ShoppingBag,
  Car,
  Coffee,
  Smartphone,
  CreditCard,
  Plane,
} from 'lucide-react';
import { Journey } from '../types/journey';

interface AISearchBarProps {
  onJourneyLoaded: (journey: Journey) => void;
  variant?: 'hero' | 'header';
  isDark?: boolean;
}

const CATEGORY_CHIPS = [
  { label: 'All Products', icon: Sparkles, query: '' },
  { label: 'Sneakers & Fashion', icon: ShoppingBag, query: 'Nike Air Max limited edition sneaker drop & unboxing experience' },
  { label: 'Electric Vehicles', icon: Car, query: 'Tesla Model Y order, delivery day & mobile app pairing' },
  { label: 'Dining & Cafes', icon: Coffee, query: 'Starbucks mobile order ahead & curbside morning pickup' },
  { label: 'Consumer Electronics', icon: Smartphone, query: 'Apple Vision Pro in-store demo appointment & home setup' },
  { label: 'FinTech & Banking', icon: CreditCard, query: 'Revolut digital banking signup & international virtual card issuance' },
  { label: 'Travel & Stays', icon: Plane, query: 'Airbnb luxury mountain chalet booking & self check-in' },
];

const QUICK_INSPIRATIONS = [
  {
    title: 'Dyson Supersonic Nural',
    category: 'Premium Tech',
    query: 'Dyson Supersonic hair dryer luxury unboxing & warranty activation',
  },
  {
    title: 'Spotify Family Subscription',
    category: 'Streaming SaaS',
    query: 'Spotify Family tier subscription onboarding & collaborative playlist setup',
  },
  {
    title: 'Oura Ring Gen 3',
    category: 'Health Wearable',
    query: 'Oura Ring sizing kit delivery, app pairing & daily sleep score routine',
  },
  {
    title: 'Notion AI Workspace',
    category: 'B2B Software',
    query: 'Notion enterprise workspace migration, employee onboarding & AI adoption',
  },
  {
    title: 'Blue Bottle Craft Coffee',
    category: 'DTC Subscription',
    query: 'Blue Bottle bi-weekly single-origin coffee subscription tasting box',
  },
];

export const AISearchBar: React.FC<AISearchBarProps> = ({
  onJourneyLoaded,
  variant = 'hero',
  isDark = true,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All Products');
  const containerRef = useRef<HTMLDivElement>(null);

  const loadingStages = [
    { title: 'Awareness & Discovery', desc: 'Analyzing search intent, social touchpoints, and brand triggers' },
    { title: 'Consideration & Pricing', desc: 'Synthesizing feature comparisons, review lookups, and evaluation' },
    { title: 'Purchase & Conversion', desc: 'Mapping checkout flow, payment gateways, and confirmation friction' },
    { title: 'Onboarding & Unboxing', desc: 'Detailing first-run setup, packaging delight, and product adoption' },
    { title: 'Retention & Advocacy', desc: 'Calculating NPS metrics, repeat purchase loops, and referral hooks' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const textToSearch = searchQuery || query.trim();
    if (!textToSearch || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(0);
    setIsFocused(false);

    // Smoothly step through the journey stages as AI processes
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const res = await fetch('/api/quick-search-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSearch }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to synthesize customer journey for this search.');
      }

      const generated: Journey = await res.json();
      clearInterval(stepInterval);
      setQuery('');
      onJourneyLoaded(generated);
    } catch (e: any) {
      clearInterval(stepInterval);
      setErrorMsg(e?.message || 'Unable to generate journey map right now. Please try another product query.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Header Variant (Sleek Compact Glassmorphic Search)
  // -------------------------------------------------------------
  if (variant === 'header') {
    return (
      <div ref={containerRef} className="relative w-full max-w-md hidden md:block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-3 flex items-center pointer-events-none text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="AI Search: Type any product (e.g. 'Tesla Model Y', 'Nike Shoes')..."
            className="w-full pl-9 pr-24 py-2 rounded-xl text-xs bg-[#081028]/80 backdrop-blur-xl border border-white/[0.12] text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-inner transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-1 px-3 py-1.5 rounded-lg text-[11px] font-bold animated-gradient-active text-white disabled:opacity-40 transition-all flex items-center gap-1 shadow-md shadow-purple-900/30 border border-white/20 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-cyan-300" />
                <span>Mapping...</span>
              </>
            ) : (
              <>
                <span>Map AI</span>
                <ArrowRight className="w-3 h-3 text-cyan-300" />
              </>
            )}
          </button>
        </form>

        {/* Quick Dropdown Suggestions */}
        {isFocused && !isLoading && (
          <div className="absolute left-0 right-0 mt-2 p-2 rounded-2xl glass-panel z-50 text-xs space-y-1.5 border border-white/[0.14] shadow-2xl animate-in fade-in">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Product Inspirations</span>
              <span className="text-cyan-400 font-mono">1-Click Full Map</span>
            </div>
            {QUICK_INSPIRATIONS.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearch(item.query)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.08] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[280px]">
                    {item.category}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Hero Variant (Prominent, High-Impact Neon Glassmorphism)
  // -------------------------------------------------------------
  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORY_CHIPS.map((chip, idx) => {
          const Icon = chip.icon;
          const isActive = activeCategory === chip.label;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveCategory(chip.label);
                if (chip.query) {
                  setQuery(chip.query);
                }
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium whitespace-nowrap transition-all duration-200 text-xs ${
                isActive
                  ? 'animated-gradient-active text-white font-bold shadow-lg shadow-purple-600/30 border border-white/20'
                  : 'glass-card-subtle text-slate-300 hover:text-white hover:border-purple-400/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Glowing Search Container */}
      <div className="relative group">
        {/* Animated Neon Radiant Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>

        <div className="relative rounded-2xl sm:rounded-3xl bg-[#070e24]/90 p-2.5 sm:p-3.5 border border-white/[0.18] shadow-2xl backdrop-blur-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-cyan-300 border border-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter any product (e.g. 'Tesla Model Y Delivery', 'Nike Air Max', 'Starbucks App')..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-slate-400 focus:outline-none"
                />
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="text-cyan-400 font-mono font-semibold">Gemini 3.8 Flash Engine</span>
                  <span>•</span>
                  <span>Generates complete journey from initial trigger to brand advocacy</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-6 py-4 rounded-xl sm:rounded-2xl animated-gradient-active hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-purple-600/40 border border-white/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 flex-shrink-0 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Synthesizing Full Journey...</span>
                </>
              ) : (
                <>
                  <span>Map Full Journey</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Real-time Journey Roadmap Synthesis Progress */}
          {isLoading && (
            <div className="mt-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3 animate-in fade-in backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                  <span className="font-bold text-white">
                    Mapping Stage {loadingStep + 1} of {loadingStages.length}:
                  </span>
                  <span className="text-cyan-300 font-semibold">
                    {loadingStages[loadingStep]?.title}
                  </span>
                </div>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {Math.round(((loadingStep + 1) / loadingStages.length) * 100)}%
                </span>
              </div>

              {/* Multi-stage Neon Segment Progress Bar */}
              <div className="grid grid-cols-5 gap-1.5 h-2">
                {loadingStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-500 ${
                      idx <= loadingStep
                        ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-md shadow-cyan-500/40'
                        : 'bg-slate-800/80'
                    }`}
                  ></div>
                ))}
              </div>

              <p className="text-[11px] text-slate-300 italic">
                {loadingStages[loadingStep]?.desc}
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs text-center">
              {errorMsg}
            </div>
          )}

          {/* Quick Inspirations Dropdown when focused */}
          {isFocused && !isLoading && (
            <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Click to map full end-to-end journey instantly:
                </span>
                <span className="text-cyan-400">5 Ready-to-Map Products</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {QUICK_INSPIRATIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearch(item.query)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-purple-500/50 text-left transition-all group flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.category}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
