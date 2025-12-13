import { FunctionComponent } from 'react';

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: FunctionComponent<SkillsSectionProps> = ({ skills }) => {
  return (
    <div className="w-[574.4px] h-[90.2px] flex flex-col items-start gap-3">
      <div className="self-stretch h-[27px] relative">
        <div className="text-white text-[27px] font-inter leading-[27px]">Skills</div>
      </div>
      <div className="self-stretch h-[51.2px] relative text-[12px] font-arimo">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-2 rounded-lg bg-[#7008E7]/20 border border-[#7008E7]/40 text-white font-arimo transition-all duration-300 hover:bg-[#7008E7]/30 hover:border-[#7008E7]/60 hover:scale-105 hover:shadow-lg hover:shadow-[#7008E7]/20 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
