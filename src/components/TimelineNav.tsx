import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YearRecord } from '../data/brazilHistoryData';

interface TimelineNavProps {
  years: YearRecord[];
  selectedYear: YearRecord;
  onSelectYear: (year: YearRecord) => void;
}

export const TimelineNav: React.FC<TimelineNavProps> = ({
  years,
  selectedYear,
  onSelectYear,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = years.findIndex((y) => y.year === selectedYear.year);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < years.length - 1;

  // Auto-scroll selected year into view smoothly
  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = selectedButtonRef.current;
      const containerWidth = container.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;

      container.scrollTo({
        left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [selectedYear.year]);

  const handlePrev = () => {
    if (canGoPrev) {
      onSelectYear(years[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onSelectYear(years[currentIndex + 1]);
    }
  };

  return (
    <section className="sticky top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Controls Bar: Current Year, Navigation buttons */}
        <div className="flex items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Linha do Tempo
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Year */}
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              title="Ano anterior"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Year */}
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              title="Próximo ano"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Year Track */}
        <div
          ref={containerRef}
          className="timeline-scroll relative flex items-center gap-2 overflow-x-auto p-2 scroll-smooth"
        >
          {years.map((item) => {
            const isSelected = item.year === selectedYear.year;
            const hasMilestone = Boolean(item.milestone);

            return (
              <button
                key={item.year}
                ref={isSelected ? selectedButtonRef : null}
                onClick={() => onSelectYear(item)}
                className={`group relative flex flex-col items-center min-w-[82px] px-3 py-2 rounded-2xl transition-all cursor-pointer text-center select-none ${
                  isSelected
                    ? 'bg-[#0b1329] text-white shadow-md ring-2 ring-emerald-500 ring-offset-1'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Year Number with Tabular Figures */}
                <span
                  className={`text-sm font-bold font-mono tracking-tight tabular-nums ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.year}
                </span>

                {/* President short label */}
                <span
                  className={`text-[11px] truncate max-w-[72px] mt-0.5 leading-tight ${
                    isSelected ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                  }`}
                  title={`${item.president} (${item.party})`}
                >
                  {item.president.split(' ')[0]}
                </span>

                {/* Milestone indicator */}
                {hasMilestone && (
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-400 ring-2 ring-[#0b1329]'
                        : 'bg-amber-400 ring-2 ring-white'
                    }`}
                    title={item.milestone}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
