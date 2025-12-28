import { FunctionComponent, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface MentorProfileData {
  full_name: string;
  email: string;
  profile_picture: string | null;
  social_picture_url: string | null;
  professional_title: string;
  location: string;
  country: string;
  linkedin_url: string;
  bio: string;
  languages: string[];
  skills: string[];
  cv_url: string | null;
  status: string;
}

const Profile: FunctionComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const titleDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target as Node)) {
        setTitleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/mentors/profile/me/');
        const profile: MentorProfileData = response.data;

        setFullName(profile.full_name || '');
        setEmail(profile.email || '');
        setProfessionalTitle(profile.professional_title || '');
        setLocation(profile.location || profile.country || '');
        setLinkedinUrl(profile.linkedin_url || '');
        setBio(profile.bio || '');
        setLanguages(Array.isArray(profile.languages) ? profile.languages : []);

        // Set avatar from uploaded picture or social picture
        if (profile.profile_picture) {
          // Handle relative URLs
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const pictureUrl = profile.profile_picture.startsWith('http')
            ? profile.profile_picture
            : `${baseUrl}${profile.profile_picture}`;
          setAvatarImage(pictureUrl);
        } else if (profile.social_picture_url) {
          setAvatarImage(profile.social_picture_url);
        }

        // Load skills from API
        if (profile.skills && Array.isArray(profile.skills)) {
          setSkills(profile.skills);
        }

        // Load CV URL
        if (profile.cv_url) {
          setCvUrl(profile.cv_url);
        }
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBack = () => {
    navigate('/mentor/dashboard');
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // If there's any file (profile picture or CV), use FormData
      if (avatarFile || cvFile) {
        const formData = new FormData();
        formData.append('full_name', fullName);
        formData.append('professional_title', professionalTitle);
        formData.append('location', location);
        formData.append('linkedin_url', linkedinUrl);
        formData.append('bio', bio);
        languages.forEach(lang => formData.append('languages', lang));
        skills.forEach(skill => formData.append('skills', skill));
        if (avatarFile) {
          formData.append('profile_picture', avatarFile);
        }
        if (cvFile) {
          formData.append('cv', cvFile);
        }

        await api.patch('auth/mentors/profile/me/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.patch('auth/mentors/profile/me/', {
          full_name: fullName,
          professional_title: professionalTitle,
          location: location,
          linkedin_url: linkedinUrl,
          bio: bio,
          languages: languages,
          skills: skills,
        });
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/mentor/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      const errorData = err.response?.data;
      let errorMessage = 'Failed to save profile';
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUploadClick = () => {
    cvInputRef.current?.click();
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      // Update CV URL for display (will be updated with actual URL after save)
      setCvUrl(URL.createObjectURL(file));
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(lang => lang !== languageToRemove));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects */}
      <div className="hidden md:block">
        <div className="fixed top-[-216px] left-[204.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[497px] left-[145.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[28px] left-[637.6px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <button
              onClick={handleBack}
              className="w-fit rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl text-white font-inter">My Profile</h1>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Photo Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#7008E7] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {avatarImage ? (
                      <img src={avatarImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-white font-inter">{getInitials(fullName)}</span>
                    )}
                  </div>
                  <button
                    onClick={handleUploadClick}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#7008E7] flex items-center justify-center hover:bg-[#5a07b8] transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Upload a professional photo</p>
                  <p className="text-white/50 text-xs">JPG, PNG or GIF (max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6 overflow-visible relative z-20">
              <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 cursor-not-allowed"
                  />
                </div>
                <div className="relative z-50">
                  <label className="block text-white/80 text-sm mb-2">Professional Title</label>
                  <div className="relative" ref={titleDropdownRef}>
                    <div
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/15 transition-all duration-200 flex items-center justify-between"
                      onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                    >
                      <span className={professionalTitle ? 'text-white' : 'text-white/50'}>
                        {professionalTitle || 'Select your professional title'}
                      </span>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${titleDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#C8B0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {titleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl shadow-purple-500/20 z-[100] max-h-56 overflow-y-auto">
                        <div className="py-2">
                          {professionalTitles.map((title) => (
                            <div
                              key={title}
                              className={`px-4 py-3 text-sm cursor-pointer transition-all duration-200 ${professionalTitle === title ? 'bg-purple-600/40 text-white' : 'text-white/70 hover:bg-purple-600/20 hover:text-white'}`}
                              onClick={() => {
                                setProfessionalTitle(title);
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
                <div>
                  <label className="block text-white/80 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Paris, France"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Bio</h2>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 resize-none h-32"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Languages Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Languages</h2>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                  className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  placeholder="Add a language..."
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="rounded-lg bg-[#7008E7] text-white px-6 py-3 hover:bg-[#5a07b8] transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-[#7008E7]/30 border border-[#A684FF]/50 text-sm text-white cursor-pointer hover:bg-[#7008E7]/50 transition-all duration-300"
                    onClick={() => handleRemoveLanguage(lang)}
                  >
                    {lang} ×
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={handleAddSkill}
                  className="rounded-lg bg-[#7008E7] text-white px-6 py-3 hover:bg-[#5a07b8] transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg bg-[#7008E7]/30 border border-[#A684FF]/50 text-sm text-white cursor-pointer hover:bg-[#7008E7]/50 transition-all duration-300"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} ×
                  </span>
                ))}
              </div>
            </div>

            {/* LinkedIn Section */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0077B5]/20 to-[#0077B5]/5 border border-[#0077B5]/30 backdrop-blur-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0077B5] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">LinkedIn Profile</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-[#0077B5]/30 text-white placeholder-white/50 focus:outline-none focus:border-[#0077B5]/70 focus:bg-white/15 transition-all duration-200"
                />
                {linkedinUrl && (
                  <a
                    href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg bg-[#0077B5] text-white font-medium hover:bg-[#005f94] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Profile
                  </a>
                )}
              </div>
            </div>

            {/* CV Section */}
            <div className="rounded-2xl bg-gradient-to-br from-[#7008E7]/20 to-[#7008E7]/5 border border-[#7008E7]/30 backdrop-blur-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#7008E7] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Curriculum Vitae (CV)</h2>
              </div>

              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf"
                onChange={handleCvChange}
                className="hidden"
              />

              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-[#7008E7]/30 text-white/70 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#7008E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">
                    {cvFile ? cvFile.name : (cvUrl ? 'CV uploaded' : 'No CV uploaded')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {cvUrl && (
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg bg-[#7008E7] text-white font-medium hover:bg-[#5a07b8] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCvUploadClick}
                    className="px-6 py-3 rounded-lg bg-white/10 border border-[#7008E7]/50 text-white font-medium hover:bg-[#7008E7]/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {cvUrl ? 'Change CV' : 'Upload CV'}
                  </button>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-3">Accepted format: PDF (max 10MB)</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg bg-[#7008E7] text-white py-4 font-semibold hover:bg-[#5a07b8] transition-all duration-300 shadow-2xl shadow-[#7008E7]/40 hover:shadow-3xl hover:shadow-[#7008E7]/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;