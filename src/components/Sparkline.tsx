import React from 'react';

interface SparklineProps {
  data: number[];
  currentYearIndex: number;
  betterDirection: 'higher' | 'lower';
  height?: number;
  width?: number;
  color?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  currentYearIndex,
  height = 36,
  width = 140,
  color = '#2563eb',
}) => {
  if (!data || data.length === 0) return null;

  const validData = data.slice(0, currentYearIndex + 1);
  if (validData.length < 2) {
    return <div className="h-9 w-32 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-[11px] text-slate-400">Ponto inicial (1990)</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Generate points for SVG path
  const points = validData.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    // inverted Y because SVG y=0 is at top
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const lastPoint = points[points.length - 1].split(',');
  const currentX = parseFloat(lastPoint[0]);
  const currentY = parseFloat(lastPoint[1]);

  return (
    <div className="relative inline-flex items-center">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Full period subtle ghost path */}
        {data.length > 2 && (
          <path
            d={`M ${data
              .map((val, idx) => {
                const x = (idx / (data.length - 1)) * width;
                const y = height - paddingY - ((val - min) / range) * usableHeight;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' L ')}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        )}

        {/* Historical trajectory up to selected year */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Selected year active dot */}
        <circle
          cx={currentX}
          cy={currentY}
          r="3.5"
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
