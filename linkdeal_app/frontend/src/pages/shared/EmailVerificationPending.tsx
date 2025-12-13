import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

const EmailVerificationPending: FunctionComponent = () => {
    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] bg-gradient-to-br from-purple-600/20 via-blue-500/15 to-transparent" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] bg-gradient-to-br from-purple-700/25 via-pink-500/15 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Email Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#7008e7]/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#8E51FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Check Your Email
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                    We've sent a verification link to your email address.
                    Please click the link to verify your account before logging in.
                </p>

                {/* Info Box */}
                <div className="bg-[#ffffff0d] border border-[#fffefe1a] rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-[#C8B0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-white/80 text-sm">
                                Didn't receive the email? Check your spam folder or wait a few minutes.
                                The verification link will expire in 24 hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Button */}
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-[#7008e7] via-[#8E51FF] to-[#7008e7] bg-[length:200%_100%] rounded-xl text-white font-semibold hover:bg-[position:100%_0] hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 mb-4"
                >
                    Go to Login
                </Link>

                {/* Back to Home */}
                <Link
                    to="/"
                    className="text-[#C8B0FF] text-sm hover:text-white transition-colors duration-200"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default EmailVerificationPending;
