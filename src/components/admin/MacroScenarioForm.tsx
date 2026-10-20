import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { MacroScenario, PoliticalEvent } from '../../data/politicalEventsData';
import { PoliticalDataService } from '../../domain/services/PoliticalDataService';

interface MacroScenarioFormProps {
  service: PoliticalDataService;
  scenarios: MacroScenario[];
  events: PoliticalEvent[];
  onDataChange: () => void;
}

export const MacroScenarioForm: React.FC<MacroScenarioFormProps> = ({
  service,
  scenarios,
  events,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPeriod('');
    setDescription('');
    setSelectedEventIds([]);
  };

  const handleEdit = (scenario: MacroScenario) => {
    setEditingId(scenario.id);
    setTitle(scenario.title);
    setPeriod(scenario.period);
    setDescription(scenario.description);
    setSelectedEventIds(scenario.eventIds);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await service.registerScenario({
        id: editingId || undefined,
        title: title.trim(),
        period: period.trim(),
        description: description.trim(),
        eventIds: selectedEventIds,
      });

      setFeedback({
        type: 'success',
        message: editingId
          ? `Macro-cenário "${title}" atualizado com sucesso!`
          : `Macro-cenário "${title}" cadastrado com sucesso!`,
      });
      resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar macro-cenário.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleDelete = async (scenarioId: string, scenarioTitle: string) => {
    if (!window.confirm(`Deseja realmente remover o cenário "${scenarioTitle}"?`)) return;
    try {
      await service.removeScenario(scenarioId);
      setFeedback({ type: 'success', message: `Cenário "${scenarioTitle}" removido!` });
      if (editingId === scenarioId) resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao remover cenário.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário Isolado de Cadastro de Macro-Cenário */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Editar Macro-Cenário' : 'Cadastrar Novo Macro-Cenário'}
              </h3>
              <p className="text-xs text-slate-500">
                Agrupamentos históricos e cronológicos que formam um cenário maior interconectando múltiplos eventos.
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título do Macro-Cenário *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Ciclo de Reformas Fiscais e Constitucionais (2016–2023)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Período Temporal (Ex: 2016–2023) *
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ex: 2016–2023"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição do Cenário Político-Institucional *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique o arco histórico que unifica esses fatos políticos..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Fatos Políticos que Integram este Cenário ({selectedEventIds.length} selecionados)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 rounded-xl border border-slate-200 bg-slate-50">
              {events.map((evt) => {
                const isSelected = selectedEventIds.includes(evt.id);
                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => toggleEvent(evt.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all border ${
                      isSelected
                        ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">
                      <strong className="text-slate-900 mr-1.5">[{evt.year}]</strong>
                      {evt.shortTitle}
                    </span>
                    <span className="shrink-0">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
              <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Cenário'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Cenários Cadastrados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Macro-Cenários Registrados ({scenarios.length})
            </h4>
            <p className="text-xs text-slate-500">
              Cenários que unem fatos políticos em uma visão agregada.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {sc.period}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {sc.id}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900">{sc.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-2">{sc.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  {sc.eventIds.length} eventos vinculados
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(sc)}
                  className="p-2 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                  title="Editar Cenário"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sc.id, sc.title)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir Cenário"
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
