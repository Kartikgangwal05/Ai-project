import React, { useState } from 'react';
import { JourneyStage } from '../types/journey';
import { Smile, Meh, Frown, TrendingUp, AlertCircle } from 'lucide-react';

interface EmotionCurveChartProps {
  stages: JourneyStage[];
  onSelectStage?: (stage: JourneyStage) => void;
  selectedStageId?: string;
  isDark?: boolean;
}

export const EmotionCurveChart: React.FC<EmotionCurveChartProps> = ({
  stages,
  onSelectStage,
  selectedStageId,
  isDark = true,
}) => {
  const [hoveredStage, setHoveredStage] = useState<JourneyStage | null>(null);

  if (!stages || stages.length === 0) return null;

  const width = 800;
  const height = 220;
  const paddingX = 60;
  const paddingY = 40;

  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  // Map each stage to an x, y coordinate
  // emotionalScore is 1 to 10. 10 is top (y = paddingY), 1 is bottom (y = height - paddingY)
  const points = stages.map((stage, idx) => {
    const x = paddingX + (idx / Math.max(1, stages.length - 1)) * usableWidth;
    const normalizedScore = Math.max(1, Math.min(10, stage.emotionalScore || 5));
    // Invert y: high score = smaller y
    const y = paddingY + usableHeight - ((normalizedScore - 1) / 9) * usableHeight;
    return { x, y, stage, score: normalizedScore };
  });

  // Build SVG path with smooth cubic bezier curves
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
  } else if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // Build gradient area fill path
  const areaPathD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY + 20} L ${points[0].x} ${height - paddingY + 20} Z`
      : '';

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green / Delight
    if (score >= 6) return '#8B5CF6'; // Purple / Positive
    if (score >= 4) return '#F59E0B'; // Amber / Neutral
    return '#EF4444'; // Red / Friction
  };

  const getEmotionIcon = (score: number) => {
    if (score >= 7) return <Smile className="w-4 h-4 text-emerald-400" />;
    if (score >= 5) return <Meh className="w-4 h-4 text-amber-400" />;
    return <Frown className="w-4 h-4 text-rose-400" />;
  };

  const avgScore = (
    stages.reduce((acc, s) => acc + (s.emotionalScore || 5), 0) / stages.length
  ).toFixed(1);

  const lowestStage = [...stages].sort((a, b) => a.emotionalScore - b.emotionalScore)[0];
  const peakStage = [...stages].sort((a, b) => b.emotionalScore - a.emotionalScore)[0];

  return (
    <div className={`p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden border transition-all shadow-2xl ${
      isDark
        ? 'border-white/[0.09] text-white'
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Ambient background light orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 text-cyan-300 border border-purple-500/30 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
              Customer Emotion Curve
            </h3>
            <p className="text-xs text-slate-400">
              Interactive sentiment pulse tracking customer emotional highs & lows across stages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-slate-400">Avg Sentiment:</span>
            <span className="font-bold text-purple-400">{avgScore} / 10</span>
          </div>

          {lowestStage && (
            <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isDark ? 'bg-rose-950/30 border-rose-800/50 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Lowest: <strong>{lowestStage.name}</strong> ({lowestStage.emotionalScore}/10)</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Emotion Curve */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid lines for sentiment tiers */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke={isDark ? '#334155' : '#E2E8F0'}
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={paddingX - 10}
            y={paddingY + 4}
            textAnchor="end"
            fontSize="10"
            fill={isDark ? '#94A3B8' : '#64748B'}
          >
            Delighted (10)
          </text>

          <line
            x1={paddingX}
            y1={paddingY + usableHeight / 2}
            x2={width - paddingX}
            y2={paddingY + usableHeight / 2}
            stroke={isDark ? '#1E293B' : '#F1F5F9'}
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={paddingX - 10}
            y={paddingY + usableHeight / 2 + 4}
            textAnchor="end"
            fontSize="10"
            fill={isDark ? '#94A3B8' : '#64748B'}
          >
            Neutral (5)
          </text>

          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke={isDark ? '#334155' : '#E2E8F0'}
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x={paddingX - 10}
            y={height - paddingY + 4}
            textAnchor="end"
            fontSize="10"
            fill={isDark ? '#94A3B8' : '#64748B'}
          >
            Frustrated (1)
          </text>

          {/* Area under curve */}
          {areaPathD && (
            <path d={areaPathD} fill="url(#areaGradient)" />
          )}

          {/* Main Bezier Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Milestone Nodes */}
          {points.map((pt, idx) => {
            const isSelected = selectedStageId === pt.stage.id;
            const isHovered = hoveredStage?.id === pt.stage.id;
            const color = getScoreColor(pt.score);

            return (
              <g
                key={pt.stage.id || idx}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectStage && onSelectStage(pt.stage)}
                onMouseEnter={() => setHoveredStage(pt.stage)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Vertical helper line */}
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={height - paddingY + 15}
                  stroke={isDark ? '#334155' : '#CBD5E1'}
                  strokeDasharray="2 2"
                  strokeWidth={isSelected || isHovered ? '1.5' : '0.8'}
                  strokeOpacity={isSelected || isHovered ? '1' : '0.4'}
                />

                {/* Outer halo */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="14"
                    fill={color}
                    fillOpacity="0.25"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected || isHovered ? '8' : '6'}
                  fill={color}
                  stroke={isDark ? '#0F172A' : '#FFFFFF'}
                  strokeWidth="2.5"
                />

                {/* Score Pill */}
                <rect
                  x={pt.x - 14}
                  y={pt.y - 28}
                  width="28"
                  height="18"
                  rx="9"
                  fill={isDark ? '#1E293B' : '#0F172A'}
                  stroke={color}
                  strokeWidth="1.2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#FFFFFF"
                >
                  {pt.score}
                </text>

                {/* Stage Label Below */}
                <text
                  x={pt.x}
                  y={height - paddingY + 28}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isSelected || isHovered ? 'bold' : 'normal'}
                  fill={
                    isSelected || isHovered
                      ? isDark ? '#FFFFFF' : '#0F172A'
                      : isDark ? '#94A3B8' : '#64748B'
                  }
                >
                  {pt.stage.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip details if hovering */}
        {hoveredStage && (
          <div
            className={`absolute top-2 right-4 p-3 rounded-xl border text-xs max-w-xs shadow-xl backdrop-blur-md pointer-events-none transition-all ${
              isDark
                ? 'bg-slate-900/95 border-purple-500/40 text-slate-200'
                : 'bg-white/95 border-purple-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-sm text-purple-400">
                {hoveredStage.name}
              </span>
              <div className="flex items-center gap-1 font-bold">
                {getEmotionIcon(hoveredStage.emotionalScore)}
                <span>{hoveredStage.emotionalScore}/10</span>
              </div>
            </div>
            <p className="text-slate-400 mb-1.5 italic">
              "{hoveredStage.emotionalState}"
            </p>
            {hoveredStage.painPoints && hoveredStage.painPoints.length > 0 && (
              <div className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{hoveredStage.painPoints[0].title}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Delight (8-10)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Positive (6-7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Friction (4-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Drop-off Risk (1-3)</span>
          </div>
        </div>
        <span>Click any node to inspect & edit stage details</span>
      </div>
    </div>
  );
};
