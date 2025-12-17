import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import linkDealLogoLight from "@/assets/landing_page/images/logo_light_mode.png";
import aiCoaching from "@/assets/landing_page/ai-coaching.svg";
import expertMentors from "@/assets/landing_page/expert-mentors.svg";
import accelerateGrowth from "@/assets/landing_page/accelerate-growth.svg";
import availability247 from "@/assets/landing_page/availability-24-7.svg";
import vector5 from "@/assets/landing_page/vector-5.svg";
import vector6 from "@/assets/landing_page/vector-6.svg";
import vector7 from "@/assets/landing_page/vector-7.svg";
import vector8 from "@/assets/landing_page/vector-8.svg";
import vector9 from "@/assets/landing_page/vector-9.svg";
import vector10 from "@/assets/landing_page/vector-10.svg";
import vector11 from "@/assets/landing_page/vector-11.svg";
import vector12 from "@/assets/landing_page/vector-12.svg";
import vector13 from "@/assets/landing_page/vector-13.svg";
import vector14 from "@/assets/landing_page/vector-14.svg";
import vector15 from "@/assets/landing_page/vector-15.svg";
import vector18 from "@/assets/landing_page/vector-18.svg";
import vector21 from "@/assets/landing_page/vector-21.svg";

export const LandingPage = (): JSX.Element => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Check if user is already authenticated - redirect to dashboard
    // Checks both localStorage (rememberMe) and sessionStorage (session-only)
    useEffect(() => {
        let token = localStorage.getItem('token');
        let user = localStorage.getItem('user');
        let tokenExpiry = localStorage.getItem('token_expiry');
        let storageType: 'local' | 'session' = 'local';

        // If not in localStorage, check sessionStorage
        if (!token) {
            token = sessionStorage.getItem('token');
            user = sessionStorage.getItem('user');
            tokenExpiry = sessionStorage.getItem('token_expiry');
            storageType = 'session';
        }

        if (token && user) {
            // Check if token is still valid (not expired)
            if (tokenExpiry) {
                const expiryDate = new Date(tokenExpiry);
                if (new Date() > expiryDate) {
                    // Token expired - clear and stay on landing page
                    console.log('Token expired - clearing auth data');
                    if (storageType === 'local') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('token_expiry');
                        localStorage.removeItem('remember_me');
                        localStorage.removeItem('id_token');
                    } else {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('token_expiry');
                        sessionStorage.removeItem('id_token');
                    }
                    return;
                }
            }

            // Token still valid - redirect to dashboard
            try {
                const userData = JSON.parse(user);
                const dashboardPath = `/${userData.role || 'mentee'}/dashboard`;
                console.log('User already authenticated - redirecting to:', dashboardPath);
                navigate(dashboardPath, { replace: true });
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, [navigate]);

    const featureCards = [
        {
            title: 'AI-Powered Coaching',
            description: 'Get instant insights and personalized recommendations from our advanced AI coach',
            icon: aiCoaching,
            iconBg: 'from-purple-600/20 to-purple-500/10',
            iconClass: ''
        },
        {
            title: 'Expert Mentors',
            description: 'Connect with experienced professionals who understand your challenges',
            icon: expertMentors,
            iconBg: 'from-purple-600/20 to-purple-500/10',
            iconClass: ''
        },
        {
            title: 'Accelerate Growth',
            description: 'Fast-track your learning journey with personalized guidance and support',
            icon: accelerateGrowth,
            iconBg: 'from-purple-600/20 to-purple-500/10',
            iconClass: 'green-icon'
        },
        {
            title: '24/7 Availability',
            description: 'Access AI coaching anytime, anywhere. Schedule human mentors at your convenience',
            icon: availability247,
            iconBg: 'from-blue-500/20 to-indigo-500/10',
            iconClass: ''
        }
    ];

    const successHighlights = [
        'Personalized learning paths tailored to your goals',
        'Instant AI feedback on your ideas and projects',
        'Access to a network of industry experts',
        'Flexible scheduling for 1-on-1 mentorship',
        'Track your progress with detailed analytics',
        'Community support and peer learning'
    ];

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '500+', label: 'Expert Mentors' },
        { value: '50K+', label: 'AI Sessions' },
        { value: '4.9/5', label: 'Avg Rating' }
    ];

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <style>{`
                @keyframes shadowPulse {
                    0%, 100% {
                        filter: drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6));
                    }
                    50% {
                        filter: drop-shadow(0 0 30px rgba(109, 40, 217, 1)) drop-shadow(0 0 60px rgba(110, 17, 176, 0.8));
                    }
                }
                
                @keyframes badgeFloat {
                    0%, 100% {
                        transform: translateY(0px) scale(1);
                    }
                    50% {
                        transform: translateY(-3px) scale(1.02);
                    }
                }
                
                .badge-container {
                    animation: badgeFloat 4s ease-in-out infinite;
                    transition: all 0.3s ease;
                }
                
                .badge-container:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(109, 40, 217, 0.4);
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.5), rgba(110, 17, 176, 0.3));
                    border-color: rgba(109, 40, 217, 0.8);
                }
                
                .badge-icon {
                    transition: transform 0.3s ease;
                }
                
                .badge-container:hover .badge-icon {
                    transform: rotate(360deg) scale(1.2);
                }
                
                .badge-text {
                    transition: all 0.3s ease;
                }
                
                .badge-container:hover .badge-text {
                    color: #fff;
                    text-shadow: 0 0 10px rgba(109, 40, 217, 0.8);
                }
                
                .btn-primary {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }
                
                .btn-primary:hover::before {
                    left: 100%;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(109, 40, 217, 0.4);
                    filter: brightness(1.1);
                }
                
                .btn-primary:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .btn-secondary {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-secondary:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(109, 40, 217, 0.3);
                    background: white;
                    border-color: rgba(109, 40, 217, 0.8);
                }
                
                .btn-secondary:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .btn-arrow {
                    transition: transform 0.3s ease;
                }
                
                .btn-primary:hover .btn-arrow,
                .btn-secondary:hover .btn-arrow {
                    transform: translateX(4px);
                }
                
                .feature-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(109, 40, 217, 0.1), transparent);
                    transition: left 0.5s ease;
                }
                
                .feature-card:hover::before {
                    left: 100%;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 10px 30px rgba(109, 40, 217, 0.3);
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.1), rgba(110, 17, 176, 0.05));
                    border-color: rgba(109, 40, 217, 0.6);
                }
                
                .feature-icon {
                    transition: transform 0.3s ease;
                }
                
                .feature-card:hover .feature-icon {
                    transform: scale(1.1) rotate(5deg);
                }
                
                .feature-card:hover .feature-icon-bg {
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.3), rgba(110, 17, 176, 0.2));
                }
                
                .feature-icon-bg {
                    background: rgba(109, 40, 217, 0.1) !important;
                }
                
                .feature-icon img {
                    filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(94%) contrast(92%);
                }
                
                /* Green icon for Accelerate Growth card */
                .green-icon {
                    filter: brightness(0) saturate(100%) invert(58%) sepia(89%) saturate(1264%) hue-rotate(86deg) brightness(91%) contrast(88%) !important;
                }
                
                .light-mode .feature-icon-bg {
                    background: rgba(109, 40, 217, 0.05) !important;
                }
                
                .stats-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .stats-card::before {
                    display: none;
                }
                
                .stats-card:hover::before {
                    display: none;
                }
                
                .stats-card:hover {
                    transform: none;
                }
                
                .stats-number {
                    transition: all 0.3s ease;
                }
                
                .stats-card:hover .stats-number {
                    color: #fff;
                    text-shadow: 0 0 15px rgba(109, 40, 217, 0.8);
                    transform: scale(1.05);
                }
                
                .light-mode .stats-card:hover .stats-number {
                    color: #8200DB !important;
                    text-shadow: 0 0 15px rgba(130, 0, 219, 0.3) !important;
                }
                
                /* Footer gradient orb in light mode */
                .light-mode .footer-orb {
                    position: absolute;
                    bottom: 100px;
                    left: -220px;
                    width: 287.99px;
                    height: 287.99px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(130, 0, 219, 0.15) 0%, rgba(255, 133, 203, 0.15) 100%);
                    filter: blur(20px);
                    z-index: 0;
                    pointer-events: none;
                }
                
                .stats-label {
                    transition: all 0.3s ease;
                }
                
                .stats-card:hover .stats-label {
                    color: #fff;
                }
                
                .theme-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    width: 70px;
                    height: 35px;
                    background: rgba(194, 122, 255, 0.2) !important;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    border: 2px solid rgba(194, 122, 255, 0.3) !important;
                }
                
                .theme-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                }
                
                .theme-toggle.dark {
                    background: linear-gradient(90deg, rgba(10, 25, 47, 1), rgba(26, 15, 46, 1)) !important;
                    border-color: rgba(109, 40, 217, 0.5) !important;
                    box-shadow: 0 4px 15px rgba(109, 40, 217, 0.3);
                }
                
                .theme-toggle.dark:hover {
                    box-shadow: 0 6px 20px rgba(109, 40, 217, 0.4);
                }
                
                .theme-slider {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 0 4px;
                    transition: all 0.3s ease;
                }
                
                .theme-toggle.dark .theme-slider {
                    justify-content: flex-end;
                }
                
                .theme-icon {
                    width: 28px;
                    height: 28px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    color: #1e293b;
                }
                
                .theme-toggle.dark .theme-icon {
                    background: white;
                    color: #1e293b;
                }
                
                .light-mode {
                    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
                }
                
                .light-mode .card-bg {
                    background: rgba(255, 255, 255, 0.9);
                }
                
                .light-mode .text-primary {
                    color: #1e293b;
                }
                
                .light-mode .text-secondary {
                    color: #64748b;
                }
                
                .light-mode .border-color {
                    border-color: rgba(109, 40, 217, 0.2);
                }
                
                /* Light mode text color overrides */
                .light-mode .feature-card {
                    background: rgba(255, 255, 255, 0.95) !important;
                    border-color: rgba(109, 40, 217, 0.2) !important;
                }
                
                .light-mode .feature-card p,
                .light-mode .feature-card div {
                    color: #1e293b !important;
                }
                
                .light-mode .badge-text {
                    color: #6d28d9 !important;
                }
                
                .light-mode .stats-number {
                    color: #1e293b !important;
                }
                
                .light-mode .stats-label {
                    color: #64748b !important;
                }
                
                .light-mode .btn-secondary {
                    background: white !important;
                    border-color: #cbd5e1 !important;
                }
                
                .light-mode .btn-secondary div {
                    color: #1e293b !important;
                }
                
                /* Target all text elements in light mode */
                .light-mode [class*="text-white"]:not(.btn-primary > div):not(.keep-white) {
                    color: #1e293b !important;
                }
                
                .light-mode .btn-primary {
                    color: #ffffff !important;
                }
                
                .light-mode [class*="text-[#99a1ae]"] {
                    color: #64748b !important;
                }
                
                .light-mode [class*="text-[#d0d5db]"] {
                    color: #475569 !important;
                }
                
                .light-mode [class*="bg-[#0a192fcc]"] {
                    background: rgba(255, 255, 255, 0.95) !important;
                }
                
                .light-mode [class*="border-[#6d28d833]"] {
                    border-color: rgba(109, 40, 217, 0.2) !important;
                }
                
                /* Footer titles color in light mode */
                .light-mode [class*="text-collection-1-colour-500-1"] {
                    color: #8200DB !important;
                }
                
                /* LinkDeal website text color in light mode */
                .light-mode .underline {
                    color: #8200DB !important;
                    text-decoration: none !important;
                }
                
                /* LinkDeal text color in light mode */
                .light-mode p[class*="text-white"] span[class*="text-white"] {
                    color: #8200DB !important;
                }
                
                /* Social media icons color in light mode */
                .light-mode svg.social-icon.text-white {
                    color: #6D28D9 !important;
                }
                
                /* Social media icon containers background in light mode */
                .light-mode a[class*="bg-white/10"] {
                    background: rgba(109, 40, 217, 0.1) !important;
                }
                
                .light-mode a[class*="hover:bg-white/20"] {
                    background: rgba(109, 40, 217, 0.2) !important;
                }
                
                .light-mode {
                    background: #ffffff !important;
                    position: relative;
                    overflow: hidden;
                }
                
                .light-mode::before {
                    content: '';
                    position: absolute;
                    top: 20%;
                    right: -100px;
                    transform: translateY(-50%);
                    width: 288px;
                    height: 288px;
                    border-radius: 50%;
                    background: linear-gradient(297deg, rgba(255, 133, 203, 0.25) 0%, rgba(163, 124, 205, 0.25) 100%);
                    filter: blur(32px);
                    z-index: 0;
                    pointer-events: none;
                }
                
                .light-mode::after {
                    content: '';
                    position: absolute;
                    bottom: 10%;
                    left: 970px;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(109, 40, 217, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
                    filter: blur(24px);
                    z-index: 0;
                    pointer-events: none;
                }
                
                /* Prevent logo selection and copying */
                .logo-protected {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -webkit-user-drag: none;
                    -khtml-user-drag: none;
                    -moz-user-drag: none;
                    -o-user-drag: none;
                    pointer-events: none;
                }
            `}</style>
            <div className={`bg-[linear-gradient(180deg,rgba(10,25,47,1)_0%,rgba(26,15,46,1)_50%,rgba(45,27,78,1)_100%)] w-full min-h-screen flex justify-center items-start ${!isDarkMode ? 'light-mode' : ''}`}>
                {/* Theme Toggle Button */}
                <button
                    className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    <div className="theme-slider">
                        <span className="theme-icon">
                            {isDarkMode ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            )}
                        </span>
                    </div>
                </button>
                <div className="hidden md:block w-full max-w-[1152px] min-h-[2108px] relative">
                    <div className="absolute top-[97px] left-8 w-[1088px] h-[1821px]">
                        <div className="flex justify-center w-full -mt-16">
                            <img
                                className={`w-64 h-64 logo-protected ${isDarkMode ? 'animate-pulse' : ''}`}
                                style={{
                                    filter: isDarkMode ? 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6))' : 'none',
                                    animation: isDarkMode ? 'shadowPulse 3s ease-in-out infinite' : 'none',
                                    opacity: isDarkMode ? 1 : 1
                                }}
                                alt="LinkDeal Logo"
                                src={isDarkMode ? linkDealLogo : linkDealLogoLight}
                            />
                        </div>
                        <div className="flex flex-col w-[1056px] h-[349.6px] items-start gap-12 absolute top-[714px] left-4">
                            <div className="relative self-stretch w-full h-20">
                                <div className="absolute top-0 left-0 h-10 w-[1056px] flex">
                                    <div className="mt-[-3px] w-[377px] h-10 ml-[340.4px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-4xl text-center tracking-[0] leading-10 whitespace-nowrap">
                                        Why Choose LinkDeal?
                                    </div>
                                </div>

                                <div className="absolute top-14 left-48 w-[672px] h-6 flex">
                                    <p className="mt-[-2.2px] w-[589px] h-6 ml-[41.9px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                        Combining the power of AI with human expertise to deliver
                                        unparalleled mentorship
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 grid-rows-1 h-[222px] gap-6 absolute top-32 left-0 w-[1056px]">
                                <div className="relative row-[1_/_2] col-[1_/_2] w-full h-[221.6px] flex flex-col items-start pt-[-1.22e-05px] pl-[-7.75e-07px] pr-0 pb-0 bg-[#0a192fcc] rounded-[14px] border-[0.8px] border-solid border-[#6d28d833] feature-card cursor-pointer">
                                    <div className="relative w-[244.4px] h-[220px]">
                                        <div className="absolute top-6 left-[90px] w-16 h-16 flex items-center justify-center bg-[#2d1b4e] rounded-2xl feature-icon-bg">
                                            <img
                                                className="w-8 h-8 feature-icon"
                                                alt="Landing"
                                                src={aiCoaching}
                                            />
                                        </div>

                                        <div className="absolute top-[104px] left-6 w-[196px] h-6 flex">
                                            <div className="mt-[-2.2px] w-[156px] h-6 ml-[19.9px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                                AI-Powered Coaching
                                            </div>
                                        </div>

                                        <div className="absolute top-[136px] left-6 w-[196px] h-[60px] flex">
                                            <p className="mt-[-1.2px] w-[194px] h-20 ml-[1.2px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-5">
                                                Get instant insights and personalized recommendations from
                                                our advanced AI coach
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative row-[1_/_2] col-[2_/_3] w-full h-[221.6px] flex flex-col items-start pt-[-1.22e-05px] pl-[1.83e-05px] pr-0 pb-0 bg-[#0a192fcc] rounded-[14px] border-[0.8px] border-solid border-[#6d28d833] feature-card cursor-pointer">
                                    <div className="relative w-[244.4px] h-[220px]">
                                        <div className="absolute top-6 left-[90px] w-16 h-16 flex items-center justify-center bg-[#2d1b4e] rounded-2xl feature-icon-bg">
                                            <img
                                                className="w-8 h-8 feature-icon"
                                                alt="Landing"
                                                src={expertMentors}
                                            />
                                        </div>

                                        <div className="absolute top-[104px] left-6 w-[196px] h-6 flex">
                                            <div className="mt-[-2.2px] w-[109px] h-6 ml-[44.4px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                                Expert Mentors
                                            </div>
                                        </div>

                                        <div className="absolute top-[136px] left-6 w-[196px] h-[60px] flex">
                                            <p className="mt-[-1.2px] w-[186px] h-[60px] ml-[5.7px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-5">
                                                Connect with experienced professionals who understand your
                                                challenges
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative row-[1_/_2] col-[3_/_4] w-full h-[221.6px] flex flex-col items-start pt-[-1.22e-05px] pl-[-1.22e-05px] pr-0 pb-0 bg-[#0a192fcc] rounded-[14px] border-[0.8px] border-solid border-[#6d28d833] feature-card cursor-pointer">
                                    <div className="relative w-[244.4px] h-[220px]">
                                        <div className="absolute top-6 left-[90px] w-16 h-16 flex items-center justify-center bg-[#2d1b4e] rounded-2xl feature-icon-bg">
                                            <img
                                                className="w-8 h-8 feature-icon green-icon"
                                                alt="Vector"
                                                src={accelerateGrowth}
                                            />
                                        </div>

                                        <div className="absolute top-[104px] left-6 w-[196px] h-6 flex">
                                            <div className="mt-[-2.2px] w-[132px] h-6 ml-[32.4px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                                Accelerate Growth
                                            </div>
                                        </div>

                                        <div className="absolute top-[136px] left-6 w-[196px] h-[60px] flex">
                                            <p className="mt-[-1.2px] w-[196px] h-[60px] ml-[0.2px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-5">
                                                Fast-track your learning journey with personalized
                                                guidance and support
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative row-[1_/_2] col-[4_/_5] w-full h-[221.6px] flex flex-col items-start pt-[-1.22e-05px] pl-[-1.22e-05px] pr-0 pb-0 bg-[#0a192fcc] rounded-[14px] border-[0.8px] border-solid border-[#6d28d833] feature-card cursor-pointer">
                                    <div className="relative w-[244.4px] h-[220px]">
                                        <div className="absolute top-6 left-[90px] w-16 h-16 flex items-center justify-center bg-[#2b7fff33] rounded-2xl feature-icon-bg">
                                            <img
                                                className="w-[30px] h-[28px] feature-icon"
                                                alt="Vector"
                                                src={availability247}
                                            />
                                        </div>

                                        <div className="absolute top-[104px] left-6 w-[196px] h-6 flex">
                                            <div className="mt-[-2.2px] w-[111px] h-6 ml-[43px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                                24/7 Availability
                                            </div>
                                        </div>

                                        <div className="absolute top-[136px] left-6 w-[196px] h-[60px] flex">
                                            <p className="mt-[-1.2px] w-[180px] h-[60px] ml-[8.6px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-5">
                                                Access AI coaching anytime, anywhere. Schedule human
                                                mentors at your convenience
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-[896px] h-[358px] items-start pt-[4.88e-05px] pl-[3.04e-06px] pr-0 pb-0 absolute top-[1191px] left-24 bg-[#0a192fcc] rounded-[14px] border-[0.8px] border-solid border-[#6d28d833]">
                            <div className="relative w-[894.4px] h-[356px]">
                                <div className="flex flex-col w-[798px] h-[76px] items-start gap-4 absolute top-12 left-12">
                                    <div className="relative self-stretch w-full h-9">
                                        <p className="absolute top-[-3px] left-[180px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-3xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                            Everything You Need to Succeed
                                        </p>
                                    </div>

                                    <div className="relative self-stretch w-full h-6">
                                        <p className="absolute -top-0.5 left-[180px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                                            Join thousands of learners achieving their goals with
                                            LinkDeal
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-[156px] left-12 w-[798px] h-[104px]">
                                    <div className="absolute top-0 left-0 w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector5}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector5}
                                            />
                                        </div>

                                        <div className="w-[349.06px] flex">
                                            <p className="mt-[-2.2px] w-[351px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Personalized learning paths tailored to your goals
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-0 left-[407px] w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector6}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector7}
                                            />
                                        </div>

                                        <div className="w-[327.02px] flex">
                                            <p className="mt-[-2.2px] w-[329px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Instant AI feedback on your ideas and projects
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-10 left-0 w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector8}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector9}
                                            />
                                        </div>

                                        <div className="w-[276.15px] flex">
                                            <p className="mt-[-2.2px] w-[279px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Access to a network of industry experts
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-10 left-[407px] w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector10}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector11}
                                            />
                                        </div>

                                        <div className="w-[295.88px] flex">
                                            <p className="mt-[-2.2px] w-[294px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Flexible scheduling for 1-on-1 mentorship
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-20 left-0 w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector12}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector13}
                                            />
                                        </div>

                                        <div className="w-[298.2px] flex">
                                            <p className="mt-[-2.2px] w-[302px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Track your progress with detailed analytics
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-20 left-[407px] w-[391px] h-6 flex gap-3">
                                        <div className="mt-0.5 w-5 h-5 relative">
                                            <img
                                                className="absolute w-[83.33%] h-[83.33%] top-[4.16%] left-[4.16%]"
                                                alt="Vector"
                                                src={vector14}
                                            />

                                            <img
                                                className="absolute w-[25.00%] h-[16.67%] top-[37.50%] left-[33.33%]"
                                                alt="Vector"
                                                src={vector15}
                                            />
                                        </div>

                                        <div className="w-[270.21px] flex">
                                            <p className="mt-[-2.2px] w-[268px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-base tracking-[0] leading-6 whitespace-nowrap">
                                                Community support and peer learning
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/signup" className="box-border absolute top-[292px] left-[336px] w-[222px] h-10 flex gap-[16.9px] rounded-lg bg-[linear-gradient(90deg,rgba(109,40,217,1)_0%,rgba(110,17,176,1)_100%)] border-0 cursor-pointer btn-primary no-underline">
                                    <div className="mt-[8.8px] w-[157px] h-5 ml-4 [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                                        Start Your Journey Today
                                    </div>

                                    <svg className="mt-3 w-4 h-4 btn-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="relative w-[383.99px] h-[383.99px] mb-[-383.19px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(233,212,255,0.2)_0%,rgba(190,219,255,0.2)_100%)]" />
                        </div>

                        <div className="grid grid-cols-4 grid-rows-1 w-[1056px] h-20 gap-6 absolute top-[1677px] left-4">
                            <div className="relative row-[1_/_2] col-[1_/_2] w-full h-full flex flex-col items-start gap-2 stats-card cursor-pointer">
                                <div className="relative self-stretch w-full h-12">
                                    <div className="absolute top-[-5px] left-[66px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap stats-number">
                                        10K+
                                    </div>
                                </div>

                                <div className="relative self-stretch w-full h-6">
                                    <div className="absolute -top-0.5 left-[78px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap stats-label">
                                        Active Users
                                    </div>
                                </div>
                            </div>

                            <div className="relative row-[1_/_2] col-[2_/_3] w-full h-full flex flex-col items-start gap-2 stats-card cursor-pointer">
                                <div className="relative self-stretch w-full h-12">
                                    <div className="absolute top-[-5px] left-[69px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap stats-number">
                                        500+
                                    </div>
                                </div>

                                <div className="relative self-stretch w-full h-6">
                                    <div className="absolute -top-0.5 left-[69px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap stats-label">
                                        Expert Mentors
                                    </div>
                                </div>
                            </div>

                            <div className="relative row-[1_/_2] col-[3_/_4] w-full h-full flex flex-col items-start gap-2 stats-card cursor-pointer">
                                <div className="relative self-stretch w-full h-12">
                                    <div className="absolute top-[-5px] left-[66px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap stats-number">
                                        50K+
                                    </div>
                                </div>

                                <div className="relative self-stretch w-full h-6">
                                    <div className="absolute -top-0.5 left-[81px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap stats-label">
                                        AI Sessions
                                    </div>
                                </div>
                            </div>

                            <div className="relative row-[1_/_2] col-[4_/_5] w-full h-full flex flex-col items-start gap-2 stats-card cursor-pointer">
                                <div className="relative self-stretch w-full h-12">
                                    <div className="absolute top-[-5px] left-[70px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap stats-number">
                                        4.9/5
                                    </div>
                                </div>

                                <div className="relative self-stretch w-full h-6">
                                    <div className="absolute -top-0.5 left-[84px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6 whitespace-nowrap stats-label">
                                        Avg Rating
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 left-0 w-[1088px] h-[650px]">
                            <div className="absolute top-0 left-0 w-[1088px] h-[650px] flex">
                                <div className="mt-[162.4px] w-2 h-2 ml-[272px] bg-violet-700 rounded-[26843500px] opacity-[0.96]" />

                                <div className="mt-[479.2px] w-2 h-2 ml-[82.7px] bg-violet-700 rounded-[26843500px] opacity-[0.84]" />

                                <div className="mt-[216.5px] w-3 h-3 ml-[342.7px] bg-[#c27aff] rounded-[26843500px] opacity-[0.91]" />
                            </div>

                            <div className="absolute top-20 left-4 w-[1056px] h-[490px]">
                                <div className="absolute top-[104px] left-0 w-[1056px] h-[234px] flex flex-col">
                                    <div className="ml-[409.6px] w-[236.73px] h-[25.59px] flex gap-3 bg-[#6d28d833] rounded-lg overflow-hidden border-[0.8px] border-solid border-[#6d28d84c] badge-container cursor-pointer">
                                        <div className="mt-[6.8px] w-3 h-3 relative ml-[16.8px] badge-icon">
                                            <img
                                                className="absolute w-[75.03%] h-[83.36%] top-[4.15%] left-[8.32%]"
                                                alt="Vector"
                                                src={vector18}
                                            />
                                        </div>

                                        <p className="mt-[3.8px] w-44 h-4 [font-family:'Arimo-Regular',Helvetica] font-normal text-violet-700 text-xs text-center tracking-[0] leading-4 whitespace-nowrap badge-text">
                                            AI &amp; Human Mentorship Platform
                                        </p>
                                    </div>

                                    <div className="mt-[16.0px] w-[1056px] flex">
                                        <div className="mt-[-7px] w-[301px] h-[72px] ml-[378.0px] [font-family:'Poppins-Medium',Helvetica] font-medium text-white text-7xl text-center tracking-[0] leading-[72px] whitespace-nowrap">
                                            LinkDeal
                                        </div>
                                    </div>

                                    <div className="flex w-[1056px] h-[31.99px] relative mt-6 items-start">
                                        <p className="relative flex-1 mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-2xl text-center tracking-[0] leading-8">
                                            Transform Your Journey with Personalized AI &amp; Expert
                                            Mentorship
                                        </p>
                                    </div>

                                    <div className="ml-48 w-[672px] mt-[16.0px] flex">
                                        <p className="mt-[-2.2px] w-[654px] h-12 ml-[9.1px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-6">
                                            Whether you&#39;re a student, entrepreneur, or professional,
                                            get instant AI coaching and connect with experienced mentors
                                            to accelerate your success.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-[1056px] h-14 items-center justify-center gap-4 pl-0 pr-[0.01px] py-0 absolute top-[362px] left-0">
                                    <Link to="/signup" className="box-border relative w-[145px] h-14 rounded-lg bg-[linear-gradient(90deg,rgba(109,40,217,1)_0%,rgba(110,17,176,1)_100%)] border-0 cursor-pointer btn-primary flex items-center justify-center no-underline">
                                        <div className="absolute top-[13px] left-[calc(50.00%_-_37px)] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-7 whitespace-nowrap">
                                            Join us
                                        </div>

                                        <svg className="absolute top-5 left-[116px] w-4 h-4 btn-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>

                                    <Link to="/login" className="box-border flex w-[122.15px] h-14 items-center justify-center gap-2 px-8 py-0 relative bg-white rounded-lg border-[0.8px] border-solid border-[#354152] cursor-pointer btn-secondary no-underline">
                                        <div className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-[#1a0f2e] text-lg tracking-[0] leading-7 whitespace-nowrap">
                                            Sign In
                                        </div>
                                    </Link>
                                </div>

                                <div className="absolute top-[468px] left-[429px] w-[198px] h-5 flex justify-center">
                                    <Link
                                        to="/about"
                                        className="mt-[-1.2px] w-[116px] h-5 ml-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-purple-400 transition-colors no-underline cursor-pointer"
                                    >
                                        Get to know us →
                                    </Link>
                                </div>

                                <div className="absolute top-[-35px] left-[663px] w-96 h-96 rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(233,212,255,0.2)_0%,rgba(190,219,255,0.2)_100%)]" />

                                <div className="absolute top-[-185px] left-[-29px] w-96 h-96 rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />
                            </div>
                        </div>

                        <div className="absolute top-[1052px] left-[794px] w-96 h-96 rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />

                        <div className="absolute top-[497px] left-4 w-[410px] h-[434px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(154,111,198,0.4)_0%,rgba(13,47,89,0.4)_100%)]" />
                    </div>

                    <p className="absolute top-[2062px] left-[377px] w-[161px] [font-family:'Manrope-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[21.6px] whitespace-nowrap">
                        <span className="[font-family:'Manrope-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[21.6px]">
                            LinkDeal{" "}
                        </span>

                        <a
                            href="http://gentisai.tilda.ws"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <span className="underline">website</span>
                        </a>
                    </p>

                    <div className="absolute top-[1948px] left-[377px] w-[209px] [font-family:'Manrope-Medium',Helvetica] font-medium text-collection-1-colour-500-1 text-xl tracking-[0] leading-[24.0px]">
                        Contact us:
                    </div>

                    <div className="absolute top-[1948px] left-[942px] w-[186px] [font-family:'Manrope-Medium',Helvetica] font-medium text-collection-1-colour-500-1 text-xl tracking-[0] leading-[24.0px]">
                        Get to know us:
                    </div>

                    {/* Social Media Icons */}
                    <div className="absolute top-[1990px] left-[942px] flex gap-4">
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                            </svg>
                        </a>
                    </div>

                    <div className="absolute top-[1948px] left-[13px] w-[209px] [font-family:'Manrope-Medium',Helvetica] font-medium text-collection-1-colour-500-1 text-xl tracking-[0] leading-[24.0px]">
                        All about LinkDeal:
                    </div>

                    <div className="absolute top-[1998px] left-[377px] w-[220px] [font-family:'Manrope-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[22.5px]">
                        Phone: +79162039843
                    </div>

                    <div className="absolute top-[2030px] left-[377px] w-[237px] [font-family:'Manrope-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[22.5px]">
                        Email: lynvia@gmail.com
                    </div>

                    <div className="absolute top-[1998px] left-[13px] w-[161px] [font-family:'Manrope-Medium',Helvetica] font-medium text-white text-lg tracking-[0] leading-[21.6px]">
                        About us
                    </div>

                    <img
                        className="absolute w-[2.34%] h-0 top-[94.59%] left-[82.55%]"
                        alt="Vector"
                        src={vector21}
                    />

                    {/* Footer gradient orb for light mode */}
                    <div className="footer-orb" style={{ display: isDarkMode ? 'none' : 'block' }} />

                    <img
                        className="absolute w-[2.26%] h-0 top-[94.59%] left-[86.98%]"
                        alt="Vector"
                        src={vector21}
                    />

                    <img
                        className="absolute w-[2.34%] h-0 top-[94.59%] left-[91.23%]"
                        alt="Vector"
                        src={vector18}
                    />
                </div>

                {/* Mobile layout */}
                <div className="md:hidden w-full px-6 py-12 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-10 right-[-60px] w-64 h-64 rounded-full bg-[linear-gradient(117deg,rgba(128,51,208,0.3)_0%,rgba(10,32,59,0.3)_100%)] blur-3xl" />
                        <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full bg-[linear-gradient(117deg,rgba(233,212,255,0.25)_0%,rgba(190,219,255,0.25)_100%)] blur-3xl" />
                        <div className="absolute bottom-[-40px] right-[-20px] w-64 h-64 rounded-full bg-[linear-gradient(117deg,rgba(154,111,198,0.3)_0%,rgba(13,47,89,0.3)_100%)] blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-xl mx-auto space-y-10">
                        <div className="flex flex-col items-center text-center gap-4">
                            <img
                                className={`w-28 h-28 logo-protected ${isDarkMode ? 'animate-pulse' : ''}`}
                                style={{
                                    filter: isDarkMode ? 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6))' : 'none',
                                    animation: isDarkMode ? 'shadowPulse 3s ease-in-out infinite' : 'none'
                                }}
                                alt="LinkDeal Logo"
                                src={isDarkMode ? linkDealLogo : linkDealLogoLight}
                            />
                            <div className="badge-container inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#6d28d833] border border-[#6d28d84c]">
                                <img src={vector18} alt="sparkle" className="w-3 h-3 badge-icon" />
                                <p className="text-xs text-violet-700 badge-text">AI &amp; Human Mentorship Platform</p>
                            </div>
                            <h1 className="text-4xl font-semibold text-white leading-tight">LinkDeal</h1>
                            <p className="text-lg text-white/80">
                                Transform Your Journey with Personalized AI &amp; Expert Mentorship
                            </p>
                            <p className="text-sm text-white/60">
                                Whether you&apos;re a student, entrepreneur, or professional, get instant AI coaching and connect with experienced mentors to accelerate your success.
                            </p>
                            <div className="w-full flex flex-col gap-3">
                                <Link
                                    to="/signup"
                                    className="btn-primary keep-white w-full rounded-xl bg-[linear-gradient(90deg,rgba(109,40,217,1)_0%,rgba(110,17,176,1)_100%)] text-white py-3 text-lg font-medium text-center no-underline"
                                >
                                    Join us
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-secondary w-full rounded-xl border border-white/10 bg-white/5 text-white py-3 text-lg font-medium text-center no-underline"
                                >
                                    Sign In
                                </Link>
                            </div>
                            <Link
                                to="/about"
                                className="text-xs text-white/60 hover:text-purple-400 transition-colors no-underline"
                            >
                                Get to know us →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white text-center">Why Choose LinkDeal?</h2>
                            <p className="text-sm text-white/60 text-center">
                                Combining the power of AI with human expertise to deliver unparalleled mentorship
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {featureCards.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="feature-card rounded-2xl bg-[#0a192fcc] border border-[#6d28d833] p-5 flex flex-col items-center text-center gap-3"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center feature-icon-bg`}>
                                            <img
                                                src={feature.icon}
                                                alt={feature.title}
                                                className={`w-8 h-8 feature-icon ${feature.iconClass}`}
                                            />
                                        </div>
                                        <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                                        <p className="text-sm text-white/70">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#0a192fcc] border border-[#6d28d833] p-6 space-y-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-semibold text-white">Everything You Need to Succeed</h3>
                                <p className="text-sm text-white/60">
                                    Join thousands of learners achieving their goals with LinkDeal
                                </p>
                            </div>
                            <ul className="space-y-3">
                                {successHighlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                                        <span className="text-purple-300 mt-1">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className="btn-primary keep-white w-full rounded-xl bg-[linear-gradient(90deg,rgba(109,40,217,1)_0%,rgba(110,17,176,1)_100%)] text-white py-3 text-base font-medium flex items-center justify-center gap-2 no-underline">
                                Start Your Journey Today
                                <svg className="w-4 h-4 btn-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center space-y-2 stats-card"
                                >
                                    <div className="text-2xl font-semibold text-white stats-number">{stat.value}</div>
                                    <p className="text-xs text-white/60 stats-label">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-semibold text-white">Stay Connected</h3>
                                <p className="text-sm text-white/60">All about LinkDeal</p>
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="text-sm text-white">About us</p>
                                <p className="text-sm text-white/80">Phone: +79162039843</p>
                                <p className="text-sm text-white/80">Email: Contact.lynvia@gmail.com</p>
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="text-sm text-white">Contact us</p>
                                <p className="text-sm text-white/80">{'LinkDeal '}
                                    <a
                                        href="http://gentisai.tilda.ws"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="underline text-white"
                                    >
                                        website
                                    </a>
                                </p>
                            </div>
                            <div className="space-y-3 text-center">
                                <p className="text-sm text-white">Get to know us</p>
                                <div className="flex justify-center gap-3">
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                        <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                        <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                        <svg className="w-5 h-5 text-white social-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
