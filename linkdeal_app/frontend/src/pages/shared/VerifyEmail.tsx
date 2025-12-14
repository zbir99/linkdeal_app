import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authService } from '@/services/auth';

const VerifyEmail = (): JSX.Element => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Missing verification token');
                return;
            }

            try {
                const response = await authService.verifyEmail(token);
                setStatus('success');
                setMessage(response.message || 'Email verified successfully!');
            } catch (error: any) {
                setStatus('error');
                if (error.response?.data?.message) {
                    setMessage(error.response.data.message);
                } else if (error.message) {
                    setMessage(error.message);
                } else {
                    setMessage('Failed to verify email. The link may be expired or invalid.');
                }
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] bg-gradient-to-br from-purple-600/20 via-blue-500/15 to-transparent" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] bg-gradient-to-br from-purple-700/25 via-pink-500/15 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Icon based on status */}
                <div className="mb-8 flex justify-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-green-500/20' :
                            status === 'error' ? 'bg-red-500/20' :
                                'bg-purple-500/20 animate-pulse'
                        }`}>
                        {status === 'success' ? (
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : status === 'error' ? (
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-12 h-12 text-purple-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {status === 'verifying' ? 'Verifying Email...' :
                        status === 'success' ? 'Email Verified' :
                            'Verification Failed'}
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                    {status === 'verifying' ? 'Please wait while we verify your email address.' : message}
                </p>

                {/* Info Box (only for error) */}
                {status === 'error' && (
                    <div className="bg-[#ffffff0d] border border-[#fffefe1a] rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white/80 text-sm">
                                    The link may have expired or already been used.
                                    You can request a new verification link from the login page or your profile settings.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    to={status === 'success' ? '/login' : '/'}
                    className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-[#7008e7] via-[#8E51FF] to-[#7008e7] bg-[length:200%_100%] rounded-xl text-white font-semibold hover:bg-[position:100%_0] hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 mb-4"
                >
                    {status === 'success' ? 'Go to Login' : 'Back to Home'}
                </Link>
            </div>
        </div>
    );
};

export default VerifyEmail;
