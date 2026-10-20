import React, { useState, useMemo } from 'react';
import {
  POLITICAL_EVENTS,
  EVENT_CATEGORIES,
  POLITICAL_ACTORS,
  MACRO_SCENARIOS,
  PoliticalEvent,
  EventCategory,
  PoliticalActor,
  ActorInvolvement,
  getActorsForEvent,
  getRelatedEvents,
  getCategoriesForEvent,
} from '../data/politicalEventsData';
import { usePoliticalData } from '../hooks/usePoliticalData';
import {
  Network,
  List,
  Users,
  Search,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Scale,
  ShieldAlert,
  HelpCircle,
  FileText,
  Filter,
  Layers,
  ChevronRight,
  X,
  Clock,
  Sparkles,
  Vote,
  Building,
  Plus,
  CheckCircle2,
  XCircle,
  UserCheck,
} from 'lucide-react';

interface PoliticalEventsPageProps {
  onSelectYearOnTimeline: (year: number) => void;
  onNavigateToAdmin?: () => void;
}

export const PoliticalEventsPage: React.FC<PoliticalEventsPageProps> = ({
  onSelectYearOnTimeline,
  onNavigateToAdmin,
}) => {
  const {
    events: liveEvents,
    categories: liveCategories,
    actors: liveActors,
    scenarios: liveScenarios,
  } = usePoliticalData();

  const events = liveEvents.length > 0 ? liveEvents : POLITICAL_EVENTS;
  const categories = liveCategories.length > 0 ? liveCategories : EVENT_CATEGORIES;
  const actors = liveActors.length > 0 ? liveActors : POLITICAL_ACTORS;
  const scenarios = liveScenarios.length > 0 ? liveScenarios : MACRO_SCENARIOS;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'graph' | 'actors'>('cards');
  const [inspectingEventId, setInspectingEventId] = useState<string | null>(null);

  // Filtros interativos para a votação nominal da PEC
  const [voteStatusFilter, setVoteStatusFilter] = useState<'ALL' | 'SIM' | 'NÃO' | 'ABSTENÇÃO'>('ALL');
  const [voteQuery, setVoteQuery] = useState<string>('');
  const [actorSearchQuery, setActorSearchQuery] = useState<string>('');

  const getActorsForEventDynamic = (eventId: string) => {
    const result: { actor: PoliticalActor; involvement: ActorInvolvement }[] = [];
    for (const actor of actors) {
      for (const inv of actor.involvements) {
        if (inv.eventId === eventId) {
          result.push({ actor, involvement: inv });
        }
      }
    }
    return result;
  };

  const getRelatedEventsDynamic = (eventId: string) => {
    const current = events.find((e) => e.id === eventId);
    if (!current) return [];
    const result: { event: PoliticalEvent; edge: any; isOutgoing: boolean }[] = [];
    for (const edge of current.relatedEventEdges) {
      const target = events.find((e) => e.id === edge.targetEventId);
      if (target) {
        result.push({ event: target, edge, isOutgoing: true });
      }
    }
    for (const other of events) {
      if (other.id === eventId) continue;
      for (const edge of other.relatedEventEdges) {
        if (edge.targetEventId === eventId) {
          result.push({ event: other, edge, isOutgoing: false });
        }
      }
    }
    return result;
  };

  // Filtragem dos eventos
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filtro de categoria
      const matchesCategory =
        selectedCategoryId === 'all' || event.categoryIds.includes(selectedCategoryId);

      // Filtro de macrocenário
      const matchesScenario =
        selectedScenarioId === 'all' || event.scenarioId === selectedScenarioId;

      // Filtro de busca
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.shortTitle.toLowerCase().includes(q) ||
        event.summary.toLowerCase().includes(q) ||
        event.keyPoints.some((p) => p.toLowerCase().includes(q)) ||
        event.sources.some((s) => s.title.toLowerCase().includes(q));

      return matchesCategory && matchesScenario && matchesSearch;
    });
  }, [events, selectedCategoryId, selectedScenarioId, searchQuery]);

  const inspectingEvent = useMemo(() => {
    return events.find((e) => e.id === inspectingEventId) || null;
  }, [events, inspectingEventId]);

  const inspectingEventActors = useMemo(() => {
    if (!inspectingEvent) return [];
    return getActorsForEventDynamic(inspectingEvent.id);
  }, [inspectingEvent, actors]);

  const inspectingEventRelated = useMemo(() => {
    if (!inspectingEvent) return [];
    return getRelatedEventsDynamic(inspectingEvent.id);
  }, [inspectingEvent, events]);

  // Votação nominal filtrada interativamente dentro do fato/PEC
  const filteredIndividualVotes = useMemo(() => {
    if (!inspectingEvent?.legislativeDetails?.individualVotes) return [];
    return inspectingEvent.legislativeDetails.individualVotes.filter((v) => {
      const matchesStatus =
        voteStatusFilter === 'ALL' ||
        (voteStatusFilter === 'SIM' && v.vote === 'SIM') ||
        (voteStatusFilter === 'NÃO' && v.vote === 'NÃO') ||
        (voteStatusFilter === 'ABSTENÇÃO' &&
          (v.vote === 'ABSTENÇÃO' || v.vote === 'OBSTRUÇÃO' || v.vote === 'AUSENTE'));

      const q = voteQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        v.politicianName.toLowerCase().includes(q) ||
        v.party.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q) ||
        (v.notes && v.notes.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [inspectingEvent, voteStatusFilter, voteQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Institucional da Página */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="h-full w-1/3 bg-[#009c3b]" />
          <div className="h-full w-1/3 bg-[#ffdf00]" />
          <div className="h-full w-1/3 bg-[#002776]" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold tracking-wide border border-blue-200">
              <Network className="w-3.5 h-3.5 text-blue-700" />
              <span>Rede Causal & Fatos Políticos • Grafo Relacional</span>
            </div>

            <h1
              className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Grafo de Fatos Políticos, PECs & Escândalos
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              Mapeamento estruturado de Propostas de Emenda Constitucional, grandes investigações, CPIs e marcos regulatórios. Os fatos são nós centrais com conexões causais entre si, e <strong>os atores e partidos apontam para os fatos</strong> informando seu papel e o ano de início de seu envolvimento.
            </p>
          </div>

          {onNavigateToAdmin && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002776] hover:bg-blue-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Fato</span>
              </button>
            </div>
          )}
        </div>

        {/* Barra de Filtros, Cenários e Alternador de Visão */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Seletor de Macrocenário */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Cenário:
            </span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
            >
              <option value="all">Todos os Cenários Históricos</option>
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.title} ({sc.period})
                </option>
              ))}
            </select>
          </div>

          {/* Alternador de Modo de Visualização */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista de Fatos</span>
            </button>

            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-white text-blue-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Grafo de Relações</span>
            </button>

            <button
              onClick={() => setViewMode('actors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'actors'
                  ? 'bg-white text-amber-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Atores & Votos</span>
            </button>
          </div>
        </div>

        {/* Tabela de Categorias como Filtro Dinâmico */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-xs flex items-center gap-1 mr-1 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" />
            Categorias:
          </span>

          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategoryId === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Todas ({events.length})
          </button>

          {categories.map((cat) => {
            const count = events.filter((e) => e.categoryIds.includes(cat.id)).length;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? `${cat.badgeBg} ${cat.badgeText} font-bold border ${cat.badgeBorder} shadow-2xs`
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.shortLabel}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MODO 1: LISTA / CARDS DE FATOS ================= */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Barra de busca */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, PEC, escândalo, tema ou palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const categories = getCategoriesForEvent(event.categoryIds);
              const actors = getActorsForEvent(event.id);
              const related = getRelatedEvents(event.id);

              return (
                <div
                  key={event.id}
                  onClick={() => setInspectingEventId(event.id)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Header do Card com Ano e Categorias */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {categories.map((c) => (
                          <span
                            key={c.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${c.badgeBg} ${c.badgeText} ${c.badgeBorder}`}
                          >
                            {c.shortLabel}
                          </span>
                        ))}
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-800">
                        Ano {event.year}
                      </span>
                    </div>

                    <h3
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                      {event.summary}
                    </p>

                    {/* Pontos mais relevantes da matéria */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Pontos Mais Relevantes:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {event.keyPoints.slice(0, 2).map((kp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                            <span className="text-emerald-700 font-bold shrink-0">•</span>
                            <span className="line-clamp-2">{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Badge de Votação Nominal disponível */}
                    {event.legislativeDetails?.individualVotes &&
                      event.legislativeDetails.individualVotes.length > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[11px] font-semibold text-emerald-950">
                          <Vote className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>
                            Votação Nominal: {event.legislativeDetails.individualVotes.length} votos cadastrados ({event.legislativeDetails.individualVotes.filter((v) => v.vote === 'SIM').length} SIM / {event.legislativeDetails.individualVotes.filter((v) => v.vote === 'NÃO').length} NÃO)
                          </span>
                        </div>
                      )}

                    {/* Relações em Grafo */}
                    {related.length > 0 && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <Network className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">
                          Conectado a: <strong>{related[0].event.shortTitle}</strong>
                          {related.length > 1 ? ` (+${related.length - 1})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rodapé com Atores vinculados & Fontes com link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {actors.length} {actors.length === 1 ? 'ator vinculado' : 'atores vinculados'}
                    </span>

                    <span className="inline-flex items-center gap-1 text-blue-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Ver Grafo & Detalhes
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODO 2: VISÃO EM GRAFO DE RELAÇÕES ================= */}
      {viewMode === 'graph' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-700" />
                Mapa Interativo de Conexões entre Fatos
              </h3>
              <p className="text-xs text-slate-500">
                Clique em qualquer nó de fato para inspecionar seus desdobramentos causais e atores associados.
              </p>
            </div>

            {/* Legenda de Tipos de Relação */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                → Consequência
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-900 border border-rose-200">
                ⚡ Gatilho / Investigou
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
                ↺ Substitui / Altera
              </span>
            </div>
          </div>

          {/* Representação em Matriz/Grafo de Conexões */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Lista de Nós do Grafo */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nós da Rede ({filteredEvents.length} eventos)
              </p>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredEvents.map((ev) => {
                  const isSelected = inspectingEventId === ev.id;
                  const categories = getCategoriesForEvent(ev.categoryIds);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setInspectingEventId(ev.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {ev.year}
                        </span>
                        <div className="flex items-center gap-1">
                          {categories.slice(0, 1).map((c) => (
                            <span
                              key={c.id}
                              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${c.badgeBg} ${c.badgeText}`}
                            >
                              {c.shortLabel}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {ev.shortTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {ev.relatedEventEdges.length} conexões com outros fatos
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Colunas 2 & 3: Visualizador do Nó Selecionado & Suas Conexões */}
            <div className="lg:col-span-2 bg-slate-50/70 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              {inspectingEvent ? (
                <div className="space-y-6">
                  {/* Nó Central */}
                  <div className="p-4 bg-white rounded-xl border-2 border-blue-600 shadow-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        Nó Central Ativo
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700">
                        Ano {inspectingEvent.year}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      {inspectingEvent.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {inspectingEvent.summary}
                    </p>
                  </div>

                  {/* Arestas de Conexão Causal */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-blue-600" />
                      Fatos Conectados no Grafo:
                    </h5>

                    {inspectingEventRelated.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        Este fato não possui conexões causais registradas neste filtro.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inspectingEventRelated.map(({ event: relEvent, edge, isOutgoing }, idx) => (
                          <div
                            key={idx}
                            onClick={() => setInspectingEventId(relEvent.id)}
                            className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  edge.relationType === 'consequence_of'
                                    ? 'bg-blue-50 text-blue-800'
                                    : edge.relationType === 'triggered_by'
                                    ? 'bg-rose-50 text-rose-800'
                                    : 'bg-emerald-50 text-emerald-800'
                                }`}
                              >
                                {isOutgoing ? '→' : '←'}{' '}
                                {edge.relationType === 'consequence_of'
                                  ? 'Desdobramento'
                                  : edge.relationType === 'triggered_by'
                                  ? 'Gatilho / Estopim'
                                  : edge.relationType === 'investigates'
                                  ? 'Investigou'
                                  : edge.relationType === 'replaces_or_amends'
                                  ? 'Substitui'
                                  : 'Cenário'}
                              </span>
                              <span className="font-mono text-slate-500">{relEvent.year}</span>
                            </div>

                            <p className="text-xs font-bold text-slate-900 leading-snug">
                              {relEvent.shortTitle}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {edge.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Atores vinculados àquele nó */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Atores e Partidos que se Envolveram:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {inspectingEventActors.map(({ actor, involvement }, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs flex items-center gap-1.5"
                        >
                          <span className="font-semibold text-slate-900">{actor.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            (desde {involvement.startYear})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
                  <Network className="w-10 h-10 text-slate-300" />
                  <p className="text-xs font-medium">
                    Selecione um nó na lista ao lado para inspecionar as conexões no grafo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODO 3: ATORES & VOTAÇÕES ================= */}
      {viewMode === 'actors' && (
        <div className="space-y-6">
          {/* Barra de Busca de Atores e Políticos */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={actorSearchQuery}
                onChange={(e) => setActorSearchQuery(e.target.value)}
                placeholder="Buscar ator político, partido ou fato vinculado (ex: Arthur Lira, PL, Reforma Tributária)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              {actorSearchQuery && (
                <button
                  onClick={() => setActorSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-mono shrink-0">
              {
                actors.filter((a) => {
                  const q = actorSearchQuery.toLowerCase().trim();
                  return (
                    !q ||
                    a.name.toLowerCase().includes(q) ||
                    (a.party && a.party.toLowerCase().includes(q)) ||
                    a.involvements.some(
                      (inv) =>
                        inv.roleLabel.toLowerCase().includes(q) ||
                        (inv.notes && inv.notes.toLowerCase().includes(q))
                    )
                  );
                }).length
              }{' '}
              atores listados
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actors
              .filter((actor) => {
                const q = actorSearchQuery.toLowerCase().trim();
                return (
                  !q ||
                  actor.name.toLowerCase().includes(q) ||
                  (actor.party && actor.party.toLowerCase().includes(q)) ||
                  actor.involvements.some(
                    (inv) =>
                      inv.roleLabel.toLowerCase().includes(q) ||
                      (inv.notes && inv.notes.toLowerCase().includes(q))
                  )
                );
              })
              .map((actor) => (
                <div
                  key={actor.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {actor.type === 'party'
                          ? 'Partido Político / Bancada'
                          : 'Liderança Política'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{actor.name}</h3>
                    </div>

                    {actor.party && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-semibold text-slate-700">
                        {actor.party}
                      </span>
                    )}
                  </div>

                  {/* Lista de Fatos nos quais o Ator se Envolveu */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Fatos & Votações com Participação Cadastrada:
                    </p>

                    <div className="space-y-2.5">
                      {actor.involvements.map((inv, idx) => {
                        const event = events.find((e) => e.id === inv.eventId);
                        if (!event) return null;

                        const isVoteFor = inv.role === 'voted_for';
                        const isVoteAgainst = inv.role === 'voted_against';
                        const isGuidance = inv.role === 'party_guidance';

                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border space-y-2 text-xs transition-all ${
                              isVoteFor
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : isVoteAgainst
                                ? 'bg-rose-50/30 border-rose-200'
                                : isGuidance
                                ? 'bg-indigo-50/30 border-indigo-200'
                                : 'bg-slate-50 border-slate-200/80'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setInspectingEventId(event.id)}
                                className="text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline text-left inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>{event.shortTitle}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 shrink-0">
                                Desde {inv.startYear}
                              </span>
                            </div>

                            {/* Badge do Papel / Voto */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border ${
                                  isVoteFor
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : isVoteAgainst
                                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                                    : isGuidance
                                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                    : 'bg-slate-200 text-slate-800 border-slate-300'
                                }`}
                              >
                                {isVoteFor
                                  ? '🗳️ VOTO SIM (A FAVOR)'
                                  : isVoteAgainst
                                  ? '🗳️ VOTO NÃO (CONTRÁRIO)'
                                  : isGuidance
                                  ? '🏛️ ORIENTAÇÃO DE BANCADA'
                                  : inv.roleLabel}
                              </span>

                              {inv.roleLabel && !isVoteFor && !isVoteAgainst && !isGuidance && (
                                <span className="text-slate-600 font-medium">
                                  {inv.roleLabel}
                                </span>
                              )}
                            </div>

                            {inv.notes && (
                              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                                {inv.notes}
                              </p>
                            )}

                            {/* Fonte com Link Obrigatório */}
                            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Fonte Comprobatória:</span>
                              <a
                                href={inv.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 hover:underline"
                              >
                                <span>Acessar registro oficial</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= MODAL / PAINEL DETALHADO DO FATO ================= */}
      {inspectingEvent && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setInspectingEventId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal com Faixa Cívica */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white relative">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="h-full w-1/3 bg-[#009c3b]" />
                <div className="h-full w-1/3 bg-[#ffdf00]" />
                <div className="h-full w-1/3 bg-[#002776]" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoriesForEvent(inspectingEvent.categoryIds).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20"
                      >
                        {cat.name}
                      </span>
                    ))}
                    <span className="text-white/40">•</span>
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      Ano {inspectingEvent.year}
                    </span>
                  </div>

                  <h2
                    className="text-xl sm:text-2xl font-bold tracking-tight text-white"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {inspectingEvent.title}
                  </h2>
                </div>

                <button
                  onClick={() => setInspectingEventId(null)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Fechar painel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Botão de Atalho para a Linha do Tempo no Ano do Evento */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/70 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {inspectingEvent.date ? `Data: ${inspectingEvent.date}` : `Ano: ${inspectingEvent.year}`}
                </span>

                <button
                  onClick={() => {
                    onSelectYearOnTimeline(inspectingEvent.year);
                    setInspectingEventId(null);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  <span>Ver ano {inspectingEvent.year} na Linha do Tempo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Conteúdo com abas de pontos mais relevantes e cruzamentos */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* Síntese Geral */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Resumo do Fato:
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {inspectingEvent.summary}
                </p>
              </div>

              {/* Pontos Mais Relevantes */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Pontos Mais Relevantes da Matéria:
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {inspectingEvent.keyPoints.map((kp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalhes de Votação & Dados Nominais */}
              {inspectingEvent.legislativeDetails && (
                <div className="space-y-6 pt-4 border-t border-slate-200">
                  {/* Cabeçalho do Bloco Legislativo */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
                        <Vote className="w-5 h-5 text-blue-900" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          Sessão de Votação no Congresso Nacional
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          {inspectingEvent.legislativeDetails.officialCode}
                          {inspectingEvent.legislativeDetails.promulgatedLaw
                            ? ` • ${inspectingEvent.legislativeDetails.promulgatedLaw}`
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 1. Plenário e Quórum Qualificado */}
                  {inspectingEvent.legislativeDetails.houseVotes && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Placar Geral por Casa Legislativa:
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Quórum PEC: 308 (Câmara) • 49 (Senado)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {inspectingEvent.legislativeDetails.houseVotes.map((vote, idx) => {
                          const total = vote.yesVotes + vote.noVotes + vote.abstentions;
                          const yesPct = total > 0 ? ((vote.yesVotes / total) * 100).toFixed(1) : '0';
                          const noPct = total > 0 ? ((vote.noVotes / total) * 100).toFixed(1) : '0';

                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-slate-900 text-sm flex items-center gap-1.5">
                                  <Building className="w-3.5 h-3.5 text-blue-900" />
                                  {vote.house}
                                </span>
                                <span className="text-emerald-900 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                                  {vote.round} • {vote.result}
                                </span>
                              </div>

                              {/* Barra Proporcional de Votação */}
                              <div className="space-y-1">
                                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                                  <div
                                    className="h-full bg-emerald-600 transition-all"
                                    style={{ width: `${yesPct}%` }}
                                    title={`Sim: ${vote.yesVotes} (${yesPct}%)`}
                                  />
                                  <div
                                    className="h-full bg-rose-600 transition-all"
                                    style={{ width: `${noPct}%` }}
                                    title={`Não: ${vote.noVotes} (${noPct}%)`}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                  <span>{yesPct}% a favor</span>
                                  <span>{noPct}% contra</span>
                                </div>
                              </div>

                              {/* Placar Numérico */}
                              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/70 font-mono">
                                <div className="bg-white p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">SIM</span>
                                  <span className="font-bold text-sm text-emerald-700">{vote.yesVotes}</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-rose-800 block font-sans font-bold">NÃO</span>
                                  <span className="font-bold text-sm text-rose-700">{vote.noVotes}</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200">
                                  <span className="text-[10px] text-slate-500 block font-sans font-bold">ABST.</span>
                                  <span className="font-bold text-sm text-slate-600">{vote.abstentions}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Orientação das Bancadas Partidárias */}
                  {inspectingEvent.legislativeDetails.partyBreakdown &&
                    inspectingEvent.legislativeDetails.partyBreakdown.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Posicionamento e Orientação das Bancadas Partidárias:
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inspectingEvent.legislativeDetails.partyBreakdown.length} bancadas registradas
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {inspectingEvent.legislativeDetails.partyBreakdown.map((partyItem, idx) => {
                            const isYes = partyItem.guidance === 'SIM';
                            const isNo = partyItem.guidance === 'NÃO';
                            const total = partyItem.yesVotes + partyItem.noVotes + (partyItem.abstentions || 0);
                            const yesRatio = total > 0 ? Math.round((partyItem.yesVotes / total) * 100) : 0;

                            return (
                              <div
                                key={idx}
                                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="font-bold text-slate-900 truncate" title={partyItem.party}>
                                    {partyItem.party}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border shrink-0 ${
                                      isYes
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : isNo
                                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}
                                  >
                                    Bancada: {partyItem.guidance}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                                  <span className="text-emerald-700 font-semibold">{partyItem.yesVotes} SIM</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-rose-700 font-semibold">{partyItem.noVotes} NÃO</span>
                                  <span className="text-slate-400 font-sans text-[10px]">({yesRatio}% a favor)</span>
                                </div>

                                {partyItem.orientationNotes && (
                                  <p className="text-[10px] text-slate-500 leading-snug font-sans line-clamp-2">
                                    {partyItem.orientationNotes}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* 3. Votação Nominal dos Parlamentares ("Quem Votou de Qual Forma") */}
                  {inspectingEvent.legislativeDetails.individualVotes &&
                    inspectingEvent.legislativeDetails.individualVotes.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-emerald-800" />
                              Votação Nominal: Quem Votou de Qual Forma
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Registro nominal auditável de votos com link para a ata do Congresso Nacional
                            </p>
                          </div>

                          {/* Contadores Rápidos */}
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                              {
                                inspectingEvent.legislativeDetails.individualVotes.filter((v) => v.vote === 'SIM').length
                              }{' '}
                              SIM
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                              {
                                inspectingEvent.legislativeDetails.individualVotes.filter((v) => v.vote === 'NÃO').length
                              }{' '}
                              NÃO
                            </span>
                          </div>
                        </div>

                        {/* Barra de Filtros e Busca da Votação */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                          {/* Campo de Busca por Parlamentar, Partido ou Estado */}
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={voteQuery}
                              onChange={(e) => setVoteQuery(e.target.value)}
                              placeholder="Filtrar por nome do político, partido ou estado (ex: Arthur, PL, SP, Nikolas)..."
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-800 font-sans"
                            />
                            {voteQuery && (
                              <button
                                onClick={() => setVoteQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                              >
                                ×
                              </button>
                            )}
                          </div>

                          {/* Botões de Filtro de Voto */}
                          <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                            {(['ALL', 'SIM', 'NÃO', 'ABSTENÇÃO'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => setVoteStatusFilter(status)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  voteStatusFilter === status
                                    ? status === 'SIM'
                                      ? 'bg-emerald-700 text-white shadow-xs'
                                      : status === 'NÃO'
                                      ? 'bg-rose-700 text-white shadow-xs'
                                      : 'bg-slate-800 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {status === 'ALL'
                                  ? 'Todos'
                                  : status === 'SIM'
                                  ? 'Votaram SIM'
                                  : status === 'NÃO'
                                  ? 'Votaram NÃO'
                                  : 'Abstenções'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Lista dos Parlamentares e seus Votos */}
                        {filteredIndividualVotes.length === 0 ? (
                          <div className="p-6 rounded-xl bg-slate-50 text-center border border-slate-200 text-xs text-slate-500">
                            Nenhum parlamentar encontrado para o filtro selecionado.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
                            {filteredIndividualVotes.map((record, idx) => {
                              const isSim = record.vote === 'SIM';
                              const isNao = record.vote === 'NÃO';

                              return (
                                <div
                                  key={idx}
                                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                                    isSim
                                      ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                                      : isNao
                                      ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  {/* Nome e Partido */}
                                  <div className="flex items-start justify-between gap-1.5">
                                    <div>
                                      <span className="font-bold text-slate-900 block leading-tight">
                                        {record.politicianName}
                                      </span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-semibold text-slate-700">
                                          {record.party}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-blue-50 font-mono text-[10px] font-semibold text-blue-800">
                                          {record.state}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Badge do Voto */}
                                    <div
                                      className={`px-2 py-1 rounded-lg font-bold font-mono text-xs flex items-center gap-1 shrink-0 ${
                                        isSim
                                          ? 'bg-emerald-600 text-white'
                                          : isNao
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-600 text-white'
                                      }`}
                                    >
                                      {isSim ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      ) : isNao ? (
                                        <XCircle className="w-3.5 h-3.5" />
                                      ) : null}
                                      <span>VOTO {record.vote}</span>
                                    </div>
                                  </div>

                                  {/* Justificativa / Contexto */}
                                  {record.notes && (
                                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                                      {record.notes}
                                    </p>
                                  )}

                                  {/* Rodapé com link oficial da ata e botão de cruzamento */}
                                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                    <a
                                      href={record.officialVoteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 hover:underline"
                                    >
                                      <span>Ver ata na Câmara</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setInspectingEventId(null);
                                        setViewMode('actors');
                                        setActorSearchQuery(record.politicianName);
                                      }}
                                      className="text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                                      title="Ver participação deste político no grafo de atores"
                                    >
                                      <span>Ver no Grafo</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {/* Detalhes de Investigação / Escândalo (se houver) */}
              {inspectingEvent.investigationDetails && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    Apurações & Desfecho Institucional:
                  </h4>

                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2 text-xs text-slate-800">
                    <p>
                      <strong>Órgãos Investigadores:</strong>{' '}
                      {inspectingEvent.investigationDetails.investigatingBodies.join(', ')}
                    </p>
                    {inspectingEvent.investigationDetails.estimatedFinancialImpact && (
                      <p>
                        <strong>Impacto Financeiro Apurado:</strong>{' '}
                        {inspectingEvent.investigationDetails.estimatedFinancialImpact}
                      </p>
                    )}
                    {inspectingEvent.investigationDetails.legalOutcome && (
                      <p>
                        <strong>Desfecho Judicial:</strong>{' '}
                        {inspectingEvent.investigationDetails.legalOutcome}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Atores que apontam para o evento com startYear */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-800" />
                  Atores Políticos Vinculados a este Fato:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectingEventActors.map(({ actor, involvement }, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">{actor.name}</span>
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          Desde {involvement.startYear}
                        </span>
                      </div>

                      <p className="text-emerald-800 font-semibold text-[11px]">
                        {involvement.roleLabel}
                      </p>

                      {involvement.notes && (
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {involvement.notes}
                        </p>
                      )}

                      {/* Link da fonte do posicionamento */}
                      <a
                        href={involvement.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 hover:underline pt-1"
                      >
                        <span>Fonte do envolvimento oficial</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relações com outros eventos no Grafo */}
              {inspectingEventRelated.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Network className="w-4 h-4 text-blue-700" />
                    Relações com Outros Fatos no Grafo:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectingEventRelated.map(({ event: relEvent, edge, isOutgoing }, idx) => (
                      <div
                        key={idx}
                        onClick={() => setInspectingEventId(relEvent.id)}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-blue-800">
                            {isOutgoing ? 'Desdobramento →' : '← Causa/Origem'}
                          </span>
                          <p className="text-xs font-bold text-slate-900">{relEvent.shortTitle}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Ano {relEvent.year}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fontes Primárias com Links Obrigatórios */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                  Fontes Oficiais & Documentais (Sempre com Link):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectingEvent.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          {src.publisher}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-900 transition-colors">
                          {src.title}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-700 font-semibold group-hover:underline">
                        <span>Acessar documento na íntegra</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Fontes oficiais: Câmara dos Deputados, Senado Federal, STF e Banco Central</span>
              <button
                onClick={() => setInspectingEventId(null)}
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
