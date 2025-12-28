import { useState, useRef, ChangeEvent, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { UnsavedChangesModal } from "@/components/UnsavedChangesModal";

export const MentorProfile = (): JSX.Element => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>("");
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageDropdownMobileRef = useRef<HTMLDivElement>(null);
    const titleDropdownRef = useRef<HTMLDivElement>(null);
    const titleDropdownMobileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Professional Title options
    const professionalTitles = [
        'Full-Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Mobile Developer',
        'DevOps Engineer',
        'Data Scientist',
        'Machine Learning Engineer',
        'AI Engineer',
        'Cloud Architect',
        'Software Architect',
        'UX/UI Designer',
        'Product Designer',
        'Product Manager',
        'Project Manager',
        'Engineering Manager',
        'Tech Lead',
        'CTO',
        'Startup Founder',
        'Business Analyst',
        'Data Analyst',
        'Cybersecurity Specialist',
        'QA Engineer',
        'Solutions Architect',
        'Technical Writer',
        'Blockchain Developer',
        'Game Developer',
        'Embedded Systems Engineer',
        'Other'
    ];

    // Social auth detection state
    const [isSocialAuth, setIsSocialAuth] = useState(false);
    const [socialAuthProvider, setSocialAuthProvider] = useState<string | null>(null);

    // Account linking state
    const [showLinkingModal, setShowLinkingModal] = useState(false);
    const [linkingMessage, setLinkingMessage] = useState('');
    const [linkingSuccess, setLinkingSuccess] = useState(false);
    const [pendingRegistrationData, setPendingRegistrationData] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState<{
        fullName: string;
        professionalTitle: string;
        location: string;
        linkedinProfile: string;
        languages: string[];
        email: string;
        password: string;
        confirmPassword: string;
        bio: string;
    }>({
        fullName: "",
        professionalTitle: "",
        location: "",
        linkedinProfile: "",
        languages: [],
        email: "",
        password: "",
        confirmPassword: "",
        bio: "",
    });

    // Determine if the form has unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        return !!(
            formData.fullName ||
            formData.professionalTitle ||
            formData.location ||
            formData.linkedinProfile ||
            formData.languages.length > 0 ||
            formData.email ||
            formData.bio ||
            profileImage ||
            cvFile
        );
    }, [formData, profileImage, cvFile]);

    // Navigation guard - warns user about losing changes
    const {
        showModal: showUnsavedModal,
        handleStayOnPage,
        handleLeaveAnyway,
    } = useNavigationGuard({
        when: hasUnsavedChanges,
        message: 'You have unsaved registration data. Are you sure you want to leave?',
        allowedPaths: ['/mentor/success', '/login', '/signup', '/mentee/step1', '/mentee/step2', '/mentee/step3'],  // Allow navigation to other signup flows
    });

    // Check for social auth on component mount
    useEffect(() => {
        const isSocial = sessionStorage.getItem('social_auth_pending') === 'true';
        const provider = sessionStorage.getItem('auth0_provider');

        setIsSocialAuth(isSocial);
        setSocialAuthProvider(provider);

        if (isSocial) {
            // Pre-fill data from social auth
            const socialName = sessionStorage.getItem('social_auth_name') || '';
            const socialEmail = sessionStorage.getItem('social_auth_email') || '';
            const socialPicture = sessionStorage.getItem('social_auth_picture');

            // For LinkedIn, try to get the LinkedIn URL from the user's profile
            let linkedinUrl = '';
            if (provider === 'linkedin') {
                // LinkedIn auth provides the profile URL
                linkedinUrl = sessionStorage.getItem('social_auth_linkedin_url') || '';
            }

            setFormData(prev => ({
                ...prev,
                fullName: socialName,
                email: socialEmail,
                linkedinProfile: linkedinUrl
            }));

            if (socialPicture) {
                setProfileImage(socialPicture);
            }
        }
    }, []);

    // Input states for adding new items

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

        // Store the file for form submission
        setProfilePictureFile(file);

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
        setProfilePictureFile(null);
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

    // Find the existing file input and connect it
    useEffect(() => {
        // Connect the existing file input to the handler
        const fileInput = fileInputRef.current;
        if (fileInput) {
            const handleNativeChange = (e: Event) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                    handleImageUpload({ target } as ChangeEvent<HTMLInputElement>);
                }
            };

            fileInput.addEventListener('change', handleNativeChange);
            return () => {
                fileInput.removeEventListener('change', handleNativeChange);
            };
        }
    }, []);

    // CV file handler
    const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('CV file input changed');
        const file = e.target.files?.[0];
        if (file) {
            console.log('CV file selected:', file.name, file.type, file.size);
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please upload a PDF, DOC, or DOCX file');
                return;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError('CV size should be less than 5MB');
                return;
            }

            setCvFile(file);
            setError('');
            console.log('CV file set successfully');
        } else {
            console.log('No file selected');
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        // Validation for NON-social auth users
        if (!isSocialAuth) {
            if (!formData.fullName || !formData.email || !formData.password) {
                setError('Please fill in all required fields (Full Name, Email, Password)');
                setIsLoading(false);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            // Validate password strength
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long');
                setIsLoading(false);
                return;
            }
            if (!/[A-Z]/.test(formData.password)) {
                setError('Password must contain at least one uppercase letter');
                setIsLoading(false);
                return;
            }
            if (!/[a-z]/.test(formData.password)) {
                setError('Password must contain at least one lowercase letter');
                setIsLoading(false);
                return;
            }
            if (!/\d/.test(formData.password)) {
                setError('Password must contain at least one number');
                setIsLoading(false);
                return;
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                setError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setIsLoading(false);
                return;
            }
        }

        // LinkedIn Profile validation - skip for LinkedIn social auth
        if (!(isSocialAuth && socialAuthProvider === 'linkedin')) {
            if (!formData.linkedinProfile) {
                setError('LinkedIn Profile URL is required');
                setIsLoading(false);
                return;
            }
        }

        // Validate and format LinkedIn URL (if provided)
        let linkedinUrl = formData.linkedinProfile?.trim() || '';
        if (linkedinUrl) {
            if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
                linkedinUrl = 'https://' + linkedinUrl;
            }
            if (!linkedinUrl.includes('linkedin.com')) {
                setError('Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)');
                setIsLoading(false);
                return;
            }
        }

        if (!cvFile) {
            setError('Please upload your CV');
            setIsLoading(false);
            return;
        }

        try {
            if (isSocialAuth) {
                // Social auth registration flow
                const socialData: any = {
                    professional_title: formData.professionalTitle,
                    location: formData.location,
                    linkedin_url: linkedinUrl,
                    languages: formData.languages,
                    country: formData.location,
                    bio: formData.bio,
                    full_name: formData.fullName, // Pre-filled from social auth
                    social_picture_url: sessionStorage.getItem('social_auth_picture'), // Add social picture URL
                };

                // Add profile picture if available
                if (profilePictureFile) {
                    socialData.profile_picture = profilePictureFile;
                }

                // Add CV file (required for mentors)
                if (cvFile) {
                    socialData.cv = cvFile;
                }

                console.log('Submitting social mentor registration:', socialData);
                console.log('DEBUG: social_auth_picture from sessionStorage:', sessionStorage.getItem('social_auth_picture'));

                // Store for potential linking flow
                setPendingRegistrationData(socialData);

                // Call social mentor registration endpoint
                const response = await authService.socialRegister('mentor', socialData);

                if (response.success) {
                    console.log('Social mentor registration successful');
                    // Clear social auth session data
                    sessionStorage.removeItem('social_auth_pending');
                    sessionStorage.removeItem('social_auth_email');
                    sessionStorage.removeItem('social_auth_name');
                    sessionStorage.removeItem('social_auth_picture');
                    sessionStorage.removeItem('social_auth_provider');
                    navigate('/mentor/success');
                } else if ((response as any).requiresLinking) {
                    // Email exists - show account linking modal
                    setShowLinkingModal(true);
                    setLinkingMessage(response.message || 'An account with this email already exists.');
                } else {
                    setError(response.message || 'Registration failed');
                }
            } else {
                // Regular DB registration flow
                const formDataToSend = new FormData();
                formDataToSend.append('email', formData.email.trim());
                formDataToSend.append('password', formData.password);
                formDataToSend.append('password_confirm', formData.confirmPassword);
                formDataToSend.append('full_name', formData.fullName.trim());
                formDataToSend.append('professional_title', formData.professionalTitle);
                formDataToSend.append('location', formData.location);
                formDataToSend.append('linkedin_url', linkedinUrl);
                formData.languages.forEach(lang => formDataToSend.append('languages', lang));
                formDataToSend.append('country', formData.location);
                formDataToSend.append('bio', formData.bio);
                formDataToSend.append('cv', cvFile);

                // Add profile picture if uploaded
                if (profilePictureFile) {
                    formDataToSend.append('profile_picture', profilePictureFile);
                }

                console.log('Submitting mentor registration with CV:', cvFile.name);

                // Call mentor registration endpoint using simple DB version (no Auth0)
                const response = await authService.registerMentorDB(formDataToSend);

                if (response.success) {
                    console.log('Mentor registration successful');
                    navigate('/mentor/success');
                } else {
                    setError(response.message || 'Registration failed');
                }
            }
        } catch (err: any) {
            console.error('Mentor registration error:', err);
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
            const email = sessionStorage.getItem('social_auth_email') || formData.email;
            const response = await authService.requestAccountLinking(
                email,
                'mentor',
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
            {/* Unsaved Changes Warning Modal */}
            <UnsavedChangesModal
                isOpen={showUnsavedModal}
                onStay={handleStayOnPage}
                onLeave={handleLeaveAnyway}
                title="Leave Registration?"
                message="You have unsaved registration data. Your progress will be lost if you leave this page."
            />

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
                                                    crossOrigin="anonymous"
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
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
                                <div className="relative w-[846.4px] h-[27px] flex items-center gap-2">
                                    <div className="w-5 h-5">
                                        <svg className="w-5 h-5" fill="none" stroke="#A684FF" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-px left-7 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                        Basic Information
                                    </div>
                                </div>

                                <div className="flex flex-col w-[846.4px] items-start gap-4 relative">
                                    {/* Full Name - hidden for social auth */}
                                    {!isSocialAuth && (
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
                                    )}

                                    {/* Email - hidden for social auth */}
                                    {!isSocialAuth && (
                                        <div className="flex flex-col h-[77px] items-start gap-2 relative self-stretch w-full">
                                            <div className="relative self-stretch w-full h-[21px]">
                                                <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                    Email Address
                                                </div>
                                            </div>

                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="Enter your email address"
                                                className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap focus:outline-none focus:border-[#a683ff] focus:bg-[#ffffff1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                                        <div className="relative self-stretch w-full h-[21px]">
                                            <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                Professional Title
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={titleDropdownRef}>
                                            <div
                                                className="h-12 px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 flex items-center justify-between"
                                                onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                                            >
                                                <span className={`[font-family:'Arimo-Regular',Helvetica] font-normal text-sm ${formData.professionalTitle ? 'text-white' : 'text-[#d0d5db]'}`}>
                                                    {formData.professionalTitle || 'Select your professional title'}
                                                </span>
                                                <svg className={`w-5 h-5 transition-transform duration-300 ${titleDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            {titleDropdownOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl shadow-purple-500/20 z-50 max-h-56 overflow-y-auto">
                                                    <div className="py-2">
                                                        {professionalTitles.map((title) => (
                                                            <div
                                                                key={title}
                                                                className={`px-4 py-3 text-sm cursor-pointer transition-all duration-200 [font-family:'Arimo-Regular',Helvetica] ${formData.professionalTitle === title ? 'bg-purple-600/40 text-white' : 'text-white/70 hover:bg-purple-600/20 hover:text-white'}`}
                                                                onClick={() => {
                                                                    handleInputChange('professionalTitle', title);
                                                                    setTitleDropdownOpen(false);
                                                                }}
                                                            >
                                                                {title}
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

                                    <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                                        <div className="relative self-stretch w-full h-[21px]">
                                            <div className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                                                Languages
                                            </div>
                                        </div>

                                        <div className="relative w-full" ref={languageDropdownRef}>
                                            <div
                                                className="flex h-12 items-center justify-between px-3 py-1 relative self-stretch w-full bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] cursor-pointer hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02] group"
                                                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                            >
                                                <div className="flex items-center gap-2 relative">
                                                    <div className="w-fit whitespace-nowrap [font-family:'Arimo-Regular',Helvetica] font-normal text-sm text-[#8891A1] group-hover:text-[#B0B8C8] transition-colors duration-300">
                                                        {formData.languages.length > 0 ? `${formData.languages.length} language(s) selected` : 'Select languages'}
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
                                                                className={`px-4 py-3 text-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 flex items-center justify-between ${formData.languages.includes(lang)
                                                                    ? 'bg-purple-600/40 text-white'
                                                                    : 'text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white'
                                                                    }`}
                                                                onClick={() => {
                                                                    if (formData.languages.includes(lang)) {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            languages: prev.languages.filter(l => l !== lang)
                                                                        }));
                                                                    } else {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            languages: [...prev.languages, lang]
                                                                        }));
                                                                    }
                                                                }}
                                                            >
                                                                {lang}
                                                                {formData.languages.includes(lang) && (
                                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected Languages Chips */}
                                        {formData.languages.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.languages.map((lang, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 rounded-lg bg-[#7008E7]/30 border border-[#A684FF]/50 text-sm text-white cursor-pointer hover:bg-[#7008E7]/50 transition-all duration-300"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                languages: prev.languages.filter(l => l !== lang)
                                                            }));
                                                        }}
                                                    >
                                                        {lang} ×
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password and Confirm Password - hidden for social auth */}
                                    {!isSocialAuth && (
                                        <>
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
                                        </>
                                    )}

                                    {/* LinkedIn Profile - hidden for LinkedIn social auth */}
                                    {!(isSocialAuth && socialAuthProvider === 'linkedin') && (
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
                                    )}
                                </div>
                            </div>

                            <div className="h-[216.6px] pl-6 pr-0 pt-6 pb-0 flex w-[896px] relative flex-col items-start gap-10 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                                <div className="relative w-[846.4px] h-[27px] flex items-center gap-2">
                                    <div className="w-5 h-5">
                                        <svg className="w-5 h-5" fill="none" stroke="#A684FF" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-px left-7 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
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


                            <div className="h-[256.6px] pl-6 pr-0 pt-6 pb-0 flex w-[896px] relative flex-col items-start gap-10 bg-[#ffffff0d] rounded-2xl border-[0.8px] border-solid border-[#fffefe1a]">
                                <div className="relative w-[846.4px] h-[27px]">
                                    <div className="absolute top-1 left-0 w-5 h-5">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.8973 10.7422L14.1598 17.8472C14.1739 17.9309 14.1622 18.0168 14.1261 18.0936C14.0901 18.1705 14.0315 18.2344 13.9581 18.277C13.8847 18.3196 13.8 18.3388 13.7155 18.3319C13.6309 18.3251 13.5504 18.2926 13.4848 18.2389L10.5015 15.9997C10.3574 15.8921 10.1825 15.834 10.0027 15.834C9.82294 15.834 9.64798 15.8921 9.50396 15.9997L6.51563 18.238C6.45006 18.2917 6.36968 18.3241 6.28521 18.331C6.20073 18.3378 6.11619 18.3187 6.04285 18.2762C5.9695 18.2338 5.91086 18.17 5.87473 18.0933C5.83859 18.0166 5.8267 17.9308 5.84063 17.8472L7.10229 10.7422" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 11.666C12.7614 11.666 15 9.42744 15 6.66602C15 3.90459 12.7614 1.66602 10 1.66602C7.23858 1.66602 5 3.90459 5 6.66602C5 9.42744 7.23858 11.666 10 11.666Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="absolute top-px left-7 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                                        Upload your CV
                                    </div>
                                </div>

                                <input
                                    ref={cvInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCvChange}
                                    className="hidden"
                                    id="cv-file-input-desktop"
                                />
                                <label
                                    htmlFor="cv-file-input-desktop"
                                    className="flex w-[846.4px] h-[160px] items-center justify-center px-3 py-2 relative bg-[#ffffff0d] rounded-xl overflow-hidden border-[0.8px] border-solid border-[#fffefe1a] hover:bg-[#ffffff3a] hover:border-[#d4b5ff] hover:shadow-lg hover:shadow-[#7008e7]/20 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer mb-6"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M24 6V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M34 16L24 6L14 16" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.783 6 39.0609 6 38V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white text-sm [font-family:'Arimo-Regular',Helvetica] font-normal leading-5">
                                                {cvFile ? cvFile.name : 'Click to upload or drag and drop'}
                                            </div>
                                            <div className="text-[#99a1ae] text-xs [font-family:'Arimo-Regular',Helvetica] font-normal leading-4 mt-1">
                                                PDF, DOC, DOCX (max 5MB)
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Error Display - Desktop */}
                            {error && (
                                <div className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl mb-6">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="flex flex-col gap-1">
                                            {error.split('\n').map((line, index) => (
                                                <p key={index} className="text-red-400 text-sm">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex w-full h-12 relative items-start gap-4 max-w-[896px] mt-8">
                                <button
                                    className="box-border bg-[#0a0a1a] border-[0.8px] border-solid border-[#fffefe1a] flex h-12 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffffff2a] hover:border-[#b899ff] hover:shadow-lg hover:shadow-[#7008e7]/25 hover:scale-105"
                                    onClick={() => navigate('/signup')}
                                >
                                    <div className="w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-[#d0d5db] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                        Cancel
                                    </div>
                                </button>

                                <button
                                    className={`box-border flex h-12 items-center justify-center gap-2 px-8 py-2 flex-1 rounded-xl cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 ${isPressed
                                        ? 'bg-[#6007c5] shadow-lg shadow-purple-500/25 scale-95'
                                        : isHovered
                                            ? 'bg-[#7008e7] shadow-lg shadow-purple-500/25'
                                            : 'bg-[#7008e7] shadow-lg shadow-purple-500/25'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onMouseDown={() => setIsPressed(true)}
                                    onMouseUp={() => setIsPressed(false)}
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    <div className={`w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                                        }`}>
                                        {isLoading ? 'Submitting...' : 'Request approval'}
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
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
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
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                <svg className="w-5 h-5" fill="none" stroke="#A684FF" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-medium">Basic Information</h2>
                        </div>
                        {/* Filter fields based on social auth */}
                        {[
                            // Full Name - only show if NOT social auth
                            ...(!isSocialAuth ? [{ label: 'Full Name', field: 'fullName', placeholder: 'Jane Doe', type: 'text' }] : []),
                            { label: 'Location', field: 'location', placeholder: 'Paris, France', type: 'text' },
                            // LinkedIn Profile - only show if NOT LinkedIn social auth
                            ...(!(isSocialAuth && socialAuthProvider === 'linkedin') ? [{ label: 'LinkedIn Profile', field: 'linkedinProfile', placeholder: 'https://linkedin.com/in/...', type: 'url' }] : [])
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

                        {/* Professional Title Dropdown - Mobile */}
                        <div className="space-y-2 relative" ref={titleDropdownMobileRef}>
                            <label className="text-sm text-white/70">Professional Title</label>
                            <div
                                className="flex h-11 items-center justify-between px-3 bg-transparent rounded-xl border border-white/15 cursor-pointer hover:border-[#7008e7]/60 transition-all duration-300"
                                onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                            >
                                <span className={`text-sm ${formData.professionalTitle ? 'text-white' : 'text-white/50'}`}>
                                    {formData.professionalTitle || 'Select your professional title'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${titleDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {titleDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl shadow-purple-500/20 z-50 max-h-48 overflow-y-auto">
                                    <div className="py-2">
                                        {professionalTitles.map((title) => (
                                            <div
                                                key={title}
                                                className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 ${formData.professionalTitle === title ? 'bg-purple-600/40 text-white' : 'text-white/70 hover:bg-purple-600/20 hover:text-white'}`}
                                                onClick={() => {
                                                    handleInputChange('professionalTitle', title);
                                                    setTitleDropdownOpen(false);
                                                }}
                                            >
                                                {title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Email - hidden for social auth */}
                        {!isSocialAuth && (
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl bg-transparent border border-white/15 text-sm focus:outline-none focus:border-[#7008e7]"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        )}

                        <div className="space-y-2 relative" ref={languageDropdownMobileRef}>
                            <label className="text-sm text-white/70">Languages</label>
                            <div
                                className="flex h-11 items-center justify-between px-3 bg-transparent rounded-xl border border-white/15 cursor-pointer hover:border-[#7008e7]/60 transition-all duration-300 group"
                                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                            >
                                <div className="[font-family:'Arimo-Regular',Helvetica] text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300">
                                    {formData.languages.length > 0 ? `${formData.languages.length} language(s) selected` : 'Select languages'}
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
                                                className={`px-4 py-3 text-sm cursor-pointer transition-all duration-200 flex items-center justify-between ${formData.languages.includes(lang)
                                                    ? 'bg-purple-600/40 text-white'
                                                    : 'text-[#B0B8C8] hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 hover:text-white'
                                                    }`}
                                                onClick={() => {
                                                    if (formData.languages.includes(lang)) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            languages: prev.languages.filter(l => l !== lang)
                                                        }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            languages: [...prev.languages, lang]
                                                        }));
                                                    }
                                                }}
                                            >
                                                {lang}
                                                {formData.languages.includes(lang) && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Selected Languages Chips */}
                            {formData.languages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-lg bg-[#7008E7]/30 border border-[#A684FF]/50 text-sm text-white cursor-pointer hover:bg-[#7008E7]/50 transition-all duration-300"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    languages: prev.languages.filter(l => l !== lang)
                                                }));
                                            }}
                                        >
                                            {lang} ×
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Password and Confirm Password - hidden for social auth */}
                        {!isSocialAuth && (
                            <>
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
                            </>
                        )}

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


                    {/* Upload CV - Mobile */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.8973 10.7422L14.1598 17.8472C14.1739 17.9309 14.1622 18.0168 14.1261 18.0936C14.0901 18.1705 14.0315 18.2344 13.9581 18.277C13.8847 18.3196 13.8 18.3388 13.7155 18.3319C13.6309 18.3251 13.5504 18.2926 13.4848 18.2389L10.5015 15.9997C10.3574 15.8921 10.1825 15.834 10.0027 15.834C9.82294 15.834 9.64798 15.8921 9.50396 15.9997L6.51563 18.238C6.45006 18.2917 6.36968 18.3241 6.28521 18.331C6.20073 18.3378 6.11619 18.3187 6.04285 18.2762C5.9695 18.2338 5.91086 18.17 5.87473 18.0933C5.83859 18.0166 5.8267 17.9308 5.84063 17.8472L7.10229 10.7422" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 11.666C12.7614 11.666 15 9.42744 15 6.66602C15 3.90459 12.7614 1.66602 10 1.66602C7.23858 1.66602 5 3.90459 5 6.66602C5 9.42744 7.23858 11.666 10 11.666Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-medium">Upload CV</h2>
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCvChange}
                            className="hidden"
                            id="cv-file-input-mobile"
                        />
                        <label
                            htmlFor="cv-file-input-mobile"
                            className="flex flex-col items-center justify-center px-4 py-6 bg-white/5 rounded-xl border border-white/10 border-dashed cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div className="w-10 h-10 mb-3 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 6V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M34 16L24 6L14 16" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30" stroke="#A684FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-white text-sm font-medium mb-1">
                                {cvFile ? cvFile.name : 'Tap to upload CV'}
                            </p>
                            <p className="text-white/50 text-xs">PDF, DOC, DOCX (max 5MB)</p>
                        </label>
                    </div>

                    {/* Actions */}
                    {/* Error Display */}
                    {error && (
                        <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            className="w-full py-3 bg-[#7008e7] text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Save & Continue'}
                        </button>
                        <button
                            className="w-full py-3 bg-[#0a0a1a] border border-[#fffefe1a] text-[#d0d5db] rounded-xl text-sm font-medium"
                            onClick={() => navigate('/signup')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
