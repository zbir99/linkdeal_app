import { FunctionComponent, useState } from 'react';

type Period = 'day' | 'week' | 'month' | 'year';

const SessionsChart: FunctionComponent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  // Data for different periods
  const periodData = {
    day: [
      { label: 'Mon', value: 12 },
      { label: 'Tue', value: 19 },
      { label: 'Wed', value: 15 },
      { label: 'Thu', value: 22 },
      { label: 'Fri', value: 18 },
      { label: 'Sat', value: 8 }
    ],
    week: [
      { label: 'W1', value: 45 },
      { label: 'W2', value: 62 },
      { label: 'W3', value: 55 },
      { label: 'W4', value: 78 },
      { label: 'W5', value: 68 },
      { label: 'W6', value: 52 }
    ],
    month: [
      { label: 'Jan', value: 65 },
      { label: 'Feb', value: 125 },
      { label: 'Mar', value: 97 },
      { label: 'Apr', value: 60 },
      { label: 'May', value: 32 },
      { label: 'Jun', value: 5 }
    ],
    year: [
      { label: '2019', value: 580 },
      { label: '2020', value: 720 },
      { label: '2021', value: 890 },
      { label: '2022', value: 1050 },
      { label: '2023', value: 1180 },
      { label: '2024', value: 950 }
    ]
  };

  const periodLabels = {
    day: 'Last 7 days',
    week: 'Last 6 weeks',
    month: 'Last 6 months',
    year: 'Last 6 years'
  };

  const data = periodData[selectedPeriod];

  const maxValue = Math.max(...data.map(d => d.value)) * 1.2; // 20% padding above max
  const chartHeight = 260;
  const chartWidth = 1080;
  const leftPadding = 70;

  // Calculate positions for data points
  const xStep = chartWidth / (data.length - 1);
  const points = data.map((point, index) => ({
    x: leftPadding + index * xStep,
    y: chartHeight - (point.value / maxValue) * chartHeight,
    value: point.value,
    label: point.label
  }));

  // Create path for the line
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 shadow-[0_10px_40px_rgba(10,10,26,0.25)]">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="pr-32 sm:pr-0">
          <h2 className="text-base md:text-lg font-semibold text-white">Sessions Overview</h2>
          <p className="text-xs md:text-sm text-white/60">{periodLabels[selectedPeriod]}</p>
        </div>
        
        {/* Period Filter - Absolute positioned on mobile, normal flow on desktop */}
        <div className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto flex items-center gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5 sm:p-1">
            {(['day', 'week', 'month', 'year'] as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all duration-200 ${
                  selectedPeriod === period
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
        <svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[600px] md:min-w-0">
          {/* Grid lines - Horizontal */}
          {[280, 215, 150, 85, 20].map((y) => (
            <line
              key={`h-${y}`}
              x1="70"
              y1={y}
              x2="1150"
              y2={y}
              stroke="white"
              strokeOpacity="0.1"
              strokeDasharray="3 3"
            />
          ))}
          
          {/* Grid lines - Vertical */}
          {[70, 290, 510, 730, 950, 1150].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="20"
              x2={x}
              y2="280"
              stroke="white"
              strokeOpacity="0.1"
              strokeDasharray="3 3"
            />
          ))}

          {/* Data line */}
          <path
            d={pathData}
            stroke="#8B5CF6"
            strokeWidth="3"
            fill="none"
          />

          {/* Axes */}
          <line x1="70" y1="280" x2="1150" y2="280" stroke="#9CA3AF" />
          <line x1="70" y1="286" x2="70" y2="280" stroke="#9CA3AF" />
          <line x1="290" y1="286" x2="290" y2="280" stroke="#9CA3AF" />
          <line x1="510" y1="286" x2="510" y2="280" stroke="#9CA3AF" />
          <line x1="730" y1="286" x2="730" y2="280" stroke="#9CA3AF" />
          <line x1="950" y1="286" x2="950" y2="280" stroke="#9CA3AF" />
          <line x1="1150" y1="286" x2="1150" y2="280" stroke="#9CA3AF" />
          
          <line x1="70" y1="20" x2="70" y2="280" stroke="#9CA3AF" />
          <line x1="64" y1="280" x2="70" y2="280" stroke="#9CA3AF" />
          <line x1="64" y1="215" x2="70" y2="215" stroke="#9CA3AF" />
          <line x1="64" y1="150" x2="70" y2="150" stroke="#9CA3AF" />
          <line x1="64" y1="85" x2="70" y2="85" stroke="#9CA3AF" />
          <line x1="64" y1="20" x2="70" y2="20" stroke="#9CA3AF" />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={`${point.label}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#8B5CF6"
                stroke="#8B5CF6"
                strokeWidth="3"
              />
            </g>
          ))}

          {/* Y-axis labels */}
          <text x="58" y="284" fill="#9CA3AF" fontSize="12" textAnchor="end">0</text>
          <text x="58" y="219" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.25)}</text>
          <text x="58" y="154" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.5)}</text>
          <text x="58" y="89" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue * 0.75)}</text>
          <text x="58" y="24" fill="#9CA3AF" fontSize="12" textAnchor="end">{Math.round(maxValue)}</text>

          {/* X-axis labels */}
          {points.map((point) => (
            <text key={`label-${point.label}`} x={point.x} y="300" fill="#9CA3AF" fontSize="12" textAnchor="middle">
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SessionsChart;
