import { useState, useEffect } from 'react';
import api from '@/services/api';

type StatCard = {
    label: string;
    value: string;
    badge: JSX.Element;
    tone: 'positive' | 'steady' | 'warning';
    icon: JSX.Element;
    iconBg: string;
};

// Badge components (kept exactly the same)
const PositiveBadge1 = () => (
    <svg width="48" height="22" viewBox="0 0 48 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_161_9829" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H37.5125C43.0353 0 47.5125 4.47715 47.5125 10V11.5875C47.5125 17.1104 43.0353 21.5875 37.5125 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H37.5125C43.0353 0 47.5125 4.47715 47.5125 10V11.5875C47.5125 17.1104 43.0353 21.5875 37.5125 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#00C950" fillOpacity="0.1" />
        <path d="M10 0V0.8H37.5125V0V-0.8H10V0ZM47.5125 10H46.7125V11.5875H47.5125H48.3125V10H47.5125ZM37.5125 21.5875V20.7875H10V21.5875V22.3875H37.5125V21.5875ZM0 11.5875H0.8V9.99999H0H-0.8V11.5875H0ZM10 21.5875V20.7875C4.91899 20.7875 0.8 16.6685 0.8 11.5875H0H-0.8C-0.8 17.5522 4.03534 22.3875 10 22.3875V21.5875ZM47.5125 11.5875H46.7125C46.7125 16.6685 42.5935 20.7875 37.5125 20.7875V21.5875V22.3875C43.4772 22.3875 48.3125 17.5522 48.3125 11.5875H47.5125ZM37.5125 0V0.8C42.5935 0.8 46.7125 4.91898 46.7125 10H47.5125H48.3125C48.3125 4.03533 43.4772 -0.8 37.5125 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03532 -0.8 9.99999H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="#00C950" fillOpacity="0.2" mask="url(#path-1-inside-1_161_9829)" />
        <text x="24" y="14" textAnchor="middle" fill="#05DF72" fontSize="10" fontWeight="500">Active</text>
    </svg>
);

const PositiveBadge2 = () => (
    <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_161_9842" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H32.6875C38.2103 0 42.6875 4.47715 42.6875 10V11.5875C42.6875 17.1104 38.2103 21.5875 32.6875 21.5875H10C4.47715 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H32.6875C38.2103 0 42.6875 4.47715 42.6875 10V11.5875C42.6875 17.1104 38.2103 21.5875 32.6875 21.5875H10C4.47715 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#00C950" fillOpacity="0.1" />
        <path d="M10 0V0.8H32.6875V0V-0.8H10V0ZM42.6875 10H41.8875V11.5875H42.6875H43.4875V10H42.6875ZM32.6875 21.5875V20.7875H10V21.5875V22.3875H32.6875V21.5875ZM0 11.5875H0.8V9.99999H0H-0.8V11.5875H0ZM10 21.5875V20.7875C4.91898 20.7875 0.8 16.6685 0.8 11.5875H0H-0.8C-0.8 17.5522 4.03533 22.3875 10 22.3875V21.5875ZM42.6875 11.5875H41.8875C41.8875 16.6685 37.7685 20.7875 32.6875 20.7875V21.5875V22.3875C38.6522 22.3875 43.4875 17.5522 43.4875 11.5875H42.6875ZM32.6875 0V0.8C37.7685 0.8 41.8875 4.91898 41.8875 10H42.6875H43.4875C43.4875 4.03533 38.6522 -0.8 32.6875 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03532 -0.8 9.99999H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="#00C950" fillOpacity="0.2" mask="url(#path-1-inside-1_161_9842)" />
        <text x="21" y="14" textAnchor="middle" fill="#05DF72" fontSize="10" fontWeight="500">Live</text>
    </svg>
);

