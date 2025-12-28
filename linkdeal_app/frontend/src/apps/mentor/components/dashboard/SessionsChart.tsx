import { FunctionComponent, useState, useEffect } from 'react';
import api from '@/services/api';

type Period = 'day' | 'week' | 'month' | 'year';

interface ChartDataPoint {
  label: string;
  sessions: number;
  hours: string;
}

const SessionsChart: FunctionComponent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/scheduling/sessions/chart/', {
          params: { period: selectedPeriod }
        });
        setChartData(response.data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [selectedPeriod]);

  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
  };

  // Map backend data to chart format
  const data = chartData.length > 0
    ? chartData.map(d => ({ label: d.label, value: d.sessions }))
    : [];

  const maxSessionValue = Math.max(...data.map(d => d.value), 0);
  const maxValue = Math.max(maxSessionValue, 4);


  const chartWidth = 1080;
  const leftPadding = 70;

  // Calculate positions for data points
  // Chart drawn from y=280 (bottom) to y=20 (top), total height 260
  const xStep = chartWidth / (data.length - 1 || 1);
  const points = data.map((point, index) => ({
    x: leftPadding + index * xStep,
    y: 280 - (point.value / maxValue) * 260, // 280 is bottom y, 260 is drawing height
    value: point.value,
    label: point.label
  }));

  // Smoothing logic (Catmull-Rom spline / simple bezier approximation)
  const getPath = (points: { x: number, y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    // Helper to get control point
    const controlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = line(p, n);
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      const x = current.x + Math.cos(angle) * length;
      const y = current.y + Math.sin(angle) * length;
      return { x, y };
    };

    const line = (a: any, b: any) => {
      const x = b.x - a.x;
      const y = b.y - a.y;
      return { length: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), angle: Math.atan2(y, x) };
    };

    const d = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const cps = controlPoint(a[i - 1], a[i - 2], point);
      const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cps.x} ${cps.y}, ${cpe.x} ${cpe.y}, ${point.x} ${point.y}`;
    }, '');

    return d;
  };

  const pathData = getPath(points);

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 bg-white/10 rounded w-40 mb-2" />
            <div className="h-4 bg-white/10 rounded w-28" />
          </div>
          <div className="h-8 bg-white/10 rounded w-48" />
        </div>
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="pr-32 sm:pr-0">
          <h2 className="text-base md:text-lg font-semibold text-white">Sessions Overview</h2>
          <p className="text-xs md:text-sm text-white/60">
            {periodLabels[selectedPeriod]} • All sessions
          </p>
        </div>

        {/* Period Filter - Absolute positioned on mobile, normal flow on desktop */}
        <div className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto flex items-center gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5 sm:p-1">
            {(['day', 'week', 'month', 'year'] as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all duration-200 ${selectedPeriod === period
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="w-full min-w-[600px] md:min-w-0">
          <svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Grid lines - Horizontal */}
            {[280, 215, 150, 85, 20].map((y) => (
              <line key={`h-${y}`} x1="70" y1={y} x2="1150" y2={y} stroke="white" strokeOpacity="0.1" strokeDasharray="3 3" />
            ))}

            {/* Data line */}
            <path d={pathData} stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Fill Gradient Area (optional advanced touch) */}
            <path d={`${pathData} L ${points[points.length - 1]?.x || 0} 280 L ${points[0]?.x || 0} 280 Z`} fill="url(#gradient)" opacity="0.1" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Axes */}
            <line x1="70" y1="280" x2="1150" y2="280" stroke="#9CA3AF" />
            <line x1="70" y1="20" x2="70" y2="280" stroke="#9CA3AF" />

            {/* Hover Targets (Invisible Rects) & Points */}
            {points.map((point, index) => (
              <g key={`${point.label}-${index}`} className="group">
                {/* Visible Point */}
                <circle cx={point.x} cy={point.y} r="4" fill="#18181B" stroke="#8B5CF6" strokeWidth="2" className="transition-all duration-300 group-hover:r-6 group-hover:fill-[#8B5CF6] group-hover:stroke-white" />

                {/* Tooltip (Simple SVG implementation) */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <rect x={point.x - 40} y={point.y - 45} width="80" height="35" rx="6" fill="#18181B" stroke="rgba(255,255,255,0.2)" />
                  <text x={point.x} y={point.y - 28} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">{point.value} Sessions</text>
                  <text x={point.x} y={point.y - 15} fill="#A1A1AA" fontSize="10" textAnchor="middle">{point.label}</text>
                </g>

                {/* Invisible Hit Area */}
                <rect x={point.x - (xStep / 2)} y="0" width={xStep} height="320" fill="transparent" className="cursor-crosshair" />
              </g>
            ))}

            {/* Y-axis labels */}
            <text x="58" y="284" fill="#9CA3AF" fontSize="12" textAnchor="end">0</text>
            <text x="58" y="219" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.25)}</text>
            <text x="58" y="154" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.5)}</text>
            <text x="58" y="89" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.75)}</text>
            <text x="58" y="24" fill="#9CA3AF" fontSize="12" textAnchor="end">{maxValue}</text>

            {/* X-axis labels: Show fewer labels on mobile or if many points */}
            {points.map((point, i) => (
              (data.length < 15 || i % 2 === 0) && (
                <text key={`label-${point.label}`} x={point.x} y="300" fill="#9CA3AF" fontSize="12" textAnchor="middle">
                  {point.label}
                </text>
              )
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SessionsChart;
