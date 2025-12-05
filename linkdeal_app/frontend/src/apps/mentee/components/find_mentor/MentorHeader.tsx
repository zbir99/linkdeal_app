import { FunctionComponent } from 'react';

interface MentorHeaderProps {
  onBack: () => void;
}

const MentorHeader: FunctionComponent<MentorHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-fit rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
      >
        ← Back to Dashboard
      </button>

      {/* Title Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl text-white font-inter leading-tight">
          Find Your Mentor
        </h1>
        <p className="text-base text-gray-400 font-arimo">
          Browse our network of experienced professionals
        </p>
      </div>
    </div>
  );
};

export default MentorHeader;
