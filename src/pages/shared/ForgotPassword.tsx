import { useState } from "react";
import { useNavigate } from "react-router-dom";
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";

const stats = [
    { value: "10K+", label: "User" },
    { value: "500+", label: "Mentors" },
    { value: "4.9", label: "Note" }
];

export const ForgotPassword = (): JSX.Element => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending reset email
        setIsSubmitted(true);
    };

    const handleBackToLogin = () => {
        navigate('/login');
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
                                {!isSubmitted ? (
                                    <>
                                        <div className="w-full flex justify-center mb-[20px]">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#7008e7] to-[#a683ff] rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 hover:rotate-3 cursor-pointer">
                                                <svg className="w-8 h-8 text-white transition-all duration-300 ease-out hover:scale-95" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[15px]">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap animate-fadeInUpDelay">
                                                Forgot Password?
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[40px]">
                                            <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-[21px] max-w-[400px] animate-fadeInUpDelay2">
                                                No worries! Enter your email address and we'll send you a link to reset your password.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="w-full mb-[24px]">
                                                <div className="mb-2">
                                                    <label className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                        Email Address
                                                    </label>
                                                </div>
                                                <input
                                                    className="w-full h-[41px] bg-[#ffffff0d] rounded-[8px] border-[0.8px] border-solid border-[#fffefe1a] px-3 text-white text-sm placeholder-gray-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent hover:bg-[#ffffff1a] hover:border-[#a683ff]"
                                                    placeholder="votre@email.com"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="w-full mb-[20px]">
                                                <button 
                                                    type="submit"
                                                    className="border-none outline-none w-full h-12 flex bg-[#7008e7] rounded-xl items-center justify-center cursor-pointer hover:bg-[#6007c5] hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-out group"
                                                >
                                                    <div className="[font-family:'Almarai-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                                                        Send Reset Link
                                                    </div>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="w-full text-center">
                                            <button 
                                                className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#a683ff] text-sm tracking-[0] leading-[21px] whitespace-nowrap hover:text-[#8b6aff] hover:underline transition-all duration-200 ease-out transform hover:scale-105"
                                                onClick={handleBackToLogin}
                                            >
                                                ← Back to Login
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full flex justify-center mb-[20px]">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[15px]">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                Check Your Email
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[40px]">
                                            <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-[21px] max-w-[400px]">
                                                We've sent a password reset link to <span className="text-purple-400 font-medium">{email}</span>. Please check your inbox and follow the instructions.
                                            </p>
                                        </div>
                                        <div className="w-full mb-[20px]">
                                            <button 
                                                onClick={handleBackToLogin}
                                                className="border-none outline-none w-full h-12 flex bg-[#7008e7] rounded-xl items-center justify-center cursor-pointer hover:bg-[#6007c5] hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-out group"
                                            >
                                                <div className="[font-family:'Almarai-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                                                    Back to Login
                                                </div>
                                            </button>
                                        </div>
                                        <div className="w-full text-center">
                                            <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px]">
                                                Didn't receive the email?{" "}
                                                <button 
                                                    className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#a683ff] text-sm tracking-[0] leading-[21px] whitespace-nowrap hover:text-[#8b6aff] hover:underline transition-all duration-200 ease-out transform hover:scale-105"
                                                    onClick={() => setIsSubmitted(false)}
                                                >
                                                    Resend
                                                </button>
                                            </p>
                                        </div>
                                    </>
                                )}
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
                            Accelerate your learning with intelligence
                        </p>
                    </div>

                    {/* Forgot Password form */}
                    <div className="relative bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-6 shadow-lg shadow-[#7008e7]/30">
                        {!isSubmitted ? (
                            <>
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#7008e7] to-[#a683ff] rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-xl text-white font-medium">Forgot Password?</h3>
                                    <p className="text-sm text-white/70">
                                        No worries! Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="[font-family:'Inter-Medium',Helvetica] text-sm text-white/80">Email Address</label>
                                        <input
                                            className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent transition-all duration-200"
                                            placeholder="votre@email.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30"
                                    >
                                        Send Reset Link
                                    </button>
                                </form>

                                <div className="text-center text-sm">
                                    <button
                                        className="text-[#a683ff] hover:text-[#8b6aff] underline-offset-2 hover:underline"
                                        onClick={handleBackToLogin}
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-xl text-white font-medium">Check Your Email</h3>
                                    <p className="text-sm text-white/70">
                                        We've sent a password reset link to <span className="text-purple-400 font-medium">{email}</span>. Please check your inbox.
                                    </p>
                                </div>

                                <button 
                                    onClick={handleBackToLogin}
                                    className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30"
                                >
                                    Back to Login
                                </button>

                                <div className="text-center text-sm text-white/70">
                                    Didn't receive the email?{" "}
                                    <button
                                        className="text-[#a683ff] hover:text-[#8b6aff] underline-offset-2 hover:underline"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Resend
                                    </button>
                                </div>
                            </>
                        )}
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

export default ForgotPassword;

