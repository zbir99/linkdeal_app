import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMenteeSignup } from "@/apps/mentee/context/MenteeSignupContext";

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Japan', 'South Korea', 'China', 'India', 'Singapore', 'Brazil', 'Mexico', 'Argentina', 'Other'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'];
const roles = ['Student', 'Professional', 'Entrepreneur', 'Career Changer', 'Job Seeker', 'Researcher', 'Other'];
const fields = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'Game Development', 'Digital Marketing', 'Business', 'Finance', 'Other'];

// Map display names to backend-expected values
const roleToBackendValue: Record<string, string> = {
    'Student': 'student',
    'Professional': 'professional',
    'Entrepreneur': 'entrepreneur',
    'Career Changer': 'career_changer',
    'Job Seeker': 'job_seeker',
    'Researcher': 'researcher',
    'Other': 'other'
};

export const Information = (): JSX.Element => {
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);  // Store actual file
    const [imageError, setImageError] = useState<string>("");
    const [countryError, setCountryError] = useState<string>("");  // Country is required

    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const fieldDropdownRef = useRef<HTMLDivElement>(null);
    const countryDropdownMobileRef = useRef<HTMLDivElement>(null);
    const languageDropdownMobileRef = useRef<HTMLDivElement>(null);
    const fieldDropdownMobileRef = useRef<HTMLDivElement>(null);
    const roleDropdownMobileRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { signupData, updateSignupData } = useMenteeSignup();


    // Pre-fill form fields from social auth sessionStorage or context
    useEffect(() => {
        // Map country codes to full names (LinkedIn returns codes like 'US')
        const countryCodeMap: Record<string, string> = {
            'US': 'United States', 'UK': 'United Kingdom', 'GB': 'United Kingdom',
            'CA': 'Canada', 'AU': 'Australia', 'FR': 'France', 'DE': 'Germany',
            'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands', 'SE': 'Sweden',
            'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'CH': 'Switzerland',
            'AT': 'Austria', 'BE': 'Belgium', 'IE': 'Ireland', 'PT': 'Portugal',
            'GR': 'Greece', 'PL': 'Poland', 'JP': 'Japan', 'KR': 'South Korea',
            'CN': 'China', 'IN': 'India', 'SG': 'Singapore', 'BR': 'Brazil',
            'MX': 'Mexico', 'AR': 'Argentina'
        };

        // Map language codes to full names (LinkedIn returns codes like 'en')
        const languageCodeMap: Record<string, string> = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'nl': 'Dutch', 'sv': 'Swedish',
            'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'pl': 'Polish',
            'ru': 'Russian', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean',
            'ar': 'Arabic', 'hi': 'Hindi'
        };

        // Check for stale social auth data
        // This handles cases where user abandons registration and comes back later
        const SOCIAL_AUTH_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
        const socialAuthTimestamp = sessionStorage.getItem('social_auth_timestamp');
        const hasSocialAuthData = sessionStorage.getItem('social_auth_pending') === 'true' ||
            sessionStorage.getItem('social_auth_picture') !== null;

        let shouldClearStaleData = false;

        // Case 1: Has timestamp and it's older than 30 minutes
        if (socialAuthTimestamp) {
            const elapsed = Date.now() - parseInt(socialAuthTimestamp, 10);
            if (elapsed > SOCIAL_AUTH_TIMEOUT_MS) {
                console.log('MenteeStepOne - Clearing stale social auth data (older than 30 minutes)');
                shouldClearStaleData = true;
            }
        }
        // Case 2: Has social auth data but NO timestamp (legacy/orphaned session from before we added timestamps)
        else if (hasSocialAuthData) {
            console.log('MenteeStepOne - Clearing orphaned social auth data (no timestamp found - legacy session)');
            shouldClearStaleData = true;
        }

        if (shouldClearStaleData) {
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
            // Also clear the access token since it's associated with the stale session
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        // Check for social auth data in session storage (for users coming directly from social login)
        const isSocialAuth = sessionStorage.getItem('social_auth_pending') === 'true';
        const socialAuthPicture = sessionStorage.getItem('social_auth_picture');
        const socialAuthCountry = sessionStorage.getItem('social_auth_country');
        const socialAuthLanguage = sessionStorage.getItem('social_auth_language');
        const socialAuthName = sessionStorage.getItem('social_auth_name');
        const socialAuthEmail = sessionStorage.getItem('social_auth_email');

        // Debug logging
        console.log('MenteeStepOne - Social Auth Debug:', {
            isSocialAuth,
            socialAuthPicture,
            socialAuthCountry,
            socialAuthLanguage,
            socialAuthName,
            socialAuthEmail
        });

        // Pre-fill from social auth sessionStorage first (for direct social auth flow)
        if (isSocialAuth) {
            console.log('MenteeStepOne - Pre-filling from social auth...');
            // Pre-fill profile picture from social provider
            if (socialAuthPicture) {
                console.log('Setting profile image to:', socialAuthPicture);
                setProfileImage(socialAuthPicture);
            }

            // Pre-fill country from LinkedIn locale
            if (socialAuthCountry) {
                const mappedCountry = countryCodeMap[socialAuthCountry.toUpperCase()] || socialAuthCountry;
                if (countries.includes(mappedCountry)) {
                    setSelectedCountry(mappedCountry);
                }
            }

            // Pre-fill language from LinkedIn locale
            if (socialAuthLanguage) {
                const mappedLanguage = languageCodeMap[socialAuthLanguage.toLowerCase()] || socialAuthLanguage;
                if (languages.includes(mappedLanguage)) {
                    setSelectedLanguage(mappedLanguage);
                }
            }

            // Update signup context with social auth data for use in later steps
            updateSignupData({
                email: socialAuthEmail || '',
                full_name: socialAuthName || '',
                profile_picture_preview: socialAuthPicture || '',
                country: socialAuthCountry || '',
                language: socialAuthLanguage || ''
            });
        }

        // Also check context for any existing data (e.g., navigating back from later steps)
        if (signupData.country) {
            const mappedCountry = countryCodeMap[signupData.country.toUpperCase()] || signupData.country;
            if (countries.includes(mappedCountry)) {
                setSelectedCountry(mappedCountry);
            }
        }
        if (signupData.language) {
            const mappedLanguage = languageCodeMap[signupData.language.toLowerCase()] || signupData.language;
            if (languages.includes(mappedLanguage)) {
                setSelectedLanguage(mappedLanguage);
            }
        }
        if (signupData.selected_role) setSelectedRole(signupData.selected_role);
        // Only load profile picture preview from context if:
        // 1. User has uploaded a file themselves (signupData.profile_picture exists), OR
        // 2. It's a social auth flow (isSocialAuth is true)
        // This prevents stale social auth pictures from showing for normal signups
        if (signupData.profile_picture && signupData.profile_picture_preview && !profileImage) {
            setProfileImage(signupData.profile_picture_preview);
        }
        if (signupData.profile_picture) setProfileFile(signupData.profile_picture);
        if (signupData.field_of_study) setSelectedField(signupData.field_of_study);
    }, []);

    // NOTE: We previously had a beforeunload handler to clear incomplete social auth sessions,
    // but it was removed because it also triggers on page refresh, which is not desired behavior.
    // The 30-minute staleness check above is sufficient for cleaning up abandoned sessions.

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            const isCountryTarget =
                (countryDropdownRef.current && countryDropdownRef.current.contains(target)) ||
                (countryDropdownMobileRef.current && countryDropdownMobileRef.current.contains(target));

            const isLanguageTarget =
                (languageDropdownRef.current && languageDropdownRef.current.contains(target)) ||
                (languageDropdownMobileRef.current && languageDropdownMobileRef.current.contains(target));

            const isRoleTarget =
                (roleDropdownRef.current && roleDropdownRef.current.contains(target)) ||
                (roleDropdownMobileRef.current && roleDropdownMobileRef.current.contains(target));

            const isFieldTarget =
                (fieldDropdownRef.current && fieldDropdownRef.current.contains(target)) ||
                (fieldDropdownMobileRef.current && fieldDropdownMobileRef.current.contains(target));

            if (!isCountryTarget) {
                setCountryDropdownOpen(false);
            }
            if (!isLanguageTarget) {
                setLanguageDropdownOpen(false);
            }
            if (!isRoleTarget) {
                setRoleDropdownOpen(false);
            }
            if (!isFieldTarget) {
                setFieldDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle dropdown clicks - close other dropdowns
    const handleCountryDropdownClick = () => {
        setCountryDropdownOpen(!countryDropdownOpen);
        setLanguageDropdownOpen(false);
        setRoleDropdownOpen(false);
    };

    const handleLanguageDropdownClick = () => {
        setLanguageDropdownOpen(!languageDropdownOpen);
        setCountryDropdownOpen(false);
        setRoleDropdownOpen(false);
    };

    const handleRoleDropdownClick = () => {
        setRoleDropdownOpen(!roleDropdownOpen);
        setCountryDropdownOpen(false);
        setLanguageDropdownOpen(false);
        setFieldDropdownOpen(false);
    };

    const handleFieldDropdownClick = () => {
        setFieldDropdownOpen(!fieldDropdownOpen);
        setCountryDropdownOpen(false);
        setLanguageDropdownOpen(false);
        setRoleDropdownOpen(false);
    };

    // Image upload handlers
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setImageError('Please upload a JPG, PNG, or GIF file');
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            setImageError('File size must be less than 2MB');
            return;
        }

        // Clear any previous errors
        setImageError('');

        // Store the file for upload
        setProfileFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setProfileFile(null);
        setImageError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreviousClick = () => {
        navigate('/signup');
    };

    const handleNextStepClick = () => {
        // Validate required field: country
        if (!selectedCountry) {
            setCountryError("Please select your country");
            return;
        }
        setCountryError(""); // Clear error if valid

        // Save step1 data to context before navigating
        updateSignupData({
            profile_picture: profileFile,  // Save the actual file
            profile_picture_preview: profileImage || '',
            selected_role: roleToBackendValue[selectedRole] || selectedRole.toLowerCase().replace(/ /g, '_'),
            language: selectedLanguage,
            country: selectedCountry,  // Save country from step 1
            field_of_study: selectedField  // Save field/specialty from step 1
        });
        navigate('/mentee/step2');
    };
    return (
        <div className="w-full min-h-screen bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]">
            <style>{`
                /* Custom scrollbar for dropdowns */
                .dropdown-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .dropdown-scrollbar::-webkit-scrollbar-track {
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 3px;
                }
                
                .dropdown-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.6);
                    border-radius: 3px;
                }
                
                .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.8);
                }
                
                .dropdown-scrollbar::-webkit-scrollbar-corner {
                    background: rgba(139, 92, 246, 0.1);
                }
            `}</style>
            <div className="hidden md:flex w-full min-h-screen items-center justify-center">
                <div className="flex w-[672px] h-[713.6px] relative flex-col items-start">
                    <div className="relative self-stretch w-full h-[713.6px]">
                        <div className="flex flex-col w-[672px] h-[41px] items-start gap-3 absolute top-0 left-0">
                            <div className="flex h-[21px] items-center justify-between pr-[7.63e-06px] pl-0 py-0 relative self-stretch w-full">
                                <div className="relative w-[67.74px] h-[21px]">
                                    <div className="absolute top-px left-0 w-[68px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[21px]">
                                        Step 1 of 3
                                    </div>
                                </div>

                                <div className="w-[91.84px] relative h-[21px]">
                                    <div className="absolute top-px left-0 w-[92px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px]">
                                        33% Complete
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col h-2 items-start pl-0 pr-[448.01px] py-0 relative self-stretch w-full bg-[#364153] rounded-[26843500px] overflow-hidden">
                                <div className="relative self-stretch w-full h-2 bg-[#7008e7]" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[672px] h-[592px] items-start gap-12 pl-8 pr-8 pt-8 pb-0 absolute top-[73px] left-0 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                            <div className="flex-col h-[71px] gap-2 flex w-[606.4px] items-start relative">
                                <div className="relative self-stretch w-full h-[42px]">
                                    <div className="absolute top-0 left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[42px] whitespace-nowrap">
                                        Tell us about yourself
                                    </div>
                                </div>

                                <div className="self-stretch w-full relative h-[21px]">
                                    <p className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#99a1ae] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Help us personalize your experience
                                    </p>
                                </div>
                            </div>

                            <div className="flex-col h-[291px] gap-6 flex w-[606.4px] items-start relative">
                                {/* Row with Profile Picture and Field/Specialty */}
                                <div className="flex gap-8 items-start relative self-stretch w-full">
                                    {/* Profile Picture Column */}
                                    <div className="flex flex-col items-start gap-3">
                                        <div className="flex h-[21px] items-center gap-2">
                                            <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm leading-[21px] whitespace-nowrap">
                                                Profile Picture (Optional)
                                            </div>
                                        </div>

                                        <div className="flex h-20 items-center gap-4">
                                            <div className="flex w-20 h-20 items-center justify-center relative bg-[#7008e733] rounded-full border-[1.6px] border-solid border-[#7008e7]">
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage}
                                                        alt=""
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl">
                                                        JD
                                                    </div>
                                                )}

                                                {profileImage && (
                                                    <div
                                                        className="flex w-6 h-6 items-center justify-center absolute top-14 right-0 bg-[#7008e7] rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-[#6007c5] hover:scale-110"
                                                        onClick={handleRemoveImage}
                                                        title="Remove image"
                                                    >
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />

                                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#2a1a3e] rounded-lg border border-[#354152] hover:bg-gray-50 hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out" onClick={handleUploadClick}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm font-medium">{profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                                            </button>
                                        </div>

                                        {imageError && (
                                            <div className="text-red-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
                                                {imageError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative self-stretch w-full h-[65px]">
                                    <div className="flex flex-col w-[295px] h-[65px] items-start gap-2 absolute top-0 left-0">
                                        <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                Country
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={countryDropdownRef}>
                                            <div
                                                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-lg border-[0.8px] border-solid border-[#354152] cursor-pointer hover:bg-[#ffffff1a] hover:border-[#7008e7]/50 transition-all duration-300 group"
                                                onClick={handleCountryDropdownClick}
                                            >
                                                <div className="flex w-[87.43px] h-5 items-center gap-2 relative overflow-hidden">
                                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-5 whitespace-nowrap group-hover:text-white transition-colors duration-300">
                                                        {selectedCountry || 'Select country'}
                                                    </div>
                                                </div>

                                                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${countryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.5">
                                                            <path d="M4 6L8 10L12 6" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            {countryDropdownOpen && (
                                                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-lg border-[0.8px] border-solid border-[#354152] shadow-xl z-50 max-h-48 overflow-y-auto">
                                                    <div className="py-1">
                                                        {countries.map((country) => (
                                                            <div
                                                                key={country}
                                                                className="px-3 py-2 text-sm text-[#717182] hover:bg-[#7008e7]/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                                                                onClick={() => {
                                                                    setSelectedCountry(country);
                                                                    setCountryDropdownOpen(false);
                                                                    setCountryError('');  // Clear error when country selected
                                                                }}
                                                            >
                                                                {country}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {countryError && (
                                            <div className="absolute top-[68px] left-0 right-0 z-20 flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-red-400 text-sm [font-family:'Arimo-Regular',Helvetica]">{countryError}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col w-[295px] h-[65px] items-start gap-2 absolute top-0 left-[311px]">
                                        <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                Language
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={languageDropdownRef}>
                                            <div
                                                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-lg border-[0.8px] border-solid border-[#354152] cursor-pointer hover:bg-[#ffffff1a] hover:border-[#7008e7]/50 transition-all duration-300 group"
                                                onClick={handleLanguageDropdownClick}
                                            >
                                                <div className="w-[97.81px] flex h-5 items-center gap-2 relative overflow-hidden">
                                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-5 whitespace-nowrap group-hover:text-white transition-colors duration-300">
                                                        {selectedLanguage || 'Select language'}
                                                    </div>
                                                </div>

                                                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.5">
                                                            <path d="M4 6L8 10L12 6" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            {languageDropdownOpen && (
                                                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-lg border-[0.8px] border-solid border-[#354152] shadow-xl z-50 max-h-48 overflow-y-auto">
                                                    <div className="py-1">
                                                        {languages.map((language) => (
                                                            <div
                                                                key={language}
                                                                className="px-3 py-2 text-sm text-[#717182] hover:bg-[#7008e7]/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                                                                onClick={() => {
                                                                    setSelectedLanguage(language);
                                                                    setLanguageDropdownOpen(false);
                                                                }}
                                                            >
                                                                {language}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>



                                {/* Row with I am a and Field/Specialty */}
                                <div className="relative self-stretch w-full h-[65px]">
                                    <div className="flex flex-col w-[295px] h-[65px] items-start gap-2 absolute top-0 left-0">
                                        <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                I am a
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={roleDropdownRef}>
                                            <div
                                                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-lg border-[0.8px] border-solid border-[#354152] cursor-pointer hover:bg-[#ffffff1a] hover:border-[#7008e7]/50 transition-all duration-300 group"
                                                onClick={handleRoleDropdownClick}
                                            >
                                                <div className="w-[95.91px] flex h-5 items-center gap-2 relative overflow-hidden">
                                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-5 whitespace-nowrap group-hover:text-white transition-colors duration-300">
                                                        {selectedRole || 'Select your role'}
                                                    </div>
                                                </div>

                                                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${roleDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.5">
                                                            <path d="M4 6L8 10L12 6" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            {roleDropdownOpen && (
                                                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-lg border-[0.8px] border-solid border-[#354152] shadow-xl z-50 max-h-48 overflow-y-auto">
                                                    <div className="py-1">
                                                        {roles.map((role) => (
                                                            <div
                                                                key={role}
                                                                className="px-3 py-2 text-sm text-[#717182] hover:bg-[#7008e7]/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                                                                onClick={() => {
                                                                    setSelectedRole(role);
                                                                    setRoleDropdownOpen(false);
                                                                }}
                                                            >
                                                                {role}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-[295px] h-[65px] items-start gap-2 absolute top-0 left-[311px]">
                                        <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                Field / Specialty
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={fieldDropdownRef}>
                                            <div
                                                className="flex h-9 items-center justify-between px-3 py-0 relative self-stretch w-full bg-[#ffffff0d] rounded-lg border-[0.8px] border-solid border-[#354152] cursor-pointer hover:bg-[#ffffff1a] hover:border-[#7008e7]/50 transition-all duration-300 group"
                                                onClick={handleFieldDropdownClick}
                                            >
                                                <div className="flex h-5 items-center gap-2 relative overflow-hidden flex-1">
                                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-5 whitespace-nowrap group-hover:text-white transition-colors duration-300">
                                                        {selectedField || 'Select your field'}
                                                    </div>
                                                </div>

                                                <div className="relative w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className={`w-4 h-4 transition-transform duration-300 ${fieldDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.5">
                                                            <path d="M4 6L8 10L12 6" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            {fieldDropdownOpen && (
                                                <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] rounded-lg border-[0.8px] border-solid border-[#354152] shadow-xl z-50 max-h-48 overflow-y-auto">
                                                    <div className="py-1">
                                                        {fields.map((field) => (
                                                            <div
                                                                key={field}
                                                                className="px-3 py-2 text-sm text-[#717182] hover:bg-[#7008e7]/30 hover:text-purple-200 cursor-pointer transition-colors duration-200"
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
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 pb-0 border-t border-[#354152] w-full px-0">
                                <button className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-[#2a1a3e] rounded-lg border border-[#354152] hover:bg-gray-50 hover:border-[#7008e7] hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out" onClick={handlePreviousClick}>
                                    <span className="text-sm font-medium">Previous</span>
                                </button>

                                <button className="flex items-center justify-center gap-2 px-6 py-2 bg-[#7008e7] text-white rounded-lg hover:bg-[#5f07d4] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out relative overflow-hidden" onClick={handleNextStepClick}>
                                    <span className="text-sm font-medium relative z-10">Next Step</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        className="flex items-center justify-center w-full py-3 text-[#99a1ae] hover:text-white hover:scale-[1.05] transition-all duration-200 ease-in-out group"
                        onClick={handleNextStepClick}
                    >
                        <span className="text-sm font-medium">Skip for now</span>
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden px-5 py-10 text-white space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Step 1 of 3</span>
                        <span className="text-white/60">33% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7008e7] w-1/3" />
                    </div>
                </div>

                <div className="bg-[#ffffff0d] border border-white/10 rounded-2xl p-5 space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
                        <p className="text-white/60 text-sm mt-1">Help us personalize your experience</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm text-white/70">Profile Picture (Optional)</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border border-[#7008e7] bg-[#7008e733] flex items-center justify-center overflow-hidden">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt=""
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="text-[#a683ff] text-lg">JD</span>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                className="px-4 py-2 bg-white text-[#2a1a3e] rounded-lg text-sm font-medium"
                                onClick={handleUploadClick}
                            >
                                {profileImage ? 'Change Photo' : 'Upload Photo'}
                            </button>
                            {profileImage && (
                                <button onClick={handleRemoveImage} className="text-sm text-red-300">Remove</button>
                            )}
                        </div>
                        {imageError && <p className="text-xs text-red-400">{imageError}</p>}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2 relative" ref={countryDropdownMobileRef}>
                            <label className="text-sm text-white/70">Country</label>
                            <div
                                className="flex items-center justify-between h-11 px-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                                onClick={handleCountryDropdownClick}
                            >
                                <span className="text-sm text-white/70">{selectedCountry || 'Select country'}</span>
                                <svg className={`w-4 h-4 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {countryDropdownOpen && (
                                <div className="dropdown-scrollbar absolute left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border border-white/10 max-h-48 overflow-y-auto z-10">
                                    {countries.map((country) => (
                                        <div
                                            key={`mobile-country-${country}`}
                                            className="px-3 py-2 text-sm text-white/70 hover:bg-purple-600/30"
                                            onClick={() => {
                                                setSelectedCountry(country);
                                                setCountryDropdownOpen(false);
                                                setCountryError('');  // Clear error when country selected
                                            }}
                                        >
                                            {country}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {countryError && (
                                <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-red-400 text-sm">{countryError}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 relative" ref={languageDropdownMobileRef}>
                            <label className="text-sm text-white/70">Language</label>
                            <div
                                className="flex items-center justify-between h-11 px-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                                onClick={handleLanguageDropdownClick}
                            >
                                <span className="text-sm text-white/70">{selectedLanguage || 'Select language'}</span>
                                <svg className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {languageDropdownOpen && (
                                <div className="dropdown-scrollbar absolute left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border border-white/10 max-h-48 overflow-y-auto z-10">
                                    {languages.map((language) => (
                                        <div
                                            key={`mobile-language-${language}`}
                                            className="px-3 py-2 text-sm text-white/70 hover:bg-purple-600/30"
                                            onClick={() => {
                                                setSelectedLanguage(language);
                                                setLanguageDropdownOpen(false);
                                            }}
                                        >
                                            {language}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 relative" ref={roleDropdownMobileRef}>
                            <label className="text-sm text-white/70">I am a</label>
                            <div
                                className="flex items-center justify-between h-11 px-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                                onClick={handleRoleDropdownClick}
                            >
                                <span className="text-sm text-white/70">{selectedRole || 'Select your role'}</span>
                                <svg className={`w-4 h-4 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {roleDropdownOpen && (
                                <div className="dropdown-scrollbar absolute left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border border-white/10 max-h-48 overflow-y-auto z-10">
                                    {roles.map((role) => (
                                        <div
                                            key={`mobile-role-${role}`}
                                            className="px-3 py-2 text-sm text-white/70 hover:bg-purple-600/30"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setRoleDropdownOpen(false);
                                            }}
                                        >
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Field / Specialty Dropdown (Mobile) */}
                        <div className="space-y-2 relative" ref={fieldDropdownMobileRef}>
                            <label className="text-sm text-white/70">Field / Specialty</label>
                            <div
                                className="flex items-center justify-between h-11 px-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                                onClick={handleFieldDropdownClick}
                            >
                                <span className="text-sm text-white/70">{selectedField || 'Select field'}</span>
                                <svg className={`w-4 h-4 transition-transform ${fieldDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {fieldDropdownOpen && (
                                <div className="dropdown-scrollbar absolute left-0 right-0 mt-1 bg-[#1a1a2e] rounded-xl border border-white/10 max-h-48 overflow-y-auto z-10">
                                    {fields.map((field) => (
                                        <div
                                            key={`mobile-field-${field}`}
                                            className="px-3 py-2 text-sm text-white/70 hover:bg-purple-600/30"
                                            onClick={() => {
                                                setSelectedField(field);
                                                setFieldDropdownOpen(false);
                                            }}
                                        >
                                            {field}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex-1 py-3 bg-white text-[#2a1a3e] rounded-xl border border-white/20 text-sm font-medium"
                            onClick={handlePreviousClick}
                        >
                            Previous
                        </button>
                        <button
                            className="flex-1 py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium"
                            onClick={handleNextStepClick}
                        >
                            Next Step
                        </button>
                    </div>
                    <button
                        className="text-sm text-white/70 underline-offset-2 hover:underline"
                        onClick={handleNextStepClick}
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
