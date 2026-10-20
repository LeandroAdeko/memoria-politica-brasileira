import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { EventCategory } from '../../data/politicalEventsData';
import { PoliticalDataService } from '../../domain/services/PoliticalDataService';

interface CategoryFormProps {
  service: PoliticalDataService;
  categories: EventCategory[];
  onDataChange: () => void;
}

const COLOR_PRESETS = [
  { color: '#002776', name: 'Azul Cívico', badgeBg: 'bg-blue-50', badgeText: 'text-blue-900', badgeBorder: 'border-blue-200' },
  { color: '#DC2626', name: 'Vermelho Alerta', badgeBg: 'bg-rose-50', badgeText: 'text-rose-900', badgeBorder: 'border-rose-200' },
  { color: '#D97706', name: 'Âmbar Investigação', badgeBg: 'bg-amber-50', badgeText: 'text-amber-900', badgeBorder: 'border-amber-200' },
  { color: '#009c3b', name: 'Verde Econômico', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-900', badgeBorder: 'border-emerald-200' },
  { color: '#475569', name: 'Cinza Institucional', badgeBg: 'bg-slate-100', badgeText: 'text-slate-800', badgeBorder: 'border-slate-300' },
  { color: '#7C3AED', name: 'Roxo Regulatório', badgeBg: 'bg-purple-50', badgeText: 'text-purple-900', badgeBorder: 'border-purple-200' },
  { color: '#0284C7', name: 'Ciano Infraestrutura', badgeBg: 'bg-sky-50', badgeText: 'text-sky-900', badgeBorder: 'border-sky-200' },
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  service,
  categories,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [shortLabel, setShortLabel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(COLOR_PRESETS[0]);
  const [customColor, setCustomColor] = useState(COLOR_PRESETS[0].color);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setId('');
    setName('');
    setShortLabel('');
    setDescription('');
    setSelectedPreset(COLOR_PRESETS[0]);
    setCustomColor(COLOR_PRESETS[0].color);
  };

  const handleEdit = (cat: EventCategory) => {
    setEditingId(cat.id);
    setId(cat.id);
    setName(cat.name);
    setShortLabel(cat.shortLabel || cat.name);
    setDescription(cat.description || '');
    const preset = COLOR_PRESETS.find((p) => p.color === cat.color) || COLOR_PRESETS[0];
    setSelectedPreset(preset);
    setCustomColor(cat.color);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      await service.registerCategory({
        id: id.trim() || undefined,
        name: name.trim(),
        shortLabel: shortLabel.trim() || name.trim(),
        description: description.trim(),
        color: customColor,
        badgeBg: selectedPreset.badgeBg,
        badgeText: selectedPreset.badgeText,
        badgeBorder: selectedPreset.badgeBorder,
      });

      setFeedback({
        type: 'success',
        message: editingId
          ? `Categoria "${name}" atualizada com sucesso no banco!`
          : `Nova categoria "${name}" cadastrada com sucesso!`,
      });
      resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar categoria.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId: string, catName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${catName}"?`)) {
      return;
    }
    try {
      await service.removeCategory(catId);
      setFeedback({ type: 'success', message: `Categoria "${catName}" removida!` });
      if (editingId === catId) resetForm();
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao remover categoria.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário Isolado de Cadastro */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Editar Categoria' : 'Cadastrar Nova Categoria de Fatos'}
              </h3>
              <p className="text-xs text-slate-500">
                Tabela relacional de categorias para classificação N:N de fatos políticos, PECs e escândalos.
              </p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome Completo da Categoria *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fraudes Fiscais & Financeiras"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rótulo Curto (Para crachás/badges) *
              </label>
              <input
                type="text"
                required
                value={shortLabel}
                onChange={(e) => setShortLabel(e.target.value)}
                placeholder="Ex: Fraude Bancária"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ID / Slug (Opcional, auto-gerado se vazio)
              </label>
              <input
                type="text"
                disabled={Boolean(editingId)}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ex: fraudes-bancarias"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50 font-mono disabled:opacity-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Paleta Visual da Categoria
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomColor(preset.color);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      customColor === preset.color
                        ? 'border-slate-800 ring-2 ring-slate-800/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição Institucional
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o escopo e os tipos de fatos que se enquadram nesta categoria..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm bg-slate-50/50"
            />
          </div>

          {/* Pré-visualização ao vivo */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Prévia do Crachá em Tempo Real:
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${selectedPreset.badgeBg} ${selectedPreset.badgeText} ${selectedPreset.badgeBorder}`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: customColor }}
                  />
                  {shortLabel.trim() || name.trim() || 'Exemplo de Categoria'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ID: {id || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'auto')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Descartar
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002776] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Categoria'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de Categorias Cadastradas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Categorias Atuais no Repositório ({categories.length})
            </h4>
            <p className="text-xs text-slate-500">
              Essas categorias são referenciadas pelos Fatos Políticos via relação N:N.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.badgeBg} ${cat.badgeText} ${cat.badgeBorder}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.shortLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {cat.id}
                  </span>
                </div>
                <h5 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                  {cat.name}
                </h5>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {cat.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                  title="Editar Categoria"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir Categoria"
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
