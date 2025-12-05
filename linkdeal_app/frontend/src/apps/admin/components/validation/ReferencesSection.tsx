import { FunctionComponent } from 'react';

interface Reference {
  name: string;
  initials: string;
  position: string;
  company: string;
  quote: string;
}

const ReferencesSection: FunctionComponent = () => {
  const references: Reference[] = [
    {
      name: 'Sophie Martin',
      initials: 'SM',
      position: 'CTO',
      company: 'TechCorp',
      quote: 'Excellent mentor and developer',
    },
    {
      name: 'Pierre Durand',
      initials: 'PD',
      position: 'CEO',
      company: 'StartupXYZ',
      quote: 'Outstanding technical expertise',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 flex-shrink-0">
          <path d="M13.3327 17.5V15.8333C13.3327 14.9493 12.9815 14.1014 12.3564 13.4763C11.7313 12.8512 10.8834 12.5 9.99935 12.5H4.99935C4.11529 12.5 3.26745 12.8512 2.64233 13.4763C2.01721 14.1014 1.66602 14.9493 1.66602 15.8333V17.5" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.334 2.60669C14.0488 2.792 14.6818 3.20941 15.1337 3.79341C15.5856 4.37741 15.8308 5.09493 15.8308 5.83336C15.8308 6.57178 15.5856 7.28931 15.1337 7.8733C14.6818 8.4573 14.0488 8.87471 13.334 9.06002" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.334 17.5001V15.8334C18.3334 15.0948 18.0876 14.3774 17.6351 13.7937C17.1826 13.2099 16.5491 12.793 15.834 12.6084" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.49935 9.16667C9.3403 9.16667 10.8327 7.67428 10.8327 5.83333C10.8327 3.99238 9.3403 2.5 7.49935 2.5C5.6584 2.5 4.16602 3.99238 4.16602 5.83333C4.16602 7.67428 5.6584 9.16667 7.49935 9.16667Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-white">References</h3>
      </div>

      {/* References List */}
      <div className="space-y-3 sm:space-y-4">
        {references.map((ref, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 transition-all duration-300 ease-out cursor-pointer"
            style={{
              boxShadow: '0 0 0 0 rgba(166, 132, 255, 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(166, 132, 255, 0.15), 0 4px 10px rgba(166, 132, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(166, 132, 255, 0)';
            }}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#7008E7"/>
                  <text x="20" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">{ref.initials}</text>
                </svg>
              </div>
              
              {/* Reference Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm sm:text-base text-white font-medium truncate">{ref.name}</h4>
                <p className="text-purple-300 text-xs sm:text-sm truncate">
                  {ref.position} at {ref.company}
                </p>
                <p className="text-white/60 text-xs sm:text-sm italic line-clamp-2">"{ref.quote}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencesSection;
