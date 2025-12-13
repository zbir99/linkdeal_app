import { FunctionComponent } from 'react';

interface Experience {
  title: string;
  company: string;
  period: string;
}

const ExperienceSection: FunctionComponent = () => {
  const experiences: Experience[] = [
    {
      title: 'Senior Developer',
      company: 'TechCorp',
      period: '2020 - Present',
    },
    {
      title: 'Lead Developer',
      company: 'StartupXYZ',
      period: '2017 - 2020',
    },
    {
      title: 'Full-Stack Developer',
      company: 'WebAgency',
      period: '2015 - 2017',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 flex-shrink-0">
          <g clipPath="url(#clip0_161_14819)">
            <path d="M13.3327 16.6667V3.33341C13.3327 2.89139 13.1571 2.46746 12.8445 2.1549C12.532 1.84234 12.108 1.66675 11.666 1.66675H8.33268C7.89065 1.66675 7.46673 1.84234 7.15417 2.1549C6.84161 2.46746 6.66602 2.89139 6.66602 3.33341V16.6667" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.666 5H3.33268C2.41221 5 1.66602 5.74619 1.66602 6.66667V15C1.66602 15.9205 2.41221 16.6667 3.33268 16.6667H16.666C17.5865 16.6667 18.3327 15.9205 18.3327 15V6.66667C18.3327 5.74619 17.5865 5 16.666 5Z" stroke="#A684FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_161_14819">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Professional Experience</h3>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="border-l-2 border-purple-500/30 pl-4 sm:pl-6 relative transition-all duration-300 hover:border-purple-500/50"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-purple-500 transition-all duration-300 hover:scale-150"></div>
            
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base text-white font-medium">{exp.title}</h4>
              <p className="text-purple-300 text-xs sm:text-sm">{exp.company}</p>
              <p className="text-white/50 text-xs sm:text-sm">{exp.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
