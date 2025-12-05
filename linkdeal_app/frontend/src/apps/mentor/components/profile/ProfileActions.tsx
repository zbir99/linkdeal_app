import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileActions: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/mentor/dashboard');
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saving profile changes...');
    navigate('/mentor/dashboard');
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleCancel}
        className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 transform"
      >
        Cancel
      </button>
      
      <button
        onClick={handleSaveChanges}
        className="flex-1 px-6 py-3 rounded-lg bg-[#7008E7] text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 hover:bg-[#8B5CF6] hover:shadow-xl transition-all duration-300 transform"
      >
        Save Changes
      </button>
    </div>
  );
};
