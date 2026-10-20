import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Landmark,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Table,
  LayoutGrid,
} from 'lucide-react';
import {
  INDICATORS,
  IndicatorMeta,
  YearRecord,
  HISTORICAL_DATA,
} from '../data/brazilHistoryData';

interface ComparePageProps {
  initialYearA?: number;
  initialYearB?: number;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  initialYearA = 2002,
  initialYearB = 2024,
}) => {
  const [yearAVal, setYearAVal] = useState<number>(initialYearA);
  const [yearBVal, setYearBVal] = useState<number>(initialYearB);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayLayout, setDisplayLayout] = useState<'cards' | 'table'>('cards');

  const recordA = HISTORICAL_DATA.find((y) => y.year === yearAVal) || HISTORICAL_DATA[0];
  const recordB =
    HISTORICAL_DATA.find((y) => y.year === yearBVal) ||
    HISTORICAL_DATA[HISTORICAL_DATA.length - 1];

  const yearDiff = Math.abs(recordB.year - recordA.year);
  const isChronological = recordB.year >= recordA.year;
  const earlierYear = isChronological ? recordA : recordB;
  const laterYear = isChronological ? recordB : recordA;

  const presets = [
    { label: '30 Anos do Real', a: 1994, b: 2024 },
    { label: 'FHC II vs. Lula II', a: 2002, b: 2010 },
    { label: 'Lula II vs. Dilma I', a: 2010, b: 2014 },
    { label: 'Dilma II vs. Temer', a: 2014, b: 2018 },
    { label: 'Bolsonaro vs. Lula III', a: 2022, b: 2024 },
    { label: 'Série Completa (1990 → 2024)', a: 1990, b: 2024 },
  ];

  const categories = [
    { id: 'all', label: 'Todos os Indicadores' },
    { id: 'social', label: 'Social & Fome' },
    { id: 'saude', label: 'Saúde' },
    { id: 'educacao', label: 'Educação' },
    { id: 'economia', label: 'Economia' },
    { id: 'meio_ambiente', label: 'Meio Ambiente' },
  ];

  const filteredIndicators = INDICATORS.filter(
    (ind) => selectedCategory === 'all' || ind.category === selectedCategory
  );

  const formatValue = (val: number, decimals: number, prefix?: string) => {
    const formatted = val.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return prefix ? `${prefix}${formatted}` : formatted;
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Title & Context */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <GitCompare className="w-4 h-4 text-emerald-700" />
          Página de Comparação Histórica
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
          Comparador de Anos e Mandatos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans">
          Selecione dois momentos da história política brasileira para confrontar números, presidentes e evolução acumulada.
        </p>
      </div>

      {/* Preset Quick-Jumps */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Comparações Rápidas:
        </span>
        {presets.map((p) => {
          const isActive = yearAVal === p.a && yearBVal === p.b;
          return (
            <button
              key={p.label}
              onClick={() => {
                setYearAVal(p.a);
                setYearBVal(p.b);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* 2 Primary Year Selectors (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector Panel A */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Primeiro Ano (Ano A)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Mandato {recordA.mandatePeriod}
              </span>
            </div>

            {/* Dropdown Selector displaying Year and President Name */}
            <select
              value={yearAVal}
              onChange={(e) => setYearAVal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              {HISTORICAL_DATA.map((y) => (
                <option key={`a-${y.year}`} value={y.year}>
                  {y.year} — {y.president} ({y.party})
                </option>
              ))}
            </select>
          </div>

          {/* Year A Snapshot Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {recordA.year}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {recordA.party}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Landmark className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Presidente: <strong>{recordA.president}</strong></span>
            </div>

            {recordA.milestone && (
              <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-200/60">
                {recordA.milestone}
              </p>
            )}
          </div>
        </div>

        {/* Selector Panel B */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Segundo Ano (Ano B)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Mandato {recordB.mandatePeriod}
              </span>
            </div>

            {/* Dropdown Selector displaying Year and President Name */}
            <select
              value={yearBVal}
              onChange={(e) => setYearBVal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-700 cursor-pointer"
            >
              {HISTORICAL_DATA.map((y) => (
                <option key={`b-${y.year}`} value={y.year}>
                  {y.year} — {y.president} ({y.party})
                </option>
              ))}
            </select>
          </div>

          {/* Year B Snapshot Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {recordB.year}
              </span>
              <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {recordB.party}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Landmark className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Presidente: <strong>{recordB.president}</strong></span>
            </div>

            {recordB.milestone && (
              <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-200/60">
                {recordB.milestone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interval Banner */}
      {yearDiff > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Variação Acumulada
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-sm font-mono font-medium text-slate-200">
              {earlierYear.year} ({earlierYear.president.split(' ')[0]}) <ArrowRight className="w-3.5 h-3.5 inline mx-1" /> {laterYear.year} ({laterYear.president.split(' ')[0]})
            </span>
          </div>

          <div className="text-xs font-mono font-semibold text-emerald-300">
            Intervalo de {yearDiff} {yearDiff === 1 ? 'ano' : 'anos'}
          </div>
        </div>
      )}

      {/* Toolbar: Category Filters & Layout Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-xs flex items-center gap-1 mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Tema:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Layout Toggle: Cards vs Table */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setDisplayLayout('cards')}
            title="Visualização em Cartões"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              displayLayout === 'cards'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDisplayLayout('table')}
            title="Visualização em Tabela"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              displayLayout === 'table'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Content */}
      {yearDiff === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            Você selecionou o mesmo ano ({recordA.year}) em ambos os seletores.
          </p>
          <p className="text-xs text-slate-400">
            Escolha anos diferentes acima para calcular a variação e contrastar os dados entre governos.
          </p>
        </div>
      ) : displayLayout === 'cards' ? (
        /* ================= CARDS LAYOUT ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicators.map((indicator: IndicatorMeta) => {
            const valA = recordA.metrics[indicator.id as keyof typeof recordA.metrics];
            const valB = recordB.metrics[indicator.id as keyof typeof recordB.metrics];
            const diffAbs = valB - valA;
            const diffPercent = valA !== 0 ? ((valB - valA) / Math.abs(valA)) * 100 : 0;
            const isUnchanged = Math.abs(diffPercent) < 0.05;

            const isBeneficial =
              indicator.betterDirection === 'higher' ? diffAbs > 0 : diffAbs < 0;

            return (
              <div
                key={indicator.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-sm transition-shadow"
              >
                {/* Header */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {indicator.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {indicator.name}
                  </h3>
                </div>

                {/* Side-by-Side Values */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {recordA.year} ({recordA.president.split(' ')[0]})
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                        {formatValue(valA, indicator.decimals, indicator.prefix)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">
                        {indicator.unit}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {recordB.year} ({recordB.president.split(' ')[0]})
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                        {formatValue(valB, indicator.decimals, indicator.prefix)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">
                        {indicator.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variation Badge & Explanation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Variação no Período:
                    </span>

                    {isUnchanged ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Minus className="w-3 h-3" />
                        Estável
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                          isBeneficial
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {diffAbs > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {diffAbs > 0 ? '+' : ''}
                          {diffPercent.toFixed(1).replace('.', ',')}%
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans">
                    Diferença de {diffAbs > 0 ? '+' : ''}
                    {formatValue(diffAbs, indicator.decimals, indicator.prefix)} {indicator.unit}
                    {isBeneficial ? ' (ganho para o país)' : ' (retrocesso/alerta)'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE LAYOUT ================= */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-6">Indicador</th>
                  <th className="py-3.5 px-4 text-right font-mono">
                    {recordA.year} ({recordA.president.split(' ')[0]})
                  </th>
                  <th className="py-3.5 px-4 text-right font-mono">
                    {recordB.year} ({recordB.president.split(' ')[0]})
                  </th>
                  <th className="py-3.5 px-4 text-right">Diferença Absoluta</th>
                  <th className="py-3.5 px-6 text-right">Variação (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredIndicators.map((indicator: IndicatorMeta) => {
                  const valA = recordA.metrics[indicator.id as keyof typeof recordA.metrics];
                  const valB = recordB.metrics[indicator.id as keyof typeof recordB.metrics];
                  const diffAbs = valB - valA;
                  const diffPercent = valA !== 0 ? ((valB - valA) / Math.abs(valA)) * 100 : 0;
                  const isBeneficial =
                    indicator.betterDirection === 'higher' ? diffAbs > 0 : diffAbs < 0;

                  return (
                    <tr key={indicator.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        {indicator.name}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {indicator.category} · {indicator.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {formatValue(valA, indicator.decimals, indicator.prefix)}{' '}
                        <span className="text-[11px] text-slate-400">{indicator.unit}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatValue(valB, indicator.decimals, indicator.prefix)}{' '}
                        <span className="text-[11px] text-slate-400">{indicator.unit}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 text-xs">
                        {diffAbs > 0 ? '+' : ''}
                        {formatValue(diffAbs, indicator.decimals, indicator.prefix)}{' '}
                        {indicator.unit}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${
                            isBeneficial
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {diffAbs > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {diffAbs > 0 ? '+' : ''}
                          {diffPercent.toFixed(1).replace('.', ',')}%
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
