import React from 'react';
import { Landmark, Calendar, Flag, Sparkles } from 'lucide-react';
import { YearRecord } from '../data/brazilHistoryData';

interface PoliticalContextBannerProps {
  currentYear: YearRecord;
  onOpenDetails?: () => void;
}

export const PoliticalContextBanner: React.FC<PoliticalContextBannerProps> = ({
  currentYear,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Decorative subtle national ribbon gradient at top corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              Ano Base {currentYear.year}
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
              <Landmark className="w-3.5 h-3.5 text-blue-700" />
              {currentYear.mandateName} ({currentYear.party})
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-semibold">
              Presidente: {currentYear.president}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight"
            >
              Brasil em {currentYear.year}
            </h1>
            {currentYear.milestone && (
              <div className="flex items-start gap-2 pt-1 text-sm font-medium text-amber-900 bg-amber-50/80 px-3 py-2 rounded-lg border border-amber-200/80">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{currentYear.milestone}</span>
              </div>
            )}
          </div>

          {/* Editorial Paragraph */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            {currentYear.politicalContext}
          </p>
        </div>

        {/* Quick Snapshot Card on the Right */}
        <div className="shrink-0 w-full lg:w-72 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-emerald-700" />
              Conjuntura {currentYear.year}
            </span>
            <span className="font-mono text-slate-700">{currentYear.mandatePeriod}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[11px] text-slate-500 block">PIB no Ano</span>
              <span
                className={`text-base font-bold font-mono tabular-nums ${
                  currentYear.metrics.gdp_growth >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {currentYear.metrics.gdp_growth > 0 ? '+' : ''}
                {currentYear.metrics.gdp_growth.toFixed(1)}%
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Inflação (IPCA)</span>
              <span
                className={`text-base font-bold font-mono tabular-nums ${
                  currentYear.metrics.inflation > 10 ? 'text-rose-700' : 'text-slate-800'
                }`}
              >
                {currentYear.metrics.inflation > 100
                  ? `${Math.round(currentYear.metrics.inflation)}%`
                  : `${currentYear.metrics.inflation.toFixed(1)}%`}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Expectativa Vida</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-800">
                {currentYear.metrics.life_expectancy.toFixed(1)} anos
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Fome Crônica</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-800">
                {currentYear.metrics.hunger.toFixed(1)}% pop.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
