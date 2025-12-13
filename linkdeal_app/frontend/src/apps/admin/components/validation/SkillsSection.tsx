import { FunctionComponent } from 'react';

const SkillsSection: FunctionComponent = () => {
  const skills = [
    'React',
    'Node.js',
    'TypeScript',
    'AWS',
    'MongoDB',
    'GraphQL',
    'Docker',
    'CI/CD',
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Skills & Expertise</h3>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
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
