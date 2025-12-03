import { useNavigate } from "react-router-dom";
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";

const stats = [
    { value: "10K+", label: "User" },
    { value: "500+", label: "Mentors" },
    { value: "4.9", label: "Note" }
];

export const Login = (): JSX.Element => {
    const navigate = useNavigate();
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
                        />
                    </div>
                    <div className="w-full flex items-center justify-between mb-[24px]">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
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
                    <div className="w-full mb-[20px]">
                        <button className="border-none outline-none w-full h-12 flex bg-[#7008e7] rounded-xl items-center justify-center cursor-pointer hover:bg-[#6007c5] hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-out group">
                    <div className="[font-family:'Almarai-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                        Log in
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
                        <button className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#0077B5]/30">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/>
                            </svg>
                        </button>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-300">
                            <svg className="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path>
                                <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path>
                                <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path>
                                <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
                            </svg>
                        </button>
                        <button className="w-12 h-12 bg-[#EA4335] rounded-full flex items-center justify-center hover:bg-[#D33B2C] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#EA4335]/30">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="w-full text-center">
                        <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px]">
                            Don't have an account yet?{" "}
                            <button 
                                className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#a683ff] text-sm tracking-[0] leading-[21px] whitespace-nowrap hover:text-[#8b6aff] hover:underline transition-all duration-200 ease-out transform hover:scale-105"
                                onClick={() => navigate('/signup')}
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
                                />
                            </div>
                            <div>
                                <label className="[font-family:'Inter-Medium',Helvetica] text-sm text-white/80">Password</label>
                                <input
                                    className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent transition-all duration-200"
                                    placeholder="********"
                                    type="password"
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-white/70">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 appearance-none bg-[#1A1A2E] border border-white/20 rounded checked:bg-[#7008e7] checked:border-transparent transition-all duration-200"
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
                            <button className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30">
                                Log in
                            </button>
                        </div>

                        <div className="relative h-[21px]">
                            <div className="absolute top-[10px] left-0 w-full h-px bg-white/20"></div>
                            <div className="absolute top-0 left-[50%] transform -translate-x-1/2 bg-transparent px-3">
                                <span className="text-sm text-white/70">or</span>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-6">
                            <button className="w-12 h-12 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#0077B5]/30">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/>
                                </svg>
                            </button>
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-300">
                                <svg className="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path>
                                    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path>
                                    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path>
                                    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
                                </svg>
                            </button>
                            <button className="w-12 h-12 bg-[#EA4335] rounded-full flex items-center justify-center hover:bg-[#D33B2C] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#EA4335]/30">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="text-center text-sm text-white/70">
                            Don't have an account yet?{" "}
                            <button
                                className="text-[#a683ff] hover:text-[#8b6aff] underline-offset-2 hover:underline"
                                onClick={() => navigate('/signup')}
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
