import { useState, useEffect } from 'react';
import api from '@/services/api';

type ChartConfig = {
    title: string;
    type: 'bar' | 'line';
    data: number[];
    yTicks: string[];
    xTicks: string[];
    color?: string;
    stroke?: string;
};

type PeriodFilter = 'day' | 'month' | 'year';

const ChartCard = ({
    type,
    data,
    yTicks,
    xTicks,
    color,
    stroke,
}: ChartConfig): JSX.Element => {
    const chartWidth = 350;
    const chartHeight = 220;
    const padding = 45;
    const innerWidth = chartWidth - padding * 2;
    const innerHeight = chartHeight - padding * 2;

    const barWidth = innerWidth / Math.max(data.length, 1) * 0.6;
    const barSpacing = innerWidth / Math.max(data.length, 1);

    const maxY = Math.max(...data, 1);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5" style={{ aspectRatio: '350/220' }}>
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="absolute inset-0 z-20 text-white/90"
                preserveAspectRatio="none"
            >
                {/* Grid lines - horizontal */}
                {[0, 45, 90, 135, 180, 220].map((y) => (
                    <line
                        key={`h-${y}`}
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeDasharray="3 3"
                    />
                ))}

                {/* Grid lines - vertical */}
                {xTicks.map((_, index) => {
                    const x = padding + index * barSpacing + barSpacing / 2;
                    return (
                        <line
                            key={`v-${index}`}
                            x1={x}
                            y1={padding}
                            x2={x}
                            y2={chartHeight - padding}
                            stroke="white"
                            strokeOpacity="0.1"
                            strokeDasharray="3 3"
                        />
                    );
                })}

                {type === 'bar' ? (
                    // Bar chart
                    data.map((value, index) => {
                        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
                        const height = (value / maxY) * innerHeight;
                        const y = chartHeight - padding - height;

                        return (
                            <rect
                                key={`bar-${index}`}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={height}
                                fill={color}
                                rx="8"
                            />
                        );
                    })
                ) : (
                    // Line chart
                    <>
                        <polyline
                            fill="none"
                            stroke={stroke}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={data.map((value, index) => {
                                const x = padding + index * barSpacing + barSpacing / 2;
                                const y = chartHeight - padding - (value / maxY) * innerHeight;
                                return `${x},${y}`;
                            }).join(' ')}
                        />

                        {/* Data points */}
                        {data.map((value, index) => {
                            const x = padding + index * barSpacing + barSpacing / 2;
                            const y = chartHeight - padding - (value / maxY) * innerHeight;

                            return (
                                <circle
                                    key={`point-${index}`}
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    fill={stroke}
                                    stroke={stroke}
                                    strokeWidth="3"
                                />
                            );
                        })}
                    </>
                )}

                {/* Axes */}
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#9CA3AF" />
                <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#9CA3AF" />

                {/* Y-axis labels */}
                {yTicks.map((tick, index) => (
                    <text
                        key={`y-${tick}`}
                        x={padding - 10}
                        y={chartHeight - padding - (index * innerHeight / (yTicks.length - 1))}
                        fill="#9CA3AF"
                        fontSize="12"
                        textAnchor="end"
                        alignmentBaseline="middle"
                    >
                        {tick}
                    </text>
                ))}

                {/* X-axis labels */}
                {xTicks.map((tick, index) => {
                    const x = padding + index * barSpacing + barSpacing / 2;
                    return (
                        <text
                            key={`x-${tick}`}
                            x={x}
                            y={chartHeight - padding + 20}
                            fill="#9CA3AF"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            {tick}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export const DashboardCharts = (): JSX.Element => {
    const [period, setPeriod] = useState<PeriodFilter>('month');
    const [loading, setLoading] = useState(true);
    const [userGrowth, setUserGrowth] = useState<ChartConfig>({
        title: 'User Growth',
        type: 'bar',
        color: '#8B5CF6',
        data: [],
        yTicks: ['0', '25', '50', '75'],
        xTicks: [],
    });
    const [revenueTrend, setRevenueTrend] = useState<ChartConfig>({
        title: 'Revenue Trend',
        type: 'line',
        stroke: '#10B981',
        data: [],
        yTicks: ['0', '250', '500', '750'],
        xTicks: [],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/admin/dashboard/charts/?period=${period}`);
                const data = response.data;

                setUserGrowth(prev => ({
                    ...prev,
                    data: data.user_growth.data,
                    xTicks: data.user_growth.labels,
                    yTicks: data.user_growth.y_ticks.reverse(),
                }));

                setRevenueTrend(prev => ({
                    ...prev,
                    data: data.revenue_trend.data,
                    xTicks: data.revenue_trend.labels,
                    yTicks: data.revenue_trend.y_ticks.reverse(),
                }));
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [period]);

    const filters: { label: string; value: PeriodFilter }[] = [
        { label: 'Day', value: 'day' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' },
    ];

    return (
        <section className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Analytics</h2>
                <div className="flex gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setPeriod(filter.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${period === filter.value
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* User Growth Chart */}
                <article className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <header>
                        <h3 className="text-2xl font-semibold text-white">{userGrowth.title}</h3>
                    </header>
                    {loading ? (
                        <div className="flex items-center justify-center h-[220px]">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ChartCard {...userGrowth} />
                    )}
                </article>

                {/* Revenue Trend Chart */}
                <article className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <header>
                        <h3 className="text-2xl font-semibold text-white">{revenueTrend.title}</h3>
                    </header>
                    {loading ? (
                        <div className="flex items-center justify-center h-[220px]">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ChartCard {...revenueTrend} />
                    )}
                </article>
            </div>
        </section>
    );
};