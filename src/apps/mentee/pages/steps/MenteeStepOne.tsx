import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Japan', 'South Korea', 'China', 'India', 'Singapore', 'Brazil', 'Mexico', 'Argentina', 'Other'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'];
const roles = ['Student', 'Professional', 'Entrepreneur', 'Career Changer', 'Job Seeker', 'Researcher', 'Other'];

export const Information = (): JSX.Element => {
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");
    
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const countryDropdownMobileRef = useRef<HTMLDivElement>(null);
    const languageDropdownMobileRef = useRef<HTMLDivElement>(null);
    const roleDropdownMobileRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

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

            if (!isCountryTarget) {
                setCountryDropdownOpen(false);
            }
            if (!isLanguageTarget) {
                setLanguageDropdownOpen(false);
            }
            if (!isRoleTarget) {
                setRoleDropdownOpen(false);
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
        setImageError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreviousClick = () => {
        navigate('/signup');
    };

    const handleNextStepClick = () => {
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
                            <div className="flex flex-col h-[113px] items-start gap-3 relative self-stretch w-full">
                                <div className="flex h-[21px] items-center gap-2 relative self-stretch w-full">
                                    <div className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                        Profile Picture (Optional)
                                    </div>
                                </div>

                                <div className="flex h-20 items-center gap-4 relative self-stretch w-full">
                                    <div className="flex w-20 h-20 items-center justify-center pr-[2.48e-05px] pl-0 py-0 relative bg-[#7008e733] rounded-[26843500px] border-[1.6px] border-solid border-[#7008e7]">
                                        {profileImage ? (
                                            <img 
                                                src={profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover rounded-[26843500px]"
                                            />
                                        ) : (
                                            <div className="relative w-[30.27px] h-9">
                                                <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-[#a683ff] text-2xl tracking-[0] leading-9 whitespace-nowrap">
                                                    JD
                                                </div>
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
                                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-sm font-medium">{profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                                    </button>
                                </div>

                                {imageError && (
                                    <div className="relative self-stretch w-full h-[21px] mt-2">
                                        <div className="text-red-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
                                            {imageError}
                                        </div>
                                    </div>
                                )}
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
                                                        <path d="M4 6L8 10L12 6" stroke="#717182" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
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
                                                            }}
                                                        >
                                                            {country}
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
                                                        <path d="M4 6L8 10L12 6" stroke="#717182" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
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

                            <div className="flex flex-col h-[65px] items-start gap-2 relative self-stretch w-full">
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
                                                    <path d="M4 6L8 10L12 6" stroke="#717182" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
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
                
                <button className="flex items-center justify-center w-full py-3 text-[#99a1ae] hover:text-white hover:scale-[1.05] transition-all duration-200 ease-in-out group">
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
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                                            }}
                                        >
                                            {country}
                                        </div>
                                    ))}
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
                    <button className="text-sm text-white/70 underline-offset-2 hover:underline">
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
