import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

/**
 * LinkingRequest Page
 * 
 * This page is shown when a user tries to login with social media (Google/LinkedIn)
 * but an account with that email already exists in the database (registered via email/password).
 * 
 * The user can choose to:
 * 1. Link accounts - sends a verification email to confirm
 * 2. Cancel - go back to login
 */
export const LinkingRequest = (): JSX.Element => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Get social auth data from session storage
    const socialEmail = sessionStorage.getItem('social_auth_email') || '';
    const socialName = sessionStorage.getItem('social_auth_name') || '';
    const socialPicture = sessionStorage.getItem('social_auth_picture') || '';
    const existingRole = sessionStorage.getItem('social_auth_existing_role') || 'mentee';

    useEffect(() => {
        // If no social auth data, redirect to login
        if (!socialEmail) {
            navigate('/login', { replace: true });
        }
    }, [socialEmail, navigate]);

    const handleLinkAccounts = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            // Build registration data from session storage
            const registrationData = {
                full_name: socialName,
                email: socialEmail,
                // These will be optional/default for linking flow
                field_of_study: '',
                country: sessionStorage.getItem('social_auth_country') || '',
                language: sessionStorage.getItem('social_auth_language') || '',
            };

            const response = await authService.requestAccountLinking(
                socialEmail,
                existingRole as 'mentor' | 'mentee',
                registrationData
            );

            if (response.success) {
                setStatus('success');
                setMessage(response.message || 'Verification email sent! Please check your inbox.');
            } else {
                setStatus('error');
                setMessage(response.message || 'Failed to request account linking.');
            }
        } catch (err: any) {
            console.error('Linking request error:', err);
            setStatus('error');
            setMessage(err.message || 'Failed to request account linking.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Clear social auth session data
        sessionStorage.removeItem('social_auth_pending');
        sessionStorage.removeItem('social_auth_email');
        sessionStorage.removeItem('social_auth_name');
        sessionStorage.removeItem('social_auth_picture');
        sessionStorage.removeItem('social_auth_existing_role');
        sessionStorage.removeItem('social_auth_requires_linking');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login', { replace: true });
    };

    const handleGoToLogin = () => {
        // Clear session and go to login
        handleCancel();
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] flex items-center justify-center">
            <div className="bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4 shadow-lg shadow-purple-500/20">

                {status === 'idle' && (
                    <>
                        {/* Header with profile picture */}
                        <div className="text-center mb-6">
                            {socialPicture && (
                                <img
                                    src={socialPicture}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-500"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <h2 className="text-xl text-white font-semibold mb-2">Account Already Exists</h2>
                            <p className="text-white/70 text-sm">
                                An account with <span className="text-purple-400 font-medium">{socialEmail}</span> already exists.
                            </p>
                        </div>

                        {/* Explanation */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                            <p className="text-white/80 text-sm leading-relaxed">
                                Would you like to link your <span className="text-purple-400">Google/LinkedIn</span> account
                                to your existing account? This will allow you to sign in with either method.
                            </p>
                            <p className="text-white/60 text-xs mt-3">
                                We'll send a verification email to <span className="text-white/80">{socialEmail}</span> to confirm.
                            </p>
                        </div>

                        {/* Error message */}
                        {message && (
                            <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {message}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLinkAccounts}
                                className="flex-1 py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span>Link Accounts</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-semibold mb-2">Check Your Email!</h2>
                        <p className="text-green-400 text-sm mb-4">{message}</p>
                        <p className="text-white/60 text-xs mb-6">
                            Click the link in the email to complete account linking.
                            The link expires in 15 minutes.
                        </p>
                        <button
                            onClick={handleGoToLogin}
                            className="w-full py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors"
                        >
                            Got it, go to Login
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-semibold mb-2">Something Went Wrong</h2>
                        <p className="text-red-400 text-sm mb-6">{message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { setStatus('idle'); setMessage(''); }}
                                className="flex-1 py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkingRequest;
