import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/auth';

export const SocialCallback = (): JSX.Element => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(true);
    const processedRef = useRef(false); // Prevent double-processing

    useEffect(() => {
        const handleCallback = async () => {
            // Prevent double-processing (React StrictMode, HMR, etc.)
            if (processedRef.current) {
                return;
            }
            processedRef.current = true;

            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const errorParam = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');

            // Check for Auth0 error
            if (errorParam) {
                setError(errorDescription || errorParam);
                setProcessing(false);
                return;
            }

            // Validate required params
            if (!code || !state) {
                setError('Missing authorization code or state. Please try again.');
                setProcessing(false);
                return;
            }

            // Handle the callback - follows flow steps 4-8
            const result = await authService.handleSocialCallback(code, state);

            if (result.success) {
                // User exists! Login successful ✓ - navigate to dashboard
                const userRole = result.data?.role || 'mentee';
                navigate(`/${userRole}/dashboard`, { replace: true });
            } else if ((result as any).needsRegistration) {
                // User doesn't exist → Registration needed
                // Redirect to signup page to complete profile
                navigate('/signup', {
                    replace: true,
                    state: {
                        fromSocialAuth: true,
                        message: 'Please complete your profile to finish registration.'
                    }
                });
            } else {
                setError(result.message || 'Login failed. Please try again.');
                setProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] flex items-center justify-center">
            <div className="bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4 shadow-lg shadow-purple-500/20">
                {processing ? (
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="text-xl text-white font-medium mb-2">Completing login...</h2>
                        <p className="text-white/70 text-sm">Please wait while we verify your credentials.</p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-medium mb-2">Login Failed</h2>
                        <p className="text-red-400 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SocialCallback;
