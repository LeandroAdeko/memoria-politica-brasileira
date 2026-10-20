import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GitBranch,
  Vote,
  ShieldAlert,
  Search,
} from 'lucide-react';
import {
  PoliticalEvent,
  EventCategory,
  MacroScenario,
  EventRelationType,
  EventRelationEdge,
  EventSource,
  PoliticianVoteRecord,
  PartyVoteSummary,
} from '../../data/politicalEventsData';
import { INDICATORS } from '../../data/brazilHistoryData';
import { PoliticalDataService } from '../../domain/services/PoliticalDataService';

interface PoliticalEventFormProps {
  service: PoliticalDataService;
  events: PoliticalEvent[];
  categories: EventCategory[];
  scenarios: MacroScenario[];
  onDataChange: () => void;
}

const RELATION_TYPES: { type: EventRelationType; label: string }[] = [
  { type: 'consequence_of', label: 'Desdobramento Causal de' },
  { type: 'triggered_by', label: 'Serviu de Gatilho para' },
  { type: 'reaction_to', label: 'Reação Política / Contramedida a' },
  { type: 'replaces_or_amends', label: 'Substitui, Altera ou Revoga' },
  { type: 'part_of_scenario', label: 'Integra Macro-Cenário com' },
  { type: 'investigates', label: 'Investigou / Apurou o Fato' },
];

