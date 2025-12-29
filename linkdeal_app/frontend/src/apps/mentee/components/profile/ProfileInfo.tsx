import { FunctionComponent, useEffect, useState } from 'react';
import api from '@/services/api';

interface MenteeProfileData {
  full_name: string;
  email: string;
  profile_picture: string | null;
  social_picture_url: string | null;
  country: string;
  field_of_study: string;
  languages: string[] | string;
  current_role: string | null;
  skills: string[];
  user_type: string;
  session_frequency: string;
}

const ProfileInfo: FunctionComponent = () => {
  const [profile, setProfile] = useState<MenteeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/mentee/profile/me/');
        setProfile(response.data);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get profile picture URL (prefer uploaded, fallback to social)
  const getProfilePicture = () => {
    if (profile?.profile_picture) return profile.profile_picture;
    if (profile?.social_picture_url) return profile.social_picture_url;
    return null;
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#7008E7]/30 animate-pulse mb-4" />
            <div className="h-8 w-32 mx-auto bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 mx-auto bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
          <div className="text-center text-red-400">
            {error || 'Profile not found'}
          </div>
        </div>
      </div>
    );
  }

  const profilePic = getProfilePicture();

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="text-center">
          {/* Avatar */}
          {profilePic && !imageLoadError ? (
            <img
              src={profilePic}
              alt={profile.full_name}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-[#7008E7]"
              onError={() => {
                console.warn('Profile picture failed to load:', profilePic);
                setImageLoadError(true);
              }}
            />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-[#7008E7] flex items-center justify-center mb-4">
              <span className="text-3xl text-white font-inter">
                {getInitials(profile.full_name)}
              </span>
            </div>
          )}

          {/* Name */}
          <h2 className="text-2xl text-white font-inter mb-2">{profile.full_name}</h2>

          {/* Role */}
          <p className="text-sm text-gray-400 font-arimo mb-4">
            {profile.current_role}
          </p>

          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#7008E7]/20">
            <span className="text-xs text-[#A684FF] font-arimo">Mentee</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#A684FF" strokeWidth="2" />
              <path d="M22 6l-10 7L2 6" stroke="#A684FF" strokeWidth="2" />
            </svg>
            <span className="text-sm">{profile.email}</span>
          </div>

          {profile.country && (
            <div className="flex items-center gap-3 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#A684FF" strokeWidth="2" />
                <circle cx="12" cy="10" r="3" stroke="#A684FF" strokeWidth="2" />
              </svg>
              <span className="text-sm">{profile.country}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_161_8802)">
                <path d="M10.6673 13.333V2.66634C10.6673 2.31272 10.5268 1.97358 10.2768 1.72353C10.0267 1.47348 9.68761 1.33301 9.33398 1.33301H6.66732C6.3137 1.33301 5.97456 1.47348 5.72451 1.72353C5.47446 1.97358 5.33398 2.31272 5.33398 2.66634V13.333" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.334 4H2.66732C1.93094 4 1.33398 4.59695 1.33398 5.33333V12C1.33398 12.7364 1.93094 13.3333 2.66732 13.3333H13.334C14.0704 13.3333 14.6673 12.7364 14.6673 12V5.33333C14.6673 4.59695 14.0704 4 13.334 4Z" stroke="#A684FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_161_8802">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-sm">{profile.current_role || profile.field_of_study || 'Marketing Specialist'}</span>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5.83301V17.4997" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.49935 15C2.27834 15 2.06637 14.9122 1.91009 14.7559C1.75381 14.5996 1.66602 14.3877 1.66602 14.1667V3.33333C1.66602 3.11232 1.75381 2.90036 1.91009 2.74408C2.06637 2.5878 2.27834 2.5 2.49935 2.5H6.66602C7.55007 2.5 8.39792 2.85119 9.02304 3.47631C9.64816 4.10143 9.99935 4.94928 9.99935 5.83333C9.99935 4.94928 10.3505 4.10143 10.9757 3.47631C11.6008 2.85119 12.4486 2.5 13.3327 2.5H17.4993C17.7204 2.5 17.9323 2.5878 18.0886 2.74408C18.2449 2.90036 18.3327 3.11232 18.3327 3.33333V14.1667C18.3327 14.3877 18.2449 14.5996 18.0886 14.7559C17.9323 14.9122 17.7204 15 17.4993 15H12.4993C11.8363 15 11.2004 15.2634 10.7316 15.7322C10.2627 16.2011 9.99935 16.837 9.99935 17.5C9.99935 16.837 9.73596 16.2011 9.26712 15.7322C8.79828 15.2634 8.16239 15 7.49935 15H2.49935Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-lg text-white font-inter">Skills</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs text-gray-300 hover:bg-white/15 hover:border-white/30 hover:text-white hover:shadow-lg hover:shadow-[#A684FF]/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                {skill}
              </span>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7008E7]/20 to-[#A684FF]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
              <span className="text-gray-500 text-sm">No skills added yet</span>
              <span className="text-gray-600 text-xs">Add skills from your profile settings</span>
            </div>
          )}
        </div>
      </div>

      {/* Languages Card */}
      <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3337C14.6024 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6024 1.66699 10 1.66699C5.39765 1.66699 1.66669 5.39795 1.66669 10.0003C1.66669 14.6027 5.39765 18.3337 10 18.3337Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.66669 10H18.3334" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 1.66699C12.0844 3.94879 13.269 6.91039 13.3334 10.0003C13.269 13.0903 12.0844 16.0519 10 18.3337C7.91562 16.0519 6.73106 13.0903 6.66669 10.0003C6.73106 6.91039 7.91562 3.94879 10 1.66699Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-lg text-white font-inter">Languages</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.isArray(profile.languages) && profile.languages.length > 0 ? (
            profile.languages.map((language, index) => (
              <span key={index} className="px-3 py-1 rounded-lg bg-[#7008E7] border border-[#A684FF] text-xs text-white hover:bg-[#7008E7]/80 hover:scale-105 transition-all duration-300 cursor-pointer">
                {language}
              </span>
            ))
          ) : typeof profile.languages === 'string' && profile.languages.length > 0 ? (
            <span className="px-3 py-1 rounded-lg bg-[#7008E7] border border-[#A684FF] text-xs text-white hover:bg-[#7008E7]/80 hover:scale-105 transition-all duration-300 cursor-pointer">
              {profile.languages}
            </span>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7008E7]/20 to-[#A684FF]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
              <span className="text-gray-500 text-sm">No languages added yet</span>
              <span className="text-gray-600 text-xs">Add languages from your profile settings</span>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default ProfileInfo;
