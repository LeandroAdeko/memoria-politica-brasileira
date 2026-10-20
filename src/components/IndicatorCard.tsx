import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Banknote,
  Percent,
  Trees,
  Scale,
  Users,
  Baby,
} from 'lucide-react';
import {
  IndicatorMeta,
  YearRecord,
  computeIndicatorStats,
} from '../data/brazilHistoryData';
import { Sparkline } from './Sparkline';

interface IndicatorCardProps {
  indicator: IndicatorMeta;
  currentYear: YearRecord;
  allYears: YearRecord[];
  onOpenDetail: (indicator: IndicatorMeta) => void;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  indicator,
  currentYear,
  allYears,
  onOpenDetail,
}) => {
  const stats = computeIndicatorStats(indicator, currentYear, allYears);
  const currentIndex = allYears.findIndex((y) => y.year === currentYear.year);
  const prevYearNumber = currentIndex > 0 ? allYears[currentIndex - 1].year : null;

  // Extract full time series values for sparkline
  const fullSeries = allYears.map(
    (y) => y.metrics[indicator.id as keyof typeof y.metrics]
  );

  // Icon mapping for each indicator
  const getIndicatorIcon = (id: string) => {
    switch (id) {
      case 'hunger':
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case 'life_expectancy':
        return <HeartPulse className="w-4 h-4 text-emerald-600" />;
      case 'schooling':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'inflation':
        return <Percent className="w-4 h-4 text-rose-600" />;
      case 'minimum_wage':
        return <Banknote className="w-4 h-4 text-emerald-700" />;
      case 'gini':
        return <Scale className="w-4 h-4 text-amber-700" />;
      case 'unemployment':
        return <Users className="w-4 h-4 text-blue-700" />;
      case 'infant_mortality':
        return <Baby className="w-4 h-4 text-emerald-700" />;
      case 'amazon_deforestation':
        return <Trees className="w-4 h-4 text-emerald-800" />;
      case 'gdp_growth':
        return <TrendingUp className="w-4 h-4 text-blue-800" />;
      default:
        return <TrendingUp className="w-4 h-4 text-slate-600" />;
    }
  };

  // Format value with commas/periods standard in Brazilian Portuguese
  const formatValue = (val: number, decimals: number, prefix?: string) => {
    const formatted = val.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return prefix ? `${prefix}${formatted}` : formatted;
  };

  // Render variation badge
  const renderVariation = () => {
    if (stats.changePercent === null || prevYearNumber === null) {
      return (
        <span className="text-xs text-slate-400 font-medium">
          Ano base inicial da série
        </span>
      );
    }

    if (stats.isUnchanged) {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
          <Minus className="w-3.5 h-3.5" />
          <span>Estável vs. {prevYearNumber}</span>
        </div>
      );
    }

    const isBeneficial = stats.isPositiveForSociety;
    const isIncrease = (stats.changePercent ?? 0) > 0;
    const formattedPercent = Math.abs(stats.changePercent).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    const formattedAbsDiff = Math.abs(stats.changeAbs ?? 0).toLocaleString('pt-BR', {
      minimumFractionDigits: indicator.decimals,
      maximumFractionDigits: indicator.decimals,
    });

    // Badge styling based on whether the change was favorable for Brazilian population
    // Beneficial: deep green
    // Adverse: amber/warm red
    const badgeColorClass = isBeneficial
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : 'bg-amber-50 text-amber-900 border-amber-200';

    return (
      <div className="flex flex-col gap-1">
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold font-mono tracking-tight tabular-nums w-fit ${badgeColorClass}`}
        >
          {isIncrease ? (
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>
            {isIncrease ? '+' : '-'}
            {formattedPercent}%
          </span>
          <span className="font-sans font-normal text-[11px] opacity-75">
            vs. {prevYearNumber}
          </span>
        </div>

        <span className="text-[11px] text-slate-500 font-sans">
          {isIncrease ? 'Aumento' : 'Redução'} de {formattedAbsDiff} {indicator.unit}
          {isBeneficial ? ' (variação favorável)' : ' (variação desfavorável)'}
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={() => onOpenDetail(indicator)}
      className="group relative bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-emerald-300 hover:translate-y-[-1px] cursor-pointer flex flex-col justify-between"
    >
      {/* Top indicator header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 transition-colors">
              {getIndicatorIcon(indicator.id)}
            </div>
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 block">
                {indicator.category === 'social' && 'Social & Equidade'}
                {indicator.category === 'saude' && 'Saúde & População'}
                {indicator.category === 'educacao' && 'Educação'}
                {indicator.category === 'economia' && 'Economia & Renda'}
                {indicator.category === 'meio_ambiente' && 'Meio Ambiente'}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                {indicator.name}
              </h3>
            </div>
          </div>

          <button
            title="Ver histórico e análise"
            className="text-slate-300 group-hover:text-emerald-700 transition-colors p-1"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Primary metric display */}
        <div className="pt-2 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
            {formatValue(stats.currentValue, indicator.decimals, indicator.prefix)}
          </span>
          <span className="text-sm font-medium text-slate-500 font-sans">
            {indicator.unit}
          </span>
        </div>
      </div>

      {/* Middle: Percentage Variation vs Previous Year */}
      <div className="my-4 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
          Variação em relação a {prevYearNumber ?? '1990'}
        </span>
        {renderVariation()}
      </div>

      {/* Bottom: Sparkline Trend + Source */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium">
            Trajetória até {currentYear.year}
          </span>
          <Sparkline
            data={fullSeries}
            currentYearIndex={currentIndex}
            betterDirection={indicator.betterDirection}
            color={
              indicator.category === 'meio_ambiente' || indicator.category === 'saude'
                ? '#059669'
                : indicator.category === 'social'
                ? '#d97706'
                : '#2563eb'
            }
          />
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 truncate max-w-[130px] block" title={indicator.source}>
            {indicator.source.split('—')[0].split('/')[0]}
          </span>
          <span className="text-[11px] font-semibold text-emerald-800 group-hover:underline inline-flex items-center gap-0.5">
            Analisar
          </span>
        </div>
      </div>
    </div>
  );
};
