import { FunctionComponent } from 'react';

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: FunctionComponent<SkillsSectionProps> = ({ skills }) => {
  const displaySkills = skills && skills.length > 0 ? skills : ['No skills listed'];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Skills & Expertise</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {displaySkills.map((skill, index) => (
          <div
            key={index}
            className="rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 ease-out cursor-default border"
            style={{
              backgroundColor: '#7008E733',
              borderColor: '#7008E74D',
              color: '#A684FF',
              boxShadow: '0 0 0 0 rgba(166, 132, 255, 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7008E766';
              e.currentTarget.style.borderColor = '#A684FF';
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(166, 132, 255, 0.3), 0 4px 10px rgba(166, 132, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7008E733';
              e.currentTarget.style.borderColor = '#7008E74D';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(166, 132, 255, 0)';
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
