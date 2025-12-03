import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeHeader: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    navigate('/mentee/profile');
  };

  const handleNotificationsClick = () => {
    navigate('/mentee/notifications');
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);
    navigate('/mentee/contact-us');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white leading-tight">
          Welcome, hamza 👋
        </h1>
        <p className="text-base text-gray-400 font-arimo leading-6">
          Ready to make progress today?
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleNotificationsClick}
          className="relative hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_161_8476" fill="white">
              <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z"/>
            </mask>
            <path d="M0 10C0 4.47715 4.47715 0 10 0H26C31.5228 0 36 4.47715 36 10V26C36 31.5228 31.5228 36 26 36H10C4.47715 36 0 31.5228 0 26V10Z" fill="#0A0A1A"/>
            <path d="M10 0V0.8H26V0V-0.8H10V0ZM36 10H35.2V26H36H36.8V10H36ZM26 36V35.2H10V36V36.8H26V36ZM0 26H0.8V10H0H-0.8V26H0ZM10 36V35.2C4.91898 35.2 0.8 31.081 0.8 26H0H-0.8C-0.8 31.9647 4.03533 36.8 10 36.8V36ZM36 26H35.2C35.2 31.081 31.081 35.2 26 35.2V36V36.8C31.9647 36.8 36.8 31.9647 36.8 26H36ZM26 0V0.8C31.081 0.8 35.2 4.91898 35.2 10H36H36.8C36.8 4.03533 31.9647 -0.8 26 -0.8V0ZM10 0V-0.8C4.03533 -0.8 -0.8 4.03533 -0.8 10H0H0.8C0.8 4.91898 4.91898 0.8 10 0.8V0Z" fill="white" fill-opacity="0.1" mask="url(#path-1-inside-1_161_8476)"/>
            <path d="M16.5566 25.5C16.7029 25.7533 16.9133 25.9637 17.1667 26.11C17.42 26.2563 17.7074 26.3333 18 26.3333C18.2925 26.3333 18.5799 26.2563 18.8333 26.11C19.0866 25.9637 19.297 25.7533 19.4433 25.5" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.7177 20.772C10.6089 20.8913 10.537 21.0397 10.5109 21.1991C10.4849 21.3585 10.5057 21.522 10.5708 21.6698C10.636 21.8176 10.7427 21.9433 10.8779 22.0316C11.0132 22.1198 11.1712 22.1669 11.3327 22.167H24.6661C24.8276 22.167 24.9856 22.1202 25.1209 22.0321C25.2563 21.944 25.3631 21.8184 25.4285 21.6708C25.4938 21.5231 25.5148 21.3596 25.4889 21.2001C25.4631 21.0407 25.3914 20.8923 25.2827 20.7728C24.1744 19.6303 22.9994 18.4162 22.9994 14.667C22.9994 13.3409 22.4726 12.0691 21.5349 11.1315C20.5972 10.1938 19.3255 9.66699 17.9994 9.66699C16.6733 9.66699 15.4015 10.1938 14.4639 11.1315C13.5262 12.0691 12.9994 13.3409 12.9994 14.667C12.9994 18.4162 11.8236 19.6303 10.7177 20.772Z" stroke="#D1D5DC" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23.1992 8.7998C23.1992 6.59067 24.9901 4.7998 27.1992 4.7998C29.4084 4.7998 31.1992 6.59067 31.1992 8.7998C31.1992 11.0089 29.4084 12.7998 27.1992 12.7998C24.9901 12.7998 23.1992 11.0089 23.1992 8.7998Z" fill="#8E51FF"/>
          </svg>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="relative hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 22C0 9.84974 9.84974 0 22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22Z" fill="#7008E7"/>
              <path d="M15.8516 28.1318C14.9193 28.1318 14.1771 27.8923 13.625 27.4131C13.0729 26.9287 12.7083 26.2048 12.5312 25.2412L13.9922 24.999C14.0859 25.6032 14.2969 26.0745 14.625 26.4131C14.9531 26.7516 15.3646 26.9209 15.8594 26.9209C16.401 26.9209 16.8281 26.736 17.1406 26.3662C17.4531 25.9912 17.6094 25.4443 17.6094 24.7256V18.1865H15.4922V16.9678H19.0938V24.6943C19.0938 25.762 18.8047 26.6032 18.2266 27.2178C17.6484 27.8271 16.8568 28.1318 15.8516 28.1318ZM31.0703 22.3584C31.0703 23.5199 30.8438 24.5199 30.3906 25.3584C29.9427 26.1969 29.3151 26.8428 28.5078 27.2959C27.7057 27.749 26.7734 27.9756 25.7109 27.9756H21.5938V16.9678H25.2344C27.099 16.9678 28.5365 17.4365 29.5469 18.374C30.5625 19.3063 31.0703 20.6344 31.0703 22.3584ZM29.5703 22.3584C29.5703 20.9938 29.1953 19.9548 28.4453 19.2412C27.7005 18.5225 26.6198 18.1631 25.2031 18.1631H23.0859V26.7803H25.5391C26.3568 26.7803 27.0651 26.6006 27.6641 26.2412C28.2682 25.8818 28.737 25.3714 29.0703 24.71C29.4036 24.0485 29.5703 23.2646 29.5703 22.3584Z" fill="white"/>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-40 rounded-2xl border border-[#fffefe1a] bg-[#ffffff0d] backdrop-blur shadow-[0_20px_40px_rgba(10,10,26,0.45)] overflow-hidden z-20">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-[#ffffff1a] hover:text-white transition-colors duration-200"
              >
                Profile
              </button>
              <div className="h-px bg-white/10" />
              <button
                onClick={handleContactClick}
                className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-[#ffffff1a] hover:text-white transition-colors duration-200"
              >
                Contact Us
              </button>
              <div className="h-px bg-white/10" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200"
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
