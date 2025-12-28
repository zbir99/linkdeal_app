import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth';
import api from '@/services/api';


interface MentorProfile {
  full_name?: string;
  profile_picture?: string;
  social_picture_url?: string;
}

const WelcomeHeader: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<MentorProfile | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching mentor profile...');
        if (!api) {
          console.error('API service is not defined!');
          return;
        }
        const response = await api.get('auth/mentors/profile/me/');
        console.log('Mentor profile fetched:', response.data);
        setProfileData(response.data);

        // Logic for profile picture display:
        // 1. Uploaded picture (profile_picture)
        // 2. Social auth picture (social_picture_url)
        // 3. Fallback to initials (handled in render)
        if (response.data.profile_picture) {
          const picUrl = response.data.profile_picture.startsWith('http')
            ? response.data.profile_picture
            : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${response.data.profile_picture}`;
          setProfilePictureUrl(picUrl);
        } else if (response.data.social_picture_url) {
          setProfilePictureUrl(response.data.social_picture_url);
        }
      } catch (error) {
        console.error('Failed to fetch mentor profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleNotificationsClick = () => {
    navigate('/mentor/notifications');
  };

  const handleProfileClick = () => {
    navigate('/mentor/profile');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isMobileMenuClick = mobileMenuRef.current && mobileMenuRef.current.contains(event.target as Node);
      const isDesktopMenuClick = desktopMenuRef.current && desktopMenuRef.current.contains(event.target as Node);

      if (!isMobileMenuClick && !isDesktopMenuClick) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profileData?.full_name || 'Mentor';

  const initials = profileData?.full_name
    ? profileData.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'HM';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Mobile: Icons at top */}
      <div className="flex items-center justify-end gap-3 md:hidden">
        <button
          onClick={handleNotificationsClick}
          className="relative hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_433_515_mobile" fill="white">
              <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" />
            </mask>
            <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" fill="#0A0A1A" />
            <path d="M10 0V0.8H26V0V-0.8H10V0ZM36 10H35.2V26H36H36.8V10H36ZM26 36V35.2H10V36V36.8H26V36ZM0 26H0.8V10H0H-0.8V26H0ZM10 36V35.2C4.91898 35.2 0.8 31.081 0.8 26H0H-0.8C-0.8 31.9647 4.03533 36.8 10 36.8V36ZM36 26H35.2C35.2 31.081 31.081 35.2 26 35.2V36V36.8C31.9647 36.8 36.8 31.9647 36.8 26H36ZM26 0V0.8C31.081 0.8 35.2 4.91898 35.2 10H36H36.8C36.8 4.03533 31.9647 -0.8 26 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03533 -0.8 10H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="white" fillOpacity="0.1" mask="url(#path-1-inside-1_433_515_mobile)" />
            <path d="M16.5566 25.5C16.7029 25.7533 16.9133 25.9637 17.1667 26.11C17.42 26.2563 17.7074 26.3333 18 26.3333C18.2925 26.3333 18.5799 26.2563 18.8333 26.11C19.0866 25.9637 19.297 25.7533 19.4433 25.5" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.7182 20.771C10.6093 20.8903 10.5375 21.0387 10.5114 21.1981C10.4853 21.3575 10.5061 21.5211 10.5713 21.6688C10.6365 21.8166 10.7432 21.9423 10.8784 22.0306C11.0137 22.1188 11.1717 22.1659 11.3332 22.166H24.6665C24.828 22.1661 24.9861 22.1192 25.1214 22.0311C25.2568 21.943 25.3636 21.8175 25.429 21.6698C25.4943 21.5221 25.5153 21.3586 25.4894 21.1992C25.4635 21.0398 25.3919 20.8913 25.2832 20.7718C24.1749 19.6293 22.9999 18.4152 22.9999 14.666C22.9999 13.3399 22.4731 12.0682 21.5354 11.1305C20.5977 10.1928 19.326 9.66602 17.9999 9.66602C16.6738 9.66602 15.402 10.1928 14.4643 11.1305C13.5267 12.0682 12.9999 13.3399 12.9999 14.666C12.9999 18.4152 11.824 19.6293 10.7182 20.771Z" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.2002 8.80078C23.2002 6.59164 24.9911 4.80078 27.2002 4.80078C29.4093 4.80078 31.2002 6.59164 31.2002 8.80078C31.2002 11.0099 29.4093 12.8008 27.2002 12.8008C24.9911 12.8008 23.2002 11.0099 23.2002 8.80078Z" fill="#8E51FF" />
          </svg>
        </button>


        <div className="relative" ref={mobileMenuRef}>
          <button
            onClick={toggleMenu}
            className="h-10 w-10 rounded-full bg-[#7008E7] flex items-center justify-center text-xs font-semibold tracking-wide text-white focus:outline-none focus:ring-2 focus:ring-white/30 overflow-hidden"
          >
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-[#fffefe1a] bg-[#ffffff0d] backdrop-blur shadow-[0_20px_40px_rgba(10,10,26,0.45)] overflow-hidden z-20">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left text-xs text-white/80 hover:bg-[#ffffff1a] hover:text-white transition-colors duration-200"
              >
                Profile
              </button>

              <div className="h-px bg-white/10" />
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2.5 text-left text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-2 md:order-first">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
          Welcome, {displayName} 👋
        </h1>
        <p className="text-white/70 text-sm md:text-base lg:text-lg font-arimo">
          Here&apos;s an overview of your mentorship activity
        </p>
      </div>

      {/* Desktop: Icons on right */}
      <div className="hidden md:flex items-center justify-end gap-3 md:gap-4">
        <button
          onClick={handleNotificationsClick}
          className="relative hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-9 md:h-9">
            <mask id="path-1-inside-1_433_515_desktop" fill="white">
              <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" />
            </mask>
            <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" fill="#0A0A1A" />
            <path d="M10 0V0.8H26V0V-0.8H10V0ZM36 10H35.2V26H36H36.8V10H36ZM26 36V35.2H10V36V36.8H26V36ZM0 26H0.8V10H0H-0.8V26H0ZM10 36V35.2C4.91898 35.2 0.8 31.081 0.8 26H0H-0.8C-0.8 31.9647 4.03533 36.8 10 36.8V36ZM36 26H35.2C35.2 31.081 31.081 35.2 26 35.2V36V36.8C31.9647 36.8 36.8 31.9647 36.8 26H36ZM26 0V0.8C31.081 0.8 35.2 4.91898 35.2 10H36H36.8C36.8 4.03533 31.9647 -0.8 26 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03533 -0.8 10H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="white" fillOpacity="0.1" mask="url(#path-1-inside-1_433_515_desktop)" />
            <path d="M16.5566 25.5C16.7029 25.7533 16.9133 25.9637 17.1667 26.11C17.42 26.2563 17.7074 26.3333 18 26.3333C18.2925 26.3333 18.5799 26.2563 18.8333 26.11C19.0866 25.9637 19.297 25.7533 19.4433 25.5" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.7182 20.771C10.6093 20.8903 10.5375 21.0387 10.5114 21.1981C10.4853 21.3575 10.5061 21.5211 10.5713 21.6688C10.6365 21.8166 10.7432 21.9423 10.8784 22.0306C11.0137 22.1188 11.1717 22.1659 11.3332 22.166H24.6665C24.828 22.1661 24.9861 22.1192 25.1214 22.0311C25.2568 21.943 25.3636 21.8175 25.429 21.6698C25.4943 21.5221 25.5153 21.3586 25.4894 21.1992C25.4635 21.0398 25.3919 20.8913 25.2832 20.7718C24.1749 19.6293 22.9999 18.4152 22.9999 14.666C22.9999 13.3409 22.4731 12.0691 21.5354 11.1305C20.5977 10.1928 19.326 9.66602 17.9999 9.66602C16.6738 9.66602 15.402 10.1938 14.4643 11.1305C13.5267 12.0691 12.9999 13.3409 12.9999 14.666C12.9999 18.4152 11.824 19.6293 10.7182 20.771Z" stroke="#D1D5DC" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.2002 8.80078C23.2002 6.59164 24.9911 4.80078 27.2002 4.80078C29.4093 4.80078 31.2002 6.59164 31.2002 8.80078C31.2002 11.0099 29.4093 12.8008 27.2002 12.8008C24.9911 12.8008 23.2002 11.0099 23.2002 8.80078Z" fill="#8E51FF" />
          </svg>
        </button>


        <div className="relative" ref={desktopMenuRef}>
          <button
            onClick={toggleMenu}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#7008E7] flex items-center justify-center text-xs md:text-sm font-semibold tracking-wide text-white focus:outline-none focus:ring-2 focus:ring-white/30 overflow-hidden"
          >
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 md:mt-3 w-36 md:w-40 rounded-2xl border border-[#fffefe1a] bg-[#ffffff0d] backdrop-blur shadow-[0_20px_40px_rgba(10,10,26,0.45)] overflow-hidden z-20">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 text-left text-xs md:text-sm text-white/80 hover:bg-[#ffffff1a] hover:text-white transition-colors duration-200"
              >
                Profile
              </button>

              <div className="h-px bg-white/10" />
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 text-left text-xs md:text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
