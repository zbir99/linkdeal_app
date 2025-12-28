import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';

interface StatsData {
    total_sessions: number;
    completed_sessions: number;
    average_rating: number | null;
    total_earned: string;
}

export const SessionsStats: FunctionComponent = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/scheduling/sessions/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch sessions stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statsConfig = [
        {
            icon: (
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#7008E7" fillOpacity="0.2" />
                    <path d="M16.6667 11.666V14.9993" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23.3333 11.666V14.9993" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25.8333 13.334H14.1667C13.2462 13.334 12.5 14.0802 12.5 15.0007V26.6673C12.5 27.5878 13.2462 28.334 14.1667 28.334H25.8333C26.7538 28.334 27.5 27.5878 27.5 26.6673V15.0007C27.5 14.0802 26.7538 13.334 25.8333 13.334Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.5 18.334H27.5" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            value: stats?.total_sessions ?? 0,
            label: 'Total Sessions'
        },
        {
            icon: (
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#22C55E" fillOpacity="0.2" />
                    <path d="M23.3333 15.834H28.3333V20.834" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28.3333 15.834L21.25 22.9173L17.0833 18.7507L11.6667 24.1673" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            value: stats?.completed_sessions ?? 0,
            label: 'Completed'
        },
        {
            icon: (
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#FBBF24" fillOpacity="0.2" />
                    <path d="M19.6042 11.9118C19.6407 11.838 19.6971 11.7759 19.7671 11.7324C19.837 11.689 19.9177 11.666 20 11.666C20.0824 11.666 20.163 11.689 20.233 11.7324C20.3029 11.7759 20.3593 11.838 20.3959 11.9118L22.3209 15.8109C22.4477 16.0676 22.6349 16.2896 22.8664 16.458C23.0979 16.6263 23.3668 16.736 23.65 16.7776L27.955 17.4076C28.0366 17.4194 28.1132 17.4538 28.1763 17.5069C28.2393 17.56 28.2862 17.6297 28.3117 17.7081C28.3372 17.7865 28.3403 17.8704 28.3205 17.9505C28.3008 18.0305 28.259 18.1034 28.2 18.1609L25.0867 21.1926C24.8814 21.3927 24.7278 21.6397 24.6391 21.9123C24.5504 22.1849 24.5292 22.475 24.5775 22.7576L25.3125 27.0409C25.3269 27.1225 25.3181 27.2064 25.2871 27.2832C25.2561 27.3599 25.2041 27.4264 25.1371 27.4751C25.0702 27.5237 24.9908 27.5526 24.9082 27.5583C24.8257 27.5641 24.7431 27.5465 24.67 27.5076L20.8217 25.4843C20.5681 25.3511 20.286 25.2816 19.9996 25.2816C19.7132 25.2816 19.4311 25.3511 19.1775 25.4843L15.33 27.5076C15.257 27.5463 15.1745 27.5637 15.0921 27.5578C15.0096 27.5519 14.9305 27.5231 14.8636 27.4744C14.7968 27.4258 14.7449 27.3594 14.7139 27.2828C14.6829 27.2061 14.6741 27.1223 14.6884 27.0409L15.4225 22.7584C15.471 22.4757 15.45 22.1854 15.3613 21.9126C15.2726 21.6398 15.1189 21.3927 14.9134 21.1926L11.8 18.1618C11.7405 18.1043 11.6984 18.0313 11.6783 17.951C11.6583 17.8707 11.6612 17.7864 11.6868 17.7078C11.7123 17.6291 11.7594 17.5591 11.8228 17.5059C11.8861 17.4527 11.9631 17.4183 12.045 17.4068L16.3492 16.7776C16.6327 16.7363 16.902 16.6268 17.1338 16.4584C17.3657 16.29 17.5531 16.0678 17.68 15.8109L19.6042 11.9118Z" stroke="#FBBF24" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            value: stats?.average_rating ? parseFloat(String(stats.average_rating)).toFixed(1) : '-',
            label: 'Avg Rating'
        },
        {
            icon: (
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12Z" fill="#22C55E" fillOpacity="0.2" />
                    <path d="M20 11.666V28.3327" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24.1667 14.166H17.9167C17.1431 14.166 16.4013 14.4733 15.8543 15.0203C15.3073 15.5673 15 16.3091 15 17.0827C15 17.8562 15.3073 18.5981 15.8543 19.1451C16.4013 19.6921 17.1431 19.9993 17.9167 19.9993H22.0833C22.8569 19.9993 23.5987 20.3066 24.1457 20.8536C24.6927 21.4006 25 22.1425 25 22.916C25 23.6896 24.6927 24.4314 24.1457 24.9784C23.5987 25.5254 22.8569 25.8327 22.0833 25.8327H15" stroke="#4ADE80" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            value: `$${stats?.total_earned ? parseFloat(String(stats.total_earned)).toFixed(0) : '0'}`,
            label: 'Total Earned'
        }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 flex items-center gap-2 sm:gap-3 animate-pulse">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg" />
                        <div className="flex-1">
                            <div className="h-6 bg-white/10 rounded w-12 mb-1" />
                            <div className="h-3 bg-white/10 rounded w-20" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statsConfig.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 flex items-center gap-2 sm:gap-3 hover:bg-white/10 hover:scale-105 transition-all duration-300"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        {stat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-xl sm:text-2xl font-semibold mb-1">{stat.value}</div>
                        <div className="text-white/60 text-[10px] sm:text-xs truncate">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