const PositiveBadge3 = () => (
    <svg width="50" height="22" viewBox="0 0 50 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_161_9854" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H39.35C44.8728 0 49.35 4.47715 49.35 10V11.5875C49.35 17.1104 44.8728 21.5875 39.35 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H39.35C44.8728 0 49.35 4.47715 49.35 10V11.5875C49.35 17.1104 44.8728 21.5875 39.35 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#00C950" fillOpacity="0.1" />
        <path d="M10 0V0.8H39.35V0V-0.8H10V0ZM49.35 10H48.55V11.5875H49.35H50.15V10H49.35ZM39.35 21.5875V20.7875H10V21.5875V22.3875H39.35V21.5875ZM0 11.5875H0.8V9.99999H0H-0.8V11.5875H0ZM10 21.5875V20.7875C4.91898 20.7875 0.8 16.6685 0.8 11.5875H0H-0.8C-0.8 17.5522 4.03533 22.3875 10 22.3875V21.5875ZM49.35 11.5875H48.55C48.55 16.6685 44.431 20.7875 39.35 20.7875V21.5875V22.3875C45.3147 22.3875 50.15 17.5522 50.15 11.5875H49.35ZM39.35 0V0.8C44.431 0.8 48.55 4.91898 48.55 10H49.35H50.15C50.15 4.03533 45.3147 -0.8 39.35 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03532 -0.8 9.99999H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="#00C950" fillOpacity="0.2" mask="url(#path-1-inside-1_161_9854)" />
        <text x="25" y="14" textAnchor="middle" fill="#05DF72" fontSize="10" fontWeight="500">MTD</text>
    </svg>
);

const WarningBadge = () => (
    <svg width="56" height="22" viewBox="0 0 56 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_161_9867" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H45.325C50.8478 0 55.325 4.47715 55.325 10V11.5875C55.325 17.1104 50.8478 21.5875 45.325 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H45.325C50.8478 0 55.325 4.47715 55.325 10V11.5875C55.325 17.1104 50.8478 21.5875 45.325 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#FF6900" fillOpacity="0.1" />
        <path d="M10 0V0.8H45.325V0V-0.8H10V0ZM55.325 10H54.525V11.5875H55.325H56.125V10H55.325ZM45.325 21.5875V20.7875H10V21.5875V22.3875H45.325V21.5875ZM0 11.5875H0.8V9.99999H0H-0.8V11.5875H0ZM10 21.5875V20.7875C4.91899 20.7875 0.8 16.6685 0.8 11.5875H0H-0.8C-0.8 17.5522 4.03533 22.3875 10 22.3875V21.5875ZM55.325 11.5875H54.525C54.525 16.6685 50.406 20.7875 45.325 20.7875V21.5875V22.3875C51.2897 22.3875 56.125 17.5522 56.125 11.5875H55.325ZM45.325 0V0.8C50.406 0.8 54.525 4.91898 54.525 10H55.325H56.125C56.125 4.03533 51.2897 -0.8 45.325 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03532 -0.8 9.99999H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="#FF6900" fillOpacity="0.2" mask="url(#path-1-inside-1_161_9867)" />
        <text x="28" y="14" textAnchor="middle" fill="#FF8904" fontSize="10" fontWeight="500">Urgent</text>
    </svg>
);

// Icon components (kept exactly the same)
const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.12793C16.8578 3.3503 17.6174 3.85119 18.1597 4.55199C18.702 5.25279 18.9962 6.11382 18.9962 6.99993C18.9962 7.88604 18.702 8.74707 18.1597 9.44787C17.6174 10.1487 16.8578 10.6496 16 10.8719" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 20.9999V18.9999C21.9993 18.1136 21.7044 17.2527 21.1614 16.5522C20.6184 15.8517 19.8581 15.3515 19 15.1299" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MentorIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11L18 13L22 9" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const RevenueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V22" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PendingIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#FF6900" fillOpacity="0.2" />
        <path d="M24 34C29.5228 34 34 29.5228 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34Z" stroke="#FF8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 20V24" stroke="#FF8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 28H24.01" stroke="#FF8904" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Icon for platform earnings
const PlatformEarningsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 14L4 9L9 4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 20V13C20 11.9391 19.5786 10.9217 18.8284 10.1716C18.0783 9.42143 17.0609 9 16 9H4" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Platform earnings badge
const EarningsBadge = () => (
    <svg width="60" height="22" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-earnings" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H50C55.5228 0 60 4.47715 60 10V11.5875C60 17.1104 55.5228 21.5875 50 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H50C55.5228 0 60 4.47715 60 10V11.5875C60 17.1104 55.5228 21.5875 50 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#A684FF" fillOpacity="0.1" />
        <path d="M10 0V0.8H50V0V-0.8H10V0Z" fill="#A684FF" fillOpacity="0.2" mask="url(#path-1-inside-earnings)" />
        <text x="30" y="14" textAnchor="middle" fill="#A684FF" fontSize="10" fontWeight="500">Profit</text>
    </svg>
);

// Total payments icon (dollar sign)
const TotalPaymentsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#05DF72" strokeWidth="2" />
        <path d="M12 6V18" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 9.5C15 8.12 13.657 7 12 7C10.343 7 9 8.12 9 9.5C9 10.88 10.343 12 12 12C13.657 12 15 13.12 15 14.5C15 15.88 13.657 17 12 17C10.343 17 9 15.88 9 14.5" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Total badge
const TotalBadge = () => (
    <svg width="48" height="22" viewBox="0 0 48 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-total" fill="white">
            <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H38C43.5228 0 48 4.47715 48 10V11.5875C48 17.1104 43.5228 21.5875 38 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" />
        </mask>
        <path d="M0 9.99999C0 4.47715 4.47715 0 10 0H38C43.5228 0 48 4.47715 48 10V11.5875C48 17.1104 43.5228 21.5875 38 21.5875H10C4.47716 21.5875 0 17.1103 0 11.5875V9.99999Z" fill="#00C950" fillOpacity="0.1" />
        <path d="M10 0V0.8H38V0V-0.8H10V0Z" fill="#00C950" fillOpacity="0.2" mask="url(#path-1-inside-total)" />
        <text x="24" y="14" textAnchor="middle" fill="#05DF72" fontSize="10" fontWeight="500">Total</text>
    </svg>
);

export const StatisticCards = (): JSX.Element => {
    const [stats, setStats] = useState<StatCard[]>([
        {
            label: 'Total Users',
            value: '-',
            badge: <PositiveBadge1 />,
            tone: 'positive',
            icon: <UsersIcon />,
            iconBg: 'bg-purple-500/20',
        },
        {
            label: 'Active Mentors',
            value: '-',
            badge: <PositiveBadge2 />,
            tone: 'positive',
            icon: <MentorIcon />,
            iconBg: 'bg-blue-500/20',
        },
        {
            label: 'Total Payments',
            value: '-',
            badge: <TotalBadge />,
            tone: 'positive',
            icon: <TotalPaymentsIcon />,
            iconBg: 'bg-green-500/20',
        },
        {
            label: 'Platform Earnings',
            value: '-',
            badge: <EarningsBadge />,
            tone: 'positive',
            icon: <PlatformEarningsIcon />,
            iconBg: 'bg-purple-500/20',
        },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/admin/dashboard/stats/');
                const data = response.data;

                setStats(prev => [
                    { ...prev[0], value: data.total_users.toLocaleString() },
                    { ...prev[1], value: data.active_mentors.toLocaleString() },
                    { ...prev[2], value: data.total_payments || '$0.00' },
                    { ...prev[3], value: data.platform_earnings || '$0.00' },
                ]);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="w-full">
            <div className="grid gap-4 sm:gap-6 grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <article
                        key={stat.label}
                        className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/15 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="mb-3 sm:mb-6 flex items-center justify-between">
                            <div className={`flex items-center justify-center rounded-lg sm:rounded-xl ${stat.iconBg} w-8 h-8 sm:w-12 sm:h-12`}>
                                <div className="scale-75 sm:scale-100">
                                    {stat.icon}
                                </div>
                            </div>

                            <div className="scale-75 sm:scale-100 origin-right">
                                {stat.badge}
                            </div>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">{stat.label}</p>
                            <p className="text-xl sm:text-3xl font-semibold tracking-tight text-white">
                                {loading ? (
                                    <span className="inline-block w-16 h-8 bg-white/10 rounded animate-pulse"></span>
                                ) : (
                                    stat.value
                                )}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};
