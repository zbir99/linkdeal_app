import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMenteeSignup } from "@/apps/mentee/context/MenteeSignupContext";
import { authService } from "@/services/auth";

const frequencyOptions = [
    { id: 0, title: "Once a week", value: "once_week", description: "Regular weekly sessions" },
    { id: 1, title: "Every two weeks", value: "every_two_weeks", description: "Bi-weekly sessions" },
    { id: 2, title: "Once a month", value: "once_month", description: "Monthly check-ins" },
    { id: 3, title: "Flexible", value: "flexible", description: "Schedule as needed" }
];

export const MenteeStepThree = (): JSX.Element => {
    const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { signupData, updateSignupData, resetSignupData } = useMenteeSignup();

    // Account linking modal state
    const [showLinkingModal, setShowLinkingModal] = useState(false);
    const [linkingMessage, setLinkingMessage] = useState("");
    const [linkingSuccess, setLinkingSuccess] = useState(false);
    const [pendingRegistrationData, setPendingRegistrationData] = useState<Record<string, any> | null>(null);

    // Check if user is coming from social auth
    const isSocialAuth = sessionStorage.getItem('social_auth_pending') === 'true';

    // Pre-fill frequency from context when navigating back
    useEffect(() => {
        if (signupData.session_frequency) {
            const index = frequencyOptions.findIndex(opt => opt.value === signupData.session_frequency);
            if (index !== -1) setSelectedFrequency(index);
        }
    }, []);

    // NOTE: beforeunload handler was removed - see MenteeStepOne for details

    const handleGetStarted = async () => {
        // Session frequency is optional - save it if selected
        const frequencyValue = selectedFrequency !== null
            ? frequencyOptions[selectedFrequency].value
            : 'flexible';  // Default to flexible if not selected
        updateSignupData({ session_frequency: frequencyValue });

        setIsLoading(true);
        setError("");

        try {
            // Build registration data
            const registerData: Record<string, any> = {
                email: signupData.email,
                full_name: signupData.full_name,
                field_of_study: signupData.field_of_study || '',
                country: signupData.country,
                language: signupData.language || '',
                interests: signupData.interests || [],
                user_type: signupData.selected_role || 'other',  // Default to 'other' if not selected
                session_frequency: frequencyValue
            };

            // Add password only for non-social auth
            if (!isSocialAuth) {
                registerData.password = signupData.password;
                registerData.password_confirm = signupData.password;
            }

            // Store for potential linking flow
            setPendingRegistrationData(registerData);

            if (isSocialAuth) {
                // Social auth flow - use socialRegister endpoint
                console.log("Social auth - calling socialRegister with data:", registerData);
                const response = await authService.socialRegister('mentee', registerData);

                if (response.success) {
                    // Clear social auth session data
                    sessionStorage.removeItem('social_auth_pending');
                    sessionStorage.removeItem('social_auth_email');
                    sessionStorage.removeItem('social_auth_name');
                    sessionStorage.removeItem('social_auth_picture');
                    sessionStorage.removeItem('social_auth_provider');
                    resetSignupData();
                    navigate('/mentee/dashboard', { replace: true });
                } else if ((response as any).requiresLinking) {
                    // Email exists - show account linking modal
                    setShowLinkingModal(true);
                    setLinkingMessage(response.message || 'An account with this email already exists.');
                } else {
                    setError(response.message || 'Registration failed. Please try again.');
                }
            } else {
                // Regular (non-social) registration flow
                if (signupData.profile_picture) {
                    const formData = new FormData();
                    Object.keys(registerData).forEach(key => {
                        const value = registerData[key];
                        if (Array.isArray(value)) {
                            value.forEach(item => formData.append(key, item));
                        } else if (value !== null && value !== undefined) {
                            formData.append(key, value);
                        }
                    });
                    formData.append('profile_picture', signupData.profile_picture);

                    console.log("Creating account with FormData (includes profile picture)");
                    const response = await authService.registerWithFormData(formData);

                    if (response.success) {
                        resetSignupData();
                        navigate('/verify-email');
                    } else {
                        setError(response.message || 'Registration failed. Please try again.');
                    }
                } else {
                    console.log("Creating account with data:", registerData);
                    const response = await authService.register(registerData);

                    if (response.success) {
                        resetSignupData();
                        navigate('/verify-email');
                    } else {
                        setError(response.message || 'Registration failed. Please try again.');
                    }
                }
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle account linking consent
    const handleLinkingConsent = async () => {
        if (!pendingRegistrationData) return;

        setIsLoading(true);
        try {
            const response = await authService.requestAccountLinking(
                signupData.email,
                'mentee',
                pendingRegistrationData
            );

            if (response.success) {
                setLinkingSuccess(true);
                setLinkingMessage(response.message || 'Verification email sent! Please check your inbox.');
            } else {
                setError(response.message || 'Failed to request account linking.');
                setShowLinkingModal(false);
            }
        } catch (err: any) {
            console.error("Linking request error:", err);
            setError(err.message || 'Failed to request account linking.');
            setShowLinkingModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseLinkingModal = () => {
        setShowLinkingModal(false);
        if (linkingSuccess) {
            // Clear session and redirect
            sessionStorage.removeItem('social_auth_pending');
            sessionStorage.removeItem('social_auth_email');
            navigate('/login');
        }
    };

    return (
        <>
            {/* Account Linking Modal */}
            {showLinkingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 p-6 max-w-md w-full mx-4 shadow-2xl">
                        {!linkingSuccess ? (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl text-white font-semibold mb-2">Account Already Exists</h2>
                                    <p className="text-white/70 text-sm">{linkingMessage}</p>
                                </div>
                                <p className="text-white/60 text-sm text-center mb-6">
                                    Would you like to link your Google/LinkedIn account to your existing account?
                                    We'll send a verification email to confirm.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCloseLinkingModal}
                                        className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLinkingConsent}
                                        className="flex-1 py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Yes, Link Accounts'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl text-white font-semibold mb-2">Check Your Email!</h2>
                                <p className="text-green-400 text-sm mb-4">{linkingMessage}</p>
                                <p className="text-white/60 text-xs mb-6">
                                    Click the link in the email to complete account linking.
                                    The link expires in 15 minutes.
                                </p>
                                <button
                                    onClick={handleCloseLinkingModal}
                                    className="w-full py-3 px-4 bg-[#7008e7] text-white rounded-xl hover:bg-[#6007c5] transition-colors"
                                >
                                    Got it
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>
                <div className="relative z-10 hidden md:flex flex-col items-center justify-center w-full max-w-[800px] px-8 min-h-screen mx-auto">
                    <div className="flex flex-col h-auto min-h-[569.2px] items-center gap-8 pt-[32.8px] pb-[32.8px] px-[32.8px] relative self-stretch w-full bg-[#ffffff0d] backdrop-blur-xl rounded-[18px] border-[0.8px] border-solid border-[#fffefe1a] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]">
                        <div className="flex h-10 items-center justify-center gap-2 py-0 relative self-stretch w-full">
                            <div className="flex h-10 items-center gap-2 py-0 relative flex-1 max-w-[200px]">
                                <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                                    <div className="relative w-[7.44px] h-6">
                                        <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                            1
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex-1 grow h-1 bg-[#7008e7]" />
                            </div>

                            <div className="flex h-10 items-center gap-2 py-0 relative flex-1 max-w-[200px]">
                                <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                                    <div className="relative w-[9.69px] h-6">
                                        <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                            2
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex-1 grow h-1 bg-[#7008e7]" />
                            </div>

                            <div className="flex w-10 h-10 items-center justify-center pl-0 pr-[0.01px] py-0 relative bg-[#7008e7] rounded-[26843500px]">
                                <div className="relative w-[10.19px] h-6">
                                    <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                                        3
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8 w-full">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-[279px] h-[42px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[42px] whitespace-nowrap text-center">
                                    When are you available?
                                </div>

                                <p className="w-[294px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-base tracking-[0] leading-6 whitespace-nowrap text-center">
                                    Choose your preferred session frequency
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-4 w-full max-w-[606px]">
                                <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${selectedFrequency === 0
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    }`}
                                    onClick={() => setSelectedFrequency(0)}>
                                    <div className={`w-[98px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${selectedFrequency === 0 ? 'text-[#A684FF]' : 'text-white'
                                        }`}>
                                        Once a week
                                    </div>
                                    <div className="w-[155px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Regular weekly sessions
                                    </div>
                                </div>

                                <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${selectedFrequency === 1
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    }`}
                                    onClick={() => setSelectedFrequency(1)}>
                                    <div className={`w-[129px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${selectedFrequency === 1 ? 'text-[#A684FF]' : 'text-white'
                                        }`}>
                                        Every two weeks
                                    </div>
                                    <div className="w-[119px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Bi-weekly sessions
                                    </div>
                                </div>

                                <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${selectedFrequency === 2
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    }`}
                                    onClick={() => setSelectedFrequency(2)}>
                                    <div className={`w-[107px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${selectedFrequency === 2 ? 'text-[#A684FF]' : 'text-white'
                                        }`}>
                                        Once a month
                                    </div>
                                    <div className="w-[113px] h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Monthly check-ins
                                    </div>
                                </div>

                                <div className={`w-full h-[82.6px] flex flex-col gap-1 rounded-xl border-[0.8px] border-solid p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 ${selectedFrequency === 3
                                    ? 'bg-[#7008e733] border-[#8d51ff] hover:bg-[#7008e766] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    : 'bg-[#ffffff0d] border-[#fffefe1a] hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25'
                                    }`}
                                    onClick={() => setSelectedFrequency(3)}>
                                    <div className={`w-[58px] h-6 [font-family:'Inter-Regular',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap ${selectedFrequency === 3 ? 'text-[#A684FF]' : 'text-white'
                                        }`}>
                                        Flexible
                                    </div>
                                    <div className="w-32 h-[21px] [font-family:'Arimo-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Schedule as needed
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full h-12 items-start gap-4 mt-8 max-w-[606px]">
                                <button
                                    className="box-border bg-[#0a0a1a] border-[0.8px] border-solid border-[#fffefe1a] flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffffff1a] hover:border-[#a683ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105"
                                    onClick={() => navigate('/mentee/step2')}
                                >
                                    <div className="w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                        Back
                                    </div>
                                </button>

                                <button
                                    className={`border-none outline-none flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed ${isPressed
                                        ? 'bg-[#5005a3] scale-95 shadow-lg shadow-purple-500/20'
                                        : isHovered
                                            ? 'bg-[#6007c5] scale-105 shadow-xl shadow-purple-500/30'
                                            : 'bg-[#7008e7] shadow-lg shadow-purple-500/25'
                                        }`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onMouseDown={() => setIsPressed(true)}
                                    onMouseUp={() => setIsPressed(false)}
                                    onClick={handleGetStarted}
                                    disabled={isLoading}
                                >
                                    <div className={`w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                                        }`}>
                                        {isLoading ? 'Creating account...' : 'Get Started'}
                                    </div>
                                    {!isLoading && (
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="relative z-10 md:hidden px-5 py-10 space-y-6 text-white">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/80">Step 3 of 3</span>
                            <span className="text-white/60">100% Complete</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7008e7]" />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold">When are you available?</h2>
                            <p className="text-white/60 text-sm">Choose your preferred session frequency</p>
                        </div>

                        <div className="space-y-3">
                            {frequencyOptions.map((option) => {
                                const selected = selectedFrequency === option.id;
                                return (
                                    <button
                                        key={`mobile-frequency-${option.id}`}
                                        className={`w-full text-left px-4 py-3 rounded-xl border ${selected
                                            ? "bg-[#7008e733] border-[#8d51ff] text-[#A684FF]"
                                            : "bg-white/5 border-white/15 text-white/80"
                                            }`}
                                        onClick={() => setSelectedFrequency(option.id)}
                                    >
                                        <div className="text-base font-medium">{option.title}</div>
                                        <p className="text-xs text-white/70 mt-1">{option.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="flex-1 py-3 bg-white text-[#2a1a3e] rounded-xl border border-white/20 text-sm font-medium"
                                onClick={() => navigate("/mentee/step2")}
                            >
                                Back
                            </button>
                            <button
                                className="flex-1 py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleGetStarted}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Get Started'}
                            </button>
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenteeStepThree;
