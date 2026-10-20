/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  HISTORICAL_DATA,
  INDICATORS,
  IndicatorMeta,
  YearRecord,
} from './data/brazilHistoryData';
import { TopBar } from './components/TopBar';
import { TimelineNav } from './components/TimelineNav';
import { PoliticalContextBanner } from './components/PoliticalContextBanner';
import { IndicatorCard } from './components/IndicatorCard';
import { IndicatorDetailModal } from './components/IndicatorDetailModal';
import { MethodologyModal } from './components/MethodologyModal';
import { MinimalistHome } from './components/MinimalistHome';
import { ComparePage } from './components/ComparePage';
import { PresidentsPage } from './components/PresidentsPage';
import { PoliticalEventsPage } from './components/PoliticalEventsPage';
import { PoliticalDataAdminPage } from './components/admin/PoliticalDataAdminPage';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Search, SlidersHorizontal, Sparkles, ExternalLink, GitCompare, Users, Network, Database } from 'lucide-react';

export default function App() {
  // View mode: 'full', 'minimalist', 'compare', 'presidents', 'events', or 'admin'
  const [viewMode, setViewMode] = useState<'full' | 'minimalist' | 'compare' | 'presidents' | 'events' | 'admin'>('minimalist');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Default to the latest year (2024)
  const [selectedYear, setSelectedYear] = useState<YearRecord>(
    HISTORICAL_DATA[HISTORICAL_DATA.length - 1]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [inspectingIndicator, setInspectingIndicator] = useState<IndicatorMeta | null>(null);

  const timelineSectionRef = useRef<HTMLDivElement>(null);
  const indicatorsSectionRef = useRef<HTMLDivElement>(null);

  // Auto-play timeline progression
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedYear((prev) => {
          const currentIndex = HISTORICAL_DATA.findIndex((y) => y.year === prev.year);
          if (currentIndex < HISTORICAL_DATA.length - 1) {
            return HISTORICAL_DATA[currentIndex + 1];
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Keyboard navigation for timeline
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedYear((prev) => {
          const idx = HISTORICAL_DATA.findIndex((y) => y.year === prev.year);
          return idx > 0 ? HISTORICAL_DATA[idx - 1] : prev;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedYear((prev) => {
          const idx = HISTORICAL_DATA.findIndex((y) => y.year === prev.year);
          return idx < HISTORICAL_DATA.length - 1 ? HISTORICAL_DATA[idx + 1] : prev;
        });
      } else if (e.key === ' ' || e.code === 'Space') {
        // Toggle play with spacebar
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter indicators based on category and search query
  const filteredIndicators = INDICATORS.filter((ind) => {
    const matchesCategory =
      selectedCategory === 'all' || ind.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Todos os Indicadores' },
    { id: 'social', label: 'Social & Fome' },
    { id: 'saude', label: 'Saúde & Longevidade' },
    { id: 'educacao', label: 'Educação' },
    { id: 'economia', label: 'Economia & Renda' },
    { id: 'meio_ambiente', label: 'Meio Ambiente' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans">
      {/* Navigation Drawer Overlay */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={
          viewMode === 'full'
            ? 'home-full'
            : viewMode === 'minimalist'
            ? 'home-minimalist'
            : viewMode
        }
        onNavigate={(page) => {
          if (page === 'home-full') setViewMode('full');
          else if (page === 'home-minimalist') setViewMode('minimalist');
          else setViewMode(page);
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Clean Top Bar with Menu button & Icon Toggle */}
      <TopBar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenMenu={() => setIsDrawerOpen(true)}
      />

      {/* Shared Sticky Timeline directly below Header only for full and minimalist views */}
      {(viewMode === 'full' || viewMode === 'minimalist') && (
        <TimelineNav
          years={HISTORICAL_DATA}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
        />
      )}

      {viewMode === 'admin' ? (
        /* ================= DEDICATED ADMIN & HEXAGONAL FORMS PAGE ================= */
        <PoliticalDataAdminPage
          onNavigateToEvents={() => setViewMode('events')}
          onNavigateHome={() => setViewMode('minimalist')}
        />
      ) : viewMode === 'events' ? (
        /* ================= DEDICATED POLITICAL EVENTS & GRAPH PAGE ================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PoliticalEventsPage
            onSelectYearOnTimeline={(year) => {
              const yr = HISTORICAL_DATA.find((y) => y.year === year) || selectedYear;
              setSelectedYear(yr);
              setViewMode('full');
            }}
            onNavigateToAdmin={() => setViewMode('admin')}
          />
        </main>
      ) : viewMode === 'presidents' ? (
        /* ================= DEDICATED PRESIDENTS PAGE ================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PresidentsPage
            onSelectYearOnTimeline={(year) => {
              const yr = HISTORICAL_DATA.find((y) => y.year === year) || selectedYear;
              setSelectedYear(yr);
              setViewMode('full');
            }}
          />
        </main>
      ) : viewMode === 'compare' ? (
        /* ================= DEDICATED COMPARE PAGE ================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ComparePage
            initialYearA={1994}
            initialYearB={selectedYear.year}
          />
        </main>
      ) : viewMode === 'minimalist' ? (
        /* ================= ULTRA-SIMPLE MINIMALIST HOME ================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MinimalistHome
            years={HISTORICAL_DATA}
            selectedYear={selectedYear}
          />
        </main>
      ) : (
        /* ================= FULL EDITORIAL RICH HOME ================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Political Context Banner for Selected Year */}
            <PoliticalContextBanner currentYear={selectedYear} />

            {/* Indicators Section */}
            <section ref={indicatorsSectionRef} className="space-y-6">
              {/* Section Header & Interactive Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-[#009c3b]" />
                    Painel Oficial de Indicadores
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                    Indicadores Nacionais e Variação Anual ({selectedYear.year})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                    Valores calculados em comparação com o ano imediatamente anterior, com destaque para a memória política brasileira.
                  </p>
                </div>

                {/* Actions Toolbar: Comparar Anos & Search Input */}
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setViewMode('compare')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 shadow-2xs"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Comparar Anos</span>
                  </button>

                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar indicador..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Category Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 text-xs flex items-center gap-1 mr-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtrar:
                </span>
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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

              {/* Indicators Grid */}
              {filteredIndicators.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-600">
                    Nenhum indicador encontrado para a busca &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIndicators.map((indicator) => (
                    <IndicatorCard
                      key={indicator.id}
                      indicator={indicator}
                      currentYear={selectedYear}
                      allYears={HISTORICAL_DATA}
                      onOpenDetail={setInspectingIndicator}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Milestone Callout Section at base of Home */}
            <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#002776] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-300 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Memória Cívica e Continuidade Republicana
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                  Como navegar e interpretar os dados históricos?
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
                  Utilize os seletores da linha do tempo no topo ou as teclas de seta do teclado (← e →) para transitar entre os anos e acompanhar a evolução dos indicadores da fome, escolaridade, saúde, economia e desmatamento. Clique em qualquer cartão para ver o gráfico completo de 1990 a 2024 e o histórico comparado por mandatos presidenciais.
                </p>
              </div>
            </section>
          </main>
      )}

      {/* Institutional Sources & Methodology Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                Fontes Primárias & Governança de Dados
              </span>
              <h4 className="text-base font-bold font-serif text-slate-900">
                Memória Política do Brasil (1990–2024)
              </h4>
              <p className="text-xs text-slate-500 max-w-2xl">
                Estatísticas públicas oficiais consolidadas a partir de órgãos técnicos de Estado e agências multilaterais das Nações Unidas, sem viés partidário.
              </p>
            </div>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Ver Metodologia & Detalhamento das Fontes</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-slate-600">
            <a
              href="https://www.ibge.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">IBGE</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">PNAD, IPCA, PIB e Censos</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">ibge.gov.br ↗</span>
            </a>

            <a
              href="https://www.ipea.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">IPEA / DIEESE</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Salário real e Gini</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">ipea.gov.br ↗</span>
            </a>

            <a
              href="https://www.bcb.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">Banco Central</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Séries e metas de inflação</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">bcb.gov.br ↗</span>
            </a>

            <a
              href="https://datasus.saude.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">Min. Saúde</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">DATASUS e mortalidade</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">datasus.saude.gov.br ↗</span>
            </a>

            <a
              href="https://terrabrasilis.dpi.inpe.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">INPE / PRODES</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Desmatamento Amazônia</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">terrabrasilis.inpe.br ↗</span>
            </a>

            <a
              href="https://olheparaafome.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 hover:bg-emerald-50/80 p-3 rounded-lg border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">FAO & PENSSAN</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Insegurança alimentar</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 group-hover:underline">olheparaafome.com.br ↗</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-slate-400">
            <span>Memória Política do Brasil — Projeto cívico e educacional aberto.</span>
            <span>Sem afiliação político-partidária.</span>
          </div>
        </div>
      </footer>

      {/* Indicator Deep-Dive Modal */}
      {inspectingIndicator && (
        <IndicatorDetailModal
          indicator={inspectingIndicator}
          currentYear={selectedYear}
          allYears={HISTORICAL_DATA}
          onSelectYear={setSelectedYear}
          onClose={() => setInspectingIndicator(null)}
        />
      )}

      {/* Methodology Modal */}
      {isMethodologyOpen && (
        <MethodologyModal onClose={() => setIsMethodologyOpen(false)} />
      )}
    </div>
  );
}

