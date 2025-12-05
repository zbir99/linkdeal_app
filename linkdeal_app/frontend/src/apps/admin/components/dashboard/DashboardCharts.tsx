type ChartConfig = {
    title: string;
    type: 'bar' | 'line';
    data: number[];
    yTicks: string[];
    xTicks: string[];
    color?: string;
    stroke?: string;
};

const charts: ChartConfig[] = [
    {
        title: 'User Growth',
        type: 'bar',
        color: '#8B5CF6',
        data: [89.5, 61.3, 48, 33.9, 21.5, 13],
        yTicks: ['300', '200', '100', '0'],
        xTicks: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    {
        title: 'Revenue Trend',
        type: 'line',
        stroke: '#10B981',
        data: [167.5, 136.6, 117.1, 85.4, 49.7, 11.5],
        yTicks: ['300', '200', '100', '0'],
        xTicks: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
];

const ChartCard = ({
    title,
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
    
    const barWidth = innerWidth / data.length * 0.6;
    const barSpacing = innerWidth / data.length;
    
    const maxY = Math.max(...data);
    
    return (
        <article className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <header>
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </header>

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
                    {[45, 103, 161, 219, 277, 335, 350].map((x) => (
                        <line
                            key={`v-${x}`}
                            x1={x}
                            y1={padding}
                            x2={x}
                            y2={chartHeight - padding}
                            stroke="white"
                            strokeOpacity="0.1"
                            strokeDasharray="3 3"
                        />
                    ))}
                    
                    {type === 'bar' ? (
                        // Bar chart
                        data.map((value, index) => {
                            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
                            const height = innerHeight - (value / maxY) * innerHeight;
                            const y = chartHeight - padding - height;
                            
                            return (
                                <rect
                                    key={index}
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
                                        key={index}
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
                            key={tick}
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
                                key={tick}
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
        </article>
    );
};

export const DashboardCharts = (): JSX.Element => {
    return (
        <section className="grid gap-6 lg:grid-cols-2">
            {charts.map((chart) => (
                <ChartCard key={chart.title} {...chart} />
            ))}
        </section>
    );
};