import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  INDICATORS,
  IndicatorMeta,
  YearRecord,
  computeIndicatorStats,
} from '../data/brazilHistoryData';

interface MinimalistHomeProps {
  years: YearRecord[];
  selectedYear: YearRecord;
}

export const MinimalistHome: React.FC<MinimalistHomeProps> = ({
  years,
  selectedYear,
}) => {
  const currentIndex = years.findIndex((y) => y.year === selectedYear.year);
  const prevYearNumber = currentIndex > 0 ? years[currentIndex - 1].year : null;

  // Format value with standard Portuguese separators
  const formatValue = (val: number, decimals: number, prefix?: string) => {
    const formatted = val.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return prefix ? `${prefix}${formatted}` : formatted;
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Pure Numeric Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INDICATORS.map((indicator: IndicatorMeta) => {
          const stats = computeIndicatorStats(indicator, selectedYear, years);
          const isBeneficial = stats.isPositiveForSociety;
          const isIncrease = (stats.changePercent ?? 0) > 0;

          return (
            <div
              key={indicator.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-sm"
            >
              {/* Indicator Name */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600">
                  {indicator.name}
                </h3>

                {/* Primary Metric Number */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">
                    {formatValue(stats.currentValue, indicator.decimals, indicator.prefix)}
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    {indicator.unit}
                  </span>
                </div>
              </div>

              {/* Variation Relative to Previous Year */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {prevYearNumber ? `vs. ${prevYearNumber}` : 'Base inicial'}
                </span>

                {stats.changePercent === null ? (
                  <span className="text-xs text-slate-400 font-mono">
                    —
                  </span>
                ) : stats.isUnchanged ? (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Minus className="w-3 h-3" />
                    0,0%
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      isBeneficial
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    {isIncrease ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isIncrease ? '+' : ''}
                      {stats.changePercent.toFixed(1).replace('.', ',')}%
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
