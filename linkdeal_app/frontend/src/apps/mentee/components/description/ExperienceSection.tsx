import { FunctionComponent } from 'react';

interface Experience {
  title: string;
  company: string;
  period: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: FunctionComponent<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <div className="w-[574.4px] h-[213px] flex flex-col items-start gap-3">
      <div className="self-stretch h-[27px] relative">
        <div className="text-white text-[27px] font-inter leading-[27px]">Experience</div>
      </div>
      <div className="self-stretch h-[174px] flex flex-col items-start gap-3 text-[16px] font-arimo">
        {experiences.map((experience, index) => (
          <div key={index} className="self-stretch h-[81px] rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 backdrop-blur-md flex flex-col items-start pt-4 px-4 pb-0 gap-1">
            <div className="self-stretch h-6 relative">
              <div className="text-white leading-6">{experience.title}</div>
            </div>
            <div className="self-stretch h-[21px] relative text-[14px] text-gray-400">
              <div className="leading-[21px]">{experience.period}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