export const PoliticalEventForm: React.FC<PoliticalEventFormProps> = ({
  service,
  events,
  categories,
  scenarios,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos principais
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');

  // Pontos relevantes
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);

  // Detalhes Legislativos (PEC / PL)
  const [hasLegislative, setHasLegislative] = useState(false);
  const [officialCode, setOfficialCode] = useState('');
  const [promulgatedLaw, setPromulgatedLaw] = useState('');
  const [houseVotes, setHouseVotes] = useState<any[]>([]);
  const [partyBreakdown, setPartyBreakdown] = useState<PartyVoteSummary[]>([]);
  const [individualVotes, setIndividualVotes] = useState<PoliticianVoteRecord[]>([]);

  // Detalhes Investigativos (Escândalo / CPI)
  const [hasInvestigation, setHasInvestigation] = useState(false);
  const [investigatingBodiesInput, setInvestigatingBodiesInput] = useState('');
  const [financialImpact, setFinancialImpact] = useState('');
  const [legalOutcome, setLegalOutcome] = useState('');

  // Conexões no Grafo
  const [edges, setEdges] = useState<EventRelationEdge[]>([]);

  // Indicadores socioeconômicos afetados
  const [selectedIndicatorIds, setSelectedIndicatorIds] = useState<string[]>([]);

  // Fontes (links obrigatórios)
  const [sources, setSources] = useState<EventSource[]>([
    { title: '', publisher: '', url: '' },
  ]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setShortTitle('');
    setYear(new Date().getFullYear());
    setDate('');
    setSummary('');
    setSelectedCategoryIds([]);
    setSelectedScenarioId('');
    setKeyPoints(['']);
    setHasLegislative(false);
    setOfficialCode('');
    setPromulgatedLaw('');
    setHouseVotes([]);
    setPartyBreakdown([]);
    setIndividualVotes([]);
    setHasInvestigation(false);
    setInvestigatingBodiesInput('');
    setFinancialImpact('');
    setLegalOutcome('');
    setEdges([]);
    setSelectedIndicatorIds([]);
    setSources([{ title: '', publisher: '', url: '' }]);
  };

  const handleEdit = (evt: PoliticalEvent) => {
    setEditingId(evt.id);
    setTitle(evt.title);
    setShortTitle(evt.shortTitle);
    setYear(evt.year);
    setDate(evt.date || '');
    setSummary(evt.summary);
    setSelectedCategoryIds(evt.categoryIds);
    setSelectedScenarioId(evt.scenarioId || '');
    setKeyPoints(evt.keyPoints.length > 0 ? evt.keyPoints : ['']);

    setHasLegislative(Boolean(evt.legislativeDetails));
    setOfficialCode(evt.legislativeDetails?.officialCode || '');
    setPromulgatedLaw(evt.legislativeDetails?.promulgatedLaw || '');
    setHouseVotes(evt.legislativeDetails?.houseVotes || []);
    setPartyBreakdown(evt.legislativeDetails?.partyBreakdown || []);
    setIndividualVotes(evt.legislativeDetails?.individualVotes || []);

    setHasInvestigation(Boolean(evt.investigationDetails));
    setInvestigatingBodiesInput(
      evt.investigationDetails?.investigatingBodies?.join(', ') || ''
    );
    setFinancialImpact(evt.investigationDetails?.estimatedFinancialImpact || '');
    setLegalOutcome(evt.investigationDetails?.legalOutcome || '');

    setEdges(evt.relatedEventEdges || []);
    setSelectedIndicatorIds(evt.impactedIndicatorIds || []);
    setSources(
      evt.sources.length > 0 ? evt.sources : [{ title: '', publisher: '', url: '' }]
    );
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleIndicator = (indId: string) => {
    setSelectedIndicatorIds((prev) =>
      prev.includes(indId) ? prev.filter((id) => id !== indId) : [...prev, indId]
    );
  };

  const addKeyPoint = () => setKeyPoints((prev) => [...prev, '']);
  const updateKeyPoint = (idx: number, val: string) =>
    setKeyPoints((prev) => prev.map((item, i) => (i === idx ? val : item)));
  const removeKeyPoint = (idx: number) =>
    setKeyPoints((prev) => prev.filter((_, i) => i !== idx));

  const addEdge = () =>
    setEdges((prev) => [
      ...prev,
      { targetEventId: '', relationType: 'consequence_of', description: '' },
    ]);
  const updateEdge = (idx: number, patch: Partial<EventRelationEdge>) =>
    setEdges((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  const removeEdge = (idx: number) => setEdges((prev) => prev.filter((_, i) => i !== idx));

  const addSource = () =>
    setSources((prev) => [...prev, { title: '', publisher: '', url: '' }]);
  const updateSource = (idx: number, patch: Partial<EventSource>) =>
    setSources((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  const removeSource = (idx: number) =>
    setSources((prev) => prev.filter((_, i) => i !== idx));

  // Handlers para votos nominais
  const addIndividualVote = () =>
    setIndividualVotes((prev) => [
      ...prev,
      {
        politicianName: '',
        party: '',
        state: 'DF',
        house: 'Câmara dos Deputados',
        round: '2º Turno',
        vote: 'SIM',
        notes: '',
        officialVoteUrl: 'https://www.camara.leg.br',
      },
    ]);
  const updateIndividualVote = (idx: number, patch: Partial<PoliticianVoteRecord>) =>
    setIndividualVotes((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  const removeIndividualVote = (idx: number) =>
    setIndividualVotes((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (selectedCategoryIds.length === 0) {
      setFeedback({ type: 'error', message: 'Selecione ao menos uma categoria para o fato.' });
      return;
    }

    // Filtrar fontes preenchidas
    const validSources = sources.filter((s) => s.title.trim() && s.url.trim());
    if (validSources.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Cadastre ao menos 1 fonte oficial com URL direta e válida (ex: http:// ou https://).',
      });
      return;
    }

    try {
      await service.registerEvent({
        id: editingId || undefined,
        title: title.trim(),
        shortTitle: shortTitle.trim() || title.trim(),
        year: Number(year),
        date: date.trim() || undefined,
        summary: summary.trim(),
        categoryIds: selectedCategoryIds,
        scenarioId: selectedScenarioId.trim() || undefined,
        keyPoints: keyPoints.filter((k) => k.trim().length > 0),
        legislativeDetails: hasLegislative
          ? {
              officialCode: officialCode.trim(),
              promulgatedLaw: promulgatedLaw.trim() || undefined,
              keyArticlesSummary: keyPoints.filter((k) => k.trim().length > 0),
              houseVotes: houseVotes.length > 0 ? houseVotes : undefined,
              partyBreakdown: partyBreakdown.length > 0 ? partyBreakdown : undefined,
              individualVotes:
                individualVotes.filter((v) => v.politicianName.trim()).length > 0
                  ? individualVotes.filter((v) => v.politicianName.trim())
                  : undefined,
            }
          : undefined,
        investigationDetails: hasInvestigation
          ? {
              investigatingBodies: investigatingBodiesInput
                .split(',')
                .map((b) => b.trim())
                .filter(Boolean),
              estimatedFinancialImpact: financialImpact.trim() || undefined,
              legalOutcome: legalOutcome.trim() || undefined,
            }
          : undefined,
        relatedEventEdges: edges.filter((e) => e.targetEventId && e.description.trim()),
        impactedIndicatorIds: selectedIndicatorIds,
        sources: validSources,
      });

      setFeedback({
        type: 'success',
        message: editingId
          ? `Fato "${title}" atualizado com sucesso!`
          : `Fato "${title}" registrado no repositório com sucesso!`,
      });
      resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar fato político.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Deseja realmente excluir o fato "${eventTitle}"?`)) return;
    try {
      await service.removeEvent(eventId);
      setFeedback({ type: 'success', message: `Fato "${eventTitle}" removido!` });
      if (editingId === eventId) resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao remover fato.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.year.toString().includes(searchQuery) ||
      e.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Formulário Isolado de Fatos Políticos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Editar Fato Político' : 'Cadastrar Novo Fato Político / PEC / Escândalo'}
              </h3>
              <p className="text-xs text-slate-500">
                Entidade central autônoma do grafo. Fatos possuem informações próprias e conexões de causa/efeito.
              </p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`mt-5 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Identificação Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título Oficial da Matéria / Fato *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: PEC do Teto de Gastos Públicos (PEC 241/55 -> EC 95)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título Curto *
              </label>
              <input
                type="text"
                required
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                placeholder="Ex: Teto de Gastos (EC 95)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ano de Ocorrência / Votação *
              </label>
              <input
                type="number"
                required
                min={1889}
                max={2100}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Data Precisa (Opcional)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vínculo a Macro-Cenário
              </label>
              <select
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              >
                <option value="">Nenhum cenário vinculado</option>
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title} ({sc.period})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seleção de Categorias N:N */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Categorias Associadas (Selecione uma ou mais) *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? `${cat.badgeBg} ${cat.badgeText} ${cat.badgeBorder} ring-2 ring-blue-800/20`
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.shortLabel}
                    {isSelected && <span className="text-[10px] ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Resumo Sintético e Contexto *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explique o fato político, suas causas, motivações e impacto..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
            />
          </div>

          {/* Pontos Mais Relevantes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pontos Mais Relevantes da Matéria / Fato
              </span>
              <button
                type="button"
                onClick={addKeyPoint}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Ponto
              </button>
            </div>
            {keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-5 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updateKeyPoint(idx, e.target.value)}
                  placeholder="Ex: Gatilhos de contenção em caso de descumprimento de despesas..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
                {keyPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyPoint(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Opcionais: Detalhes Legislativos e Investigativos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bloco Legislativo */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLegislative}
                    onChange={(e) => setHasLegislative(e.target.checked)}
                    className="rounded text-blue-900"
                  />
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Vote className="w-4 h-4 text-blue-900" />
                    É Matéria Legislativa / PEC?
                  </span>
                </label>
              </div>

              {hasLegislative && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Código Oficial da Proposição
                    </label>
                    <input
                      type="text"
                      value={officialCode}
                      onChange={(e) => setOfficialCode(e.target.value)}
                      placeholder="Ex: PEC 241/2016 (Câmara) / PEC 55/2016 (Senado)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Lei ou Emenda Promulgada
                    </label>
                    <input
                      type="text"
                      value={promulgatedLaw}
                      onChange={(e) => setPromulgatedLaw(e.target.value)}
                      placeholder="Ex: Emenda Constitucional nº 95/2016"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>

                  {/* Votos Nominais dos Parlamentares */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">
                        Votação Nominal ({individualVotes.length})
                      </span>
                      <button
                        type="button"
                        onClick={addIndividualVote}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:text-blue-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Adicionar Voto
                      </button>
                    </div>

                    {individualVotes.map((v, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-[11px]"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              value={v.politicianName}
                              onChange={(e) =>
                                updateIndividualVote(vIdx, { politicianName: e.target.value })
                              }
                              placeholder="Nome do Político (ex: Arthur Lira)"
                              className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              value={v.party}
                              onChange={(e) => updateIndividualVote(vIdx, { party: e.target.value })}
                              placeholder="Partido (ex: PP)"
                              className="w-full px-2 py-1 rounded border border-slate-200 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={v.state}
                              onChange={(e) => updateIndividualVote(vIdx, { state: e.target.value })}
                              placeholder="UF"
                              className="w-full px-2 py-1 rounded border border-slate-200 bg-white font-mono uppercase"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <select
                              value={v.vote}
                              onChange={(e) =>
                                updateIndividualVote(vIdx, {
                                  vote: e.target.value as any,
                                })
                              }
                              className={`w-full px-1.5 py-1 rounded border font-bold ${
                                v.vote === 'SIM'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : v.vote === 'NÃO'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-slate-50 text-slate-800 border-slate-300'
                              }`}
                            >
                              <option value="SIM">SIM</option>
                              <option value="NÃO">NÃO</option>
                              <option value="ABSTENÇÃO">ABST.</option>
                              <option value="OBSTRUÇÃO">OBSTR.</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={v.notes || ''}
                            onChange={(e) => updateIndividualVote(vIdx, { notes: e.target.value })}
                            placeholder="Contexto do voto ou justificativa..."
                            className="flex-1 px-2 py-1 rounded border border-slate-200 bg-white text-[10px]"
                          />
                          <input
                            type="url"
                            value={v.officialVoteUrl}
                            onChange={(e) =>
                              updateIndividualVote(vIdx, { officialVoteUrl: e.target.value })
                            }
                            placeholder="https://camara.leg.br/..."
                            className="flex-1 px-2 py-1 rounded border border-slate-200 bg-white text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeIndividualVote(vIdx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                            title="Remover voto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bloco Investigativo */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInvestigation}
                    onChange={(e) => setHasInvestigation(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    É Escândalo / Operação / CPI?
                  </span>
                </label>
              </div>

              {hasInvestigation && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Órgãos Investigadores (Separados por vírgula)
                    </label>
                    <input
                      type="text"
                      value={investigatingBodiesInput}
                      onChange={(e) => setInvestigatingBodiesInput(e.target.value)}
                      placeholder="Ex: Polícia Federal, Ministério Público Federal, TCU"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">
                        Impacto Financeiro Estimado
                      </label>
                      <input
                        type="text"
                        value={financialImpact}
                        onChange={(e) => setFinancialImpact(e.target.value)}
                        placeholder="Ex: R$ 42,8 bilhões"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">
                        Desfecho Jurídico / Institucional
                      </label>
                      <input
                        type="text"
                        value={legalOutcome}
                        onChange={(e) => setLegalOutcome(e.target.value)}
                        placeholder="Ex: Devoluções e acordos de leniência"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conexões de Grafo com Outros Fatos */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-700" />
                Conexões em Grafo (Relação de Causa / Desdobramento entre Fatos)
              </span>
              <button
                type="button"
                onClick={addEdge}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Relação
              </button>
            </div>

            {edges.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Nenhuma conexão cadastrada ainda. Você pode conectar este fato a outros fatos existentes no repositório.
              </p>
            ) : (
              edges.map((edge, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
                >
                  <select
                    value={edge.relationType}
                    onChange={(e) =>
                      updateEdge(idx, { relationType: e.target.value as EventRelationType })
                    }
                    className="px-2 py-1.5 rounded border border-slate-200 bg-slate-50 font-medium"
                  >
                    {RELATION_TYPES.map((r) => (
                      <option key={r.type} value={r.type}>
                        {r.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={edge.targetEventId}
                    onChange={(e) => updateEdge(idx, { targetEventId: e.target.value })}
                    className="px-2 py-1.5 rounded border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="">Selecione o Fato Destino...</option>
                    {events
                      .filter((ev) => ev.id !== editingId)
                      .map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.shortTitle} ({ev.year})
                        </option>
                      ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={edge.description}
                      onChange={(e) => updateEdge(idx, { description: e.target.value })}
                      placeholder="Explique a ligação entre eles..."
                      className="flex-1 px-2 py-1.5 rounded border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeEdge(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Indicadores Socioeconômicos Impactados */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Indicadores da Base Histórica Correlacionados
            </label>
            <div className="flex flex-wrap gap-2">
              {INDICATORS.map((ind) => {
                const isSelected = selectedIndicatorIds.includes(ind.id);
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => toggleIndicator(ind.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {ind.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fontes Oficiais Obrigatórias */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Fontes Oficiais & Documentais (Links Obrigatórios) *
                </span>
                <span className="text-[11px] text-slate-500">
                  Todo fato deve possuir comprovação por portal oficial governamental ou veículo de apuração.
                </span>
              </div>
              <button
                type="button"
                onClick={addSource}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Fonte
              </button>
            </div>

            {sources.map((src, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
              >
                <input
                  type="text"
                  required
                  value={src.title}
                  onChange={(e) => updateSource(idx, { title: e.target.value })}
                  placeholder="Título do Documento / Decisão *"
                  className="px-2 py-1.5 rounded border border-slate-200"
                />
                <input
                  type="text"
                  required
                  value={src.publisher}
                  onChange={(e) => updateSource(idx, { publisher: e.target.value })}
                  placeholder="Órgão / Editora (ex: Câmara, STF, G1) *"
                  className="px-2 py-1.5 rounded border border-slate-200"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="url"
                    required
                    value={src.url}
                    onChange={(e) => updateSource(idx, { url: e.target.value })}
                    placeholder="URL direta (http:// ou https://) *"
                    className="flex-1 px-2 py-1.5 rounded border border-slate-200 font-mono text-[11px]"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSource(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Descartar
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#002776] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingId ? 'Salvar Alterações no Fato' : 'Cadastrar Fato Político'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Fatos Cadastrados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Fatos Registrados ({events.length})
            </h4>
            <p className="text-xs text-slate-500">
              Eventos autônomos catalogados que compõem o grafo de relações.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título ou ano..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                    {evt.year}
                  </span>
                  {evt.categoryIds.map((cid) => {
                    const c = categories.find((cat) => cat.id === cid);
                    return (
                      <span
                        key={cid}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          c ? `${c.badgeBg} ${c.badgeText} ${c.badgeBorder}` : 'bg-slate-100'
                        }`}
                      >
                        {c?.shortLabel || cid}
                      </span>
                    );
                  })}
                  <span className="text-[10px] text-slate-400 font-mono">ID: {evt.id}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900">{evt.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-1">{evt.summary}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>{evt.keyPoints.length} pontos-chave</span>
                  <span>{evt.relatedEventEdges.length} conexões de grafo</span>
                  <span>{evt.sources.length} fontes verificáveis</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {evt.sources[0]?.url && (
                  <a
                    href={evt.sources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                    title="Abrir Fonte Oficial"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleEdit(evt)}
                  className="p-2 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                  title="Editar Fato"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(evt.id, evt.title)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir Fato"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
