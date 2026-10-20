import React, { useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Database,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';
import { EventCategory, PoliticalEvent, PoliticalActor, MacroScenario } from '../../data/politicalEventsData';
import { PoliticalDataService } from '../../domain/services/PoliticalDataService';

interface DataBackupManagerProps {
  service: PoliticalDataService;
  categories: EventCategory[];
  events: PoliticalEvent[];
  actors: PoliticalActor[];
  scenarios: MacroScenario[];
  onDataChange: () => void;
}

export const DataBackupManager: React.FC<DataBackupManagerProps> = ({
  service,
  categories,
  events,
  actors,
  scenarios,
  onDataChange,
}) => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    try {
      const backup = await service.exportAllData();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memoria-politica-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setFeedback({
        type: 'success',
        message: 'Arquivo JSON exportado e baixado com sucesso!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao exportar JSON.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleImportText = async () => {
    if (!importJsonText.trim()) {
      setFeedback({ type: 'error', message: 'Cole o conteúdo JSON válido para importar.' });
      return;
    }
    try {
      const parsed = JSON.parse(importJsonText);
      await service.importAllData(parsed);
      setFeedback({ type: 'success', message: 'Dados importados e salvos com sucesso!' });
      setImportJsonText('');
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'JSON inválido.';
      setFeedback({ type: 'error', message: `Erro ao importar: ${msg}` });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        await service.importAllData(parsed);
        setFeedback({
          type: 'success',
          message: `Arquivo "${file.name}" importado e persistido com sucesso!`,
        });
        onDataChange();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Arquivo inválido.';
        setFeedback({ type: 'error', message: `Erro na leitura do arquivo: ${msg}` });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'ATENÇÃO: Deseja restaurar a base de dados padrão original? Quaisquer alterações locais não exportadas serão perdidas.'
      )
    ) {
      return;
    }
    try {
      await service.resetData();
      setFeedback({
        type: 'success',
        message: 'Base de dados restaurada para os padrões originais com sucesso!',
      });
      onDataChange();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao restaurar dados.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const currentPayload = {
    version: '1.0.0',
    categories,
    events,
    actors,
    scenarios,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Resumo do Armazenamento */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Gerenciador de Dados, Backup & JSON
            </h3>
            <p className="text-xs text-slate-500">
              Persistência atual via classe hexagonal conectada ao LocalStorage, pronta para migração futura para banco SQL/Firestore.
            </p>
          </div>
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

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
            <span className="text-2xl font-black text-blue-900">{categories.length}</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Categorias</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
            <span className="text-2xl font-black text-indigo-900">{events.length}</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Fatos & PECs</span>
          </div>
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-center">
            <span className="text-2xl font-black text-purple-900">{actors.length}</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Atores Políticos</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
            <span className="text-2xl font-black text-amber-900">{scenarios.length}</span>
            <span className="text-xs font-semibold text-slate-600 block mt-1">Macro-Cenários</span>
          </div>
        </div>

        {/* Botões Principais de Exportar / Restaurar */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002776] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Base Completa em JSON</span>
          </button>

          <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Carregar Arquivo .JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowJsonViewer(!showJsonViewer)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            <FileCode className="w-4 h-4 text-slate-500" />
            <span>{showJsonViewer ? 'Ocultar JSON Bruto' : 'Inspecionar JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Padrão de Fábrica</span>
          </button>
        </div>
      </div>

      {/* Importação manual via texto */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h4 className="text-base font-bold text-slate-900 mb-1">
          Importação Manual de JSON
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Cole a estrutura JSON contendo categorias, eventos e atores para sobrescrever ou atualizar o repositório.
        </p>
        <textarea
          rows={5}
          value={importJsonText}
          onChange={(e) => setImportJsonText(e.target.value)}
          placeholder="Cole seu objeto JSON com as chaves categories, events, actors, scenarios..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-800"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleImportText}
            disabled={!importJsonText.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#002776] hover:bg-blue-900 disabled:opacity-40 text-white text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Processar e Gravar JSON</span>
          </button>
        </div>
      </div>

      {/* Visualizador de JSON */}
      {showJsonViewer && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                JSON Atual Gerado pelo Repositório Hexagonal
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="mt-4 max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-300 leading-relaxed">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
