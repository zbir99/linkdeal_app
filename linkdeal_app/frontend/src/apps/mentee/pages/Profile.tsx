import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileInfo, EditProfile } from '../components/profile';

const Profile: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/mentee/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects - Desktop */}
      <div className="hidden md:block">
        <div className="fixed top-[-110px] left-[-24px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(233,212,255,0.2)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="fixed top-[985px] left-[25px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
        <div className="fixed top-[280px] left-[259px] [filter:blur(128px)] rounded-full w-96 h-96 bg-gradient-to-br from-[rgba(128,51,208,0.4)] to-[rgba(10,32,59,0.4)] pointer-events-none z-0" />
      </div>

      {/* Background Blur Effects - Mobile */}
      <div className="md:hidden">
        <div className="absolute top-[-60px] left-[-80px] [filter:blur(96px)] rounded-full w-72 h-72 bg-gradient-to-br from-[rgba(233,212,255,0.25)] to-[rgba(190,219,255,0.2)] pointer-events-none z-0" />
        <div className="absolute bottom-[120px] right-[-40px] [filter:blur(96px)] rounded-full w-64 h-64 bg-gradient-to-br from-[rgba(128,51,208,0.35)] to-[rgba(10,32,59,0.35)] pointer-events-none z-0" />
      </div>
      
      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <button 
              onClick={handleBackToDashboard}
              className="w-fit rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 backdrop-blur-md px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl text-white font-inter">My Profile</h1>
              <p className="text-base text-gray-400">Manage your personal information and preferences</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24">
            <div className="lg:col-span-1">
              <ProfileInfo />
            </div>
            <div className="lg:col-span-2">
              <EditProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;