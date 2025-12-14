import { useNavigate } from "react-router-dom";
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth";

const stats = [
    { value: "10K+", label: "User" },
    { value: "500+", label: "Mentors" },
    { value: "4.9", label: "Note" }
];

export const Login = (): JSX.Element => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // On page load: Check authentication and clear stale social auth data
    useEffect(() => {
        // Check if user is already authenticated - check both localStorage (rememberMe) and sessionStorage (session-only)
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
                    // Token expired - clear and stay on login
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
                } else {
                    // Token still valid - redirect to dashboard
                    try {
                        const userData = JSON.parse(user);
                        const dashboardPath = `/${userData.role || 'mentee'}/dashboard`;
                        console.log('User already authenticated - redirecting to:', dashboardPath);
                        navigate(dashboardPath, { replace: true });
                        return;
                    } catch (e) {
                        console.error('Error parsing user data:', e);
                    }
                }
            } else {
                // No expiry set but token exists - still valid, redirect
                try {
                    const userData = JSON.parse(user);
                    const dashboardPath = `/${userData.role || 'mentee'}/dashboard`;
                    console.log('User already authenticated - redirecting to:', dashboardPath);
                    navigate(dashboardPath, { replace: true });
                    return;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        }

        // Clear any incomplete social auth data
        const isSocialAuthPending = sessionStorage.getItem('social_auth_pending') === 'true';
        const hasSocialData = sessionStorage.getItem('social_auth_email') !== null ||
            sessionStorage.getItem('social_auth_picture') !== null;

        // Always clear social auth data when user visits login page
        // This handles users who abandoned registration and came back to login
        if (isSocialAuthPending || hasSocialData) {
            console.log('Login - Clearing incomplete social auth data');
            sessionStorage.removeItem('social_auth_pending');
            sessionStorage.removeItem('social_auth_timestamp');
            sessionStorage.removeItem('social_auth_name');
            sessionStorage.removeItem('social_auth_given_name');
            sessionStorage.removeItem('social_auth_family_name');
            sessionStorage.removeItem('social_auth_nickname');
            sessionStorage.removeItem('social_auth_picture');
            sessionStorage.removeItem('social_auth_email');
            sessionStorage.removeItem('social_auth_country');
            sessionStorage.removeItem('social_auth_language');
            sessionStorage.removeItem('social_auth_provider');
            sessionStorage.removeItem('social_auth_existing_role');
            sessionStorage.removeItem('social_auth_requires_linking');
            // Also clear any stale tokens that might have been from the abandoned social auth
            if (!token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
            }
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login(formData, rememberMe);

            if (response.success) {
                // Navigate to role-specific dashboard
                const userRole = response.data?.role || 'mentee';
                const dashboardPath = `/${userRole}/dashboard`;
                navigate(dashboardPath);
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes glow {
                    0%, 100% {
                        box-shadow: 0px 4px 6px -4px #7008e780, 0px 10px 15px -3px #7008e780;
                    }
                    50% {
                        box-shadow: 0px 4px 6px -4px #7008e7cc, 0px 10px 15px -3px #7008e7cc, 0px 0px 20px #7008e766;
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-fadeInUpDelay {
                    animation: fadeInUp 0.8s ease-out 0.2s forwards;
                    opacity: 0;
                }
                
                .animate-fadeInUpDelay2 {
                    animation: fadeInUp 0.8s ease-out 0.4s forwards;
                    opacity: 0;
                }
                
                .animate-fadeInUpDelay3 {
                    animation: fadeInUp 0.8s ease-out 0.6s forwards;
                    opacity: 0;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
            `}</style>
            <div className="relative w-full min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="fixed inset-0 overflow-hidden w-full h-screen flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 animate-pulse"></div>
                        <div className="flex w-full max-w-[1400px] h-[694.4px] relative z-10 mx-auto items-center justify-center gap-[70px]">
                            <div className="relative w-[520px] bg-[#ffffff0d] backdrop-blur-xl rounded-[18px] border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a,0px_20px_25px_-5px_#7008e730] pt-[40px] pb-[40px] px-[33px] flex flex-col transition-all duration-500 ease-out hover:shadow-[0px_20px_25px_-5px_#7008e750,0px_10px_10px_-5px_#00000020] hover:scale-[1.01] animate-fadeInUp">
                                <div className="w-full flex justify-center mb-[20px]">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#7008e7] to-[#a683ff] rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 hover:rotate-3 cursor-pointer">
                                        <svg className="w-8 h-8 text-white transition-all duration-300 ease-out hover:scale-95" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center mb-[30px]">
                                    <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap animate-fadeInUpDelay">
                                        Welcome
                                    </div>
                                </div>
                                <div className="w-full flex justify-center mb-[40px]">
                                    <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-[21px] whitespace-nowrap animate-fadeInUpDelay2">
                                        Log in to access your platform
                                    </p>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <div className="mb-2">
                                        <label className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Email
                                        </label>
                                    </div>
                                    <input
                                        className="w-full h-[41px] bg-[#ffffff0d] rounded-[8px] border-[0.8px] border-solid border-[#fffefe1a] px-3 text-white text-sm placeholder-gray-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent hover:bg-[#ffffff1a] hover:border-[#a683ff]"
                                        placeholder="votre@email.com"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-full mb-[16px]">
                                    <div className="mb-2">
                                        <label className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Password
                                        </label>
                                    </div>
                                    <input
                                        className="w-full h-[41px] bg-[#ffffff0d] rounded-[8px] border-[0.8px] border-solid border-[#fffefe1a] px-3 text-white text-sm placeholder-gray-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent hover:bg-[#ffffff1a] hover:border-[#a683ff]"
                                        placeholder="********"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-full flex items-center justify-between mb-[24px]">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 appearance-none bg-[#1A1A2E] border-[0.8px] border-solid border-[#fffefe1a] rounded focus:ring-2 focus:ring-[#7008e7] focus:ring-offset-0 focus:outline-none transition-all duration-200 ease-out hover:border-[#a683ff] cursor-pointer checked:bg-[#7008e7] checked:border-transparent checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEwIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEwzLjUgNkw5IDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-center bg-no-repeat"
                                        />
                                        <label htmlFor="remember" className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px] whitespace-nowrap ml-2 cursor-pointer hover:text-white transition-all duration-200 ease-out">
                                            Remember me
                                        </label>
                                    </div>
                                    <button
                                        className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#a683ff] text-sm tracking-[0] leading-[21px] whitespace-nowrap hover:text-[#8b6aff] hover:underline transition-all duration-200 ease-out transform hover:scale-105"
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                {error && (
                                    <div className="w-full mb-[20px] p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="w-full mb-[20px]">
                                    <button
                                        className="border-none outline-none w-full h-12 flex bg-[#7008e7] rounded-xl items-center justify-center cursor-pointer hover:bg-[#6007c5] hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-out group disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                    >
                                        <div className="[font-family:'Almarai-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                                            {isLoading ? 'Logging in...' : 'Log in'}
                                        </div>
                                    </button>
                                </div>
                                <div className="w-full mb-[20px]">
                                    <div className="relative h-[21px]">
                                        <div className="absolute top-[10px] left-0 w-full h-px bg-[#fffefe1a] opacity-20"></div>
                                        <div className="absolute top-0 left-[50%] transform -translate-x-1/2 bg-transparent px-3">
                                            <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px] whitespace-nowrap">or</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center items-center gap-6 mb-[20px]">
                                    <button
                                        onClick={() => authService.loginWithSocial('linkedin')}
                                        className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#0077B5]/30"
                                        title="Login with LinkedIn"
                                    >
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => authService.loginWithSocial('google-oauth2')}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-300"
                                        title="Login with Google"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-full text-center">
                                    <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px]">
                                        Don't have an account yet?{" "}
                                        <button
                                            className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#a683ff] text-sm tracking-[0] leading-[21px] whitespace-nowrap hover:text-[#8b6aff] hover:underline transition-all duration-200 ease-out transform hover:scale-105"
                                            onClick={() => {
                                                // Clear any existing social auth data to ensure fresh signup
                                                sessionStorage.removeItem('social_auth_pending');
                                                sessionStorage.removeItem('social_auth_timestamp');
                                                sessionStorage.removeItem('social_auth_name');
                                                sessionStorage.removeItem('social_auth_given_name');
                                                sessionStorage.removeItem('social_auth_family_name');
                                                sessionStorage.removeItem('social_auth_nickname');
                                                sessionStorage.removeItem('social_auth_picture');
                                                sessionStorage.removeItem('social_auth_email');
                                                sessionStorage.removeItem('social_auth_country');
                                                sessionStorage.removeItem('social_auth_language');
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('user');
                                                navigate('/signup');
                                            }}
                                        >
                                            Create an account
                                        </button>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col w-[620px] h-[455px] bg-[#ffffff0d] backdrop-blur-xl rounded-3xl border-[0.8px] border-solid border-[#fffefe1a] p-[48.8px] shadow-[0px_20px_25px_-5px_#7008e730] transition-all duration-500 ease-out hover:shadow-[0px_25px_30px_-5px_#7008e750] hover:scale-[1.01] animate-fadeInUpDelay3 self-center">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={linkDealLogo}
                                        alt="LinkDeal Logo"
                                        className="h-40 w-auto"
                                        style={{
                                            filter: 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6))'
                                        }}
                                    />
                                    <h2 className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] text-center tracking-[0] leading-[42px] whitespace-nowrap mb-4">
                                        Coaching IA &amp; Mentoring Humain
                                    </h2>
                                    <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base text-center tracking-[0] leading-[26px] mb-8">
                                        Accelerate your learning with intelligence
                                    </p>
                                    <div className="flex gap-8">
                                        <div className="flex flex-col items-center px-[32px] py-[20px] min-w-[140px] bg-[#ffffff0d] backdrop-blur-xl rounded-xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105 cursor-pointer">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                10K+
                                            </div>
                                            <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                                User
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center px-[32px] py-[20px] min-w-[140px] bg-[#ffffff0d] backdrop-blur-xl rounded-xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105 cursor-pointer">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                500+
                                            </div>
                                            <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                                Mentors
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center px-[32px] py-[20px] min-w-[140px] bg-[#ffffff0d] backdrop-blur-xl rounded-xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105 cursor-pointer">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                4.9
                                            </div>
                                            <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                                Note
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden relative z-10 px-6 py-12 space-y-8 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30 animate-pulse pointer-events-none" />

                    {/* Intro text now at the top */}
                    <div className="relative space-y-4 text-center">
                        <img
                            src={linkDealLogo}
                            alt="LinkDeal Logo"
                            className="h-24 w-auto mx-auto"
                            style={{
                                filter: 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.8)) drop-shadow(0 0 40px rgba(110, 17, 176, 0.6))'
                            }}
                        />
                        <h2 className="[font-family:'Inter-Regular',Helvetica] font-normal text-3xl leading-8">
                            Coaching IA &amp; Mentoring Humain
                        </h2>
                        <p className="[font-family:'Arimo-Regular',Helvetica] text-white/70 text-base leading-6">
                            Accelerate your learning with intelligence. Log in to continue your journey.
                        </p>
                    </div>

                    {/* Login form becomes second section */}
                    <div className="relative bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-6 shadow-lg shadow-[#7008e7]/30">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#7008e7] to-[#a683ff] rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="[font-family:'Inter-Medium',Helvetica] text-sm text-white/80">Email</label>
                                <input
                                    className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent transition-all duration-200"
                                    placeholder="votre@email.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="[font-family:'Inter-Medium',Helvetica] text-sm text-white/80">Password</label>
                                <input
                                    className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent transition-all duration-200"
                                    placeholder="********"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-white/70">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 appearance-none bg-[#1A1A2E] border border-white/20 rounded checked:bg-[#7008e7] checked:border-transparent transition-all duration-200 relative"
                                        style={{
                                            backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 16 16'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "12px"
                                        }}
                                    />
                                    Remember me
                                </label>
                                <button
                                    className="text-[#a683ff] hover:text-[#8b6aff] transition-colors"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm mb-4">
                                    {error}
                                </div>
                            )}
                            <button
                                className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>

                        <div className="relative h-[21px]">
                            <div className="absolute top-[10px] left-0 w-full h-px bg-white/20"></div>
                            <div className="absolute top-0 left-[50%] transform -translate-x-1/2 bg-transparent px-3">
                                <span className="text-sm text-white/70">or</span>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => authService.loginWithSocial('linkedin')}
                                className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#0077B5]/30"
                            >
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => authService.loginWithSocial('google-oauth2')}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-300"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </button>
                        </div>

                        <div className="text-center text-sm text-white/70">
                            Don't have an account yet?{" "}
                            <button
                                className="text-[#a683ff] hover:text-[#8b6aff] underline-offset-2 hover:underline"
                                onClick={() => {
                                    // Clear any existing social auth data to ensure fresh signup
                                    sessionStorage.removeItem('social_auth_pending');
                                    sessionStorage.removeItem('social_auth_timestamp');
                                    sessionStorage.removeItem('social_auth_name');
                                    sessionStorage.removeItem('social_auth_given_name');
                                    sessionStorage.removeItem('social_auth_family_name');
                                    sessionStorage.removeItem('social_auth_nickname');
                                    sessionStorage.removeItem('social_auth_picture');
                                    sessionStorage.removeItem('social_auth_email');
                                    sessionStorage.removeItem('social_auth_country');
                                    sessionStorage.removeItem('social_auth_language');
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    navigate('/signup');
                                }}
                            >
                                Create an account
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="min-w-[100px] flex-1 flex flex-col items-center px-3 py-3 bg-[#ffffff0d] backdrop-blur-xl rounded-xl border border-white/10 shadow-lg shadow-[#7008e7]/20 snap-center"
                            >
                                <div className="[font-family:'Inter-Regular',Helvetica] text-xl text-[#a683ff]">{stat.value}</div>
                                <div className="[font-family:'Arimo-Regular',Helvetica] text-[10px] text-white/70">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
