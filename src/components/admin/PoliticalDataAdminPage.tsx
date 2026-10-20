import React, { useState } from 'react';
import {
  Tag,
  FileText,
  Users,
  Layers,
  Database,
  ArrowLeft,
  Boxes,
  Sparkles,
} from 'lucide-react';
import { usePoliticalData } from '../../hooks/usePoliticalData';
import { CategoryForm } from './CategoryForm';
import { PoliticalEventForm } from './PoliticalEventForm';
import { PoliticalActorForm } from './PoliticalActorForm';
import { MacroScenarioForm } from './MacroScenarioForm';
import { DataBackupManager } from './DataBackupManager';

interface PoliticalDataAdminPageProps {
  onNavigateToEvents?: () => void;
  onNavigateHome?: () => void;
}

type AdminTab = 'categories' | 'events' | 'actors' | 'scenarios' | 'backup';

export const PoliticalDataAdminPage: React.FC<PoliticalDataAdminPageProps> = ({
  onNavigateToEvents,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');
  const {
    service,
    categories,
    events,
    actors,
    scenarios,
    reloadData,
  } = usePoliticalData();

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onNavigateToEvents && (
                <button
                  type="button"
                  onClick={onNavigateToEvents}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Voltar para a página de fatos"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Boxes className="w-3 h-3 text-emerald-600" />
                    Hexagonal Architecture
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    Ports & Adapters
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Painel de Cadastro & Gestão de Dados
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToEvents && (
                <button
                  type="button"
                  onClick={onNavigateToEvents}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                  <span>Ver Grafo & Fatos</span>
                </button>
              )}
              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all"
                >
                  Ir para Home
                </button>
              )}
            </div>
          </div>

          {/* Abas Isoladas por Entidade de Dados */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'categories'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Categorias</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'categories'
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {categories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'events'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fatos, PECs & Escândalos</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'events'
                    ? 'bg-indigo-800 text-indigo-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {events.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('actors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'actors'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Atores Políticos</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'actors'
                    ? 'bg-purple-800 text-purple-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {actors.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'scenarios'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Macro-Cenários</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'scenarios'
                    ? 'bg-amber-900 text-amber-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {scenarios.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ml-auto ${
                activeTab === 'backup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backup & JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal da Aba Selecionada */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'categories' && (
          <CategoryForm
            service={service}
            categories={categories}
            onDataChange={reloadData}
          />
        )}

        {activeTab === 'events' && (
          <PoliticalEventForm
            service={service}
            events={events}
            categories={categories}
            scenarios={scenarios}
            onDataChange={reloadData}
          />
        )}

        {activeTab === 'actors' && (
          <PoliticalActorForm
            service={service}
            actors={actors}
            events={events}
            onDataChange={reloadData}
          />
        )}

        {activeTab === 'scenarios' && (
          <MacroScenarioForm
            service={service}
            scenarios={scenarios}
            events={events}
            onDataChange={reloadData}
          />
        )}

        {activeTab === 'backup' && (
          <DataBackupManager
            service={service}
            categories={categories}
            events={events}
            actors={actors}
            scenarios={scenarios}
            onDataChange={reloadData}
          />
        )}
      </main>
    </div>
  );
};
