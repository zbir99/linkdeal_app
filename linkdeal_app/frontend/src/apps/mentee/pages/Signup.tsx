import linkDealLogo from "@/assets/landing_page/images/logo (2).png";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenteeSignup } from "@/apps/mentee/context/MenteeSignupContext";

const RegisteringBadge = () => (
    <div className="w-full max-w-[380px] h-[70px] relative rounded-2xl bg-gradient-to-r from-[#7008E725] via-[#8E51FF20] to-[#7008E725] border-[#8E51FF80] border-solid border-[1px] box-border flex items-center px-6 text-left text-base text-white font-arimo transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-[#7008E740] hover:via-[#8E51FF35] hover:to-[#7008E740] hover:border-[#A684FF] hover:shadow-2xl hover:shadow-[#7008e7]/40 hover:scale-[1.03] hover:translate-y-[-3px] cursor-pointer group backdrop-blur-sm">
        <div className="w-full flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7008E730] to-[#A684FF30] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-purple-500/50">
                <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-500 group-hover:stroke-[#E0D0FF]">
                    <path d="M14.6673 28.0006C22.0311 28.0006 28.0006 22.0311 28.0006 14.6673C28.0006 7.30351 22.0311 1.33398 14.6673 1.33398C7.30351 1.33398 1.33398 7.30351 1.33398 14.6673C1.33398 22.0311 7.30351 28.0006 14.6673 28.0006Z" stroke="#C8B0FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.668 16C16.8771 16 18.668 14.2092 18.668 12C18.668 9.79087 16.8771 8 14.668 8C12.4589 8 10.668 9.79087 10.668 12C10.668 14.2092 12.4589 16 14.668 16Z" stroke="#C8B0FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 26.2166V24.0006C8 23.2934 8.28095 22.6151 8.78107 22.115C9.28117 21.6149 9.95947 21.334 10.6667 21.334H18.6667C19.3739 21.334 20.0522 21.6149 20.5523 22.115C21.0524 22.6151 21.3334 23.2934 21.3334 24.0006V26.2166" stroke="#C8B0FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="flex flex-col transition-all duration-500 group-hover:translate-x-2">
                <div className="flex flex-col">
                    <span className="text-lg font-bold capitalize tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-100 group-hover:to-white transition-all duration-500">Registering as Mentee</span>
                </div>
            </div>
        </div>
    </div>
);

export const Signup = () => {
    const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
    const [selectedField, setSelectedField] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fieldDropdownRef = useRef<HTMLDivElement>(null);
    const fieldDropdownMobileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { signupData, updateSignupData } = useMenteeSignup();

    // Pre-fill form fields from context or social auth when navigating back
    useEffect(() => {
        // First check for social auth data in session storage
        const socialAuthPending = sessionStorage.getItem('social_auth_pending');
        const socialAuthEmail = sessionStorage.getItem('social_auth_email');
        const socialAuthName = sessionStorage.getItem('social_auth_name');
        const socialAuthPicture = sessionStorage.getItem('social_auth_picture');
        const socialAuthCountry = sessionStorage.getItem('social_auth_country');
        const socialAuthLanguage = sessionStorage.getItem('social_auth_language');

        if (socialAuthPending === 'true') {
            // Pre-fill from social auth data
            setFormData(prev => ({
                ...prev,
                email: socialAuthEmail || prev.email,
                full_name: socialAuthName || prev.full_name,
                // Password fields left empty - social auth users need to set a password
            }));

            // Update context with social auth data (for later steps)
            updateSignupData({
                email: socialAuthEmail || '',
                full_name: socialAuthName || '',
                profile_picture_preview: socialAuthPicture || '',  // For Step 1 profile picture
                country: socialAuthCountry || '',                   // LinkedIn provides country
                language: socialAuthLanguage || ''                  // LinkedIn provides language
            });
        }
        // Then check context for returning from later steps
        else if (signupData.full_name || signupData.email || signupData.password || signupData.field_of_study) {
            setFormData({
                full_name: signupData.full_name || '',
                email: signupData.email || '',
                password: signupData.password || '',
                confirm_password: signupData.password || ''
            });
            if (signupData.field_of_study) {
                setSelectedField(signupData.field_of_study);
            }
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            const isInsideFieldDropdown =
                (fieldDropdownRef.current && fieldDropdownRef.current.contains(target)) ||
                (fieldDropdownMobileRef.current && fieldDropdownMobileRef.current.contains(target));

            if (!isInsideFieldDropdown) {
                setFieldDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle field dropdown click
    const handleFieldDropdownClick = () => {
        setFieldDropdownOpen(!fieldDropdownOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long and contain uppercase letter, lowercase letter, number, and special character');
            return false;
        }
        if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setError('Password must be at least 8 characters long and contain uppercase letter, lowercase letter, number, and special character');
            return false;
        }
        if (!selectedField) {
            setError('Please select your field/specialty');
            return false;
        }
        return true;
    };

    const handleSignupClick = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Store data in context instead of creating account
            updateSignupData({
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                field_of_study: selectedField
            });

            // Navigate to next step (account will be created at final step)
            navigate('/mentee/step1');
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)] w-full min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-purple-700/25 via-pink-600/15 to-transparent blur-[130px] animate-pulse-slower" />
                <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/15 to-transparent blur-[100px] animate-float" />
            </div>

            <div className="hidden md:flex items-center justify-center min-h-screen py-12 px-4 relative z-10">
                <div className="relative w-full max-w-[850px] bg-[#ffffff08] backdrop-blur-xl rounded-[24px] border border-solid border-[#fffefe25] shadow-[0px_8px_32px_rgba(0,0,0,0.4),0px_4px_12px_rgba(112,8,231,0.2)] p-10 before:absolute before:inset-0 before:rounded-[24px] before:p-[1px] before:bg-gradient-to-br before:from-purple-500/30 before:via-transparent before:to-blue-500/20 before:-z-10">
                    <div className="absolute top-10 left-10 z-20">
                        <button
                            onClick={() => navigate('/signup')}
                            className="flex items-center gap-2.5 text-sm text-[#A684FF] font-arimo hover:text-[#E0D0FF] transition-all duration-300 cursor-pointer hover:translate-x-[-4px] group bg-[#ffffff08] px-4 py-2.5 rounded-xl border border-[#8E51FF40] hover:border-[#A684FF] hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-[-2px]">
                                <path d="M8.00065 12.6673L3.33398 8.00065L8.00065 3.33398" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.6673 8H3.33398" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">Back to role selection</span>
                        </button>
                    </div>
                    <div className="flex w-full h-28 items-center justify-center gap-2 relative mb-10 animate-fade-in-up">
                        <img
                            src={linkDealLogo}
                            alt="LinkDeal Logo"
                            className="h-28 w-auto animate-pulse-slow"
                            style={{
                                filter: 'drop-shadow(0 0 25px rgba(109, 40, 217, 0.9)) drop-shadow(0 0 50px rgba(110, 17, 176, 0.7)) drop-shadow(0 0 80px rgba(142, 81, 255, 0.4))'
                            }}
                        />
                        <div className="font-poppins font-bold text-white text-[40px] tracking-tight leading-[48px] whitespace-nowrap animate-fade-in-up-delay bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                            LinkDeal
                        </div>
                    </div>
                    <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes pulseSlow {
                        0%, 100% {
                            transform: scale(1);
                            filter: brightness(1);
                        }
                        50% {
                            transform: scale(1.05);
                            filter: brightness(1.1);
                        }
                    }
                    
                    @keyframes pulseSlower {
                        0%, 100% {
                            opacity: 0.3;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 0.5;
                            transform: scale(1.1);
                        }
                    }
                    
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px) translateX(0px);
                        }
                        33% {
                            transform: translateY(-20px) translateX(10px);
                        }
                        66% {
                            transform: translateY(10px) translateX(-10px);
                        }
                    }
                    
                    @keyframes blob {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                        }
                        33% {
                            transform: translate(30px, -30px) scale(1.1);
                        }
                        66% {
                            transform: translate(-20px, 20px) scale(0.9);
                        }
                    }
                    
                    @keyframes blobReverse {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                        }
                        33% {
                            transform: translate(-30px, 30px) scale(1.1);
                        }
                        66% {
                            transform: translate(20px, -20px) scale(0.9);
                        }
                    }
                    
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    
                    .animate-fade-in-up-delay {
                        animation: fadeInUp 0.8s ease-out 0.2s forwards;
                        opacity: 0;
                    }
                    
                    .animate-pulse-slow {
                        animation: pulseSlow 3s ease-in-out infinite;
                    }
                    
                    .animate-pulse-slower {
                        animation: pulseSlower 8s ease-in-out infinite;
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-blob {
                        animation: blob 7s ease-in-out infinite;
                    }
                    
                    .animate-blob-reverse {
                        animation: blobReverse 9s ease-in-out infinite;
                    }
                    
                    /* Custom scrollbar for dropdowns */
                    .dropdown-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    .dropdown-scrollbar::-webkit-scrollbar-track {
                        background: rgba(139, 92, 246, 0.15);
                        border-radius: 4px;
                    }
                    
                    .dropdown-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, rgba(139, 92, 246, 0.7), rgba(168, 132, 255, 0.7));
                        border-radius: 4px;
                    }
                    
                    .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, rgba(139, 92, 246, 0.9), rgba(168, 132, 255, 0.9));
                    }
                    
                    .dropdown-scrollbar::-webkit-scrollbar-corner {
                        background: rgba(139, 92, 246, 0.1);
                    }
                `}</style>
                    <div className="text-white font-inter font-bold text-[32px] leading-[40px] tracking-tight text-center mb-3 bg-gradient-to-r from-white via-purple-50 to-white bg-clip-text text-transparent">
                        Create Your Account
                    </div>
                    <div className="w-full flex justify-center mb-10">
                        <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#B0B8C8] text-base text-center tracking-[0] leading-[24px]">
                            Join our community of mentors and learners as a <span className="text-[#C8B0FF] font-semibold">mentee</span>
                        </p>
                    </div>
                    <div className="flex w-full justify-center mb-10">
                        <RegisteringBadge />
                    </div>

                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col w-full items-start gap-2.5 mb-6">
                        <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#E5E9F0] text-sm tracking-[0] leading-[21px]">
                            Full Name
                        </label>
                        <input
                            className="h-14 px-4 py-3 relative self-stretch w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl overflow-hidden border border-solid border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] outline-none hover:bg-[#ffffff15] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 placeholder:text-[#8891A1] focus:text-white focus:bg-[#ffffff15] focus:border-purple-400 focus:shadow-xl focus:shadow-purple-500/20 focus:scale-[1.01]"
                            placeholder="Jean Dupont"
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col w-full items-start gap-2.5 mb-6">
                        <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#E5E9F0] text-sm tracking-[0] leading-[21px]">
                            Email
                        </label>
                        <input
                            className="h-14 px-4 py-3 relative self-stretch w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl overflow-hidden border border-solid border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] outline-none hover:bg-[#ffffff15] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 placeholder:text-[#8891A1] focus:text-white focus:bg-[#ffffff15] focus:border-purple-400 focus:shadow-xl focus:shadow-purple-500/20 focus:scale-[1.01]"
                            placeholder="votre@email.com"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col w-full items-start gap-2.5 mb-6">
                        <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#E5E9F0] text-sm tracking-[0] leading-[21px]">
                            Password
                        </label>
                        <div className="relative w-full">
                            <input
                                className="h-14 px-4 py-3 relative self-stretch w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl overflow-hidden border border-solid border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] outline-none hover:bg-[#ffffff15] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 placeholder:text-[#8891A1] focus:text-white focus:bg-[#ffffff15] focus:border-purple-400 focus:shadow-xl focus:shadow-purple-500/20 focus:scale-[1.01] pr-12"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C8B0FF] hover:text-white transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full items-start gap-2.5 mb-6">
                        <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#E5E9F0] text-sm tracking-[0] leading-[21px]">
                            Confirm Password
                        </label>
                        <div className="relative w-full">
                            <input
                                className="h-14 px-4 py-3 relative self-stretch w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl overflow-hidden border border-solid border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] outline-none hover:bg-[#ffffff15] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 placeholder:text-[#8891A1] focus:text-white focus:bg-[#ffffff15] focus:border-purple-400 focus:shadow-xl focus:shadow-purple-500/20 focus:scale-[1.01] pr-12"
                                placeholder="••••••••"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C8B0FF] hover:text-white transition-colors duration-200"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full items-start gap-2.5 mb-6">
                        <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#E5E9F0] text-sm tracking-[0] leading-[21px]">
                            Field / Specialty
                        </label>
                        <div className="relative w-full" ref={fieldDropdownRef}>
                            <div
                                className="flex h-14 items-center justify-between px-4 py-3 relative self-stretch w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-solid border-[#fffefe20] cursor-pointer hover:bg-[#ffffff15] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group focus-within:border-purple-400 focus-within:shadow-xl focus-within:shadow-purple-500/20 focus-within:scale-[1.01]"
                                onClick={handleFieldDropdownClick}
                            >
                                <div className="flex items-center gap-2 relative">
                                    <div className={`w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-base transition-colors duration-300 ${selectedField ? 'text-white' : 'text-[#8891A1] group-hover:text-[#B0B8C8]'}`}>
                                        {selectedField || 'Select your field'}
                                    </div>
                                </div>
                                <div className="relative w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${fieldDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {fieldDropdownOpen && (
                                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-solid border-[#fffefe30] shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto overflow-x-hidden">
                                    <div className="py-2">
                                        {['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'Game Development', 'Digital Marketing', 'Business', 'Finance', 'Other'].map((field) => (
                                            <div
                                                key={field}
                                                className="px-4 py-3 text-base text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                                                onClick={() => {
                                                    setSelectedField(field);
                                                    setFieldDropdownOpen(false);
                                                }}
                                            >
                                                {field}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="border-none outline-none w-full h-14 flex bg-gradient-to-r from-[#7008e7] via-[#8E51FF] to-[#7008e7] bg-[length:200%_100%] rounded-xl items-center justify-center cursor-pointer mb-8 hover:bg-[position:100%_0] hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] transition-all duration-500 ease-out group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSignupClick}
                        disabled={isLoading}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <div className="[font-family:'Almarai-Regular',Helvetica] font-semibold text-white text-base text-center tracking-wide leading-5 whitespace-nowrap transition-transform duration-300 group-hover:scale-105 relative z-10">
                            {isLoading ? 'Loading...' : 'Continue'}
                        </div>
                    </button>

                    <div className="w-full flex justify-center gap-2 items-center">
                        <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#B0B8C8] text-base text-center tracking-[0] leading-[24px]">
                            Do you already have an account?
                        </p>
                        <Link to="/login" className="border-none bg-transparent outline-none flex cursor-pointer group relative">
                            <div className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-[#C8B0FF] text-base text-center tracking-[0] leading-[24px] whitespace-nowrap transition-all duration-300 group-hover:text-[#E0D0FF] group-hover:scale-105">
                                Log in
                            </div>
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#C8B0FF] to-[#E0D0FF] group-hover:w-full transition-all duration-300" />
                        </Link>
                    </div>

                    {/* Decorative gradient blobs */}
                    <div className="absolute top-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full blur-[100px] bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-transparent pointer-events-none animate-blob" />
                    <div className="absolute bottom-[-80px] left-[-80px] w-[450px] h-[450px] rounded-full blur-[110px] bg-gradient-to-tr from-purple-700/40 via-pink-500/25 to-transparent pointer-events-none animate-blob-reverse" />
                </div >
            </div>

            {/* Mobile layout */}
            <div className="md:hidden relative px-5 py-10 text-white space-y-8">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-blue-900/30 pointer-events-none" />
                <div className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-purple-600/20 to-transparent blur-[80px] pointer-events-none animate-pulse-slower" />
                <div className="absolute bottom-[10%] left-[-20%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-purple-700/25 to-transparent blur-[90px] pointer-events-none animate-pulse-slower" />

                <div className="relative z-10 space-y-8">
                    <div className="absolute top-4 left-4 z-20">
                        <button
                            onClick={() => navigate('/signup')}
                            className="flex items-center gap-2 text-xs text-[#A684FF] font-arimo hover:text-[#B899FF] transition-colors duration-300 cursor-pointer bg-[#ffffff08] px-3 py-2 rounded-lg border border-[#8E51FF40] backdrop-blur-sm"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.00065 12.6673L3.33398 8.00065L8.00065 3.33398" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.6673 8H3.33398" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </button>
                    </div>
                    <div className="flex flex-col items-center text-center gap-4">
                        <img
                            src={linkDealLogo}
                            alt="LinkDeal Logo"
                            className="h-24 w-auto animate-pulse-slow"
                            style={{
                                filter: 'drop-shadow(0 0 25px rgba(109, 40, 217, 0.9)) drop-shadow(0 0 50px rgba(110, 17, 176, 0.7))'
                            }}
                        />
                        <div className="font-poppins font-bold text-white text-3xl bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">LinkDeal</div>
                        <p className="[font-family:'Arimo-Regular',Helvetica] text-[#B0B8C8] text-base max-w-xs">
                            Join our community of mentors and learners
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <RegisteringBadge />
                    </div>

                    <div className="bg-[#ffffff08] backdrop-blur-xl border border-[#fffefe25] rounded-2xl p-6 space-y-5 shadow-2xl shadow-purple-500/10 relative z-20">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2.5">
                            <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-sm text-[#E5E9F0]">Full Name</label>
                            <input
                                className="h-14 px-4 py-3 w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] text-base text-white placeholder:text-[#8891A1] focus:outline-none focus:border-purple-400 focus:bg-[#ffffff15] focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                                placeholder="Jean Dupont"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-sm text-[#E5E9F0]">Email</label>
                            <input
                                className="h-14 px-4 py-3 w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] text-base text-white placeholder:text-[#8891A1] focus:outline-none focus:border-purple-400 focus:bg-[#ffffff15] focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                                placeholder="votre@email.com"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-sm text-[#E5E9F0]">Password</label>
                            <div className="relative">
                                <input
                                    className="h-14 px-4 py-3 w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] text-base text-white placeholder:text-[#8891A1] focus:outline-none focus:border-purple-400 focus:bg-[#ffffff15] focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 pr-12"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C8B0FF] hover:text-white transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-sm text-[#E5E9F0]">Confirm Password</label>
                            <div className="relative">
                                <input
                                    className="h-14 px-4 py-3 w-full bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-[#fffefe20] [font-family:'Arimo-Regular',Helvetica] text-base text-white placeholder:text-[#8891A1] focus:outline-none focus:border-purple-400 focus:bg-[#ffffff15] focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 pr-12"
                                    placeholder="••••••••"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C8B0FF] hover:text-white transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2.5 relative" ref={fieldDropdownMobileRef}>
                            <label className="[font-family:'Arimo-Regular',Helvetica] font-semibold text-sm text-[#E5E9F0]">Field / Specialty</label>
                            <div
                                className="flex h-14 items-center justify-between px-4 py-3 bg-[#ffffff0a] backdrop-blur-sm rounded-xl border border-[#fffefe20] cursor-pointer hover:bg-[#ffffff15] hover:border-purple-400/60 transition-all duration-300 group"
                                onClick={handleFieldDropdownClick}
                            >
                                <div className={`[font-family:'Arimo-Regular',Helvetica] text-base transition-colors duration-300 ${selectedField ? 'text-white' : 'text-[#8891A1] group-hover:text-[#B0B8C8]'}`}>
                                    {selectedField || 'Select your field'}
                                </div>
                                <svg className={`w-5 h-5 transition-transform duration-300 ${fieldDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {fieldDropdownOpen && (
                                <div className="dropdown-scrollbar absolute left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-[#fffefe30] shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto overflow-x-hidden">
                                    <div className="py-2">
                                        {['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'Game Development', 'Digital Marketing', 'Business', 'Finance', 'Other'].map((field) => (
                                            <div
                                                key={`mobile-${field}`}
                                                className="px-4 py-3 text-base text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white cursor-pointer transition-all duration-200"
                                                onClick={() => {
                                                    setSelectedField(field);
                                                    setFieldDropdownOpen(false);
                                                }}
                                            >
                                                {field}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="w-full h-14 bg-gradient-to-r from-[#7008e7] via-[#8E51FF] to-[#7008e7] bg-[length:200%_100%] rounded-xl text-white font-semibold hover:bg-[position:100%_0] hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 relative overflow-hidden group" onClick={handleSignupClick}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10">Continue</span>
                    </button>

                    <div className="text-center text-base text-[#B0B8C8]">
                        Do you already have an account?{" "}
                        <Link to="/login" className="text-[#C8B0FF] font-semibold hover:text-[#E0D0FF] underline-offset-4 hover:underline transition-colors duration-300">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
