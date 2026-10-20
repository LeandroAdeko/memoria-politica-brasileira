import React, { useState } from 'react';
import { X, ArrowRight, TrendingUp, TrendingDown, GitCompare } from 'lucide-react';
import {
  INDICATORS,
  IndicatorMeta,
  YearRecord,
} from '../data/brazilHistoryData';

interface YearComparisonDrawerProps {
  currentYear: YearRecord;
  allYears: YearRecord[];
  onClose: () => void;
  onSelectYear: (year: YearRecord) => void;
}

export const YearComparisonDrawer: React.FC<YearComparisonDrawerProps> = ({
  currentYear,
  allYears,
  onClose,
}) => {
  // Default comparison year: either 10 years earlier or 2002 if selected is 2024
  const defaultCompYear = allYears.find((y) => y.year === 2010) || allYears[0];
  const [compYearRecord, setCompYearRecord] = useState<YearRecord>(defaultCompYear);

  const yearA = compYearRecord.year < currentYear.year ? compYearRecord : currentYear;
  const yearB = compYearRecord.year < currentYear.year ? currentYear : compYearRecord;
  const yearDiff = Math.abs(currentYear.year - compYearRecord.year);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-[#002776]">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900">
              Comparador Histórico entre Anos
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Compare os números e veja a evolução acumulada entre dois momentos políticos do país.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Year Selection Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Ano Selecionado na Linha do Tempo
          </label>
          <div className="text-lg font-bold font-mono text-slate-900">
            {currentYear.year}
            <span className="ml-2 text-xs font-sans font-medium text-slate-500">
              ({currentYear.mandateName} · {currentYear.president})
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Comparar com o Ano
          </label>
          <select
            value={compYearRecord.year}
            onChange={(e) => {
              const selected = allYears.find((y) => y.year === Number(e.target.value));
              if (selected) setCompYearRecord(selected);
            }}
            className="w-full px-3 py-1.5 text-sm font-mono font-semibold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            {allYears.map((y) => (
              <option key={y.year} value={y.year}>
                {y.year} — {y.mandateName} ({y.president.split(' ').slice(-1)[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {yearDiff === 0 ? (
        <div className="text-center py-6 text-sm text-slate-400">
          Selecione anos diferentes para calcular as variações históricas.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Variação acumulada no período de {yearDiff} anos ({yearA.year} → {yearB.year})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-semibold">
                  <th className="py-2 pr-4">Indicador</th>
                  <th className="py-2 px-3 text-right font-mono">{yearA.year}</th>
                  <th className="py-2 px-3 text-right font-mono">{yearB.year}</th>
                  <th className="py-2 pl-4 text-right">Variação Acumulada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INDICATORS.map((indicator) => {
                  const valA = yearA.metrics[indicator.id as keyof typeof yearA.metrics];
                  const valB = yearB.metrics[indicator.id as keyof typeof yearB.metrics];
                  const diff = valB - valA;
                  const percent = valA !== 0 ? ((valB - valA) / Math.abs(valA)) * 100 : 0;
                  const isBeneficial =
                    indicator.betterDirection === 'higher' ? diff > 0 : diff < 0;

                  return (
                    <tr key={indicator.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 pr-4 font-medium text-slate-800">
                        {indicator.name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                        {valA.toLocaleString('pt-BR', {
                          minimumFractionDigits: indicator.decimals,
                          maximumFractionDigits: indicator.decimals,
                        })}{' '}
                        <span className="text-[11px] text-slate-400">{indicator.unit}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {valB.toLocaleString('pt-BR', {
                          minimumFractionDigits: indicator.decimals,
                          maximumFractionDigits: indicator.decimals,
                        })}{' '}
                        <span className="text-[11px] text-slate-400">{indicator.unit}</span>
                      </td>
                      <td className="py-2.5 pl-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                            isBeneficial
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {diff > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {diff > 0 ? '+' : ''}
                          {percent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
