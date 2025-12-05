type Activity = {
    icon: JSX.Element;
    title: string;
    subtitle: string;
    time: string;
};

const createIcon = (letter: string, bgColor: string): JSX.Element => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill={bgColor} fillOpacity="0.2"/>
        <text x="20" y="24" fill="#A684FF" fontSize="16" fontWeight="bold" textAnchor="middle">{letter}</text>
    </svg>
);

const activities: Activity[] = [
    {
        icon: createIcon('A', '#7008E7'),
        title: 'New mentor registration',
        subtitle: 'Alexandre Dubois',
        time: '5 min ago',
    },
    {
        icon: createIcon('S', '#7008E7'),
        title: 'Support ticket opened',
        subtitle: 'Sophie Martin',
        time: '15 min ago',
    },
    {
        icon: createIcon('P', '#7008E7'),
        title: 'Payment processed',
        subtitle: 'Thomas Bernard',
        time: '1 hour ago',
    },
    {
        icon: createIcon('U', '#7008E7'),
        title: 'New user signed up',
        subtitle: 'Julie Petit',
        time: '2 hours ago',
    },
    {
        icon: createIcon('S', '#7008E7'),
        title: 'Session completed',
        subtitle: 'Marc Dubois',
        time: '3 hours ago',
    },
];

export const RecentActivity = (): JSX.Element => {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <header className="mb-6">
                <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
            </header>

            <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                    <article
                        key={activity.title}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-4 text-white transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="flex items-center gap-4">
                            {activity.icon}

                            <div>
                                <p className="text-base font-medium">{activity.title}</p>
                                <p className="text-sm text-white/70">{activity.subtitle}</p>
                            </div>
                        </div>

                        <span className="text-xs text-white/60">{activity.time}</span>
                    </article>
                ))}
            </div>
        </section>
    );
};