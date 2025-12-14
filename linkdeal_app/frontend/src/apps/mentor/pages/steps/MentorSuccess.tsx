<<<<<<< HEAD
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Succes = (): JSX.Element => {
    const navigate = useNavigate();

    // Clear session data on mount and handle back navigation
    useEffect(() => {
        // Clear all session and local storage data related to registration
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

        // Handle back navigation - replace history to prevent going back
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            // When user tries to go back, redirect to login
            navigate('/login', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>

=======
export const Succes = (): JSX.Element => {
    return (
        <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>
            
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(233,212,255,0.2)_0%,rgba(190,219,255,0.2)_100%)]" />
                <div className="absolute top-[40%] right-[10%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />
                <div className="absolute bottom-[20%] left-[30%] w-[383.99px] h-[383.99px] rounded-[32014000px] blur-3xl bg-[linear-gradient(117deg,rgba(128,51,208,0.4)_0%,rgba(10,32,59,0.4)_100%)]" />
            </div>

            {/* Desktop content */}
            <div className="relative z-10 hidden md:flex items-center justify-center w-full min-h-screen">
<<<<<<< HEAD
                <div className="w-[600px] h-[450px] bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] flex flex-col items-center justify-center gap-8 -mt-4">
                    <div className="flex w-20 h-20 items-center justify-center bg-[#00c95033] rounded-[26843500px]">
                        <div className="relative w-10 h-10">
                            <svg className="absolute w-full h-full" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.6663 8L11.9997 22.6667L5.33301 16" stroke="#00C950" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
=======
                <div className="w-[600px] h-[400px] bg-[#ffffff0d] backdrop-blur-xl rounded-2xl border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] flex flex-col items-center justify-center gap-8 -mt-4">
                    <div className="flex w-20 h-20 items-center justify-center bg-[#00c95033] rounded-[26843500px]">
                        <div className="relative w-10 h-10">
                            <svg className="absolute w-full h-full" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.6663 8L11.9997 22.6667L5.33301 16" stroke="#00C950" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-[32px] text-center tracking-[0] leading-[42px] whitespace-nowrap">
                            Request sent
                        </div>
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-lg text-center tracking-[0] leading-[21px]">
                            Please wait for confirmation
                        </div>
                    </div>
<<<<<<< HEAD

                    <button
                        onClick={handleLoginClick}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-[#7008e7] text-white rounded-lg hover:bg-[#5f07d4] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
                    >
                        <span className="text-sm font-medium">Go to Login</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
=======
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
                </div>
            </div>

            {/* Mobile content */}
            <div className="relative z-10 md:hidden min-h-screen flex items-center justify-center px-6 py-16 text-white">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 w-full max-w-sm">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#00c95033]">
                        <svg className="w-8 h-8 text-[#00C950]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold">Request sent</h2>
                    <p className="text-white/70 text-sm">Please wait for confirmation</p>
<<<<<<< HEAD

                    <button
                        onClick={handleLoginClick}
                        className="w-full py-3 mt-4 bg-[#7008e7] text-white rounded-xl text-sm font-medium hover:bg-[#5f07d4] transition-colors"
                    >
                        Go to Login
                    </button>
=======
>>>>>>> de4e691e5d0f1d98f54b2aa5297cb850826e7810
                </div>
            </div>
        </div>
    );
};
