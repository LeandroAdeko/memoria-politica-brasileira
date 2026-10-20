import React, { useState, useMemo } from 'react';
import {
  PRESIDENTS,
  PresidentProfile,
  computePresidentLegacy,
  PresidentDataLegacy,
  LegacyMetricComparison,
} from '../data/presidentsData';
import {
  Search,
  Users,
  Calendar,
  Building2,
  BookOpen,
  Scale,
  Award,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  X,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Minus,
} from 'lucide-react';

interface PresidentsPageProps {
  onSelectYearOnTimeline: (year: number) => void;
}

export const PresidentsPage: React.FC<PresidentsPageProps> = ({
  onSelectYearOnTimeline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPresidentId, setSelectedPresidentId] = useState<string | null>(null);
  const [selectedMandateIndex, setSelectedMandateIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'bio' | 'laws' | 'programs' | 'legacy'>('bio');

  // Filter presidents based on search query
  const filteredPresidents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PRESIDENTS;
    return PRESIDENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.party.toLowerCase().includes(q) ||
        p.bio.summary.toLowerCase().includes(q) ||
        p.laws.some((l) => l.name.toLowerCase().includes(q) || l.number.toLowerCase().includes(q)) ||
        p.programs.some((pr) => pr.name.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const selectedPresident = useMemo(() => {
    return PRESIDENTS.find((p) => p.id === selectedPresidentId) || null;
  }, [selectedPresidentId]);

  // Compute legacy data dynamically from HISTORICAL_DATA
  const legacyData: PresidentDataLegacy | null = useMemo(() => {
    if (!selectedPresident) return null;
    return computePresidentLegacy(selectedPresident, selectedMandateIndex);
  }, [selectedPresident, selectedMandateIndex]);

  // Reset tab and mandate index when opening a new president
  const handleOpenPresident = (presidentId: string) => {
    setSelectedPresidentId(presidentId);
    setSelectedMandateIndex(0);
    setActiveTab('bio');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Institucional da Página */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Brazilian flag subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="h-full w-1/3 bg-[#009c3b]" />
          <div className="h-full w-1/3 bg-[#ffdf00]" />
          <div className="h-full w-1/3 bg-[#002776]" />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wide border border-emerald-200">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Galeria Presidencial • Nova República</span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Presidentes da República do Brasil
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            Explore os mandatos presidenciais de 1990 a 2024. Acesse biografias completas, as principais leis promulgadas, programas sociais e econômicos criados e o <strong>legado econômico comparativo (antes vs. depois)</strong> calculado a partir da nossa base de dados oficial.
          </p>
        </div>

        {/* Search bar & Stats */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por presidente, partido, lei ou programa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">
              {filteredPresidents.length} {filteredPresidents.length === 1 ? 'presidente' : 'presidentes'}
            </span>
            <span>• Período de 1990 a 2024</span>
          </div>
        </div>
      </div>

      {/* Grade de Cartões de Presidentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresidents.map((president) => {
          const quickLegacy = computePresidentLegacy(president, 0);

          return (
            <div
              key={president.id}
              onClick={() => handleOpenPresident(president.id)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-0.5"
            >
              {/* Top Banner do Cartão */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/70 to-white flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar / Brasão Presidencial */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-slate-900 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs border border-emerald-700/30 shrink-0 font-serif">
                    {president.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {president.orderNumber}º Presidente da República
                    </span>
                    <h3
                      className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-tight"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {president.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {president.party.split(' ')[0]}
                    </p>
                  </div>
                </div>

                {/* Badge de anos */}
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-[11px] font-mono font-semibold text-slate-700 shrink-0">
                  {president.mandates.map((m) => `${m.startYear}–${m.endYear}`).join(' / ')}
                </div>
              </div>

              {/* Corpo do Cartão */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {president.bio.summary}
                </p>

                {/* Métricas Rápidas Extraídas da Base HISTORICAL_DATA */}
                {quickLegacy && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">PIB Médio Anual</p>
                      <p
                        className={`text-xs font-mono font-bold ${
                          quickLegacy.averageGdpGrowth >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {quickLegacy.averageGdpGrowth >= 0 ? '+' : ''}
                        {quickLegacy.averageGdpGrowth.toFixed(1)}% a.a.
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Inflação Média</p>
                      <p className="text-xs font-mono font-bold text-slate-800">
                        {quickLegacy.averageInflation.toFixed(1)}% a.a.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags de Legislação & Programas */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    {president.laws.length} Leis marcantes
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {president.programs.length} Programas
                  </span>
                </div>
              </div>

              {/* Botão de Rodapé */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:bg-emerald-50/50 group-hover:text-emerald-900 transition-colors">
                <span>Ver Perfil e Legado Completo</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel Detalhado do Presidente (Slide-over / Modal) */}
      {selectedPresident && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedPresidentId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Painel Detalhado */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white relative">
              {/* Brazilian Tricolor Top Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="h-full w-1/3 bg-[#009c3b]" />
                <div className="h-full w-1/3 bg-[#ffdf00]" />
                <div className="h-full w-1/3 bg-[#002776]" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-800 text-amber-300 font-bold flex items-center justify-center text-xl sm:text-2xl shadow-lg border-2 border-white/20 shrink-0 font-serif">
                    {selectedPresident.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        {selectedPresident.orderNumber}º Presidente do Brasil
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs text-white/80 font-mono">
                        {selectedPresident.party}
                      </span>
                    </div>

                    <h2
                      className="text-xl sm:text-3xl font-bold tracking-tight text-white"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {selectedPresident.fullName}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-3 pt-1">
                      <span>
                        <strong>Vice-Presidente:</strong> {selectedPresident.vicePresident}
                      </span>
                      {selectedPresident.coalition && (
                        <span>
                          <strong>Coligação:</strong> {selectedPresident.coalition}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPresidentId(null)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Fechar painel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Botão de atalho para a Linha do Tempo e Seletor de Mandato */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {selectedPresident.mandates.length > 1 ? (
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/10 text-xs">
                    {selectedPresident.mandates.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedMandateIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                          selectedMandateIndex === idx
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-white/70 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {selectedPresident.mandates[0].period}
                  </span>
                )}

                <button
                  onClick={() => {
                    const year = selectedPresident.mandates[selectedMandateIndex].startYear;
                    onSelectYearOnTimeline(year);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>Ver na Linha do Tempo ({selectedPresident.mandates[selectedMandateIndex].startYear})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto text-xs sm:text-sm font-semibold shrink-0">
              <button
                onClick={() => setActiveTab('bio')}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'bio'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Biografia & Trajetória</span>
              </button>

              <button
                onClick={() => setActiveTab('laws')}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'laws'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Principais Leis Aprovadas ({selectedPresident.laws.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'programs'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Programas & Projetos ({selectedPresident.programs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('legacy')}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'legacy'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Legado Econômico (Antes x Depois)</span>
              </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* ================= ABA 1: BIOGRAFIA ================= */}
              {activeTab === 'bio' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Resumo executivo */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs uppercase font-bold tracking-wider text-emerald-800 mb-1">
                      Visão Geral da Presidência
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {selectedPresident.bio.summary}
                    </p>
                  </div>

                  {/* Ficha biográfica */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <p className="text-xs text-slate-400 font-medium">Nascimento & Origem</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedPresident.bio.birthDate}
                      </p>
                      <p className="text-xs text-slate-600">{selectedPresident.bio.birthPlace}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <p className="text-xs text-slate-400 font-medium">Formação & Trajetória Prévia</p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedPresident.bio.educationAndCareer}
                      </p>
                    </div>
                  </div>

                  {/* Ascensão e Desfecho */}
                  <div className="space-y-4">
                    <div className="border-l-3 border-emerald-600 pl-4 py-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        Eleição e Chegada à Presidência
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {selectedPresident.bio.roadToPresidency}
                      </p>
                    </div>

                    <div className="border-l-3 border-amber-500 pl-4 py-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        Desfecho do Mandato e Transição
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {selectedPresident.bio.mandateConclusion}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= ABA 2: LEIS APROVADAS ================= */}
              {activeTab === 'laws' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-500">
                    Principais marcos regulatórios, códigos e emendas constitucionais sancionados durante a gestão:
                  </p>

                  <div className="grid grid-cols-1 gap-3.5">
                    {selectedPresident.laws.map((law, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                              {law.number}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{law.name}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Ano {law.year}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                              {law.category}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {law.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= ABA 3: PROGRAMAS ================= */}
              {activeTab === 'programs' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-500">
                    Projetos estruturantes e políticas públicas criadas ou consolidadas pelo governo:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPresident.programs.map((prog, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{prog.name}</h4>
                            <span className="text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {prog.year}
                            </span>
                          </div>
                          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {prog.category}
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {prog.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg">
                          <strong>Impacto social/econômico:</strong> {prog.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= ABA 4: LEGADO ECONÔMICO (ANTES x DEPOIS) ================= */}
              {activeTab === 'legacy' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Bloco 1: Considerações Narrativas de Conjuntura (Antes x Depois) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-700" />
                      Análise de Conjuntura: Como Estava Antes vs. Como Ficou Depois
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Como estava antes */}
                      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Situação Herdada (Como Estava Antes)
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                          {selectedPresident.economicLegacy.beforeContext}
                        </p>
                      </div>

                      {/* Como ficou depois */}
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-[#009c3b]" />
                          Resultado Entregue (Como Ficou Depois)
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                          {selectedPresident.economicLegacy.afterContext}
                        </p>
                      </div>
                    </div>

                    {/* Durante a gestão & Síntese */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                      <p>
                        <strong>Durante a gestão:</strong>{' '}
                        {selectedPresident.economicLegacy.duringGovernance}
                      </p>
                      <p className="pt-2 border-t border-slate-200 text-slate-900 font-semibold">
                        <strong>Síntese Histórica:</strong> {selectedPresident.economicLegacy.synthesis}
                      </p>
                    </div>
                  </div>

                  {/* Bloco 2: Dados Quantitativos Oficiais da Base HISTORICAL_DATA */}
                  {legacyData && (
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#002776]" />
                            Métricas Oficiais do Mandato (Extraídas da Base de Dados)
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Comparativo direto entre o ano base (<strong>{legacyData.beforeYearRecord.year}</strong>) e o encerramento do mandato (<strong>{legacyData.afterYearRecord.year}</strong>).
                          </p>
                        </div>

                        {/* Média PIB e Inflação */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
                            PIB Médio: {legacyData.averageGdpGrowth >= 0 ? '+' : ''}
                            {legacyData.averageGdpGrowth.toFixed(1)}% a.a.
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold">
                            Inflação Média: {legacyData.averageInflation.toFixed(1)}% a.a.
                          </div>
                        </div>
                      </div>

                      {/* Tabela de Indicadores Antes x Depois */}
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="py-2.5 px-3">Indicador</th>
                              <th className="py-2.5 px-3 text-right">
                                Antes ({legacyData.beforeYearRecord.year})
                              </th>
                              <th className="py-2.5 px-3 text-right">
                                Depois ({legacyData.afterYearRecord.year})
                              </th>
                              <th className="py-2.5 px-3 text-right">Variação Real</th>
                              <th className="py-2.5 px-3 text-right">Variação %</th>
                              <th className="py-2.5 px-3 text-center">Impacto Social</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {legacyData.metrics.map((m) => {
                              const isPositive = m.isPositiveForSociety === true;
                              const isNegative = m.isPositiveForSociety === false;

                              return (
                                <tr key={m.indicator.id} className="hover:bg-slate-50/70">
                                  <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                                    {m.indicator.name}
                                    <span className="text-[10px] text-slate-400 block font-normal">
                                      {m.indicator.unit}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-slate-600">
                                    {m.beforeValue.toLocaleString('pt-BR', {
                                      minimumFractionDigits: m.indicator.decimals,
                                      maximumFractionDigits: m.indicator.decimals,
                                    })}
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                                    {m.afterValue.toLocaleString('pt-BR', {
                                      minimumFractionDigits: m.indicator.decimals,
                                      maximumFractionDigits: m.indicator.decimals,
                                    })}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <span
                                      className={`font-semibold ${
                                        isPositive
                                          ? 'text-emerald-700'
                                          : isNegative
                                          ? 'text-rose-700'
                                          : 'text-slate-600'
                                      }`}
                                    >
                                      {m.changeAbs > 0 ? '+' : ''}
                                      {m.changeAbs.toLocaleString('pt-BR', {
                                        minimumFractionDigits: m.indicator.decimals,
                                        maximumFractionDigits: m.indicator.decimals,
                                      })}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <span
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                                        isPositive
                                          ? 'bg-emerald-50 text-emerald-800'
                                          : isNegative
                                          ? 'bg-rose-50 text-rose-800'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {m.changePercent > 0 ? (
                                        <TrendingUp className="w-3 h-3" />
                                      ) : m.changePercent < 0 ? (
                                        <TrendingDown className="w-3 h-3" />
                                      ) : (
                                        <Minus className="w-3 h-3" />
                                      )}
                                      {m.changePercent > 0 ? '+' : ''}
                                      {m.changePercent.toFixed(1)}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    {isPositive ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Melhoria
                                      </span>
                                    ) : isNegative ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-sans font-semibold">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Alerta
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 font-sans">
                                        Estável
                                      </span>
                                    )}
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
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Fontes: IBGE, IPEA, Banco Central, Presidência da República e Legislação Federal</span>
              <button
                onClick={() => setSelectedPresidentId(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
