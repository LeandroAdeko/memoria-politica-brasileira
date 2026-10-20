import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Calendar,
} from 'lucide-react';
import {
  PoliticalActor,
  ActorInvolvement,
  PoliticalEvent,
} from '../../data/politicalEventsData';
import { PoliticalDataService } from '../../domain/services/PoliticalDataService';

interface PoliticalActorFormProps {
  service: PoliticalDataService;
  actors: PoliticalActor[];
  events: PoliticalEvent[];
  onDataChange: () => void;
}

const ROLES: {
  role: ActorInvolvement['role'];
  label: string;
}[] = [
  { role: 'author', label: 'Autor / Propositor' },
  { role: 'rapporteur', label: 'Relator da Matéria' },
  { role: 'voted_for', label: 'Votou a Favor (Sim)' },
  { role: 'voted_against', label: 'Votou Contra (Não)' },
  { role: 'party_guidance', label: 'Orientação de Bancada' },
  { role: 'president_in_office', label: 'Presidente em Exercício' },
  { role: 'investigated', label: 'Investigado / Denunciado' },
  { role: 'whistleblower', label: 'Delator / Denunciante' },
  { role: 'sanctioned_by', label: 'Promulgador / Sancionador' },
];

export const PoliticalActorForm: React.FC<PoliticalActorFormProps> = ({
  service,
  actors,
  events,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<PoliticalActor['type']>('politician');
  const [party, setParty] = useState('');

  // Lista de envolvimentos (apontam para fatos com ano de início)
  const [involvements, setInvolvements] = useState<ActorInvolvement[]>([
    {
      eventId: events[0]?.id || '',
      startYear: events[0]?.year || new Date().getFullYear(),
      role: 'author',
      roleLabel: 'Autor / Propositor',
      notes: '',
      sourceUrl: '',
    },
  ]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setType('politician');
    setParty('');
    setInvolvements([
      {
        eventId: events[0]?.id || '',
        startYear: events[0]?.year || new Date().getFullYear(),
        role: 'author',
        roleLabel: 'Autor / Propositor',
        notes: '',
        sourceUrl: '',
      },
    ]);
  };

  const handleEdit = (actor: PoliticalActor) => {
    setEditingId(actor.id);
    setName(actor.name);
    setType(actor.type);
    setParty(actor.party || '');
    setInvolvements(
      actor.involvements.length > 0
        ? actor.involvements
        : [
            {
              eventId: events[0]?.id || '',
              startYear: new Date().getFullYear(),
              role: 'author',
              roleLabel: 'Autor / Propositor',
              notes: '',
              sourceUrl: '',
            },
          ]
    );
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addInvolvement = () => {
    setInvolvements((prev) => [
      ...prev,
      {
        eventId: events[0]?.id || '',
        startYear: events[0]?.year || new Date().getFullYear(),
        role: 'author',
        roleLabel: 'Autor / Propositor',
        notes: '',
        sourceUrl: '',
      },
    ]);
  };

  const updateInvolvement = (idx: number, patch: Partial<ActorInvolvement>) => {
    setInvolvements((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, ...patch };
        // Atualizar roleLabel se mudar role
        if (patch.role && !patch.roleLabel) {
          const rObj = ROLES.find((r) => r.role === patch.role);
          if (rObj) updated.roleLabel = rObj.label;
        }
        return updated;
      })
    );
  };

  const removeInvolvement = (idx: number) => {
    setInvolvements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (involvements.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Adicione ao menos um envolvimento em fato com o ano de início.',
      });
      return;
    }

    // Validar se todos os envolvimentos possuem ano e URL
    for (const inv of involvements) {
      if (!inv.eventId) {
        setFeedback({ type: 'error', message: 'Selecione o fato político para cada envolvimento.' });
        return;
      }
      if (!inv.startYear || isNaN(inv.startYear)) {
        setFeedback({
          type: 'error',
          message: 'O ano em que o ator começou a se envolver é obrigatório em todos os envolvimentos.',
        });
        return;
      }
      if (!inv.sourceUrl?.trim() || (!inv.sourceUrl.startsWith('http://') && !inv.sourceUrl.startsWith('https://'))) {
        setFeedback({
          type: 'error',
          message: 'Todo envolvimento exige uma URL de comprovação oficial com http:// ou https://.',
        });
        return;
      }
    }

    try {
      await service.registerActor({
        id: editingId || undefined,
        name: name.trim(),
        type,
        party: type === 'politician' ? party.trim() || undefined : undefined,
        involvements,
      });

      setFeedback({
        type: 'success',
        message: editingId
          ? `Ator político "${name}" atualizado com sucesso!`
          : `Ator político "${name}" registrado no repositório com sucesso!`,
      });
      resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar ator político.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleDelete = async (actorId: string, actorName: string) => {
    if (!window.confirm(`Deseja realmente remover o ator "${actorName}"?`)) return;
    try {
      await service.removeActor(actorId);
      setFeedback({ type: 'success', message: `Ator "${actorName}" removido!` });
      if (editingId === actorId) resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao remover ator.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const filteredActors = actors.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.party?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Formulário Isolado de Cadastro de Ator Político */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Editar Ator Político' : 'Cadastrar Ator Político & Envolvimentos'}
              </h3>
              <p className="text-xs text-slate-500">
                Os fatos não apontam para pessoas; são os atores (políticos, partidos, órgãos) que apontam para os fatos, informando o ano de início.
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
                Nome da Pessoa, Partido ou Instituição *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Michel Temer, Bancada do MDB, Polícia Federal..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipo do Ator *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PoliticalActor['type'])}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              >
                <option value="politician">Político / Figura Pública</option>
                <option value="party">Partido Político / Bancada</option>
                <option value="institution">Instituição / Órgão Regulador</option>
              </select>
            </div>
          </div>

          {type === 'politician' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sigla Partidária / Filiação (Opcional)
              </label>
              <input
                type="text"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="Ex: MDB, PT, PL, PSD..."
                className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50 uppercase"
              />
            </div>
          )}

          {/* Lista de Envolvimentos nos Fatos Políticos */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Lista de Envolvimentos em Fatos Políticos *
                </span>
                <span className="text-[11px] text-slate-500">
                  O ator recebe uma lista de envolvimentos com o <strong>ano em que começou a se envolver</strong> e o papel exercido.
                </span>
              </div>
              <button
                type="button"
                onClick={addInvolvement}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Envolvimento
              </button>
            </div>

            {involvements.map((inv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" />
                    Envolvimento #{idx + 1}
                  </span>
                  {involvements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInvolvement(idx)}
                      className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Fato Político Vinculado *
                    </label>
                    <select
                      required
                      value={inv.eventId}
                      onChange={(e) => updateInvolvement(idx, { eventId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.year} — {ev.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ano de Início do Envolvimento *
                    </label>
                    <input
                      type="number"
                      required
                      min={1889}
                      max={2100}
                      value={inv.startYear}
                      onChange={(e) =>
                        updateInvolvement(idx, { startYear: Number(e.target.value) })
                      }
                      placeholder="Ex: 2016"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold bg-amber-50/50 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Papel / Envolvimento Desempenhado *
                    </label>
                    <select
                      value={inv.role}
                      onChange={(e) =>
                        updateInvolvement(idx, {
                          role: e.target.value as ActorInvolvement['role'],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                    >
                      {ROLES.map((r) => (
                        <option key={r.role} value={r.role}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Rótulo Personalizado do Papel
                    </label>
                    <input
                      type="text"
                      value={inv.roleLabel}
                      onChange={(e) => updateInvolvement(idx, { roleLabel: e.target.value })}
                      placeholder="Ex: Propositor do Novo Regime Fiscal..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Notas Explicativas / Contexto
                    </label>
                    <input
                      type="text"
                      value={inv.notes || ''}
                      onChange={(e) => updateInvolvement(idx, { notes: e.target.value })}
                      placeholder="Observações sobre a atuação do ator no fato..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      URL da Fonte Oficial / Comprovação *
                    </label>
                    <input
                      type="url"
                      required
                      value={inv.sourceUrl}
                      onChange={(e) => updateInvolvement(idx, { sourceUrl: e.target.value })}
                      placeholder="https://www.camara.leg.br/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
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
              <span>{editingId ? 'Salvar Alterações no Ator' : 'Cadastrar Ator Político'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Atores Cadastrados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Atores Registrados ({actors.length})
            </h4>
            <p className="text-xs text-slate-500">
              Políticos, partidos e instituições que apontam para os fatos políticos.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou partido..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActors.map((actor) => (
            <div
              key={actor.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {actor.name}
                      {actor.party && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {actor.party}
                        </span>
                      )}
                    </h5>
                    <span className="text-[11px] text-slate-500 capitalize">
                      {actor.type === 'politician'
                        ? 'Político / Parlamentar'
                        : actor.type === 'party'
                        ? 'Bancada Partidária'
                        : 'Instituição / Órgão Público'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {actor.id}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Envolvimentos ({actor.involvements.length}):
                  </span>
                  {actor.involvements.map((inv, idx) => {
                    const evt = events.find((e) => e.id === inv.eventId);
                    return (
                      <div
                        key={idx}
                        className="text-xs p-2 rounded-lg bg-white border border-slate-100 flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="font-bold text-blue-900 mr-1.5">
                            [{inv.startYear}]
                          </span>
                          <span className="font-semibold text-slate-800">
                            {inv.roleLabel}:
                          </span>{' '}
                          <span className="text-slate-600 truncate">
                            {evt?.shortTitle || inv.eventId}
                          </span>
                        </div>
                        {inv.sourceUrl && (
                          <a
                            href={inv.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-900 shrink-0"
                            title="Fonte Oficial"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(actor)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                  title="Editar Ator"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(actor.id, actor.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir Ator"
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
