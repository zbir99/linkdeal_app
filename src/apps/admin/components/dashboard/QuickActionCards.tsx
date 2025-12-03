import { useNavigate } from 'react-router-dom';

type QuickAction = {
    title: string;
    badge?: JSX.Element;
    description: string;
    icon: JSX.Element;
};


const createBadge = (text: string): JSX.Element => (
    <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9.99375C0 4.47436 4.47435 0 9.99375 0H12.4438C17.9631 0 22.4375 4.47436 22.4375 9.99375C22.4375 15.5131 17.9631 19.9875 12.4438 19.9875H9.99375C4.47435 19.9875 0 15.5131 0 9.99375Z" fill="#FB2C36"/>
        <text x="11" y="14" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">{text}</text>
    </svg>
);

const actions: QuickAction[] = [
    {
        title: 'Validate Mentors',
        badge: createBadge('4'),
        description: 'Review new mentor applications awaiting approval.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.334 14.6667L24.0007 17.3333L29.334 12" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.3327 28V25.3333C21.3327 23.9188 20.7708 22.5623 19.7706 21.5621C18.7704 20.5619 17.4138 20 15.9993 20H7.99935C6.58486 20 5.22831 20.5619 4.22811 21.5621C3.22792 22.5623 2.66602 23.9188 2.66602 25.3333V28" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.9993 14.6667C14.9449 14.6667 17.3327 12.2789 17.3327 9.33333C17.3327 6.38781 14.9449 4 11.9993 4C9.05383 4 6.66602 6.38781 6.66602 9.33333C6.66602 12.2789 9.05383 14.6667 11.9993 14.6667Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        ),
    },
    {
        title: 'Support Tickets',
        badge: createBadge('7'),
        description: 'Respond to the latest user support requests.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.9993 29.3334C23.3631 29.3334 29.3327 23.3639 29.3327 16.0001C29.3327 8.63628 23.3631 2.66675 15.9993 2.66675C8.63555 2.66675 2.66602 8.63628 2.66602 16.0001C2.66602 23.3639 8.63555 29.3334 15.9993 29.3334Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 10.6667V16.0001" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 21.3333H16.0133" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        ),
    },
    {
        title: 'User Management',
        description: 'Update permissions or deactivate inactive users.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3327 28V25.3333C21.3327 23.9188 20.7708 22.5623 19.7706 21.5621C18.7704 20.5619 17.4138 20 15.9993 20H7.99935C6.58486 20 5.22831 20.5619 4.22811 21.5621C3.22792 22.5623 2.66602 23.9188 2.66602 25.3333V28" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21.334 4.17065C22.4777 4.46715 23.4905 5.13501 24.2136 6.0694C24.9366 7.0038 25.3289 8.15184 25.3289 9.33332C25.3289 10.5148 24.9366 11.6628 24.2136 12.5972C23.4905 13.5316 22.4777 14.1995 21.334 14.496" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M29.334 28V25.3333C29.3331 24.1516 28.9398 23.0037 28.2158 22.0698C27.4918 21.1358 26.4782 20.4688 25.334 20.1733" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.9993 14.6667C14.9449 14.6667 17.3327 12.2789 17.3327 9.33333C17.3327 6.38781 14.9449 4 11.9993 4C9.05383 4 6.66602 6.38781 6.66602 9.33333C6.66602 12.2789 9.05383 14.6667 11.9993 14.6667Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        ),
    },
    {
        title: 'Settings',
        description: 'Adjust platform defaults and integrations.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8951 5.51464C12.9685 4.74176 13.3275 4.02404 13.9019 3.50168C14.4762 2.97933 15.2247 2.68988 16.0011 2.68988C16.7774 2.68988 17.5259 2.97933 18.1003 3.50168C18.6746 4.02404 19.0336 4.74176 19.1071 5.51464C19.1512 6.01392 19.315 6.4952 19.5846 6.91776C19.8541 7.34033 20.2216 7.69172 20.6557 7.94221C21.0898 8.1927 21.5779 8.33491 22.0787 8.3568C22.5794 8.3787 23.0781 8.27963 23.5324 8.06798C24.2379 7.74768 25.0373 7.70134 25.7751 7.93796C26.5128 8.17458 27.1362 8.67725 27.5238 9.34812C27.9113 10.019 28.0355 10.8101 27.8719 11.5674C27.7084 12.3247 27.2689 12.9941 26.6391 13.4453C26.2289 13.7331 25.8941 14.1155 25.663 14.56C25.4318 15.0046 25.3111 15.4983 25.3111 15.9993C25.3111 16.5004 25.4318 16.9941 25.663 17.4386C25.8941 17.8832 26.2289 18.2655 26.6391 18.5533C27.2689 19.0045 27.7084 19.6739 27.8719 20.4312C28.0355 21.1885 27.9113 21.9796 27.5238 22.6505C27.1362 23.3214 26.5128 23.824 25.7751 24.0607C25.0373 24.2973 24.2379 24.2509 23.5324 23.9306C23.0781 23.719 22.5794 23.6199 22.0787 23.6418C21.5779 23.6637 21.0898 23.8059 20.6557 24.0564C20.2216 24.3069 19.8541 24.6583 19.5846 25.0809C19.315 25.5034 19.1512 25.9847 19.1071 26.484C19.0336 27.2569 18.6746 27.9746 18.1003 28.4969C17.5259 29.0193 16.7774 29.3087 16.0011 29.3087C15.2247 29.3087 14.4762 29.0193 13.9019 28.4969C13.3275 27.9746 12.9685 27.2569 12.8951 26.484C12.851 25.9845 12.6872 25.5031 12.4176 25.0803C12.1479 24.6576 11.7804 24.3061 11.346 24.0556C10.9117 23.8051 10.4234 23.6629 9.92251 23.6412C9.42159 23.6194 8.92281 23.7187 8.46841 23.9306C7.76293 24.2509 6.96351 24.2973 6.22574 24.0607C5.48797 23.824 4.86464 23.3214 4.47705 22.6505C4.08946 21.9796 3.96536 21.1885 4.12889 20.4312C4.29241 19.6739 4.73187 19.0045 5.36174 18.5533C5.7719 18.2655 6.10671 17.8832 6.33786 17.4386C6.569 16.9941 6.68968 16.5004 6.68968 15.9993C6.68968 15.4983 6.569 15.0046 6.33786 14.56C6.10671 14.1155 5.7719 13.7331 5.36174 13.4453C4.73276 12.9939 4.29407 12.3248 4.13094 11.568C3.96781 10.8111 4.09188 10.0207 4.47905 9.35026C4.86622 8.67982 5.48882 8.17728 6.22586 7.9403C6.9629 7.70332 7.76172 7.74882 8.46707 8.06798C8.92142 8.27963 9.42006 8.3787 9.92081 8.3568C10.4216 8.33491 10.9096 8.1927 11.3438 7.94221C11.7779 7.69172 12.1453 7.34033 12.4149 6.91776C12.6845 6.4952 12.8483 6.01392 12.8924 5.51464" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

export const QuickActionCards = (): JSX.Element => {
    const navigate = useNavigate();
    
    const handleActionClick = (title: string) => {
        if (title === 'Validate Mentors') {
            navigate('/admin/mentors');
        } else if (title === 'Support Tickets') {
            navigate('/admin/support-tickets');
        } else if (title === 'User Management') {
            navigate('/admin/user-management');
        } else if (title === 'Settings') {
            navigate('/admin/settings');
        }
    };
    
    return (
        <section className="w-full space-y-4">
            <div>
                <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {actions.map((action) => (
                    <button
                        type="button"
                        key={action.title}
                        onClick={() => handleActionClick(action.title)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left text-white transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            {action.icon}

                            {action.badge && (
                                <span>
                                    {action.badge}
                                </span>
                            )}
                        </div>

                        <p className="text-base font-medium leading-6">{action.title}</p>
                        <p className="mt-2 text-sm text-white/70">{action.description}</p>
                    </button>
                ))}
            </div>
        </section>
    );
};