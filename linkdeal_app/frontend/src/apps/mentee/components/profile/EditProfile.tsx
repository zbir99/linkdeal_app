import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleModifyClick = () => {
    navigate('/mentee/profile-modif');
  };
  return (
    <div className="rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md p-6">
      <h2 className="text-2xl text-white font-inter mb-8">Edit Profile</h2>
      
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Full Name</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>John Doe</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Email</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>john.doe@email.com</span>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Location</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>San Francisco, CA</span>
          </div>
        </div>

        {/* Current Role */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Current Role</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white">
            <span>Marketing Specialist</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Bio</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 h-24 text-white">
            <span>Passionate learner looking to transition into web development</span>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Interests</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-gray-300">
            <span>React, TypeScript, UI/UX Design</span>
          </div>
        </div>

        {/* Career Goals */}
        <div>
          <label className="block text-sm text-gray-400 font-arimo mb-2">Career Goals</label>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 h-24 text-white">
            <span>Become a full-stack developer</span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleModifyClick}
          className="w-full rounded-lg bg-[#7008E7] text-white py-3 font-arimo hover:bg-[#5a07b8] transition-all duration-300 shadow-2xl shadow-[#7008E7]/40 hover:shadow-3xl hover:shadow-[#7008E7]/50"
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
