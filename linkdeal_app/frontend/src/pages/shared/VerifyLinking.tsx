import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

export const VerifyLinking = (): JSX.Element => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('');
    const processedRef = useRef(false); // Prevent double-processing (React StrictMode, HMR)

    useEffect(() => {
        const verifyToken = async () => {
            // Prevent double-processing
            if (processedRef.current) {
                return;
            }
            processedRef.current = true;

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Token is missing.');
                return;
            }

            try {
                const result = await authService.verifyLinking(token);

                if (result.success) {
                    setStatus('success');
                    setMessage(result.message || 'Account linking completed successfully!');

                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login?linked=true', { replace: true });
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Verification failed. Please try again.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Verification failed. Please try again.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] flex items-center justify-center">
            <div className="bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4 shadow-lg shadow-purple-500/20">
                {status === 'processing' && (
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="text-xl text-white font-medium mb-2">Verifying Account Link</h2>
                        <p className="text-white/70 text-sm">Please wait while we verify your request...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-medium mb-2">Account Linked!</h2>
                        <p className="text-green-400 text-sm mb-4">{message}</p>
                        <p className="text-white/60 text-xs">Redirecting to login page...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-medium mb-2">Verification Failed</h2>
                        <p className="text-red-400 text-sm mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full h-12 bg-[#7008e7] rounded-xl text-white font-medium hover:bg-[#6007c5] transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyLinking;
