import React from 'react';
import { X, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { INDICATORS } from '../data/brazilHistoryData';

interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Fontes Oficiais & Metodologia
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Critérios técnicos e instituições públicas brasileiras e internacionais responsáveis pelos dados.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Transparency Principles */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Compromisso com Dados Públicos e Rigor Cívico
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              O projeto <strong className="font-semibold text-slate-800">Memória Política do Brasil</strong> organiza estatísticas públicas oficiais consolidadas ao longo de mais de três décadas de governos republicanos. Todas as métricas são provenientes de órgãos técnicos de Estado e agências das Nações Unidas, sem viés partidário ou distorções metodológicas.
            </p>
          </div>

          {/* Table of Indicators and Sources */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Detalhamento por Indicador
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {INDICATORS.map((indicator) => (
                <div key={indicator.id} className="p-4 bg-white hover:bg-slate-50/50">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {indicator.name}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      Unidade: {indicator.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {indicator.description}
                  </p>
                  <div className="mt-2.5">
                    <a
                      href={indicator.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
                    >
                      <span>Fonte Oficial: {indicator.source}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
