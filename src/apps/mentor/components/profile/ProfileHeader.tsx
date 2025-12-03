import { FunctionComponent } from 'react';

interface ProfileHeaderProps {
  onBackToDashboard: () => void;
}

export const ProfileHeader: FunctionComponent<ProfileHeaderProps> = ({ onBackToDashboard }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBackToDashboard}
        className="mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 transform"
      >
        ← Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-semibold text-white mb-2">Edit Profile</h1>
      <p className="text-white/60">Update your mentor profile information</p>
    </div>
  );
};
