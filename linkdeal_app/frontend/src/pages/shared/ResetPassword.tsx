import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import { authService } from "@/services/auth";

const stats = [
    { value: "10K+", label: "User" },
    { value: "500+", label: "Mentors" },
    { value: "4.9", label: "Note" }
];

export const ResetPassword = (): JSX.Element => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Missing reset token. Please use the link from your email.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await authService.confirmPasswordReset(token, password);
            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Password reset confirmation error:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Failed to reset password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-fadeInUpDelay { animation: fadeInUp 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-fadeInUpDelay2 { animation: fadeInUp 0.8s ease-out 0.4s forwards; opacity: 0; }
                .animate-fadeInUpDelay3 { animation: fadeInUp 0.8s ease-out 0.6s forwards; opacity: 0; }
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
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#7008e7] to-[#a683ff] rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[15px]">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap animate-fadeInUpDelay">
                                                Reset Password
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[40px]">
                                            <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-[21px] max-w-[400px] animate-fadeInUpDelay2">
                                                Please enter your new password below.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            {error && (
                                                <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                                </div>
                                            )}
                                            <div className="w-full mb-[24px]">
                                                <div className="mb-2">
                                                    <label className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                        New Password
                                                    </label>
                                                </div>
                                                <input
                                                    className="w-full h-[41px] bg-[#ffffff0d] rounded-[8px] border-[0.8px] border-solid border-[#fffefe1a] px-3 text-white text-sm placeholder-gray-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent hover:bg-[#ffffff1a] hover:border-[#a683ff]"
                                                    placeholder="Enter new password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                    minLength={8}
                                                />
                                            </div>
                                            <div className="w-full mb-[24px]">
                                                <div className="mb-2">
                                                    <label className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                        Confirm Password
                                                    </label>
                                                </div>
                                                <input
                                                    className="w-full h-[41px] bg-[#ffffff0d] rounded-[8px] border-[0.8px] border-solid border-[#fffefe1a] px-3 text-white text-sm placeholder-gray-500 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#7008e7] focus:border-transparent hover:bg-[#ffffff1a] hover:border-[#a683ff]"
                                                    placeholder="Confirm new password"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div className="w-full mb-[20px]">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className={`border-none outline-none w-full h-12 flex bg-[#7008e7] rounded-xl items-center justify-center cursor-pointer hover:bg-[#6007c5] hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 ease-out group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="[font-family:'Almarai-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                                    </div>
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full flex justify-center mb-[20px]">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[15px]">
                                            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                Password Reset Successful
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center mb-[40px]">
                                            <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm text-center tracking-[0] leading-[21px] max-w-[400px]">
                                                Your password has been successfully updated. You can now log in with your new password.
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
                                        {stats.map((stat) => (
                                            <div key={stat.label} className="flex flex-col items-center px-[32px] py-[20px] min-w-[140px] bg-[#ffffff0d] backdrop-blur-xl rounded-xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105 cursor-pointer">
                                                <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
                                                    {stat.value}
                                                </div>
                                                <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden relative z-10 px-6 py-12 space-y-8 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30 animate-pulse pointer-events-none" />

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
                    </div>

                    <div className="relative bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-6 shadow-lg shadow-[#7008e7]/30">
                        {!isSubmitted ? (
                            <>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl text-white font-medium">Reset Password</h3>
                                    <p className="text-sm text-white/70">Please enter your new password below.</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                            <p className="text-red-400 text-sm text-center">{error}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm text-white/80">New Password</label>
                                        <input
                                            className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7008e7] transition-all duration-200"
                                            placeholder="Enter new password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/80">Confirm Password</label>
                                        <input
                                            className="mt-2 w-full h-[44px] bg-[#ffffff0d] rounded-[10px] border border-white/10 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7008e7] transition-all duration-200"
                                            placeholder="Confirm new password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center space-y-4">
                                <h3 className="text-xl text-white font-medium">Reset Successful</h3>
                                <p className="text-sm text-white/70">Your password has been successfully updated.</p>
                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300 shadow-lg shadow-purple-500/30"
                                >
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
