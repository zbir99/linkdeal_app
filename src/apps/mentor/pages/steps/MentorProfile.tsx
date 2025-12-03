import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const certPlaceholder = [
    "PMP Certified",
    "AWS Solutions Architect",
    "Google UX",
    "Scrum Master"
];

export const MentorProfile = (): JSX.Element => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownMobileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState<{
        fullName: string;
        professionalTitle: string;
        location: string;
        linkedinProfile: string;
        language: string;
        password: string;
        confirmPassword: string;
        bio: string;
        certifications: string[];
    }>({
        fullName: "",
        professionalTitle: "",
        location: "",
        linkedinProfile: "",
        language: "",
        password: "",
        confirmPassword: "",
        bio: "",
        certifications: []
    });

    // Input states for adding new items
    const [newCertification, setNewCertification] = useState("");
    const [certificationError, setCertificationError] = useState("");

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

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCertificationRemove = (certToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(cert => cert !== certToRemove)
        }));
        setCertificationError("");
    };

    const handleCertificationAdd = () => {
        const trimmedCert = newCertification.trim();
        
        if (!trimmedCert) {
            return;
        }

        if (formData.certifications.includes(trimmedCert)) {
            setCertificationError("This certification has already been added");
            setTimeout(() => setCertificationError(""), 3000);
            return;
        }

        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, trimmedCert]
        }));
        setNewCertification("");
        setCertificationError("");
    };

    const handleCertificationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCertificationAdd();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideDropdown =
                (languageDropdownRef.current && languageDropdownRef.current.contains(target)) ||
                (languageDropdownMobileRef.current && languageDropdownMobileRef.current.contains(target));
            
            if (!isInsideDropdown) {
                setLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        console.log('Form submitted:', { ...formData, profileImage });
        // Here you would typically send the data to your backend
        // Navigate to success page
        navigate('/mentor/success');
    };
    return (
        <div className="bg-[#0a0a1a] w-full min-h-screen relative overflow-hidden">
            <style>{`
                select option {
                    background-color: #1a1a2e;
                    color: white;
                }
                select option:hover {
                    background-color: #7008e7;
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
            `}</style>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,1)_0%,rgba(26,26,46,1)_50%,rgba(42,26,62,1)_100%)]"></div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
            />
            <div className="relative z-10 hidden md:flex flex-col items-center justify-start w-full max-w-[1200px] px-8 py-8 min-h-screen mx-auto">
                <div className="flex flex-col items-center gap-8 w-full max-w-[896px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-[301px] h-12 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[48px] whitespace-nowrap text-center">
                            Confirm your profile
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-6 w-full max-w-[896px]">
                        <div className="flex w-[896px] h-[212.6px] relative flex-col items-start gap-10 pl-6 pr-0 pt-6 pb-0 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                            <div className="relative w-[846.4px] h-[27px]">
                                <div className="absolute top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                    Profile Photo
                                </div>
                            </div>

                            <div className="relative w-[846.4px] h-24">
                                <div className="flex flex-col w-[174px] h-[47px] items-start gap-2 absolute top-6 left-[120px]">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Upload a professional photo
                                        </div>
                                    </div>

                                    <div className="relative self-stretch w-full h-[18px]">
                                        <p className="absolute top-0 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                                            JPG, PNG or GIF (max 2MB)
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-0 left-0 w-24 h-24">
                                    <div 
                                        className="flex w-24 h-24 items-center justify-center pl-0 pr-[0.01px] py-0 absolute top-0 left-0 bg-[#7008e7] rounded-[26843500px] cursor-pointer overflow-hidden transition-all duration-300 hover:bg-[#6007c5]"
                                        onClick={handleUploadClick}
                                    >
                                        {profileImage ? (
                                            <img 
                                                src={profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="relative w-[51.46px] h-12">
                                                <div className="absolute -top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
                                                    MD
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {profileImage ? (
                                        <div 
                                            className="flex w-8 h-8 items-center justify-center absolute top-16 left-16 bg-[#7008e7] rounded-[26843500px] shadow-[0px_4px_6px_-4px_#7008e780,0px_10px_15px_-3px_#7008e780] cursor-pointer transition-all duration-300 hover:bg-[#6007c5]"
                                            onClick={handleRemoveImage}
                                        >
                                            <div className="relative w-4 h-4">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="flex w-8 h-8 items-center justify-center absolute top-16 left-16 bg-[#7008e7] rounded-[26843500px] shadow-[0px_4px_6px_-4px_#7008e780,0px_10px_15px_-3px_#7008e780] cursor-pointer transition-all duration-300 hover:bg-[#6007c5]"
                                            onClick={handleUploadClick}
                                        >
                                            <div className="relative w-4 h-4">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {imageError && (
                                    <div className="absolute top-20 left-0 w-[846.4px]">
                                        <div className="text-red-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
                                            {imageError}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pl-6 pr-0 pt-6 pb-6 flex w-[896px] relative flex-col items-start gap-10 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                            <div className="relative w-[846.4px] h-[27px]">
                                <div className="absolute top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                    Basic Information
                                </div>
                            </div>

                            <div className="flex flex-col w-[846.4px] items-start gap-4 relative">
                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Full Name
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        placeholder="Enter your full name"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Professional Title
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.professionalTitle}
                                        onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                                        placeholder="e.g. Full-Stack Developer, UX Designer"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Location
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="e.g. Paris, France"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Language
                                        </div>
                                    </div>

                                    <div className="relative w-full" ref={languageDropdownRef}>
                                        <div 
                                            className="flex h-12 items-center justify-between px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02] group"
                                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                        >
                                            <div className="flex items-center gap-2 relative">
                                                <div className={`w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-sm transition-colors duration-300 ${formData.language ? 'text-white' : 'text-[#8891A1] group-hover:text-[#B0B8C8]'}`}>
                                                    {formData.language ? formData.language.charAt(0).toUpperCase() + formData.language.slice(1) : 'Select your language'}
                                                </div>
                                            </div>
                                            <div className="relative w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className={`w-5 h-5 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {languageDropdownOpen && (
                                            <div className="dropdown-scrollbar absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-solid border-[#fffefe30] shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto overflow-x-hidden">
                                                <div className="py-2">
                                                    {['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'].map((lang) => (
                                                        <div
                                                            key={lang}
                                                            className="px-4 py-3 text-sm text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                                                            onClick={() => {
                                                                handleInputChange('language', lang.toLowerCase());
                                                                setLanguageDropdownOpen(false);
                                                            }}
                                                        >
                                                            {lang}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Password
                                        </div>
                                    </div>

                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            Confirm Password
                                        </div>
                                    </div>

                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="Confirm your password"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                    <div className="relative self-stretch w-full h-[21px]">
                                        <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                            LinkedIn Profile
                                        </div>
                                    </div>

                                    <input
                                        type="url"
                                        value={formData.linkedinProfile}
                                        onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                                        placeholder="https://linkedin.com/in/mariedupont"
                                        className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-[216.6px] pl-6 pr-0 pt-6 pb-0 flex w-[896px] relative flex-col items-start gap-10 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                            <div className="relative w-[846.4px] h-[27px]">
                                <div className="absolute top-px left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                    Bio
                                </div>
                            </div>

                            <div className="flex w-[846.4px] h-[100px] items-start px-3 py-2 relative bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]">
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder="Tell mentees about yourself..."
                                    className="w-full h-full bg-transparent text-white text-sm [font-family:'Arimo-Regular',Helvetica] leading-5 resize-none focus:outline-none placeholder-[#a0a0a0]"
                                />
                            </div>
                        </div>

                        <div className="pl-6 pr-0 py-6 flex w-[896px] relative flex-col items-start gap-4 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 min-h-[160px] max-h-[380px]">
                            <div className="relative w-[846.4px] h-[27px] flex-shrink-0">
                                <div className="absolute top-1 left-0 w-5 h-5">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <div className="absolute top-px left-7 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                    Certifications
                                </div>
                            </div>

                            {formData.certifications.length > 0 && (
                                <div className="flex flex-col w-[846.4px] items-start gap-2 relative flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-[#7008e7] scrollbar-track-[#ffffff0d]">
                                    {formData.certifications.map((cert, index) => (
                                        <div key={`${cert}-${index}`} className="flex min-h-[46.6px] items-center justify-between px-3 py-2 relative w-full bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#7008e733] hover:to-[#8d51ff33] hover:border-[#7008e7] hover:shadow-lg hover:shadow-[#7008e7]/30">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[21px] break-words">
                                                    {cert}
                                                </div>
                                            </div>

                                            <div 
                                                className="flex-shrink-0 w-4 h-4 cursor-pointer hover:bg-[#7008e750] rounded transition-colors"
                                                onClick={() => handleCertificationRemove(cert)}
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col w-[846.4px] items-start gap-2 relative flex-shrink-0">
                                {certificationError && (
                                    <div className="w-full px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 text-xs [font-family:'Arimo-Regular',Helvetica]">
                                            {certificationError}
                                        </p>
                                    </div>
                                )}

                                <div className="flex w-full h-10 items-center gap-2">
                                    <input
                                        type="text"
                                        value={newCertification}
                                        onChange={(e) => setNewCertification(e.target.value)}
                                        onKeyPress={handleCertificationKeyPress}
                                        placeholder="Add a certification..."
                                        className="flex-1 h-10 px-3 py-1 bg-[#ffffff0d] rounded-xl border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 focus:outline-none transition-all duration-300 focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20"
                                    />

                                    <button 
                                        onClick={handleCertificationAdd}
                                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] transition-all duration-300 bg-[#7008e7] cursor-pointer hover:bg-[#6007c5] hover:scale-105 active:scale-95"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h-[256.6px] pl-6 pr-0 pt-6 pb-0 flex w-[896px] relative flex-col items-start gap-10 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                            <div className="relative w-[846.4px] h-[27px]">
                                <div className="absolute top-1 left-0 w-5 h-5">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.8973 10.7422L14.1598 17.8472C14.1739 17.9309 14.1622 18.0168 14.1261 18.0936C14.0901 18.1705 14.0315 18.2344 13.9581 18.277C13.8847 18.3196 13.8 18.3388 13.7155 18.3319C13.6309 18.3251 13.5504 18.2926 13.4848 18.2389L10.5015 15.9997C10.3574 15.8921 10.1825 15.834 10.0027 15.834C9.82294 15.834 9.64798 15.8921 9.50396 15.9997L6.51563 18.238C6.45006 18.2917 6.36968 18.3241 6.28521 18.331C6.20073 18.3378 6.11619 18.3187 6.04285 18.2762C5.9695 18.2338 5.91086 18.17 5.87473 18.0933C5.83859 18.0166 5.8267 17.9308 5.84063 17.8472L7.10229 10.7422" stroke="#A684FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 11.666C12.7614 11.666 15 9.42744 15 6.66602C15 3.90459 12.7614 1.66602 10 1.66602C7.23858 1.66602 5 3.90459 5 6.66602C5 9.42744 7.23858 11.666 10 11.666Z" stroke="#A684FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>

                                <div className="absolute top-px left-7 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                    Upload your CV
                                </div>
                            </div>

                            <div className="flex w-[846.4px] h-[160px] items-center justify-center px-3 py-2 relative bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer mb-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 6V30" stroke="#A684FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M34 16L24 6L14 16" stroke="#A684FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30" stroke="#A684FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white text-sm [font-family:'Arimo-Regular',Helvetica] font-normal leading-5">
                                            Click to upload or drag and drop
                                        </div>
                                        <div className="text-[#99a1ae] text-xs [font-family:'Arimo-Regular',Helvetica] font-normal leading-4 mt-1">
                                            PDF, DOC, DOCX (max 5MB)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full h-12 relative items-start gap-4 max-w-[896px] mt-8">
                            <button 
                                className="box-border bg-[#0a0a1a] border-[0.8px] border-solid border-[#fffefe1a] flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffffff2a] hover:border-[#b899ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105"
                                onClick={() => navigate('/mentor/step3')}
                            >
                                <div className="w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                    Cancel
                                </div>
                            </button>

                            <button 
                                className={`border-none outline-none flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out ${
                                    isPressed 
                                        ? 'bg-[#5005a3] scale-95 shadow-lg shadow-purple-500/20' 
                                        : isHovered 
                                            ? 'bg-[#6007c5] scale-105 shadow-xl shadow-purple-500/30' 
                                            : 'bg-[#7008e7] shadow-lg shadow-purple-500/25'
                                }`}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onMouseDown={() => setIsPressed(true)}
                                onMouseUp={() => setIsPressed(false)}
                                onClick={handleSubmit}
                            >
                                <div className={`w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 ${
                                    isHovered ? 'scale-105' : 'scale-100'
                                }`}>
                                    Request approval
                                </div>
                            </button>
                        </div>
                        </div>
                    </div>
            </div>

            {/* Mobile layout */}
            <div className="relative z-10 md:hidden px-5 py-10 space-y-6 text-white">
                <div className="text-center space-y-2 hidden">
                    <h1 className="text-3xl font-semibold">Confirm your profile</h1>
                    <p className="text-white/70 text-sm">Help mentees understand your background</p>
                </div>

                {/* Profile Photo */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h2 className="text-lg font-medium">Profile Photo</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-[#7008e7] overflow-hidden flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-semibold">MP</span>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-white/70 text-sm">Upload a professional headshot</p>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 py-2 bg-white text-[#2a1a3e] rounded-lg text-sm font-medium"
                                    onClick={handleUploadClick}
                                >
                                    {profileImage ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                {profileImage && (
                                    <button
                                        className="px-3 py-2 bg-white/10 rounded-lg text-sm text-red-300"
                                        onClick={handleRemoveImage}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {imageError && <p className="text-xs text-red-400">{imageError}</p>}
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                    {[
                        { label: 'Full Name', field: 'fullName', placeholder: 'Jane Doe', type: 'text' },
                        { label: 'Professional Title', field: 'professionalTitle', placeholder: 'Lead Product Manager @ Company', type: 'text' },
                        { label: 'Location', field: 'location', placeholder: 'Paris, France', type: 'text' },
                        { label: 'LinkedIn Profile', field: 'linkedinProfile', placeholder: 'https://linkedin.com/in/...', type: 'url' }
                    ].map(({ label, field, placeholder, type }) => (
                        <div className="space-y-2" key={field}>
                            <label className="text-sm text-white/70">{label}</label>
                            <input
                                type={type}
                                value={(formData as any)[field]}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                className="w-full h-11 px-3 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                                placeholder={placeholder}
                            />
                        </div>
                    ))}
                    
                    <div className="space-y-2 relative" ref={languageDropdownMobileRef}>
                        <label className="text-sm text-white/70">Language</label>
                        <div
                            className="flex h-11 items-center justify-between px-3 bg-transparent rounded-xl border border-white/15 cursor-pointer hover:border-[#7008e7]/60 transition-all duration-300 group"
                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                        >
                            <div className={`[font-family:'Arimo-Regular',Helvetica] text-sm transition-colors duration-300 ${formData.language ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                                {formData.language ? formData.language.charAt(0).toUpperCase() + formData.language.slice(1) : 'Select your language'}
                            </div>
                            <svg className={`w-5 h-5 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {languageDropdownOpen && (
                            <div className="dropdown-scrollbar absolute left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-[#fffefe30] shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto overflow-x-hidden">
                                <div className="py-2">
                                    {['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'].map((lang) => (
                                        <div
                                            key={`mobile-${lang}`}
                                            className="px-4 py-3 text-sm text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white cursor-pointer transition-all duration-200"
                                            onClick={() => {
                                                handleInputChange('language', lang.toLowerCase());
                                                setLanguageDropdownOpen(false);
                                            }}
                                        >
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/70">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full h-11 px-3 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/70">Confirm Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full h-11 px-3 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/70">Short Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full h-28 px-3 py-2 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                            placeholder="Share your story and expertise..."
                        />
                    </div>
                </div>

                {/* Certifications */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h2 className="text-lg font-medium">Certifications</h2>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto overflow-x-hidden">
                        {formData.certifications.map((cert, index) => (
                            <span
                                key={`mobile-cert-${cert}-${index}`}
                                className="px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs flex items-center gap-2 break-words max-w-full"
                            >
                                <span className="break-words">{cert}</span>
                                <button onClick={() => handleCertificationRemove(cert)} className="text-white/60 text-[10px] flex-shrink-0">✕</button>
                            </span>
                        ))}
                    </div>
                    {certificationError && (
                        <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-xs">{certificationError}</p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            onKeyDown={handleCertificationKeyPress}
                            className="flex-1 h-10 px-3 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                            placeholder="Add a certification"
                        />
                        <button 
                            className="px-4 py-2 rounded-xl text-sm bg-[#7008e7]"
                            onClick={handleCertificationAdd}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {certPlaceholder.map((cert) => (
                            <button
                                key={`placeholder-cert-${cert}`}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                                onClick={() => {
                                    if (!formData.certifications.includes(cert)) {
                                        setFormData((prev) => ({ ...prev, certifications: [...prev.certifications, cert] }));
                                    }
                                }}
                            >
                                {cert}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        className="w-full py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium"
                        onClick={handleSubmit}
                    >
                        Save & Continue
                    </button>
                    <button className="text-sm text-white/70 underline-offset-2 hover:underline" onClick={() => navigate('/mentor/success')}>
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};
