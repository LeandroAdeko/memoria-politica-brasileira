import React, { useEffect } from 'react';
import {
  X,
  Clock,
  LayoutGrid,
  Hash,
  Users,
  GitCompare,
  Network,
  Database,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'home-full' | 'home-minimalist' | 'compare' | 'presidents' | 'events' | 'admin';
  onNavigate: (page: 'home-full' | 'home-minimalist' | 'compare' | 'presidents' | 'events' | 'admin') => void;
  onOpenMethodology: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenMethodology,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out border-r border-slate-200">
          {/* Header of Drawer */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              {/* Brazilian civic tricolor emblem */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-[#009c3b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffdf00]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#002776]" />
              </div>
              <div>
                <h2
                  className="text-base font-bold text-slate-900 leading-tight"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Memória Política
                </h2>
                <p className="text-xs text-slate-500 font-sans">Navegação Geral</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Navigation Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Seção 1: Telas de Consulta */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Páginas & Modos
              </p>
              <div className="space-y-1.5">
                {/* Linha do Tempo — Visão Completa */}
                <button
                  onClick={() => {
                    onNavigate('home-full');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'home-full'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'home-full'
                          ? 'bg-[#009c3b] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-snug">Home — Visão Completa</p>
                      <p className="text-xs text-slate-500">
                        Linha do tempo com contexto político e gráficos
                      </p>
                    </div>
                  </div>
                  {currentPage === 'home-full' && (
                    <span className="w-2 h-2 rounded-full bg-[#009c3b]" />
                  )}
                </button>

                {/* Linha do Tempo — Modo Minimalista */}
                <button
                  onClick={() => {
                    onNavigate('home-minimalist');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'home-minimalist'
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'home-minimalist'
                          ? 'bg-[#002776] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-snug">Modo Minimalista</p>
                      <p className="text-xs text-slate-500">Apenas a régua de anos e números</p>
                    </div>
                  </div>
                  {currentPage === 'home-minimalist' && (
                    <span className="w-2 h-2 rounded-full bg-[#002776]" />
                  )}
                </button>

                {/* Página dos Presidentes */}
                <button
                  onClick={() => {
                    onNavigate('presidents');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'presidents'
                      ? 'bg-amber-50 border border-amber-300 text-amber-950 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'presidents'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-snug">Presidentes do Brasil</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          Novo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Biografias, leis aprovadas, programas e legado
                      </p>
                    </div>
                  </div>
                  {currentPage === 'presidents' ? (
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Comparador de Anos */}
                <button
                  onClick={() => {
                    onNavigate('compare');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'compare'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'compare'
                          ? 'bg-[#009c3b] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GitCompare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-snug">Comparador de Anos</p>
                      <p className="text-xs text-slate-500">
                        Análise lado a lado com seletor de presidente
                      </p>
                    </div>
                  </div>
                  {currentPage === 'compare' ? (
                    <span className="w-2 h-2 rounded-full bg-[#009c3b]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Fatos, PECs & Grafo de Eventos */}
                <button
                  onClick={() => {
                    onNavigate('events');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'events'
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'events'
                          ? 'bg-[#002776] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-snug">Fatos, PECs & Escândalos</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Grafo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Conexões causais, votações e atores envolvidos
                      </p>
                    </div>
                  </div>
                  {currentPage === 'events' ? (
                    <span className="w-2 h-2 rounded-full bg-[#002776]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Cadastro de Dados & Arquitetura Hexagonal */}
                <button
                  onClick={() => {
                    onNavigate('admin');
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    currentPage === 'admin'
                      ? 'bg-purple-50 border border-purple-300 text-purple-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentPage === 'admin'
                          ? 'bg-purple-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-snug">Cadastro de Dados</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Formulários isolados por entidade de dados
                      </p>
                    </div>
                  </div>
                  {currentPage === 'admin' ? (
                    <span className="w-2 h-2 rounded-full bg-purple-900" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Seção 2: Documentação & Fontes */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Transparência e Dados
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    onOpenMethodology();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-snug">Metodologia e Fontes</p>
                      <p className="text-xs text-slate-500">IBGE, IPEA, Banco Central, DATASUS</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Cartão Informativo de Mandatos */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/70 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Período Histórico Coberto</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Dados consolidados de 1990 a 2024, englobando 7 presidências desde a redemocratização.
              </p>
            </div>
          </div>

          {/* Footer do Drawer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
            República Federativa do Brasil • Dados Públicos Oficiais
          </div>
        </div>
      </div>
    </div>
  );
};
