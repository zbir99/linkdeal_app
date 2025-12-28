import { FunctionComponent } from 'react';

interface BiographySectionProps {
  bio: string;
}

const BiographySection: FunctionComponent<BiographySectionProps> = ({ bio }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">Biography</h3>
      </div>

      <p className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-line">
        {bio || "No biography provided."}
      </p>
    </div>
  );
};

export default BiographySection;
