import { FunctionComponent } from 'react';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

const EducationSection: FunctionComponent = () => {
  const education: Education[] = [
    {
      degree: "Master's in Computer Science",
      institution: 'École Polytechnique',
      year: '2015',
    },
    {
      degree: "Bachelor's in Computer Science",
      institution: 'Université Paris-Saclay',
      year: '2013',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5 flex-shrink-0">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Education</h3>
      </div>

      {/* Education List */}
      <div className="space-y-3">
        {education.map((edu, index) => (
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
            <h4 className="text-sm sm:text-base text-white font-medium">{edu.degree}</h4>
            <p className="text-white/60 text-xs sm:text-sm">
              {edu.institution} • {edu.year}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
