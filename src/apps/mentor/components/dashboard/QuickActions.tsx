import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../assets/landing_page/images/logo_light_mode.png';

const QuickActions: FunctionComponent = () => {
  const navigate = useNavigate();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'availability':
        navigate('/mentor/availability');
        break;
      case 'my-clients':
        navigate('/mentor/my-mentees');
        break;
      case 'pricing':
        navigate('/mentor/pricing');
        break;
      case 'support':
        navigate('/mentor/support-tickets');
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      id: 'availability',
      title: 'Availability',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6665 2.66602V7.99935" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21.3335 2.66602V7.99935" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25.3333 5.33398H6.66667C5.19391 5.33398 4 6.52789 4 8.00065V26.6673C4 28.1401 5.19391 29.334 6.66667 29.334H25.3333C26.8061 29.334 28 28.1401 28 26.6673V8.00065C28 6.52789 26.8061 5.33398 25.3333 5.33398Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 13.334H28" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      )
    },
    {
      id: 'my-clients',
      title: 'My Clients',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.3327 28V25.3333C21.3327 23.9188 20.7708 22.5623 19.7706 21.5621C18.7704 20.5619 17.4138 20 15.9993 20H7.99935C6.58486 20 5.22831 20.5619 4.22811 21.5621C3.22792 22.5623 2.66602 23.9188 2.66602 25.3333V28" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21.334 4.1709C22.4777 4.46739 23.4905 5.13525 24.2136 6.06965C24.9366 7.00405 25.3289 8.15208 25.3289 9.33357C25.3289 10.515 24.9366 11.6631 24.2136 12.5975C23.4905 13.5319 22.4777 14.1997 21.334 14.4962" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M29.334 28.0005V25.3338C29.3331 24.1521 28.9398 23.0042 28.2158 22.0702C27.4918 21.1363 26.4782 20.4693 25.334 20.1738" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.9993 14.6667C14.9449 14.6667 17.3327 12.2789 17.3327 9.33333C17.3327 6.38781 14.9449 4 11.9993 4C9.05383 4 6.66602 6.38781 6.66602 9.33333C6.66602 12.2789 9.05383 14.6667 11.9993 14.6667Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      )
    },
    {
      id: 'pricing',
      title: 'Pricing',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2.66602V29.3327" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22.6667 6.66602H12.6667C11.429 6.66602 10.242 7.15768 9.36684 8.03285C8.49167 8.90802 8 10.095 8 11.3327C8 12.5704 8.49167 13.7573 9.36684 14.6325C10.242 15.5077 11.429 15.9993 12.6667 15.9993H19.3333C20.571 15.9993 21.758 16.491 22.6332 17.3662C23.5083 18.2414 24 19.4283 24 20.666C24 21.9037 23.5083 23.0907 22.6332 23.9658C21.758 24.841 20.571 25.3327 19.3333 25.3327H8" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      )
    },
    {
      id: 'support',
      title: 'Support Tickets',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 22.6667C28 23.374 27.719 24.0522 27.219 24.5523C26.7189 25.0524 26.0406 25.3333 25.3333 25.3333H9.33333L4 30.6667V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H25.3333C26.0406 4 26.7189 4.28095 27.219 4.78105C27.719 5.28115 28 5.95942 28 6.66667V22.6667Z" stroke="#A684FF" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex fixed left-0 top-0 h-screen w-20 bg-white/5 backdrop-blur-md border-r border-white/10 flex-col items-center py-6 gap-6 z-50 md:flex">
      {/* Logo */}
      <div className="mb-2">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 object-contain cursor-pointer hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
          onClick={() => navigate('/mentor/dashboard')}
        />
      </div>

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
