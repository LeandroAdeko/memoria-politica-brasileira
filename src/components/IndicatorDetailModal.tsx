import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Info, ShieldCheck } from 'lucide-react';
import {
  IndicatorMeta,
  YearRecord,
  computeIndicatorStats,
} from '../data/brazilHistoryData';

interface IndicatorDetailModalProps {
  indicator: IndicatorMeta | null;
  currentYear: YearRecord;
  allYears: YearRecord[];
  onSelectYear: (year: YearRecord) => void;
  onClose: () => void;
}

export const IndicatorDetailModal: React.FC<IndicatorDetailModalProps> = ({
  indicator,
  currentYear,
  allYears,
  onSelectYear,
  onClose,
}) => {
  const [hoveredYear, setHoveredYear] = useState<YearRecord | null>(null);

  if (!indicator) return null;

  const currentStats = computeIndicatorStats(indicator, currentYear, allYears);
  const activeInspectionYear = hoveredYear || currentYear;
  const inspectionStats = computeIndicatorStats(indicator, activeInspectionYear, allYears);

  // Extract all values
  const values = allYears.map(
    (y) => y.metrics[indicator.id as keyof typeof y.metrics]
  );
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const minYear = allYears[values.indexOf(minVal)].year;
  const maxYear = allYears[values.indexOf(maxVal)].year;

  // Chart dimensions
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 24;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;
  const range = maxVal - minVal || 1;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (allYears.length - 1)) * innerWidth;
    const y = chartHeight - paddingY - ((val - minVal) / range) * innerHeight;
    return { x, y };
  };

  const points = allYears.map((item, idx) => {
    const val = item.metrics[indicator.id as keyof typeof item.metrics];
    const { x, y } = getCoordinates(idx, val);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${getCoordinates(
    allYears.length - 1,
    minVal
  ).x.toFixed(1)},${(chartHeight - paddingY).toFixed(1)} L ${paddingX},${(
    chartHeight - paddingY
  ).toFixed(1)} Z`;

  const currentIndex = allYears.findIndex((y) => y.year === activeInspectionYear.year);
  const currentCoord = getCoordinates(
    currentIndex,
    activeInspectionYear.metrics[indicator.id as keyof typeof activeInspectionYear.metrics]
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Série Histórica Completa (1990–2024)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
              {indicator.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
              {indicator.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Inspection Summary Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">
                Valor em {activeInspectionYear.year} ({activeInspectionYear.mandateName}):
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {inspectionStats.currentValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: indicator.decimals,
                    maximumFractionDigits: indicator.decimals,
                  })}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  {indicator.unit}
                </span>
              </div>
            </div>

            {inspectionStats.changePercent !== null && (
              <div className="text-right">
                <span className="text-xs text-slate-500 block">
                  Variação vs. ano anterior:
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-mono font-bold text-sm px-2.5 py-1 rounded-lg border mt-0.5 ${
                    inspectionStats.isPositiveForSociety
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  {inspectionStats.changePercent > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {inspectionStats.changePercent > 0 ? '+' : ''}
                  {inspectionStats.changePercent.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* SVG Interactive Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Passe o cursor sobre a curva para inspecionar cada ano</span>
              <span className="font-mono text-[11px]">
                Máx: {maxVal.toLocaleString('pt-BR')} ({maxYear}) · Mín: {minVal.toLocaleString('pt-BR')} ({minYear})
              </span>
            </div>

            <div className="relative w-full bg-slate-50/60 rounded-xl p-2 border border-slate-200 overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={chartWidth - paddingX}
                  y2={paddingY}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <line
                  x1={paddingX}
                  y1={chartHeight / 2}
                  x2={chartWidth - paddingX}
                  y2={chartHeight / 2}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <line
                  x1={paddingX}
                  y1={chartHeight - paddingY}
                  x2={chartWidth - paddingX}
                  y2={chartHeight - paddingY}
                  stroke="#e2e8f0"
                />

                {/* Area fill */}
                <path d={areaD} fill="url(#detailGradient)" />

                {/* Main Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Year Vertical Guide Line */}
                <line
                  x1={currentCoord.x}
                  y1={paddingY}
                  x2={currentCoord.x}
                  y2={chartHeight - paddingY}
                  stroke="#002776"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* All interactive point anchors */}
                {allYears.map((item, idx) => {
                  const val = item.metrics[indicator.id as keyof typeof item.metrics];
                  const { x, y } = getCoordinates(idx, val);
                  const isHovered = item.year === activeInspectionYear.year;

                  return (
                    <g
                      key={item.year}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredYear(item)}
                      onMouseLeave={() => setHoveredYear(null)}
                      onClick={() => {
                        onSelectYear(item);
                        onClose();
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 3}
                        fill={isHovered ? '#002776' : '#059669'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Year Axis Markers */}
              <div className="flex justify-between px-10 text-[11px] text-slate-400 font-mono pt-1">
                <span>1990</span>
                <span>2000</span>
                <span>2010</span>
                <span>2020</span>
                <span>2024</span>
              </div>
            </div>
          </div>

          {/* Source and Methodology Footer */}
          <div className="border-t border-slate-100 pt-4 flex items-start gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Fonte Primária Oficial: </span>
              <a
                href={indicator.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 hover:text-emerald-950 underline font-medium inline-flex items-center gap-1 ml-1"
              >
                <span>{indicator.source}</span>
                <span className="text-[10px] text-emerald-600">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
