import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/landing_page/images/logo_light_mode.png';

const QuickActions: FunctionComponent = () => {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'ai-chat':
        navigate('/mentee/ai-chat');
        break;
      case 'find-mentor':
        navigate('/mentee/find-mentor');
        break;

      default:
        break;
    }
  };
  const actions = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6899 3.75161C14.7471 3.44575 14.9094 3.1695 15.1487 2.9707C15.3881 2.77191 15.6894 2.66309 16.0006 2.66309C16.3117 2.66309 16.6131 2.77191 16.8525 2.9707C17.0918 3.1695 17.2541 3.44575 17.3113 3.75161L18.7126 11.1623C18.8121 11.6891 19.0682 12.1738 19.4473 12.5529C19.8264 12.932 20.3111 13.1881 20.8379 13.2876L28.2486 14.6889C28.5545 14.7461 28.8307 14.9084 29.0295 15.1477C29.2283 15.3871 29.3371 15.6885 29.3371 15.9996C29.3371 16.3108 29.2283 16.6121 29.0295 16.8515C28.8307 17.0908 28.5545 17.2531 28.2486 17.3103L20.8379 18.7116C20.3111 18.8111 19.8264 19.0672 19.4473 19.4463C19.0682 19.8255 18.8121 20.3101 18.7126 20.8369L17.3113 28.2476C17.2541 28.5535 17.0918 28.8297 16.8525 29.0285C16.6131 29.2273 16.3117 29.3361 16.0006 29.3361C15.6894 29.3361 15.3881 29.2273 15.1487 29.0285C14.9094 28.8297 14.7471 28.5535 14.6899 28.2476L13.2886 20.8369C13.1891 20.3101 12.933 19.8255 12.5539 19.4463C12.1747 19.0672 11.6901 18.8111 11.1633 18.7116L3.75259 17.3103C3.44673 17.2531 3.17048 17.0908 2.97168 16.8515C2.77288 16.6121 2.66406 16.3108 2.66406 15.9996C2.66406 15.6885 2.77288 15.3871 2.97168 15.1477C3.17048 14.9084 3.44673 14.7461 3.75259 14.6889L11.1633 13.2876C11.6901 13.1881 12.1747 12.932 12.5539 12.5529C12.933 12.1738 13.1891 11.6891 13.2886 11.1623L14.6899 3.75161Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26.666 2.66699V8.00033" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29.3333 5.33301H24" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.33268 29.3333C6.80544 29.3333 7.99935 28.1394 7.99935 26.6667C7.99935 25.1939 6.80544 24 5.33268 24C3.85992 24 2.66602 25.1939 2.66602 26.6667C2.66602 28.1394 3.85992 29.3333 5.33268 29.3333Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'find-mentor',
      title: 'Find Mentor',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.3327 28V25.3333C21.3327 23.9188 20.7708 22.5623 19.7706 21.5621C18.7704 20.5619 17.4138 20 15.9993 20H7.99935C6.58486 20 5.22831 20.5619 4.22811 21.5621C3.22792 22.5623 2.66602 23.9188 2.66602 25.3333V28" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.334 4.1709C22.4777 4.46739 23.4905 5.13525 24.2136 6.06965C24.9366 7.00405 25.3289 8.15208 25.3289 9.33357C25.3289 10.515 24.9366 11.6631 24.2136 12.5975C23.4905 13.5319 22.4777 14.1997 21.334 14.4962" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29.334 28.0005V25.3338C29.3331 24.1521 28.9398 23.0042 28.2158 22.0702C27.4918 21.1363 26.4782 20.4693 25.334 20.1738" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.9993 14.6667C14.9449 14.6667 17.3327 12.2789 17.3327 9.33333C17.3327 6.38781 14.9449 4 11.9993 4C9.05383 4 6.66602 6.38781 6.66602 9.33333C6.66602 12.2789 9.05383 14.6667 11.9993 14.6667Z" stroke="#A684FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },

  ];

  return (
    <div className="flex fixed left-0 top-0 h-screen w-20 bg-white/5 backdrop-blur-md border-r border-white/10 flex-col items-center py-6 gap-6 z-50 md:flex">
      {/* Logo */}
      <div className="mb-2">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 object-contain cursor-pointer hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
          onClick={() => navigate('/mentee/dashboard')}
        />
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-white/20" />

      {actions.map((action) => (
        <div
          key={action.id}
          className="relative"
          onMouseEnter={() => setHoveredAction(action.id)}
          onMouseLeave={() => setHoveredAction(null)}
        >
          <button
            onClick={() => handleActionClick(action.id)}
            className="group w-14 h-14 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <div className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-purple-300 transition-colors">
              {action.icon}
            </div>
          </button>

          {/* Tooltip */}
          {hoveredAction === action.id && (
            <div className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#1a1a2e] border border-white/20 rounded-lg whitespace-nowrap shadow-xl z-50">
              <span className="text-sm text-white font-arimo">{action.title}</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-[#1a1a2e]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
