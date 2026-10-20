import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  viewMode: 'full' | 'minimalist' | 'compare' | 'presidents' | 'events' | 'admin';
  onToggleViewMode?: (mode: 'full' | 'minimalist' | 'compare' | 'presidents' | 'events' | 'admin') => void;
  onOpenMenu: () => void;
}

const VIEW_CONFIG: Record<
  string,
  { label: string; dot: string; text: string }
> = {
  full: { label: 'Visão Completa', dot: 'bg-emerald-500', text: 'text-emerald-900' },
  minimalist: { label: 'Modo Minimalista', dot: 'bg-blue-600', text: 'text-blue-900' },
  presidents: { label: 'Presidentes', dot: 'bg-amber-500', text: 'text-amber-900' },
  events: { label: 'Fatos & PECs', dot: 'bg-indigo-600', text: 'text-indigo-900' },
  compare: { label: 'Comparador', dot: 'bg-teal-600', text: 'text-teal-900' },
  admin: { label: 'Cadastro (Hexagonal)', dot: 'bg-purple-600', text: 'text-purple-900' },
};

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onOpenMenu,
}) => {
  const currentView = VIEW_CONFIG[viewMode] || {
    label: 'Visão Geral',
    dot: 'bg-slate-400',
    text: 'text-slate-800',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Tricolor hairline accent bar reflecting Brazil colors (Verde, Amarelo, Azul) */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#009c3b]" />
        <div className="h-full w-1/3 bg-[#ffdf00]" />
        <div className="h-full w-1/3 bg-[#002776]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Left section: Hamburger Menu Button + Brand mark */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Brand mark */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009c3b] ring-4 ring-[#009c3b]/15 hidden xs:inline-block" />
              <button
                onClick={onOpenMenu}
                className="text-base sm:text-xl font-bold tracking-tight text-slate-900 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Memória Política do Brasil
              </button>
            </div>
          </div>
            
            {/* Drawer Menu Button */}
            <button
              onClick={onOpenMenu}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-emerald-950 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
              title="Abrir menu de navegação lateral"
              aria-label="Abrir menu"
            >
              <Menu className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800">Menu</span>
            </button>

        </div>
      </div>
    </header>
  );
};
